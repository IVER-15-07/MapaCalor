import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Maximize2 } from 'lucide-react'

const heatPoints = [
  { id: 1, x: 25, y: 30, intensity: 'high', zone: 'Zona Norte', incidents: 45 },
  { id: 2, x: 45, y: 45, intensity: 'medium', zone: 'Centro', incidents: 28 },
  { id: 3, x: 70, y: 25, intensity: 'high', zone: 'Zona Industrial', incidents: 52 },
  { id: 4, x: 35, y: 65, intensity: 'low', zone: 'Zona Sur', incidents: 12 },
  { id: 5, x: 60, y: 70, intensity: 'medium', zone: 'Zona Este', incidents: 23 },
  { id: 6, x: 80, y: 55, intensity: 'critical', zone: 'Parque Industrial', incidents: 67 },
  { id: 7, x: 15, y: 50, intensity: 'low', zone: 'Residencial Oeste', incidents: 8 },
  { id: 8, x: 50, y: 20, intensity: 'medium', zone: 'Comercial Central', incidents: 31 },
]

const intensityColors = {
  low: 'bg-success/60',
  medium: 'bg-primary/70',
  high: 'bg-chart-3/80',
  critical: 'bg-destructive/90'
}

const intensitySizes = {
  low: 'h-8 w-8',
  medium: 'h-12 w-12',
  high: 'h-16 w-16',
  critical: 'h-20 w-20'
}


const HeatMap = () => {
      const [hoveredPoint, setHoveredPoint] = useState(null)
  return (
        <div className="rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-card-foreground">Mapa de Calor</h3>
          <p className="text-sm text-muted-foreground">Distribución geográfica de incidencias</p>
        </div>
        <Link 
          to="/mapa"
          className="inline-flex items-center gap-2 self-start rounded-lg bg-secondary px-3 py-2 text-sm text-foreground hover:bg-secondary/80"
        >
          <Maximize2 className="h-4 w-4" />
          Ver completo
        </Link>
      </div>

      <div className="relative min-h-72 overflow-hidden bg-secondary/30 p-4 sm:h-80">
        {/* Grid lines */}
        <div className="absolute inset-4 grid grid-cols-8 grid-rows-6 gap-px opacity-20">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="border border-border" />
          ))}
        </div>

        {/* Heat points */}
        {heatPoints.map((point) => (
          <div
            key={point.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            onMouseEnter={() => setHoveredPoint(point)}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <div 
              className={`${intensitySizes[point.intensity]} ${intensityColors[point.intensity]} rounded-full blur-md`}
            />
            <div 
              className={`absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground/50 ${intensityColors[point.intensity]}`}
            />
          </div>
        ))}

        {/* Tooltip */}
        {hoveredPoint && (
          <div 
            className="pointer-events-none absolute z-10 rounded-lg border border-border bg-popover p-3 shadow-lg"
            style={{ 
              left: `${hoveredPoint.x}%`, 
              top: `${hoveredPoint.y - 15}%`,
              transform: 'translateX(-50%)'
            }}
          >
            <p className="font-medium text-popover-foreground">{hoveredPoint.zone}</p>
            <p className="text-sm text-muted-foreground">{hoveredPoint.incidents} incidencias</p>
          </div>
        )}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 rounded-lg border border-border bg-card/90 p-3 backdrop-blur">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Intensidad</p>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-success" />
              <span className="text-muted-foreground">Baja</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Media</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-chart-3" />
              <span className="text-muted-foreground">Alta</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-destructive" />
              <span className="text-muted-foreground">Crítica</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeatMap
