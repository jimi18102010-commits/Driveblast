## 2025-02-28 - Optimize HTML parsing in gdrive.py with SoupStrainer
**Learning:** Using `bs4.SoupStrainer` when parsing large HTML responses to restrict parsing to specific tags drastically improves performance and lowers memory usage.
**Action:** When working with large responses in BeautifulSoup in this codebase, utilize SoupStrainer to only parse relevant elements instead of building an entire parse tree.
