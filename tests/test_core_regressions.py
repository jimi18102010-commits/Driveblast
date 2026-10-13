from unittest.mock import MagicMock, patch
import pytest
from driveblast.core import download
from driveblast.gdrive import GoogleDriveError

ID = 'a' * 25

def response(status=200, chunks=(b'abcdef',), headers=None):
    r = MagicMock()
    r.status_code = status
    r.headers = headers or {}
    r.iter_content.return_value = iter(chunks)
    return r

@pytest.mark.parametrize('name', ['../escape', '/absolute', r'..\escape', 'C:escape', '\x00bad', '..', 'NUL.txt'])
def test_reject_remote_paths(tmp_path, name):
    r = response()
    with patch('driveblast.core.resolve_gdrive_download_stream', return_value=(r, name, 6)), patch('driveblast.core.requests.Session') as session:
        with pytest.raises(GoogleDriveError):
            download(ID, output=str(tmp_path), quiet=True)
        r.close.assert_called_once()
        session.return_value.close.assert_called_once()
    assert list(tmp_path.iterdir()) == []

@pytest.mark.parametrize('directory_output', [True, False])
def test_resume_automatic_filename(tmp_path, monkeypatch, directory_output):
    monkeypatch.chdir(tmp_path)
    (tmp_path / 'file.bin').write_bytes(b'abc')
    first = response()
    second = response(206, (b'def',), {'content-range': 'bytes 3-5/6'})
    with patch('driveblast.core.resolve_gdrive_download_stream', side_effect=[(first, 'file.bin', 6), (second, 'file.bin', 6)]) as resolve:
        download(ID, output=str(tmp_path) if directory_output else None, quiet=True)
    assert (tmp_path / 'file.bin').read_bytes() == b'abcdef'
    assert resolve.call_args_list[1].kwargs['range_offset'] == 3
    first.close.assert_called_once()
    second.close.assert_called_once()

def test_invalid_content_range_never_appends(tmp_path):
    path = tmp_path / 'file.bin'; path.write_bytes(b'abc')
    r = response(206, (b'def',), {'content-range': 'bytes 0-2/6'})
    with patch('driveblast.core.resolve_gdrive_download_stream', return_value=(r, 'file.bin', 6)):
        with pytest.raises(GoogleDriveError): download(ID, output=str(path), quiet=True)
    assert path.read_bytes() == b'abc'
    r.close.assert_called_once()

def test_ignored_range_restarts(tmp_path):
    path = tmp_path / 'file.bin'; path.write_bytes(b'abc')
    with patch('driveblast.core.resolve_gdrive_download_stream', return_value=(response(), 'file.bin', 6)):
        download(ID, output=str(path), quiet=True)
    assert path.read_bytes() == b'abcdef'

def test_incomplete_download_not_success(tmp_path):
    with patch('driveblast.core.resolve_gdrive_download_stream', return_value=(response(chunks=(b'ab',)), 'file.bin', 6)):
        with pytest.raises(GoogleDriveError, match='Incomplete'): download(ID, output=str(tmp_path), quiet=True)

def test_complete_file_closes_response(tmp_path):
    (tmp_path / 'file.bin').write_bytes(b'abcdef'); r = response()
    with patch('driveblast.core.resolve_gdrive_download_stream', return_value=(r, 'file.bin', 6)):
        download(ID, output=str(tmp_path), quiet=True)
    r.close.assert_called_once()

def test_invalid_chunk_size():
    with pytest.raises(ValueError): download(ID, chunk_size=0)

def test_automatic_output_symlink_rejected(tmp_path):
    target = tmp_path / 'outside'; target.write_bytes(b'untouched')
    (tmp_path / 'file.bin').symlink_to(target)
    r = response()
    with patch('driveblast.core.resolve_gdrive_download_stream', return_value=(r, 'file.bin', 6)):
        with pytest.raises(GoogleDriveError, match='symlink'): download(ID, output=str(tmp_path), quiet=True)
    assert target.read_bytes() == b'untouched'


def test_416_complete_file_is_not_overwritten(tmp_path):
    path = tmp_path / 'file.bin'; path.write_bytes(b'abcdef')
    r = response(416, headers={'content-range': 'bytes */6'})
    with patch('driveblast.core.resolve_gdrive_download_stream', return_value=(r, 'file.bin', None)):
        assert download(ID, output=str(path), quiet=True) == str(path)
    assert path.read_bytes() == b'abcdef'
