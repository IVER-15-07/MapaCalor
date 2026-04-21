import { useState } from 'react'
import { useIsMobile } from '../hooks/movil'
import { Search, Bell, Calendar, ChevronDown, User, Menu } from 'lucide-react'

/**
 * HEADER - Componente independiente
 * Barra superior del dashboard
 * Maneja su propio estado y detecta mobile automáticamente
 */

const Header = ({ onMenuClick = () => {} }) => {
  const [dateRange, setDateRange] = useState('Hoy')
  const isMobile = useIsMobile()

  return (
    <header className="flex min-h-16 items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-6">
      {/* Sección izquierda - Búsqueda + Botón Menu */}
      <div className="flex flex-1 items-center gap-2">
        {isMobile && (
          <button
            type="button"
            onClick={onMenuClick}
            className="flex-shrink-0 rounded-lg p-2 hover:bg-secondary"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>
        )}

        <div className="relative w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar incidencias, clientes, zonas..."
            className="h-10 w-full rounded-lg border border-border bg-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Sección derecha - Acciones */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Filtro de Fecha */}
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 sm:flex">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-transparent text-sm text-foreground focus:outline-none"
          >
            <option value="Hoy">Hoy</option>
            <option value="Ayer">Ayer</option>
            <option value="Últimos 7 días">Últimos 7 días</option>
            <option value="Últimos 30 días">Últimos 30 días</option>
            <option value="Este mes">Este mes</option>
          </select>
        </div>

        {/* Notificaciones */}
        <button 
          className="relative flex-shrink-0 rounded-lg p-2 hover:bg-secondary"
          aria-label="Notificaciones"
        >
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>

        {/* Perfil de Usuario */}
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 sm:flex">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary flex-shrink-0">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-sm text-foreground">Operador</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  )
}

export default Header
