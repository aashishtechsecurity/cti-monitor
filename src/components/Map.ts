import { Deck } from '@deck.gl/core';
import { ScatterplotLayer, GeoJsonLayer, ArcLayer } from '@deck.gl/layers';
import maplibregl from 'maplibre-gl';

export interface ThreatMarker {
  id: string;
  type: string;
  indicator: string;
  lat: number;
  lon: number;
  country?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  malwareFamily?: string;
  timeHour?: number;
}

export interface AttackVector {
  fromName: string;
  fromCoords: [number, number];
  toName: string;
  toCoords: [number, number];
}

const COUNTRY_COORDS: Record<string, [number, number]> = {
  IN: [78.96, 20.59],
  US: [-95.71, 37.09],
  DE: [10.45, 51.16],
  JP: [138.25, 36.20],
  UK: [-3.43, 55.37],
  FR: [2.21, 46.22],
  SG: [103.81, 1.35],
  UA: [31.16, 48.37],
  PK: [69.34, 30.37],
  CA: [-106.34, 56.13],
};

export class CtiMap {
  private containerId: string;
  private deck: Deck | null = null;
  private map: maplibregl.Map | null = null;
  private showVectorLines: boolean = false;
  private isPlayingTimeline: boolean = false;
  private currentHour: number = 24;
  private timelineTimer: any = null;
  private cachedThreats: ThreatMarker[] = [];

  constructor(containerId: string) {
    this.containerId = containerId;
  }

  public async init(): Promise<void> {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    // Render Map Header Bar with Toggle & Timeline Playback Controls
    container.innerHTML = `
      <div class="panel-header" style="position: absolute; top: 0; left: 0; right: 0; z-index: 10; background: rgba(15,23,42,0.95); border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; padding: 6px 12px;">
        <span>🗺️ GLOBAL CYBER THREAT MAP</span>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button id="play-timeline-btn" style="padding: 3px 8px; background: rgba(74,222,128,0.15); border: 1px solid var(--accent-green); color: var(--accent-green); border-radius: 3px; font-family: var(--font-mono); font-size: 10px; cursor: pointer;">
            ▶ Play 24h Timeline
          </button>
          <button id="toggle-vectors-btn" style="padding: 3px 8px; background: rgba(56,189,248,0.15); border: 1px solid var(--accent-blue); color: var(--accent-blue); border-radius: 3px; font-family: var(--font-mono); font-size: 10px; cursor: pointer;">
            🎯 ${this.showVectorLines ? 'Hide Vector Arcs' : 'Show Vector Arcs'}
          </button>
        </div>
      </div>
      <div id="map-inner-container" style="width: 100%; height: 100%; position: absolute; top: 0; left: 0;"></div>
    `;

    const mapInner = container.querySelector('#map-inner-container') as HTMLElement;

    // Create MapLibre basemap with Carto Dark tiles
    this.map = new maplibregl.Map({
      container: mapInner as any,
      style: {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
              'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap &copy; CARTO',
          },
        },
        layers: [
          {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [78.96, 20.59],
      zoom: 3.2,
      interactive: true,
    });

    // Create Deck.gl WebGL Layer Overlay
    this.deck = new Deck({
      parent: mapInner as HTMLDivElement,
      initialViewState: {
        longitude: 78.96,
        latitude: 20.59,
        zoom: 3.2,
        pitch: 0,
        bearing: 0,
      },
      controller: true,
      onViewStateChange: ({ viewState }) => {
        if (this.map) {
          this.map.jumpTo({
            center: [viewState.longitude, viewState.latitude],
            zoom: viewState.zoom,
            bearing: viewState.bearing,
            pitch: viewState.pitch,
          });
        }
      },
      layers: [],
    });

    const toggleBtn = container.querySelector('#toggle-vectors-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.showVectorLines = !this.showVectorLines;
        toggleBtn.textContent = `🎯 ${this.showVectorLines ? 'Hide Vector Arcs' : 'Show Vector Arcs'}`;
        this.renderThreatLayers(this.cachedThreats);
      });
    }

    const playBtn = container.querySelector('#play-timeline-btn');
    if (playBtn) {
      playBtn.addEventListener('click', () => {
        this.toggleTimelinePlayback(playBtn);
      });
    }

