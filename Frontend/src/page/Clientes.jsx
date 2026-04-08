import { useState } from 'react'
import {
    Search,
    Filter,
    User,
    Phone,
    MapPin,
    Mail,
    FileText,
    X,
    ChevronRight,
    AlertTriangle
} from 'lucide-react'
import { cn } from '../lib/Utils'


const customersData = [
    { id: 'CLI-2847', name: 'Juan Pérez García', phone: '555-0101', email: 'juan.perez@email.com', zone: 'Zona Norte - Sector A', status: 'active', incidents: 3, lastIncident: '2024-03-15' },
    { id: 'CLI-1923', name: 'María López Rodríguez', phone: '555-0102', email: 'maria.lopez@email.com', zone: 'Centro - Av. Principal', status: 'active', incidents: 1, lastIncident: '2024-03-15' },
    { id: 'CLI-4521', name: 'Carlos Martínez Sánchez', phone: '555-0103', email: 'carlos.martinez@email.com', zone: 'Zona Industrial', status: 'active', incidents: 5, lastIncident: '2024-03-14' },
    { id: 'CLI-3156', name: 'Ana García Fernández', phone: '555-0104', email: 'ana.garcia@email.com', zone: 'Residencial Sur', status: 'inactive', incidents: 2, lastIncident: '2024-03-10' },
    { id: 'CLI-7892', name: 'Roberto Díaz López', phone: '555-0105', email: 'roberto.diaz@email.com', zone: 'Parque Industrial', status: 'active', incidents: 8, lastIncident: '2024-03-15' },
    { id: 'CLI-5634', name: 'Laura Hernández Ruiz', phone: '555-0106', email: 'laura.hernandez@email.com', zone: 'Zona Este', status: 'active', incidents: 2, lastIncident: '2024-03-13' },
    { id: 'CLI-9012', name: 'Miguel Torres Gómez', phone: '555-0107', email: 'miguel.torres@email.com', zone: 'Centro Comercial', status: 'active', incidents: 1, lastIncident: '2024-03-12' },
    { id: 'CLI-3478', name: 'Patricia Morales Vega', phone: '555-0108', email: 'patricia.morales@email.com', zone: 'Nueva Industrial', status: 'active', incidents: 4, lastIncident: '2024-03-15' },
]

const zones = ['Todas', 'Zona Norte', 'Centro', 'Zona Sur', 'Zona Este', 'Zona Industrial', 'Parque Industrial']

const Clientes = () => {

    const [searchTerm, setSearchTerm] = useState('')
    const [selectedZone, setSelectedZone] = useState('Todas')
    const [selectedCustomer, setSelectedCustomer] = useState(null)

    const filteredCustomers = customersData.filter(customer => {
        const matchesSearch =
            customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm)
        const matchesZone = selectedZone === 'Todas' || customer.zone.includes(selectedZone)
        return matchesSearch && matchesZone
    })

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Clientes</h1>
                <p className="text-muted-foreground">Información de clientes con incidencias registradas</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por carné, nombre o teléfono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-10 w-full rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:w-80"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            value={selectedZone}
                            onChange={(e) => setSelectedZone(e.target.value)}
                            className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none"
                        >
                            {zones.map(zone => (
                                <option key={zone}>{zone}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground">
                    {filteredCustomers.length} clientes encontrados
                </p>
            </div>

            {/* Customer Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredCustomers.map((customer) => (
                    <div
                        key={customer.id}
                        onClick={() => setSelectedCustomer(customer)}
                        className="cursor-pointer rounded-xl border border-border bg-card p-5 transition-colors hover:bg-secondary/30"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                                    <User className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-semibold text-card-foreground">{customer.name}</p>
                                    <p className="text-sm font-mono text-primary">{customer.id}</p>
                                </div>
                            </div>
                            <span className={cn(
                                'rounded-full px-2 py-1 text-xs font-medium',
                                customer.status === 'active'
                                    ? 'bg-success/20 text-success'
                                    : 'bg-muted text-muted-foreground'
                            )}>
                                {customer.status === 'active' ? 'Activo' : 'Inactivo'}
                            </span>
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4" />
                                {customer.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                {customer.zone}
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                            <div className="flex items-center gap-2">
                                <AlertTriangle className={cn(
                                    'h-4 w-4',
                                    customer.incidents > 5 ? 'text-destructive' :
                                        customer.incidents > 2 ? 'text-chart-3' : 'text-muted-foreground'
                                )} />
                                <span className="text-sm text-muted-foreground">
                                    <span className="font-semibold text-foreground">{customer.incidents}</span> incidencias
                                </span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Customer Detail Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="w-[95vw] max-w-lg rounded-xl border border-border bg-card">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border p-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20">
                                    <User className="h-7 w-7 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-card-foreground">{selectedCustomer.name}</h2>
                                    <p className="text-sm font-mono text-primary">{selectedCustomer.id}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-secondary rounded-lg">
                                <X className="h-5 w-5 text-muted-foreground" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="space-y-6 p-4 sm:p-6">
                            {/* Contact Info */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Información de Contacto</h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                                        <Phone className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Teléfono</p>
                                            <p className="text-sm text-card-foreground">{selectedCustomer.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-lg bg-secondary p-3">
                                        <Mail className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-xs text-muted-foreground">Email</p>
                                            <p className="text-sm text-card-foreground truncate">{selectedCustomer.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Ubicación</h3>
                                <div className="flex items-center gap-3 rounded-lg bg-secondary p-4">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <p className="text-card-foreground">{selectedCustomer.zone}</p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Estadísticas</h3>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div className="rounded-lg bg-secondary p-4 text-center">
                                        <p className="text-2xl font-semibold text-card-foreground">{selectedCustomer.incidents}</p>
                                        <p className="text-xs text-muted-foreground">Incidencias</p>
                                    </div>
                                    <div className="rounded-lg bg-secondary p-4 text-center">
                                        <p className="text-2xl font-semibold text-card-foreground">{selectedCustomer.lastIncident.split('-')[2]}</p>
                                        <p className="text-xs text-muted-foreground">Últ. Día</p>
                                    </div>
                                    <div className="rounded-lg bg-secondary p-4 text-center">
                                        <span className={cn(
                                            'inline-flex rounded-full px-2 py-1 text-xs font-medium',
                                            selectedCustomer.status === 'active'
                                                ? 'bg-success/20 text-success'
                                                : 'bg-muted text-muted-foreground'
                                        )}>
                                            {selectedCustomer.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </span>
                                        <p className="text-xs text-muted-foreground mt-1">Estado</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:p-6">
                            <button className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm text-muted-foreground hover:bg-secondary">
                                <FileText className="h-4 w-4" />
                                Ver Historial
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                                <AlertTriangle className="h-4 w-4" />
                                Ver Incidencias
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Clientes
