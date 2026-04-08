
import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Map, 
  FileText, 
  Users, 
  Settings,
  Phone,
  Flame
} from 'lucide-react'
import { cn } from '../lib/Utils'

const navItems = [
  { 
    label: 'Principal', 
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Mapa de Calor', href: '/mapa', icon: Map },
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

const Sidebar = ({ isMobile, mobileOpen, onClose }) => {
  return (
    <aside
      className={cn(
        'z-40 flex w-64 flex-col border-r border-border bg-sidebar transition-transform duration-200 ease-in-out',
        isMobile ? 'fixed inset-y-0 left-0 h-full shadow-2xl' : 'relative h-screen',
        isMobile && !mobileOpen && '-translate-x-full',
        isMobile && mobileOpen && 'translate-x-0'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Flame className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-sidebar-foreground">HeatMap</span>
          <span className="text-xs text-muted-foreground">Canal 4200-135</span>
        </div>
        {isMobile && (
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-muted-foreground hover:bg-sidebar-accent"
            aria-label="Cerrar menú"
          >
            ×
          </button>
        )}
      </div>

      {/* Navigation */}
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
                    onClick={isMobile ? onClose : undefined}
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

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
            <Phone className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-sidebar-foreground">SmartFlex</p>
            <p className="text-xs text-muted-foreground">Conectado</p>
          </div>
          <span className="h-2 w-2 rounded-full bg-success" />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
