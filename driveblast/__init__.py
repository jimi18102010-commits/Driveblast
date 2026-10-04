"""DriveBlast: High-speed Google Drive downloader with resume and virus-warning bypass."""

__version__ = "0.1.0"
__all__ = ["download", "extract_file_id"]

def __getattr__(name):
    if name == "download":
        from driveblast.core import download
        return download
    if name == "extract_file_id":
        from driveblast.gdrive import extract_file_id
        return extract_file_id
    raise AttributeError(f"module {__name__!r} has no attribute {name!r}")

def __dir__():
    return __all__
