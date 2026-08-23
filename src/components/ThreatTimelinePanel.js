export const THREAT_EVENTS = [
    { timestamp: '10 mins ago', headline: 'LockBit 3.0 Claims Responsibility for Breach of Logistics Provider', category: 'Ransomware', severity: 'CRITICAL', url: 'https://www.ransomlook.io/' },
    { timestamp: '45 mins ago', headline: 'CISA Adds Critical Ivanti Connect Secure RCE to KEV Catalog', category: 'Zero-Day', severity: 'CRITICAL', url: 'https://nvd.nist.gov/' },
    { timestamp: '2 hours ago', headline: 'Volt Typhoon Activity Detected Targeting Telecommunications Gateways', category: 'APT Campaign', severity: 'HIGH', url: 'https://attack.mitre.org/groups/G1017/' },
    { timestamp: '4 hours ago', headline: 'Cloudflare Edge Network Mitigates 3.8 Tbps Multi-Vector DDoS Attack', category: 'Outage', severity: 'HIGH', url: 'https://www.cloudflarestatus.com/' },
];
export class ThreatTimelinePanel {
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
        <span>⏳ CYBER THREAT EVENT TIMELINE</span>
        <span style="font-size: 10px; color: var(--accent-blue);">CHRONOLOGICAL LOG</span>
      </div>
      <div class="panel-body">
        <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 8px;">
          Chronological log of high-impact breach disclosures & zero-day events:
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${THREAT_EVENTS.map((e) => {
            let color = 'var(--accent-red)';
            if (e.severity === 'HIGH')
                color = '#f97316';
            return `
              <div style="padding: 8px; background: rgba(255,255,255,0.03); border-left: 3px solid ${color}; border-radius: 2px;">
                <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: bold;">
                  <span style="color: ${color};">${e.category}</span>
                  <span style="color: var(--text-muted); font-size: 9px;">${e.timestamp}</span>
                </div>
                <a href="${e.url}" target="_blank" rel="noopener noreferrer" style="display: block; color: var(--text-main); text-decoration: none; margin-top: 3px; font-weight: bold; font-size: 11px;" onmouseover="this.style.color='var(--accent-blue)';" onmouseout="this.style.color='var(--text-main)';">
                  ${e.headline} ↗
                </a>
              </div>
            `;
        }).join('')}
        </div>
      </div>
    `;
    }
}
