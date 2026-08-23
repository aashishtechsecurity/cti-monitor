export interface ResourceLink {
  name: string;
  category: 'malware' | 'sandbox' | 'crypto' | 'intel';
  getUrl: (query: string) => string;
  description: string;
}

export const CTI_RESOURCES: ResourceLink[] = [
  {
    name: 'VirusTotal',
    category: 'malware',
    getUrl: (q) => `https://www.virustotal.com/gui/search/${encodeURIComponent(q)}`,
    description: 'IP, Domain, File Hash & URL analysis',
  },
  {
    name: 'ANY.RUN',
    category: 'sandbox',
    getUrl: (q) => `https://app.any.run/submissions/#search=${encodeURIComponent(q)}`,
    description: 'Interactive cloud malware sandbox',
  },
  {
    name: 'Hatching Triage',
    category: 'sandbox',
    getUrl: (q) => `https://tria.ge/search?q=${encodeURIComponent(q)}`,
    description: 'High-volume automated sandbox analysis',
  },
  {
    name: 'Blockchain Explorer',
    category: 'crypto',
    getUrl: (q) => `https://www.blockchain.com/explorer/search?search=${encodeURIComponent(q)}`,
    description: 'Ransomware crypto address & TX tracker',
  },
  {
    name: 'PCRisk Malware DB',
    category: 'intel',
    getUrl: (q) => `https://www.pcrisk.com/?s=${encodeURIComponent(q)}`,
    description: 'Malware & threat removal database',
  },
  {
    name: 'The Raven File',
    category: 'intel',
    getUrl: () => 'https://theravenfile.com/',
    description: 'Breach repository & CTI intelligence',
  },
  {
    name: 'Ransomlook',
    category: 'intel',
    getUrl: () => 'https://www.ransomlook.io/',
    description: 'Ransomware leak site monitoring',
  },
  {
    name: 'Dexpose Ransomware',
    category: 'intel',
    getUrl: () => 'https://www.dexpose.io/category/ransomware-attacks/',
    description: 'Ransomware threat reports & breach news',
  },
];

export class AnalystToolbox {
  private containerId: string;
  private currentQuery: string = '';

  constructor(containerId: string) {
    this.containerId = containerId;
  }

  public render(): void {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    const query = this.currentQuery.trim();
    const hasQuery = query.length > 0;

    container.innerHTML = `
      <div class="panel-header">
        <span>🛡️ CTI ANALYST TOOLBOX & IOC INSPECTOR</span>
      </div>
      <div class="panel-body">
        <div style="margin-bottom: 12px;">
          <input
            type="text"
            id="ioc-input"
            placeholder="Enter IP Address, Domain, File Hash (MD5/SHA256) or Crypto Wallet..."
            value="${this.currentQuery}"
            style="width: 100%; padding: 8px 12px; background: rgba(0,0,0,0.4); border: 1px solid var(--border-color); color: #fff; border-radius: 4px; font-family: var(--font-mono); font-size: 11px;"
          />
        </div>

        <div style="margin-bottom: 8px; color: var(--text-muted); font-weight: bold; font-size: 10px;">QUICK LOOKUP ENGINES:</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px;">
          ${CTI_RESOURCES.map((res) => {
            const linkUrl = res.getUrl(query);
            return `
              <a href="${linkUrl}" target="_blank" rel="noopener noreferrer" style="display: block; padding: 8px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; text-decoration: none; color: inherit; transition: border-color 0.2s;" onmouseover="this.style.borderColor='var(--accent-blue)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.08)'">
                <div style="display: flex; justify-content: space-between; font-weight: bold; color: var(--accent-blue);">
                  <span>${res.name}</span>
                  <span style="font-size: 9px; padding: 1px 4px; background: rgba(56,189,248,0.15); border-radius: 3px;">${res.category}</span>
                </div>
                <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">${res.description}</div>
                ${hasQuery ? `<div style="font-size: 9px; color: var(--accent-green); margin-top: 4px; overflow: hidden; text-overflow: ellipsis;">Query: "${query}"</div>` : ''}
              </a>
            `;
          }).join('')}
        </div>
      </div>
    `;

    const input = container.querySelector('#ioc-input') as HTMLInputElement;
    if (input) {
      input.addEventListener('input', (e) => {
        this.currentQuery = (e.target as HTMLInputElement).value;
        this.render();
      });
    }
  }
}
