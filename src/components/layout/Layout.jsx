import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { LayoutDashboard, Package, Tag, GitBranch, ClipboardCheck, AlertTriangle, ShieldCheck, BarChart2, LogOut, Menu, X } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/marks', label: 'Marks', icon: Tag },
  { path: '/track', label: 'Track & Trace', icon: GitBranch },
  { path: '/inspection', label: 'Inspections', icon: ClipboardCheck },
  { path: '/cases', label: 'Cases', icon: AlertTriangle },
  { path: '/verification', label: 'Verification', icon: ShieldCheck },
  { path: '/reports', label: 'Reports', icon: BarChart2 },
]

const pageTitles = {
  '/': 'Dashboard', '/products': 'Product Registry', '/marks': 'Government Marks',
  '/track': 'Track & Trace', '/inspection': 'Inspections', '/cases': 'Case Management',
  '/verification': 'Product Verification', '/reports': 'Reports & Analytics',
}

export default function Layout({ children }) {
  const { currentAgency, currentUser, setCurrentAgency, setCurrentUser } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const agencyColor = currentAgency?.color || '#003087'
  const pageTitle = pageTitles[location.pathname] || 'IPMAS'

  function handleLogout() {
    setCurrentAgency(null)
    setCurrentUser(null)
    navigate('/')
  }

  function closeSidebar() {
    setSidebarOpen(false)
  }

  const SidebarContent = () => (
    <>
      <div className="px-5 py-5 border-b border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: agencyColor }}>
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-bold text-base leading-tight">IPMAS</div>
              <div className="text-slate-400 text-xs">Gov. of Kenya</div>
            </div>
          </div>
          <button onClick={closeSidebar} className="md:hidden text-slate-400 hover:text-white p-1">
            <X size={20} />
          </button>
        </div>
        <div className="rounded-lg px-3 py-2 text-xs" style={{ backgroundColor: agencyColor + '22', border: `1px solid ${agencyColor}55` }}>
          <div className="font-semibold text-white">{currentAgency?.icon} {currentAgency?.shortName}</div>
          <div className="text-slate-400 truncate">{currentAgency?.name}</div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} end={path === '/'}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`
            }
            style={({ isActive }) => isActive ? { backgroundColor: agencyColor } : {}}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: agencyColor }}>
            {currentUser?.name?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">{currentUser?.name || 'User'}</div>
            <div className="text-slate-400 text-xs truncate">{currentUser?.role}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 text-sm transition-all">
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar — desktop: always visible; mobile: slide in */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-200 md:relative md:translate-x-0 md:flex-shrink-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ backgroundColor: '#1e293b' }}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="text-xs text-gray-400 mb-0.5 hidden sm:block">IPMAS / {currentAgency?.shortName}</div>
              <h1 className="text-base md:text-lg font-semibold text-gray-900">{pageTitle}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">
              {new Date().toLocaleDateString('en-KE', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0" style={{ backgroundColor: agencyColor }}>
              {currentUser?.name?.[0] || 'U'}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
