import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext.jsx'
import { LayoutDashboard, Package, Tag, GitBranch, ClipboardCheck, AlertTriangle, ShieldCheck, BarChart2, Building2, ShoppingCart, LogOut, Menu, X } from 'lucide-react'

const agencyNavItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/operators', label: 'Operators', icon: Building2 },
  { path: '/mark-orders', label: 'Mark Orders', icon: ShoppingCart },
  { path: '/products', label: 'Products', icon: Package },
  { path: '/marks', label: 'Marks', icon: Tag },
  { path: '/track', label: 'Track & Trace', icon: GitBranch },
  { path: '/inspection', label: 'Inspections', icon: ClipboardCheck },
  { path: '/cases', label: 'Cases', icon: AlertTriangle },
  { path: '/verification', label: 'Verification', icon: ShieldCheck },
  { path: '/reports', label: 'Reports', icon: BarChart2 },
]

const operatorNavItems = [
  { path: '/mark-orders', label: 'My Mark Orders', icon: ShoppingCart },
  { path: '/products', label: 'My Products', icon: Package },
  { path: '/operators', label: 'My Profile', icon: Building2 },
]

const pageTitles = {
  '/': 'Dashboard', '/operators': 'Economic Operators', '/mark-orders': 'Mark Orders',
  '/products': 'Product Registry', '/marks': 'Government Marks',
  '/track': 'Track & Trace', '/inspection': 'Inspections', '/cases': 'Case Management',
  '/verification': 'Product Verification', '/reports': 'Reports & Analytics',
}

const SIDEBAR_BG = '#0A2A0A'

export default function Layout({ children }) {
  const { currentAgency, currentUser, setCurrentAgency, setCurrentUser } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const agencyColor = currentAgency?.color || '#006600'
  const pageTitle = pageTitles[location.pathname] || 'IPMAS'
  const isOperator = currentUser?.userType === 'operator'

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
      {/* Kenya flag stripe */}
      <div className="flex-shrink-0" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '5px', backgroundColor: '#0F0F0F' }} />
        <div style={{ height: '4px', backgroundColor: '#BB0000' }} />
        <div style={{ height: '7px', backgroundColor: '#006600' }} />
      </div>

      <div className="px-4 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#006600' }}>
              <svg viewBox="0 0 72 84" width="18" height="21">
                <defs><clipPath id="sl"><path d="M4,4 H68 V52 Q68,80 36,80 Q4,80 4,52 Z"/></clipPath></defs>
                <rect x="4" y="4" width="64" height="24" fill="#0F0F0F" clipPath="url(#sl)"/>
                <rect x="4" y="28" width="64" height="24" fill="#BB0000" clipPath="url(#sl)"/>
                <rect x="4" y="52" width="64" height="28" fill="#006600" clipPath="url(#sl)"/>
                <line x1="36" y1="4" x2="36" y2="80" stroke="white" strokeWidth="3" clipPath="url(#sl)"/>
                <path d="M4,4 H68 V52 Q68,80 36,80 Q4,80 4,52 Z" fill="none" stroke="white" strokeWidth="3"/>
              </svg>
            </div>
            <div>
              <div className="text-white font-bold leading-tight" style={{ fontFamily: 'Georgia, Cambria, serif', fontSize: '1.05rem', letterSpacing: '-0.01em' }}>IPMAS</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.38)', letterSpacing: '0.06em', fontSize: '0.6rem', textTransform: 'uppercase' }}>
                {isOperator ? 'Operator Portal' : 'Gov. of Kenya'}
              </div>
            </div>
          </div>
          <button onClick={closeSidebar} className="md:hidden p-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <X size={20} />
          </button>
        </div>

        {isOperator ? (
          <div className="rounded-md px-3 py-2 text-xs" style={{ backgroundColor: 'rgba(230,81,0,0.2)', border: '1px solid rgba(230,81,0,0.35)' }}>
            <div className="font-semibold text-white text-xs truncate">🏢 {currentUser?.company}</div>
            <div className="truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>
              {currentUser?.operatorType} · Licensed under {agencyColor && currentAgency?.shortName}
            </div>
          </div>
        ) : (
          <div className="rounded-md px-3 py-2 text-xs" style={{ backgroundColor: agencyColor + '25', border: `1px solid ${agencyColor}50` }}>
            <div className="font-semibold text-white text-xs">{currentAgency?.icon} {currentAgency?.shortName}</div>
            <div className="truncate mt-0.5" style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.65rem' }}>{currentAgency?.name}</div>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {(isOperator ? operatorNavItems : agencyNavItems).map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} end={path === '/'}
            onClick={closeSidebar}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`
            }
            style={({ isActive }) => isActive
              ? { backgroundColor: agencyColor }
              : { '--tw-bg-opacity': 1 }}
            onMouseOver={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)' }}
            onMouseOut={e => { if (!e.currentTarget.style.backgroundColor?.includes(agencyColor)) e.currentTarget.style.backgroundColor = '' }}>
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: agencyColor }}>
            {currentUser?.name?.[0] || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">{currentUser?.name || 'User'}</div>
            <div className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{currentUser?.role}</div>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors"
          style={{ color: 'rgba(255,255,255,0.4)' }}
          onMouseOver={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'white' }}
          onMouseOut={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}>
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
        style={{ backgroundColor: SIDEBAR_BG }}
      >
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white px-4 md:px-6 py-3 md:py-4 flex items-center justify-between flex-shrink-0" style={{ borderBottom: '1px solid #e5e7eb', borderTop: '3px solid #006600' }}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
            <div>
              <div className="text-xs text-gray-400 mb-0.5 hidden sm:block">
                IPMAS / {currentAgency?.shortName}{isOperator && ` · ${currentUser?.company}`}
              </div>
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
