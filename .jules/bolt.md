## 2024-05-24 - Parsing Specific HTML Tags Only
**Learning:** Using `bs4.SoupStrainer` with `BeautifulSoup` when parsing large HTML responses (like Google Drive download warnings) to restrict parsing to specific tags (e.g., 'form' and 'a') significantly improves parsing performance and lowers memory usage.
**Action:** Always use `parse_only=SoupStrainer([...])` when only a small subset of the document's tags needs to be extracted or searched.
