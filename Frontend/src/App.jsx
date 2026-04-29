import { Routes, Route } from 'react-router-dom'
import Incidencias from './page/Incidencias'
import DashboardLayout from './components/LayoutDashboard'
import Dashboard from './page/Dashboard'
import Mapa from './page/Mapa'
import Reportes from './page/Reportes'


import Clientes from './page/Clientes'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="incidencias" element={<Incidencias />} />
          <Route path="mapa" element={<Mapa />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="clientes" element={<Clientes />} />
         
        </Route>
      </Routes>
    </>
  )
}

export default App
