import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Destination } from '../types';

interface MapViewProps {
  pins?: Destination[];
  pinMeta?: Record<string, { color: string; label: string }>;
  onPick?: (id: string) => void;
  active?: string;
  height?: number;
}

const SL_CENTER: L.LatLngExpression = [7.87, 80.77];
const SL_BOUNDS = L.latLngBounds([5.7, 79.4], [10.0, 82.1]);

export function MapView({ pins = [], pinMeta, onPick, active, height = 460 }: MapViewProps) {
  const holderRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!holderRef.current || mapRef.current) return;
    const map = L.map(holderRef.current, {
      center: SL_CENTER,
      zoom: 7,
      minZoom: 6,
      maxZoom: 15,
      scrollWheelZoom: false,
      maxBounds: SL_BOUNDS.pad(0.35),
    });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();

    pins.forEach((p) => {
      const isActive = p.id === active;
      const meta = pinMeta?.[p.id] ?? { color: '#2a9d8f', label: p.name };
      const icon = L.divIcon({
        className: '',
        html: `
          <span
            class="map-pin${isActive ? ' is-active' : ''}"
            style="background:${meta.color}; box-shadow: ${isActive ? `0 0 0 6px ${meta.color}26` : '0 1px 6px rgba(0,0,0,0.35)'};"
          ></span>
        `,
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });
      const marker = L.marker([p.lat, p.lng], { icon }).addTo(layer);
      marker.bindTooltip(`${meta.label} · ${p.name}`, {
        direction: 'top',
        offset: [0, -10],
        className: 'map-tooltip',
      });
      if (onPick) marker.on('click', () => onPick(p.id));
    });

    if (pins.length === 1) {
      map.setView([pins[0].lat, pins[0].lng], 10);
    } else if (pins.length > 1) {
      map.fitBounds(L.latLngBounds(pins.map((p) => [p.lat, p.lng] as [number, number])).pad(0.12));
    }
  }, [pins, active, onPick]);

  return (
    <div
      ref={holderRef}
      style={{
        height,
        width: '100%',
        position: 'relative',
        zIndex: 0,
        borderRadius: 'var(--r)',
        overflow: 'hidden',
        border: '1px solid var(--line-2)',
      }}
    />
  );
}
