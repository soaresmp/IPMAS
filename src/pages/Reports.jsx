import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Download, FileText } from 'lucide-react'
import Header from '../components/layout/Header'
import { useApp } from '../context/AppContext'

import { chartData } from '../data/mockData'

const PIE_COLORS = ['#003087','#006600','#228B22','#1a5276','#BB0000','#7c3aed']

export default function Reports() {
  const { currentAgency } = useApp()
  const agency = currentAgency
  const [tab, setTab] = useState('overview')

  return (
    <div className="flex flex-col flex-1">
      <Header title="Reports & Analytics" subtitle="Cross-agency performance metrics and compliance data" />
      <main className="flex-1 p-8">

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1 bg-white rounded-xl border border-gray-100 p-1 shadow-sm">
            {[['overview','Overview'],['trends','Trends'],['enforcement','Enforcement']].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === k ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                style={tab === k ? { backgroundColor: agency?.color || '#003087' } : {}}>
                {l}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => alert('Generating CSV export…')}
              className="flex items-center gap-2 px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Download size={14} /> Export CSV
            </button>
            <button onClick={() => alert('Generating PDF report…')}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white rounded-lg"
              style={{ backgroundColor: agency?.color || '#003087' }}>
              <FileText size={14} /> Export PDF
            </button>
          </div>
        </div>

        {tab === 'overview' && (
          <div className="space-y-6">
            {/* Compliance */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-1">Compliance Rate by Agency</h3>
              <p className="text-xs text-gray-400 mb-5">Actual vs. target compliance rate — current period</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData.complianceByAgency} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="agency" tick={{ fontSize: 12 }} />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={v => [`${v}%`]} />
                  <Legend />
                  <Bar dataKey="rate" name="Actual" radius={[4,4,0,0]}>
                    {chartData.complianceByAgency.map((_, i) => (
                      <Cell key={i} fill={['#003087','#006600','#BB0000','#228B22','#1a5276'][i]} />
                    ))}
                  </Bar>
                  <Bar dataKey="target" name="Target" fill="#e5e7eb" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Category breakdown */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-1">Products by Category</h3>
                <p className="text-xs text-gray-400 mb-4">Share of registered products</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={chartData.productCategories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                      {chartData.productCategories.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={v => [`${v}%`]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Non-compliant counties */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-1">Top Non-Compliant Counties</h3>
                <p className="text-xs text-gray-400 mb-4">Number of non-compliance incidents</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData.nonCompliantCounties} layout="vertical" barSize={14}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="county" type="category" width={80} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" name="Incidents" fill={agency?.color || '#003087'} radius={[0,4,4,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {tab === 'trends' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-1">Monthly Marks Issued — All Agencies</h3>
              <p className="text-xs text-gray-400 mb-5">Government of Kenya Marks issued per agency — last 12 months</p>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.monthlyMarks}>
                  <defs>
                    {[['KRA','#003087'],['PPB','#1a5276'],['KEPHIS','#228B22'],['KEBS','#006600']].map(([k, c]) => (
                      <linearGradient key={k} id={`g${k}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={c} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={c} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                  <Tooltip formatter={(v, n) => [v.toLocaleString() + ' marks', n]} />
                  <Legend />
                  <Area type="monotone" dataKey="KRA" stroke="#003087" fill="url(#gKRA)" strokeWidth={2} />
                  <Area type="monotone" dataKey="PPB" stroke="#1a5276" fill="url(#gPPB)" strokeWidth={2} />
                  <Area type="monotone" dataKey="KEPHIS" stroke="#228B22" fill="url(#gKEPHIS)" strokeWidth={2} />
                  <Area type="monotone" dataKey="KEBS" stroke="#006600" fill="url(#gKEBS)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {tab === 'enforcement' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-1">Monthly Seizures & Enforcement Activity</h3>
              <p className="text-xs text-gray-400 mb-5">ACA enforcement cases and value seized — last 12 months</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.monthlySeizures}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                  <Tooltip formatter={(v, n) => n === 'cases' ? [v + ' cases', 'Seizure Cases'] : [`KES ${v.toLocaleString()}`, 'Value Seized']} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="cases" name="cases" fill="#BB0000" radius={[4,4,0,0]} />
                  <Bar yAxisId="right" dataKey="value" name="value" fill="#003087" radius={[4,4,0,0]} opacity={0.7} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-5">
              {[
                { label:'Total Cases (YTD)', value:'234', sub:'↑ 8.3% vs last year', color:'#BB0000' },
                { label:'Value Seized (KES)', value:'49.8M', sub:'↑ 22.1% vs last year', color:'#003087' },
                { label:'Conviction Rate', value:'78.4%', sub:'↑ 4.2% vs last year', color:'#006600' },
              ].map(k => (
                <div key={k.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                  <div className="text-xs text-gray-500 mb-1">{k.label}</div>
                  <div className="text-3xl font-bold" style={{ color: k.color }}>{k.value}</div>
                  <div className="text-xs text-green-600 mt-1">{k.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
