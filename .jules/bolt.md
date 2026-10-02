## 2026-10-02 - BeautifulSoup HTML Parsing Optimization
**Learning:** Parsing the entire HTML DOM tree of large pages (like Google Drive virus scan warning pages) using `BeautifulSoup(html, "html.parser")` is an anti-pattern when only specific tags (e.g., forms, links) are needed, leading to unnecessary memory usage and slow parsing.
**Action:** Use `bs4.SoupStrainer` with `parse_only` to instruct BeautifulSoup to only parse the required tags, drastically improving performance on large pages.
