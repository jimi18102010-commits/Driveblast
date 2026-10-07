## 2024-10-07 - CLI Network Operation Visual Feedback
**Learning:** In CLI applications, blocking network operations (like resolving complex URLs or bypassing interstitial warnings) can make the app appear hung before the primary progress bar initializes.
**Action:** Always wrap initial blocking network requests in a visual spinner or status indicator before the main progress reporting takes over, ensuring the user receives immediate feedback that the application is working.
