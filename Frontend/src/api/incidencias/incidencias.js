import axiosInstance from '../helpers/axios-config'

export const incidenciasService = {
    // 1. Obtener por día (formato 'YYYY-MM-DD')
    async getIncidenciasByDay(fecha) {
        try {
            const response = await axiosInstance.get('/incidents/dia', {
                params: { fecha } //  Envia 'fecha' en lugar de 'fecha_registro'
            })
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Error al obtener las incidencias por fecha')
        }
    },

    // 2. Obtener por mes (recibe anio y mes por separado)
    async getIncidenciasByMonth(anio, mes) {
        try {
            const response = await axiosInstance.get('/incidents/mes', {
                params: { anio, mes } //  Envia 'anio' y 'mes'
            })
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Error al obtener las incidencias por mes')
        }
    },

    // 3. Obtener por rango de fechas (formato 'YYYY-MM-DD')
    async getIncidenciasByRange(fechaInicio, fechaFin) { 
        try {
            const response = await axiosInstance.get('/incidents/rango', {
                params: { 
                    fecha_inicio: fechaInicio, //  'fecha_inicio'
                    fecha_fin: fechaFin        //  'fecha_fin'
                }
            })
            return response.data
        } catch (error) {
            throw new Error(error.response?.data?.detail || 'Error al obtener las incidencias por rango de fechas')
        } 
    }
}