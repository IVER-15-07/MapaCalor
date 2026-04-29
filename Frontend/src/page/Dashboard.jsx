import React from 'react'
import {
  AlertTriangle, PhoneCall, MapPin, TrendingUp, TrendingDown, Clock, Zap, Users
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'

import Card from '../components/ui/Card'
import 'leaflet/dist/leaflet.css'
import StatsCard from '../components/StatsCard'
import RecentIncidents from '../components/RecentIncidents'
import CriticalZones from '../components/CriticalZonas'
import { MapDisplay } from '../components/mapa/MapDisplay'

const trendData = [
  { hora: '06:00', incidencias: 12, llamadas: 18 },
  { hora: '08:00', incidencias: 28, llamadas: 35 },
  { hora: '10:00', incidencias: 45, llamadas: 52 },
  { hora: '12:00', incidencias: 38, llamadas: 42 },
  { hora: '14:00', incidencias: 52, llamadas: 58 },
  { hora: '16:00', incidencias: 35, llamadas: 40 },
  { hora: '18:00', incidencias: 42, llamadas: 48 },
  { hora: '20:00', incidencias: 25, llamadas: 30 },
]

const stats = [
  { title: 'Incidencias Hoy', value: '247', change: '+12%', trend: 'up', icon: AlertTriangle, color: 'text-chart-3' },
  { title: 'Llamadas Recibidas', value: '312', change: '+8%', trend: 'up', icon: PhoneCall, color: 'text-chart-2' },
  { title: 'Zonas Afectadas', value: '15', change: '-3%', trend: 'down', icon: MapPin, color: 'text-primary' },
  { title: 'Tiempo Promedio', value: '4.2 min', change: '-15%', trend: 'down', icon: Clock, color: 'text-success' },
]

// PUNTOS FALSOS PARA EL DASHBOARD:
// Esto simula cómo se verá el mapa principal para que no esté vacío.
const dashboardMapPoints = [
  { id: 'dash-1', lat: -17.3895, lng: -66.1568, intensity: 'critical', zone: 'KM 0', incidents: 45 },
  { id: 'dash-2', lat: -17.3750, lng: -66.1450, intensity: 'high', zone: 'QUERU QUERU', incidents: 28 },
  { id: 'dash-3', lat: -17.3950, lng: -66.1700, intensity: 'medium', zone: 'AEROPUERTO', incidents: 15 },
  { id: 'dash-4', lat: -17.4050, lng: -66.1400, intensity: 'low', zone: 'TAMBORADA', incidents: 5 },
]

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mapa   SMARFLEX / ELASTIX</h1>
        <p className="text-muted-foreground">
          Resumen de incidencias y mapa de calor del canal 4200-135
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Mapa Integrado */}
        <div className="xl:col-span-2">
          {/* Un wrapper para darle una altura fija dentro del grid del Dashboard */}
          <div className="h-[500px] w-full flex flex-col">
            <MapDisplay
              zoom={13}
              selectedPoint={null}
              activePoints={dashboardMapPoints} // Aquí pasamos los puntos falsos
              handlePointSelect={() => { }}
              metricLabelTitle="Incidencias"
              sectorCount={15}
              totalIncidents={247}
              metricLabel="incidencias"
              sourceMode="canal 4200-135"
            />
          </div>
        </div>

        {/* Critical Zones */}
        <div className="h-[500px] overflow-auto">
          <CriticalZones />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Trend Chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-card-foreground">Tendencia del Día</h3>
              <p className="text-sm text-muted-foreground">Incidencias vs Llamadas por hora</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Incidencias</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-chart-2" />
                <span className="text-muted-foreground">Llamadas</span>
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorIncidencias" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.75 0.18 85)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.75 0.18 85)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLlamadas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.65 0.15 200)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.65 0.15 200)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.005 260)" />
                <XAxis dataKey="hora" stroke="oklch(0.65 0 0)" fontSize={12} />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.16 0.005 260)',
                    border: '1px solid oklch(0.28 0.005 260)',
                    borderRadius: '8px',
                    color: 'oklch(0.95 0 0)'
                  }}
                />
                <Area type="monotone" dataKey="incidencias" stroke="oklch(0.75 0.18 85)" fillOpacity={1} fill="url(#colorIncidencias)" />
                <Area type="monotone" dataKey="llamadas" stroke="oklch(0.65 0.15 200)" fillOpacity={1} fill="url(#colorLlamadas)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Incidents */}
        <RecentIncidents />
      </div>
    </div>
  )
}

export default Dashboard