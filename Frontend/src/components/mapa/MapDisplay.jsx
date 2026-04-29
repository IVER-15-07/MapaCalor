// src/components/mapa/MapDisplay.jsx
import React from 'react'
import { MapContainer } from './MapContainer' // Importamos el nuevo componente
import { intensityConfig } from './mapUtils'
import { cn } from '../../lib/Utils'

export const MapDisplay = ({ 
  zoom, selectedPoint, activePoints, handlePointSelect, 
  metricLabelTitle, sectorCount, totalIncidents, metricLabel, sourceMode 
}) => {
  return (
    <>
      <div className="relative z-0 min-h-[72vh] flex-1 overflow-hidden rounded-xl border border-border bg-slate-800">
        {/* Usamos el componente extraído */}
        <MapContainer 
          zoom={zoom}
          selectedPoint={selectedPoint}
          activePoints={activePoints}
          handlePointSelect={handlePointSelect}
          metricLabelTitle={metricLabelTitle}
        />
      </div>

      {/* Leyenda Footer */}
      <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-card p-3">
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-muted-foreground">Intensidad:</span>
          {Object.entries(intensityConfig).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={cn('h-3 w-3 rounded-full', config.twColor)} />
              <span className="text-sm text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">{sectorCount}</span> zonas
          </span>
          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">{totalIncidents}</span> {metricLabel} ({sourceMode})
          </span>
        </div>
      </div>
    </>
  )
}