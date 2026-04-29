// MapHeader.jsx
import React from 'react'
import { ZoomIn, ZoomOut, Layers, AlertTriangle, CalendarDays, Phone, Loader2, Activity } from 'lucide-react'
import { cn } from '../../lib/Utils'

export const MapHeader = ({
  zoom, setZoom, mapState, sourceMode, isRealtimeDate, crisisTimer,
  selectedDate, setSelectedDate, concurrentCalls, criticalThreshold,
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
            
            {/* Tiempo de crisis que pediste mantener */}
            <div className="rounded-lg border border-red-500/30 bg-red-950/50 px-4 py-2 text-center">
              <p className="text-[10px] uppercase tracking-wider text-red-300/70">Tiempo en Crisis</p>
              <p className="text-2xl font-mono font-semibold text-red-400">{crisisTimer}</p>
            </div>
          </div>
        </div>
      )}

      {/* Barra de Filtros (Siempre visible, con el Elastix de perfil bajo) */}
      <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
        {/* Fecha */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="h-4 w-4" /> <span>Fecha:</span>
        </div>
        <input 
          type="date" 
          value={selectedDate} 
          onChange={(e) => setSelectedDate(e.target.value)} 
          className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
        />
        
        <div className="h-6 w-px bg-border mx-1"></div> {/* Separador visual */}

        {/* Monitoreo silencioso de Elastix */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Activity className="h-4 w-4" /> <span>Llamadas actuales:</span>
        </div>
        <span className={cn(
          "rounded-md border px-3 py-1.5 text-sm font-bold transition-colors",
          mapState === 'critical' ? "border-red-500 bg-red-500/10 text-red-500" : "border-border bg-secondary text-foreground"
        )}>
          {concurrentCalls}
        </span>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Umbral:</span>
          <input 
            type="number" 
            min={1} 
            value={criticalThreshold} 
            onChange={(e) => setCriticalThreshold(Number(e.target.value) || 1)} 
            className="w-20 rounded-lg border border-border bg-secondary px-2 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary" 
          />
        </div>
        
        <button 
          onClick={() => setElastixEnabled((prev) => !prev)} 
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
              ? `Viendo: ${backendSectorCount} sectores / ${backendIncidentCount} incidencias`
              : `Viendo: ${elastixSummaryLength} sectores con llamadas activas`}
          </div>
        )}
      </div>
    </>
  )
}