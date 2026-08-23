export const CERT_ADVISORIES = [
    {
        title: 'CIVN-2024-0021: Vulnerabilities in Enterprise VPN Infrastructure',
        agency: 'CERT-In (India)',
        severity: 'CRITICAL',
        date: 'Today',
        url: 'https://www.cert-in.org.in/',
        summary: 'High-severity command injection flaw in enterprise SSL VPN gateways allowing unauthenticated remote code execution.',
    },
    {
        title: 'AA24-038A: Volt Typhoon Compromises US Critical Infrastructure',
        agency: 'US-CERT (CISA)',
        severity: 'CRITICAL',
        date: 'Today',
        url: 'https://www.cisa.gov/news-events/cybersecurity-advisories',
        summary: 'Joint CISA & FBI advisory on Chinese state-sponsored actor pre-positioning inside IT networks of US critical infrastructure.',
    },
    {
        title: 'NCSC Advisory: Mitigating Ransomware Attacks on Supply Chains',
        agency: 'UK NCSC',
        severity: 'HIGH',
        date: 'Yesterday',
        url: 'https://www.ncsc.gov.uk/section/keep-up-to-date/reports-advisories',
        summary: 'Guidance on securing managed service provider (MSP) access against double-extortion ransomware operators.',
    },
    {
        title: 'ENISA Threat Landscape: Cyber Attacks on Healthcare & Energy',
        agency: 'EU ENISA',
        severity: 'HIGH',
        date: 'Yesterday',
        url: 'https://www.enisa.europa.eu/topics/cyber-threats',
        summary: 'Operational report highlighting elevated state-nexus APT activity targeting EU critical national infrastructure.',
    },
];
export class CertAdvisoriesPanel {
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
        <span>🚨 GLOBAL CERT SECURITY ADVISORIES</span>
        <span style="font-size: 10px; color: var(--accent-red);">OFFICIAL BULLETINS</span>
      </div>
      <div class="panel-body">
        <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 8px;">
          Government emergency response team advisories (CERT-In, CISA, NCSC):
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${CERT_ADVISORIES.map((a) => {
            let color = 'var(--accent-red)';
            if (a.severity === 'HIGH')
                color = '#f97316';
            return `
              <div style="padding: 8px; background: rgba(255,255,255,0.03); border-left: 3px solid ${color}; border-radius: 2px;">
                <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: bold;">
                  <span style="color: var(--accent-blue);">${a.agency}</span>
                  <span style="color: var(--text-muted); font-size: 9px;">${a.date}</span>
                </div>
                <a href="${a.url}" target="_blank" rel="noopener noreferrer" style="display: block; color: var(--text-main); text-decoration: none; margin-top: 3px; font-weight: bold; font-size: 11px;" onmouseover="this.style.color='var(--accent-blue)';" onmouseout="this.style.color='var(--text-main)';">
                  ${a.title} ↗
                </a>
                <div style="font-size: 9px; color: var(--text-muted); margin-top: 2px;">${a.summary}</div>
                <div style="margin-top: 4px; display: flex; justify-content: flex-end;">
                  <a href="${a.url}" target="_blank" rel="noopener noreferrer" style="font-size: 8px; padding: 1px 6px; background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.3); border-radius: 3px; color: var(--accent-blue); text-decoration: none;">
                    🔗 Official CERT Bulletin ↗
                  </a>
                </div>
              </div>
            `;
        }).join('')}
        </div>
      </div>
    `;
    }
}
