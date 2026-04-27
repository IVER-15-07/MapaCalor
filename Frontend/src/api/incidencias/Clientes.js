import axiosInstance from '../helpers/axios-config'

export const clientesService = {
    async getClientRecords({ fechaRegistro, limit = 1000 } = {}) {
        try {
            const params = { limit }
            if (fechaRegistro) {
                params.fecha_registro = fechaRegistro
            }

            const response = await axiosInstance.get('/incidents/clientes', { params })
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Error al obtener registros de clientes')
        }
    },
}
