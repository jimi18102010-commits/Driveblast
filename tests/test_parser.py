import pytest
from driveblast.gdrive import (
    extract_file_id,
    parse_content_disposition_filename,
    GoogleDriveError,
)


def test_extract_file_id_view_url():
    url = "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing"
    assert extract_file_id(url) == "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs"


def test_extract_file_id_open_param():
    url = "https://drive.google.com/open?id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs"
    assert extract_file_id(url) == "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs"


def test_extract_file_id_uc_param():
    url = "https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs"
    assert extract_file_id(url) == "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs"


def test_extract_file_id_usercontent_url():
    url = "https://drive.usercontent.google.com/download?id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs&export=download"
    assert extract_file_id(url) == "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs"


def test_extract_file_id_raw_id():
    raw_id = "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs"
    assert extract_file_id(raw_id) == raw_id


def test_extract_file_id_google_docs():
    url = "https://docs.google.com/document/d/1xLEO-8AgNMPeNFb8vQWCqXd6siXfTRMXVukd3iSH3x4/edit?usp=drive_link"
    assert extract_file_id(url) == "1xLEO-8AgNMPeNFb8vQWCqXd6siXfTRMXVukd3iSH3x4"


def test_extract_file_id_google_sheets():
    url = "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/edit#gid=0"
    assert extract_file_id(url) == "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs"


def test_extract_file_id_google_presentation():
    url = "https://docs.google.com/presentation/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/edit#slide=id.p"
    assert extract_file_id(url) == "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs"


def test_extract_file_id_invalid():
    with pytest.raises(ValueError):
        extract_file_id("https://google.com/search?q=hello")


def test_parse_content_disposition_standard():
    header = 'attachment; filename="large_dataset.tar.gz"'
    assert parse_content_disposition_filename(header) == "large_dataset.tar.gz"


def test_parse_content_disposition_unquoted():
    header = "attachment; filename=model.safetensors"
    assert parse_content_disposition_filename(header) == "model.safetensors"


def test_parse_content_disposition_rfc5987():
    header = "attachment; filename*=UTF-8''my%20archive%20v1.zip"
    assert parse_content_disposition_filename(header) == "my archive v1.zip"


def test_parse_content_disposition_none():
    assert parse_content_disposition_filename(None) is None
    assert parse_content_disposition_filename("") is None
