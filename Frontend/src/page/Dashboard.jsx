import React, { useEffect, useRef, useMemo, useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import 'leaflet/dist/leaflet.css'

import MapSectores from '../components/mapa/MapSectores'
import { MapDisplay } from '../components/mapa/MapDisplay'
import { DashboardHeader } from '../components/dashboard/DashboardHeader'
import { DashboardSidebar } from '../components/dashboard/DashboardSidebar'

import {
  getRandomInt,
  zoneData,
  mapSectorNamesToPoints,
  buildElastixSectorSummary,
  ELASTIX_FEED_INTERVAL_MS,
  CRITICAL_THRESHOLD_DEFAULT,
  getTodayISO,
  formatElapsed,
} from '../components/mapa/mapUtils'

import { useElastix } from '../hooks/useElastix'

// ── Datos estáticos del gráfico de tendencia ────────────────
const trendData = [
  { hora: '06:00', incidencias: 12, llamadas: 18 },
  { hora: '08:00', incidencias: 28, llamadas: 35 },
  { hora: '10:00', incidencias: 45, llamadas: 52 },
  { hora: '12:00', incidencias: 38, llamadas: 44 },
  { hora: '14:00', incidencias: 56, llamadas: 61 },
  { hora: '16:00', incidencias: 72, llamadas: 80 },
  { hora: '18:00', incidencias: 61, llamadas: 70 },
  { hora: '20:00', incidencias: 33, llamadas: 41 },
  { hora: '22:00', incidencias: 18, llamadas: 22 },
]

// ── Puntos iniciales del mapa del dashboard ─────────────────
const DASHBOARD_INITIAL_POINTS = [
  { id: 'dash-1', lat: -17.3895, lng: -66.1568, intensity: 'critical', zone: 'KM 0',      incidents: 45 },
  { id: 'dash-2', lat: -17.372,  lng: -66.148,  intensity: 'high',     zone: 'Quillacollo', incidents: 28 },
  { id: 'dash-3', lat: -17.401,  lng: -66.172,  intensity: 'medium',   zone: 'Tamborada',   incidents: 14 },
  { id: 'dash-4', lat: -17.355,  lng: -66.163,  intensity: 'low',      zone: 'Tiquipaya',   incidents: 6  },
]

const THRESHOLD = CRITICAL_THRESHOLD_DEFAULT
const SECTOR_COUNT_DEFAULT = 15

const Dashboard = () => {
  // ── Estado Smarflex simulado ────────────────────────────────
  const [realtimeIncidents, setRealtimeIncidents] = useState([])
  const [dashboardMapPoints, setDashboardMapPoints] = useState(DASHBOARD_INITIAL_POINTS)

  // ── Estado Elastix ──────────────────────────────────────────
  const [elastixEnabled, setElastixEnabled]   = useState(true)
  const [mapState, setMapState]               = useState('normal')
  const [criticalSince, setCriticalSince]     = useState(null)
  const [concurrentCalls, setConcurrentCalls] = useState(0)
  const [elastixCalls, setElastixCalls]       = useState([])

  // ── Cronómetro de crisis ────────────────────────────────────
  const [crisisTimerMs, setCrisisTimerMs] = useState(0)
  const crisisIntervalRef = useRef(null)

  // ── Simulador Smarflex: genera incidencias periódicamente ───
  useEffect(() => {
    const sim = setInterval(() => {
      const newCount = getRandomInt(0, 3)
      if (newCount <= 0) return

      const generated = Array.from({ length: newCount }).map((_, idx) => {
        const zone = zoneData[getRandomInt(0, zoneData.length - 1)]
        return {
          id: `SMF-${Date.now()}-${idx}`,
          lat: -17.3895 + (Math.random() - 0.5) * 0.03,
          lng: -66.1568 + (Math.random() - 0.5) * 0.03,
          zone: zone?.name || 'Zona Desconocida',
          timestamp: Date.now(),
        }
      })

      setRealtimeIncidents((prev) => {
        const next = [...generated, ...prev]
        if (next.length > 400) next.length = 400
        return next
      })
    }, 1500)

    return () => clearInterval(sim)
  }, [])

  // ── Simulador Elastix: genera llamadas periódicamente ───────
  useEffect(() => {
    if (!elastixEnabled) return

    const timer = setInterval(() => {
      const generatedCalls = Array.from({ length: getRandomInt(1, 4) }).map((_, index) => {
        const zone = zoneData[getRandomInt(0, zoneData.length - 1)]
        return {
          id: `ELX-${Date.now()}-${index}`,
          sector_operativo: zone.name,
          timestamp: Date.now(),
        }
      })

      setElastixCalls((prev) => [...generatedCalls, ...prev].slice(0, 1200))

      setConcurrentCalls((prev) => {
        const spike = Math.random() < 0.22
        const delta = spike ? getRandomInt(4, 11) : getRandomInt(-3, 4)
        return Math.max(0, Math.min(200, prev + delta))
      })
    }, ELASTIX_FEED_INTERVAL_MS)

    return () => clearInterval(timer)
  }, [elastixEnabled])

  // ── Detectar estado crítico basado en concurrentCalls ───────
  useEffect(() => {
    const isCritical = concurrentCalls >= THRESHOLD
    setMapState(isCritical ? 'critical' : 'normal')
    setCriticalSince((prev) => {
      if (isCritical && !prev) return Date.now()
      if (!isCritical) return null
      return prev
    })
  }, [concurrentCalls])

  // ── Activar/desactivar Elastix según umbral de incidencias ──
  // CAMBIO: Elastix SIEMPRE está activo. Solo se detecta el estado crítico para visuals.
  useEffect(() => {
    const currentCount = realtimeIncidents.length
    if (currentCount >= THRESHOLD && !elastixEnabled) {
      setElastixEnabled(true)
      setCrisisTimerMs(0)
    }
    // Nota: Ya no desactivamos Elastix cuando baja el umbral
  }, [realtimeIncidents, elastixEnabled])

  // ── Cronómetro de crisis ────────────────────────────────────
  useEffect(() => {
    if (mapState === 'critical') {
      crisisIntervalRef.current = setInterval(() => {
        setCrisisTimerMs((ms) => ms + 1000)
      }, 1000)
    } else {
      clearInterval(crisisIntervalRef.current)
      crisisIntervalRef.current = null
      setCrisisTimerMs(0)
    }
    return () => clearInterval(crisisIntervalRef.current)
  }, [mapState])

  // ── Puntos del mapa: mezcla Smarflex + Elastix en crisis ────
  const elastixSummary = useMemo(
    () => (elastixEnabled ? buildElastixSectorSummary(elastixCalls) : []),
    [elastixCalls, elastixEnabled]
  )
  const elastixPoints = useMemo(() => mapSectorNamesToPoints(elastixSummary), [elastixSummary])

  const activeMapPoints = useMemo(
    () => (mapState === 'critical' ? elastixPoints : dashboardMapPoints),
    [mapState, elastixPoints, dashboardMapPoints]
  )

  // ── Métricas derivadas ──────────────────────────────────────
  const crisisTimer = criticalSince ? formatElapsed(Date.now() - criticalSince) : null
  const recentElastixCalls = elastixCalls.slice(0, 6)
  const totalIncidents = activeMapPoints.reduce((sum, p) => sum + p.incidents, 0)

  const formatTimer = (ms) => {
    const s = Math.floor(ms / 1000)
    const mm = String(Math.floor(s / 60)).padStart(2, '0')
    const ss = String(s % 60).padStart(2, '0')
    return `${mm}:${ss}`
  }

  return (
    <div className="flex flex-col xl:flex-row gap-6 items-start">

      {/* ── COLUMNA PRINCIPAL ── */}
      <div className="flex-1 space-y-6 w-full min-w-0">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Mapa SMARFLEX / ELASTIX</h1>
          <p className="text-muted-foreground">
            Resumen de incidencias y mapa de calor del canal 4200-135
          </p>
        </div>

        {/* Tarjetas de métricas del Dashboard */}
        <DashboardHeader
          incidentsToday={realtimeIncidents.length}
          affectedSectors={SECTOR_COUNT_DEFAULT}
          receivedCalls={elastixCalls.length}
          currentCalls={concurrentCalls}
          threshold={THRESHOLD}
          mapState={mapState}
          crisisTimer={mapState === 'critical' ? formatTimer(crisisTimerMs) : null}
        />

        {/* Mapa principal del Dashboard */}
        <div className="h-[500px] w-full flex flex-col rounded-xl overflow-hidden border border-border">
          <MapDisplay
            zoom={13}
            selectedPoint={null}
            activePoints={activeMapPoints}
            handlePointSelect={() => {}}
            metricLabelTitle={mapState === 'critical' ? 'Llamadas' : 'Incidencias'}
            sectorCount={activeMapPoints.length}
            totalIncidents={totalIncidents}
            metricLabel={mapState === 'critical' ? 'llamadas' : 'incidencias'}
            sourceMode={mapState === 'critical' ? 'elastix' : 'canal 4200-135'}
          />
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Tendencia del día */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-semibold mb-4 text-card-foreground">Tendencia del Día</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.005 260)" />
                  <XAxis dataKey="hora" stroke="oklch(0.65 0 0)" fontSize={12} />
                  <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="incidencias" stroke="oklch(0.75 0.18 85)"  fill="oklch(0.75 0.18 85)"  fillOpacity={0.3} />
                  <Area type="monotone" dataKey="llamadas"    stroke="oklch(0.65 0.15 200)" fill="oklch(0.65 0.15 200)" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Mapa de sectores */}
          <div className="h-[500px] overflow-auto">
           <MapSectores activePoints={activeMapPoints} />
          </div>
        </div>
      </div>

      {/* ── SIDEBAR ── */}
      <DashboardSidebar
        isElastixActive={elastixEnabled}
        mapState={mapState}
        currentCalls={concurrentCalls}
        receivedCalls={elastixCalls.length}
        sectorCount={SECTOR_COUNT_DEFAULT}
        selectedDate={getTodayISO()}
        recentCalls={recentElastixCalls}
        crisisTimer={mapState === 'critical' ? formatTimer(crisisTimerMs) : null}
        threshold={THRESHOLD}
      />

    </div>
  )
}

export default Dashboard