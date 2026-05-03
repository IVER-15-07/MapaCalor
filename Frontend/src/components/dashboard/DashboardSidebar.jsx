import React from 'react'
import { PhoneCall, AlertTriangle } from 'lucide-react'
import DashboardLlamadas from './DashboarLlmadas'

export const DashboardSidebar = ({
  isElastixActive,
  currentCalls,
  receivedCalls,
  sectorCount,
  selectedDate,
  recentCalls
}) => {
  return (
    // "xl:sticky xl:top-6" hace que el sidebar te siga al hacer scroll hacia abajo
    <div className="flex w-full flex-col gap-4 xl:w-80 shrink-0 xl:sticky xl:top-6">

      {/* 🔹 CARDS SUPERIORES DINÁMICAS */}
      <div className="grid grid-cols-2 gap-3">
        {isElastixActive ? (
          // Vista Crítica (Elastix)
          <>
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 relative overflow-hidden">
              <AlertTriangle className="absolute right-[-10px] top-[-10px] h-12 w-12 text-red-500/20" />
              <p className="text-xs text-red-400 font-medium">Llamadas Actuales</p>
              <p className="text-2xl font-bold text-red-500">{currentCalls}</p>
            </div>
            <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
              <p className="text-xs text-blue-400 font-medium">Llamadas Recibidas</p>
              <p className="text-2xl font-bold text-blue-500">{receivedCalls}</p>
            </div>
          </>
        ) : (
          // Vista Normal (Smarflex / Standard)
          <>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Sectores activos</p>
              <p className="text-2xl font-semibold text-foreground">{sectorCount}</p>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Fecha</p>
              <p className="text-sm font-semibold text-foreground mt-1">{selectedDate || '-'}</p>
            </div>
          </>
        )}
      </div>

      {/* 🔹 LLAMADAS EN VIVO */}
      <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className={`flex items-center justify-between border-b border-border p-4 transition-colors ${isElastixActive ? 'bg-blue-500/5' : ''}`}>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${isElastixActive ? 'bg-blue-500/20 text-blue-500' : 'bg-primary/20 text-primary'}`}>
              <PhoneCall className="h-4 w-4" />
            </div>
            <h3 className="font-semibold text-card-foreground">
              Directorio en Vivo
            </h3>
          </div>
          <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-full text-muted-foreground">
            {recentCalls.length} total
          </span>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          <DashboardLlamadas calls={recentCalls} isElastixActive={isElastixActive} />
        </div>
      </div>
    </div>
  )
}