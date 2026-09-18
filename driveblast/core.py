import os
import sys
from typing import Optional
import requests

from driveblast.gdrive import (
    GoogleDriveError,
    extract_file_id,
    resolve_gdrive_download_stream,
)
from driveblast.ui import (
    console,
    create_progress_bar,
    print_error,
    print_info,
    print_success,
    print_warning,
)

DEFAULT_CHUNK_SIZE = 1024 * 1024  # 1 MB chunk


def detect_resource_type(url_or_id: str) -> str:
    """Detects whether URL refers to a regular file, Google Doc, Spreadsheet, or Presentation."""
    if "docs.google.com/document" in url_or_id:
        return "document"
    if "docs.google.com/spreadsheets" in url_or_id:
        return "spreadsheet"
    if "docs.google.com/presentation" in url_or_id:
        return "presentation"
    return "file"


def download(
    url_or_id: str,
    output: Optional[str] = None,
    resume: bool = True,
    quiet: bool = False,
    chunk_size: int = DEFAULT_CHUNK_SIZE,
) -> str:
    """
    Downloads a file from Google Drive with automatic virus-warning bypass and resume support.

    Args:
        url_or_id: Google Drive file URL or direct file ID.
        output: Target output file path or directory.
        resume: If True, attempts to resume downloading if file already exists.
        quiet: If True, suppresses progress bar and non-error console output.
        chunk_size: Stream buffer size in bytes (default: 1 MB).

    Returns:
        Absolute path to the downloaded file.
    """
    file_id = extract_file_id(url_or_id)
    doc_type = detect_resource_type(url_or_id)
    session = requests.Session()

    # Determine potential output file location
    target_path = None
    existing_size = 0
    destination_dir = "."

    if output:
        if os.path.isdir(output):
            destination_dir = output
        else:
            target_path = output
            if os.path.dirname(target_path):
                os.makedirs(os.path.dirname(target_path), exist_ok=True)
            if resume and os.path.exists(target_path):
                existing_size = os.path.getsize(target_path)

    range_offset = existing_size if (resume and target_path and existing_size > 0) else 0

    if range_offset > 0 and not quiet:
        print_info(f"Found partial file ({existing_size / (1024 * 1024):.2f} MB). Requesting resume...")

    resp, filename_from_header, total_size = resolve_gdrive_download_stream(
        file_id=file_id,
        session=session,
        range_offset=range_offset,
        doc_type=doc_type,
    )

    # Finalize target file path
    if not target_path:
        filename = filename_from_header or f"gdrive_{file_id}"
        target_path = os.path.join(destination_dir, filename)
        if resume and os.path.exists(target_path):
            existing_size = os.path.getsize(target_path)
            # If we didn't send Range earlier because filename wasn't known, check if it's already complete
            if total_size and existing_size == total_size:
                if not quiet:
                    print_success(f"File '{filename}' is already fully downloaded ({total_size / (1024 * 1024):.2f} MB).")
                return os.path.abspath(target_path)

    filename = os.path.basename(target_path)

    # Check status code and resume mode
    if resp.status_code == 206:
        # Partial Content - resuming supported!
        open_mode = "ab"
        completed_bytes = range_offset
        if not quiet:
            print_success(f"Resuming download from byte {range_offset:,}")
    elif resp.status_code == 200:
        if range_offset > 0 and total_size and range_offset == total_size:
            if not quiet:
                print_success(f"File '{filename}' is already fully downloaded.")
            return os.path.abspath(target_path)
        open_mode = "wb"
        completed_bytes = 0
    else:
        raise GoogleDriveError(f"HTTP Error {resp.status_code}: Unable to download file.")

    if not quiet:
        size_str = f"{total_size / (1024 * 1024):.2f} MB" if total_size else "Unknown size"
        print_info(f"Downloading: [bold]{filename}[/bold] ({size_str})")

    # Download streaming loop
    try:
        if quiet:
            with open(target_path, open_mode) as f:
                for chunk in resp.iter_content(chunk_size=chunk_size):
                    if chunk:
                        f.write(chunk)
        else:
            with create_progress_bar() as progress:
                task_id = progress.add_task(
                    "download",
                    filename=filename,
                    total=total_size,
                    completed=completed_bytes,
                )
                with open(target_path, open_mode) as f:
                    for chunk in resp.iter_content(chunk_size=chunk_size):
                        if chunk:
                            f.write(chunk)
                            progress.update(task_id, advance=len(chunk))

        if not quiet:
            final_size = os.path.getsize(target_path) / (1024 * 1024)
            print_success(f"Successfully saved to [bold green]{os.path.abspath(target_path)}[/bold green] ({final_size:.2f} MB)")

    except KeyboardInterrupt:
        if not quiet:
            current_downloaded = os.path.getsize(target_path) if os.path.exists(target_path) else 0
            print_warning(
                f"\nDownload paused at {current_downloaded / (1024 * 1024):.2f} MB. "
                "Run the command again to resume."
            )
        sys.exit(130)

    return os.path.abspath(target_path)
