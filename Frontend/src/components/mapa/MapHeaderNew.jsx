// MapHeader.jsx - VERSIÓN HISTÓRICA CON BOTÓN CONSULTA
import React, { useState, useEffect, useRef } from 'react'
import { ZoomIn, ZoomOut, Layers, Loader2, Search } from 'lucide-react'

export const MapHeader = ({
  zoom, setZoom, loading, error,
  backendSectorCount, backendIncidentCount,
  onConsultaDay, onConsultaMonth, onConsultaRange
}) => {
  const [showConsultaMenu, setShowConsultaMenu] = useState(false)
  const menuRef = useRef(null)
  const [daySelect, setDaySelect] = useState(new Date().toISOString().split('T')[0])
  const today = new Date()
  const initialMonth = String(today.getMonth() + 1).padStart(2, '0')
  const initialYear = today.getFullYear().toString()
  const [monthSelect, setMonthSelect] = useState(initialMonth)
  const [yearSelect, setYearSelect] = useState(initialYear)
  const [rangeFrom, setRangeFrom] = useState('')
  const [rangeTo, setRangeTo] = useState('')
  const [pendingQuery, setPendingQuery] = useState(false)

  const handleConsultaDay = () => {
    if (onConsultaDay) {
      onConsultaDay(daySelect)
      setPendingQuery(true)
    } else {
      setShowConsultaMenu(false)
    }
  }

  const handleConsultaMonth = () => {
    if (onConsultaMonth) {
      onConsultaMonth(`${yearSelect}-${monthSelect}`)
      setPendingQuery(true)
    } else {
      setShowConsultaMenu(false)
    }
  }

  const handleConsultaRange = () => {
    if (rangeFrom && rangeTo) {
      if (onConsultaRange) {
        onConsultaRange(rangeFrom, rangeTo)
        setPendingQuery(true)
      } else {
        setShowConsultaMenu(false)
      }
    }
  }

  // Cerrar el menú cuando la consulta pendiente haya terminado (loading -> false)
  useEffect(() => {
    if (pendingQuery && !loading) {
      const timeout = setTimeout(() => {
        setShowConsultaMenu(false)
        setPendingQuery(false)
      }, 0)
      return () => clearTimeout(timeout)
    }
  }, [pendingQuery, loading])

  // Cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    if (!showConsultaMenu) return
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowConsultaMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showConsultaMenu])

  return (
    <>
      {/* Cabecera Principal */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Mapa Histórico de Incidencias
          </h1>
          <p className="text-muted-foreground">
            Consulta de datos por fecha, mes o rango
          </p>
        </div>
        
        {/* Controles de Zoom y Capas + Botón Consulta */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card">
            <button onClick={() => setZoom((prev) => Math.max(8, prev - 1))} className="rounded-l-lg p-2 hover:bg-secondary">
              <ZoomOut className="h-4 w-4 text-muted-foreground" />
            </button>
            <span className="px-3 text-sm font-medium text-muted-foreground">Z: {zoom}</span>
            <button onClick={() => setZoom((prev) => Math.min(18, prev + 1))} className="rounded-r-lg p-2 hover:bg-secondary">
              <ZoomIn className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            <Layers className="h-4 w-4" /> Capas
          </button>

          {/* Botón Consulta Principal */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowConsultaMenu(!showConsultaMenu)}
              className="flex items-center gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-500 hover:bg-blue-500/20 transition-colors"
            >
              <Search className="h-4 w-4" /> Consulta
            </button>

            {/* Dropdown Menu */}
            {showConsultaMenu && (
             <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-border bg-zinc-950 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-1000">
                <div className="p-4 space-y-4">
                  {/* Opción 1: Día Específico */}
                  <div className="border-b border-border pb-4">
                    <h3 className="text-sm font-semibold text-card-foreground mb-3">Día Específico</h3>
                    <div className="flex gap-2">
                      <input 
                        type="date" 
                        value={daySelect} 
                        onChange={(e) => setDaySelect(e.target.value)}
                        className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button 
                        onClick={handleConsultaDay}
                        disabled={loading}
                        className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                      >
                        Consultar
                      </button>
                    </div>
                  </div>

                  {/* Opción 2: Mes Completo */}
                  <div className="border-b border-border pb-4">
                    <h3 className="text-sm font-semibold text-card-foreground mb-3">Mes Completo</h3>
                      <div className="flex gap-2">
                        <select
                          value={monthSelect}
                          onChange={(e) => setMonthSelect(e.target.value)}
                          className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="01">Enero</option>
                          <option value="02">Febrero</option>
                          <option value="03">Marzo</option>
                          <option value="04">Abril</option>
                          <option value="05">Mayo</option>
                          <option value="06">Junio</option>
                          <option value="07">Julio</option>
                          <option value="08">Agosto</option>
                          <option value="09">Septiembre</option>
                          <option value="10">Octubre</option>
                          <option value="11">Noviembre</option>
                          <option value="12">Diciembre</option>
                        </select>

                        <input
                          type="number"
                          min="2000"
                          max="2100"
                          value={yearSelect}
                          onChange={(e) => setYearSelect(e.target.value)}
                          className="w-24 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />

                        <button
                          onClick={handleConsultaMonth}
                          disabled={loading}
                          className="rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        >
                          Consultar
                        </button>
                      </div>
                  </div>

                  {/* Opción 3: Rango de Fechas */}
                  <div>
                    <h3 className="text-sm font-semibold text-card-foreground mb-3">Rango de Fechas</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input 
                          type="date"
                          value={rangeFrom}
                          onChange={(e) => setRangeFrom(e.target.value)}
                          className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <input 
                          type="date"
                          value={rangeTo}
                          onChange={(e) => setRangeTo(e.target.value)}
                          className="flex-1 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <button 
                        onClick={handleConsultaRange}
                        disabled={loading || !rangeFrom || !rangeTo}
                        className="w-full rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                      >
                        Consultar Rango
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información de Carga y Resultados */}
      <div className="mb-4 flex flex-col gap-2 rounded-xl border border-border bg-card p-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {loading && pendingQuery && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Cargando datos...
            </div>
          )}
          
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="text-xs text-muted-foreground">
              Mostrando: <strong>{backendSectorCount}</strong> sectores / <strong>{backendIncidentCount}</strong> incidencias
            </div>
          )}
        </div>
      </div>
    </>
  )
}
