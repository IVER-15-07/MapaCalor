import { useEffect, useMemo, useState } from 'react'
import { clientesService } from '../../api/incidencias/Clientes'

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
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [range, setRange] = useState({ from: today, to: today })

  // 🔵 QUERY (lo que se ejecuta)
  const [query, setQuery] = useState(null)

  const [searchTerm, setSearchTerm] = useState('')

  // 🔥 botón CONSULTAR
  const handleConsult = () => {
    setQuery({
      mode,
      selectedDate,
      selectedMonth,
      range
    })
  }

  // 🔥 SOLO se ejecuta cuando haces click en consultar
  useEffect(() => {
    if (!query) return

    const load = async () => {
      setLoading(true)
      setError('')

      try {
        let res

        if (query.mode === 'day') {
          res = await clientesService.getClientRecords({
            fechaRegistro: query.selectedDate,
            limit: 2000
          })
        }

        if (query.mode === 'month') {
          res = await clientesService.getClientByMonth(query.selectedMonth)
        }

        if (query.mode === 'range') {
          res = await clientesService.getClientByRange(
            query.range.from,
            query.range.to
          )
        }

        setRows(res.items || [])
      } catch (e) {
        setRows([])
        setError(e.message || 'Error cargando datos')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [query])

  // 🔎 filtro búsqueda (esto sí es en tiempo real)
  const filteredRows = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    return rows.filter((r) => {
      if (!search) return true

      return (
        r.cliente.toLowerCase().includes(search) ||
        r.producto.toLowerCase().includes(search) ||
        r.servicio.toLowerCase().includes(search) ||
        r.direccion.toLowerCase().includes(search) ||
        r.sector.toLowerCase().includes(search)
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