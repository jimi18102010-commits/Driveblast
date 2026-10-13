## 2024-05-18 - Loading State for CLI Network Calls
**Learning:** In CLI tools that fetch large files, users can perceive hanging if the initial network request to resolve links or parse tokens takes too long.
**Action:** Always wrap potentially long-running CLI operations (like network I/O or resolving streams) with a visible loading state using Rich `console.status`, while ensuring it respects the global `--quiet` flag state.
