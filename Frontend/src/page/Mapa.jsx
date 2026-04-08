import { useState } from 'react'
import {
    Layers,
    ZoomIn,
    ZoomOut,
    Maximize2,
    Filter,
    MapPin,
    AlertTriangle,
    X
} from 'lucide-react'
import { cn } from '../lib/Utils'

const heatPoints = [
    { id: 1, x: 15, y: 20, intensity: 'high', zone: 'Zona Norte - Sector A', incidents: 45, district: 'Norte' },
    { id: 2, x: 25, y: 35, intensity: 'medium', zone: 'Zona Norte - Sector B', incidents: 28, district: 'Norte' },
    { id: 3, x: 45, y: 25, intensity: 'critical', zone: 'Zona Industrial Este', incidents: 67, district: 'Industrial' },
    { id: 4, x: 55, y: 40, intensity: 'high', zone: 'Zona Industrial Oeste', incidents: 52, district: 'Industrial' },
    { id: 5, x: 35, y: 55, intensity: 'low', zone: 'Centro Comercial', incidents: 12, district: 'Centro' },
    { id: 6, x: 50, y: 60, intensity: 'medium', zone: 'Centro Histórico', incidents: 23, district: 'Centro' },
    { id: 7, x: 70, y: 30, intensity: 'medium', zone: 'Parque Industrial', incidents: 31, district: 'Industrial' },
    { id: 8, x: 20, y: 70, intensity: 'low', zone: 'Residencial Sur', incidents: 8, district: 'Sur' },
    { id: 9, x: 65, y: 65, intensity: 'high', zone: 'Zona Este', incidents: 42, district: 'Este' },
    { id: 10, x: 80, y: 50, intensity: 'medium', zone: 'Periferia Este', incidents: 19, district: 'Este' },
    { id: 11, x: 40, y: 80, intensity: 'low', zone: 'Zona Sur', incidents: 15, district: 'Sur' },
    { id: 12, x: 85, y: 25, intensity: 'critical', zone: 'Nueva Industrial', incidents: 58, district: 'Industrial' },
]

const districts = ['Todos', 'Norte', 'Centro', 'Sur', 'Este', 'Industrial']

const intensityConfig = {
    low: { color: 'bg-success/60', size: 'h-10 w-10', label: 'Baja' },
    medium: { color: 'bg-primary/70', size: 'h-14 w-14', label: 'Media' },
    high: { color: 'bg-chart-3/80', size: 'h-18 w-18', label: 'Alta' },
    critical: { color: 'bg-destructive/90', size: 'h-24 w-24', label: 'Crítica' }
}


