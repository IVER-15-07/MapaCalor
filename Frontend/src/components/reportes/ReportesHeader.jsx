import { FileText } from 'lucide-react'

export const ReportesHeader = () => {
    return (
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
    )
}