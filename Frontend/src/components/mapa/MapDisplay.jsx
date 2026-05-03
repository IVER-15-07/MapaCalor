import React from 'react'
import { MapContainer } from './MapContainer'
import { intensityConfig } from './mapUtils'
import { cn } from '../../lib/Utils'

export const MapDisplay = ({
  zoom,
  selectedPoint,
  activePoints,
  handlePointSelect,
  metricLabelTitle,
  sectorCount,
  totalIncidents,
  metricLabel,
  sourceMode
}) => {
  return (
    <div className="flex flex-col gap-3">

      {/* 🔹 MAPA */}
      <div className="relative min-h-[60vh] w-full overflow-hidden rounded-xl border border-border bg-slate-800">
        <MapContainer
          zoom={zoom}
          selectedPoint={selectedPoint}
          activePoints={activePoints}
          handlePointSelect={handlePointSelect}
          metricLabelTitle={metricLabelTitle}
        />
      </div>

      {/* 🔹 LEYENDA / FOOTER (DEBAJO DEL MAPA) */}
      <div className="flex items-center justify-between rounded-lg border border-border bg-card p-3 shadow-sm">

        {/* Intensidad */}
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-muted-foreground">
            Intensidad:
          </span>

          {Object.entries(intensityConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={cn('h-3 w-3 rounded-full', config.twColor)} />
              <span className="text-sm text-muted-foreground">
                {config.label}
              </span>
            </div>
          ))}
        </div>

        {/* Métricas */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {sectorCount}
            </span>{' '}
            zonas
          </span>

          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {totalIncidents}
            </span>{' '}
            {metricLabel} ({sourceMode})
          </span>
        </div>

      </div>
    </div>
  )
}