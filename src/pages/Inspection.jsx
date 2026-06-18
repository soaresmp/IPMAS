import { useState } from 'react'
import { inspections } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import { Plus, X, ClipboardCheck, Calendar, CheckCircle, AlertTriangle } from 'lucide-react'

const AGENCY_COLORS = { KRA: '#003087', KEBS: '#006600', ACA: '#BB0000', KEPHIS: '#228B22', PPB: '#1a5276' }

function statusBadge(status) {
  const map = { Completed: 'bg-green-100 text-green-800', Scheduled: 'bg-amber-100 text-amber-800', 'In Progress': 'bg-blue-100 text-blue-800' }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>
}

export default function Inspection() {
  const { currentAgency } = useApp()
  const agencyColor = currentAgency?.color || '#003087'
  const [agencyFilter, setAgencyFilter] = useState('')
  const [countyFilter, setCountyFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState(null)

  const counties = [...new Set(inspections.map(i => i.county))].sort()
  const types = [...new Set(inspections.map(i => i.type))].sort()

  const filtered = inspections.filter(i => {
    return (!agencyFilter || i.inspectorAgency === agencyFilter)
      && (!countyFilter || i.county === countyFilter)
      && (!typeFilter || i.type === typeFilter)
      && (!statusFilter || i.status === statusFilter)
  })

  const completed = inspections.filter(i => i.status === 'Completed')
  const scheduled = inspections.filter(i => i.status === 'Scheduled')
  const totalNonCompliant = completed.reduce((s, i) => s + i.nonCompliant, 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Inspection Management</h2>
          <p className="text-gray-500 text-sm">Field inspections across all agencies and counties</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm hover:opacity-90 self-start" style={{ backgroundColor: agencyColor }}>
          <Plus size={16} /> New Inspection
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {[
          ['Total This Month', inspections.length, 'bg-blue-50 text-blue-800', ClipboardCheck],
          ['Scheduled', scheduled.length, 'bg-amber-50 text-amber-800', Calendar],
          ['Completed', completed.length, 'bg-green-50 text-green-800', CheckCircle],
          ['Non-Compliant Found', totalNonCompliant, 'bg-red-50 text-red-800', AlertTriangle],
        ].map(([label, val, cls, Icon]) => (
          <div key={label} className={`rounded-xl p-4 flex items-center gap-3 ${cls}`}>
            <Icon size={20} className="opacity-60" />
            <div>
              <div className="text-2xl font-bold">{val}</div>
              <div className="text-xs font-medium">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <select value={agencyFilter} onChange={e => setAgencyFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Agencies</option>
          {['KRA','KEBS','ACA','KEPHIS','PPB'].map(a => <option key={a}>{a}</option>)}
        </select>
        <select value={countyFilter} onChange={e => setCountyFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Counties</option>
          {counties.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Types</option>
          {types.map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Statuses</option>
          {['Completed','Scheduled','In Progress'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                {['ID','Date','Inspector','Agency','County','Type','Location','Checked','Compliant','Non-Compliant','Status','Actions'].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(ins => {
                const color = AGENCY_COLORS[ins.inspectorAgency] || '#666'
                return (
                  <tr key={ins.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(ins)}>
                    <td className="px-3 py-3 font-mono text-xs text-blue-600">{ins.id}</td>
                    <td className="px-3 py-3 text-gray-600 text-xs">{ins.date}</td>
                    <td className="px-3 py-3 font-medium text-gray-900 whitespace-nowrap">{ins.inspector}</td>
                    <td className="px-3 py-3"><span className="px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: color }}>{ins.inspectorAgency}</span></td>
                    <td className="px-3 py-3 text-gray-600">{ins.county}</td>
                    <td className="px-3 py-3 text-gray-600 text-xs">{ins.type}</td>
                    <td className="px-3 py-3 text-gray-600 max-w-40 truncate text-xs">{ins.location}</td>
                    <td className="px-3 py-3 text-gray-900 text-center">{ins.productsChecked}</td>
                    <td className="px-3 py-3 text-green-700 text-center font-medium">{ins.compliant}</td>
                    <td className="px-3 py-3 text-center font-medium" style={{ color: ins.nonCompliant > 0 ? '#dc2626' : '#16a34a' }}>{ins.nonCompliant}</td>
                    <td className="px-3 py-3">{statusBadge(ins.status)}</td>
                    <td className="px-3 py-3 text-blue-600 text-xs">Details</td>
                  </tr>
                )
              })}
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
                <h3 className="text-lg font-bold text-gray-900">Inspection {selected.id}</h3>
                <p className="text-sm text-gray-500">{selected.type} — {selected.county}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              {[['Date', selected.date], ['Inspector', selected.inspector], ['Agency', selected.inspectorAgency], ['County', selected.county], ['Type', selected.type], ['Status', selected.status], ['Products Checked', selected.productsChecked], ['Compliant', selected.compliant], ['Non-Compliant', selected.nonCompliant]].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs text-gray-500 mb-0.5">{k}</div>
                  <div className="font-medium text-gray-900">{k === 'Status' ? statusBadge(v) : v}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-3">
              <div className="text-xs font-semibold text-gray-500 mb-1 uppercase">Location</div>
              <p className="text-sm text-gray-900">{selected.location}</p>
            </div>
            {selected.findings && (
              <div className="border-t border-gray-100 pt-3 mt-3">
                <div className="text-xs font-semibold text-gray-500 mb-1 uppercase">Findings</div>
                <p className="text-sm text-gray-700 bg-gray-50 rounded p-3">{selected.findings}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
