import { TrendingUp, TrendingDown, Clock, AlertTriangle, CheckCircle, FileText, Package } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Header from '../components/layout/Header'
import { useApp } from '../context/AppContext'

import { kpis, recentActivity, chartData } from '../data/mockData'

const activityIcons = {
  issue: <CheckCircle size={14} className="text-green-500" />,
  alert: <AlertTriangle size={14} className="text-red-500" />,
  report: <FileText size={14} className="text-blue-500" />,
  register: <Package size={14} className="text-purple-500" />,
  forecast: <TrendingUp size={14} className="text-orange-500" />,
}

export default function Dashboard() {
  const { currentAgency, currentUser } = useApp()
  const agency = currentAgency
  const myKpis = kpis[currentAgency?.id] || []
  const myActivity = recentActivity[currentAgency?.id] || []

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col flex-1">
      <Header title="Dashboard" subtitle={`${greeting}, ${currentUser?.name} — ${agency?.name}`} />
      <main className="flex-1 p-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          {myKpis.map((kpi, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="text-xs text-gray-500 font-medium mb-2">{kpi.label}</div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{kpi.value}</div>
              <div className={`flex items-center gap-1 text-xs font-medium ${kpi.up ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {kpi.change} vs last month
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Chart */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-gray-900">Marks Issued — Monthly Trend</h3>
                <p className="text-xs text-gray-500 mt-0.5">All agencies • Last 12 months</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData.monthlyMarks} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gKRA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#003087" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#003087" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gPPB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1a5276" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#1a5276" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                <Tooltip formatter={(v, n) => [v.toLocaleString(), n]} />
                <Legend />
                <Area type="monotone" dataKey="KRA" stroke="#003087" fill="url(#gKRA)" strokeWidth={2} />
                <Area type="monotone" dataKey="PPB" stroke="#1a5276" fill="url(#gPPB)" strokeWidth={2} />
                <Area type="monotone" dataKey="KEPHIS" stroke="#228B22" fill="none" strokeWidth={2} strokeDasharray="4 2" />
                <Area type="monotone" dataKey="KEBS" stroke="#006600" fill="none" strokeWidth={2} strokeDasharray="4 2" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Feed */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {myActivity.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="mt-0.5 flex-shrink-0">{activityIcons[item.type]}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">{item.action}</div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-snug">{item.detail}</div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                      <Clock size={10} /> {item.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            {[
              'Issue Government Marks', 'Register New Product', 'Schedule Inspection',
              'Verify Product', 'Generate Report', 'Submit Forecast'
            ].map(action => (
              <button key={action}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 hover:shadow-sm transition-all text-gray-700 hover:text-white"
                style={{ }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = agency?.color; e.currentTarget.style.borderColor = agency?.color; e.currentTarget.style.color = 'white' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.color = '#374151' }}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
