// mapUtils.js
export const COCHA_CENTER = [-17.3895, -66.1568]
export const ELASTIX_FEED_INTERVAL_MS = 1200
export const ELASTIX_RECENT_WINDOW_MS = 10 * 60 * 1000
export const CRITICAL_THRESHOLD_DEFAULT = 30

export const intensityConfig = {
  low: { color: '#22c55e', hex: '#22c55e', radius: 8, label: 'Baja', twColor: 'bg-green-500' },
  medium: { color: '#3b82f6', hex: '#3b82f6', radius: 12, label: 'Media', twColor: 'bg-blue-500' },
  high: { color: '#f59e0b', hex: '#f59e0b', radius: 18, label: 'Alta', twColor: 'bg-orange-500' },
  critical: { color: '#ef4444', hex: '#ef4444', radius: 24, label: 'Crítica', twColor: 'bg-red-500' },
}

export const zoneData = [
  { name: 'AEROPUERTO', x: 45, y: 55 },
  { name: 'AIQUILE', x: 85, y: 95 },
  { name: 'ARANI', x: 80, y: 78 },
  { name: 'AROCAGUA', x: 60, y: 45 },
  { name: 'CALICANTO', x: 45, y: 65 },
  { name: 'CAPINOTA', x: 20, y: 85 },
  { name: 'CARCAJE', x: 65, y: 72 },
  { name: 'CHIMBA', x: 44, y: 50 },
  { name: 'CHINATA', x: 75, y: 46 },
  { name: 'CLIZA', x: 72, y: 75 },
  { name: 'CONDEBAMBA', x: 40, y: 45 },
  { name: 'COSMOS', x: 42, y: 56 },
  { name: 'EL PASO', x: 32, y: 40 },
  { name: 'EX-MATADERO', x: 48, y: 55 },
  { name: 'FLORIDA NORTE', x: 35, y: 46 },
  { name: 'FLORIDA SUD', x: 35, y: 50 },
  { name: 'HIPODROMO', x: 42, y: 48 },
  { name: 'HUAYLLANI', x: 65, y: 44 },
  { name: 'HUAYRA KHASA', x: 52, y: 60 },
  { name: 'KM "0"', x: 50, y: 50 },
  { name: 'LA FERIA', x: 46, y: 52 },
  { name: 'LA PAZ', x: 50, y: 56 },
  { name: 'LAS CUADRAS', x: 52, y: 48 },
  { name: 'LINDE', x: 35, y: 42 },
  { name: 'MONTENEGRO', x: 30, y: 54 },
  { name: 'MUYURINA', x: 55, y: 48 },
  { name: 'NORTE', x: 50, y: 40 },
  { name: 'PACATA', x: 58, y: 42 },
  { name: 'PAROTANI', x: 12, y: 70 },
  { name: 'PIÑAMI', x: 34, y: 48 },
  { name: 'PUCARA (SACABA)', x: 70, y: 45 },
  { name: 'PUNATA', x: 76, y: 73 },
  { name: 'QUERU QUERU', x: 50, y: 44 },
  { name: 'QUILLACOLLO', x: 25, y: 50 },
  { name: 'QUINTANILLA', x: 62, y: 44 },
  { name: 'SACABA PUEBLO', x: 68, y: 44 },
  { name: 'SAN BENITO', x: 72, y: 70 },
  { name: 'SAN MIGUEL', x: 52, y: 52 },
  { name: 'SANTIVAÑEZ', x: 35, y: 75 },
  { name: 'SARCO', x: 46, y: 45 },
  { name: 'SAUSALITO FTTH', x: 54, y: 42 },
  { name: 'SEBASTIAN PAGADOR', x: 55, y: 65 },
  { name: 'SEMINARIO', x: 50, y: 42 },
  { name: 'SIPE SIPE', x: 15, y: 55 },
  { name: 'SUCRE', x: 50, y: 48 },
  { name: 'SUD', x: 50, y: 62 },
  { name: 'TAMBORADA', x: 50, y: 66 },
  { name: 'TARATA', x: 62, y: 78 },
  { name: 'TEMPORAL', x: 50, y: 38 },
  { name: 'TIQUIPAYA', x: 40, y: 35 },
  { name: 'TOLATA', x: 68, y: 72 },
  { name: 'TUPURAYA', x: 52, y: 45 },
  { name: 'VALLE HERMOSO', x: 54, y: 60 },
  { name: 'VILLA BUSCH NORTE', x: 42, y: 42 },
  { name: 'VILLA BUSCH SUD', x: 42, y: 45 },
  { name: 'VILLA ISRAEL', x: 52, y: 70 },
  { name: 'VILLA RIBERO', x: 48, y: 58 },
  { name: 'VINTO', x: 20, y: 52 },
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

export const formatElapsed = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000))
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}s`
}

export const mapSectorNamesToPoints = (llamadasPorSector) => {
  const countBySector = new Map(
    (llamadasPorSector || []).map((item) => [
      normalizeSectorKey(item.sector_operativo),
      { llamadas: Number(item.total_llamadas || 0), intensidad: item.intensidad || 'low' },
    ])
  )

  return zoneData
    .filter((data) => countBySector.has(normalizeSectorKey(data.name)))
    .map((data, index) => {
      const lat = COCHA_CENTER[0] - (data.y - 50) * 0.003
      const lng = COCHA_CENTER[1] + (data.x - 50) * 0.003
      const countData = countBySector.get(normalizeSectorKey(data.name)) || { llamadas: 0, intensidad: 'low' }

      return {
        id: `${data.name}-${index}`,
        lat, lng,
        intensity: countData.intensidad,
        zone: data.name,
        incidents: countData.llamadas,
        district: data.name,
      }
    })
}

export const buildElastixSectorSummary = (calls) => {
  const now = Date.now()
  const countsBySector = new Map()

  calls
    .filter((call) => now - call.timestamp <= ELASTIX_RECENT_WINDOW_MS)
    .forEach((call) => {
      const key = call.sector_operativo
      countsBySector.set(key, (countsBySector.get(key) || 0) + 1)
    })

  return [...countsBySector.entries()].map(([sectorOperativo, totalLlamadas]) => {
    let intensidad = 'low'
    if (totalLlamadas >= 14) intensidad = 'critical'
    else if (totalLlamadas >= 8) intensidad = 'high'
    else if (totalLlamadas >= 4) intensidad = 'medium'

    return { sector_operativo: sectorOperativo, total_llamadas: totalLlamadas, intensidad }
  })
}