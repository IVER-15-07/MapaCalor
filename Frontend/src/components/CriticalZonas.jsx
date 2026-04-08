import { AlertTriangle, TrendingUp } from 'lucide-react'

const zones = [
  { name: 'Parque Industrial', incidents: 67, change: '+23%', level: 'critical' },
  { name: 'Zona Industrial', incidents: 52, change: '+15%', level: 'high' },
  { name: 'Zona Norte', incidents: 45, change: '+8%', level: 'high' },
  { name: 'Comercial Central', incidents: 31, change: '+5%', level: 'medium' },
  { name: 'Centro', incidents: 28, change: '-2%', level: 'medium' },
]

const levelConfig = {
  critical: 'bg-destructive',
  high: 'bg-chart-3',
  medium: 'bg-primary'
}
const CriticalZonas = () => {

     const maxIncidents = Math.max(...zones.map(z => z.incidents))
     
  return (
   <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border p-4">
        <AlertTriangle className="h-5 w-5 text-chart-3" />
        <div>
          <h3 className="font-semibold text-card-foreground">Zonas Críticas</h3>
          <p className="text-sm text-muted-foreground">Mayor concentración de incidencias</p>
        </div>
      </div>

      <div className="divide-y divide-border">
        {zones.map((zone, index) => (
          <div key={zone.name} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-secondary text-xs font-medium text-muted-foreground">
                  {index + 1}
                </span>
                <span className="font-medium text-card-foreground">{zone.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-card-foreground">{zone.incidents}</span>
                <span className={`flex items-center gap-0.5 text-xs ${zone.change.startsWith('+') ? 'text-chart-3' : 'text-success'}`}>
                  <TrendingUp className="h-3 w-3" />
                  {zone.change}
                </span>
              </div>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${levelConfig[zone.level]}`}
                style={{ width: `${(zone.incidents / maxIncidents) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CriticalZonas
