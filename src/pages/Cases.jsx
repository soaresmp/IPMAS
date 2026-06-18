import { useState } from 'react'
import { cases } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import { AlertTriangle, X } from 'lucide-react'

function priorityBadge(p) {
  const map = { Critical: 'bg-red-100 text-red-800', High: 'bg-orange-100 text-orange-800', Medium: 'bg-amber-100 text-amber-800', Low: 'bg-gray-100 text-gray-800' }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[p] || 'bg-gray-100 text-gray-800'}`}>{p}</span>
}

function statusBadge(s) {
  const map = { 'Under Investigation': 'bg-blue-100 text-blue-800', Prosecution: 'bg-purple-100 text-purple-800', Closed: 'bg-gray-100 text-gray-800', Open: 'bg-orange-100 text-orange-800' }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[s] || 'bg-gray-100 text-gray-800'}`}>{s}</span>
}

function fmt(n) { return 'KES ' + n.toLocaleString() }

export default function Cases() {
  const { currentAgency } = useApp()
  const agencyColor = currentAgency?.color || '#003087'
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [countyFilter, setCountyFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [selected, setSelected] = useState(null)

  const types = [...new Set(cases.map(c => c.type))].sort()
  const counties = [...new Set(cases.map(c => c.county))].sort()

  const filtered = cases.filter(c =>
    (!typeFilter || c.type === typeFilter)
    && (!statusFilter || c.status === statusFilter)
    && (!countyFilter || c.county === countyFilter)
    && (!priorityFilter || c.priority === priorityFilter)
  )

  const priorityCounts = { Critical: 0, High: 0, Medium: 0, Low: 0 }
  cases.forEach(c => { priorityCounts[c.priority] = (priorityCounts[c.priority] || 0) + 1 })

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Enforcement Cases</h2>
        <p className="text-gray-500 text-sm">Counterfeit, IP violation, and smuggling cases</p>
      </div>

      {/* Priority summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {[['Critical', 'bg-red-50 border-red-200 text-red-900'], ['High', 'bg-orange-50 border-orange-200 text-orange-900'], ['Medium', 'bg-amber-50 border-amber-200 text-amber-900'], ['Low', 'bg-gray-50 border-gray-200 text-gray-900']].map(([p, cls]) => (
          <div key={p} className={`rounded-xl p-4 border ${cls} cursor-pointer hover:shadow-md transition-shadow`} onClick={() => setPriorityFilter(priorityFilter === p ? '' : p)}>
            <div className="text-2xl font-bold">{priorityCounts[p] || 0}</div>
            <div className="text-sm font-medium">{p} Priority</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Types</option>
          {types.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Statuses</option>
          {['Under Investigation','Prosecution','Open','Closed'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={countyFilter} onChange={e => setCountyFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Counties</option>
          {counties.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Priorities</option>
          {['Critical','High','Medium','Low'].map(p => <option key={p}>{p}</option>)}
        </select>
        {(typeFilter || statusFilter || countyFilter || priorityFilter) && (
          <button onClick={() => { setTypeFilter(''); setStatusFilter(''); setCountyFilter(''); setPriorityFilter('') }} className="px-3 py-2 text-gray-600 text-sm underline">Clear filters</button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 text-sm text-gray-500">Showing {filtered.length} of {cases.length} cases</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                {['Case ID','Date','Type','Brand','Suspect','County','Qty Seized','Est. Value','Priority','Status','Inspector','Actions'].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(c)}>
                  <td className="px-3 py-3 font-mono text-xs text-blue-600 font-medium">{c.id}</td>
                  <td className="px-3 py-3 text-gray-600 text-xs">{c.dateOpened}</td>
                  <td className="px-3 py-3 text-gray-900 text-xs">{c.type}</td>
                  <td className="px-3 py-3 font-medium text-gray-900">{c.brand}</td>
                  <td className="px-3 py-3 text-gray-600 max-w-32 truncate text-xs">{c.suspect}</td>
                  <td className="px-3 py-3 text-gray-600">{c.county}</td>
                  <td className="px-3 py-3 text-gray-900">{c.quantitySeized.toLocaleString()}</td>
                  <td className="px-3 py-3 text-gray-900 font-medium whitespace-nowrap">{fmt(c.value)}</td>
                  <td className="px-3 py-3">{priorityBadge(c.priority)}</td>
                  <td className="px-3 py-3">{statusBadge(c.status)}</td>
                  <td className="px-3 py-3 text-gray-600 text-xs whitespace-nowrap">{c.inspector}</td>
                  <td className="px-3 py-3 text-blue-600 text-xs">View</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{selected.id}</h3>
                <div className="flex gap-2 mt-1">{priorityBadge(selected.priority)}{statusBadge(selected.status)}</div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              {[['Date Opened', selected.dateOpened], ['Type', selected.type], ['Brand', selected.brand], ['County', selected.county], ['Suspect', selected.suspect], ['Inspector', selected.inspector], ['Qty Seized', selected.quantitySeized.toLocaleString()], ['Est. Value', fmt(selected.value)]].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs text-gray-500 mb-0.5">{k}</div>
                  <div className="font-medium text-gray-900">{v}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="text-xs font-semibold text-gray-500 mb-1 uppercase">Description</div>
              <p className="text-sm text-gray-700 bg-gray-50 rounded p-3">{selected.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
