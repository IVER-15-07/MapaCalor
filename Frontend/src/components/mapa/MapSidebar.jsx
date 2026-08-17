import React from 'react'
import { MapPin, Calendar } from 'lucide-react'
import { cn } from '../../lib/Utils'
import { intensityConfig } from './mapUtils'
import Card from '../ui/Card'

export const MapSidebar = ({ 
  sectorCount = 0, 
  selectedDate = 'Hoy', 
  selectedPoint, 
  metricLabelTitle = 'Incidencias', 
  activePoints = [], 
  handlePointSelect,
  currentCalls,
  threshold,
  mapState
}) => {
  // Configuración para las Cards superiores
  const smarflexStats = [
    { 
      title: 'Sectores Afectados', 
      value: sectorCount, 
      icon: MapPin, 
      color: 'text-orange-500' 
    },
    { 
      title: 'Fecha de Consulta', 
      value: selectedDate || 'Hoy', 
      icon: Calendar, 
      color: 'text-primary' 
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

      {/* 📍 DETALLES DEL SECTOR SELECCIONADO */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <h3 className="font-semibold text-card-foreground">Detalles del Sector</h3>
        </div>
        {selectedPoint ? (
          <div className="space-y-4 p-4">
            <p className="text-lg font-semibold text-card-foreground">
              {selectedPoint.zone || selectedPoint.district || 'Sector'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-xs text-muted-foreground">{metricLabelTitle}</p>
                <p className="text-xl font-semibold text-foreground">
                  {selectedPoint.incidents ?? 0}
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <p className="text-xs text-muted-foreground">Intensidad</p>
                <p className={cn(
                  'text-xl font-semibold',
                  intensityConfig[selectedPoint.intensity]?.twColor?.replace('bg-', 'text-') || 'text-orange-500'
                )}>
                  {intensityConfig[selectedPoint.intensity]?.label || 'Baja'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <MapPin className="mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              Selecciona un punto en el mapa para analizar la zona.
            </p>
          </div>
        )}
      </div>

      {/* 📋 LISTADO DE SECTORES AFECTADOS (ORDENADOS DE MAYOR A MENOR) */}
      <div className="flex-1 overflow-hidden rounded-xl border border-border bg-card">
        <div className="border-b border-border bg-muted/20 p-4">
          <h3 className="font-semibold text-card-foreground">Sectores Afectados (Mayor a Menor)</h3>
        </div>
        <div className="flex h-75 flex-1 flex-col divide-y divide-border overflow-y-auto">
          {activePoints.length > 0 ? (
            [...activePoints]
              .sort((a, b) => (b.incidents || 0) - (a.incidents || 0))
              .map((point) => {
                const config = intensityConfig[point.intensity] || intensityConfig.low

                return (
                  <button 
                    key={point.id} 
                    onClick={() => handlePointSelect && handlePointSelect(point)} 
                    className={cn(
                      'flex w-full items-center justify-between p-3 text-left transition-colors hover:bg-secondary/50', 
                      selectedPoint?.id === point.id && 'border-l-2 border-primary bg-secondary'
                    )}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span className={cn('h-2 w-2 shrink-0 rounded-full', config.twColor || 'bg-blue-500')} />
                      <span className="truncate text-sm text-card-foreground">
                        {point.zone || point.district || 'Sector'}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground shrink-0 ml-2">
                      {point.incidents ?? 0}
                    </span>
                  </button>
                )
              })
          ) : (
            <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
              No hay sectores activos.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MapSidebar