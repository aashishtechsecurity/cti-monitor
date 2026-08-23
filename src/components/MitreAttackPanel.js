export const MITRE_TECHNIQUES = [
    {
        id: 'T1190',
        name: 'Exploit Public-Facing Application',
        tactic: 'Initial Access',
        description: 'Adversaries exploit software vulnerabilities in web servers or remote services to gain initial foothold.',
        observedGroups: ['APT28', 'LockBit 3.0', 'Volt Typhoon', 'Akira'],
    },
    {
        id: 'T1566',
        name: 'Phishing: Spearphishing Link',
        tactic: 'Initial Access',
        description: 'Sending targeted emails with malicious attachments or links to compromise victim endpoints.',
        observedGroups: ['APT29', 'SideWinder', 'BlackCat'],
    },
    {
        id: 'T1059',
        name: 'Command and Scripting Interpreter',
        tactic: 'Execution',
        description: 'Execution of PowerShell, CMD, or Bash scripts to run malicious payloads on victim hosts.',
        observedGroups: ['LockBit 3.0', 'Qakbot', 'Play Ransomware'],
    },
    {
        id: 'T1078',
        name: 'Valid Accounts',
        tactic: 'Persistence',
        description: 'Obtaining and reusing legitimate credentials (VPN, RDP, Cloud IAM) to maintain access.',
        observedGroups: ['Volt Typhoon', 'Akira', 'ALPHV'],
    },
    {
        id: 'T1003',
        name: 'OS Credential Dumping',
        tactic: 'Credential Access',
        description: 'Extracting LSASS memory or SAM registry hashes to obtain administrative credentials.',
        observedGroups: ['Cobalt Strike', 'Mimikatz Users', 'LockBit 3.0'],
    },
    {
        id: 'T1486',
        name: 'Data Encrypted for Impact',
        tactic: 'Impact',
        description: 'Encrypting files on target systems to interrupt operations and extort ransom payments.',
        observedGroups: ['LockBit 3.0', 'BlackCat', 'Akira', 'Play Ransomware'],
    },
];
export class MitreAttackPanel {
    containerId;
    selectedTechnique = null;
    constructor(containerId) {
        this.containerId = containerId;
    }
    render() {
        const container = document.getElementById(this.containerId);
        if (!container)
            return;
        container.innerHTML = `
      <div class="panel-header">
        <span>⚔️ MITRE ATT&CK® TTP MATRIX & CAMPAIGNS</span>
        <span style="font-size: 10px; color: var(--accent-blue);">VERIFIED TTP LINKS</span>
      </div>
      <div class="panel-body">
        <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 8px;">
          Select a Technique to view adversary attribution and official MITRE documentation:
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 6px; margin-bottom: 10px;">
          ${MITRE_TECHNIQUES.map((t) => {
            const isSelected = this.selectedTechnique?.id === t.id;
            return `
              <button
                class="ttp-btn"
                data-id="${t.id}"
                style="padding: 6px 8px; background: ${isSelected ? 'rgba(56,189,248,0.25)' : 'rgba(255,255,255,0.03)'}; border: 1px solid ${isSelected ? 'var(--accent-blue)' : 'rgba(255,255,255,0.1)'}; color: var(--text-main); border-radius: 4px; font-family: var(--font-mono); font-size: 10px; text-align: left; cursor: pointer;"
              >
                <div style="font-weight: bold; color: var(--accent-blue);">${t.id}</div>
                <div style="font-size: 9px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${t.name}</div>
              </button>
            `;
        }).join('')}
        </div>

        <div id="ttp-details-box" style="padding: 10px; background: rgba(0,0,0,0.3); border: 1px dashed var(--border-color); border-radius: 4px;">
          ${this.renderDetails()}
        </div>
      </div>
    `;
        const buttons = container.querySelectorAll('.ttp-btn');
        buttons.forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                this.selectedTechnique = MITRE_TECHNIQUES.find((t) => t.id === id) || null;
                this.render();
            });
        });
    }
    renderDetails() {
        if (!this.selectedTechnique) {
            const defaultT = MITRE_TECHNIQUES[0];
            this.selectedTechnique = defaultT;
        }
        const t = this.selectedTechnique;
        const mitreUrl = `https://attack.mitre.org/techniques/${t.id}/`;
        return `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div style="font-weight: bold; color: var(--accent-blue); font-size: 11px;">
          <a href="${mitreUrl}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-blue); text-decoration: underline;">
            ${t.id}: ${t.name} ↗
          </a>
          <span style="font-size: 9px; padding: 2px 4px; background: rgba(56,189,248,0.15); border-radius: 3px; color: var(--accent-green); font-weight: normal; margin-left: 6px;">${t.tactic}</span>
        </div>
        <a href="${mitreUrl}" target="_blank" rel="noopener noreferrer" style="padding: 2px 6px; background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.3); border-radius: 3px; color: var(--accent-blue); text-decoration: none; font-size: 9px;">
          🔗 Official MITRE Page ↗
        </a>
      </div>
      <div style="font-size: 11px; color: var(--text-main); margin-top: 4px;">${t.description}</div>
      <div style="font-size: 10px; color: var(--accent-red); margin-top: 6px; font-weight: bold;">
        OBSERVED THREAT GROUPS: <span style="color: var(--text-main); font-weight: normal;">${t.observedGroups.join(', ')}</span>
      </div>
    `;
    }
}
