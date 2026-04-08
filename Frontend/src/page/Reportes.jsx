import { useState } from 'react'
import {
    FileText,
    Download,
    Calendar,
    BarChart3,
    PieChart as PieChartIcon,
    TrendingUp,
    Filter
} from 'lucide-react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts'
import { cn } from '../lib/Utils'


const weeklyData = [
    { day: 'Lun', incidencias: 45, resueltas: 38 },
    { day: 'Mar', incidencias: 52, resueltas: 45 },
    { day: 'Mie', incidencias: 38, resueltas: 32 },
    { day: 'Jue', incidencias: 61, resueltas: 52 },
    { day: 'Vie', incidencias: 55, resueltas: 48 },
    { day: 'Sab', incidencias: 32, resueltas: 28 },
    { day: 'Dom', incidencias: 25, resueltas: 22 },
]

const monthlyData = [
    { month: 'Ene', incidencias: 320 },
    { month: 'Feb', incidencias: 285 },
    { month: 'Mar', incidencias: 410 },
    { month: 'Abr', incidencias: 380 },
    { month: 'May', incidencias: 295 },
    { month: 'Jun', incidencias: 350 },
]

const byTypeData = [
    { name: 'Corte de energía', value: 35, color: 'oklch(0.75 0.18 85)' },
    { name: 'Fuga de agua', value: 25, color: 'oklch(0.65 0.15 200)' },
    { name: 'Sin conexión', value: 20, color: 'oklch(0.55 0.22 25)' },
    { name: 'Daño en medidor', value: 12, color: 'oklch(0.70 0.15 150)' },
    { name: 'Otros', value: 8, color: 'oklch(0.60 0.18 280)' },
]

const byZoneData = [
    { name: 'Zona Industrial', value: 30, color: 'oklch(0.55 0.22 25)' },
    { name: 'Zona Norte', value: 25, color: 'oklch(0.75 0.18 85)' },
    { name: 'Centro', value: 20, color: 'oklch(0.65 0.15 200)' },
    { name: 'Zona Sur', value: 15, color: 'oklch(0.70 0.15 150)' },
    { name: 'Zona Este', value: 10, color: 'oklch(0.60 0.18 280)' },
]

const reportTypes = [
    { id: 'daily', label: 'Diario', icon: Calendar },
    { id: 'weekly', label: 'Semanal', icon: BarChart3 },
    { id: 'monthly', label: 'Mensual', icon: TrendingUp },
]

const recentReports = [
    { id: 1, name: 'Reporte Diario - 15/03/2024', type: 'daily', date: '15/03/2024', size: '2.4 MB' },
    { id: 2, name: 'Reporte Semanal - Semana 11', type: 'weekly', date: '10/03/2024', size: '5.1 MB' },
    { id: 3, name: 'Reporte Mensual - Febrero 2024', type: 'monthly', date: '01/03/2024', size: '12.8 MB' },
    { id: 4, name: 'Reporte Diario - 14/03/2024', type: 'daily', date: '14/03/2024', size: '2.2 MB' },
    { id: 5, name: 'Reporte Semanal - Semana 10', type: 'weekly', date: '03/03/2024', size: '4.9 MB' },
]

