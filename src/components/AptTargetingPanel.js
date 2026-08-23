export const COUNTRY_NAMES = {
    IN: '🇮🇳 India',
    US: '🇺🇸 United States',
    DE: '🇩🇪 Germany',
    JP: '🇯🇵 Japan',
    UK: '🇬🇧 United Kingdom',
    FR: '🇫🇷 France',
    SG: '🇸🇬 Singapore',
    UA: '🇺🇦 Ukraine',
    PK: '🇵🇰 Pakistan',
    CA: '🇨🇦 Canada',
};
export class AptTargetingPanel {
    containerId;
    selectedCountry = 'IN';
    aptData = [];
    onSelectCallback;
    constructor(containerId, onSelectCallback) {
        this.containerId = containerId;
        this.onSelectCallback = onSelectCallback;
    }
    async render() {
        const container = document.getElementById(this.containerId);
        if (!container)
            return;
        if (this.aptData.length === 0) {
            try {
                const res = await fetch('/data/cti/apt-country-targeting.json');
                if (res.ok) {
                    const json = await res.json();
                    this.aptData = json.groups || [];
                }
            }
            catch { }
        }
        const matchingGroups = this.aptData.filter((g) => g.targetCountries.includes(this.selectedCountry));
        container.innerHTML = `
      <div class="panel-header">
        <span>🎯 APT & RANSOMWARE COUNTRY TARGETING</span>
        <span style="font-size: 10px; color: var(--accent-blue);">VERIFIED SOURCE PROFILES</span>
      </div>
      <div class="panel-body">
        <div style="margin-bottom: 10px;">
          <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">SELECT TARGET COUNTRY TO INSPECT:</div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            ${Object.entries(COUNTRY_NAMES).map(([code, name]) => {
            const isSel = this.selectedCountry === code;
            return `
                <button
                  class="country-btn"
                  data-code="${code}"
                  style="padding: 4px 8px; background: ${isSel ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${isSel ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)'}; color: var(--text-main); border-radius: 3px; font-family: var(--font-mono); font-size: 10px; cursor: pointer;"
                >
                  ${name}
                </button>
              `;
        }).join('')}
          </div>
        </div>

        <div style="font-size: 11px; font-weight: bold; color: var(--accent-blue); margin-bottom: 6px;">
          TARGETED BY ${matchingGroups.length} THREAT GROUPS IN ${COUNTRY_NAMES[this.selectedCountry] || this.selectedCountry}:
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${matchingGroups.map((g) => {
            const mitreUrl = g.mitreLink || `https://attack.mitre.org/groups/`;
            return `
              <div style="padding: 8px; background: rgba(255,255,255,0.03); border-left: 3px solid var(--accent-blue); border-radius: 2px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px;">
                  <a href="${mitreUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-blue); text-decoration: underline;">
                    🎯 ${g.name} ↗
                  </a>
                  <span style="color: var(--text-muted); font-size: 9px;">Origin: ${g.origin}</span>
                </div>
                <div style="font-size: 10px; color: var(--text-main); margin-top: 3px;">
                  ${g.description}
                </div>
                <div style="font-size: 9px; color: var(--text-muted); margin-top: 4px; display: flex; justify-content: space-between; align-items: center;">
                  <span>Sectors: <strong style="color: var(--text-main);">${g.targetSectors.join(', ')}</strong></span>
                  <a href="${mitreUrl}" target="_blank" rel="noopener noreferrer" style="padding: 1px 6px; background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.3); border-radius: 3px; color: var(--accent-blue); text-decoration: none;">
                    🔗 MITRE ATT&CK Profile ↗
                  </a>
                </div>
              </div>
            `;
        }).join('')}
        </div>
      </div>
    `;
        container.querySelectorAll('.country-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const code = e.currentTarget.getAttribute('data-code');
                if (code) {
                    this.selectedCountry = code;
                    if (this.onSelectCallback)
                        this.onSelectCallback(code);
                    this.render();
                }
            });
        });
    }
}
