// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from './components/LayoutDashboard'
import Dashboard from './page/Dashboard'
import Incidencias from './page/Incidencias'
import Mapa from './page/Mapa'
import Reportes from './page/Reportes'
import Clientes from './page/Clientes'
import Login from './page/auth/Login'
import Registro from './page/auth/Registro'
import UsuariosPendientes from './page/UsuariosPendientes'
import { RutaPrivada, RutaSuperAdmin } from './components/routes/RutaProtegida'

function App() {
  return (
    <Routes>
      {/*  Rutas Públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/*  Rutas Protegidas (Requieren Login de cualquier rol activo) */}
      <Route element={<RutaPrivada />}>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="incidencias" element={<Incidencias />} />
          <Route path="mapa" element={<Mapa />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="clientes" element={<Clientes />} />

          {/*  Ruta exclusiva de Super Admin (Aprobaciones) */}
          <Route element={<RutaSuperAdmin />}>
            <Route path="usuarios-pendientes" element={<UsuariosPendientes />} />
          </Route>
        </Route>
      </Route>

      {/* Redirección por defecto */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App