import { useState } from 'react'
import { Briefcase, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react'
import Header from '../components/layout/Header'
import StatusBadge from '../components/common/StatusBadge'
import Modal from '../components/common/Modal'
import { useApp } from '../context/AppContext'

import { cases } from '../data/mockData'

const ITEMS = 8

const priorityColors = { Critical:'bg-red-100 text-red-700', High:'bg-orange-100 text-orange-700', Medium:'bg-amber-100 text-amber-700', Low:'bg-gray-100 text-gray-600' }

export default function Cases() {
  const { currentAgency } = useApp()
  const agency = currentAgency
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPriority, setFilterPriority] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)

  const filtered = cases.filter(c =>
    (!filterStatus || c.status === filterStatus) &&
    (!filterPriority || c.priority === filterPriority)
  )
  const totalPages = Math.ceil(filtered.length / ITEMS)
  const pageItems = filtered.slice((page-1)*ITEMS, page*ITEMS)

  const totalValue = cases.reduce((s, c) => s + c.value, 0)
  const active = cases.filter(c => c.status !== 'Closed' && c.status !== 'Acquitted').length

  return (
    <div className="flex flex-col flex-1">
      <Header title="Case Management" subtitle="ACA enforcement cases — seizures, IP violations, prosecution tracking" />
      <main className="flex-1 p-8">

        {/* Priority KPIs */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          {[
            { label:'Critical Cases', value: cases.filter(c => c.priority === 'Critical').length, color:'#BB0000', bg:'bg-red-50' },
            { label:'High Priority', value: cases.filter(c => c.priority === 'High').length, color:'#c2410c', bg:'bg-orange-50' },
            { label:'Total Active', value: active, color:'#003087', bg:'bg-blue-50' },
            { label:'Total Value Seized', value:`KES ${(totalValue/1000000).toFixed(1)}M`, color:'#006600', bg:'bg-green-50' },
          ].map(k => (
            <div key={k.label} className={`rounded-xl shadow-sm border border-gray-100 p-5 ${k.bg}`}>
              <div className="text-xs text-gray-500 font-medium mb-1">{k.label}</div>
              <div className="text-2xl font-bold" style={{ color: k.color }}>{k.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              <option value="">All Statuses</option>
              {['Open','Under Investigation','Prosecution','Closed','Acquitted'].map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={filterPriority} onChange={e => { setFilterPriority(e.target.value); setPage(1) }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              <option value="">All Priorities</option>
              {['Critical','High','Medium','Low'].map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Case ID','Date','Type','Brand / Target','Suspect','County','Qty Seized','Value (KES)','Priority','Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pageItems.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(c)}>
                    <td className="px-4 py-3 text-xs font-mono font-medium text-red-700">{c.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.dateOpened}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{c.type}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{c.brand}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{c.suspect}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{c.county}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-700">{c.quantitySeized.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm font-mono font-medium text-gray-900">{c.value.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColors[c.priority]}`}>{c.priority}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Showing {(page-1)*ITEMS+1}–{Math.min(page*ITEMS, filtered.length)} of {filtered.length}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p-1)} className="p-1.5 rounded border border-gray-200 disabled:opacity-40"><ChevronLeft size={14} /></button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p+1)} className="p-1.5 rounded border border-gray-200 disabled:opacity-40"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>
      </main>

      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Case ${selected.id}`} size="lg">
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
              <div>
                <div className="font-semibold text-red-700">{selected.type} — {selected.brand}</div>
                <div className="text-red-600 text-xs mt-0.5">{selected.description}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Case ID', selected.id], ['Date Opened', selected.dateOpened],
                ['Suspect', selected.suspect], ['County', selected.county],
                ['Inspector', selected.inspector], ['Priority', selected.priority],
                ['Status', selected.status], ['Quantity Seized', selected.quantitySeized.toLocaleString() + ' units'],
                ['Value Seized', 'KES ' + selected.value.toLocaleString()], ['Type', selected.type],
              ].map(([k, v]) => (
                <div key={k}><div className="text-xs text-gray-500">{k}</div><div className="font-medium text-gray-900">{v}</div></div>
              ))}
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-2">Case Timeline</div>
              <div className="space-y-2">
                {[
                  { date: selected.dateOpened, action:'Case opened — initial report received', status:'done' },
                  { date: selected.dateOpened, action:'Evidence collected and documented', status: selected.status !== 'Open' ? 'done' : 'pending' },
                  { date:'', action:'Under investigation — field team deployed', status: ['Under Investigation','Prosecution','Closed'].includes(selected.status) ? 'done' : 'pending' },
                  { date:'', action:'Prosecution file submitted to DPP', status: ['Prosecution','Closed'].includes(selected.status) ? 'done' : 'pending' },
                  { date:'', action:'Case resolved / closed', status: selected.status === 'Closed' ? 'done' : 'pending' },
                ].map((ev, i) => (
                  <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg ${ev.status === 'done' ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <div className={`w-4 h-4 rounded-full flex-shrink-0 mt-0.5 ${ev.status === 'done' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div>
                      <div className={`text-sm ${ev.status === 'done' ? 'text-gray-900' : 'text-gray-400'}`}>{ev.action}</div>
                      {ev.date && <div className="text-xs text-gray-400">{ev.date}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
