import requests
from unittest.mock import patch
from driveblast.core import download

@patch('driveblast.core.resolve_gdrive_download_stream')
def test_console(mock_resolve):
    mock_resolve.return_value = (requests.Response(), "test.txt", 100)
    mock_resolve.return_value[0].status_code = 200
    try:
        download("1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs", quiet=False)
    except Exception as e:
        print("Error:", e)

test_console()
