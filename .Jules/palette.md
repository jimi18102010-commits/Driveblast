## 2024-05-24 - Added Loading State for Async Link Resolution
**Learning:** In CLI tools (like web UIs), network requests before a progress bar starts can feel like the tool is "hanging". Users need immediate visual feedback during async operations like link resolution.
**Action:** Use `console.status` (Rich spinner) to indicate activity while resolving file metadata before the main progress bar takes over.
