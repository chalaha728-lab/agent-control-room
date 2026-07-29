# Agent Control Room, Tauri Windows app

A Tauri 2 shell around the live control-room dashboard. The dashboard is fully local and demo-functional. The next integration seam is the `src-tauri` command layer: expose the Windows MCP adapter over Tauri commands or a local named pipe, then replace demo events with real event payloads.

## Prerequisites

- Windows 10/11
- Rust stable with the MSVC toolchain
- Node.js 20+
- WebView2 runtime

## Run

```powershell
npm install
npm run dev
```

## Build

```powershell
npm run build
```

The NSIS and MSI installers are emitted under `src-tauri/target/release/bundle/`. The app uses a per-user installer configuration and does not require admin privileges by default.

## Integration plan

Keep the UI focused on live observability. Add Tauri commands for `list_open_apps`, `select_app`, `capture_app`, `ui_tree`, `click`, `type`, `key_press`, `scroll`, `read_process`, and the Godot bridge commands. Prefer a localhost named pipe or stdio child process for the existing MCP adapter; do not open a network port by default.
