export class WatchlistAlertPanel {
    containerId;
    watchKeywords = ['India', 'LockBit', 'CISA Critical'];
    constructor(containerId) {
        this.containerId = containerId;
    }
    render() {
        const container = document.getElementById(this.containerId);
        if (!container)
            return;
        container.innerHTML = `
      <div class="panel-header">
        <span>🔔 ANALYST WATCHLIST & ALERT ENGINE</span>
        <span style="font-size: 10px; color: var(--accent-green);">LIVE ALERTS</span>
      </div>
      <div class="panel-body">
        <div style="margin-bottom: 8px;">
          <div style="font-size: 10px; color: var(--text-muted); margin-bottom: 4px;">ACTIVE WATCHLIST KEYWORDS:</div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 6px;">
            ${this.watchKeywords.map((kw, i) => `
              <span style="font-size: 10px; padding: 2px 6px; background: rgba(56,189,248,0.15); border: 1px solid var(--accent-blue); border-radius: 3px; color: var(--accent-blue); display: flex; align-items: center; gap: 4px;">
                🔍 ${kw}
                <button class="remove-kw-btn" data-index="${i}" style="background: none; border: none; color: var(--accent-red); cursor: pointer; font-size: 10px;">✕</button>
              </span>
            `).join('')}
          </div>

          <div style="display: flex; gap: 4px;">
            <input
              type="text"
              id="kw-input"
              placeholder="Add keyword (e.g. India, Volt Typhoon)..."
              style="flex: 1; padding: 4px 8px; background: rgba(0,0,0,0.4); border: 1px solid var(--border-color); color: #fff; border-radius: 3px; font-family: var(--font-mono); font-size: 10px;"
            />
            <button id="add-kw-btn" style="padding: 4px 8px; background: rgba(74,222,128,0.2); border: 1px solid var(--accent-green); color: var(--accent-green); border-radius: 3px; font-family: var(--font-mono); font-size: 10px; cursor: pointer;">
              + Add
            </button>
          </div>
        </div>

        <div style="font-size: 10px; color: var(--accent-green); font-weight: bold; margin-bottom: 4px;">
          ⚡ RECENT WATCHLIST MATCHES:
        </div>
        <div style="padding: 6px; background: rgba(74,222,128,0.05); border: 1px solid rgba(74,222,128,0.2); border-radius: 3px; font-size: 10px;">
          <div style="color: var(--accent-green); font-weight: bold;">🚨 MATCH FOUND: "India"</div>
          <div style="color: var(--text-main); margin-top: 2px;">C2 Server 103.21.124.5 (SideWinder C2) flagged in New Delhi region.</div>
        </div>
      </div>
    `;
        this.attachEvents(container);
    }
    attachEvents(container) {
        const input = container.querySelector('#kw-input');
        const addBtn = container.querySelector('#add-kw-btn');
        addBtn?.addEventListener('click', () => {
            if (input && input.value.trim().length > 0) {
                this.watchKeywords.push(input.value.trim());
                input.value = '';
                this.render();
            }
        });
        container.querySelectorAll('.remove-kw-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-index') || '-1', 10);
                if (idx >= 0) {
                    this.watchKeywords.splice(idx, 1);
                    this.render();
                }
            });
        });
    }
}
