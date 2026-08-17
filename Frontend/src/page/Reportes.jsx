import { useState } from 'react'
import { useReportes } from '../hooks/reportes/useReportes'

import { ReportesHeader } from '../components/reportes/ReportesHeader'
import { ReportesTypeSelector } from '../components/reportes/ReportesTypeSelector'
import { ReportesKPIs } from '../components/reportes/ReportesKPIs'
import { ChartIncidenciasDia } from '../components/reportes/ChartIncidenciasDia'
import { ChartDistribucionTipo } from '../components/reportes/ChartDistribucionTipo'
import { ChartTendenciaMensual } from '../components/reportes/ChartTendenciaMensual'
import { ChartDistribucionZona } from '../components/reportes/ChartDistribucionZona'
import { RecentReportsTable } from '../components/reportes/RecentReportsTable'

const Reportes = () => {
    const [selectedType, setSelectedType] = useState('weekly')
    const [dateRange, setDateRange] = useState('Esta semana')

    const { reportes, loading, error } = useReportes()

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center text-muted-foreground">
                Cargando datos de reportes...
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex h-64 items-center justify-center text-red-500">
                {error}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <ReportesHeader />

            <ReportesTypeSelector
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                dateRange={dateRange}
                setDateRange={setDateRange}
            />

            <ReportesKPIs kpis={reportes?.kpis} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ChartIncidenciasDia data={reportes?.incidencias_por_dia} />
                <ChartDistribucionTipo data={reportes?.distribucion_tipo} />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ChartTendenciaMensual data={reportes?.tendencia_mensual} />
                <ChartDistribucionZona data={reportes?.distribucion_zona} />
            </div>

            <RecentReportsTable />
        </div>
    )
}

export default Reportes