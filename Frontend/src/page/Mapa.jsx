import React, { useEffect, useMemo, useState } from 'react'
import {
  Layers,
  ZoomIn,
  ZoomOut,
  MapPin,
  X,
  CalendarDays,
  Loader2,
  Phone,
  AlertTriangle,
  PhoneCall,
} from 'lucide-react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { cn } from '../lib/Utils'
import { historialService } from '../api/incidencias/Historial'

const COCHA_CENTER = [-17.3895, -66.1568]
const ELASTIX_FEED_INTERVAL_MS = 1200
const ELASTIX_RECENT_WINDOW_MS = 10 * 60 * 1000
const CRITICAL_THRESHOLD_DEFAULT = 30

const zoneData = [
  { name: 'AEROPUERTO', x: 45, y: 55 },
  { name: 'AIQUILE', x: 85, y: 95 },
  { name: 'ARANI', x: 80, y: 78 },
  { name: 'AROCAGUA', x: 60, y: 45 },
  { name: 'CALICANTO', x: 45, y: 65 },
  { name: 'CAPINOTA', x: 20, y: 85 },
  { name: 'CARCAJE', x: 65, y: 72 },
  { name: 'CHIMBA', x: 44, y: 50 },
  { name: 'CHINATA', x: 75, y: 46 },
  { name: 'CLIZA', x: 72, y: 75 },
  { name: 'CONDEBAMBA', x: 40, y: 45 },
  { name: 'COSMOS', x: 42, y: 56 },
  { name: 'EL PASO', x: 32, y: 40 },
  { name: 'EX-MATADERO', x: 48, y: 55 },
  { name: 'FLORIDA NORTE', x: 35, y: 46 },
  { name: 'FLORIDA SUD', x: 35, y: 50 },
  { name: 'HIPODROMO', x: 42, y: 48 },
  { name: 'HUAYLLANI', x: 65, y: 44 },
  { name: 'HUAYRA KHASA', x: 52, y: 60 },
  { name: 'KM "0"', x: 50, y: 50 },
  { name: 'LA FERIA', x: 46, y: 52 },
  { name: 'LA PAZ', x: 50, y: 56 },
  { name: 'LAS CUADRAS', x: 52, y: 48 },
  { name: 'LINDE', x: 35, y: 42 },
  { name: 'MONTENEGRO', x: 30, y: 54 },
  { name: 'MUYURINA', x: 55, y: 48 },
  { name: 'NORTE', x: 50, y: 40 },
  { name: 'PACATA', x: 58, y: 42 },
  { name: 'PAROTANI', x: 12, y: 70 },
  { name: 'PIÑAMI', x: 34, y: 48 },
  { name: 'PUCARA (SACABA)', x: 70, y: 45 },
  { name: 'PUNATA', x: 76, y: 73 },
  { name: 'QUERU QUERU', x: 50, y: 44 },
  { name: 'QUILLACOLLO', x: 25, y: 50 },
  { name: 'QUINTANILLA', x: 62, y: 44 },
  { name: 'SACABA PUEBLO', x: 68, y: 44 },
  { name: 'SAN BENITO', x: 72, y: 70 },
  { name: 'SAN MIGUEL', x: 52, y: 52 },
  { name: 'SANTIVAÑEZ', x: 35, y: 75 },
  { name: 'SARCO', x: 46, y: 45 },
  { name: 'SAUSALITO FTTH', x: 54, y: 42 },
  { name: 'SEBASTIAN PAGADOR', x: 55, y: 65 },
  { name: 'SEMINARIO', x: 50, y: 42 },
  { name: 'SIPE SIPE', x: 15, y: 55 },
  { name: 'SUCRE', x: 50, y: 48 },
  { name: 'SUD', x: 50, y: 62 },
  { name: 'TAMBORADA', x: 50, y: 66 },
  { name: 'TARATA', x: 62, y: 78 },
  { name: 'TEMPORAL', x: 50, y: 38 },
  { name: 'TIQUIPAYA', x: 40, y: 35 },
  { name: 'TOLATA', x: 68, y: 72 },
  { name: 'TUPURAYA', x: 52, y: 45 },
  { name: 'VALLE HERMOSO', x: 54, y: 60 },
  { name: 'VILLA BUSCH NORTE', x: 42, y: 42 },
  { name: 'VILLA BUSCH SUD', x: 42, y: 45 },
  { name: 'VILLA ISRAEL', x: 52, y: 70 },
  { name: 'VILLA RIBERO', x: 48, y: 58 },
  { name: 'VINTO', x: 20, y: 52 },
]

