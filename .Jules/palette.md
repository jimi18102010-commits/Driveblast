## 2024-10-09 - Adding Loading State to Stream Resolution
**Learning:** CLI applications that have network operations can hang without user feedback, making the app seem unresponsive.
**Action:** Always wrap long-running network requests or stream resolutions in a visible loading state (like `console.status`) to provide immediate feedback to the user.
