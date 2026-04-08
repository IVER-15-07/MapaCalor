import { Clock, Zap, Droplets, Wifi, AlertTriangle } from 'lucide-react'
import { cn } from '../lib/utils'


const incidents = [
  {
    id: 1,
    type: 'Corte de energía',
    zone: 'Zona Norte - Sector A',
    time: 'Hace 5 min',
    status: 'pending',
    icon: Zap,
    customer: 'CLI-2847'
  },
  {
    id: 2,
    type: 'Fuga de agua',
    zone: 'Centro - Av. Principal',
    time: 'Hace 12 min',
    status: 'in-progress',
    icon: Droplets,
    customer: 'CLI-1923'
  },
  {
    id: 3,
    type: 'Sin conexión',
    zone: 'Zona Industrial',
    time: 'Hace 18 min',
    status: 'pending',
    icon: Wifi,
    customer: 'CLI-4521'
  },
  {
    id: 4,
    type: 'Daño en medidor',
    zone: 'Residencial Sur',
    time: 'Hace 25 min',
    status: 'resolved',
    icon: AlertTriangle,
    customer: 'CLI-3156'
  },
  {
    id: 5,
    type: 'Corte de energía',
    zone: 'Parque Industrial',
    time: 'Hace 32 min',
    status: 'in-progress',
    icon: Zap,
    customer: 'CLI-7892'
  },
]

const statusConfig = {
  pending: { label: 'Pendiente', class: 'bg-chart-3/20 text-chart-3' },
  'in-progress': { label: 'En proceso', class: 'bg-primary/20 text-primary' },
  resolved: { label: 'Resuelto', class: 'bg-success/20 text-success' }
}

const RecentIncidents = () => {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <div>
          <h3 className="font-semibold text-card-foreground">Incidencias Recientes</h3>
          <p className="text-sm text-muted-foreground">Últimas llamadas registradas</p>
        </div>
        <button className="text-sm text-primary hover:underline">Ver todas</button>
      </div>

      <div className="divide-y divide-border">
        {incidents.map((incident) => (
          <div key={incident.id} className="flex items-center gap-4 p-4 hover:bg-secondary/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <incident.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-card-foreground truncate">{incident.type}</p>
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  statusConfig[incident.status].class
                )}>
                  {statusConfig[incident.status].label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{incident.zone}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{incident.customer}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {incident.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentIncidents
