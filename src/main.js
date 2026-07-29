// Agent Control Room - Core Interactive Application Logic

const state = {
  activeTab: 'Live room',
  paused: false,
  recording: false,
  targetApp: 'Godot 4.5',
  actions: 842,
  latency: 220,
  confidence: 98.4,
  events: [
    { title: 'Screenshot captured', detail: 'Godot 4.5 · 640 × 400 crop', type: 'good', time: '220ms' },
    { title: 'Pointer moved', detail: 'target Door · client 798, 442', type: 'good', time: '410ms' },
    { title: 'Focus preserved', detail: 'active window unchanged · synthetic cursor', type: 'warn', time: '1.2s' },
    { title: 'Window attached', detail: 'hwnd 0x009A · Godot bridge connected', type: 'good', time: '4.8s' }
  ],
  apps: [
    { name: 'Godot 4.5', pid: '1842', details: 'platformer-demo · hwnd 0x009A', icon: 'godot', state: 'LOCKED' },
    { name: 'Google Chrome', pid: '4108', details: 'localhost:3000 · DevTools Protocol', icon: 'chrome', state: 'MONITORED' },
    { name: 'VS Code', pid: '9821', details: 'agent-control-mcp · Workspace', icon: 'code', state: 'IDLE' },
    { name: 'Windows Terminal', pid: '1204', details: 'powershell session · PID 1204', icon: 'terminal', state: 'IDLE' }
  ],
  guardrails: {
    focusPreserve: true,
    approvalGate: true,
    evidenceCapture: true,
    networkIsolation: true,
    clipboardGuard: false
  },
  adapters: [
    { name: 'Godot Engine Bridge', proto: 'WebSocket', status: 'Healthy', ping: '0.8ms', version: 'v4.5-stable' },
    { name: 'Chrome DevTools Protocol', proto: 'CDP / HTTP', status: 'Healthy', ping: '2.4ms', version: 'v124.0' },
    { name: 'VS Code Language Server', proto: 'JSON-RPC / IPC', status: 'Connected', ping: '1.1ms', version: 'v1.88' },
    { name: 'OS Synthetic Input Adapter', proto: 'Win32 API', status: 'Active', ping: '0.3ms', version: 'Native Direct' }
  ],
  replays: [
    { frame: '#00842', action: 'Click (798, 442)', target: 'Door Node', timestamp: '12:14:02' },
    { frame: '#00841', action: 'Move Pointer', target: 'Player Sprite', timestamp: '12:13:58' },
    { frame: '#00840', action: 'Capture Screenshot', target: 'Full Viewport', timestamp: '12:13:50' },
    { frame: '#00839', action: 'KeyPress (Space)', target: 'Jump Action', timestamp: '12:13:42' }
  ],
  searchQuery: '',
  eventFilter: 'all'
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
  'lock-keyhole': '🔒',
  'refresh-cw': '🔄',
  'search': '🔍'
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
            <b>Agent Control</b>
            <small>Live Control Room</small>
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
          <b>Local Bridge Connected</b>
          <div class="health-status">
            <div class="dot-pulse"></div>
            <span>localhost:4317</span>
            <code style="margin-left: auto; color: var(--accent);">0.8ms</code>
          </div>
        </div>
      </aside>

      <!-- Main Header -->
      <header class="top">
        <div class="breadcrumbs">
          <span>Agent Control MCP</span>
          <span>/</span>
          <b>${state.activeTab}</b>
        </div>
        <div class="top-right">
          <div class="session-badge ${state.recording ? 'recording' : ''}">
            <div class="dot-pulse" style="${state.recording ? 'background: var(--red); box-shadow: 0 0 10px var(--red);' : ''}"></div>
            ${state.recording ? 'RECORDING SESSION' : 'LIVE SESSION'}
          </div>
          <div class="user-avatar">AC</div>
        </div>
      </header>

      <!-- Main Viewport -->
      <main>
        ${renderContent()}
        
        <p style="margin-top: 32px; font-size: 12px; color: var(--quiet); display: flex; align-items: center; gap: 8px;">
          ${getIcon('lock-keyhole')} Scoped Safety: Target window is strictly isolated. All background dispatches maintain focus preservation.
        </p>
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
        <label>SCOPED COMPUTER USE</label>
        <h1>See what the agent sees.</h1>
        <p>One live target, every action visible. Keep working elsewhere while the agent operates in the background.</p>
      </div>
      <div class="hero-actions">
        <button class="btn" id="btn-pause">
          ${getIcon(state.paused ? 'play' : 'pause')} ${state.paused ? 'Resume Agent' : 'Pause Agent'}
        </button>
        <button class="btn btn-primary" id="btn-capture">
          ${getIcon('camera')} Capture Now
        </button>
      </div>
    </div>

    <!-- Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-header">
          <span>Active Target</span>
          ${getIcon('crosshair')}
        </div>
        <div class="metric-value">${state.targetApp}</div>
        <div class="metric-sub good">● Window locked · focus preserved</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span>Actions Executed</span>
          ${getIcon('mouse-pointer-2')}
        </div>
        <div class="metric-value" id="val-actions">${state.actions}</div>
        <div class="metric-sub good">+118 in current session</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span>Capture Latency</span>
          ${getIcon('gauge')}
        </div>
        <div class="metric-value">${state.latency}ms</div>
        <div class="metric-sub">P95 310ms · fallback ready</div>
      </div>

      <div class="metric-card">
        <div class="metric-header">
          <span>Agent Confidence</span>
          ${getIcon('sparkles')}
        </div>
        <div class="metric-value">${state.confidence}%</div>
        <div class="metric-sub good">Semantic + visual agreement</div>
      </div>
    </div>

    <!-- Content Grid -->
    <div class="content-grid">
      <div>
        <!-- Live Target Panel -->
        <div class="panel">
          <div class="panel-header">
            <span class="panel-title">Live Target Stream</span>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span class="panel-code">FRAME #00842 · 60 FPS</span>
              <button class="btn" id="btn-record" style="padding: 6px 12px; font-size: 12px;">
                ${getIcon('circle')} ${state.recording ? 'Stop Recording' : 'Record Session'}
              </button>
            </div>
          </div>

          <div class="viewport-container">
            <div class="target-bar">
              <div class="app-info">
                <div class="app-icon godot">G</div>
                <div>
                  <b style="font-size: 13px;">${state.targetApp}</b>
                  <div style="font-size: 11px; color: var(--quiet); font-family: var(--mono);">platformer-demo · background input</div>
                </div>
              </div>
            </div>

            <div class="screen-canvas" id="interactive-screen">
              <div class="screen-tag tag-top-left">RUNNING</div>
              <div class="screen-tag tag-top-right">scene/main.tscn</div>
              
              <div class="game-world">
                <div class="door-target"></div>
                <div class="player-avatar" id="player-sprite"></div>
                <div class="ground-line"></div>
                <div class="crosshair"></div>
              </div>

              <div class="screen-tag tag-bottom-left">window only</div>
              <div class="screen-tag tag-bottom-right">
                <div class="dot-pulse"></div> Live capture
              </div>
            </div>

            <div class="action-bar">
              <button class="action-btn" id="act-move">${getIcon('mouse-pointer-2')} Move Pointer</button>
              <button class="action-btn" id="act-click">${getIcon('mouse-pointer-click')} Click Target</button>
              <button class="action-btn" id="act-key">${getIcon('keyboard')} Send Key</button>
              <button class="action-btn" id="act-screen">${getIcon('camera')} Capture Frame</button>
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
        <label>PROCESS DETECTION</label>
        <h1>Detected Applications</h1>
        <p>Inspect active desktop windows and attach agent control targets safely.</p>
      </div>
      <div class="hero-actions">
        <button class="btn btn-primary" id="btn-refresh-apps">${getIcon('refresh-cw')} Refresh Processes</button>
      </div>
    </div>

    <div class="panel">
      <div class="filter-bar">
        <input type="text" class="search-input" id="app-search" placeholder="Search application name or PID..." value="${state.searchQuery}">
      </div>

      <div class="app-list">
        ${state.apps
          .filter(a => a.name.toLowerCase().includes(state.searchQuery.toLowerCase()))
          .map(app => `
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
                  ${app.name === state.targetApp ? 'Active Target' : 'Attach Target'}
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
      <div class="hero-actions">
        <button class="btn btn-primary" id="btn-export-replay">${getIcon('scroll-text')} Export Replay Bundle</button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Recorded Session Keyframes</span>
        <span class="panel-code">4 FRAMES STORED</span>
      </div>

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
      <div class="hero-actions">
        <button class="btn" id="btn-clear-logs">Clear Stream</button>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <span class="panel-title">Live Log Console</span>
        <span class="panel-code">AUTO-SCROLL ENABLED</span>
      </div>

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
      <div class="panel-header">
        <span class="panel-title">Security Policies</span>
        <span class="panel-code">ENFORCED AT BRIDGES</span>
      </div>

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

      <div class="guard-item">
        <div class="guard-info">
          <b>Approval Gate</b>
          <small>Require explicit human confirmation for file deletion and shell commands</small>
        </div>
        <label class="switch">
          <input type="checkbox" id="guard-approval" ${state.guardrails.approvalGate ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>

      <div class="guard-item">
        <div class="guard-info">
          <b>Evidence Capture</b>
          <small>Record full screenshot timeline and action metadata</small>
        </div>
        <label class="switch">
          <input type="checkbox" id="guard-evidence" ${state.guardrails.evidenceCapture ? 'checked' : ''}>
          <span class="slider"></span>
        </label>
      </div>

      <div class="guard-item">
        <div class="guard-info">
          <b>Network Sandbox</b>
          <small>Restrict outbound network connections to local MCP endpoints</small>
        </div>
        <label class="switch">
          <input type="checkbox" id="guard-network" ${state.guardrails.networkIsolation ? 'checked' : ''}>
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
      <div class="hero-actions">
        <button class="btn btn-primary" id="btn-ping-adapters">${getIcon('refresh-cw')} Run Health Diagnostics</button>
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
  // Navigation tabs
  document.querySelectorAll('[data-tab]').forEach(btn => {
    btn.onclick = () => {
      state.activeTab = btn.dataset.tab;
      render();
    };
  });

  // Action buttons
  const pauseBtn = document.querySelector('#btn-pause');
  if (pauseBtn) {
    pauseBtn.onclick = () => {
      state.paused = !state.paused;
      pushLog(state.paused ? 'Agent Paused' : 'Agent Resumed', state.paused ? 'background dispatch held' : 'dispatch restored', state.paused ? 'warn' : 'good');
      render();
    };
  }

  const recordBtn = document.querySelector('#btn-record');
  if (recordBtn) {
    recordBtn.onclick = () => {
      state.recording = !state.recording;
      pushLog(state.recording ? 'Recording Started' : 'Recording Stopped', 'session evidence capture active', state.recording ? 'good' : 'warn');
      render();
    };
  }

  const captureBtn = document.querySelector('#btn-capture');
  if (captureBtn) {
    captureBtn.onclick = () => {
      pushLog('Screenshot Captured', `${state.targetApp} · 1440 × 900 frame`, 'good');
      render();
    };
  }

  // Interactive controls
  const actMove = document.querySelector('#act-move');
  if (actMove) {
    actMove.onclick = () => {
      movePlayer();
      pushLog('Pointer Moved', 'target Door · client 798, 442', 'good');
      render();
    };
  }

  const actClick = document.querySelector('#act-click');
  if (actClick) {
    actClick.onclick = () => {
      pushLog('Click Dispatched', 'Door Node · background click', 'good');
      render();
    };
  }

  const actKey = document.querySelector('#act-key');
  if (actKey) {
    actKey.onclick = () => {
      pushLog('Key Sent', 'Space · jump action', 'good');
      render();
    };
  }

  const actScreen = document.querySelector('#act-screen');
  if (actScreen) {
    actScreen.onclick = () => {
      pushLog('Screenshot Captured', 'viewport crop · focus preserved', 'good');
      render();
    };
  }

  // Attach buttons
  document.querySelectorAll('.btn-attach').forEach(btn => {
    btn.onclick = () => {
      state.targetApp = btn.dataset.target;
      pushLog('Target Switched', `Attached to ${state.targetApp}`, 'warn');
      render();
    };
  });

  // Search input
  const searchInput = document.querySelector('#app-search');
  if (searchInput) {
    searchInput.oninput = (e) => {
      state.searchQuery = e.target.value;
      render();
    };
  }

  // Refresh processes
  const refreshApps = document.querySelector('#btn-refresh-apps');
  if (refreshApps) {
    refreshApps.onclick = () => {
      pushLog('Processes Refreshed', '4 active windows detected', 'good');
      render();
    };
  }

  // Health diagnostics
  const pingBtn = document.querySelector('#btn-ping-adapters');
  if (pingBtn) {
    pingBtn.onclick = () => {
      pushLog('Diagnostics Ran', 'All 4 bridges healthy (avg 1.1ms)', 'good');
      render();
    };
  }
}

function movePlayer() {
  state.actions += 1;
  const sprite = document.querySelector('#player-sprite');
  if (sprite) {
    const currentLeft = parseInt(sprite.style.left || '35', 10);
    const newLeft = currentLeft > 60 ? 25 : currentLeft + 15;
    sprite.style.left = `${newLeft}%`;
  }
}

function pushLog(title, detail, type = 'good') {
  state.actions += 1;
  state.events.unshift({
    title,
    detail,
    type,
    time: 'just now'
  });
  if (state.events.length > 15) state.events.pop();
}

// Initial render
render();
