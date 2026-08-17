import { Calendar, BarChart3, TrendingUp } from 'lucide-react'
import { cn } from '../../lib/Utils'

const reportTypes = [
    { id: 'daily', label: 'Diario', icon: Calendar },
    { id: 'weekly', label: 'Semanal', icon: BarChart3 },
    { id: 'monthly', label: 'Mensual', icon: TrendingUp },
]

export const ReportesTypeSelector = ({ selectedType, setSelectedType, dateRange, setDateRange }) => {
    return (
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
    )
}