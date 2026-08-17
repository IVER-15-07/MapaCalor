import axiosInstance from '../helpers/axios-config'

export const reportesService = {

    async getReportes() {
        try {
            const response = await axiosInstance.get('/reportes/dashboard')
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Error al obtener los reportes')
        }
    },


}