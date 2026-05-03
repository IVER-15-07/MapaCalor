import { useEffect, useMemo, useState } from "react";
import { historialService } from "../../api/incidencias/Historial";
import { getTodayISO, mapSectorNamesToPoints } from "../../components/mapa/mapUtils";
export const useMapa = () => {
    const [selectedDate, setSelectedDate] = useState(getTodayISO())
    const [activePoints, setActivePoints] = useState([])
    const [backendSectorCount, setBackendSectorCount] = useState(0)
    const [backendIncidentCount, setBackendIncidentCount] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [selectedPoint, setSelectedPoint] = useState(null)
    const [zoom, setZoom] = useState(12)

    //funcion interna para cargar sectores
    const loadSectors = (dataResponse) => {

        try {
            const llamadas = dataResponse.llamadas_por_sector || []
            const points = mapSectorNamesToPoints(llamadas)

            setBackendSectorCount(dataResponse.total_sectores || llamadas.length)
            setBackendIncidentCount(dataResponse.total_llamadas || 0)
            setActivePoints(points)
            setSelectedPoint(null)
        } catch (err) {
            setBackendSectorCount(0)
            setBackendIncidentCount(0)
            setActivePoints([])
            setError(err.message)
        } finally {
            setLoading(false)
        }

    }


    // inicial
    useEffect(() => {
        const init = async () => {
            setLoading(true)
            try {
                const data = await historialService.getHeatmapState({
                    fechaRegistro: getTodayISO(),
                    mode: 'normal'
                })
                loadSectors(data)
            } catch (err) {
                setError(err.message)
                setLoading(false)
            }
        }
        init()
    }, [])

    // Handler para consulta por día
    const handleConsultaDay = async (date) => {
        setSelectedDate(date)
        setLoading(true)
        try {
            const data = await historialService.getHeatmapState({ fechaRegistro: date })
            loadSectors(data)
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    const handleConsultaMonth = async (month) => {
        setSelectedDate(month)
        setLoading(true)
        try {
            const data = await historialService.getSectorByMonth(month)
            loadSectors(data)
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    const handleConsultaRange = async (from, to) => {
        setSelectedDate(`${from} → ${to}`)
        setLoading(true)
        try {
            const data = await historialService.getSectorsByRange(from, to)
            loadSectors(data)
        } catch (err) {
            setError(err.message)
            setLoading(false)
        }
    }

    const totalIncidents = useMemo(
        () => activePoints.reduce((sum, p) => sum + p.incidents, 0),
        [activePoints]
    )

    const sectorCount = activePoints.length


    return {
        // estados 
        selectedDate,
        activePoints,
        backendSectorCount,
        backendIncidentCount,
        loading,
        error,
        selectedPoint,
        zoom,

        // setters 
        setSelectedPoint,
        setZoom,

        // acciones 
        handleConsultaDay,
        handleConsultaMonth,
        handleConsultaRange,

        //derivados 
        totalIncidents,
        sectorCount
    }

}