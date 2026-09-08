import axiosInstance from '../helpers/axios-config'

export const usersService = {
  // 1. Registro de administrador (Pendiente de aprobación)
  // userData: { username, email, password, etc. } segun UserRegister schema
  async registrarAdmin(userData) {
    try {
      const response = await axiosInstance.post('/users/register', userData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.response?.data?.mensaje || 'Error al registrar el usuario')
    }
  },

  // 2. Obtener lista de usuarios pendientes de aprobación
  async getUsuariosPendientes() {
    try {
      const response = await axiosInstance.get('/users/pending')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.response?.data?.mensaje || 'Error al obtener usuarios pendientes')
    }
  },

  // 3. Aprobar usuario
  // usuarioId: ID del usuario a aprobar
  // superAdminId: ID del super admin que aprueba (UserApprove schema)
  async aprobarUsuario(usuarioId, superAdminId) {
    try {
      const response = await axiosInstance.post(`/users/${usuarioId}/approve`, {
        super_admin_id: superAdminId
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.response?.data?.mensaje || 'Error al aprobar el usuario')
    }
  },

  // 4. Rechazar usuario
  // usuarioId: ID del usuario a rechazar
  // superAdminId: ID del super admin que rechaza (UserApprove schema)
  async rechazarUsuario(usuarioId, superAdminId) {
    try {
      const response = await axiosInstance.post(`/users/${usuarioId}/reject`, {
        super_admin_id: superAdminId
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.response?.data?.mensaje || 'Error al rechazar el usuario')
    }
  },

  // 5. Iniciar sesión
  // credentials: { username/email, password } segun UserLogin schema
  async login(credentials) {
    try {
      const response = await axiosInstance.post('/users/login', credentials)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || error.response?.data?.mensaje || 'Error al iniciar sesión')
    }
  }
}