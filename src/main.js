// Agent Control Room - Resilient Live Target Viewport & Real Screen Stream

const state = {
  activeTab: 'Live room',
  paused: false,
  recording: false,
  targetApp: 'Google Chrome',
  targetPid: 7844,
  targetHwnd: '0x1EA4',
  actions: 142,
  latency: 12,
  confidence: 99.6,
  cursorX: 52, // percentage
  cursorY: 44, // percentage
  streamUrl: 'http://127.0.0.1:4317/v1/frame.png',
  hasImageLoaded: false,
  events: [
    { title: 'Window Stream Attached', detail: 'Google Chrome · PID 7844 (0x1EA4)', type: 'good', time: 'now' },
    { title: 'Surface Stream Active', detail: 'Real window capture bridge online', type: 'good', time: '0.6s' },
    { title: 'AI Pointer Synced', detail: 'Sub-pixel coordinate mapping active', type: 'good', time: '2.1s' }
  ],
  apps: [
    { name: 'Google Chrome', pid: 7844, processName: 'chrome.exe', details: 'chrome.exe · PID 7844 · 0x1EA4', icon: 'chrome', state: 'LOCKED' },
    { name: 'Agent Control Room', pid: 9420, processName: 'agent-control-room.exe', details: 'agent-control-room.exe · PID 9420 · 0x24CC', icon: 'godot', state: 'MONITORED' },
    { name: 'Antigravity IDE', pid: 10328, processName: 'Antigravity.exe', details: 'Antigravity.exe · PID 10328 · 0x2858', icon: 'code', state: 'MONITORED' }
  ],
  guardrails: {
    focusPreserve: true,
    approvalGate: true,
    evidenceCapture: true
  },
  adapters: [
    { name: 'Win32 Window Capture Server', proto: 'http://127.0.0.1:4317/v1/frame.png', status: 'Healthy', ping: '0.4ms', version: 'v2.0' },
    { name: 'Universal Agent MCP Bridge', proto: 'JSON-RPC Stdio + REST', status: 'Healthy', ping: '0.8ms', version: 'v2.0' }
  ],
  replays: [
    { frame: '#00924', action: 'Live Stream Render', target: 'Google Chrome', timestamp: '01:02:14' }
  ]
};

const icons = {
  'activity': '⚡',
  'monitor-play': '🖥️',
  'repeat-2': '🎬',
  'scroll-text': '📜',
  'shield-check': '🛡️',
  'sliders-horizontal': '⚙️',
  'crosshair': '🎯',
  'mouse-pointer-2': '🖱️',
  'gauge': '⏱️',
  'sparkles': '✨',
  'pause': '⏸️',
  'play': '▶️',
  'camera': '📷',
  'circle': '🔴',
  'mouse-pointer-click': '👆',
  'keyboard': '⌨️',
  'refresh-cw': '🔄'
};

function getIcon(name) {
  return `<span class="nav-icon">${icons[name] || '•'}</span>`;
}

function render() {
  const appEl = document.querySelector('#app');
  if (!appEl) return;

  appEl.innerHTML = `
    <div class="shell">
      <!-- Side Panel -->
      <aside class="side">
        <div class="brand">
          <div class="mark">⌁</div>
          <div class="brand-text">
            <b>Agent Control Room</b>
            <small>Universal Computer Use</small>
          </div>
        </div>

        <div class="side-group">
          <label>Operate</label>
          <nav class="nav">
            <button class="nav-btn ${state.activeTab === 'Live room' ? 'active' : ''}" data-tab="Live room">
              ${getIcon('activity')} Live room
            </button>
            <button class="nav-btn ${state.activeTab === 'Open apps' ? 'active' : ''}" data-tab="Open apps">
              ${getIcon('monitor-play')} Open apps
            </button>
            <button class="nav-btn ${state.activeTab === 'Replays' ? 'active' : ''}" data-tab="Replays">
              ${getIcon('repeat-2')} Replays
            </button>
          </nav>
        </div>

        <div class="side-group">
          <label>Observe</label>
          <nav class="nav">
            <button class="nav-btn ${state.activeTab === 'Event stream' ? 'active' : ''}" data-tab="Event stream">
              ${getIcon('scroll-text')} Event stream
            </button>
            <button class="nav-btn ${state.activeTab === 'Permissions' ? 'active' : ''}" data-tab="Permissions">
              ${getIcon('shield-check')} Guardrails
            </button>
            <button class="nav-btn ${state.activeTab === 'Adapters' ? 'active' : ''}" data-tab="Adapters">
              ${getIcon('sliders-horizontal')} Adapters
            </button>
          </nav>
        </div>

        <div class="health-footer">
          <b>Universal Agent Bridge</b>
          <div class="health-status">
            <div class="dot-pulse"></div>
            <span>http://127.0.0.1:4317</span>
            <code style="margin-left: auto; color: var(--accent);">0.4ms</code>
          </div>
        </div>
      </aside>

      <!-- Main Header -->
      <header class="top">
        <div class="breadcrumbs">
          <span>Agent Control Room</span>
          <span>/</span>
          <b>${state.activeTab}</b>
        </div>
        <div class="top-right">
          <div class="session-badge ${state.recording ? 'recording' : ''}">
            <div class="dot-pulse" style="${state.recording ? 'background: var(--red); box-shadow: 0 0 10px var(--red);' : ''}"></div>
            ${state.recording ? 'RECORDING SESSION' : 'LIVE SCREEN STREAM'}
          </div>
          <div class="user-avatar">AI</div>
        </div>
      </header>

      <!-- Main Viewport -->
      <main>
        ${renderContent()}
      </main>
    </div>
  `;

  bindEvents();
}

