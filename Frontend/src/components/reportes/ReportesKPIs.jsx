export const ReportesKPIs = ({ kpis }) => {
    const total = kpis?.total_incidencias || 0
    const resueltas = kpis?.resueltas || 0
    const pendientes = kpis?.pendientes || 0
    const pctResueltas = total > 0 ? ((resueltas / total) * 100).toFixed(0) : 0
    const pctPendientes = total > 0 ? ((pendientes / total) * 100).toFixed(0) : 0

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">Total Incidencias</p>
                <p className="text-2xl font-semibold text-card-foreground">{total}</p>
                <p className="text-xs text-success">+12% vs periodo anterior</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">Resueltas</p>
                <p className="text-2xl font-semibold text-success">{resueltas}</p>
                <p className="text-xs text-muted-foreground">{pctResueltas}% del total</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-sm text-muted-foreground">Pendientes</p>
                <p className="text-2xl font-semibold text-chart-3">{pendientes}</p>
                <p className="text-xs text-muted-foreground">{pctPendientes}% del total</p>
            </div>
         
        </div>
    )
}