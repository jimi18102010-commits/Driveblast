import os
import re
from typing import Optional

import requests

from driveblast.gdrive import GoogleDriveError, extract_file_id, resolve_gdrive_download_stream
from driveblast.ui import create_progress_bar, print_info, print_success, print_warning

DEFAULT_CHUNK_SIZE = 1024 * 1024


def detect_resource_type(url_or_id: str) -> str:
    for path, kind in (("document", "document"), ("spreadsheets", "spreadsheet"), ("presentation", "presentation")):
        if f"docs.google.com/{path}" in url_or_id:
            return kind
    return "file"


def safe_download_filename(filename: str) -> str:
    """Reject remote path components on both POSIX and Windows."""
    if (not filename or filename in (".", "..") or any(ord(c) < 32 for c in filename)
            or any(c in filename for c in '/\\:') or filename.endswith((' ', '.'))):
        raise GoogleDriveError("Unsafe filename received from the download server. Use an explicit output filename.")
    # Windows device names are not normal files, even with an extension.
    if filename.split('.')[0].upper() in {'CON', 'PRN', 'AUX', 'NUL', *(f'COM{i}' for i in range(1, 10)), *(f'LPT{i}' for i in range(1, 10))}:
        raise GoogleDriveError("Reserved filename received from the download server.")
    return filename


def download(url_or_id: str, output: Optional[str] = None, resume: bool = True,
             quiet: bool = False, chunk_size: int = DEFAULT_CHUNK_SIZE,
             export_format: Optional[str] = None) -> str:
    """Download or resume a public Google Drive file; always release HTTP resources."""
    if chunk_size <= 0:
        raise ValueError("chunk_size must be positive")
    file_id = extract_file_id(url_or_id)
    doc_type = detect_resource_type(url_or_id)
    target_path = None
    destination_dir = "."
    existing_size = 0
    if output:
        if os.path.isdir(output):
            destination_dir = output
        else:
            target_path = output
            if os.path.dirname(output):
                os.makedirs(os.path.dirname(output), exist_ok=True)
            if resume and os.path.isfile(output):
                existing_size = os.path.getsize(output)
    range_offset = existing_size if resume and target_path else 0
    resp = None
    session = requests.Session()
    try:
        resp, remote_name, total_size = resolve_gdrive_download_stream(
            file_id, session, range_offset=range_offset, doc_type=doc_type, export_format=export_format)
        if target_path is None:
            filename = safe_download_filename(remote_name or f"gdrive_{file_id}")
            target_path = os.path.join(destination_dir, filename)
            # Do not follow a pre-existing symlink supplied as a remote-derived name.
            if os.path.islink(target_path):
                raise GoogleDriveError("Refusing to write through a symlink at the download destination.")
            if resume and os.path.isfile(target_path):
                existing_size = os.path.getsize(target_path)
                if total_size is not None and existing_size == total_size:
                    return os.path.abspath(target_path)
                if existing_size > 0:
                    resp.close()
                    resp = None
                    range_offset = existing_size
                    resp, _, total_size = resolve_gdrive_download_stream(
                        file_id, session, range_offset=range_offset, doc_type=doc_type, export_format=export_format)
        filename = os.path.basename(target_path)
        if resp.status_code == 206:
            content_range = resp.headers.get("content-range", "")
            match = re.fullmatch(r"bytes (\d+)-(\d+)/(\d+|\*)", content_range)
            if (not match or int(match[1]) != range_offset or int(match[2]) < int(match[1])
                    or (match[3] != '*' and int(match[2]) >= int(match[3]))):
                raise GoogleDriveError("Invalid Content-Range: refusing to append mismatched data.")
            if match[3] != '*':
                range_total = int(match[3])
                if total_size is not None and total_size != range_total:
                    raise GoogleDriveError("Content-Length and Content-Range disagree.")
                total_size = range_total
            mode = "ab" if range_offset else "wb"
            completed = range_offset
        elif resp.status_code == 200:
            mode, completed = "wb", 0  # The server ignored Range: safely restart.
        elif resp.status_code == 416:
            match = re.fullmatch(r"bytes \*/(\d+)", resp.headers.get("content-range", ""))
            if resume and match and int(match[1]) == existing_size:
                return os.path.abspath(target_path)
            raise GoogleDriveError("Range not satisfiable; local file size differs from the remote file.")
        else:
            raise GoogleDriveError(f"HTTP Error {resp.status_code}: Unable to download file.")
        if not quiet:
            size = f"{total_size / (1024 * 1024):.2f} MB" if total_size is not None else "Unknown size"
            print_info(f"Downloading: {filename} ({size})")
        try:
            if quiet:
                with open(target_path, mode) as handle:
                    for chunk in resp.iter_content(chunk_size=chunk_size):
                        if chunk:
                            handle.write(chunk)
            else:
                with create_progress_bar() as progress, open(target_path, mode) as handle:
                    task = progress.add_task("download", filename=filename, total=total_size, completed=completed)
                    for chunk in resp.iter_content(chunk_size=chunk_size):
                        if chunk:
                            handle.write(chunk)
                            progress.update(task, advance=len(chunk))
        except KeyboardInterrupt:
            if not quiet:
                print_warning("Download paused. Run the command again to resume.")
            raise SystemExit(130)
        if total_size is not None and os.path.getsize(target_path) != total_size:
            raise GoogleDriveError("Incomplete download. Run the command again to resume.")
        if not quiet:
            print_success(f"Successfully saved to {os.path.abspath(target_path)}")
        return os.path.abspath(target_path)
    finally:
        if resp is not None:
            resp.close()
        session.close()
