"""
Quick Example: Using DriveBlast in your Python scripts.
"""

from driveblast import download

# 1. Download a file using URL or File ID
file_url = "https://drive.google.com/file/d/0B9P1L--7Wd2vU3VUVlFnbTgtS2c/view?usp=sharing"

print("Starting download...")
local_path = download(
    url_or_id=file_url,
    output="downloaded_file.txt",
    resume=True,  # Automatically resume if interrupted
)

print(f"File successfully saved to: {local_path}")
