# 🛡️ Standalone Cyber Threat Intelligence (CTI) Monitor

A clean, lightweight, high-performance Cyber Threat Intelligence Dashboard built with TypeScript, Vite, Deck.gl, and MapLibre.

Designed for 100% free hosting on **GitHub Pages** with **zero backend server required and no login needed**.

---

## ⚡ Features

1. 🗺️ **Global Cyber Threat Map**: WebGL Deck.gl layer plotting active botnet C2 servers, malware hosts, and APT threat actor locations.
2. 🛡️ **IOC Inspector & CTI Analyst Toolbox**: One-click analyst search for IPs, domains, file hashes, and crypto addresses across:
   - **VirusTotal**
   - **ANY.RUN Interactive Sandbox**
   - **Hatching Triage Sandbox**
   - **Blockchain Explorer** (Ransomware wallet tracker)
   - **PCRisk Malware Database**
   - **The Raven File**
   - **Ransomlook.io**
   - **Dexpose Ransomware**
3. ☣️ **Ransomware & Leak Site Monitor**: Live ransomware attack monitoring and victim leak tracking.
4. 🚨 **CISA KEV Tracker**: CISA Known Exploited Vulnerabilities catalog.
5. 📰 **Cybersecurity News Stream**: RSS feed aggregation from *The Hacker News*, *Bleeping Computer*, *Dark Reading*, *Infosecurity Magazine*, and *PCRisk*.

---

## 🚀 Local Development

```bash
# 1. Navigate to the project directory
cd cti-monitor

# 2. Install dependencies
npm install

# 3. Generate static CTI feeds
npm run generate-feeds

# 4. Start local development server
npm run dev
```

Open your browser at `http://localhost:3000`.

---

## 🌐 Deploying to GitHub Pages (FREE)

This repository includes a pre-configured GitHub Actions workflow (`.github/workflows/deploy-cti-pages.yml`) that automatically:
1. Runs every 2 hours via cron.
2. Downloads open-source CTI feeds into static JSON files.
3. Compiles the Vite SPA.
4. Deploys the static site to GitHub Pages with **zero server costs and no login required**.
