import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useIsMobile } from '../hooks/movil'
import Sidebar from './Sidebar'


const LayoutDashboard = () => {
  const isMobile = useIsMobile()
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile)

  return (

    <div className="flex h-screen bg-background">
      <div className="hidden sm:flex shrink-0">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/50"
          aria-hidden="true"
        />
      )}

      {isMobile && (
        <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden h-screen">

       
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default LayoutDashboard