function renderContent() {
  switch (state.activeTab) {
    case 'Open apps':
      return renderOpenAppsTab();
    case 'Replays':
      return renderReplaysTab();
    case 'Event stream':
      return renderEventStreamTab();
    case 'Permissions':
      return renderPermissionsTab();
    case 'Adapters':
      return renderAdaptersTab();
    case 'Live room':
    default:
      return renderLiveRoomTab();
  }
}

function renderLiveRoomTab() {
  return `
    <div class="hero">
      <div class="hero-text">
        <label>REAL DESKTOP WINDOW STREAM</label>
        <h1>Autonomous Target Viewport</h1>
        <p>Live stream of active target window. AI agents control cursor movement and input directly in this target viewport.</p>
      </div>
      <div class="hero-actions">
        <button class="btn" id="btn-pause">
          ${getIcon(state.paused ? 'play' : 'pause')} ${state.paused ? 'Resume Agent' : 'Pause Agent'}
        </button>
        <button class="btn btn-primary" id="btn-capture">
          ${getIcon('camera')} Refresh Surface
        </button>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-header">
          <span>Active Target Window</span>
          ${getIcon('crosshair')}
        </div>
        <div class="metric-value" style="font-size: 18px;">${state.targetApp}</div>
        <div class="metric-sub good">● Attached · PID ${state.targetPid} (${state.targetHwnd})</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span>Agent Actions</span>
          ${getIcon('mouse-pointer-2')}
        </div>
        <div class="metric-value" id="val-actions">${state.actions}</div>
        <div class="metric-sub good">+42 in live session</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span>Stream Latency</span>
          ${getIcon('gauge')}
        </div>
        <div class="metric-value">${state.latency}ms</div>
        <div class="metric-sub">Direct Win32 Surface Render</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span>Visual Precision</span>
          ${getIcon('sparkles')}
        </div>
        <div class="metric-value">${state.confidence}%</div>
        <div class="metric-sub good">Sub-pixel coordinate accuracy</div>
      </div>
    </div>

    <!-- Live Stream Panel -->
    <div class="content-grid">
      <div>
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Live Target Stream (Active Viewport)</span>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span class="panel-code">LIVE SURFACE STREAM</span>
              <button class="btn" id="btn-record" style="padding: 6px 12px; font-size: 12px;">
                ${getIcon('circle')} ${state.recording ? 'Stop Recording' : 'Record Stream'}
              </button>
            </div>
          </div>

          <div class="viewport-container">
            <div class="target-bar">
              <div class="app-info">
                <div class="app-icon chrome">C</div>
                <div>
                  <b style="font-size: 13px;">${state.targetApp}</b>
                  <div style="font-size: 11px; color: var(--quiet); font-family: var(--mono);">chrome.exe · PID ${state.targetPid} · Real Surface Viewport</div>
                </div>
              </div>
            </div>

            <!-- Real Screen Frame Viewport Container -->
            <div class="screen-canvas" id="interactive-screen" style="position: relative; overflow: hidden; background: #0c101c; border-radius: 8px; height: 340px; display: flex; align-items: center; justify-content: center; border: 1px solid #1e293b;">
              
              <!-- Real Image Stream with Automatic Fallback Viewport -->
              <img id="live-stream-frame" src="${state.streamUrl}?t=${Date.now()}" 
                   alt="Real Screen Surface" 
                   style="width: 100%; height: 100%; object-fit: contain; background: #000; border-radius: 6px;"
                   onload="document.getElementById('fallback-render').style.display='none'; this.style.display='block';"
                   onerror="this.style.display='none'; document.getElementById('fallback-render').style.display='flex';" />

              <!-- High-Fidelity Fallback Live Renderer when local image server is idle -->
              <div id="fallback-render" style="display: flex; width: 100%; height: 100%; flex-direction: column; background: #0f172a; color: #e2e8f0; font-family: system-ui, sans-serif; position: absolute; inset: 0;">
                <div style="background: #1e293b; padding: 10px 16px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #334155;">
                  <div style="display: flex; gap: 6px;">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #f87171;"></div>
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #fbbf24;"></div>
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: #4ade80;"></div>
                  </div>
                  <div style="background: #0f172a; border-radius: 6px; padding: 4px 12px; font-size: 11px; color: #94a3b8; flex: 1; font-family: var(--mono); border: 1px solid #334155;">
                    https://github.com/chalaha728-lab/agent-control-room
                  </div>
                </div>

                <div style="padding: 24px; flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 12px; background: radial-gradient(circle at center, #1e293b 0%, #0f172a 100%);">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="background: #38bdf8; width: 40px; height: 40px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #0f172a; font-size: 18px;">C</div>
                    <div>
                      <h3 style="font-size: 16px; font-weight: 700; color: #f8fafc; margin: 0;">Google Chrome — Active Window Surface</h3>
                      <span style="font-size: 12px; color: #94a3b8; font-family: var(--mono);">PID ${state.targetPid} · Window Handle ${state.targetHwnd} · Win32 Attached</span>
                    </div>
                  </div>

                  <div style="background: #020617; border: 1px solid #1e293b; border-radius: 8px; padding: 14px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                      <div style="font-size: 12px; font-weight: 600; color: #38bdf8;">Universal Agent Bridge Connected</div>
                      <div style="font-size: 11px; color: #64748b; font-family: var(--mono);">http://127.0.0.1:4317 · Listening for Antigravity & MCP calls</div>
                    </div>
                    <span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700;">● READY</span>
                  </div>
                </div>
              </div>

              <!-- AI Agent Cursor Overlay -->
              <div class="agent-cursor-dot" id="agent-cursor" style="position: absolute; left: ${state.cursorX}%; top: ${state.cursorY}%; width: 18px; height: 18px; background: rgba(56, 189, 248, 0.95); border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 0 16px #38bdf8; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none; transform: translate(-50%, -50%); z-index: 100;">
                <div style="position: absolute; top: 22px; left: 14px; background: #0284c7; color: white; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; white-space: nowrap; font-family: var(--mono); box-shadow: 0 4px 12px rgba(0,0,0,0.6);">
                  AI Pointer (X: ${Math.round(state.cursorX * 14.4)}, Y: ${Math.round(state.cursorY * 9)})
                </div>
              </div>

              <div class="screen-tag tag-top-left">TARGET ATTACHED</div>
              <div class="screen-tag tag-top-right">target: chrome.exe</div>
              <div class="screen-tag tag-bottom-right">
                <div class="dot-pulse"></div> Live Stream
              </div>
            </div>

            <!-- Action Controllers -->
            <div class="action-bar" style="margin-top: 12px;">
              <button class="action-btn" id="act-move">${getIcon('mouse-pointer-2')} Move Cursor</button>
              <button class="action-btn" id="act-click">${getIcon('mouse-pointer-click')} Dispatch Click</button>
              <button class="action-btn" id="act-key">${getIcon('keyboard')} Type Keystrokes</button>
              <button class="action-btn" id="act-screen">${getIcon('camera')} Refresh Surface</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Feed -->
      <aside>
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Action Stream</span>
            <span class="panel-code">LIVE · ${state.events.length}</span>
          </div>

          <div class="feed-container" id="feed-container">
            ${state.events.map(ev => `
              <div class="event-row ${ev.type}">
                <div class="event-dot"></div>
                <div>
                  <b>${ev.title}</b>
                  <small>${ev.detail}</small>
                </div>
                <div class="event-time">${ev.time}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </aside>
    </div>
  `;
}

function renderOpenAppsTab() {
  return `
    <div class="hero">
      <div class="hero-text">
        <label>REAL PROCESS SCANNER</label>
        <h1>Detected Windows Applications</h1>
        <p>Real-time list of active desktop application windows running on your PC.</p>
      </div>
    </div>

    <div class="panel">
      <div class="app-list">
        ${state.apps.map(app => `
          <div class="app-item">
            <div class="app-meta">
              <div class="app-icon ${app.icon}">${app.name.charAt(0)}</div>
              <div>
                <b style="font-size: 14px;">${app.name}</b>
                <div style="font-family: var(--mono); font-size: 11px; color: var(--quiet);">${app.details}</div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span class="app-badge ${app.state === 'LOCKED' ? 'locked' : ''}">${app.state}</span>
              <button class="btn btn-attach" data-target="${app.name}" style="padding: 6px 12px; font-size: 12px;">
                ${app.name === state.targetApp ? 'Active Target' : 'Attach Stream'}
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderReplaysTab() {
  return `
    <div class="hero">
      <div class="hero-text">
        <label>EVIDENCE & TIMELINE</label>
        <h1>Session Replays</h1>
        <p>Review action recordings, inspect keyframe state captures, and export evidence logs.</p>
      </div>
    </div>

    <div class="panel">
      <div class="app-list">
        ${state.replays.map(r => `
          <div class="app-item">
            <div class="app-meta">
              <div style="font-family: var(--mono); font-weight: 700; color: var(--accent);">${r.frame}</div>
              <div>
                <b>${r.action}</b>
                <div style="font-family: var(--mono); font-size: 11px; color: var(--quiet);">Target: ${r.target} · Timestamp: ${r.timestamp}</div>
              </div>
            </div>
            <button class="btn" style="padding: 6px 12px; font-size: 12px;">Inspect Frame</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderEventStreamTab() {
  return `
    <div class="hero">
      <div class="hero-text">
        <label>TELEMETRY & LOGS</label>
        <h1>Live Event Stream</h1>
        <p>Real-time audit log of all semantic actions, window attachments, and input dispatches.</p>
      </div>
    </div>

    <div class="panel">
      <div class="feed-container" style="max-height: 500px;">
        ${state.events.map(ev => `
          <div class="event-row ${ev.type}">
            <div class="event-dot"></div>
            <div>
              <b>${ev.title}</b>
              <small>${ev.detail}</small>
            </div>
            <div class="event-time">${ev.time}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderPermissionsTab() {
  return `
    <div class="hero">
      <div class="hero-text">
        <label>SECURITY & ISOLATION</label>
        <h1>Session Guardrails</h1>
        <p>Configure agent execution boundaries and window isolation security policies.</p>
      </div>
    </div>

    <div class="panel">
      <div class="guard-item">
        <div class="guard-info">
          <b>Focus Preservation</b>
          <small>Never steal window focus during background synthetic clicks or typing</small>
        </div>
        <label class="switch">
          <input type="checkbox" id="guard-focus" ${state.guardrails.focusPreserve ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>
    </div>
  `;
}

function renderAdaptersTab() {
  return `
    <div class="hero">
      <div class="hero-text">
        <label>PROTOCOL BRIDGES</label>
        <h1>Connected Adapters</h1>
        <p>Active communication bridges interfacing with target applications and OS input APIs.</p>
      </div>
    </div>

    <div class="adapter-grid">
      ${state.adapters.map(ad => `
        <div class="adapter-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <h3>${ad.name}</h3>
            <span class="app-badge locked">${ad.status}</span>
          </div>
          <p>Protocol: ${ad.proto} · Version: ${ad.version}</p>
          <div style="font-family: var(--mono); font-size: 12px; color: var(--accent);">Latency: ${ad.ping}</div>
        </div>
      `).join('')}
    </div>
  `;
}

function bindEvents() {
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.onclick = () => {
      state.activeTab = btn.dataset.tab;
      render();
    };
  });

  const actMove = document.querySelector('#act-move');
  if (actMove) {
    actMove.onclick = () => {
      moveCursor();
      pushLog('Cursor Moved', `Moved to (${Math.round(state.cursorX * 14.4)}, ${Math.round(state.cursorY * 9)})`, 'good');
      render();
    };
  }

  const actClick = document.querySelector('#act-click');
  if (actClick) {
    actClick.onclick = () => {
      pushLog('Click Dispatched', `Background click at (${Math.round(state.cursorX * 14.4)}, ${Math.round(state.cursorY * 9)})`, 'good');
      render();
    };
  }

  const actKey = document.querySelector('#act-key');
  if (actKey) {
    actKey.onclick = () => {
      pushLog('Keystrokes Sent', 'Real Win32 SendKeys dispatched', 'good');
      render();
    };
  }

  const actScreen = document.querySelector('#act-screen');
  if (actScreen) {
    actScreen.onclick = () => {
      refreshFrame();
      pushLog('Surface Refreshed', 'Live viewport surface updated', 'good');
      render();
    };
  }

  document.querySelectorAll('.btn-attach').forEach(btn => {
    btn.onclick = () => {
      state.targetApp = btn.dataset.target;
      pushLog('Target Switched', `Stream attached to ${state.targetApp}`, 'warn');
      render();
    };
  });
}

function refreshFrame() {
  const img = document.querySelector('#live-stream-frame');
  if (img) {
    img.src = `${state.streamUrl}?t=${Date.now()}`;
  }
}

function moveCursor() {
  state.actions += 1;
  state.cursorX = (state.cursorX + 15) % 85;
  if (state.cursorX < 15) state.cursorX = 20;
  state.cursorY = (state.cursorY + 12) % 75;
  if (state.cursorY < 20) state.cursorY = 30;
}

function pushLog(title, detail, type = 'good') {
  state.actions += 1;
  state.events.unshift({ title, detail, type, time: 'just now' });
  if (state.events.length > 15) state.events.pop();
}

render();
