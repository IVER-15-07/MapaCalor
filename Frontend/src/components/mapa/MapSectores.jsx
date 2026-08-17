import React from 'react'
import { MapPin } from 'lucide-react'
import { intensityConfig } from './mapUtils'

const MapSectores = ({ activePoints = [], onSelectSector }) => {
  // Ordenamos los datos reales de mayor a menor cantidad de incidencias
  // Tomamos solo el "Top 5" para mantener la tarjeta compacta
  const topSectores = [...activePoints]
    .sort((a, b) => (b.incidents || 0) - (a.incidents || 0))
    .slice(0, 5)

  // Calculamos el máximo real para que la barra de progreso sea proporcional
  const maxIncidents = topSectores.length > 0 
    ? Math.max(...topSectores.map(s => s.incidents || 0), 1) 
    : 1

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-border p-4">
        <MapPin className="h-5 w-5 text-orange-500 shrink-0" />
        <div>
          <h3 className="font-semibold text-card-foreground uppercase tracking-wide text-sm">
            Incidencias en Vivo
          </h3>
          <p className="text-xs text-muted-foreground">
            Mayor concentración de incidencias por sector
          </p>
        </div>
      </div>

      <div className="divide-y divide-border">
        {topSectores.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No hay datos de sectores activos
          </div>
        ) : (
          topSectores.map((sector, index) => {
            // Obtenemos la configuración de color e intensidad directo de mapUtils
            const config = intensityConfig[sector.intensity] || intensityConfig.low
            const incidentsCount = sector.incidents || 0
            const progressPercentage = Math.min((incidentsCount / maxIncidents) * 100, 100)

            return (
              <div 
                key={sector.id || index} 
                onClick={() => onSelectSector && onSelectSector(sector)}
                className={`p-4 transition-colors ${onSelectSector ? 'cursor-pointer hover:bg-secondary/40' : ''}`}
              >
                <div className="flex flex-col gap-2 mb-2 sm:flex-row sm:items-center sm:justify-between">
                  {/* Posición y Nombre de la Zona */}
                  <div className="flex items-center gap-2 truncate">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-secondary text-xs font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="font-medium text-card-foreground uppercase text-sm truncate">
                      {sector.zone || sector.district || 'SECTOR'}
                    </span>
                  </div>

                  {/* Cantidad de Incidencias e Insumos de Intensidad */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-card-foreground">
                      {incidentsCount}
                    </span>
                    
                    {/* Etiqueta de intensidad */}
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-secondary ${config.twColor ? config.twColor.replace('bg-', 'text-') : 'text-blue-500'}`}>
                      {config.label || 'BAJA'}
                    </span>
                  </div>
                </div>
                
                {/* Barra de progreso proporcional */}
                <div className="h-2 rounded-full bg-secondary overflow-hidden w-full">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${config.twColor || 'bg-blue-500'}`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default MapSectores