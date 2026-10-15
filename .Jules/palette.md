## 2024-10-15 - Loading states for network operations
**Learning:** Users lack feedback during the potentially slow resolution of Google Drive download streams, which can feel like the CLI is hung.
**Action:** Always wrap potentially long-running CLI operations (like network I/O or resolving streams) with a visible loading state using Rich `console.status`, while ensuring it respects the global `--quiet` flag state via `contextlib.nullcontext`.
