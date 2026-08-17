import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const DIAS_ESP = {
    Mon: 'Lun',
    Tue: 'Mar',
    Wed: 'Mie',
    Thu: 'Jue',
    Fri: 'Vie',
    Sat: 'Sab',
    Sun: 'Dom'
}

export const ChartIncidenciasDia = ({ data = [] }) => {
    // Mapeamos los datos antes de renderizarlos
    const formattedData = data.map(item => ({
        ...item,
        dia: DIAS_ESP[item.dia] || item.dia
    }))

    return (
        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            {/* Header del Componente */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.005 260)" />
                        <XAxis dataKey="dia" stroke="oklch(0.65 0 0)" fontSize={12} />
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
    )
}