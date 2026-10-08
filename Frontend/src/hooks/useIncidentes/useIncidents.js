import { useEffect, useMemo, useState } from 'react'
import { incidenciasService } from '../../api/incidencias/incidencias'

const getToday = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const getCurrentMonth = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export const useIncidents = () => {
  const today = useMemo(() => getToday(), [])
  const currentMonth = useMemo(() => getCurrentMonth(), [])

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [mode, setMode] = useState('day')
  const [selectedDate, setSelectedDate] = useState(today)
  const [selectedMonth, setSelectedMonth] = useState(currentMonth) // Formato "YYYY-MM"
  const [range, setRange] = useState({ from: today, to: today })

  // 🔵 QUERY (lo que se ejecuta)
  const [query, setQuery] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')

  // 🔥 Botón CONSULTAR
  const handleConsult = () => {
    setQuery({
      mode,
      selectedDate,
      selectedMonth,
      range
    })
  }

  // 🔥 Se ejecuta solo al hacer clic en Consultar
  useEffect(() => {
    if (!query) return

    const load = async () => {
      setLoading(true)
      setError('')

      try {
        let res

        // 1. Filtrar por Día
        if (query.mode === 'day') {
          res = await incidenciasService.getIncidenciasByDay(query.selectedDate)
        }

        // 2. Filtrar por Mes
        if (query.mode === 'month') {
          // Descomponemos "YYYY-MM" en anio (int) y mes (int) para la API
          const [anioStr, mesStr] = query.selectedMonth.split('-')
          const anio = parseInt(anioStr, 10)
          const mes = parseInt(mesStr, 10)

          res = await incidenciasService.getIncidenciasByMonth(anio, mes)
        }

        // 3. Filtrar por Rango
        if (query.mode === 'range') {
          res = await incidenciasService.getIncidenciasByRange(
            query.range.from,
            query.range.to
          )
        }

        // Tu backend responde con success_response: { data: [...], mensaje: "..." }
        setRows(res.data || [])
      } catch (e) {
        setRows([])
        setError(e.message || 'Error cargando datos')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [query])

  // 🔎 Filtro de búsqueda local en tiempo real con validaciones seguras
  const filteredRows = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()
    if (!search) return rows

    return rows.filter((r) => {
      // Usamos String(...) para evitar errores si algún campo devuelve números (ej. IDs en producto o dano)
      const producto = String(r.producto || '').toLowerCase()
      const servicio = String(r.servicio || '').toLowerCase()
      const dano = String(r.dano || '').toLowerCase()
      const sector = String(r.sector_operativo || r.sector || '').toLowerCase()
      const personal = String(r.personal_diagnostico || '').toLowerCase()
      const area = String(r.area || '').toLowerCase()

      return (
        producto.includes(search) ||
        servicio.includes(search) ||
        dano.includes(search) ||
        sector.includes(search) ||
        personal.includes(search) ||
        area.includes(search)
      )
    })
  }, [rows, searchTerm])

  return {
    filteredRows,
    loading,
    error,

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
  }
}