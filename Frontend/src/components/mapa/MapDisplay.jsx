
import { MapContainer } from './MapContainer'
import { intensityConfig } from './mapUtils'
import { cn } from '../../lib/Utils'

export const MapDisplay = ({
  zoom = 12,
  selectedPoint,
  activePoints = [],
  handlePointSelect,
  metricLabelTitle = 'Incidencias',
  sectorCount = 0,
  totalIncidents = 0,
  metricLabel = 'incidencias',
  sourceMode
}) => {
  return (
    <div className="flex flex-col gap-3">
      {/* CONTENEDOR DEL MAPA */}
      <div className="relative min-h-[62vh] w-full overflow-hidden rounded-xl border border-border bg-slate-800 shadow-sm">
        <MapContainer
          zoom={zoom}
          selectedPoint={selectedPoint}
          activePoints={activePoints}
          handlePointSelect={handlePointSelect}
          metricLabelTitle={metricLabelTitle}
        />
      </div>

      {/* LEYENDA INFERIOR */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-lg border border-border bg-card p-3 shadow-sm">
        {/* Leyenda de Intensidades */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <span className="text-sm font-medium text-muted-foreground">
            Intensidad de Zona:
          </span>
          {Object.entries(intensityConfig || {}).map(([key, config]) => (
            <div key={key} className="flex items-center gap-2">
              <span className={cn('h-3 w-3 rounded-full', config?.twColor || 'bg-slate-500')} />
              <span className="text-sm text-muted-foreground">
                {config?.label || key}
              </span>
            </div>
          ))}
        </div>

        {/* Métricas e Info */}
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {sectorCount}
            </span>{' '}
            sectores delimitados
          </span>
          <span className="text-muted-foreground">
            <span className="font-semibold text-foreground">
              {totalIncidents}
            </span>{' '}
            {metricLabel} {sourceMode ? `(${sourceMode})` : ''}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MapDisplay