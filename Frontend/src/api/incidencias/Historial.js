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
}


