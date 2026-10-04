## 2024-05-24 - Optimizing Python CLI Startup Time
**Learning:** Immediate imports of large libraries (like `requests`, `rich`, or `bs4`) in the root `__init__.py` or at the top level of the CLI module significantly drag down startup time, heavily penalizing quick commands like `--help` or `--version`.
**Action:** Use PEP 562 (`__getattr__` and `__dir__`) in `__init__.py` for lazy loading module attributes, and defer heavy third-party module imports in `cli.py` until after argument parsing (`argparse`). This drops CLI startup overhead from ~350ms to ~70ms.
