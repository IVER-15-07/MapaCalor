import React from 'react'
import { ZoomIn, ZoomOut, Layers, AlertTriangle, Loader2, Activity } from 'lucide-react'
import { cn } from '../../lib/Utils'

export const MapHeader = ({
  zoom, setZoom, mapState, sourceMode, isRealtimeDate, crisisTimer,
  selectedDate, setSelectedDate,
  selectedMonth, setSelectedMonth,
  range, setRange,
  mode, setMode, handleConsult,
  concurrentCalls, criticalThreshold,
  setCriticalThreshold, elastixEnabled, setElastixEnabled, loading, error,
  backendSectorCount, backendIncidentCount, elastixSummaryLength
}) => {
  return (
    <>
      {/* Cabecera Principal que cambia según el estado */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {mapState === 'critical' 
              ? 'Mapa de Saturación (Llamadas Elastix)' 
              : 'Mapa de Incidencias (Registros Smarflex)'}
          </h1>
          <p className="text-muted-foreground">
            {mapState === 'critical'
              ? 'Mostrando volumen de llamadas en tiempo real debido a superación de umbral.'
              : 'Mostrando registros de incidencias por zona.'}
          </p>
        </div>
        
        {/* Controles de Zoom y Capas */}
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
        </div>
      </div>

      {/* 🚨 BANNER CRÍTICO: SOLO APARECE SI SE SUPERA EL UMBRAL 🚨 */}
      {mapState === 'critical' && (
        <div className="mb-4 animate-in fade-in slide-in-from-top-4 rounded-2xl border border-red-500/50 bg-red-950/40 px-4 py-3 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-red-500 bg-red-500/20 text-red-400">
                <AlertTriangle className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <p className="text-xl font-bold tracking-wide text-red-400">¡ALERTA DE SATURACIÓN!</p>
                <p className="text-sm text-red-200/80">
                  Elastix detectó <strong>{concurrentCalls}</strong> llamadas simultáneas. El mapa ha ocultado Smarflex para priorizar la visualización de llamadas.
                </p>
              </div>
            </div>
            
            {/* Tiempo de crisis */}
            <div className="rounded-lg border border-red-500/30 bg-red-950/50 px-4 py-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-red-300/70">Tiempo en Crisis</p>
              <p className="text-2xl font-mono font-semibold text-red-400">{crisisTimer}</p>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Filtros (Día, Mes, Rango + Monitoreo Elastix) */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
        
        {/* Selector de Modo */}
        <select
          value={mode || 'day'}
          onChange={(e) => setMode && setMode(e.target.value)}
          className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="day">Día</option>
          <option value="month">Mes</option>
          <option value="range">Rango</option>
        </select>

        {/* Modo Día */}
        {mode === 'day' && (
          <input 
            type="date" 
            value={selectedDate || ''} 
            onChange={(e) => setSelectedDate && setSelectedDate(e.target.value)} 
            className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
          />
        )}

        {/* Modo Mes */}
        {mode === 'month' && (
          <div className="flex gap-2">
            <input
              type="number"
              min="2000"
              max="2100"
              value={selectedMonth?.split('-')[0] || ''}
              onChange={(e) => {
                const year = e.target.value
                const month = selectedMonth?.split('-')[1] || '01'
                setSelectedMonth && setSelectedMonth(`${year}-${month}`)
              }}
              placeholder="Año"
              className="h-10 w-24 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={selectedMonth?.split('-')[1] || '01'}
              onChange={(e) => {
                const month = e.target.value
                const year = selectedMonth?.split('-')[0] || '2026'
                setSelectedMonth && setSelectedMonth(`${year}-${month}`)
              }}
              className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="01">Ene</option>
              <option value="02">Feb</option>
              <option value="03">Mar</option>
              <option value="04">Abr</option>
              <option value="05">May</option>
              <option value="06">Jun</option>
              <option value="07">Jul</option>
              <option value="08">Ago</option>
              <option value="09">Sep</option>
              <option value="10">Oct</option>
              <option value="11">Nov</option>
              <option value="12">Dic</option>
            </select>
          </div>
        )}

        {/* Modo Rango */}
        {mode === 'range' && (
          <div className="flex gap-2">
            <input
              type="date"
              value={range?.from || ''}
              onChange={(e) => setRange && setRange(prev => ({ ...prev, from: e.target.value }))}
              className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="date"
              value={range?.to || ''}
              onChange={(e) => setRange && setRange(prev => ({ ...prev, to: e.target.value }))}
              className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        )}

        {/* Botón Consultar */}
        <button
          onClick={handleConsult}
          disabled={loading}
          className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Consultando...' : 'Consultar'}
        </button>

        <div className="h-6 w-px bg-border mx-1"></div> {/* Separador visual */}

        {/* Monitoreo silencioso de Elastix */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4" /> <span>Llamadas actuales:</span>
        </div>
        <span className={cn(
          "rounded-md border px-3 py-1.5 text-sm font-bold transition-colors",
          mapState === 'critical' ? "border-red-500 bg-red-500/10 text-red-500" : "border-border bg-secondary text-foreground"
        )}>
          {concurrentCalls ?? 0}
        </span>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Umbral:</span>
          <input 
            type="number" 
            min={1} 
            value={criticalThreshold ?? 30} 
            onChange={(e) => setCriticalThreshold && setCriticalThreshold(Number(e.target.value) || 1)} 
            className="w-20 rounded-lg border border-border bg-secondary px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
          />
        </div>
        
        <button 
          onClick={() => setElastixEnabled && setElastixEnabled((prev) => !prev)} 
          disabled={!isRealtimeDate} 
          className={cn(
            'rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wide disabled:opacity-50 transition-colors', 
            elastixEnabled ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-slate-500/10 text-slate-500 hover:bg-slate-500/20'
          )}
        >
          {!isRealtimeDate ? 'Histórico' : elastixEnabled ? 'Monitoreo ON' : 'Monitoreo OFF'}
        </button>
        
        {/* Estados de carga e info */}
        {loading && <div className="flex items-center gap-2 text-sm text-muted-foreground ml-auto"><Loader2 className="h-4 w-4 animate-spin" /> Cargando...</div>}
        {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-600 ml-auto">{error}</div>}
        
        {!error && !loading && (
          <div className="text-xs text-muted-foreground ml-auto">
            {sourceMode === 'smarflex' 
              ? `Viendo: ${backendSectorCount ?? 0} sectores / ${backendIncidentCount ?? 0} incidencias`
              : `Viendo: ${elastixSummaryLength ?? 0} sectores con llamadas activas`}
          </div>
        )}
      </div>
    </>
  )
}

export default MapHeader