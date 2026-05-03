import React from 'react'
import { MapPin } from 'lucide-react'
import { intensityConfig } from './mapUtils' // Asegúrate de que la ruta sea correcta

const MapSectores = ({ activePoints = [] }) => {
  // Ordenamos los datos reales de mayor a menor cantidad de incidencias
  // Y tomamos solo el "Top 5" para no hacer la tarjeta gigante (puedes quitar el .slice si quieres todos)
  const topSectores = [...activePoints]
    .sort((a, b) => b.incidents - a.incidents)
    .slice(0, 5)

  // Calculamos el máximo real para que la barra de progreso sea proporcional
  const maxIncidents = topSectores.length > 0 
    ? Math.max(...topSectores.map(s => s.incidents)) 
    : 1

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border p-4">
        <MapPin className="h-5 w-5 text-orange-500" />
        <div>
          <h3 className="font-semibold text-card-foreground uppercase">Incidencias en Vivo</h3>
          <p className="text-sm text-muted-foreground">Mayor concentración de incidencias</p>
        </div>
      </div>

      <div className="divide-y divide-border">
        {topSectores.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No hay datos de sectores activos
          </div>
        ) : (
          topSectores.map((sector, index) => {
            // Obtenemos la configuración de color e intensidad directo de tus utils
            const config = intensityConfig[sector.intensity] || intensityConfig.low

            return (
              <div key={sector.id} className="p-4">
                <div className="flex flex-col gap-2 mb-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-secondary text-xs font-medium text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="font-medium text-card-foreground uppercase">{sector.zone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-card-foreground">
                      {sector.incidents}
                    </span>
                    {/* Etiqueta de intensidad real basada en tus Utils */}
                    <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-secondary ${config.twColor.replace('bg-', 'text-')}`}>
                      {config.label}
                    </span>
                  </div>
                </div>
                
                {/* Barra de progreso usando los colores de Tailwind de tu intensityConfig */}
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${config.twColor}`}
                    style={{ width: `${(sector.incidents / maxIncidents) * 100}%` }}
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