// Mapa.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { historialService } from '../api/incidencias/Historial'

// Importaciones extraidas
import { 
  getTodayISO, getRandomInt, formatElapsed, mapSectorNamesToPoints, 
  buildElastixSectorSummary, ELASTIX_FEED_INTERVAL_MS, 
  CRITICAL_THRESHOLD_DEFAULT, zoneData 
} from '../components/mapa/mapUtils'

// Sub-Componentes
import { MapHeader } from '../components/mapa/MapHeader'
import { MapDisplay } from '../components/mapa/MapDisplay'
import { MapSidebar } from '../components/mapa/MapSidebar'

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

  // Effect: Cargar historial Smarflex
  useEffect(() => {
    const loadSectors = async () => {
      if (!selectedDate) { setSmarflexPoints([]); return; }
      setLoading(true); setError('')
      try {
        const response = await historialService.getHeatmapState({ fechaRegistro: selectedDate, mode: 'normal' })
        const llamadasPorSector = response.llamadas_por_sector || []
        setBackendSectorCount(response.total_sectores || llamadasPorSector.length)
        setBackendIncidentCount(response.total_llamadas || 0)
        setSmarflexPoints(mapSectorNamesToPoints(llamadasPorSector))
        setSelectedPoint(null)
      } catch (requestError) {
        setBackendSectorCount(0); setBackendIncidentCount(0); setSmarflexPoints([])
        setError(requestError.message || 'No se pudo cargar la información')
      } finally { setLoading(false) }
    }
    loadSectors()
  }, [selectedDate])

  // Effect: Simulador Elastix
  useEffect(() => {
    if (!elastixEnabled || !isRealtimeDate) { setConcurrentCalls(0); return; }
    const timer = setInterval(() => {
      const generatedCalls = Array.from({ length: getRandomInt(1, 4) }).map((_, index) => {
        const zone = zoneData[getRandomInt(0, zoneData.length - 1)]
        return { id: `ELX-${Date.now()}-${index}`, sector_operativo: zone.name, timestamp: Date.now() }
      })
      setElastixCalls((prev) => [...generatedCalls, ...prev].slice(0, 1200))
      setConcurrentCalls((prev) => {
        const spike = Math.random() < 0.22
        const delta = spike ? getRandomInt(4, 11) : getRandomInt(-3, 4)
        return Math.max(0, Math.min(200, prev + delta))
      })
    }, ELASTIX_FEED_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [elastixEnabled, isRealtimeDate])

  // Effect: Umbrales Críticos
  useEffect(() => {
    const isCritical = elastixEnabled && isRealtimeDate && concurrentCalls >= criticalThreshold
    setMapState(isCritical ? 'critical' : 'normal')
    setCriticalSince((prev) => isCritical && !prev ? Date.now() : !isCritical ? null : prev)
  }, [concurrentCalls, criticalThreshold, elastixEnabled, isRealtimeDate])

  // Variables Calculadas
  const elastixSummary = useMemo(() => (isRealtimeDate ? buildElastixSectorSummary(elastixCalls) : []), [elastixCalls, isRealtimeDate])
  const elastixPoints = useMemo(() => mapSectorNamesToPoints(elastixSummary), [elastixSummary])
  const sourceMode = mapState === 'critical' && isRealtimeDate ? 'elastix' : 'smarflex'
  const activePoints = useMemo(() => (sourceMode === 'elastix' ? elastixPoints : smarflexPoints), [sourceMode, elastixPoints, smarflexPoints])
  
  const totalIncidents = activePoints.reduce((sum, point) => sum + point.incidents, 0)
  const metricLabel = sourceMode === 'elastix' ? 'llamadas' : 'incidencias'
  const crisisTimer = mapState === 'critical' && criticalSince ? formatElapsed(Date.now() - criticalSince) : '00:00s'

  return (
    <div className="flex h-full flex-col gap-6 xl:flex-row xl:items-stretch">
      <div className="flex min-w-0 flex-[1.7] flex-col">
        <MapHeader 
          zoom={zoom} setZoom={setZoom} mapState={mapState} sourceMode={sourceMode} 
          isRealtimeDate={isRealtimeDate} crisisTimer={crisisTimer} selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} concurrentCalls={concurrentCalls} 
          criticalThreshold={criticalThreshold} setCriticalThreshold={setCriticalThreshold} 
          elastixEnabled={elastixEnabled} setElastixEnabled={setElastixEnabled} 
          loading={loading} error={error} backendSectorCount={backendSectorCount} 
          backendIncidentCount={backendIncidentCount} elastixSummaryLength={elastixSummary.length}
          sectorCount={activePoints.length} totalIncidents={totalIncidents} metricLabel={metricLabel}
        />
        
        <MapDisplay 
          zoom={zoom} selectedPoint={selectedPoint} activePoints={activePoints} 
          handlePointSelect={setSelectedPoint} metricLabelTitle={sourceMode === 'elastix' ? 'Llamadas' : 'Incidencias'}
          sectorCount={activePoints.length} totalIncidents={totalIncidents} metricLabel={metricLabel} sourceMode={sourceMode}
        />
      </div>

      <MapSidebar 
        sectorCount={activePoints.length} selectedDate={selectedDate} 
        recentElastixCalls={elastixCalls.slice(0, 6)} selectedPoint={selectedPoint} 
        setSelectedPoint={setSelectedPoint} metricLabelTitle={sourceMode === 'elastix' ? 'Llamadas' : 'Incidencias'} 
        activePoints={activePoints} handlePointSelect={setSelectedPoint} 
      />
    </div>
  )
}

export default Mapa