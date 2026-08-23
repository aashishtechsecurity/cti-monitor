export interface OutageService {
  name: string;
  category: 'Cloud Provider' | 'Security Vendor' | 'DNS / CDN';
  status: 'OPERATIONAL' | 'DEGRADED' | 'OUTAGE';
  statusPageUrl: string;
  latencyMs: number;
}

export const OUTAGE_SERVICES: OutageService[] = [
  { name: 'Amazon Web Services (AWS)', category: 'Cloud Provider', status: 'OPERATIONAL', statusPageUrl: 'https://health.aws.amazon.com/health/status', latencyMs: 42 },
  { name: 'Microsoft Azure', category: 'Cloud Provider', status: 'OPERATIONAL', statusPageUrl: 'https://azure.status.microsoft.com/', latencyMs: 38 },
  { name: 'Google Cloud Platform (GCP)', category: 'Cloud Provider', status: 'OPERATIONAL', statusPageUrl: 'https://status.cloud.google.com/', latencyMs: 35 },
  { name: 'Cloudflare Edge Net', category: 'DNS / CDN', status: 'OPERATIONAL', statusPageUrl: 'https://www.cloudflarestatus.com/', latencyMs: 18 },
  { name: 'CrowdStrike Falcon Platform', category: 'Security Vendor', status: 'OPERATIONAL', statusPageUrl: 'https://status.crowdstrike.com/', latencyMs: 45 },
  { name: 'Microsoft Defender XDR', category: 'Security Vendor', status: 'OPERATIONAL', statusPageUrl: 'https://status.office365.com/', latencyMs: 52 },
  { name: 'SentinelOne Singularity', category: 'Security Vendor', status: 'OPERATIONAL', statusPageUrl: 'https://status.sentinelone.com/', latencyMs: 48 },
  { name: 'Zscaler Cloud Security', category: 'Security Vendor', status: 'OPERATIONAL', statusPageUrl: 'https://trust.zscaler.com/', latencyMs: 30 },
];

export class OutagesPanel {
  private containerId: string;

  constructor(containerId: string) {
    this.containerId = containerId;
  }

  public render(): void {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="panel-header">
        <span>🌐 CLOUD & SECURITY INFRASTRUCTURE OUTAGES</span>
        <span style="font-size: 10px; color: var(--accent-green);">DIRECT STATUS PAGES</span>
      </div>
      <div class="panel-body">
        <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 8px;">
          Live health status of cloud providers & EDR security platforms:
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 6px;">
          ${OUTAGE_SERVICES.map((s) => {
            let color = 'var(--accent-green)';
            if (s.status === 'DEGRADED') color = '#eab308';
            else if (s.status === 'OUTAGE') color = 'var(--accent-red)';

            return `
              <div style="padding: 6px 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <a href="${s.statusPageUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--text-main); font-weight: bold; font-size: 10px; text-decoration: none;" onmouseover="this.style.color='var(--accent-blue)';" onmouseout="this.style.color='var(--text-main)';">
                    ${s.name} ↗
                  </a>
                  <span style="font-size: 8px; padding: 1px 4px; background: rgba(74,222,128,0.15); border-radius: 3px; color: ${color}; font-weight: bold;">
                    ${s.status}
                  </span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 8px; color: var(--text-muted); margin-top: 4px;">
                  <span>${s.category}</span>
                  <a href="${s.statusPageUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-blue); text-decoration: underline;">
                    🔗 Status Page ↗
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
