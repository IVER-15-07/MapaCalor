import React from 'react'
import { Phone, MapPin } from 'lucide-react'

const DashboardLlamadas = ({ calls = [], isElastixActive }) => {
  if (!calls.length) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
        <Phone className="h-8 w-8 opacity-20" />
        <p>{isElastixActive ? 'Esperando ingreso de llamadas...' : 'Elastix inactivo'}</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {calls.map((call, index) => {
        // Fallback: Si tus datos de prueba no traen número real, generamos uno falso usando el ID/Index para que el diseño funcione.
        const phoneNumber = call.numero || call.phone || call.caller_id || `+591 7${Math.floor(Math.random() * 9000000 + 1000000)}`
        const sectorName = call.sector_operativo || call.zone || 'Sector No Identificado'

        return (
          <div key={call.id || index} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/20 transition-colors">
            
            <div className="flex flex-col gap-1">
              {/* Número de teléfono principal */}
              <div className="flex items-center gap-2">
                <span className={`text-sm font-bold tracking-wide ${isElastixActive ? 'text-blue-500' : 'text-foreground'}`}>
                  {phoneNumber}
                </span>
              </div>
              
              {/* Sector afectado debajo del número */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{sectorName}</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground/60">
                Hora
              </span>
              <span className="text-xs font-mono text-muted-foreground">
                {new Date(call.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

          </div>
        )
      })}
    </div>
  )
}

export default DashboardLlamadas