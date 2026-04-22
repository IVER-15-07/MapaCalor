/**
 * API endpoints para Reportes
 * Gestiona operaciones de reportes
 */

import { apiClient } from "../api.js"

export const reportesAPI = {
  // Obtener reportes en tiempo real
  getRealtimeReports: () =>
    apiClient.get("/incidents/realtime/").then((response) => response.data),

  // Obtener reportes históricos por rango opcional
  getHistoricReports: ({ startDate, endDate, limit = 200 } = {}) => {
    const params = new URLSearchParams()
    if (startDate) params.append("start_date", startDate)
    if (endDate) params.append("end_date", endDate)
    params.append("limit", String(limit))
    return apiClient.get("/incidents/historic/", { params }).then((response) => response.data)
  },

  // Obtener reportes de rango de fechas
  getReportsByDateRange: (startDate, endDate) =>
    apiClient.get("/incidents/historic/", {
      params: { start_date: startDate, end_date: endDate },
    }).then((response) => response.data),

  // Obtener estado crítico actual
  getCriticalStatus: () =>
    apiClient.get("/incidents/stats/").then((response) => response.data),

  // Crear nuevo reporte
  createReport: (reportData) =>
    apiClient.post("/incidents/", reportData).then((response) => response.data),

  // Generar reporte PDF/Excel
  generateReport: (reportType, dateRange) =>
    apiClient.post("/incidents/generate/", {
      type: reportType,
      dateRange,
    }).then((response) => response.data),
}
