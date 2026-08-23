export const ACH_EVALUATIONS = [
    {
        actorName: 'APT28 (Fancy Bear / GRU)',
        confidenceScore: 88,
        evidenceCount: 14,
        competingHypothesis: 'Cybercrime Proxy / Copycat',
        competingScore: 12,
        primaryTtp: 'Spearphishing & Custom X-Agent Implant',
        verdict: 'HIGH CONFIDENCE ATTRIBUTION',
    },
    {
        actorName: 'Volt Typhoon (PRC State-Nexus)',
        confidenceScore: 92,
        evidenceCount: 18,
        competingHypothesis: 'Unattributed Access Broker',
        competingScore: 8,
        primaryTtp: 'Living-off-the-Land (LotL) & KV-Botnet',
        verdict: 'HIGH CONFIDENCE ATTRIBUTION',
    },
    {
        actorName: 'SideWinder (Rattlesnake)',
        confidenceScore: 84,
        evidenceCount: 11,
        competingHypothesis: 'Regional Espionage Group',
        competingScore: 16,
        primaryTtp: 'WarHawk LNK Payloads & Geo-fenced C2',
        verdict: 'HIGH CONFIDENCE ATTRIBUTION',
    },
    {
        actorName: 'Lazarus Group (DPRK)',
        confidenceScore: 78,
        evidenceCount: 9,
        competingHypothesis: 'Independent Crypto Syndicate',
        competingScore: 22,
        primaryTtp: 'TraderTraitor & FASTCash Extortion',
        verdict: 'MODERATE CONFIDENCE',
    },
];
export class AchAttributionPanel {
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
        <span>🎯 ACH ATTRIBUTION CONFIDENCE ENGINE (HEUER ACH)</span>
        <span style="font-size: 10px; color: var(--accent-blue);">PROBABILITY MATRIX</span>
      </div>
      <div class="panel-body">
        <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 8px;">
          Analysis of Competing Hypotheses (ACH) attribution confidence scores:
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${ACH_EVALUATIONS.map((h) => {
            let color = 'var(--accent-green)';
            if (h.verdict === 'MODERATE CONFIDENCE')
                color = '#eab308';
            else if (h.verdict === 'POSSIBLE FALSE-FLAG')
                color = 'var(--accent-red)';
            return `
              <div style="padding: 8px; background: rgba(255,255,255,0.03); border-left: 3px solid ${color}; border-radius: 2px;">
                <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: bold;">
                  <span style="color: var(--accent-blue);">${h.actorName}</span>
                  <span style="padding: 1px 4px; background: rgba(74,222,128,0.15); border-radius: 3px; color: ${color}; font-size: 8px;">
                    ${h.verdict} (${h.confidenceScore}%)
                  </span>
                </div>

                <!-- Confidence Bar -->
                <div style="width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; margin: 4px 0; overflow: hidden; display: flex;">
                  <div style="width: ${h.confidenceScore}%; height: 100%; background: ${color};"></div>
                  <div style="width: ${h.competingScore}%; height: 100%; background: rgba(239,68,68,0.4);"></div>
                </div>

                <div style="display: flex; justify-content: space-between; font-size: 8px; color: var(--text-muted);">
                  <span>Primary Evidence: <strong style="color: var(--text-main);">${h.evidenceCount} Artifacts</strong></span>
                  <span>Alternative Hypothesis: <strong style="color: #f87171;">${h.competingHypothesis} (${h.competingScore}%)</strong></span>
                </div>
              </div>
            `;
        }).join('')}
        </div>
      </div>
    `;
    }
}
