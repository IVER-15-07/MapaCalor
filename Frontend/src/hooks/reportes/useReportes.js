import { useCallback, useEffect, useState } from 'react'
import { reportesService } from '../../api/incidencias/reportes'

export const useReportes = () => {

    const [reportes, setReportes] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const obtenerReportes = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const response = await reportesService.getReportes()

            setReportes(response.data)

        } catch (error) {
            setError(
                error.message || 'Error al obtener los reportes'
            )
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        obtenerReportes()
    }, [obtenerReportes])

    return {
        reportes,
        loading,
        error,
        obtenerReportes
    }
}
