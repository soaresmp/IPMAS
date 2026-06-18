import { useState } from 'react'
import { chartData } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Download, FileText } from 'lucide-react'

const PIE_COLORS = ['#003087', '#006600', '#BB0000', '#228B22', '#1a5276', '#d97706']

export default function Reports() {
  const { currentAgency } = useApp()
  const agencyColor = currentAgency?.color || '#003087'
  const [dateFrom, setDateFrom] = useState('2023-04-01')
  const [dateTo, setDateTo] = useState('2024-03-31')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analytics &amp; Reports</h2>
          <p className="text-gray-500 text-sm">System-wide performance metrics and enforcement data</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">From:</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">To:</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none" />
          </div>
          <button onClick={() => alert('Exporting CSV...')} className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            <Download size={14} /> CSV
          </button>
          <button onClick={() => alert('Generating PDF report...')} className="flex items-center gap-2 px-3 py-2 text-white rounded-lg text-sm hover:opacity-90" style={{ backgroundColor: agencyColor }}>
            <FileText size={14} /> PDF
          </button>
        </div>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Monthly Marks */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Marks Issued by Agency</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={chartData.monthlyMarks} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="rptKRA" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#003087" stopOpacity={0.3}/><stop offset="95%" stopColor="#003087" stopOpacity={0}/></linearGradient>
                <linearGradient id="rptKEBS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#006600" stopOpacity={0.3}/><stop offset="95%" stopColor="#006600" stopOpacity={0}/></linearGradient>
                <linearGradient id="rptPPB" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1a5276" stopOpacity={0.3}/><stop offset="95%" stopColor="#1a5276" stopOpacity={0}/></linearGradient>
                <linearGradient id="rptKEPHIS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#228B22" stopOpacity={0.3}/><stop offset="95%" stopColor="#228B22" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => v.toLocaleString()} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="KRA" stroke="#003087" fill="url(#rptKRA)" strokeWidth={2} />
              <Area type="monotone" dataKey="KEBS" stroke="#006600" fill="url(#rptKEBS)" strokeWidth={2} />
              <Area type="monotone" dataKey="PPB" stroke="#1a5276" fill="url(#rptPPB)" strokeWidth={2} />
              <Area type="monotone" dataKey="KEPHIS" stroke="#228B22" fill="url(#rptKEPHIS)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Compliance by Agency */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Compliance Rate by Agency</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData.complianceByAgency} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="agency" tick={{ fontSize: 12 }} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="rate" name="Compliance Rate" fill="#16a34a" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" name="Target" fill="#d1d5db" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Product Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Product Categories Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={chartData.productCategories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                {chartData.productCategories.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Non-Compliant by County */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Non-Compliant Products by County</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData.nonCompliantCounties} layout="vertical" margin={{ top: 5, right: 20, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="county" type="category" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" name="Non-Compliant" fill="#dc2626" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seizures chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Monthly Enforcement Seizures (Cases &amp; Estimated Value)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chartData.monthlySeizures} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
            <Tooltip formatter={(v, n) => n === 'value' ? `KES ${v.toLocaleString()}` : v} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar yAxisId="left" dataKey="cases" name="Cases" fill="#BB0000" radius={[4, 4, 0, 0]} />
            <Bar yAxisId="right" dataKey="value" name="Est. Value (KES)" fill="#d97706" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
