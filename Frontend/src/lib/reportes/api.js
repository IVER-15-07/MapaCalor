/**
 * API endpoints para Reportes
 * Gestiona operaciones de reportes
 */

import { apiCall } from "../api.js"

export const reportesAPI = {
  // Obtener reportes en tiempo real
  getRealtimeReports: () =>
    apiCall("/incidents/realtime/", { method: "GET" }),

  // Obtener reportes históricos por rango opcional
  getHistoricReports: ({ startDate, endDate, limit = 200 } = {}) => {
    const params = new URLSearchParams()
    if (startDate) params.append("start_date", startDate)
    if (endDate) params.append("end_date", endDate)
    params.append("limit", String(limit))
    return apiCall(`/incidents/historic/?${params.toString()}`, { method: "GET" })
  },

  // Obtener reportes de rango de fechas
  getReportsByDateRange: (startDate, endDate) =>
    apiCall(`/incidents/historic/?start_date=${startDate}&end_date=${endDate}`, { method: "GET" }),

  // Obtener estado crítico actual
  getCriticalStatus: () =>
    apiCall("/incidents/stats/", { method: "GET" }),

  // Crear nuevo reporte
  createReport: (reportData) =>
    apiCall("/incidents/", { method: "POST", body: reportData }),

  // Generar reporte PDF/Excel
  generateReport: (reportType, dateRange) =>
    apiCall(`/incidents/generate/`, {
      method: "POST", 
      body: { type: reportType, dateRange } 
    }),
}
