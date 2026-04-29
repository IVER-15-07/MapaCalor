import React, { useEffect } from 'react'
import { MapContainer as LeafletMapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { COCHA_CENTER, intensityConfig } from './mapUtils'

// Sub-componente interno para controlar la vista del mapa
const MapController = ({ zoomLevel, centerCoords }) => {
    const map = useMap()

    useEffect(() => {
        map.setZoom(zoomLevel)
    }, [zoomLevel, map])

    useEffect(() => {
        if (centerCoords) {
            map.flyTo([centerCoords.lat, centerCoords.lng], 14, { animate: true })
        }
    }, [centerCoords, map])

    return null
}

export const MapContainer = ({zoom, selectedPoint, activePoints, handlePointSelect,metricLabelTitle
}) => {
    return (
        <LeafletMapContainer center={COCHA_CENTER} zoom={zoom} zoomControl={false} className="h-full w-full">
            <MapController zoomLevel={zoom} centerCoords={selectedPoint} />

            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                attribution='&copy; OpenStreetMap contributors'
                opacity={0.88}
            />

            {activePoints.map((point) => (
                <CircleMarker
                    key={point.id}
                    center={[point.lat, point.lng]}
                    radius={intensityConfig[point.intensity].radius}
                    pathOptions={{
                        color: intensityConfig[point.intensity].hex,
                        fillColor: intensityConfig[point.intensity].hex,
                        fillOpacity: 0.45,
                        weight: 1.5,
                        opacity: 0.85,
                    }}
                    eventHandlers={{ click: () => handlePointSelect(point) }}
                >
                    <Popup className="rounded-xl">
                        <div className="p-1 text-center">
                            <h3 className="text-sm font-bold text-slate-800">{point.zone}</h3>
                            <p className="mt-1 text-xs text-slate-600">
                                {metricLabelTitle}: <strong className="text-slate-900">{point.incidents}</strong>
                            </p>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </LeafletMapContainer>
    )
}