const Mapa = () => {

    const [selectedDistrict, setSelectedDistrict] = useState('Todos')
    const [selectedPoint, setSelectedPoint] = useState(null)
    const [zoom, setZoom] = useState(1)

    const filteredPoints = selectedDistrict === 'Todos'
        ? heatPoints
        : heatPoints.filter(p => p.district === selectedDistrict)

    const totalIncidents = filteredPoints.reduce((sum, p) => sum + p.incidents, 0)
    const criticalCount = filteredPoints.filter(p => p.intensity === 'critical' || p.intensity === 'high').length
    return (
        <div className="flex h-full flex-col gap-6 xl:flex-row">
            {/* Main Map Area */}
            <div className="flex flex-1 flex-col">
                {/* Header */}
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">Mapa de Calor</h1>
                        <p className="text-muted-foreground">Visualización geográfica de incidencias por zona</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 rounded-lg border border-border bg-card">
                            <button
                                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
                                className="p-2 hover:bg-secondary rounded-l-lg"
                            >
                                <ZoomOut className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <span className="px-2 text-sm text-muted-foreground">{Math.round(zoom * 100)}%</span>
                            <button
                                onClick={() => setZoom(Math.min(2, zoom + 0.25))}
                                className="p-2 hover:bg-secondary rounded-r-lg"
                            >
                                <ZoomIn className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>
                        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                            <Layers className="h-4 w-4" />
                            Capas
                        </button>
                    </div>
                </div>

                {/* District Filter */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Filtrar por distrito:</span>
                    <div className="flex flex-wrap gap-2">
                        {districts.map((district) => (
                            <button
                                key={district}
                                onClick={() => setSelectedDistrict(district)}
                                className={cn(
                                    'rounded-full px-3 py-1 text-sm transition-colors',
                                    selectedDistrict === district
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                                )}
                            >
                                {district}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Map Container */}
                <div className="flex-1 overflow-hidden rounded-xl border border-border bg-card">
                    <div
                        className="relative h-full w-full bg-secondary/20"
                        style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
                    >
                        {/* Grid Overlay */}
                        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10">
                            {Array.from({ length: 100 }).map((_, i) => (
                                <div key={i} className="border border-border" />
                            ))}
                        </div>

                        {/* District Labels */}
                        <div className="absolute top-[15%] left-[15%] text-xs text-muted-foreground/50 uppercase tracking-wider">Norte</div>
                        <div className="absolute top-[35%] left-[40%] text-xs text-muted-foreground/50 uppercase tracking-wider">Centro</div>
                        <div className="absolute top-[70%] left-[30%] text-xs text-muted-foreground/50 uppercase tracking-wider">Sur</div>
                        <div className="absolute top-[45%] left-[70%] text-xs text-muted-foreground/50 uppercase tracking-wider">Este</div>
                        <div className="absolute top-[25%] left-[55%] text-xs text-muted-foreground/50 uppercase tracking-wider">Industrial</div>

                        {/* Heat Points */}
                        {filteredPoints.map((point) => (
                            <div
                                key={point.id}
                                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:z-10"
                                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                                onClick={() => setSelectedPoint(point)}
                            >
                                {/* Glow Effect */}
                                <div className={cn(
                                    'rounded-full blur-xl animate-pulse',
                                    intensityConfig[point.intensity].color,
                                    point.intensity === 'critical' ? 'h-28 w-28' :
                                        point.intensity === 'high' ? 'h-20 w-20' :
                                            point.intensity === 'medium' ? 'h-16 w-16' : 'h-12 w-12'
                                )} />
                                {/* Center Point */}
                                <div className={cn(
                                    'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground/30',
                                    intensityConfig[point.intensity].color,
                                    'h-4 w-4'
                                )} />
                                {/* Incident Count */}
                                <div className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded bg-card/90 px-1.5 py-0.5 text-xs font-medium text-card-foreground">
                                    {point.incidents}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-card p-3">
                    <div className="flex items-center gap-6">
                        <span className="text-sm font-medium text-muted-foreground">Intensidad:</span>
                        {Object.entries(intensityConfig).map(([key, config]) => (
                            <div key={key} className="flex items-center gap-2">
                                <span className={cn('h-3 w-3 rounded-full', config.color)} />
                                <span className="text-sm text-muted-foreground">{config.label}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">
                            <span className="font-semibold text-foreground">{filteredPoints.length}</span> zonas
                        </span>
                        <span className="text-muted-foreground">
                            <span className="font-semibold text-foreground">{totalIncidents}</span> incidencias
                        </span>
                    </div>
                </div>
            </div>

            {/* Sidebar Panel */}
            <div className="flex w-full flex-col gap-4 xl:w-80">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Total Incidencias</p>
                        <p className="text-2xl font-semibold text-foreground">{totalIncidents}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-card p-4">
                        <p className="text-xs text-muted-foreground">Zonas Críticas</p>
                        <p className="text-2xl font-semibold text-destructive">{criticalCount}</p>
                    </div>
                </div>

                {/* Selected Point Details */}
                {selectedPoint ? (
                    <div className="rounded-xl border border-border bg-card">
                        <div className="flex items-center justify-between border-b border-border p-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="font-semibold text-card-foreground">Detalle de Zona</span>
                            </div>
                            <button onClick={() => setSelectedPoint(null)} className="p-1 hover:bg-secondary rounded">
                                <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <p className="text-lg font-semibold text-card-foreground">{selectedPoint.zone}</p>
                                <p className="text-sm text-muted-foreground">Distrito: {selectedPoint.district}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg bg-secondary p-3">
                                    <p className="text-xs text-muted-foreground">Incidencias</p>
                                    <p className="text-xl font-semibold text-foreground">{selectedPoint.incidents}</p>
                                </div>
                                <div className="rounded-lg bg-secondary p-3">
                                    <p className="text-xs text-muted-foreground">Intensidad</p>
                                    <p className={cn(
                                        'text-xl font-semibold',
                                        selectedPoint.intensity === 'critical' ? 'text-destructive' :
                                            selectedPoint.intensity === 'high' ? 'text-chart-3' :
                                                selectedPoint.intensity === 'medium' ? 'text-primary' : 'text-success'
                                    )}>
                                        {intensityConfig[selectedPoint.intensity].label}
                                    </p>
                                </div>
                            </div>
                            <button className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground">
                                Ver Incidencias
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center">
                        <MapPin className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <p className="text-sm text-muted-foreground">
                            Selecciona un punto en el mapa para ver los detalles de la zona
                        </p>
                    </div>
                )}

                {/* Zone List */}
                <div className="flex-1 rounded-xl border border-border bg-card overflow-hidden">
                    <div className="border-b border-border p-4">
                        <h3 className="font-semibold text-card-foreground">Zonas por Incidencias</h3>
                    </div>
                    <div className="divide-y divide-border max-h-64 overflow-auto">
                        {[...filteredPoints].sort((a, b) => b.incidents - a.incidents).map((point) => (
                            <button
                                key={point.id}
                                onClick={() => setSelectedPoint(point)}
                                className={cn(
                                    'w-full flex items-center justify-between p-3 text-left hover:bg-secondary/50 transition-colors',
                                    selectedPoint?.id === point.id && 'bg-secondary'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        'h-2 w-2 rounded-full',
                                        intensityConfig[point.intensity].color
                                    )} />
                                    <span className="text-sm text-card-foreground truncate">{point.zone}</span>
                                </div>
                                <span className="text-sm font-semibold text-muted-foreground">{point.incidents}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mapa
