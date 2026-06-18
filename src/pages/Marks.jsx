import { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, Shield } from 'lucide-react'
import Header from '../components/layout/Header'
import StatusBadge from '../components/common/StatusBadge'
import Modal from '../components/common/Modal'
import { useApp } from '../context/AppContext'

import { marks } from '../data/mockData'

const ITEMS = 10
const agencyColors = { KRA:'#003087', KEBS:'#006600', ACA:'#BB0000', KEPHIS:'#228B22', PPB:'#1a5276' }

export default function Marks() {
  const { currentAgency } = useApp()
  const agency = currentAgency
  const [tab, setTab] = useState('all')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)

  const filtered = marks.filter(m => tab === 'all' ? true : tab === 'active' ? m.status === 'Active' : m.status === 'Pending')
  const totalPages = Math.ceil(filtered.length / ITEMS)
  const pageItems = filtered.slice((page-1)*ITEMS, page*ITEMS)

  const totalIssued = marks.reduce((s, m) => s + m.quantity, 0)
  const totalApplied = marks.reduce((s, m) => s + m.applied, 0)
  const totalRemaining = totalIssued - totalApplied

  return (
    <div className="flex flex-col flex-1">
      <Header title="Government Mark Management" subtitle="Issuance, tracking and inventory of Government of Kenya Marks" />
      <main className="flex-1 p-8">

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-5 mb-6">
          {[
            { label:'Total Issued (All Time)', value: totalIssued.toLocaleString(), color:'#003087' },
            { label:'Applied to Products', value: totalApplied.toLocaleString(), color:'#006600' },
            { label:'Inventory Remaining', value: totalRemaining.toLocaleString(), color:'#228B22' },
            { label:'Active Permits', value: marks.filter(m => m.status === 'Active').length, color:'#1a5276' },
          ].map(c => (
            <div key={c.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} style={{ color: c.color }} />
                <span className="text-xs text-gray-500 font-medium">{c.label}</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{c.value}</div>
            </div>
          ))}
        </div>

        {/* Inventory bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-700">Overall Mark Utilization</span>
            <span className="text-sm text-gray-500">{((totalApplied / totalIssued) * 100).toFixed(1)}% applied</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div className="h-4 rounded-full transition-all" style={{ width: `${(totalApplied / totalIssued) * 100}%`, backgroundColor: agency?.color || '#003087' }} />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>0</span>
            <span>{totalIssued.toLocaleString()} total issued</span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Tabs + action */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex gap-1">
              {[['all','All Marks'],['active','Active'],['pending','Pending']].map(([k, l]) => (
                <button key={k} onClick={() => { setTab(k); setPage(1) }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === k ? 'text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  style={tab === k ? { backgroundColor: agency?.color || '#003087' } : {}}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ backgroundColor: agency?.color || '#003087' }}>
              <Plus size={15} /> Issue Marks
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Mark ID','Product','Manufacturer','Agency','Type','Quantity','Applied','Remaining','Issued','Expiry','Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pageItems.map(m => {
                  const pct = m.quantity > 0 ? (m.applied / m.quantity) * 100 : 0
                  return (
                    <tr key={m.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-xs font-mono font-medium" style={{ color: agencyColors[m.agency] }}>{m.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">{m.product}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{m.manufacturer}</td>
                      <td className="px-4 py-3">
                        <span className="px-1.5 py-0.5 rounded text-xs font-semibold text-white" style={{ backgroundColor: agencyColors[m.agency] }}>{m.agency}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">{m.markType}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-mono">{m.quantity.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-gray-700 font-mono">{m.applied.toLocaleString()}</div>
                        <div className="w-20 bg-gray-100 rounded-full h-1 mt-1">
                          <div className="h-1 rounded-full bg-green-500" style={{ width: `${pct}%` }} />
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-mono">{(m.quantity - m.applied).toLocaleString()}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{m.issued}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{m.expiry}</td>
                      <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                    </tr>
                  )
                })}
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

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Issue Government Marks">
        <div className="space-y-4">
          {[['Manufacturer / Importer','text','e.g. East African Breweries Ltd'],['Product Name','text','e.g. Tusker Lager 500ml'],['Mark Quantity','number','e.g. 500000']].map(([label, type, ph], i) => (
            <div key={i}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} placeholder={ph} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Mark Type</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
              {['Excise Stamp','Serialization Label','ISM Stamp','Seed Certification Label','IP Recordation Mark'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Delivery Method</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option>Physical delivery to premises</option>
              <option>Digital serialization (online)</option>
              <option>Hybrid (physical + digital)</option>
            </select>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg">Cancel</button>
            <button onClick={() => { alert('Mark issuance request submitted.'); setShowModal(false) }}
              className="px-5 py-2 text-sm text-white rounded-lg font-medium" style={{ backgroundColor: agency?.color || '#003087' }}>
              Issue Marks
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
