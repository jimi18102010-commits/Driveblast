# ⚡ DriveBlast

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-jimi18102010--commits-181717?logo=github)](https://github.com/jimi18102010-commits/driveblast)
[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-15%2F15%20Passing-brightgreen.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)]()

**High-speed Google Drive downloader with automatic virus-warning bypass, download resume, Google Docs/Sheets export, and interactive CLI.**

[📖 Русская версия руководства (Russian Guide)](docs/GUIDE_RU.md)

</div>

---

```text
╭────────────────────────────────────────────────────────╮
│ ⚡ DriveBlast v0.1.0                                   │
│ High-speed Google Drive Downloader with Resume Support │
╰────────────────────────────────────────────────────────╯
ℹ Downloading: large_model_weights.bin (1.45 GB)
  large_model_weights.bin ━━━━━━╸━━━━━━━━━━━━ 42.5% 616.2 MB / 1.45 GB 24.8 MB/s 0:00:34
```

---

## 🚀 Why DriveBlast instead of `gdown`?

For years, developers and data scientists have relied on `gdown` to download large datasets and model weights in Google Colab, Kaggle, and remote servers. However, Google frequently changes its interstitial virus-warning page structure, causing `gdown` to fail with `Cannot retrieve the public link` or `Connection reset by peer`. Most painfully, **if a 30 GB download drops at 99%, `gdown` starts over from 0 MB**.

**DriveBlast solves this:**

| Feature | `gdown` | **DriveBlast** ⚡ |
| :--- | :---: | :---: |
| **Download Resume (`Range` header)** | ❌ (starts from 0) | ✅ **Yes (resumes from exact byte)** |
| **Bypass "Can't scan for viruses" warning** | ⚠️ Often breaks on changes | ✅ **Multi-fallback form & token parsing** |
| **Google Docs / Sheets Export** | ⚠️ Limited / Crashes | ✅ **Built-in export to PDF, DOCX, XLSX** |
| **Interactive Terminal Mode** | ❌ (requires flags) | ✅ **Run `driveblast` and paste link** |
| **Modern Terminal UI** | Basic / Stale | ✅ **Rich vibrant progress bar & speed ETA** |
| **Graceful `Ctrl+C` pausing** | ❌ Corrupts / Aborts | ✅ **Pauses cleanly & informs how to resume** |
| **Python 3.12 - 3.14 compatible** | Deprecation warnings | ✅ **100% Tested & Verified** |

---

## 📦 Installation

```bash
git clone https://github.com/jimi18102010-commits/driveblast.git
cd driveblast

# Create & activate virtual environment
python3 -m venv .venv
source .venv/bin/activate       # Bash / Zsh
# OR for Fish Shell (CachyOS / Arch):
# source .venv/bin/activate.fish

# Install editable package
pip install -e .
```

---

## 💻 CLI Usage

### 1. Interactive Mode (Super easy!)
Just run `driveblast` without arguments and paste your link:
```bash
driveblast
```

### 2. Standard Download
```bash
# Download by URL
driveblast "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing"

# Download by File ID
driveblast 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs

# Save to custom output filename or folder
driveblast 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs -o ./datasets/dataset.zip
```

### 3. Google Docs / Sheets / Slides Export
```bash
# Export Google Document to PDF
driveblast "https://docs.google.com/document/d/DOC_ID/edit" --format pdf

# Export Google Document to Word DOCX
driveblast "https://docs.google.com/document/d/DOC_ID/edit" --format docx

# Export Google Spreadsheet to Excel XLSX
driveblast "https://docs.google.com/spreadsheets/d/SHEET_ID/edit" --format xlsx
```

---

## ⏸ Pausing & Resuming Downloads

If your network drops or you press `Ctrl+C`:
```
⚠ Download paused at 450.20 MB. Run the command again to resume.
```
Simply run the same command again — DriveBlast detects the existing file and automatically resumes from byte `472,068,096` instead of re-downloading from scratch!

---

## 🐍 Python API Usage

You can also use DriveBlast directly in your Python code:

```python
from driveblast import download

# Download file
filepath = download(
    url_or_id="https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing",
    output="model_weights.bin",
    resume=True
)

print(f"Downloaded to: {filepath}")
```

See [examples/quick_download.py](examples/quick_download.py) for a complete example.

---

## ⚙️ CLI Options

| Flag | Description | Default |
| :--- | :--- | :---: |
| `url_or_id` | Google Drive URL or File ID *(Optional: interactive prompt if omitted)* | `None` |
| `-o`, `--output` | Destination path or directory to save the file | `.` (original filename) |
| `-f`, `--format` | Export format for Docs/Sheets (`pdf`, `docx`, `xlsx`, `pptx`, `txt`, `csv`) | `None` |
| `--no-resume` | Disable resume, force re-downloading from scratch | `False` |
| `-q`, `--quiet` | Suppress progress bar and output messages | `False` |
| `--chunk-size` | Buffer chunk size in megabytes | `1` (1 MB) |
| `-v`, `--version` | Show version number | — |
| `-h`, `--help` | Show help and options | — |

---

## 🧪 Testing

Run the test suite with `pytest`:

```bash
pytest
```

---

## 👤 Author

Developed by **[jimmiy](https://github.com/jimi18102010-commits)**.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
