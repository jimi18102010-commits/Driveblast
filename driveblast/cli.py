import argparse
import sys
from driveblast import __version__
from driveblast.core import download
from driveblast.ui import print_banner, print_error


def main():
    parser = argparse.ArgumentParser(
        prog="driveblast",
        description="⚡ DriveBlast: High-speed Google Drive downloader with resume and virus-warning bypass",
    )
    parser.add_argument(
        "url_or_id",
        type=str,
        help="Google Drive file URL or direct file ID",
    )
    parser.add_argument(
        "-o",
        "--output",
        type=str,
        default=None,
        help="Destination path or directory to save the file",
    )
    parser.add_argument(
        "--no-resume",
        action="store_true",
        help="Disable download resume (re-downloads from byte 0)",
    )
    parser.add_argument(
        "-q",
        "--quiet",
        action="store_true",
        help="Suppress progress bar and informative messages",
    )
    parser.add_argument(
        "--chunk-size",
        type=int,
        default=1,
        help="Buffer chunk size in megabytes (default: 1 MB)",
    )
    parser.add_argument(
        "-v",
        "--version",
        action="version",
        version=f"%(prog)s {__version__}",
    )

    args = parser.parse_args()

    if not args.quiet:
        print_banner()

    try:
        download(
            url_or_id=args.url_or_id,
            output=args.output,
            resume=not args.no_resume,
            quiet=args.quiet,
            chunk_size=args.chunk_size * 1024 * 1024,
        )
    except Exception as e:
        print_error(str(e))
        sys.exit(1)


if __name__ == "__main__":
    main()
