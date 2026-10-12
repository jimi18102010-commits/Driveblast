## 2024-10-12 - Wrap CLI network I/O with loading spinners
**Learning:** In CLI apps utilizing 'rich', network I/O operations can feel like freezing if they take several seconds without visual feedback.
**Action:** Use `console.status` in 'rich' to wrap any network resolution loops or requests to keep the UI responsive and polite, always checking if `quiet=True` first.
