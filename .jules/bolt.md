## 2024-10-07 - SoupStrainer for HTML Parsing
**Learning:** Using regex for parsing HTML, while fast, is highly brittle and can cause logic failures if attribute orders change (e.g., `<a id="link" href="...">` vs `<a href="..." id="link">`). Using `SoupStrainer` from `bs4` offers a safe, built-in optimization for parsing specific elements and drastically speeds up `BeautifulSoup` performance.
**Action:** Always prefer `SoupStrainer` over regex when optimizing large HTML payloads in BeautifulSoup code to maintain robustness.
