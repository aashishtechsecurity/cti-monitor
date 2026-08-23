export const SECTOR_RISKS = [
    { sector: 'Energy & Power Grid', threatLevel: 'CRITICAL', activeCampaigns: 14, targetedRegions: 'US, EU, IN, UA', cisaLink: 'https://www.cisa.gov/topics/critical-infrastructure-sectors/energy-sector' },
    { sector: 'Financial Services & Banking', threatLevel: 'HIGH', activeCampaigns: 19, targetedRegions: 'Global, US, APAC', cisaLink: 'https://www.cisa.gov/topics/critical-infrastructure-sectors/financial-services-sector' },
    { sector: 'Healthcare & Public Health', threatLevel: 'CRITICAL', activeCampaigns: 22, targetedRegions: 'US, EU, UK', cisaLink: 'https://www.cisa.gov/topics/critical-infrastructure-sectors/healthcare-and-public-health-sector' },
    { sector: 'Defense Industrial Base (DIB)', threatLevel: 'HIGH', activeCampaigns: 11, targetedRegions: 'US, NATO, APAC', cisaLink: 'https://www.cisa.gov/topics/critical-infrastructure-sectors/defense-industrial-base-sector' },
    { sector: 'Telecommunications & ISP', threatLevel: 'HIGH', activeCampaigns: 16, targetedRegions: 'Global, APAC, ME', cisaLink: 'https://www.cisa.gov/topics/critical-infrastructure-sectors/communications-sector' },
    { sector: 'Government & Municipalities', threatLevel: 'ELEVATED', activeCampaigns: 8, targetedRegions: 'EU, US, IN', cisaLink: 'https://www.cisa.gov/topics/critical-infrastructure-sectors/government-facilities-sector' },
];
export class SectorHeatmapPanel {
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
        <span>🏭 CRITICAL INFRASTRUCTURE (CII) THREAT HEATMAP</span>
        <span style="font-size: 10px; color: var(--accent-red);">CISA ADVISORY LINKS</span>
      </div>
      <div class="panel-body">
        <div style="display: flex; flex-direction: column; gap: 6px;">
          ${SECTOR_RISKS.map((s) => {
            let color = 'var(--accent-blue)';
            if (s.threatLevel === 'CRITICAL')
                color = 'var(--accent-red)';
            else if (s.threatLevel === 'HIGH')
                color = '#f97316';
            else if (s.threatLevel === 'ELEVATED')
                color = '#eab308';
            return `
              <div style="padding: 8px; background: rgba(255,255,255,0.03); border-left: 3px solid ${color}; border-radius: 2px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; align-items: center;">
                  <a href="${s.cisaLink}" target="_blank" rel="noopener noreferrer" style="color: var(--text-main); text-decoration: none;" onmouseover="this.style.color='var(--accent-blue)';" onmouseout="this.style.color='var(--text-main)';">
                    ${s.sector} ↗
                  </a>
                  <a href="${s.cisaLink}" target="_blank" rel="noopener noreferrer" style="font-size: 9px; padding: 1px 6px; background: rgba(255,255,255,0.1); border-radius: 3px; color: ${color}; text-decoration: none;">
                    ${s.threatLevel} Advisory ↗
                  </a>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 9px; color: var(--text-muted); margin-top: 3px;">
                  <span>Active Campaigns: <strong style="color: var(--text-main);">${s.activeCampaigns}</strong></span>
                  <span>Regions: ${s.targetedRegions}</span>
                </div>
              </div>
            `;
        }).join('')}
        </div>
      </div>
    `;
    }
}
