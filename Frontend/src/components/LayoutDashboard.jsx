import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useIsMobile } from '../hooks/movil'
import Sidebar from './Sidebar'
import Header from './Header'

/**
 * LayoutDashboard
 * Componente contenedor que orquesta Sidebar y Header de forma flexible
 * Sidebar y Header son totalmente independientes
 */
const LayoutDashboard = () => {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  return (
    <div className="flex h-screen bg-background">
      {/* SIDEBAR - Fijo en el lado izquierdo (no sube con scroll) */}
      <div className="hidden sm:flex flex-shrink-0">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Overlay para cerrar sidebar en mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50"
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar - Overlay */}
      {isMobile && (
        <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Contenedor principal - Ocupa el espacio restante y scrollea */}
      <div className="flex flex-1 flex-col overflow-hidden h-screen">
        {/* HEADER - Fijo en la parte superior */}
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Contenido - Este es lo que scrollea */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default LayoutDashboard
