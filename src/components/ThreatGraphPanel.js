export class ThreatGraphPanel {
    containerId;
    constructor(containerId) {
        this.containerId = containerId;
    }
    render() {
        const container = document.getElementById(this.containerId);
        if (!container)
            return;
        container.innerHTML = `
      <div class="panel-header">
        <span>🕸️ IOC CORRELATION & THREAT GRAPH</span>
        <span style="font-size: 10px; color: var(--accent-blue);">GRAPH VISUALIZER</span>
      </div>
      <div class="panel-body">
        <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 8px;">
          Interactive CTI Chain: IP Indicator ➔ C2 Server ➔ Threat Actor ➔ Target ➔ Ransomware
        </div>

        <div style="padding: 10px; background: rgba(0,0,0,0.4); border: 1px solid var(--border-color); border-radius: 4px; overflow-x: auto;">
          <svg width="360" height="140" viewBox="0 0 360 140" style="width: 100%; height: auto;">
            <!-- Lines -->
            <line x1="40" y1="40" x2="110" y2="40" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4" />
            <line x1="110" y1="40" x2="180" y2="70" stroke="#ef4444" stroke-width="2" />
            <line x1="180" y1="70" x2="250" y2="40" stroke="#4ade80" stroke-width="2" />
            <line x1="250" y1="40" x2="320" y2="70" stroke="#f97316" stroke-width="2" />

            <!-- Nodes -->
            <!-- IP -->
            <circle cx="40" cy="40" r="16" fill="#0f172a" stroke="#38bdf8" stroke-width="2" />
            <text x="40" y="44" font-size="8" fill="#38bdf8" text-anchor="middle" font-family="monospace">185.220</text>

            <!-- C2 -->
            <circle cx="110" cy="40" r="16" fill="#0f172a" stroke="#ef4444" stroke-width="2" />
            <text x="110" y="44" font-size="8" fill="#ef4444" text-anchor="middle" font-family="monospace">Feodo C2</text>

            <!-- Actor -->
            <circle cx="180" cy="70" r="18" fill="#0f172a" stroke="#a855f7" stroke-width="2" />
            <text x="180" y="74" font-size="8" fill="#c084fc" text-anchor="middle" font-family="monospace">APT28</text>

            <!-- Target -->
            <circle cx="250" cy="40" r="16" fill="#0f172a" stroke="#4ade80" stroke-width="2" />
            <text x="250" y="44" font-size="8" fill="#4ade80" text-anchor="middle" font-family="monospace">🇮🇳 India</text>

            <!-- Ransomware -->
            <circle cx="320" cy="70" r="16" fill="#0f172a" stroke="#f97316" stroke-width="2" />
            <text x="320" y="74" font-size="8" fill="#f97316" text-anchor="middle" font-family="monospace">LockBit</text>
          </svg>
        </div>
      </div>
    `;
    }
}
