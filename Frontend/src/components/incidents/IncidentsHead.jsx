import { Search } from 'lucide-react'

const IncidentsHead = ({
    searchTerm,
    setSearchTerm,
    mode,
    setMode,
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,
    range,
    setRange,
    loading,
    total,
    handleConsult
}) => {
    return (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">

                {/* Buscador */}
                <div className="relative flex-1 min-w-50">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Buscar por cliente, producto, servicio, dirección o sector"
                        className="h-10 w-full rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm"
                    />
                </div>

                {/* Selector modo */}
                <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm"
                >
                    <option value="day">Día</option>
                    <option value="month">Mes</option>
                    <option value="range">Rango</option>
                </select>

                {/* Día */}
                {mode === 'day' && (
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="h-10 rounded-lg border px-3"
                    />
                )}

                {/* Mes */}
                {mode === 'month' && (
                    <div className="flex gap-2">

                        {/* Año editable */}
                        <input
                            type="number"
                            min="2000"
                            max="2100"
                            value={selectedMonth.split('-')[0]}
                            onChange={(e) => {
                                const year = e.target.value
                                const month = selectedMonth.split('-')[1] || '01'
                                setSelectedMonth(`${year}-${month}`)
                            }}
                            placeholder="Año"
                            className="h-10 w-24 rounded-lg border px-3"
                        />

                        {/* Selector de mes */}
                        <select
                            value={selectedMonth.split('-')[1]}
                            onChange={(e) => {
                                const month = e.target.value
                                const year = selectedMonth.split('-')[0]
                                setSelectedMonth(`${year}-${month}`)
                            }}
                            className="h-10 rounded-lg border px-3"
                        >
                            <option value="01">Ene</option>
                            <option value="02">Feb</option>
                            <option value="03">Mar</option>
                            <option value="04">Abr</option>
                            <option value="05">May</option>
                            <option value="06">Jun</option>
                            <option value="07">Jul</option>
                            <option value="08">Ago</option>
                            <option value="09">Sep</option>
                            <option value="10">Oct</option>
                            <option value="11">Nov</option>
                            <option value="12">Dic</option>
                        </select>

                    </div>
                )}

                {/* Rango */}
                {mode === 'range' && (
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={range.from}
                            onChange={(e) => setRange(prev => ({ ...prev, from: e.target.value }))}
                            className="h-10 rounded-lg border px-3"
                        />
                        <input
                            type="date"
                            value={range.to}
                            onChange={(e) => setRange(prev => ({ ...prev, to: e.target.value }))}
                            className="h-10 rounded-lg border px-3"
                        />
                    </div>
                )}

                <button
                    onClick={handleConsult}
                    className="h-10 rounded-lg bg-primary px-4 text-sm text-white"
                >
                    Consultar
                </button>
            </div>

            {/* contador */}
            <p className="text-xs text-muted-foreground">
                {loading
                    ? 'Cargando...'
                    : <>Mostrando <span className="font-medium">{total}</span> registros</>}
            </p>
        </div>
    )
}

export default IncidentsHead