import { useState } from 'react'
import { Search, Bell, Calendar, ChevronDown, User, Menu } from 'lucide-react'

const Header = ({ isMobile, onMenuClick }) => {
    const [dateRange, setDateRange] = useState('Hoy')
  return (
     <header className="flex min-h-16 items-center justify-between gap-3 border-b border-border bg-card px-4 py-3 sm:px-6">
      {/* Search */}
      <div className="flex flex-1 items-center gap-2">
        {isMobile && (
          <button
            type="button"
            onClick={onMenuClick}
            className="rounded-lg p-2 hover:bg-secondary"
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

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Date Filter */}
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

        {/* Notifications */}
        <button className="relative rounded-lg p-2 hover:bg-secondary">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
        </button>

        {/* User */}
        <div className="hidden items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 sm:flex">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
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
