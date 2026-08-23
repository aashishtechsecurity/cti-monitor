import { CtiMap } from './components/Map';
import { AnalystToolbox } from './components/AnalystToolbox';
import { RansomwareTracker } from './components/RansomwareTracker';
import { CisaKevTracker } from './components/CisaKevTracker';
import { SecurityNewsFeed } from './components/SecurityNewsFeed';
import { MitreAttackPanel } from './components/MitreAttackPanel';
import { SectorHeatmapPanel } from './components/SectorHeatmapPanel';
import { DetectionRuleExporter } from './components/DetectionRuleExporter';
import { AptTargetingPanel } from './components/AptTargetingPanel';
import { DarkWebFeedPanel } from './components/DarkWebFeedPanel';
import { ThreatGraphPanel } from './components/ThreatGraphPanel';
import { WatchlistAlertPanel } from './components/WatchlistAlertPanel';
import { OutagesPanel } from './components/OutagesPanel';
import { CertAdvisoriesPanel } from './components/CertAdvisoriesPanel';
import { CyberPolicyPanel } from './components/CyberPolicyPanel';
import { ThreatTimelinePanel } from './components/ThreatTimelinePanel';
import { AchAttributionPanel } from './components/AchAttributionPanel';
import { PdnsPivotPanel } from './components/PdnsPivotPanel';
import { generateExecutiveCisoBrief } from './utils/executiveBriefExporter';
let autoRefreshIntervalSeconds = 300; // 5 minutes default
let countdownSeconds = 300;
let timerId = null;
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize Components
    const map = new CtiMap('map-container');
    await map.init();
    const ach = new AchAttributionPanel('ach-attribution-container');
    ach.render();
    const pdns = new PdnsPivotPanel('pdns-pivot-container');
    pdns.render();
    const outages = new OutagesPanel('outages-container');
    outages.render();
    const cert = new CertAdvisoriesPanel('cert-advisories-container');
    cert.render();
    const policy = new CyberPolicyPanel('cyber-policy-container');
    policy.render();
    const timeline = new ThreatTimelinePanel('threat-timeline-container');
    timeline.render();
    const watchlist = new WatchlistAlertPanel('watchlist-alert-container');
    watchlist.render();
    const aptPanel = new AptTargetingPanel('apt-targeting-container', (countryCode) => {
        map.focusCountry(countryCode);
    });
    await aptPanel.render();
    const threatGraph = new ThreatGraphPanel('threat-graph-container');
    threatGraph.render();
    const toolbox = new AnalystToolbox('toolbox-container');
    toolbox.render();
    const mitre = new MitreAttackPanel('mitre-container');
    mitre.render();
    const exporter = new DetectionRuleExporter('exporter-container');
    exporter.render();
    const ransomware = new RansomwareTracker('ransomware-container');
    await ransomware.render();
    const darkWeb = new DarkWebFeedPanel('darkweb-container');
    await darkWeb.render();
    const sectorHeatmap = new SectorHeatmapPanel('sector-heatmap-container');
    sectorHeatmap.render();
    const kev = new CisaKevTracker('cisa-kev-container');
    await kev.render();
    const news = new SecurityNewsFeed('news-container');
    await news.render();
    // Attach Executive CISO Brief Export Listener
    const briefBtn = document.getElementById('btn-export-ciso-brief');
    briefBtn?.addEventListener('click', () => {
        generateExecutiveCisoBrief();
    });
    // Refresh All Feeds Function with Pulse Glow Animations
    async function refreshAllFeeds() {
        const refreshBtn = document.getElementById('btn-manual-refresh');
        const statusText = document.getElementById('status-text');
        const panels = document.querySelectorAll('.panel');
        if (refreshBtn)
            refreshBtn.classList.add('spinning');
        // Trigger glowing cyan pulse animation across all panels
        panels.forEach((p) => {
            p.classList.remove('refreshing');
            void p.offsetWidth; // trigger reflow
            p.classList.add('refreshing');
        });
        await Promise.allSettled([
            ransomware.render(),
            darkWeb.render(),
            kev.render(),
            news.render(),
            aptPanel.render(),
        ]);
        setTimeout(() => {
            if (refreshBtn)
                refreshBtn.classList.remove('spinning');
        }, 800);
    }
    // Manual Refresh Button Listener
    const manualBtn = document.getElementById('btn-manual-refresh');
    manualBtn?.addEventListener('click', () => {
        refreshAllFeeds();
        countdownSeconds = autoRefreshIntervalSeconds; // Reset countdown
    });
    // Auto Refresh Selector & Timer Logic
    const selectEl = document.getElementById('auto-refresh-select');
    const countdownEl = document.getElementById('countdown-badge');
    function updateTimer() {
        if (autoRefreshIntervalSeconds === 0) {
            if (countdownEl)
                countdownEl.textContent = 'OFF';
            return;
        }
        countdownSeconds--;
        if (countdownSeconds <= 0) {
            refreshAllFeeds();
            countdownSeconds = autoRefreshIntervalSeconds;
        }
        if (countdownEl) {
            const mins = Math.floor(countdownSeconds / 60);
            const secs = countdownSeconds % 60;
            countdownEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    }
    if (selectEl) {
        selectEl.addEventListener('change', (e) => {
            const val = parseInt(e.target.value, 10);
            autoRefreshIntervalSeconds = val;
            countdownSeconds = val;
            if (val === 0) {
                if (countdownEl)
                    countdownEl.textContent = 'OFF';
            }
        });
    }
    // Start 1-second countdown ticker
    timerId = setInterval(updateTimer, 1000);
});
