// MapSidebar.jsx
import React from 'react'
// Añadido el ícono Calendar
import { PhoneCall, MapPin, X, AlertTriangle, Activity, Calendar } from 'lucide-react'
import { cn } from '../../lib/Utils'
import { intensityConfig } from './mapUtils'
import Card from '../ui/Card'

export const MapSidebar = ({ 
  sectorCount, 
  selectedDate, 

  selectedPoint, 
   
  metricLabelTitle, 
  activePoints, 
  handlePointSelect,

  currentCalls,
  threshold,
  mapState
}) => {
  const isCritical = mapState === 'critical' || currentCalls >= threshold

  // 🔴 CORREGIDO: Valores asignados correctamente a sus títulos
  const smarflexStats = [
    { 
      title: 'Sectores Afectados', 
      value: sectorCount,           // Antes decía incidentsToday
      icon: MapPin, 
      color: 'text-orange-500' 
    },
    { 
      title: 'Fecha de Consulta', 
      value: selectedDate,          // Antes decía sectorCount
      icon: Calendar,               // Cambiado a ícono de calendario
      color: 'text-primary'         // Un color diferente (o puedes dejar orange-500)
    }
  ]

  return (
    <div className="relative z-10 flex w-full flex-col gap-4 xl:w-72">
      {/* 📊 CARDS PRINCIPALES */}
      <div className="grid grid-cols-2 gap-3">
        {smarflexStats.map((stat) => (
          <Card
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            size="sm"
            showIcon={true}
            className="bg-card/50"
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <h3 className="font-semibold text-card-foreground">Detalles del Sector</h3>
        </div>
        {selectedPoint ? (
          <div className="space-y-4 p-4">
            <p className="text-lg font-semibold text-card-foreground">{selectedPoint.zone}</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-xs text-muted-foreground">{metricLabelTitle}</p>
                <p className="text-xl font-semibold text-foreground">{selectedPoint.incidents}</p>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Intensidad</p>
                <p className={cn('text-xl font-semibold text-orange-500')}>
                  {intensityConfig[selectedPoint.intensity].label}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <MapPin className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">Selecciona un punto en el mapa para analizar la zona.</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border bg-muted/20 p-4">
          <h3 className="font-semibold text-card-foreground">Sectores Afectados (Mayor a Menor)</h3>
        </div>
        <div className="flex h-75 flex-1 flex-col divide-y divide-border overflow-y-auto">
          {activePoints.length > 0 ? (
            [...activePoints].sort((a, b) => b.incidents - a.incidents).map((point) => (
              <button key={point.id} onClick={() => handlePointSelect(point)} className={cn('flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-secondary/50', selectedPoint?.id === point.id && 'border-l-2 border-primary bg-secondary')}>
                <div className="flex items-center gap-3">
                  <span className={cn('h-2 w-2 rounded-full', intensityConfig[point.intensity].twColor)} />
                  <span className="truncate text-sm text-card-foreground">{point.zone}</span>
                </div>
                <span className="text-sm font-semibold text-muted-foreground">{point.incidents}</span>
              </button>
            ))
          ) : (
             <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">No hay sectores activos.</div>
          )}
        </div>
      </div>
    </div>
  )
}