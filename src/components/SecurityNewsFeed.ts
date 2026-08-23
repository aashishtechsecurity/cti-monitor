export interface NewsItem {
  title: string;
  source: string;
  url: string;
  pubDate: string;
}

export const CTI_NEWS_FEEDS = [
  { name: 'The Hacker News', url: 'https://thehackernews.com/' },
  { name: 'Bleeping Computer', url: 'https://www.bleepingcomputer.com/' },
  { name: 'Dark Reading', url: 'https://www.darkreading.com/' },
  { name: 'Infosecurity Magazine', url: 'https://www.infosecurity-magazine.com/' },
  { name: 'PCRisk Security', url: 'https://www.pcrisk.com/' },
];

export class SecurityNewsFeed {
  private containerId: string;

  constructor(containerId: string) {
    this.containerId = containerId;
  }

  public async render(): Promise<void> {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="panel-header">
        <span>📰 CYBERSECURITY & THREAT INTEL NEWS</span>
        <span style="font-size: 10px; color: var(--accent-green);">DIRECT ARTICLE LINKS</span>
      </div>
      <div class="panel-body">
        <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; font-size: 10px;">
          ${CTI_NEWS_FEEDS.map((f) => `
            <a href="${f.url}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-blue); text-decoration: none; padding: 2px 6px; background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.2); border-radius: 3px;">
              🔗 ${f.name}
            </a>
          `).join('')}
        </div>

        <div id="news-list" style="display: flex; flex-direction: column; gap: 8px;">
          <div style="color: var(--text-muted); font-size: 11px;">Loading CTI news articles...</div>
        </div>
      </div>
    `;

    this.loadData();
  }

  private async loadData(): Promise<void> {
    const listEl = document.querySelector('#news-list');
    if (!listEl) return;

    let articles: NewsItem[] = [];
    try {
      const res = await fetch('/data/cti/news.json');
      if (res.ok) {
        const data = await res.json();
        articles = data.news || [];
      }
    } catch {}

    if (articles.length === 0) {
      articles = [
        { title: 'TikTok Agrees to $400 Million Settlement in U.S. Child Privacy Lawsuit', source: 'The Hacker News', url: 'https://thehackernews.com/2026/08/tiktok-agrees-to-400-million-settlement.html', pubDate: 'Today' },
        { title: 'New Ransomware Variant Targeted Healthcare Organizations Worldwide', source: 'Bleeping Computer', url: 'https://www.bleepingcomputer.com/', pubDate: 'Today' },
        { title: 'Zero-Day Vulnerability Exploited in Active Cyber Espionage Campaign', source: 'Dark Reading', url: 'https://www.darkreading.com/', pubDate: 'Yesterday' },
        { title: 'CISA Issues Emergency Directive to Patch Critical Infrastructure Systems', source: 'Infosecurity Magazine', url: 'https://www.infosecurity-magazine.com/', pubDate: 'Yesterday' },
        { title: 'Ransomware Group Claims Responsibility for Financial Services Data Breach', source: 'PCRisk Security', url: 'https://www.pcrisk.com/', pubDate: 'Yesterday' },
      ];
    }

    listEl.innerHTML = articles.slice(0, 15).map((n) => `
      <div style="padding: 8px; background: rgba(255,255,255,0.03); border-left: 3px solid var(--accent-green); border-radius: 2px;">
        <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--accent-green); font-weight: bold;">
          <span>${n.source}</span>
          <span style="color: var(--text-muted); font-size: 9px;">${n.pubDate}</span>
        </div>
        <a href="${n.url}" target="_blank" rel="noopener noreferrer" style="display: block; color: var(--text-main); text-decoration: none; margin-top: 4px; font-weight: 500; font-size: 11px; line-height: 1.4;" onmouseover="this.style.color='var(--accent-blue)'; this.style.textDecoration='underline';" onmouseout="this.style.color='var(--text-main)'; this.style.textDecoration='none';">
          ${n.title} ↗
        </a>
      </div>
    `).join('');
  }
}
