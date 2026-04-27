import axiosInstance from '../helpers/axios-config'

export const historialService = {
    // Obtiene sectores operativos por fecha desde el backend
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


