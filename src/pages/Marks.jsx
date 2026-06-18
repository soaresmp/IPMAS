import { useState } from 'react'
import { marks } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import { Plus, X, Check, XCircle } from 'lucide-react'

function statusBadge(status) {
  const map = { Active: 'bg-green-100 text-green-800', Pending: 'bg-amber-100 text-amber-800', Expired: 'bg-red-100 text-red-800' }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>
}

const AGENCY_COLORS = { KRA: '#003087', KEBS: '#006600', ACA: '#BB0000', KEPHIS: '#228B22', PPB: '#1a5276' }

export default function Marks() {
  const { currentAgency } = useApp()
  const [tab, setTab] = useState('issued')
  const agencyColor = currentAgency?.color || '#003087'

  const issued = marks.filter(m => m.status === 'Active')
  const pending = marks.filter(m => m.status === 'Pending')
  const all = marks

  const display = tab === 'issued' ? issued : tab === 'pending' ? pending : all

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Marks Management</h2>
          <p className="text-gray-500 text-sm">Government marks issued to manufacturers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm hover:opacity-90 self-start" style={{ backgroundColor: agencyColor }}>
          <Plus size={16} /> Issue New Marks
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        {[['issued', `Issued Marks (${issued.length})`], ['pending', `Pending Approval (${pending.length})`], ['inventory', `All Inventory (${all.length})`]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === key ? 'bg-white shadow text-gray-900' : 'text-gray-600 hover:text-gray-900'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                {['Mark ID', 'Product', 'Manufacturer', 'Agency', 'Type', 'Quantity', 'Applied', 'Remaining', 'Progress', 'Status', 'Issued', 'Expiry', ...(tab === 'pending' ? ['Actions'] : [])].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {display.map(m => {
                const pct = m.quantity > 0 ? Math.round((m.applied / m.quantity) * 100) : 0
                const color = AGENCY_COLORS[m.agency] || '#666'
                return (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 font-mono text-xs text-gray-700">{m.id}</td>
                    <td className="px-3 py-3 text-gray-900 max-w-40 truncate font-medium">{m.product}</td>
                    <td className="px-3 py-3 text-gray-600 max-w-32 truncate">{m.manufacturer}</td>
                    <td className="px-3 py-3"><span className="px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: color }}>{m.agency}</span></td>
                    <td className="px-3 py-3 text-xs text-gray-600">{m.markType}</td>
                    <td className="px-3 py-3 text-gray-900">{m.quantity.toLocaleString()}</td>
                    <td className="px-3 py-3 text-gray-900">{m.applied.toLocaleString()}</td>
                    <td className="px-3 py-3 text-gray-900">{m.remaining.toLocaleString()}</td>
                    <td className="px-3 py-3 min-w-24">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${pct}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500 w-8">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">{statusBadge(m.status)}</td>
                    <td className="px-3 py-3 text-xs text-gray-600">{m.issued}</td>
                    <td className="px-3 py-3 text-xs text-gray-600">{m.expiry}</td>
                    {tab === 'pending' && (
                      <td className="px-3 py-3">
                        <div className="flex gap-2">
                          <button className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200"><Check size={12} /> Approve</button>
                          <button className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"><XCircle size={12} /> Reject</button>
                        </div>
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {display.length === 0 && (
          <div className="text-center py-12 text-gray-400">No records found for this tab.</div>
        )}
      </div>
    </div>
  )
}