const Reportes = () => {
    const [selectedType, setSelectedType] = useState('weekly')
    const [dateRange, setDateRange] = useState('Esta semana')


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Reportes</h1>
                    <p className="text-muted-foreground">Generación de reportes digitales de incidencias</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                    <FileText className="h-4 w-4" />
                    Generar Reporte
                </button>
            </div>

            {/* Report Type Selector */}
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <span className="text-sm text-muted-foreground">Tipo de reporte:</span>
                <div className="flex flex-wrap gap-2">
                    {reportTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => setSelectedType(type.id)}
                            className={cn(
                                'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                                selectedType === type.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            )}
                        >
                            <type.icon className="h-4 w-4" />
                            {type.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 xl:ml-auto">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <select
                        value={dateRange}
                        onChange={(e) => setDateRange(e.target.value)}
                        className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none sm:w-auto"
                    >
                        <option>Esta semana</option>
                        <option>Semana pasada</option>
                        <option>Este mes</option>
                        <option>Mes pasado</option>
                        <option>Últimos 3 meses</option>
                    </select>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-xl border border-border bg-card p-5">
                    <p className="text-sm text-muted-foreground">Total Incidencias</p>
                    <p className="text-2xl font-semibold text-card-foreground">308</p>
                    <p className="text-xs text-success">+12% vs periodo anterior</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                    <p className="text-sm text-muted-foreground">Resueltas</p>
                    <p className="text-2xl font-semibold text-success">265</p>
                    <p className="text-xs text-muted-foreground">86% del total</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                    <p className="text-sm text-muted-foreground">Pendientes</p>
                    <p className="text-2xl font-semibold text-chart-3">43</p>
                    <p className="text-xs text-muted-foreground">14% del total</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-5">
                    <p className="text-sm text-muted-foreground">Tiempo Promedio</p>
                    <p className="text-2xl font-semibold text-card-foreground">4.2h</p>
                    <p className="text-xs text-success">-18% vs periodo anterior</p>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {/* Bar Chart */}
                <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-card-foreground">Incidencias por Día</h3>
                            <p className="text-sm text-muted-foreground">Comparativa de incidencias vs resueltas</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-muted-foreground">Incidencias</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-success" />
                                <span className="text-muted-foreground">Resueltas</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.005 260)" />
                                <XAxis dataKey="day" stroke="oklch(0.65 0 0)" fontSize={12} />
                                <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'oklch(0.16 0.005 260)',
                                        border: '1px solid oklch(0.28 0.005 260)',
                                        borderRadius: '8px',
                                        color: 'oklch(0.95 0 0)'
                                    }}
                                />
                                <Bar dataKey="incidencias" fill="oklch(0.75 0.18 85)" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="resueltas" fill="oklch(0.65 0.18 145)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart - By Type */}
                <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                    <div className="mb-4">
                        <h3 className="font-semibold text-card-foreground">Distribución por Tipo</h3>
                        <p className="text-sm text-muted-foreground">Porcentaje de incidencias por categoría</p>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={byTypeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {byTypeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'oklch(0.16 0.005 260)',
                                        border: '1px solid oklch(0.28 0.005 260)',
                                        borderRadius: '8px',
                                        color: 'oklch(0.95 0 0)'
                                    }}
                                />
                                <Legend
                                    verticalAlign="middle"
                                    align="right"
                                    layout="vertical"
                                    formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Second row charts */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {/* Monthly Trend */}
                <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                    <div className="mb-4">
                        <h3 className="font-semibold text-card-foreground">Tendencia Mensual</h3>
                        <p className="text-sm text-muted-foreground">Evolución de incidencias por mes</p>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.005 260)" />
                                <XAxis dataKey="month" stroke="oklch(0.65 0 0)" fontSize={12} />
                                <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'oklch(0.16 0.005 260)',
                                        border: '1px solid oklch(0.28 0.005 260)',
                                        borderRadius: '8px',
                                        color: 'oklch(0.95 0 0)'
                                    }}
                                />
                                <Bar dataKey="incidencias" fill="oklch(0.65 0.15 200)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart - By Zone */}
                <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
                    <div className="mb-4">
                        <h3 className="font-semibold text-card-foreground">Distribución por Zona</h3>
                        <p className="text-sm text-muted-foreground">Porcentaje de incidencias por zona geográfica</p>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={byZoneData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {byZoneData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'oklch(0.16 0.005 260)',
                                        border: '1px solid oklch(0.28 0.005 260)',
                                        borderRadius: '8px',
                                        color: 'oklch(0.95 0 0)'
                                    }}
                                />
                                <Legend
                                    verticalAlign="middle"
                                    align="right"
                                    layout="vertical"
                                    formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Reports */}
            <div className="rounded-xl border border-border bg-card">
                <div className="flex items-center justify-between border-b border-border p-4">
                    <div>
                        <h3 className="font-semibold text-card-foreground">Reportes Generados</h3>
                        <p className="text-sm text-muted-foreground">Historial de reportes disponibles para descarga</p>
                    </div>
                    <button className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Filter className="h-4 w-4" />
                        Filtrar
                    </button>
                </div>
                <div className="divide-y divide-border">
                    {recentReports.map((report) => (
                        <div key={report.id} className="flex flex-col gap-3 p-4 hover:bg-secondary/30 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-medium text-card-foreground">{report.name}</p>
                                    <p className="text-sm text-muted-foreground">Generado: {report.date} - {report.size}</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground hover:bg-secondary/80">
                                <Download className="h-4 w-4" />
                                Descargar
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Reportes
