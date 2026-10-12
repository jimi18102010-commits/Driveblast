## 2024-05-18 - Fast HTML Parsing with SoupStrainer
**Learning:** When using BeautifulSoup to parse external HTML (like Google Drive warning pages), loading the entire DOM can be slow and use excess memory. Replacing `BeautifulSoup(html, 'html.parser')` with `SoupStrainer` to only parse necessary elements (e.g., forms and links) provides a significant speedup.
**Action:** Always use `SoupStrainer` with `BeautifulSoup` when we only need specific elements from a large HTML response, reducing memory and parsing time without resorting to fragile regex.
