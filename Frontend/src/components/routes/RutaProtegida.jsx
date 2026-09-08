// src/components/RutaProtegida.jsx
import { Navigate, Outlet } from 'react-router-dom'
import { getSession } from '../../utils/auth'

// Protege que esté logueado
export const RutaPrivada = () => {
  const { isAuthenticated } = getSession()
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

// Protege que sea super_admin (rol_id === 1)
export const RutaSuperAdmin = () => {
  const { user, isAuthenticated } = getSession()
  
  if (!isAuthenticated) return <Navigate to="/login" replace />
  
  // En tu tabla roles_app: id = 1 es super_admin
  const esSuperAdmin = user?.rol_id === 1 || user?.nombre_rol === 'super_admin'
  return esSuperAdmin ? <Outlet /> : <Navigate to="/" replace />
}