const intensityConfig = {
  low: { color: '#22c55e', hex: '#22c55e', radius: 8, label: 'Baja', twColor: 'bg-green-500' },
  medium: { color: '#3b82f6', hex: '#3b82f6', radius: 12, label: 'Media', twColor: 'bg-blue-500' },
  high: { color: '#f59e0b', hex: '#f59e0b', radius: 18, label: 'Alta', twColor: 'bg-orange-500' },
  critical: { color: '#ef4444', hex: '#ef4444', radius: 24, label: 'Crítica', twColor: 'bg-red-500' },
}

const normalizeText = (value) => String(value ?? '').trim().toLowerCase()

const normalizeSectorKey = (value) => {
  const normalized = normalizeText(value)
  return normalized
    .replace(/^sector\s+tec\s+/i, '')
    .replace(/^sector\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const getTodayISO = () => new Date().toISOString().slice(0, 10)

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const formatElapsed = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}s`
}

const mapSectorNamesToPoints = (llamadasPorSector) => {
  const countBySector = new Map(
    (llamadasPorSector || []).map((item) => [
      normalizeSectorKey(item.sector_operativo),
      {
        llamadas: Number(item.total_llamadas || 0),
        intensidad: item.intensidad || 'low',
      },
    ])
  )

  return zoneData
    .filter((data) => countBySector.has(normalizeSectorKey(data.name)))
    .map((data, index) => {
      const lat = COCHA_CENTER[0] - (data.y - 50) * 0.003
      const lng = COCHA_CENTER[1] + (data.x - 50) * 0.003
      const countData = countBySector.get(normalizeSectorKey(data.name)) || { llamadas: 0, intensidad: 'low' }

      return {
        id: `${data.name}-${index}`,
        lat,
        lng,
        intensity: countData.intensidad,
        zone: data.name,
        incidents: countData.llamadas,
        district: data.name,
      }
    })
}

const buildElastixSectorSummary = (calls) => {
  const now = Date.now()
  const countsBySector = new Map()

  calls
    .filter((call) => now - call.timestamp <= ELASTIX_RECENT_WINDOW_MS)
    .forEach((call) => {
      const key = call.sector_operativo
      countsBySector.set(key, (countsBySector.get(key) || 0) + 1)
    })

  return [...countsBySector.entries()].map(([sectorOperativo, totalLlamadas]) => {
    let intensidad = 'low'
    if (totalLlamadas >= 14) {
      intensidad = 'critical'
    } else if (totalLlamadas >= 8) {
      intensidad = 'high'
    } else if (totalLlamadas >= 4) {
      intensidad = 'medium'
    }

    return {
      sector_operativo: sectorOperativo,
      total_llamadas: totalLlamadas,
      intensidad,
    }
  })
}

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

const Mapa = () => {
  const todayISO = useMemo(() => getTodayISO(), [])
  const [selectedDate, setSelectedDate] = useState(getTodayISO())
  const [smarflexPoints, setSmarflexPoints] = useState([])
  const [backendSectorCount, setBackendSectorCount] = useState(0)
  const [backendIncidentCount, setBackendIncidentCount] = useState(0)
  const [elastixEnabled, setElastixEnabled] = useState(true)
  const [criticalThreshold, setCriticalThreshold] = useState(CRITICAL_THRESHOLD_DEFAULT)
  const [concurrentCalls, setConcurrentCalls] = useState(0)
  const [elastixCalls, setElastixCalls] = useState([])
  const [criticalSince, setCriticalSince] = useState(null)
  const [mapState, setMapState] = useState('normal')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [zoom, setZoom] = useState(12)
  const isRealtimeDate = selectedDate === todayISO

  useEffect(() => {
    const loadSectors = async () => {
      if (!selectedDate) {
        setSmarflexPoints([])
        return
      }

      setLoading(true)
      setError('')

      try {
        const response = await historialService.getHeatmapState({
          fechaRegistro: selectedDate,
          mode: 'normal',
        })
        const llamadasPorSector = response.llamadas_por_sector || []
        const points = mapSectorNamesToPoints(llamadasPorSector)
        setBackendSectorCount(response.total_sectores || llamadasPorSector.length)
        setBackendIncidentCount(response.total_llamadas || 0)
        setSmarflexPoints(points)
        setSelectedPoint(null)
      } catch (requestError) {
        setBackendSectorCount(0)
        setBackendIncidentCount(0)
        setSmarflexPoints([])
        setError(requestError.message || 'No se pudo cargar la información')
      } finally {
        setLoading(false)
      }
    }

    loadSectors()
  }, [selectedDate])

  useEffect(() => {
    if (!elastixEnabled || !isRealtimeDate) {
      setConcurrentCalls(0)
      return
    }

    const timer = setInterval(() => {
      const generatedCalls = Array.from({ length: getRandomInt(1, 4) }).map((_, index) => {
        const zone = zoneData[getRandomInt(0, zoneData.length - 1)]
        return {
          id: `ELX-${Date.now()}-${index}`,
          sector_operativo: zone.name,
          timestamp: Date.now(),
        }
      })

      setElastixCalls((previous) => [...generatedCalls, ...previous].slice(0, 1200))
      setConcurrentCalls((previous) => {
        const spike = Math.random() < 0.22
        const delta = spike ? getRandomInt(4, 11) : getRandomInt(-3, 4)
        return Math.max(0, Math.min(200, previous + delta))
      })
    }, ELASTIX_FEED_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [elastixEnabled, isRealtimeDate])

  useEffect(() => {
    const isCritical = elastixEnabled && isRealtimeDate && concurrentCalls >= criticalThreshold
    setMapState(isCritical ? 'critical' : 'normal')
    setCriticalSince((previous) => {
      if (isCritical && !previous) return Date.now()
      if (!isCritical) return null
      return previous
    })
  }, [concurrentCalls, criticalThreshold, elastixEnabled, isRealtimeDate])

  const elastixSummary = useMemo(
    () => (isRealtimeDate ? buildElastixSectorSummary(elastixCalls) : []),
    [elastixCalls, isRealtimeDate]
  )
  const elastixPoints = useMemo(() => mapSectorNamesToPoints(elastixSummary), [elastixSummary])
  const sourceMode = mapState === 'critical' && isRealtimeDate ? 'elastix' : 'smarflex'

  const activePoints = useMemo(
    () => (sourceMode === 'elastix' ? elastixPoints : smarflexPoints),
    [sourceMode, elastixPoints, smarflexPoints]
  )
  const totalIncidents = activePoints.reduce((sum, point) => sum + point.incidents, 0)
  const sectorCount = activePoints.length
  const metricLabel = sourceMode === 'elastix' ? 'llamadas' : 'incidencias'
  const metricLabelTitle = sourceMode === 'elastix' ? 'Llamadas' : 'Incidencias'
  const crisisTimer = mapState === 'critical' && criticalSince ? formatElapsed(Date.now() - criticalSince) : '00:00s'
  const recentElastixCalls = elastixCalls.slice(0, 6)

  const handlePointSelect = (point) => {
    setSelectedPoint(point)
  }

  return (
    <div className="flex h-full flex-col gap-6 xl:flex-row xl:items-stretch">
      <div className="flex min-w-0 flex-[1.7] flex-col">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Mapa de Sectores por Fecha</h1>
            <p className="text-muted-foreground">Selecciona una fecha y el mapa mostrará solo los sectores con registros</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-lg border border-border bg-card">
              <button
                onClick={() => setZoom((prev) => Math.max(8, prev - 1))}
                className="rounded-l-lg p-2 hover:bg-secondary"
              >
                <ZoomOut className="h-4 w-4 text-muted-foreground" />
              </button>
              <span className="px-3 text-sm font-medium text-muted-foreground">Z: {zoom}</span>
              <button
                onClick={() => setZoom((prev) => Math.min(18, prev + 1))}
                className="rounded-r-lg p-2 hover:bg-secondary"
              >
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              <Layers className="h-4 w-4" />
              Capas
            </button>
          </div>
        </div>

        <div
          className={cn(
            'mb-4 rounded-2xl border px-4 py-3 shadow-[0_0_24px_rgba(239,68,68,0.12)]',
            mapState === 'critical'
              ? 'border-red-400/70 bg-slate-950 text-red-100'
              : 'border-emerald-300/50 bg-slate-900 text-emerald-100'
          )}
        >
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-full border',
                  mapState === 'critical'
                    ? 'border-red-400/70 bg-red-500/20 text-red-200'
                    : 'border-emerald-400/70 bg-emerald-500/20 text-emerald-100'
                )}
              >
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-wide">
                  {mapState === 'critical' ? 'CRISIS DETECTED' : 'LIVE ELASTIX MONITOR'}
                </p>
                <p className="text-xs uppercase tracking-wider text-red-200/85">
                  Nivel situacional: {mapState === 'critical' ? 'Critical' : 'Normal'} | Fuente activa:{' '}
                  {sourceMode === 'elastix' ? 'Elastix' : 'Smarflex'}
                </p>
                {!isRealtimeDate && (
                  <p className="text-xs uppercase tracking-wider text-amber-300/90">
                    Elastix solo disponible en tiempo real (fecha de hoy)
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-lg border border-white/15 bg-white/5 px-4 py-2">
                <p className="text-[10px] uppercase tracking-wider text-red-100/70">Response Time</p>
                <p className="text-2xl font-semibold">{crisisTimer}</p>
              </div>
              <button className="rounded-lg bg-red-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-red-950 hover:bg-red-100">
                Deploy Field Teams
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>Filtrar por fecha:</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4" />
            <span>Concurrencia Elastix:</span>
          </div>
          <span className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-semibold text-foreground">
            {concurrentCalls}
          </span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Umbral:</span>
            <input
              type="number"
              min={1}
              value={criticalThreshold}
              onChange={(e) => setCriticalThreshold(Number(e.target.value) || 1)}
              className="w-24 rounded-lg border border-border bg-secondary px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => setElastixEnabled((previous) => !previous)}
            disabled={!isRealtimeDate}
            className={cn(
              'rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wide disabled:cursor-not-allowed disabled:opacity-50',
              elastixEnabled ? 'bg-emerald-500/15 text-emerald-600' : 'bg-slate-500/15 text-slate-600'
            )}
          >
            {!isRealtimeDate ? 'Elastix fuera de tiempo real' : elastixEnabled ? 'Elastix activo' : 'Elastix pausado'}
          </button>
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold uppercase',
              mapState === 'critical' ? 'bg-red-500/15 text-red-500' : 'bg-green-500/15 text-green-600'
            )}
          >
            Estado: {mapState === 'critical' ? 'Crítico' : 'Normal'}
          </span>
          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Cargando incidencias...
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}
          {!error && !loading && (
            <div className="text-xs text-muted-foreground">
              Smarflex: {backendSectorCount} sectores / {backendIncidentCount} incidencias | Elastix: {isRealtimeDate ? `${elastixSummary.length} sectores con llamadas` : 'deshabilitado (histórico)'}
            </div>
          )}
        </div>




        

        <div className="relative z-0 min-h-[72vh] flex-1 overflow-hidden rounded-xl border border-border bg-slate-800">
          <MapContainer center={COCHA_CENTER} zoom={zoom} zoomControl={false} className="h-full w-full">
            <MapController zoomLevel={zoom} centerCoords={selectedPoint} />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
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
                eventHandlers={{
                  click: () => handlePointSelect(point),
                }}
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
          </MapContainer>
        </div>








        <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-card p-3">
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-muted-foreground">Intensidad:</span>
            {Object.entries(intensityConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <span className={cn('h-3 w-3 rounded-full', config.twColor)} />
                <span className="text-sm text-muted-foreground">{config.label}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{sectorCount}</span> zonas
            </span>
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{totalIncidents}</span> {metricLabel} ({sourceMode})
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex w-full flex-col gap-4 xl:w-72">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Sectores activos</p>
            <p className="text-2xl font-semibold text-foreground">{sectorCount}</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">Fecha consultada</p>
            <p className="text-sm font-semibold text-destructive">{selectedDate || '-'}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h3 className="font-semibold text-card-foreground">Llamadas Elastix en vivo</h3>
            <span className="text-xs text-muted-foreground">{recentElastixCalls.length} recientes</span>
          </div>
          <div className="divide-y divide-border">
            {recentElastixCalls.length > 0 ? (
              recentElastixCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-primary" />
                    <span className="text-sm text-card-foreground">{call.sector_operativo}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(call.timestamp).toLocaleTimeString()}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-muted-foreground">Esperando llamadas desde Elastix...</div>
            )}
          </div>
        </div>

        {selectedPoint ? (
          <div className="rounded-xl border border-border bg-card shadow-lg">
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-semibold text-card-foreground">Detalle de sector</span>
              </div>
              <button onClick={() => setSelectedPoint(null)} className="rounded p-1 transition-colors hover:bg-secondary">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <p className="text-lg font-semibold text-card-foreground">{selectedPoint.zone}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">{metricLabelTitle}</p>
                  <p className="text-xl font-semibold text-foreground">{selectedPoint.incidents}</p>
                </div>
                <div className="rounded-lg bg-secondary p-3">
                  <p className="text-xs text-muted-foreground">Intensidad</p>
                  <p className={cn('text-xl font-semibold', 'text-orange-500')}>
                    {intensityConfig[selectedPoint.intensity].label}
                  </p>
                </div>
              </div>
              <button className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Ver Detalles Operativos
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-border bg-card p-6 text-center">
            <MapPin className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Selecciona una fecha y luego un punto en el mapa para analizar la zona.
            </p>
          </div>
        )}

        <div className="flex-1 overflow-hidden rounded-xl border border-border bg-card">
          <div className="border-b border-border bg-muted/20 p-4">
            <h3 className="font-semibold text-card-foreground">Sectores del día</h3>
          </div>
          <div className="flex h-75 flex-1 flex-col divide-y divide-border overflow-y-auto">
            {activePoints.length > 0 ? (
              [...activePoints]
                .sort((a, b) => a.zone.localeCompare(b.zone))
                .map((point) => (
                  <button
                    key={point.id}
                    onClick={() => handlePointSelect(point)}
                    className={cn(
                      'flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-secondary/50',
                      selectedPoint?.id === point.id && 'border-l-2 border-primary bg-secondary'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn('h-2 w-2 rounded-full', intensityConfig[point.intensity].twColor)} />
                      <span className="truncate text-sm text-card-foreground">{point.zone}</span>
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">{point.incidents}</span>
                  </button>
                ))
            ) : (
              <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                No hay sectores para la fuente activa.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mapa
