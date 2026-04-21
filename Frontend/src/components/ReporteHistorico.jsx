/**
 * Componente: Reporte Histórico
 * Muestra reportes de fechas anteriores con filtros
 */

import { useState } from 'react'
import { Calendar, Filter, Download } from 'lucide-react'
import { cn } from '../../lib/Utils'

const dateRangeOptions = [
  { id: 'today', label: 'Hoy' },
  { id: 'yesterday', label: 'Ayer' },
  { id: 'last7days', label: 'Últimos 7 días' },
  { id: 'last30days', label: 'Últimos 30 días' },
  { id: 'thisMonth', label: 'Este mes' },
]

export function ReporteHistorico({ historicData, onDateRangeChange }) {
  const [selectedRange, setSelectedRange] = useState('last7days')
  const [customDate, setCustomDate] = useState('')

  const handleRangeChange = (rangeId) => {
    setSelectedRange(rangeId)
    onDateRangeChange?.(rangeId)
  }

  const handleCustomDate = (e) => {
    const date = e.target.value
    setCustomDate(date)
    onDateRangeChange?.(date)
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filtrar por período:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {dateRangeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleRangeChange(option.id)}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  selectedRange === option.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fecha Personalizada */}
        <div className="mt-4 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={customDate}
            onChange={handleCustomDate}
            className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Tabla de Reportes Históricos */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="border-b border-border p-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Histórico de Reportes</h3>
          <button className="flex items-center gap-2 text-sm text-primary hover:text-primary/80">
            <Download className="h-4 w-4" />
            Descargar
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Fecha</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Tipo</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Zona</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Estado</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Incidentes</th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">Coordenadas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {historicData && historicData.length > 0 ? (
                historicData.map((report, idx) => (
                  <tr 
                    key={idx}
                    className="hover:bg-secondary/50 transition"
                  >
                    <td className="px-4 py-3 text-foreground">{report.fecha}</td>
                    <td className="px-4 py-3 text-foreground">{report.tipo}</td>
                    <td className="px-4 py-3 text-foreground">{report.zona}</td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
                        report.estado === 'crítico'
                          ? 'bg-destructive/20 text-destructive'
                          : 'bg-warning/20 text-warning'
                      )}>
                        {report.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{report.incidentes}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{report.coordenadas}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-8 text-center text-muted-foreground">
                    No hay reportes para este período
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas del Período */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-2">Total de Incidentes</p>
          <p className="text-3xl font-bold text-foreground">
            {historicData?.reduce((sum, r) => sum + (r.incidentes || 0), 0) || 0}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-2">Períodos en Modo Crítico</p>
          <p className="text-3xl font-bold text-destructive">
            {historicData?.filter(r => r.estado === 'crítico').length || 0}
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground mb-2">Zona Más Afectada</p>
          <p className="text-xl font-bold text-foreground">
            {historicData && historicData.length > 0 
              ? historicData.reduce((max, r) => 
                  (r.incidentes > max.incidentes) ? r : max, historicData[0]
                )?.zona || 'N/A'
              : 'N/A'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
