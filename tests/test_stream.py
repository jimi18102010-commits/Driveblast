from unittest.mock import MagicMock
import requests
from driveblast.gdrive import resolve_gdrive_download_stream


def test_resolve_direct_download():
    session = MagicMock(spec=requests.Session)
    mock_resp = MagicMock(spec=requests.Response)
    mock_resp.headers = {
        "content-disposition": 'attachment; filename="weights.pt"',
        "content-type": "application/octet-stream",
        "content-length": "104857600",
    }
    mock_resp.status_code = 200
    session.get.return_value = mock_resp

    resp, filename, total_size = resolve_gdrive_download_stream("fake_id_12345678901234567890", session)

    assert filename == "weights.pt"
    assert total_size == 104857600
    assert resp == mock_resp


def test_resolve_virus_scan_warning_form():
    session = MagicMock(spec=requests.Session)
    session.cookies = {}

    # Initial response is virus warning HTML
    initial_resp = MagicMock(spec=requests.Response)
    initial_resp.headers = {
        "content-type": "text/html; charset=utf-8",
    }
    initial_resp.status_code = 200
    initial_resp.text = """
    <html>
        <body>
            <form id="download-form" action="https://drive.usercontent.google.com/download" method="post">
                <input type="hidden" name="id" value="fake_file_id">
                <input type="hidden" name="export" value="download">
                <input type="hidden" name="confirm" value="t_token_abc">
                <input type="hidden" name="uuid" value="uuid_123">
                <input type="submit" id="uc-download-link" value="Download anyway">
            </form>
        </body>
    </html>
    """

    # Confirmed response is the actual file stream
    confirmed_resp = MagicMock(spec=requests.Response)
    confirmed_resp.headers = {
        "content-disposition": 'attachment; filename="large_archive.zip"',
        "content-type": "application/zip",
        "content-length": "524288000",
    }
    confirmed_resp.status_code = 200

    session.get.return_value = initial_resp
    session.post.return_value = confirmed_resp

    resp, filename, total_size = resolve_gdrive_download_stream("fake_file_id_1234567890", session)

    assert filename == "large_archive.zip"
    assert total_size == 524288000
    session.post.assert_called_once()
    call_args = session.post.call_args
    assert call_args[1]["data"]["confirm"] == "t_token_abc"
    assert call_args[1]["data"]["uuid"] == "uuid_123"
