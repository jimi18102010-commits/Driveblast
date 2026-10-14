## 2026-10-14 - Conditional CLI UI Wrapping Pattern
**Learning:** Using `contextlib.nullcontext()` is an extremely elegant way to conditionally apply rich UI wrappers (like `console.status`) without duplicating the inner network I/O code blocks. This is particularly useful for CLI tools that have `--quiet` flags but need to communicate long-running state when not quiet.
**Action:** Use this pattern across Python CLI tools when dealing with network operations that may pause execution, ensuring feedback is visible without breaking silent modes.
