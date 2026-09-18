import argparse
import sys
from driveblast import __version__
from driveblast.core import download
from driveblast.ui import print_banner, print_error


from rich.prompt import Prompt


def main():
    parser = argparse.ArgumentParser(
        prog="driveblast",
        description="⚡ DriveBlast: High-speed Google Drive downloader with resume and virus-warning bypass",
    )
    parser.add_argument(
        "url_or_id",
        type=str,
        nargs="?",
        default=None,
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
        "-f",
        "--format",
        type=str,
        default=None,
        choices=["pdf", "docx", "xlsx", "pptx", "txt", "csv"],
        help="Export format for Google Docs/Sheets/Slides (e.g. pdf, docx, xlsx)",
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

    url_or_id = args.url_or_id
    if not url_or_id:
        try:
            url_or_id = Prompt.ask("[bold cyan]🔗 Enter Google Drive URL or File ID[/bold cyan]")
        except (KeyboardInterrupt, EOFError):
            print()
            sys.exit(0)

    if not url_or_id or not url_or_id.strip():
        print_error("No URL or File ID provided. Exiting.")
        sys.exit(1)

    url_or_id = url_or_id.strip(" '\"")

    try:
        download(
            url_or_id=url_or_id,
            output=args.output,
            resume=not args.no_resume,
            quiet=args.quiet,
            chunk_size=args.chunk_size * 1024 * 1024,
            export_format=args.format,
        )
    except Exception as e:
        print_error(str(e))
        sys.exit(1)


if __name__ == "__main__":
    main()
