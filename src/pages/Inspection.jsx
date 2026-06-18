import { useState } from 'react'
import { Plus, ClipboardCheck, ChevronLeft, ChevronRight } from 'lucide-react'
import Header from '../components/layout/Header'
import StatusBadge from '../components/common/StatusBadge'
import Modal from '../components/common/Modal'
import { useApp } from '../context/AppContext'

import { inspections, counties } from '../data/mockData'

const ITEMS = 8
const agencyColors = { KRA:'#003087', KEBS:'#006600', ACA:'#BB0000', KEPHIS:'#228B22', PPB:'#1a5276' }

export default function Inspection() {
  const { currentAgency } = useApp()
  const agency = currentAgency
  const [filterAgency, setFilterAgency] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(null)

  const filtered = inspections.filter(i =>
    (!filterAgency || i.inspectorAgency === filterAgency) &&
    (!filterStatus || i.status === filterStatus) &&
    (!filterType || i.type === filterType)
  )
  const totalPages = Math.ceil(filtered.length / ITEMS)
  const pageItems = filtered.slice((page-1)*ITEMS, page*ITEMS)

  const completed = inspections.filter(i => i.status === 'Completed')
  const totalChecked = completed.reduce((s, i) => s + i.productsChecked, 0)
  const totalNonCompliant = completed.reduce((s, i) => s + i.nonCompliant, 0)

  return (
    <div className="flex flex-col flex-1">
      <Header title="Inspections & Enforcement" subtitle="Schedule, track and record field inspections across all counties" />
      <main className="flex-1 p-8">

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          {[
            { label:'Total This Month', value: inspections.length, color: agency?.color || '#003087' },
            { label:'Scheduled', value: inspections.filter(i => i.status === 'Scheduled').length, color: '#1a5276' },
            { label:'Completed', value: completed.length, color: '#006600' },
            { label:'Non-Compliant Found', value: totalNonCompliant, color: '#BB0000' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="text-xs text-gray-500 font-medium mb-1">{s.label}</div>
              <div className="text-3xl font-bold" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
            <select value={filterAgency} onChange={e => { setFilterAgency(e.target.value); setPage(1) }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              <option value="">All Agencies</option>
              {['KRA','KEBS','ACA','KEPHIS','PPB'].map(a => <option key={a}>{a}</option>)}
            </select>
            <select value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1) }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              <option value="">All Types</option>
              {['Routine','Targeted','Joint','Consumer Report'].map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              <option value="">All Statuses</option>
              {['Scheduled','Completed'].map(s => <option key={s}>{s}</option>)}
            </select>
            <div className="flex-1" />
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ backgroundColor: agency?.color || '#003087' }}>
              <Plus size={15} /> New Inspection
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['ID','Date','Inspector','Agency','County','Type','Location','Checked','Compliant','Non-Compliant','Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pageItems.map(ins => (
                  <tr key={ins.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(ins)}>
                    <td className="px-4 py-3 text-xs font-mono text-gray-500">{ins.id}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{ins.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{ins.inspector}</td>
                    <td className="px-4 py-3">
                      <span className="px-1.5 py-0.5 rounded text-xs font-semibold text-white" style={{ backgroundColor: agencyColors[ins.inspectorAgency] }}>{ins.inspectorAgency}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{ins.county}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ins.type === 'Joint' ? 'bg-purple-100 text-purple-700' : ins.type === 'Targeted' ? 'bg-orange-100 text-orange-700' : ins.type === 'Consumer Report' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                        {ins.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{ins.location}</td>
                    <td className="px-4 py-3 text-sm font-mono text-gray-700">{ins.productsChecked || '—'}</td>
                    <td className="px-4 py-3 text-sm font-mono text-green-600">{ins.compliant || '—'}</td>
                    <td className="px-4 py-3 text-sm font-mono text-red-600 font-semibold">{ins.nonCompliant || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={ins.status} /></td>
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

      {/* New Inspection Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Schedule New Inspection">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Inspector Name</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="e.g. James Mwangi" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">County</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                <option value="">Select county…</option>
                {counties.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Inspection Type</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
                {['Routine','Targeted','Joint','Consumer Report'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Location / Premises</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" placeholder="e.g. Nairobi CBD Retail Cluster" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Joint Agencies (optional)</label>
            <div className="flex flex-wrap gap-2">
              {['KRA','KEBS','ACA','KEPHIS','PPB'].map(a => (
                <label key={a} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="font-medium" style={{ color: agencyColors[a] }}>{a}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg">Cancel</button>
            <button onClick={() => { alert('Inspection scheduled.'); setShowModal(false) }}
              className="px-5 py-2 text-sm text-white rounded-lg font-medium" style={{ backgroundColor: agency?.color || '#003087' }}>
              Schedule
            </button>
          </div>
        </div>
      </Modal>

      {/* Detail Modal */}
      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={`Inspection ${selected.id}`} size="lg">
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4">
              {[
                ['Inspector', selected.inspector], ['Agency', selected.inspectorAgency],
                ['Date', selected.date], ['County', selected.county],
                ['Type', selected.type], ['Status', selected.status],
                ['Location', selected.location], ['Products Checked', selected.productsChecked || 'N/A'],
              ].map(([k, v]) => (
                <div key={k}><div className="text-xs text-gray-500">{k}</div><div className="font-medium text-gray-900">{v}</div></div>
              ))}
            </div>
            {selected.status === 'Completed' && (
              <div>
                <div className="text-xs text-gray-500 mb-2">Compliance Summary</div>
                <div className="flex gap-4">
                  <div className="flex-1 bg-green-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-600">{selected.compliant}</div>
                    <div className="text-xs text-green-600">Compliant</div>
                  </div>
                  <div className="flex-1 bg-red-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-red-600">{selected.nonCompliant}</div>
                    <div className="text-xs text-red-600">Non-Compliant</div>
                  </div>
                  <div className="flex-1 bg-blue-50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-blue-600">{selected.productsChecked}</div>
                    <div className="text-xs text-blue-600">Total Checked</div>
                  </div>
                </div>
              </div>
            )}
            {selected.findings && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Findings & Actions</div>
                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-gray-700">{selected.findings}</div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  )
}
