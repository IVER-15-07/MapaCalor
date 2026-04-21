import React, { useState, useEffect } from 'react'
import {
    Layers,
    ZoomIn,
    ZoomOut,
    Filter,
    MapPin,
    X
} from 'lucide-react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { cn } from '../lib/Utils'

// --- DATOS Y CONFIGURACIÓN ---
// Centro de Cochabamba (Plaza 14 de Septiembre)
const COCHA_CENTER = [-17.3895, -66.1568];

const zoneData = [
    { name: 'AEROPUERTO', x: 45, y: 55 },
    { name: 'AIQUILE', x: 85, y: 95 }, 
    { name: 'ARANI', x: 80, y: 78 },
    { name: 'AROCAGUA', x: 60, y: 45 },
    { name: 'CALICANTO', x: 45, y: 65 },
    { name: 'CAPINOTA', x: 20, y: 85 }, 
    { name: 'CARCAJE', x: 65, y: 72 },
    { name: 'CHIMBA', x: 44, y: 50 },
    { name: 'CHINATA', x: 75, y: 46 },
    { name: 'CLIZA', x: 72, y: 75 },
    { name: 'CONDEBAMBA', x: 40, y: 45 },
    { name: 'COSMOS', x: 42, y: 56 },
    { name: 'EL PASO', x: 32, y: 40 },
    { name: 'EX-MATADERO', x: 48, y: 55 },
    { name: 'FLORIDA NORTE', x: 35, y: 46 },
    { name: 'FLORIDA SUD', x: 35, y: 50 },
    { name: 'HIPODROMO', x: 42, y: 48 },
    { name: 'HUAYLLANI', x: 65, y: 44 },
    { name: 'HUAYRA KHASA', x: 52, y: 60 },
    { name: 'KM "0"', x: 50, y: 50 },
    { name: 'LA FERIA', x: 46, y: 52 },
    { name: 'LA PAZ', x: 50, y: 56 },
    { name: 'LAS CUADRAS', x: 52, y: 48 },
    { name: 'LINDE', x: 35, y: 42 },
    { name: 'MONTENEGRO', x: 30, y: 54 },
    { name: 'MUYURINA', x: 55, y: 48 },
    { name: 'NORTE', x: 50, y: 40 },
    { name: 'PACATA', x: 58, y: 42 },
    { name: 'PAROTANI', x: 12, y: 70 },
    { name: 'PIÑAMI', x: 34, y: 48 },
    { name: 'PUCARA (SACABA)', x: 70, y: 45 },
    { name: 'PUNATA', x: 76, y: 73 },
    { name: 'QUERU QUERU', x: 50, y: 44 },
    { name: 'QUILLACOLLO', x: 25, y: 50 },
    { name: 'QUINTANILLA', x: 62, y: 44 },
    { name: 'SACABA PUEBLO', x: 68, y: 44 },
    { name: 'SAN BENITO', x: 72, y: 70 },
    { name: 'SAN MIGUEL', x: 52, y: 52 },
    { name: 'SANTIVAÑEZ', x: 35, y: 75 },
    { name: 'SARCO', x: 46, y: 45 },
    { name: 'SAUSALITO FTTH', x: 54, y: 42 },
    { name: 'SEBASTIAN PAGADOR', x: 55, y: 65 },
    { name: 'SEMINARIO', x: 50, y: 42 },
    { name: 'SIPE SIPE', x: 15, y: 55 },
    { name: 'SUCRE', x: 50, y: 48 },
    { name: 'SUD', x: 50, y: 62 },
    { name: 'TAMBORADA', x: 50, y: 66 },
    { name: 'TARATA', x: 62, y: 78 },
    { name: 'TEMPORAL', x: 50, y: 38 },
    { name: 'TIQUIPAYA', x: 40, y: 35 },
    { name: 'TOLATA', x: 68, y: 72 },
    { name: 'TUPURAYA', x: 52, y: 45 },
    { name: 'VALLE HERMOSO', x: 54, y: 60 },
    { name: 'VILLA BUSCH NORTE', x: 42, y: 42 },
    { name: 'VILLA BUSCH SUD', x: 42, y: 45 },
    { name: 'VILLA ISRAEL', x: 52, y: 70 },
    { name: 'VILLA RIBERO', x: 48, y: 58 },
    { name: 'VINTO', x: 20, y: 52 },
];

