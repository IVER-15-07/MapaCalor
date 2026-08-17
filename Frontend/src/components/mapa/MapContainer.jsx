import React, { useEffect } from 'react'
import { MapContainer as LeafletMapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { COCHA_CENTER, intensityConfig } from './mapUtils'

// Sub-componente interno para controlar la vista del mapa
const MapController = ({ zoomLevel, centerCoords }) => {
  const map = useMap()

  // Actualiza el nivel de zoom de forma segura
  useEffect(() => {
    if (zoomLevel) {
      map.setZoom(zoomLevel)
    }
  }, [zoomLevel, map])

  // Centra y vuela hacia el punto seleccionado con validación de coordenadas
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

      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap contributors'
        opacity={0.88}
      />

      {/* Renderizado seguro de los puntos en el mapa */}
      {activePoints.map((point) => {
        // Fallback seguro de configuración de intensidad si no existe
        const config = intensityConfig[point.intensity] || intensityConfig.low

        return (
          <CircleMarker
            key={point.id}
            center={[point.lat, point.lng]}
            radius={config.radius || 10}
            pathOptions={{
              color: config.hex || '#3b82f6',
              fillColor: config.hex || '#3b82f6',
              fillOpacity: 0.45,
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