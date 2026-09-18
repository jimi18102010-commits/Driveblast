# ⚡ DriveBlast

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.9%2B-blue.svg)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen.svg)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-orange.svg)]()

**High-speed Google Drive downloader with automatic virus-warning bypass, download resume, and modern CLI interface.**

</div>

---

## 🚀 Why DriveBlast instead of `gdown`?

For years, developers and data scientists have relied on `gdown` to download large datasets and model weights in Google Colab, Kaggle, and remote servers. However, Google frequently changes its interstitial virus-warning page structure, causing `gdown` to fail with `Cannot retrieve the public link` or `Connection reset by peer`. Most painfully, **if a 30 GB download drops at 99%, `gdown` starts over from 0 MB**.

**DriveBlast solves this:**

| Feature | `gdown` | **DriveBlast** ⚡ |
| :--- | :---: | :---: |
| **Download Resume (`Range` header)** | ❌ (starts from 0) | ✅ **Yes (resumes from exact byte)** |
| **Bypass "Can't scan for viruses" warning** | ⚠️ Often breaks on changes | ✅ **Multi-fallback form & token parsing** |
| **Modern Terminal UI** | Basic / Stale | ✅ **Rich vibrant progress bar & speed ETA** |
| **Graceful `Ctrl+C` pausing** | ❌ Corrupts / Aborts | ✅ **Pauses cleanly & informs how to resume** |
| **Lightweight dependencies** | Heavy | ✅ **Minimal (`requests`, `rich`, `bs4`)** |
| **Python 3.12 - 3.14 compatible** | Deprecation warnings | ✅ **100% Tested & Verified** |

---

## 📦 Installation

### From Source / Clone
```bash
git clone https://github.com/yourusername/driveblast.git
cd driveblast
pip install -e .
```

---

## 💻 CLI Usage

Download any Google Drive file using its shareable URL or direct ID:

```bash
# Using a shareable link
driveblast "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view?usp=sharing"

# Using file ID directly
driveblast 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs

# Specify custom output path
driveblast 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs -o ./datasets/dataset.zip

# Quiet mode (useful for cron jobs and scripts)
driveblast 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs -q
```

### Pausing & Resuming Downloads
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
    url_or_id="https://drive.google.com/file/d/YOUR_FILE_ID/view",
    output="model_weights.bin",
    resume=True
)

print(f"Downloaded to: {filepath}")
```

---

## ⚙️ CLI Options

| Flag | Description | Default |
| :--- | :--- | :---: |
| `url_or_id` | Google Drive shareable URL or direct File ID | *Required* |
| `-o`, `--output` | Destination path or directory to save the file | `.` (original filename) |
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

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
