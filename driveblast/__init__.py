"""DriveBlast: High-speed Google Drive downloader with resume and virus-warning bypass."""

from driveblast.core import download
from driveblast.gdrive import extract_file_id

__version__ = "0.1.0"
__all__ = ["download", "extract_file_id"]
