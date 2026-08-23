export const CYBER_POLICIES = [
    {
        title: 'Digital Personal Data Protection (DPDP) Act Enforcement Guidelines',
        jurisdiction: '🇮🇳 India',
        category: 'Data Protection',
        date: 'Recent',
        url: 'https://www.meity.gov.in/content/digital-personal-data-protection-act-2023',
        summary: 'MeitY releases operational rules requiring 6-hour mandatory cybersecurity incident reporting and data fiduciary compliance.',
    },
    {
        title: 'CISA CIRCIA Mandatory 72-Hour Ransomware & Incident Reporting',
        jurisdiction: '🇺🇸 United States',
        category: 'Incident Reporting',
        date: 'Recent',
        url: 'https://www.cisa.gov/circia',
        summary: 'Cyber Incident Reporting for Critical Infrastructure Act mandates covered entities report ransomware payments within 24h and breaches within 72h.',
    },
    {
        title: 'EU NIS2 Directive Enforcement Across Member States',
        jurisdiction: '🇪🇺 European Union',
        category: 'Critical Infrastructure',
        date: 'Recent',
        url: 'https://digital-strategy.ec.europa.eu/en/policies/nis2-directive',
        summary: 'Strengthened cybersecurity risk management and reporting requirements for essential and important European organizations.',
    },
];
export class CyberPolicyPanel {
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
        <span>💻 CYBER POLICY & REGULATORY INTELLIGENCE</span>
        <span style="font-size: 10px; color: var(--accent-blue);">LEGAL DOCUMENTS</span>
      </div>
      <div class="panel-body">
        <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 8px;">
          Cybersecurity laws, compliance mandates & incident reporting rules:
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${CYBER_POLICIES.map((p) => `
            <div style="padding: 8px; background: rgba(255,255,255,0.03); border-left: 3px solid var(--accent-blue); border-radius: 2px;">
              <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: bold;">
                <span style="color: var(--accent-blue);">${p.jurisdiction} • ${p.category}</span>
                <span style="color: var(--text-muted); font-size: 9px;">${p.date}</span>
              </div>
              <a href="${p.url}" target="_blank" rel="noopener noreferrer" style="display: block; color: var(--text-main); text-decoration: none; margin-top: 3px; font-weight: bold; font-size: 11px;" onmouseover="this.style.color='var(--accent-blue)';" onmouseout="this.style.color='var(--text-main)';">
                ${p.title} ↗
              </a>
              <div style="font-size: 9px; color: var(--text-muted); margin-top: 2px;">${p.summary}</div>
              <div style="margin-top: 4px; display: flex; justify-content: flex-end;">
                <a href="${p.url}" target="_blank" rel="noopener noreferrer" style="font-size: 8px; padding: 1px 6px; background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.3); border-radius: 3px; color: var(--accent-blue); text-decoration: none;">
                  🔗 Official Legal Document ↗
                </a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    }
}
