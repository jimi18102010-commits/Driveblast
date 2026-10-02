import re
import urllib.parse
from typing import Optional, Tuple
import requests
from bs4 import BeautifulSoup, SoupStrainer


class GoogleDriveError(Exception):
    """Raised when Google Drive file cannot be resolved or accessed."""
    pass


DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
)


def extract_file_id(url_or_id: str) -> str:
    """
    Extracts Google Drive or Google Docs file ID from various URL formats or returns raw ID.
    
    Supported formats:
    - https://drive.google.com/file/d/{ID}/view?usp=sharing
    - https://docs.google.com/document/d/{ID}/edit...
    - https://docs.google.com/spreadsheets/d/{ID}/edit...
    - https://docs.google.com/presentation/d/{ID}/edit...
    - https://drive.google.com/open?id={ID}
    - https://drive.google.com/uc?id={ID}
    - https://drive.google.com/uc?export=download&id={ID}
    - https://drive.usercontent.google.com/download?id={ID}&export=download
    - Direct ID (e.g. 1a2B3c4D5e6F7g8H9i0J...)
    """
    url_or_id = url_or_id.strip()

    # Pattern: /file/d/{ID}, /document/d/{ID}, /spreadsheets/d/{ID}, /presentation/d/{ID}
    match = re.search(r"/(?:file|document|spreadsheets|presentation)/d/([a-zA-Z0-9_-]+)", url_or_id)
    if match:
        return match.group(1)

    # Pattern: id={ID} query param
    parsed = urllib.parse.urlparse(url_or_id)
    if parsed.query:
        params = urllib.parse.parse_qs(parsed.query)
        if "id" in params and params["id"]:
            return params["id"][0]

    # If it's just the raw ID
    if re.match(r"^[a-zA-Z0-9_-]{20,}$", url_or_id):
        return url_or_id

    raise ValueError(f"Could not extract a valid Google Drive file ID from: {url_or_id}")


def parse_content_disposition_filename(disposition: Optional[str]) -> Optional[str]:
    """Extracts filename from Content-Disposition header (RFC 5987 / RFC 6266)."""
    if not disposition:
        return None

    # Priority 1: RFC 5987 filename*=UTF-8''filename.ext
    match_utf8 = re.search(r"filename\*=UTF-8''([^;]+)", disposition, re.IGNORECASE)
    if match_utf8:
        return urllib.parse.unquote(match_utf8.group(1).strip('"\''))

    # Priority 2: Standard filename="filename.ext" or filename=filename.ext
    match_std = re.search(r'filename="?([^";]+)"?', disposition, re.IGNORECASE)
    if match_std:
        return match_std.group(1).strip('"\'')

    return None


