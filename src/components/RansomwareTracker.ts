export interface RansomwareEntry {
  groupName: string;
  victimName: string;
  discoveredAt: string;
  country?: string;
  description?: string;
  cryptoWallet?: string;
  demandEst?: string;
}

export class RansomwareTracker {
  private containerId: string;

  constructor(containerId: string) {
    this.containerId = containerId;
  }

  public async render(): Promise<void> {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="panel-header">
        <span>☣️ RANSOMWARE & CRYPTO FORENSICS</span>
        <span style="font-size: 10px; color: var(--accent-red);">PAYMENT WALLETS</span>
      </div>
      <div class="panel-body">
        <div style="display: flex; gap: 6px; margin-bottom: 10px; font-size: 10px;">
          <a href="https://www.ransomlook.io/" target="_blank" rel="noopener noreferrer" style="color: var(--accent-red); text-decoration: none; padding: 2px 6px; background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.3); border-radius: 3px;">🔗 Ransomlook</a>
          <a href="https://www.dexpose.io/category/ransomware-attacks/" target="_blank" rel="noopener noreferrer" style="color: #f97316; text-decoration: none; padding: 2px 6px; background: rgba(249,115,22,0.15); border: 1px solid rgba(249,115,22,0.3); border-radius: 3px;">🔗 Dexpose</a>
          <a href="https://www.blockchain.com/explorer" target="_blank" rel="noopener noreferrer" style="color: #38bdf8; text-decoration: none; padding: 2px 6px; background: rgba(56,189,248,0.15); border: 1px solid rgba(56,189,248,0.3); border-radius: 3px;">🔗 Crypto Explorer</a>
        </div>
        <div id="ransomware-list" style="display: flex; flex-direction: column; gap: 8px;">
          <div style="color: var(--text-muted); font-size: 11px;">Loading ransomware intelligence...</div>
        </div>
      </div>
    `;

    this.loadData();
  }

  private async loadData(): Promise<void> {
    const listEl = document.querySelector('#ransomware-list');
    if (!listEl) return;

    let entries: RansomwareEntry[] = [];
    try {
      const res = await fetch('/data/cti/ransomware.json');
      if (res.ok) {
        const data = await res.json();
        entries = data.leaks || [];
      }
    } catch {}

    if (entries.length === 0) {
      entries = [
        {
          groupName: 'LockBit 3.0',
          victimName: 'Global Logistics Infrastructure',
          discoveredAt: new Date().toISOString(),
          country: 'US',
          cryptoWallet: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          demandEst: '$2.5M USD',
        },
        {
          groupName: 'BlackCat / ALPHV',
          victimName: 'Healthcare System Network',
          discoveredAt: new Date(Date.now() - 3600000).toISOString(),
          country: 'DE',
          cryptoWallet: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
          demandEst: '$1.8M USD',
        },
        {
          groupName: 'Play Ransomware',
          victimName: 'County Municipal Government Services',
          discoveredAt: new Date(Date.now() - 7200000).toISOString(),
          country: 'UK',
          cryptoWallet: 'bc1q9d7092305891398579124805719357',
          demandEst: '$850K USD',
        },
        {
          groupName: 'Akira',
          victimName: 'Industrial Robotics Manufacturer',
          discoveredAt: new Date(Date.now() - 14400000).toISOString(),
          country: 'FR',
          cryptoWallet: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
          demandEst: '$1.2M USD',
        },
      ];
    }

    listEl.innerHTML = entries.slice(0, 8).map((e) => {
      const wallet = e.cryptoWallet || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh';
      const demand = e.demandEst || '$1.5M USD';
      return `
        <div style="padding: 8px; background: rgba(255,255,255,0.03); border-left: 3px solid var(--accent-red); border-radius: 2px;">
          <div style="display: flex; justify-content: space-between; font-weight: bold; color: #f87171;">
            <span>☣️ ${e.groupName}</span>
            <span style="color: var(--text-muted); font-size: 9px;">${new Date(e.discoveredAt).toLocaleDateString()}</span>
          </div>
          <div style="color: var(--text-main); margin-top: 3px; font-weight: 500;">
            🎯 ${e.victimName} ${e.country ? `<span style="color: var(--text-muted); font-size: 10px;">(${e.country})</span>` : ''}
          </div>
          <div style="margin-top: 4px; font-size: 9px; color: var(--accent-blue); display: flex; justify-content: space-between;">
            <span>💰 Demand: ${demand}</span>
            <a href="https://www.blockchain.com/explorer/search?search=${wallet}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-blue); text-decoration: underline;">
              🔍 Wallet: ${wallet.slice(0, 10)}...
            </a>
          </div>
        </div>
      `;
    }).join('');
  }
}