    this.loadThreatData();
  }

  private toggleTimelinePlayback(btn: Element): void {
    if (this.isPlayingTimeline) {
      this.isPlayingTimeline = false;
      clearInterval(this.timelineTimer);
      btn.textContent = '▶ Play 24h Timeline';
      this.currentHour = 24;
      this.renderThreatLayers(this.cachedThreats);
    } else {
      this.isPlayingTimeline = true;
      this.currentHour = 1;
      btn.textContent = '⏸ Pause Timeline (T+1h)';

      this.timelineTimer = setInterval(() => {
        this.currentHour += 2;
        if (this.currentHour > 24) {
          this.currentHour = 24;
          this.isPlayingTimeline = false;
          clearInterval(this.timelineTimer);
          btn.textContent = '▶ Play 24h Timeline';
        } else {
          btn.textContent = `⏸ Pause Timeline (T+${this.currentHour}h)`;
        }
        this.renderThreatLayers(this.cachedThreats);
      }, 800);
    }
  }

  public focusCountry(countryCode: string): void {
    const coords = COUNTRY_COORDS[countryCode];
    if (coords && this.deck) {
      this.deck.setProps({
        initialViewState: {
          longitude: coords[0],
          latitude: coords[1],
          zoom: 4,
          transitionDuration: 1000,
        },
      });
      if (this.map) {
        this.map.flyTo({ center: coords, zoom: 4, duration: 1000 });
      }
    }
  }

  private async loadThreatData(): Promise<void> {
    let threats: ThreatMarker[] = [];
    try {
      const res = await fetch('/data/cti/cyber-threats.json');
      if (res.ok) {
        const data = await res.json();
        threats = data.threats || [];
      }
    } catch {}

    if (threats.length === 0) {
      threats = [
        { id: '1', type: 'c2_server', indicator: '185.220.101.5', lat: 52.52, lon: 13.40, country: 'DE', severity: 'critical', malwareFamily: 'Feodo C2', timeHour: 4 },
        { id: '2', type: 'malware_host', indicator: '198.51.100.24', lat: 37.77, lon: -122.41, country: 'US', severity: 'high', malwareFamily: 'Cobalt Strike', timeHour: 8 },
        { id: '3', type: 'c2_server', indicator: '91.215.85.12', lat: 50.45, lon: 30.52, country: 'UA', severity: 'high', malwareFamily: 'Qakbot C2', timeHour: 12 },
        { id: '4', type: 'c2_server', indicator: '103.145.13.9', lat: 35.67, lon: 139.65, country: 'JP', severity: 'medium', malwareFamily: 'RedLine Stealer', timeHour: 16 },
        { id: '5', type: 'phishing', indicator: '45.154.255.80', lat: 55.75, lon: 37.61, country: 'RU', severity: 'critical', malwareFamily: 'APT28 Phishing', timeHour: 20 },
        { id: '6', type: 'c2_server', indicator: '103.253.145.18', lat: 1.35, lon: 103.81, country: 'SG', severity: 'high', malwareFamily: 'LockBit C2', timeHour: 22 },
        { id: '7', type: 'malware_host', indicator: '190.217.5.12', lat: -23.55, lon: -46.63, country: 'BR', severity: 'medium', malwareFamily: 'Grandoreiro', timeHour: 10 },
        { id: '8', type: 'c2_server', indicator: '103.21.124.5', lat: 28.61, lon: 77.20, country: 'IN', severity: 'high', malwareFamily: 'SideWinder C2', timeHour: 6 },
      ];
    }

    this.cachedThreats = threats;
    this.renderThreatLayers(threats);
  }

  private async renderThreatLayers(threats: ThreatMarker[]): Promise<void> {
    if (!this.deck) return;

    let indiaGeoJson: any = null;
    try {
      const geoRes = await fetch('/data/india-official.json');
      if (geoRes.ok) {
        indiaGeoJson = await geoRes.json();
      }
    } catch {}

    const filteredThreats = threats.filter((t) => (t.timeHour || 12) <= this.currentHour);

    const attackVectors: AttackVector[] = [
      { fromName: 'China', fromCoords: [116.40, 39.90], toName: 'India', toCoords: [78.96, 20.59] },
      { fromName: 'Russia', fromCoords: [37.61, 55.75], toName: 'Germany', toCoords: [10.45, 51.16] },
      { fromName: 'North Korea', fromCoords: [125.75, 39.03], toName: 'Japan', toCoords: [138.25, 36.20] },
      { fromName: 'South Asia', fromCoords: [77.20, 28.61], toName: 'Pakistan', toCoords: [69.34, 30.37] },
      { fromName: 'China', fromCoords: [116.40, 39.90], toName: 'United States', toCoords: [-95.71, 37.09] },
    ];

    const layers: any[] = [];

    // 1. Add Official India Boundary Layer
    if (indiaGeoJson) {
      layers.push(
        new GeoJsonLayer({
          id: 'india-official-boundary-layer',
          data: indiaGeoJson,
          stroked: true,
          filled: true,
          getFillColor: [56, 189, 248, 12],
          getLineColor: [56, 189, 248, 230],
          getLineWidth: 2,
          lineWidthMinPixels: 1.5,
        })
      );
    }

    // 2. Add Directional APT Attack Vector Arcs + Target Arrowheads (Only when toggled ON)
    if (this.showVectorLines) {
      // 3D Directional Curved Arc Layer (Orange Origin -> Red Target)
      layers.push(
        new ArcLayer({
          id: 'apt-attack-vectors-arc-layer',
          data: attackVectors,
          getSourcePosition: (d: AttackVector) => d.fromCoords,
          getTargetPosition: (d: AttackVector) => d.toCoords,
          getSourceColor: [249, 115, 22, 240], // Bright Orange at threat origin
          getTargetColor: [239, 68, 68, 255],  // Deep Red at target destination
          getWidth: 3,
          getHeight: 0.35,
          greatCircle: true,
        })
      );

      // Target Destination Arrowhead Pulse Markers (Red target dots indicating arrow destination)
      layers.push(
        new ScatterplotLayer({
          id: 'apt-target-arrowhead-layer',
          data: attackVectors,
          getPosition: (d: AttackVector) => d.toCoords,
          getFillColor: [239, 68, 68, 255],
          getRadius: 60000,
          radiusMinPixels: 6,
          radiusMaxPixels: 12,
        })
      );
    }

    // 3. Add Filtered Threat Scatterplot Layer
    layers.push(
      new ScatterplotLayer({
        id: 'cyber-threats-layer',
        data: filteredThreats,
        getPosition: (d: ThreatMarker) => [d.lon, d.lat],
        getFillColor: (d: ThreatMarker) => {
          if (d.severity === 'critical') return [239, 68, 68, 220];
          if (d.severity === 'high') return [249, 115, 22, 200];
          return [56, 189, 248, 180];
        },
        getRadius: (d: ThreatMarker) => (d.severity === 'critical' ? 80000 : 50000),
        radiusMinPixels: 6,
        radiusMaxPixels: 14,
        pickable: true,
      })
    );

    this.deck.setProps({ layers });
  }
}
