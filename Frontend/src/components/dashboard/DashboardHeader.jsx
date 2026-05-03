// src/components/dashboard/DashboardHeader.jsx
import React from 'react'
import { AlertTriangle, PhoneCall, MapPin, Activity } from 'lucide-react'
import Card from '../ui/Card'

export const DashboardHeader = ({
  incidentsToday,
  affectedSectors,
  receivedCalls,
  currentCalls,
  threshold,
  mapState,      // Nuevo: 'normal' o 'critical'
  crisisTimer    // Nuevo: '00:00'
}) => {
  // Evaluamos si estamos en estado de alerta
  const isCritical = mapState === 'critical' || currentCalls >= threshold

  const smarflexStats = [
    { title: 'Incidencias Hoy', value: incidentsToday, icon: AlertTriangle, color: 'text-orange-500' },
    { title: 'Sectores Afectados', value: affectedSectors, icon: MapPin, color: 'text-orange-500' }
  ]

  const elastixStats = [
    { title: 'Llamadas Recibidas', value: receivedCalls, icon: PhoneCall, color: 'text-blue-500' },
    { title: 'Llamadas / Umbral', value: `${currentCalls} / ${threshold}`, icon: Activity, color: isCritical ? 'text-red-500' : 'text-blue-400' }
  ]

  return (
    <div className="flex flex-col gap-4">
      
      {/* 🚨 BANNER CRÍTICO (Solo visible en saturación) */}
      {isCritical && (
        <div className="animate-in fade-in slide-in-from-top-4 rounded-2xl border border-red-500/50 bg-red-950/40 px-4 py-3 shadow-[0_0_30px_rgba(239,68,68,0.15)] flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-red-500 bg-red-500/20 text-red-400">
              <AlertTriangle className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <p className="text-lg font-bold tracking-wide text-red-400">¡ALERTA DE SATURACIÓN!</p>
              <p className="text-sm text-red-200/80">
                Elastix detectó <strong>{currentCalls}</strong> llamadas simultáneas. Smarflex minimizado para priorizar telefonía.
              </p>
            </div>
          </div>
          <div className="shrink-0 rounded-lg border border-red-500/30 bg-red-950/50 px-4 py-2 text-center">
            <p className="text-[10px] uppercase tracking-wider text-red-300/70">Tiempo en Crisis</p>
            <p className="text-xl font-mono font-semibold text-red-400">{crisisTimer || '00:00'}</p>
          </div>
        </div>
      )}

      {/* 📊 ÁREA DE DATOS: SEPARACIÓN CLARA SMARFLEX VS ELASTIX */}
      <div className={`grid gap-4 transition-all duration-300 ${isCritical ? 'grid-cols-2 opacity-90' : 'grid-cols-1 lg:grid-cols-2'}`}>
        
        {/* PANEL SMARFLEX (Naranja/Cálido) */}
        <div className={isCritical 
          ? "flex flex-col justify-center rounded-lg border border-orange-500/20 bg-orange-500/5 py-2 px-4" 
          : "rounded-xl border border-orange-500/20 bg-orange-500/5 p-4"}>
          
          {!isCritical && (
            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-500/80">
              <MapPin className="h-4 w-4" /> Datos Smarflex (Incidencias)
            </h3>
          )}
          
          <div className={`grid gap-2 ${isCritical ? 'grid-cols-2 w-full' : 'grid-cols-2'}`}>
            {smarflexStats.map((stat) => (
              <Card
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                size="sm"
                showIcon={!isCritical} // Oculta el ícono si hay crisis para ahorrar espacio
                // Si es crítico, quitamos el padding, el fondo y los bordes mediante Tailwind Merge (cn) en tu componente Card
                className={isCritical ? "p-0 bg-transparent border-none shadow-none" : "bg-card/50"}
              />
            ))}
          </div>
        </div>

        {/* PANEL ELASTIX (Azul/Frío) */}
        <div className={isCritical 
          ? "flex flex-col justify-center rounded-lg border border-blue-500/20 bg-blue-500/5 py-2 px-4" 
          : "rounded-xl border border-blue-500/20 bg-blue-500/5 p-4"}>
          
          {!isCritical && (
            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-500/80">
              <PhoneCall className="h-4 w-4" /> Datos Elastix (Telefonía)
            </h3>
          )}

          <div className={`grid gap-2 ${isCritical ? 'grid-cols-2 w-full' : 'grid-cols-2'}`}>
            {elastixStats.map((stat) => (
              <Card
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                size="sm"
                showIcon={!isCritical}
                className={isCritical ? "p-0 bg-transparent border-none shadow-none" : "bg-card/50"}
              />
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}