const intensityCycle = ['low', 'medium', 'high', 'critical'];

// Convertimos tus coordenadas relativas a Latitud y Longitud real
const heatPoints = zoneData.map((data, index) => {
    const incidents = 6 + ((index * 7) % 62);
    const intensity = intensityCycle[index % intensityCycle.length];
    
    // Fórmula de conversión aproximada: Ajusta el multiplicador para separar más o menos los puntos
    const lat = COCHA_CENTER[0] - (data.y - 50) * 0.003;
    const lng = COCHA_CENTER[1] + (data.x - 50) * 0.003;

    return {
        id: index + 1,
        lat,
        lng,
        intensity,
        zone: data.name,
        incidents,
        district: data.name,
    };
});

const districts = ['Todos', ...zoneData.map(z => z.name)];

// Colores hexadecimales para React-Leaflet
const intensityConfig = {
    low: { color: '#22c55e', hex: '#22c55e', radius: 8, label: 'Baja', twColor: 'bg-green-500' },
    medium: { color: '#3b82f6', hex: '#3b82f6', radius: 12, label: 'Media', twColor: 'bg-blue-500' },
    high: { color: '#f59e0b', hex: '#f59e0b', radius: 18, label: 'Alta', twColor: 'bg-orange-500' },
    critical: { color: '#ef4444', hex: '#ef4444', radius: 24, label: 'Crítica', twColor: 'bg-red-500' }
};

// --- COMPONENTE CONTROLADOR DEL MAPA ---
// Este pequeño componente nos permite cambiar el zoom desde tus botones personalizados
const MapController = ({ zoomLevel, centerCoords }) => {
    const map = useMap();
    
    useEffect(() => {
        map.setZoom(zoomLevel);
    }, [zoomLevel, map]);

    useEffect(() => {
        if (centerCoords) {
            map.flyTo([centerCoords.lat, centerCoords.lng], 14, { animate: true });
        }
    }, [centerCoords, map]);

    return null;
};


