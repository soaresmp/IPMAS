import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import Login from './pages/Login.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Products from './pages/Products.jsx'
import Marks from './pages/Marks.jsx'
import TrackTrace from './pages/TrackTrace.jsx'
import Inspection from './pages/Inspection.jsx'
import Cases from './pages/Cases.jsx'
import Verification from './pages/Verification.jsx'
import Reports from './pages/Reports.jsx'
import Operators from './pages/Operators.jsx'
import MarkOrders from './pages/MarkOrders.jsx'

export default function App() {
  const { currentAgency } = useApp()
  if (!currentAgency) return <Login />
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/operators" element={<Operators />} />
        <Route path="/mark-orders" element={<MarkOrders />} />
        <Route path="/products" element={<Products />} />
        <Route path="/marks" element={<Marks />} />
        <Route path="/track" element={<TrackTrace />} />
        <Route path="/inspection" element={<Inspection />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
