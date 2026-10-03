## 2024-05-15 - Rich Progress Bar Percentage Handling
**Learning:** Using `TextColumn("[progress.percentage]{task.percentage:>3.1f}%")` in `rich` progress bars creates UI formatting issues or bugs when dealing with streams of unknown size (`task.percentage` evaluates to `None`).
**Action:** Always use the dedicated `TaskProgressColumn(text_format="...", text_format_no_percentage="")` for percentages in `rich` progress bars to handle indeterminate totals gracefully.
