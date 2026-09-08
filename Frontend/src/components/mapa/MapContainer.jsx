import { useEffect } from 'react'
import { MapContainer as LeafletMapContainer, TileLayer, CircleMarker, Polygon, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { COCHA_CENTER, intensityConfig } from './mapUtils'

// Sub-componente interno para controlar la vista del mapa
const MapController = ({ zoomLevel, centerCoords }) => {
  const map = useMap()

  useEffect(() => {
    if (zoomLevel) {
      map.setZoom(zoomLevel)
    }
  }, [zoomLevel, map])

  useEffect(() => {
    if (centerCoords && typeof centerCoords.lat === 'number' && typeof centerCoords.lng === 'number') {
      map.flyTo([centerCoords.lat, centerCoords.lng], 14, { animate: true })
    }
  }, [centerCoords, map])

  return null
}

export const MapContainer = ({
  zoom = 12,
  selectedPoint,
  activePoints = [],
  handlePointSelect,
  metricLabelTitle = 'Incidencias'
}) => {
  return (
    <LeafletMapContainer center={COCHA_CENTER} zoom={zoom} zoomControl={false} className="h-full w-full">
      <MapController zoomLevel={zoom} centerCoords={selectedPoint} />

      {/* Capa libre de OpenStreetMap (100% gratuita, pública y sin API Key) */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* 🔴 CAPA 1: Polígono que marca toda el área de la zona */}
      {activePoints.map((point) => {
        if (!point.polygon || point.polygon.length === 0) return null
        const config = intensityConfig[point.intensity] || intensityConfig.low

        return (
          <Polygon
            key={`poly-${point.id}`}
            positions={point.polygon}
            pathOptions={{
              color: config.hex || '#3b82f6',
              fillColor: config.hex || '#3b82f6',
              fillOpacity: 0.25,
              weight: 2,
            }}
            eventHandlers={{
              click: () => handlePointSelect && handlePointSelect(point)
            }}
          />
        )
      })}

      {/* 🔵 CAPA 2: Puntos de reporte / centroides */}
      {activePoints.map((point) => {
        const config = intensityConfig[point.intensity] || intensityConfig.low

        return (
          <CircleMarker
            key={point.id}
            center={[point.lat, point.lng]}
            radius={config.radius || 10}
            pathOptions={{
              color: config.hex || '#3b82f6',
              fillColor: config.hex || '#3b82f6',
              fillOpacity: 0.85,
              weight: 1.5,
              opacity: 0.85,
            }}
            eventHandlers={{
              click: () => handlePointSelect && handlePointSelect(point)
            }}
          >
            <Popup className="rounded-xl">
              <div className="p-1 text-center">
                <h3 className="text-sm font-bold text-slate-800">{point.zone || 'Zona desconocida'}</h3>
                <p className="mt-1 text-xs text-slate-600">
                  {metricLabelTitle}: <strong className="text-slate-900">{point.incidents ?? 0}</strong>
                </p>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </LeafletMapContainer>
  )
}

export default MapContainer