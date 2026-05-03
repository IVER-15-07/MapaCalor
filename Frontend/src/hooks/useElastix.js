import { useEffect, useState, useRef } from 'react'
import { getRandomInt, ELASTIX_FEED_INTERVAL_MS, zoneData } from '../components/mapa/mapUtils'


export const useElastix = (enabled, isRealtimeDate, options = {}) => {
    const { maxHistory = 1200, maxConcurrent = 200, feedInterval = ELASTIX_FEED_INTERVAL_MS } = options

    const [concurrentCalls, setConcurrentCalls] = useState(0)
    const [elastixCalls, setElastixCalls] = useState([])
    const intervalRef = useRef(null)

    useEffect(() => {
        // limpieza si está deshabilitado
        if (!enabled || !isRealtimeDate) {
            setConcurrentCalls(0)
            setElastixCalls([])
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
            return
        }

        const tick = () => {
            const generatedCalls = Array.from({ length: getRandomInt(1, 4) }).map((_, index) => {
                const zone = zoneData[getRandomInt(0, zoneData.length - 1)]
                return {
                    id: `ELX-${Date.now()}-${index}`,
                    sector_operativo: zone?.name ?? 'desconocido',
                    timestamp: Date.now()
                }
            })

            setElastixCalls(prev => {
                const next = [...generatedCalls, ...prev]
                if (next.length > maxHistory) next.length = maxHistory
                return next
            })

            setConcurrentCalls(prev => {
                const spike = Math.random() < 0.22
                const delta = spike ? getRandomInt(4, 11) : getRandomInt(-3, 4)
                return Math.max(0, Math.min(maxConcurrent, prev + delta))
            })
        }

        // asegurar una sola instancia del timer
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = setInterval(tick, feedInterval)

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [enabled, isRealtimeDate, maxHistory, maxConcurrent, feedInterval])

    return { concurrentCalls, elastixCalls }
}