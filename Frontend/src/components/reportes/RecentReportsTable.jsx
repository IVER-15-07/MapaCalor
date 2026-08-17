import { FileText, Download, Filter } from 'lucide-react'

const recentReports = [
    { id: 1, name: 'Reporte Diario - 15/03/2024', date: '15/03/2024', size: '2.4 MB' },
    { id: 2, name: 'Reporte Semanal - Semana 11', date: '10/03/2024', size: '5.1 MB' },
    { id: 3, name: 'Reporte Mensual - Febrero 2024', date: '01/03/2024', size: '12.8 MB' },
    { id: 4, name: 'Reporte Diario - 14/03/2024', date: '14/03/2024', size: '2.2 MB' },
    { id: 5, name: 'Reporte Semanal - Semana 10', date: '03/03/2024', size: '4.9 MB' },
]

export const RecentReportsTable = () => {
    return (
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
    )
}