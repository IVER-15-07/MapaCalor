// zones.js / mapUtils.js
export const COCHA_CENTER = [-17.3895, -66.1568]

export const ELASTIX_FEED_INTERVAL_MS = 1200
export const ELASTIX_RECENT_WINDOW_MS = 10 * 60 * 1000
export const CRITICAL_THRESHOLD_DEFAULT = 30

export const intensityConfig = {
  low:      { color: '#22c55e', hex: '#22c55e', radius: 8,  label: 'Baja',    twColor: 'bg-green-500' },
  medium:   { color: '#3b82f6', hex: '#3b82f6', radius: 12, label: 'Media',   twColor: 'bg-blue-500' },
  high:     { color: '#f59e0b', hex: '#f59e0b', radius: 18, label: 'Alta',    twColor: 'bg-orange-500' },
  critical: { color: '#ef4444', hex: '#ef4444', radius: 24, label: 'Crítica', twColor: 'bg-red-500' },
}

export const zoneData = [
  // ---- Municipios con polígonos perimetrales ----
  {
    name: 'QUILLACOLLO',
    lat: -17.39228,
    lng: -66.27838,
    source: 'verificado',
    polygon: [
      [-17.3750, -66.2950],
      [-17.3780, -66.2620],
      [-17.4080, -66.2580],
      [-17.4180, -66.2880],
      [-17.3980, -66.3050]
    ]
  },
  {
    name: 'SACABA PUEBLO',
    lat: -17.39799,
    lng: -66.03825,
    source: 'verificado',
    polygon: [
      [-17.3820, -66.0650],
      [-17.3780, -66.0150],
      [-17.4120, -66.0100],
      [-17.4200, -66.0580]
    ]
  },
  {
    name: 'TIQUIPAYA',
    lat: -17.33801,
    lng: -66.21579,
    source: 'verificado',
    polygon: [
      [-17.3150, -66.2300],
      [-17.3180, -66.1980],
      [-17.3520, -66.2020],
      [-17.3500, -66.2350]
    ]
  },
  {
    name: 'VINTO',
    lat: -17.39141,
    lng: -66.31681,
    source: 'verificado',
    polygon: [
      [-17.3780, -66.3350],
      [-17.3800, -66.3020],
      [-17.4100, -66.3050],
      [-17.4120, -66.3400]
    ]
  },
  {
    name: 'SIPE SIPE',
    lat: -17.45419,
    lng: -66.35737,
    source: 'verificado',
    polygon: [
      [-17.4350, -66.3800],
      [-17.4380, -66.3350],
      [-17.4720, -66.3400],
      [-17.4750, -66.3850]
    ]
  },

  // ---- Barrios / Zonas de Cercado ----
  {
    name: 'QUERU QUERU',
    lat: -17.36500,
    lng: -66.16000,
    source: 'aproximado',
    polygon: [
      [-17.3580, -66.1680],
      [-17.3580, -66.1520],
      [-17.3720, -66.1520],
      [-17.3720, -66.1680]
    ]
  },
  {
    name: 'SARCO',
    lat: -17.37800,
    lng: -66.17200,
    source: 'aproximado',
    polygon: [
      [-17.3710, -66.1800],
      [-17.3710, -66.1650],
      [-17.3850, -66.1650],
      [-17.3850, -66.1800]
    ]
  },
  {
    name: 'SUD',
    lat: -17.42000,
    lng: -66.15500,
    source: 'aproximado',
    polygon: [
      [-17.4100, -66.1700],
      [-17.4100, -66.1400],
      [-17.4350, -66.1400],
      [-17.4350, -66.1700]
    ]
  },
  {
    name: 'VALLE HERMOSO',
    lat: -17.41000,
    lng: -66.14500,
    source: 'aproximado',
    polygon: [
      [-17.4020, -66.1550],
      [-17.4020, -66.1350],
      [-17.4180, -66.1350],
      [-17.4180, -66.1550]
    ]
  },
  {
    name: 'PACATA',
    lat: -17.37500,
    lng: -66.05000,
    source: 'aproximado',
    polygon: [
      [-17.3650, -66.0650],
      [-17.3650, -66.0400],
      [-17.3850, -66.0400],
      [-17.3850, -66.0650]
    ]
  },
  {
    name: 'AEROPUERTO',
    lat: -17.42110,
    lng: -66.17710,
    source: 'verificado',
    polygon: [
      [-17.4120, -66.1900],
      [-17.4120, -66.1650],
      [-17.4300, -66.1650],
      [-17.4300, -66.1900]
    ]
  }
]

export const normalizeText = (value) => String(value ?? '').trim().toLowerCase()

export const normalizeSectorKey = (value) => {
  return normalizeText(value)
    .replace(/^sector\s+tec\s+/i, '')
    .replace(/^sector\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export const getTodayISO = () => new Date().toISOString().slice(0, 10)

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

export const formatElapsed = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}s`
}

export const isPointInPolygon = (point, polygon) => {
  if (!polygon || polygon.length < 3) return false
  const [lat, lng] = point
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1]
    const xj = polygon[j][0], yj = polygon[j][1]

    const intersect = ((yi > lng) !== (yj > lng)) &&
      (lat < ((xj - xi) * (lng - yi)) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }

  return inside
}

export const mapSectorNamesToPoints = (llamadasPorSector) => {
  const countBySector = new Map()

  ;(llamadasPorSector || []).forEach((item) => {
    const rawSectorName = item.sector_operativo || item.sector || ''
    const key = normalizeSectorKey(rawSectorName)
    const llamadas = Number(item.total_llamadas || item.llamadas || item.incidents || 0)

    let intensidad = item.intensidad
    if (!intensidad) {
      if (llamadas >= 15) intensidad = 'critical'
      else if (llamadas >= 8) intensidad = 'high'
      else if (llamadas >= 3) intensidad = 'medium'
      else intensidad = 'low'
    }

    if (key) {
      countBySector.set(key, { 
        llamadas, 
        intensidad,
        casosDetallados: item.detalles || item.puntos || [] 
      })
    }
  })

  return zoneData
    .filter((data) => countBySector.has(normalizeSectorKey(data.name)))
    .map((data, index) => {
      const countData = countBySector.get(normalizeSectorKey(data.name)) || { 
        llamadas: 0, 
        intensidad: 'low',
        casosDetallados: []
      }

      return {
        id: `${data.name}-${index}`,
        lat: data.lat,
        lng: data.lng,
        intensity: countData.intensidad,
        zone: data.name,
        incidents: countData.llamadas,
        district: data.name,
        polygon: data.polygon || null,
        casosDetallados: countData.casosDetallados,
        coordSource: data.source,
      }
    })
}

export const buildElastixSectorSummary = (calls) => {
  const now = Date.now()
  const countsBySector = new Map()

  calls
    .filter((call) => now - call.timestamp <= ELASTIX_RECENT_WINDOW_MS)
    .forEach((call) => {
      const key = call.sector_operativo || call.sector
      countsBySector.set(key, (countsBySector.get(key) || 0) + 1)
    })

  return [...countsBySector.entries()].map(([sectorOperativo, totalLlamadas]) => {
    let intensidad = 'low'
    if (totalLlamadas >= 15) intensidad = 'critical'
    else if (totalLlamadas >= 8) intensidad = 'high'
    else if (totalLlamadas >= 3) intensidad = 'medium'

    return { sector_operativo: sectorOperativo, total_llamadas: totalLlamadas, intensidad }
  })
}