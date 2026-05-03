
import { Search, Filter, Plus, MapPin, Clock, Zap, Droplets, Wifi, AlertTriangle, X } from 'lucide-react'

import { useIncidents } from '../hooks/useIncidentes/useIncidents'
import IncidentsHead from '../components/incidents/IncidentsHead'
import Loading from '../components/Loading'

const Incidencias = () => {
  const {
    filteredRows,
    loading,
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
    handleConsult
  } = useIncidents()

  return (
    <div className="space-y-6">

      <IncidentsHead
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        mode={mode}
        setMode={setMode}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        range={range}
        setRange={setRange}
        loading={loading}
        total={filteredRows.length}
        handleConsult={handleConsult}
      />

      {/* ── TABLA ── */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="min-w-225px w-full">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Cliente</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Producto</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Servicio</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Dirección</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Daño</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Sector</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase text-muted-foreground">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  Cargando registros...
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No se encontraron registros para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              filteredRows.map((r) => (
                <tr key={r.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-card-foreground">{r.cliente}</span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-sm text-card-foreground">{r.producto}</span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-sm text-muted-foreground">{r.servicio}</span>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 shrink-0" />
                      {r.direccion}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-sm text-muted-foreground">{r.danio}</span>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-sm text-muted-foreground">{r.sector}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 shrink-0" />
                      {r.fecha}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default Incidencias