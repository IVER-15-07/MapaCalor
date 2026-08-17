import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TYPE_COLORS } from './reportesColors'

export const ChartDistribucionTipo = ({ data = [] }) => {
    return (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="mb-4">
                <h3 className="font-semibold text-card-foreground">Distribución por Tipo</h3>
                <p className="text-sm text-muted-foreground">Porcentaje de incidencias por categoría</p>
            </div>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="total"
                            nameKey="categoria"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={TYPE_COLORS[index % TYPE_COLORS.length]} />
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
    )
}