from unittest.mock import MagicMock
import pytest
import requests
from driveblast.gdrive import GoogleDriveError, resolve_gdrive_download_stream


def warning(action='https://drive.usercontent.google.com/download', method='get'):
    r = MagicMock(spec=requests.Response)
    r.status_code = 200; r.url = 'https://drive.usercontent.google.com/download'
    r.headers = {'content-type': 'text/html'}
    r.text = f'<form id="download-form" action="{action}" method="{method}"><input name="confirm" value="token"></form>'
    return r


def file_response():
    r = MagicMock(spec=requests.Response); r.status_code = 200
    r.headers = {'content-type': 'application/octet-stream', 'content-disposition': 'attachment; filename="file"', 'content-length': '6'}
    return r


def test_get_confirmation_preserves_parameters_and_timeout():
    session = MagicMock(spec=requests.Session); initial = warning(); final = file_response()
    session.get.side_effect = [initial, final]
    resp, name, size = resolve_gdrive_download_stream('a'*25, session)
    assert resp is final and name == 'file' and size == 6
    initial.close.assert_called_once()
    assert session.get.call_args.kwargs['params'] == {'confirm': 'token'}
    assert session.get.call_args.kwargs['timeout'] == (10, 60)
    session.post.assert_not_called()


def test_confirmation_cannot_target_another_host():
    session = MagicMock(spec=requests.Session); initial = warning('https://example.test/collect')
    session.get.return_value = initial
    with pytest.raises(GoogleDriveError, match='Untrusted'): resolve_gdrive_download_stream('a'*25, session)
    assert session.get.call_count == 1
    initial.close.assert_called_once()


def test_final_html_is_not_download_success():
    session = MagicMock(spec=requests.Session); initial = warning(); final = warning()
    session.get.side_effect = [initial, final]
    with pytest.raises(GoogleDriveError, match='HTML'): resolve_gdrive_download_stream('a'*25, session)
    final.close.assert_called_once()


@pytest.mark.parametrize('status', [401, 403, 404])
def test_error_response_closed(status):
    session = MagicMock(spec=requests.Session); r = file_response(); r.status_code = status
    r.url = 'https://drive.usercontent.google.com/download'; session.get.return_value = r
    with pytest.raises(GoogleDriveError): resolve_gdrive_download_stream('a'*25, session)
    r.close.assert_called_once()


def test_invalid_content_length_closes_response():
    session = MagicMock(spec=requests.Session); r = file_response(); r.headers['content-length'] = 'not-a-size'
    session.get.return_value = r
    with pytest.raises(GoogleDriveError, match='Content-Length'): resolve_gdrive_download_stream('a'*25, session)
    r.close.assert_called_once()
