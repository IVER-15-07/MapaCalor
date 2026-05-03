import axiosInstance from '../helpers/axios-config'

export const historialService = {
    
    async getSectorsByDate(fechaRegistro) {
        try {
            const response = await axiosInstance.get('/incidents/historial', {
                params: { fecha_registro: fechaRegistro },
            })
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Error al obtener el historial por fecha')
        }
    },

    async getSectorByMonth(yearMonth) {
        try {
            const response = await axiosInstance.get('/incidents/heatmap-mes', {
                params: { year_month: yearMonth },
            })
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Error al obtener el historial por mes')
        }
    },

    async getSectorsByRange(fechaDesde, fechaHasta) {
        try {
            const response = await axiosInstance.get('/incidents/heatmap-rango', {      
                params: { fecha_desde: fechaDesde, fecha_hasta: fechaHasta },
            })
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Error al obtener el historial por rango de fechas')
        }   
    },








    // Obtiene estado del mapa + llamadas por sector
    async getHeatmapState({ fechaRegistro, mode = 'auto', threshold } = {}) {
        try {
            const params = {
                fecha_registro: fechaRegistro,
                mode,
            }
            if (threshold) {
                params.threshold = threshold
            }

            const response = await axiosInstance.get('/incidents/heatmap-state', { params })
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Error al obtener estado del mapa de calor')
        }
    },
}


