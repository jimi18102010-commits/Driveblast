## 2026-10-11 - Adding console.status for network requests
**Learning:** When adding UX enhancements, also ensure underlying resource operations (like HTTP streams) do not leak memory during early exits.
**Action:** Always verify proper closure of HTTP streams () when providing user feedback or returning early due to errors or existing resources in driveblast CLI.
## 2026-10-11 - Adding console.status for network requests
**Learning:** When adding UX enhancements, also ensure underlying resource operations (like HTTP streams) do not leak memory during early exits.
**Action:** Always verify proper closure of HTTP streams (`resp.close()`) when providing user feedback or returning early due to errors or existing resources in driveblast CLI.
