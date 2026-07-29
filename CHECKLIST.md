# Build and verification checklist

- npm install
- npm run build
- Verify NSIS and MSI outputs in src-tauri/target/release/bundle
- Smoke test resize, navigation tabs, pause/resume, recording, refresh, tool actions, app selection, and guardrail toggles
- Wire real adapter commands only after the UI smoke test passes

Static checks completed: required Tauri config keys, no runtime icon CDN, tightened CSP, required dashboard handlers, and package integrity. Windows compilation still needs to run on Windows because this environment cannot execute MSVC/WebView2 builds.
