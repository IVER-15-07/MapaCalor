import { useState } from 'react'
import { 
  Plus, 
  Search, 
  Filter, 
  Zap, 
  Droplets, 
  Wifi, 
  AlertTriangle,
  Clock,
  MapPin,
  User,
  Phone,
  X,
  ChevronDown
} from 'lucide-react'
import { cn } from '../lib/Utils'

const incidentsData = [
  { id: 'INC-001', type: 'Corte de energía', zone: 'Zona Norte - Sector A', customer: 'CLI-2847', phone: '555-0101', status: 'pending', time: '2024-03-15 14:32', product: 'Energía Residencial', icon: Zap },
  { id: 'INC-002', type: 'Fuga de agua', zone: 'Centro - Av. Principal', customer: 'CLI-1923', phone: '555-0102', status: 'in-progress', time: '2024-03-15 14:20', product: 'Agua Potable', icon: Droplets },
  { id: 'INC-003', type: 'Sin conexión', zone: 'Zona Industrial', customer: 'CLI-4521', phone: '555-0103', status: 'pending', time: '2024-03-15 14:15', product: 'Internet Fibra', icon: Wifi },
  { id: 'INC-004', type: 'Daño en medidor', zone: 'Residencial Sur', customer: 'CLI-3156', phone: '555-0104', status: 'resolved', time: '2024-03-15 14:00', product: 'Energía Comercial', icon: AlertTriangle },
  { id: 'INC-005', type: 'Corte de energía', zone: 'Parque Industrial', customer: 'CLI-7892', phone: '555-0105', status: 'in-progress', time: '2024-03-15 13:45', product: 'Energía Industrial', icon: Zap },
  { id: 'INC-006', type: 'Baja presión', zone: 'Zona Este', customer: 'CLI-5634', phone: '555-0106', status: 'pending', time: '2024-03-15 13:30', product: 'Agua Potable', icon: Droplets },
  { id: 'INC-007', type: 'Intermitencia', zone: 'Centro Comercial', customer: 'CLI-9012', phone: '555-0107', status: 'resolved', time: '2024-03-15 13:15', product: 'Internet Fibra', icon: Wifi },
  { id: 'INC-008', type: 'Voltaje irregular', zone: 'Nueva Industrial', customer: 'CLI-3478', phone: '555-0108', status: 'pending', time: '2024-03-15 13:00', product: 'Energía Industrial', icon: Zap },
]

const statusConfig = {
  pending: { label: 'Pendiente', class: 'bg-chart-3/20 text-chart-3 border-chart-3/30' },
  'in-progress': { label: 'En proceso', class: 'bg-primary/20 text-primary border-primary/30' },
  resolved: { label: 'Resuelto', class: 'bg-success/20 text-success border-success/30' }
}

const tabs = [
  { id: 'all', label: 'Todas', count: 8 },
  { id: 'pending', label: 'Pendientes', count: 4 },
  { id: 'in-progress', label: 'En Proceso', count: 2 },
  { id: 'resolved', label: 'Resueltas', count: 2 },
]

const Incidencias = () => {

     const [activeTab, setActiveTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState(null)

  const filteredIncidents = incidentsData.filter(incident => {
    const matchesTab = activeTab === 'all' || incident.status === activeTab
    const matchesSearch = incident.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.zone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.customer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
     <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Incidencias</h1>
          <p className="text-muted-foreground">Gestión de daños reportados por el canal 4200-135</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nueva Incidencia
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {tab.label}
              <span className={cn(
                'rounded-full px-2 py-0.5 text-xs',
                activeTab === tab.id ? 'bg-primary-foreground/20' : 'bg-muted'
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar incidencia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:w-64"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">
            <Filter className="h-4 w-4" />
            Filtros
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-[900px] w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Tipo</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Zona</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Cliente</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Producto</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Estado</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Fecha/Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredIncidents.map((incident) => (
              <tr 
                key={incident.id} 
                onClick={() => setSelectedIncident(incident)}
                className="cursor-pointer hover:bg-secondary/30"
              >
                <td className="px-4 py-4">
                  <span className="font-mono text-sm font-medium text-primary">{incident.id}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                      <incident.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm text-card-foreground">{incident.type}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {incident.zone}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-card-foreground">{incident.customer}</span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-muted-foreground">{incident.product}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={cn(
                    'inline-flex rounded-full border px-2.5 py-1 text-xs font-medium',
                    statusConfig[incident.status].class
                  )}>
                    {statusConfig[incident.status].label}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {incident.time}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando <span className="font-medium text-foreground">{filteredIncidents.length}</span> de <span className="font-medium text-foreground">{incidentsData.length}</span> incidencias
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:bg-secondary" disabled>
            Anterior
          </button>
          <button className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">1</button>
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">2</button>
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">3</button>
          <button className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">
            Siguiente
          </button>
        </div>
      </div>

      {/* New Incident Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="w-[95vw] max-w-lg rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-card-foreground">Nueva Incidencia</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-secondary rounded">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-card-foreground">Carné del Cliente</label>
                  <input type="text" placeholder="CLI-XXXX" className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-card-foreground">Teléfono</label>
                  <input type="text" placeholder="555-0000" className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-card-foreground">Tipo de Daño</label>
                <select className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option>Seleccionar tipo...</option>
                  <option>Corte de energía</option>
                  <option>Fuga de agua</option>
                  <option>Sin conexión</option>
                  <option>Daño en medidor</option>
                  <option>Voltaje irregular</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-card-foreground">Producto Afectado</label>
                <select className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:border-primary focus:outline-none">
                  <option>Seleccionar producto...</option>
                  <option>Energía Residencial</option>
                  <option>Energía Comercial</option>
                  <option>Energía Industrial</option>
                  <option>Agua Potable</option>
                  <option>Internet Fibra</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-card-foreground">Zona / Ubicación</label>
                <input type="text" placeholder="Ej: Zona Norte - Sector A" className="h-10 w-full rounded-lg border border-border bg-secondary px-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-card-foreground">Descripción</label>
                <textarea rows={3} placeholder="Descripción detallada del daño..." className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary">
                  Cancelar
                </button>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Registrar Incidencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <selectedIncident.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h2 className="font-semibold text-card-foreground">{selectedIncident.id}</h2>
                  <p className="text-sm text-muted-foreground">{selectedIncident.type}</p>
                </div>
              </div>
              <button onClick={() => setSelectedIncident(null)} className="p-1 hover:bg-secondary rounded">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Estado</span>
                <span className={cn('rounded-full border px-2.5 py-1 text-xs font-medium', statusConfig[selectedIncident.status].class)}>
                  {statusConfig[selectedIncident.status].label}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Cliente</span>
                <span className="text-sm text-card-foreground">{selectedIncident.customer}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Teléfono</span>
                <span className="text-sm text-card-foreground">{selectedIncident.phone}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Zona</span>
                <span className="text-sm text-card-foreground">{selectedIncident.zone}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Producto</span>
                <span className="text-sm text-card-foreground">{selectedIncident.product}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Fecha/Hora</span>
                <span className="text-sm text-card-foreground">{selectedIncident.time}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button className="flex-1 rounded-lg border border-border py-2 text-sm text-muted-foreground hover:bg-secondary">
                Editar
              </button>
              <button className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                Cambiar Estado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Incidencias
