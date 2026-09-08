// src/page/Login.jsx
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { usersService } from '../../api/auth/usersService'
import { setSession } from '../../utils/auth'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ usuario: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const resp = await usersService.login(formData)
      const data = resp.data || resp

      // El token devuelto por FastAPI es 'access_token'
      const token = data.access_token || data.token

      // Normalizar el rol y asignar el rol_id correcto
      const nombreRol = (data.rol || '').toLowerCase().trim()
      const rolId =
        nombreRol === 'super_admin' || nombreRol === 'superadmin' ? 1
        : nombreRol === 'admin' ? 2
        : 3

      const user = {
        id: data.usuario_id || (formData.usuario === 'admin' ? 3 : 1),
        usuario: data.usuario || formData.usuario,
        nombre: data.nombre || data.usuario || formData.usuario,
        nombre_rol: nombreRol,
        rol_id: rolId,
      }

      setSession(token, user)
      navigate('/')
    } catch (err) {
      setError(err.message || 'Credenciales inválidas o cuenta pendiente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white text-center mb-2">GeoMonitor</h2>
        <p className="text-sm text-slate-400 text-center mb-6">Inicia sesión en tu cuenta</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Usuario</label>
            <input
              type="text"
              required
              value={formData.usuario}
              onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="text-blue-400 hover:underline">
            Solicitar registro
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login