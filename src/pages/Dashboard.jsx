import { useApp } from '../context/AppContext.jsx'
import { kpis, chartData, recentActivity } from '../data/mockData.js'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Plus, FileText, Search, ClipboardCheck, Bell, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function activityIcon(type) {
  if (type === 'alert') return <AlertTriangle size={14} className="text-red-500" />
  if (type === 'issue') return <CheckCircle size={14} className="text-green-500" />
  if (type === 'report') return <FileText size={14} className="text-blue-500" />
  return <Bell size={14} className="text-amber-500" />
}

export default function Dashboard() {
  const { currentAgency, currentUser } = useApp()
  const navigate = useNavigate()
  const agencyKpis = kpis[currentAgency?.id] || {}
  const activity = recentActivity[currentAgency?.id] || []
  const agencyColor = currentAgency?.color || '#003087'

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const statCards = [
    { label: agencyKpis.primaryLabel, value: agencyKpis.primary, color: agencyColor },
    { label: agencyKpis.secondaryLabel, value: agencyKpis.secondary, color: '#059669' },
    { label: agencyKpis.tertiaryLabel, value: agencyKpis.tertiary, color: '#d97706' },
    { label: agencyKpis.quaternaryLabel, value: agencyKpis.quaternary, color: '#7c3aed' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{greeting}, {currentUser?.name}</h2>
          <p className="text-gray-500 text-sm mt-0.5">{currentAgency?.name} — {currentUser?.role}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/verification')} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            <Search size={16} /> Verify Product
          </button>
          <button onClick={() => navigate('/inspection')} className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm hover:opacity-90" style={{ backgroundColor: agencyColor }}>
            <Plus size={16} /> New Inspection
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">{card.label}</div>
            <div className="text-2xl font-bold" style={{ color: card.color }}>{card.value}</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <TrendingUp size={12} /> <span>Updated today</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-3 gap-6">
        {/* Area Chart */}
        <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Marks Issued by Agency</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData.monthlyMarks} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorKRA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#003087" stopOpacity={0.3}/><stop offset="95%" stopColor="#003087" stopOpacity={0}/></linearGradient>
                <linearGradient id="colorKEBS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#006600" stopOpacity={0.3}/><stop offset="95%" stopColor="#006600" stopOpacity={0}/></linearGradient>
                <linearGradient id="colorPPB" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1a5276" stopOpacity={0.3}/><stop offset="95%" stopColor="#1a5276" stopOpacity={0}/></linearGradient>
                <linearGradient id="colorKEPHIS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#228B22" stopOpacity={0.3}/><stop offset="95%" stopColor="#228B22" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
              <Tooltip formatter={(v) => v.toLocaleString()} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="KRA" stroke="#003087" fill="url(#colorKRA)" strokeWidth={2} />
              <Area type="monotone" dataKey="KEBS" stroke="#006600" fill="url(#colorKEBS)" strokeWidth={2} />
              <Area type="monotone" dataKey="PPB" stroke="#1a5276" fill="url(#colorPPB)" strokeWidth={2} />
              <Area type="monotone" dataKey="KEPHIS" stroke="#228B22" fill="url(#colorKEPHIS)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {activity.map((item, i) => (
              <div key={i} className="flex gap-2">
                <div className="mt-0.5">{activityIcon(item.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-900">{item.action}</div>
                  <div className="text-xs text-gray-500 truncate">{item.detail}</div>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5"><Clock size={10} />{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Register Product', desc: 'Add new product to registry', icon: Plus, path: '/products' },
          { label: 'Issue Marks', desc: 'Issue marks to manufacturer', icon: FileText, path: '/marks' },
          { label: 'New Inspection', desc: 'Schedule field inspection', icon: ClipboardCheck, path: '/inspection' },
          { label: 'Verify Product', desc: 'Check mark authenticity', icon: Search, path: '/verification' },
        ].map((action, i) => (
          <button key={i} onClick={() => navigate(action.path)} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-left hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: agencyColor + '15' }}>
              <action.icon size={16} style={{ color: agencyColor }} />
            </div>
            <div className="text-sm font-semibold text-gray-900">{action.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{action.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