def resolve_gdrive_download_stream(
    file_id: str,
    session: requests.Session,
    range_offset: int = 0,
    doc_type: str = "file",
    export_format: Optional[str] = None,
) -> Tuple[requests.Response, Optional[str], Optional[int]]:
    """
    Resolves a direct Google Drive or Google Docs download stream, handling:
    - Normal direct downloads
    - Google Docs / Sheets / Slides exports (docx, pdf, xlsx, pptx, etc.)
    - Virus scan warning confirmation screens for large files
    - HTTP Range header for resuming partial downloads
    
    Returns:
        (response, filename, total_file_size)
    """
    headers = {"User-Agent": DEFAULT_USER_AGENT}
    if range_offset > 0:
        headers["Range"] = f"bytes={range_offset}-"

    # Step 1: Initial request based on resource type
    if doc_type == "document":
        fmt = export_format or "docx"
        base_url = f"https://docs.google.com/document/d/{file_id}/export?format={fmt}"
    elif doc_type == "spreadsheet":
        fmt = export_format or "xlsx"
        base_url = f"https://docs.google.com/spreadsheets/d/{file_id}/export?format={fmt}"
    elif doc_type == "presentation":
        fmt = export_format or "pptx"
        base_url = f"https://docs.google.com/presentation/d/{file_id}/export/{fmt}"
    else:
        base_url = f"https://drive.usercontent.google.com/download?id={file_id}&export=download"

    resp = session.get(base_url, headers=headers, stream=True, allow_redirects=True)

    # Check for authentication / permission denial
    resp_url = getattr(resp, "url", "") or ""
    if resp.status_code in (401, 403) or "accounts.google.com" in resp_url:
        raise GoogleDriveError(
            "Access Denied (401/403): The document or file is private.\n"
            "To download, please open Google Drive/Docs -> 'Share' (Поделиться) -> "
            "set to 'Anyone with the link can view' (Доступ: Все, у кого есть ссылка)."
        )

    if resp.status_code == 404:
        raise GoogleDriveError("File or document not found (404). Please verify the link or File ID.")

    # Check if we got the file immediately
    content_disp = resp.headers.get("content-disposition", "")
    content_type = resp.headers.get("content-type", "")

    if "attachment" in content_disp or "text/html" not in content_type:
        filename = parse_content_disposition_filename(content_disp)
        if not filename and doc_type != "file":
            fmt = export_format or ("docx" if doc_type == "document" else "xlsx" if doc_type == "spreadsheet" else "pptx")
            filename = f"google_{doc_type}_{file_id[:8]}.{fmt}"
        total_size = None
        if "content-length" in resp.headers:
            content_len = int(resp.headers["content-length"])
            total_size = content_len + range_offset if range_offset > 0 and resp.status_code == 206 else content_len
        return resp, filename, total_size

    # Step 2: If we received HTML, it might be the virus scan warning confirmation page
    html_content = resp.text
    # Optimization: Use SoupStrainer to only parse the tags we actually care about
    # This prevents BeautifulSoup from building an expensive DOM tree for the entire page,
    # which can be large, significantly improving parsing speed and reducing memory usage.
    strainer = SoupStrainer(["form", "a", "input"])
    soup = BeautifulSoup(html_content, "html.parser", parse_only=strainer)

    # Check for known permission error banners
    if "Google Drive - Access Denied" in html_content or "Permission denied" in html_content:
        raise GoogleDriveError(
            "Access Denied: The file is private or requires authorization.\n"
            "Please ensure link sharing is set to 'Anyone with the link can view'."
        )

    if "Quota exceeded" in html_content or "Too many users have viewed or downloaded" in html_content:
        raise GoogleDriveError(
            "Google Drive quota exceeded for this file. Try again later or use an authenticated account."
        )

    # Look for the download confirmation form (<form id="download-form" ...>)
    download_form = soup.find("form", id="download-form")
    action_url = None
    form_params = {}

    if download_form:
        action_url = download_form.get("action")
        for input_tag in download_form.find_all("input"):
            name = input_tag.get("name")
            value = input_tag.get("value", "")
            if name:
                form_params[name] = value

    if not action_url:
        # Fallback 1: Look for confirmation link: <a id="uc-download-link" ...>
        download_link = soup.find("a", id="uc-download-link")
        if download_link and download_link.get("href"):
            action_url = urllib.parse.urljoin(base_url, download_link["href"])

    if not action_url:
        # Fallback 2: Regex search for confirm token in HTML
        confirm_match = re.search(r'name="confirm"\s+value="([^"]+)"', html_content)
        uuid_match = re.search(r'name="uuid"\s+value="([^"]+)"', html_content)
        if confirm_match:
            confirm_val = confirm_match.group(1)
            uuid_val = uuid_match.group(1) if uuid_match else ""
            action_url = (
                f"https://drive.usercontent.google.com/download?id={file_id}"
                f"&export=download&confirm={confirm_val}"
            )
            if uuid_val:
                action_url += f"&uuid={uuid_val}"

    if not action_url:
        # Fallback 3: check cookies for download_warning token
        confirm_token = None
        for cookie_name, cookie_val in session.cookies.items():
            if cookie_name.startswith("download_warning"):
                confirm_token = cookie_val
                break

        if confirm_token:
            action_url = (
                f"https://drive.usercontent.google.com/download?id={file_id}"
                f"&export=download&confirm={confirm_token}"
            )

    if not action_url:
        # If no form/link was found, but status is not an error, try passing confirm=t
        action_url = f"https://drive.usercontent.google.com/download?id={file_id}&export=download&confirm=t"

    # Make absolute URL if relative
    if action_url.startswith("/"):
        action_url = urllib.parse.urljoin("https://drive.usercontent.google.com", action_url)

    # Step 3: Request the confirmed download stream
    if form_params:
        # Submit the form parameters
        confirmed_resp = session.post(
            action_url,
            data=form_params,
            headers=headers,
            stream=True,
            allow_redirects=True
        )
    else:
        confirmed_resp = session.get(
            action_url,
            headers=headers,
            stream=True,
            allow_redirects=True
        )

    # Validate final response
    final_disp = confirmed_resp.headers.get("content-disposition", "")
    filename = parse_content_disposition_filename(final_disp)
    total_size = None
    if "content-length" in confirmed_resp.headers:
        content_len = int(confirmed_resp.headers["content-length"])
        total_size = content_len + range_offset if range_offset > 0 and confirmed_resp.status_code == 206 else content_len

    return confirmed_resp, filename, total_size