// --- COMPONENTE PRINCIPAL ---
const Mapa = () => {
    const [selectedDistrict, setSelectedDistrict] = useState('Todos');
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [zoom, setZoom] = useState(12); // Nivel de zoom de Leaflet (12 es vista de ciudad)

    const filteredPoints = selectedDistrict === 'Todos'
        ? heatPoints
        : heatPoints.filter(p => p.district === selectedDistrict);

    const totalIncidents = filteredPoints.reduce((sum, p) => sum + p.incidents, 0);
    const criticalCount = filteredPoints.filter(p => p.intensity === 'critical' || p.intensity === 'high').length;

    // Manejar el clic en la lista lateral
    const handlePointSelect = (point) => {
        setSelectedPoint(point);
    };

    return (
        <div className="flex h-full flex-col gap-6 xl:flex-row xl:items-stretch">
            {/* Main Map Area */}
            <div className="flex min-w-0 flex-[1.7] flex-col">
                {/* Header */}
                <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">Mapa de Calor Geográfico</h1>
                        <p className="text-muted-foreground">Monitoreo en tiempo real - Región Cochabamba</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-1 rounded-lg border border-border bg-card">
                            <button
                                onClick={() => setZoom(prev => Math.max(8, prev - 1))}
                                className="p-2 hover:bg-secondary rounded-l-lg"
                            >
                                <ZoomOut className="h-4 w-4 text-muted-foreground" />
                            </button>
                            <span className="px-3 text-sm font-medium text-muted-foreground">Z: {zoom}</span>
                            <button
                                onClick={() => setZoom(prev => Math.min(18, prev + 1))}
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
                <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-3">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Filtrar por zona:</span>
                    <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        className="min-w-72 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        {districts.map((district) => (
                            <option key={district} value={district}>
                                {district}
                            </option>
                        ))}
                    </select>
                </div>

                {/* MAPA REAL (Leaflet) */}
                <div className="flex-1 overflow-hidden rounded-xl border border-border bg-card min-h-[72vh] relative z-0">
                    <MapContainer 
                        center={COCHA_CENTER} 
                        zoom={zoom} 
                        zoomControl={false} // Desactivamos el zoom nativo para usar tus botones
                        className="h-full w-full"
                    >
                        {/* Control de estado del mapa */}
                        <MapController zoomLevel={zoom} centerCoords={selectedPoint} />

                        {/* Capa base del mapa (Estilo oscuro de CartoDB, ideal para mapas de calor) */}
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        />

                        {/* Puntos de Calor */}
                        {filteredPoints.map((point) => (
                            <CircleMarker
                                key={point.id}
                                center={[point.lat, point.lng]}
                                radius={intensityConfig[point.intensity].radius}
                                pathOptions={{
                                    color: intensityConfig[point.intensity].hex,
                                    fillColor: intensityConfig[point.intensity].hex,
                                    fillOpacity: 0.6,
                                    weight: 2
                                }}
                                eventHandlers={{
                                    click: () => handlePointSelect(point),
                                }}
                            >
                                <Popup className="rounded-xl">
                                    <div className="text-center p-1">
                                        <h3 className="font-bold text-sm text-slate-800">{point.zone}</h3>
                                        <p className="text-xs text-slate-600 mt-1">Incidencias: <strong className="text-slate-900">{point.incidents}</strong></p>
                                    </div>
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>

                {/* Legend */}
                <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-card p-3">
                    <div className="flex items-center gap-6">
                        <span className="text-sm font-medium text-muted-foreground">Intensidad:</span>
                        {Object.entries(intensityConfig).map(([key, config]) => (
                            <div key={key} className="flex items-center gap-2">
                                <span className={cn('h-3 w-3 rounded-full', config.twColor)} />
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
            <div className="flex w-full flex-col gap-4 xl:w-72 relative z-10">
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
                    <div className="rounded-xl border border-border bg-card shadow-lg">
                        <div className="flex items-center justify-between border-b border-border p-4">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <span className="font-semibold text-card-foreground">Detalle de Zona</span>
                            </div>
                            <button onClick={() => setSelectedPoint(null)} className="p-1 hover:bg-secondary rounded transition-colors">
                                <X className="h-4 w-4 text-muted-foreground" />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <p className="text-lg font-semibold text-card-foreground">{selectedPoint.zone}</p>
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
                                            selectedPoint.intensity === 'high' ? 'text-orange-500' :
                                                selectedPoint.intensity === 'medium' ? 'text-blue-500' : 'text-green-500'
                                    )}>
                                        {intensityConfig[selectedPoint.intensity].label}
                                    </p>
                                </div>
                            </div>
                            <button className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                                Ver Detalles Operativos
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center text-center">
                        <MapPin className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <p className="text-sm text-muted-foreground">
                            Selecciona un punto en el mapa o en la lista para analizar la zona.
                        </p>
                    </div>
                )}

                {/* Zone List */}
                <div className="flex-1 rounded-xl border border-border bg-card overflow-hidden flex flex-col">
                    <div className="border-b border-border p-4 bg-muted/20">
                        <h3 className="font-semibold text-card-foreground">Mayor Actividad</h3>
                    </div>
                    <div className="divide-y divide-border overflow-y-auto flex-1 h-[300px]">
                        {[...filteredPoints].sort((a, b) => b.incidents - a.incidents).map((point) => (
                            <button
                                key={point.id}
                                onClick={() => handlePointSelect(point)}
                                className={cn(
                                    'w-full flex items-center justify-between p-3 text-left hover:bg-secondary/50 transition-colors',
                                    selectedPoint?.id === point.id && 'bg-secondary border-l-2 border-primary'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={cn(
                                        'h-2 w-2 rounded-full',
                                        intensityConfig[point.intensity].twColor
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