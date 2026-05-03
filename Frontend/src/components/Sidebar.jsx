
import { NavLink } from 'react-router-dom'
import { useIsMobile } from '../hooks/movil'
import { LayoutDashboard, AlertTriangle, Map, FileText, Users, Flame, X, User, Bell } from 'lucide-react'
import { cn } from '../lib/Utils'

const navItems = [
  { 
    label: 'Principal', 
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Historicos', href: '/mapa', icon: Map },
      { name: 'Notificaciones', href: '/notificaciones', icon: Bell },
    ]
  },
  { 
    label: 'Gestión', 
    items: [
     
      { name: 'Incidencias', href: '/incidencias', icon: AlertTriangle },
      { name: 'Clientes', href: '/clientes', icon: Users },
      { name: 'Reportes', href: '/reportes', icon: FileText },
    ]
  },
]

const Sidebar = ({ isOpen = true, onClose }) => {
  const isMobile = useIsMobile()

  return (
    <aside
      className={cn(
        'flex w-64 flex-col border-r border-border bg-sidebar',
        isMobile 
          ? 'fixed inset-y-0 left-0 h-screen shadow-2xl z-40' 
          : 'relative h-screen'
      )}
    >
      <div className="flex h-16 items-center justify-between gap-2 border-b border-sidebar-border px-6">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Flame className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">HeatMap</span>
            <span className="text-xs text-muted-foreground">Canal 4200-135</span>
          </div>
        </div>
        
        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent"
            aria-label="Cerrar sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation - Menu items */}
      <nav className="flex-1 space-y-6 overflow-auto p-4">
        {navItems.map((section) => (
          <div key={section.label}>
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {section.label}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.href}
                    onClick={() => isMobile && onClose?.()}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-primary'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      )
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent p-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary flex-shrink-0">
            <User className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-sidebar-foreground">Operador</p>
            <p className="text-xs text-muted-foreground">Conectado</p>
          </div>
          <span className="h-2 w-2 rounded-full bg-success" />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
