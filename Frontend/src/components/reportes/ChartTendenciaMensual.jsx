import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export const ChartTendenciaMensual = ({ data = [] }) => {
    return (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="mb-4">
                <h3 className="font-semibold text-card-foreground">Tendencia Mensual</h3>
                <p className="text-sm text-muted-foreground">Evolución de incidencias por mes</p>
            </div>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.005 260)" />
                        <XAxis dataKey="mes" stroke="oklch(0.65 0 0)" fontSize={12} />
                        <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'oklch(0.16 0.005 260)',
                                border: '1px solid oklch(0.28 0.005 260)',
                                borderRadius: '8px',
                                color: 'oklch(0.95 0 0)'
                            }}
                        />
                        <Bar dataKey="total_incidencias" fill="oklch(0.65 0.15 200)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}