from driveblast.core import download
# we'll run download with a test file ID that takes a moment to resolve.
try:
    download(url_or_id="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs", output="/tmp/test_download", quiet=False)
except Exception as e:
    print(f"Error: {e}")
