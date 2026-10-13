# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

## Audit validation and deployment notes

Use Node.js 24 for the locked toolchain, run `npm ci --ignore-scripts`, `npm run lint`,
and `npm run build`. The production output is `dist/`, which can be served as static
files on Ubuntu or Debian; do not expose the development/preview server as production.

The XDP animation and terminal are browser-only demonstrations, not a live server shell,
real packet telemetry, or measured performance benchmarks. Project snippets link to their
actual GitHub sources. The Scapy contribution is an open PR, not an accepted/merged one.

These fixes target the existing portfolio feature branch. Merge this fix PR into that
branch first, then review the original portfolio PR separately; do not merge the website
into the downloader's main branch accidentally.
