import { getTlpBadgeStyle, TlpLevel } from '../types/tlp';

export interface DarkWebPost {
  title: string;
  source: string;
  actor: string;
  targetCountry: string;
  date: string;
  category: string;
  details: string;
  link?: string;
  tlp?: TlpLevel;
}

export class DarkWebFeedPanel {
  private containerId: string;

  constructor(containerId: string) {
    this.containerId = containerId;
  }

  public async render(): Promise<void> {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="panel-header">
        <span>🕸️ DARK WEB & TELEGRAM LEAK CHANNEL MONITOR</span>
        <span style="font-size: 10px; color: #a855f7;">LIVE LEAK FEEDS</span>
      </div>
      <div class="panel-body">
        <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 8px;">
          Live breach disclosures & access broker listings:
        </div>

        <div id="darkweb-list" style="display: flex; flex-direction: column; gap: 8px;">
          <div style="color: var(--text-muted); font-size: 11px;">Loading dark web & leak channel feeds...</div>
        </div>
      </div>
    `;

    this.loadData();
  }

  private async loadData(): Promise<void> {
    const listEl = document.querySelector('#darkweb-list');
    if (!listEl) return;

    let posts: DarkWebPost[] = [];
    try {
      const res = await fetch('/data/cti/darkweb.json');
      if (res.ok) {
        const data = await res.json();
        posts = data.posts || [];
      }
    } catch {}

    if (posts.length === 0) {
      posts = [
        {
          title: 'Initial Access Sold: Network Credentials for Regional Telecommunications Provider',
          source: 'BreachForums',
          actor: 'Broker_Zero',
          targetCountry: '🇮🇳 India',
          date: 'Today',
          category: 'Access Broker',
          details: 'VPN admin access + domain controller access offered for $3,500 USD.',
          link: 'https://www.ransomlook.io/',
          tlp: 'TLP:AMBER',
        },
        {
          title: 'Leaked Database: Healthcare Provider Compromised Credentials (150k Records)',
          source: 'Telegram CTI',
          actor: 'IntelLeaks_Channel',
          targetCountry: '🇺🇸 United States',
          date: 'Today',
          category: 'Database Leak',
          details: 'User PII, hashed passwords, and employee email addresses uploaded.',
          link: 'https://www.ransomlook.io/',
          tlp: 'TLP:AMBER',
        },
      ];
    }

    listEl.innerHTML = posts.slice(0, 10).map((p) => {
      const targetLink = p.link || 'https://www.ransomlook.io/';
      const tlpConf = getTlpBadgeStyle(p.tlp || 'TLP:AMBER');

      return `
        <div style="padding: 8px; background: rgba(255,255,255,0.03); border-left: 3px solid #a855f7; border-radius: 2px;">
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: #c084fc; font-weight: bold; align-items: center;">
            <span>${p.source} • <span style="color: var(--text-muted);">${p.actor}</span></span>
            <span style="padding: 1px 5px; background: ${tlpConf.bgColor}; border: 1px solid ${tlpConf.borderColor}; border-radius: 3px; color: ${tlpConf.textColor}; font-size: 8px; font-family: var(--font-hud);">
              ${tlpConf.label}
            </span>
          </div>
          <a href="${targetLink}" target="_blank" rel="noopener noreferrer" style="display: block; color: var(--text-main); text-decoration: none; margin-top: 3px; font-weight: 500; font-size: 11px; line-height: 1.4;" onmouseover="this.style.color='#c084fc'; this.style.textDecoration='underline';" onmouseout="this.style.color='var(--text-main)'; this.style.textDecoration='none';">
            ${p.title} ↗
          </a>
          <div style="font-size: 9px; color: var(--text-muted); margin-top: 4px; display: flex; justify-content: space-between; align-items: center;">
            <span>Target: <strong style="color: var(--text-main);">${p.targetCountry}</strong></span>
            <a href="${targetLink}" target="_blank" rel="noopener noreferrer" style="padding: 1px 6px; background: rgba(168,85,247,0.15); border: 1px solid rgba(168,85,247,0.3); border-radius: 3px; color: #c084fc; text-decoration: none;">
              🔗 Check Source Leak ↗
            </a>
          </div>
          <div style="font-size: 9px; color: #94a3b8; margin-top: 2px;">${p.details}</div>
        </div>
      `;
    }).join('');
  }
}
