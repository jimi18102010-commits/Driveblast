
## 2024-05-18 - CLI Network Operation Feedback
**Learning:** Wrapping long-running CLI network operations (like bypassing virus scans in Google Drive downloads) with a visible spinner significantly improves perceived responsiveness and prevents users from prematurely terminating the application thinking it hangs.
**Action:** Always wrap `resolve_gdrive_download_stream` or similar long-running CLI resolution tasks with a `rich` `console.status` spinner, ensuring it respects the `--quiet` flag.
