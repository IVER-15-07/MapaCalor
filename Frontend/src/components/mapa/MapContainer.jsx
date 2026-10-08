import { useEffect, useRef } from 'react'
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature'
import PointGeom from 'ol/geom/Point'
import PolygonGeom from 'ol/geom/Polygon'
import { Style, Fill, Stroke, Circle as CircleStyle } from 'ol/style'
import Overlay from 'ol/Overlay'
import { fromLonLat } from 'ol/proj'
import { COCHA_CENTER, intensityConfig } from './mapUtils'

// Conversión de color HEX a RGBA para opacidades en OpenLayers
const hexToRgba = (hex = '#3b82f6', opacity = 0.25) => {
  let c = hex.replace('#', '')
  if (c.length === 3) c = c.split('').map(x => x + x).join('')
  const num = parseInt(c, 16)
  return `rgba(${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}, ${opacity})`
}

export const MapContainer = ({
  zoom = 12,
  selectedPoint,
  activePoints = [],
  handlePointSelect,
  metricLabelTitle = 'Incidencias'
}) => {
  const mapElement = useRef(null)
  const popupElement = useRef(null)
  const mapRef = useRef(null)
  const vectorSourceRef = useRef(new VectorSource())
  const overlayRef = useRef(null)

  // 1. Inicialización del Mapa Base y Overlay
  useEffect(() => {
    if (!mapElement.current) return

    // Popup Overlay
    overlayRef.current = new Overlay({
      element: popupElement.current,
      autoPan: { animation: { duration: 250 } },
      positioning: 'bottom-center',
      stopEvent: false,
      offset: [0, -10]
    })

    // Capa Vectorial para tus datos (Polígonos y Puntos)
    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current
    })

    // Mapa base con OpenStreetMap (OSM)
    const initialCenter = COCHA_CENTER 
      ? [COCHA_CENTER[1] ?? COCHA_CENTER.lng, COCHA_CENTER[0] ?? COCHA_CENTER.lat] 
      : [-66.1568, -17.3895] // [Longitud, Latitud]

    const map = new Map({
      target: mapElement.current,
      layers: [
        new TileLayer({
          source: new OSM() // Capa base pública de OpenStreetMap
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat(initialCenter),
        zoom: zoom
      }),
      overlays: [overlayRef.current],
      controls: [] // zoomControl={false}
    })

    // Evento de clic en elementos del mapa
    map.on('singleclick', (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (feat) => feat)
      if (feature) {
        const pointData = feature.get('pointData')
        if (pointData) {
          if (handlePointSelect) handlePointSelect(pointData)
          
          // Mostrar Popup en las coordenadas del clic o centroide
          const coordinates = fromLonLat([pointData.lng, pointData.lat])
          overlayRef.current.setPosition(coordinates)
          
          // Llenar contenido del Popup
          if (popupElement.current) {
            popupElement.current.innerHTML = `
              <div class="bg-white p-3 rounded-xl shadow-lg border border-slate-200 text-center min-w-[140px]">
                <h3 class="text-sm font-bold text-slate-800">${pointData.zone || 'Zona desconocida'}</h3>
                <p class="mt-1 text-xs text-slate-600">
                  ${metricLabelTitle}: <strong class="text-slate-900">${pointData.incidents ?? 0}</strong>
                </p>
              </div>
            `
          }
        }
      } else {
        // Si hace clic fuera de un punto, cerrar popup
        overlayRef.current.setPosition(undefined)
      }
    })

    mapRef.current = map

    return () => map.setTarget(null)
  }, [])

  // 2. Renderizar y actualizar los polígonos y puntos
  useEffect(() => {
    const source = vectorSourceRef.current
    source.clear()

    activePoints.forEach((point) => {
      const config = intensityConfig[point.intensity] || intensityConfig.low
      const baseColor = config.hex || '#3b82f6'

      // Capa de Polígono
      if (point.polygon && point.polygon.length > 0) {
        // En OpenLayers las coordenadas son [lng, lat]
        const ringCoords = point.polygon.map(coord => {
          const lat = Array.isArray(coord) ? coord[0] : coord.lat
          const lng = Array.isArray(coord) ? coord[1] : coord.lng
          return fromLonLat([lng, lat])
        })

        const polyFeature = new Feature({
          geometry: new PolygonGeom([ringCoords]),
          pointData: point
        })

        polyFeature.setStyle(
          new Style({
            stroke: new Stroke({ color: baseColor, width: 2 }),
            fill: new Fill({ color: hexToRgba(baseColor, 0.25) })
          })
        )
        source.addFeature(polyFeature)
      }

      // Capa de Punto (CircleMarker)
      if (typeof point.lat === 'number' && typeof point.lng === 'number') {
        const pointFeature = new Feature({
          geometry: new PointGeom(fromLonLat([point.lng, point.lat])),
          pointData: point
        })

        pointFeature.setStyle(
          new Style({
            image: new CircleStyle({
              radius: config.radius ? config.radius / 1.5 : 7,
              fill: new Fill({ color: hexToRgba(baseColor, 0.85) }),
              stroke: new Stroke({ color: baseColor, width: 1.5 })
            })
          })
        )
        source.addFeature(pointFeature)
      }
    })
  }, [activePoints])

  // 3. Control de Vista (flyTo y zoom)
  useEffect(() => {
    if (!mapRef.current || !selectedPoint) return
    if (typeof selectedPoint.lat === 'number' && typeof selectedPoint.lng === 'number') {
      const view = mapRef.current.getView()
      view.animate({
        center: fromLonLat([selectedPoint.lng, selectedPoint.lat]),
        zoom: 14,
        duration: 800
      })
    }
  }, [selectedPoint])

  return (
    <div className="relative h-full w-full">
      <div ref={mapElement} className="h-full w-full" />
      <div ref={popupElement} className="absolute pointer-events-auto" />
    </div>
  )
}

export default MapContainer