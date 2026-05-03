import React, { useEffect, useMemo, useState } from 'react'
import { historialService } from '../api/incidencias/Historial'
import {getTodayISO, mapSectorNamesToPoints,} from '../components/mapa/mapUtils'



import { MapHeader } from '../components/mapa/MapHeaderNew'
import { MapDisplay } from '../components/mapa/MapDisplay'
import { MapSidebar } from '../components/mapa/MapSidebar'

const Mapa = () => {
  
  const [selectedDate, setSelectedDate] = useState(getTodayISO())
  const [activePoints, setActivePoints] = useState([])
  const [backendSectorCount, setBackendSectorCount] = useState(0)
  const [backendIncidentCount, setBackendIncidentCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [zoom, setZoom] = useState(12)

  // ── Función central de carga ────────────────────────────────
  const loadSectors = async (dataResponse) => {
    setLoading(false)
    setError('')
    setSelectedPoint(null)

    try {
      const llamadasPorSector = dataResponse.llamadas_por_sector || []
      const points = mapSectorNamesToPoints(llamadasPorSector)
      setBackendSectorCount(dataResponse.total_sectores || llamadasPorSector.length)
      setBackendIncidentCount(dataResponse.total_llamadas || 0)
      setActivePoints(points)
    } catch (err) {
      setBackendSectorCount(0)
      setBackendIncidentCount(0)
      setActivePoints([])
      setError(err.message || 'No se pudo cargar la información')
    } finally {
      setLoading(false)
    }
  }

  // Carga inicial con el día de hoy
  useEffect(() => {
    const initialize = async () => {
      setLoading(true)
      try {
        const data = await historialService.getHeatmapState({ fechaRegistro: getTodayISO(), mode: 'normal' })
        loadSectors(data)
      } catch (err) {
        setError(err.message || 'No se pudo cargar la información')
        setLoading(false)
      }
    }
    initialize()
  }, []) 

  // ── Handlers para el botón Consulta ────────────────────────
  const handleConsultaDay = async (date) => {
    setSelectedDate(date)
    setLoading(true)
    try {
      const data = await historialService.getHeatmapState({ fechaRegistro: date, mode: 'normal' })
      loadSectors(data)
    } catch (err) {
      setError(err.message || 'Error al consultar la fecha')
      setLoading(false)
    }
  }

  const handleConsultaMonth = async (yearMonth) => {
    setSelectedDate(yearMonth)
    setLoading(true)
    try {
      const data = await historialService.getSectorByMonth(yearMonth)
      loadSectors(data)
    } catch (err) {
      setError(err.message || 'Error al consultar el mes')
      setLoading(false)
    }
  }

  const handleConsultaRange = async (from, to) => {
    setSelectedDate(`${from} → ${to}`)
    setLoading(true)
    try {
      const data = await historialService.getSectorsByRange(from, to)
      loadSectors(data)
    } catch (err) {
      setError(err.message || 'Error al consultar el rango')
      setLoading(false)
    }
  }

  // ── Métricas derivadas ──────────────────────────────────────
  const totalIncidents = useMemo(
    () => activePoints.reduce((sum, p) => sum + p.incidents, 0),
    [activePoints]
  )
  const sectorCount = activePoints.length

  return (
    <div className="flex h-full flex-col gap-6 xl:flex-row xl:items-stretch">

      {/* ── COLUMNA IZQUIERDA: mapa + header ── */}
      <div className="flex min-w-0 flex-[1.7] flex-col">
        <MapHeader
          zoom={zoom}
          setZoom={setZoom}
          loading={loading}
          error={error}
          backendSectorCount={backendSectorCount}
          backendIncidentCount={backendIncidentCount}
          onConsultaDay={handleConsultaDay}
          onConsultaMonth={handleConsultaMonth}
          onConsultaRange={handleConsultaRange}
        />

        <MapDisplay
          zoom={zoom}
          selectedPoint={selectedPoint}
          activePoints={activePoints}
          handlePointSelect={setSelectedPoint}
          metricLabelTitle="Incidencias"
          sectorCount={sectorCount}
          totalIncidents={totalIncidents}
          metricLabel="incidencias"
          sourceMode="smarflex"
        />
      </div>

      {/* ── PANEL DERECHO: sidebar con lista ── */}
      <MapSidebar
        sectorCount={sectorCount}
        selectedDate={selectedDate}
        selectedPoint={selectedPoint}
        setSelectedPoint={setSelectedPoint}
        metricLabelTitle="Incidencias"
        activePoints={activePoints}
        handlePointSelect={setSelectedPoint}
      />

    </div>
  )
}

export default Mapa