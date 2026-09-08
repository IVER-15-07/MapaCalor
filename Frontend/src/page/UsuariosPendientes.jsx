// src/page/UsuariosPendientes.jsx
import { useState, useEffect } from 'react'
import { usersService } from '../api/auth/usersService'
import { getSession } from '../utils/auth'

const UsuariosPendientes = () => {
  const [usuarios, setUsuarios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = getSession()

  const cargarPendientes = async () => {
    setLoading(true)
    setError(null)
    try {
      const resp = await usersService.getUsuariosPendientes()
      setUsuarios(resp.data || [])
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios pendientes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargarPendientes()
  }, [])

  const handleAprobar = async (id) => {
    try {
      await usersService.aprobarUsuario(id, user?.id)
      cargarPendientes()
    } catch (err) {
      alert(err.message || 'Error al aprobar')
    }
  }

  const handleRechazar = async (id) => {
    if (!window.confirm('¿Deseas rechazar esta solicitud?')) return
    try {
      await usersService.rechazarUsuario(id, user?.id)
      cargarPendientes()
    } catch (err) {
      alert(err.message || 'Error al rechazar')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Aprobación de Usuarios</h1>
        <p className="text-sm text-muted-foreground">Solicitudes de operadores pendientes de revisión</p>
      </div>

      {error && <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</div>}

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Cargando solicitudes...</div>
        ) : usuarios.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No hay solicitudes pendientes.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-secondary/50 text-muted-foreground uppercase text-xs">
              <tr>
                <th className="p-4">Nombre</th>
                <th className="p-4">Usuario</th>
                <th className="p-4">Correo</th>
                <th className="p-4">Fecha Solicitud</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/30 transition">
                  <td className="p-4 font-medium text-foreground">{u.nombre}</td>
                  <td className="p-4 text-muted-foreground">{u.usuario}</td>
                  <td className="p-4 text-muted-foreground">{u.correo}</td>
                  <td className="p-4 text-muted-foreground">
                    {u.fecha_creacion ? new Date(u.fecha_creacion).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleAprobar(u.id)}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleRechazar(u.id)}
                      className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
                    >
                      Rechazar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default UsuariosPendientes