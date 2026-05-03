import { useEffect, useMemo, useState } from 'react'
import { CalendarDays, Filter, Search } from 'lucide-react'
import { clientesService } from '../api/incidencias/Clientes'

const getTodayDate = () => {
    const currentDate = new Date()
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, '0')
    const day = String(currentDate.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const Clientes = () => {
    const today = useMemo(() => getTodayDate(), [])
    const [rows, setRows] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')
    const [dateMode, setDateMode] = useState('hoy')
    const [selectedDate, setSelectedDate] = useState(today)

    useEffect(() => {
        const loadRows = async () => {
            setLoading(true)
            setError('')

            try {
                const fechaRegistro = dateMode === 'todos' ? undefined : dateMode === 'hoy' ? today : selectedDate
                const response = await clientesService.getClientRecords({ fechaRegistro, limit: 2000 })
                setRows(response.items || [])
            } catch (requestError) {
                setRows([])
                setError(requestError.message || 'No se pudieron cargar los registros')
            } finally {
                setLoading(false)
            }
        }

        loadRows()
    }, [dateMode, selectedDate, today])

    const filteredRows = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase()

        return rows.filter((row) => {
            const matchesSearch =
                !normalizedSearch ||
                row.cliente.toLowerCase().includes(normalizedSearch) ||
                row.producto.toLowerCase().includes(normalizedSearch) ||
                row.servicio.toLowerCase().includes(normalizedSearch) ||
                row.direccion.toLowerCase().includes(normalizedSearch) ||
                row.sector.toLowerCase().includes(normalizedSearch)

            if (!matchesSearch) return false

            return true
        })
    }, [rows, searchTerm])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-foreground">Clientes</h1>
                <p className="text-muted-foreground">Tabla de registros por fecha con datos de cliente y servicio</p>
            </div>

            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex w-full flex-col gap-3 lg:max-w-2xl lg:flex-row lg:items-center">
                    <div className="relative w-full lg:max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Buscar por cliente, producto, servicio, dirección o sector"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            className="h-10 w-full rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4 text-muted-foreground" />
                            <select
                                value={dateMode}
                                onChange={(event) => setDateMode(event.target.value)}
                                className="h-10 rounded-lg border border-border bg-secondary px-3 text-sm text-foreground focus:outline-none"
                            >
                                <option value="hoy">Registrados hoy</option>
                                <option value="fecha">Por fecha</option>
                                <option value="todos">Todos</option>
                            </select>
                        </div>

                        {dateMode === 'fecha' && (
                            <div className="relative">
                                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(event) => setSelectedDate(event.target.value)}
                                    className="h-10 rounded-lg border border-border bg-secondary pl-10 pr-3 text-sm text-foreground focus:outline-none"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-sm text-muted-foreground">{loading ? 'Cargando...' : `${filteredRows.length} registros encontrados`}</p>
            </div>

            {error && (
                <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-border bg-card">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-secondary/60 text-left text-muted-foreground">
                            <tr>
                                <th className="px-4 py-3 font-medium">Cliente</th>
                                <th className="px-4 py-3 font-medium">Producto</th>
                                <th className="px-4 py-3 font-medium">Servicio</th>
                                <th className="px-4 py-3 font-medium">Dirección</th>
                                <th className="px-4 py-3 font-medium">Daño</th>
                                <th className="px-4 py-3 font-medium">Sector</th>
                                <th className="px-4 py-3 font-medium">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRows.map((row) => (
                                <tr key={row.id} className="border-t border-border">
                                    <td className="px-4 py-3 text-foreground">{row.cliente}</td>
                                    <td className="px-4 py-3 text-foreground">{row.producto}</td>
                                    <td className="px-4 py-3 text-foreground">{row.servicio}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{row.direccion}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{row.danio}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{row.sector}</td>
                                    <td className="px-4 py-3 text-muted-foreground">{row.fecha}</td>
                                </tr>
                            ))}

                            {filteredRows.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                                        No hay registros para el filtro seleccionado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Clientes
