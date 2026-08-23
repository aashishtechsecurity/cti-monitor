export const PDNS_SAMPLE_RECORDS = [
    {
        domain: 'update-service-auth.com',
        ip: '185.220.101.5',
        firstSeen: '2026-01-10',
        lastSeen: 'Today',
        asn: 'AS20860 (IHOR-Services)',
        sslFingerprint: 'a89f72b1049c812d...',
    },
    {
        domain: 'login-telecom-portal.net',
        ip: '198.51.100.24',
        firstSeen: '2026-02-14',
        lastSeen: 'Today',
        asn: 'AS14061 (DigitalOcean)',
        sslFingerprint: '4c2195e801ab45f2...',
    },
    {
        domain: 'secure-c2-gateway.org',
        ip: '91.215.85.12',
        firstSeen: '2026-03-01',
        lastSeen: 'Yesterday',
        asn: 'AS51852 (Leaseweb)',
        sslFingerprint: '99bf0214a1c5d081...',
    },
];
export class PdnsPivotPanel {
    containerId;
    currentQuery = '185.220.101.5';
    constructor(containerId) {
        this.containerId = containerId;
    }
    render() {
        const container = document.getElementById(this.containerId);
        if (!container)
            return;
        container.innerHTML = `
      <div class="panel-header">
        <span>🔍 PASSIVE DNS (pDNS) & SSL PIVOT GRAPH</span>
        <span style="font-size: 10px; color: var(--accent-blue);">INFRASTRUCTURE PIVOT</span>
      </div>
      <div class="panel-body">
        <div style="margin-bottom: 8px;">
          <input
            type="text"
            id="pdns-input"
            placeholder="Pivot IP, Domain or SSL SHA-256 Fingerprint..."
            value="${this.currentQuery}"
            style="width: 100%; padding: 6px 10px; background: rgba(0,0,0,0.4); border: 1px solid var(--border-color); color: #fff; border-radius: 3px; font-family: var(--font-mono); font-size: 10px;"
          />
        </div>

        <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 6px;">HISTORICAL PASSIVE RESOLUTIONS & SSL FINGERPRINTS:</div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${PDNS_SAMPLE_RECORDS.map((rec) => `
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-left: 3px solid var(--accent-blue); border-radius: 2px;">
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 10px;">
                <a href="https://www.virustotal.com/gui/search/${rec.domain}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-blue); text-decoration: underline;">
                  🌐 ${rec.domain} ↗
                </a>
                <span style="color: var(--text-muted); font-size: 8px;">ASN: ${rec.asn}</span>
              </div>
              <div style="font-size: 9px; color: var(--text-main); margin-top: 3px; display: flex; justify-content: space-between;">
                <span>Bound IP: <strong style="color: var(--accent-green);">${rec.ip}</strong></span>
                <span>Active: ${rec.firstSeen} to ${rec.lastSeen}</span>
              </div>
              <div style="font-size: 8px; color: var(--text-muted); margin-top: 2px;">
                SSL Cert SHA-256: <code style="color: #94a3b8;">${rec.sslFingerprint}</code>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
        const input = container.querySelector('#pdns-input');
        if (input) {
            input.addEventListener('input', (e) => {
                this.currentQuery = e.target.value;
            });
        }
    }
}
