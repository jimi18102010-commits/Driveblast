## 2024-10-06 - Missing loading state for CLI blocking operation
**Learning:** The CLI tool executes long-running HTTP operations (like link resolution and HTML parsing) before displaying any visual feedback or progress bars, leaving users confused about the tool's status on large network fetches.
**Action:** Adding a `rich.console.status` spinner wrapped around synchronous network operations provides immediate, explicit feedback that an action is occurring, reducing perceived latency.
