'use client'

import { useEffect, useRef, useState } from 'react'

export default function GpsMap({ latitude, longitude }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!latitude || !longitude || mapInstanceRef.current) return

    // Dynamically import leaflet (requires browser)
    const loadMap = async () => {
      const L = (await import('leaflet')).default

      // Fix leaflet default marker icons
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      if (mapRef.current && !mapInstanceRef.current) {
        const map = L.map(mapRef.current).setView([latitude, longitude], 14)

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map)

        // Add marker
        L.marker([latitude, longitude]).addTo(map)

        // Add accuracy circle (visual effect showing risk radius)
        L.circle([latitude, longitude], {
          color: '#EF4444',
          fillColor: '#EF4444',
          fillOpacity: 0.1,
          radius: 200,
          weight: 1,
        }).addTo(map)

        mapInstanceRef.current = map
        setLoaded(true)
      }
    }

    loadMap()

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude])

  if (!latitude || !longitude) return null

  return (
    <div className="rounded-xl border border-danger/30 bg-danger/5 overflow-hidden">
      <div className="px-4 py-3 border-b border-danger/20 flex items-center gap-2">
        <span className="text-sm">📍</span>
        <span className="text-sm font-medium text-danger">GPS Location Found In Your Photo</span>
      </div>

      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        crossOrigin=""
      />

      <div ref={mapRef} className="w-full h-64 sm:h-72" />

      <div className="px-4 py-3 bg-danger/5 border-t border-danger/20">
        <div className="flex items-start gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-danger mt-0.5 shrink-0">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <p className="text-xs text-muted leading-relaxed">
            These exact coordinates ({latitude.toFixed(4)}°, {longitude.toFixed(4)}°) are
            embedded in your photo. Anyone who downloads this image can see precisely
            where it was taken.
          </p>
        </div>
      </div>
    </div>
  )
}
