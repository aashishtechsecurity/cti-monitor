#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const outputDir = path.join(projectRoot, 'public', 'data', 'cti');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const FEODO_URL = 'https://feodotracker.abuse.ch/downloads/ipblocklist.json';
const CISA_KEV_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';
const RANSOMLOOK_API_URL = 'https://www.ransomlook.io/api/recent';

const RSS_SOURCES = [
  { name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews' },
  { name: 'Bleeping Computer', url: 'https://www.bleepingcomputer.com/feed/' },
  { name: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml' },
  { name: 'Infosecurity Magazine', url: 'https://www.infosecurity-magazine.com/rss/news/' },
  { name: 'PCRisk Security', url: 'https://www.pcrisk.com/feed' },
];

async function fetchJson(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'CTI-Monitor-FeedGenerator/1.0' } });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`[CTI Feed Generator] Failed to fetch ${url}:`, err.message);
    return null;
  }
}

async function fetchRssFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) CTI-Monitor/1.0' },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = [];
    const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || xml.match(/<entry[\s\S]*?<\/entry>/gi) || [];
    
    for (const match of itemMatches.slice(0, 10)) {
      const titleMatch = match.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i);
      const linkMatch = match.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i) || match.match(/href=["'](https?:\/\/[^"']+)["']/i);
      const pubDateMatch = match.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i) || match.match(/<updated[^>]*>([\s\S]*?)<\/updated>/i);

      if (titleMatch && linkMatch) {
        let title = titleMatch[1].replace(/<[^>]+>/g, '').trim();
        let linkUrl = (linkMatch[1] || linkMatch[0]).trim();
        let pubDate = pubDateMatch ? new Date(pubDateMatch[1].trim()).toLocaleDateString() : 'Recent';

        if (title && linkUrl && linkUrl.startsWith('http')) {
          items.push({
            title,
            source: feed.name,
            url: linkUrl,
            pubDate,
          });
        }
      }
    }
    return items;
  } catch (e) {
    console.warn(`[CTI Feed Generator] Failed to parse RSS feed ${feed.name}:`, e.message);
    return [];
  }
}

async function main() {
  console.log('[CTI Feed Generator] Aggregating live CTI feeds...');

  // 1. Feodo C2/Malware Threats
  const threats = [];
  const feodo = await fetchJson(FEODO_URL);
  if (Array.isArray(feodo)) {
    for (const item of feodo.slice(0, 300)) {
      threats.push({
        id: `feodo-${item.ip_address}:${item.port}`,
        type: 'c2_server',
        indicator: `${item.ip_address}:${item.port}`,
        lat: parseFloat(item.latitude) || 0,
        lon: parseFloat(item.longitude) || 0,
        country: item.country || 'UNKNOWN',
        severity: 'high',
        malwareFamily: item.malware || 'Feodo C2',
      });
    }
  }

  fs.writeFileSync(path.join(outputDir, 'cyber-threats.json'), JSON.stringify({ updatedAt: new Date().toISOString(), threats }, null, 2));

  // 2. Ransomware & Dark Web Leaks from Ransomlook.io API
  console.log('[CTI Feed Generator] Fetching live ransomware leaks from Ransomlook.io API...');
  const leaks = [];
  const darkWebPosts = [];
  const rawLeaks = await fetchJson(RANSOMLOOK_API_URL);

  if (Array.isArray(rawLeaks)) {
    for (const v of rawLeaks.slice(0, 50)) {
      const directUrl = v.link ? `https://www.ransomlook.io${v.link}` : `https://www.ransomlook.io/`;
      const entry = {
        groupName: v.group_name || 'Unknown Group',
        victimName: v.post_title || 'Target Entity',
        discoveredAt: v.discovered || new Date().toISOString(),
        description: v.description || undefined,
        link: directUrl,
      };
      leaks.push(entry);

      darkWebPosts.push({
        title: `Ransom Claim: ${entry.victimName}`,
        source: 'Dark Web Leak Site',
        actor: entry.groupName,
        targetCountry: 'Global Enterprise',
        date: new Date(entry.discoveredAt).toLocaleDateString(),
        category: 'Ransom Claim',
        details: entry.description ? entry.description.slice(0, 120) + '...' : `Compromised by ${entry.groupName}.`,
        link: directUrl,
      });
    }
  }

  fs.writeFileSync(path.join(outputDir, 'ransomware.json'), JSON.stringify({ updatedAt: new Date().toISOString(), leaks }, null, 2));
  fs.writeFileSync(path.join(outputDir, 'darkweb.json'), JSON.stringify({ updatedAt: new Date().toISOString(), posts: darkWebPosts.slice(0, 15) }, null, 2));
  console.log(`[CTI Feed Generator] Saved ${leaks.length} live ransomware leak posts with direct source links`);

  // 3. CISA KEV
  const kev = await fetchJson(CISA_KEV_URL);
  if (kev && Array.isArray(kev.vulnerabilities)) {
    fs.writeFileSync(path.join(outputDir, 'kev.json'), JSON.stringify({ updatedAt: new Date().toISOString(), vulnerabilities: kev.vulnerabilities.slice(0, 50) }, null, 2));
  }

  // 4. CTI News Feeds
  console.log('[CTI Feed Generator] Fetching live RSS news feeds...');
  const newsResults = await Promise.allSettled(RSS_SOURCES.map((f) => fetchRssFeed(f)));
  const allNews = [];
  for (const res of newsResults) {
    if (res.status === 'fulfilled' && Array.isArray(res.value)) {
      allNews.push(...res.value);
    }
  }

  fs.writeFileSync(path.join(outputDir, 'news.json'), JSON.stringify({ updatedAt: new Date().toISOString(), news: allNews }, null, 2));

  console.log('[CTI Feed Generator] All feeds successfully aggregated to public/data/cti/');
}

main().catch(console.error);
