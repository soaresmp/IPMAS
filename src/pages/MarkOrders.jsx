import { useState } from 'react'
import { markOrders } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import { Package, Plus, X, Search, ChevronRight, CreditCard, ExternalLink, CheckCircle2 } from 'lucide-react'

const AGENCY_COLORS = { KRA: '#003087', KEBS: '#006600', ACA: '#BB0000', KEPHIS: '#228B22', PPB: '#1a5276', VMD: '#5D4037', PCPB: '#4527A0', KEPROBA: '#E65100' }

const STATUS_STYLES = {
  'Draft': 'bg-gray-100 text-gray-700',
  'Pending Approval': 'bg-amber-100 text-amber-800',
  'Approved': 'bg-blue-100 text-blue-800',
  'Awaiting Payment': 'bg-orange-100 text-orange-800',
  'In Production': 'bg-purple-100 text-purple-800',
  'Dispatched': 'bg-indigo-100 text-indigo-800',
  'Delivered': 'bg-cyan-100 text-cyan-800',
  'Activated': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800',
}

const STATUS_ORDER = ['Draft', 'Pending Approval', 'Approved', 'Awaiting Payment', 'In Production', 'Dispatched', 'Delivered', 'Activated']

const ECITIZEN_URL = 'https://ecitizen.go.ke'

function StatusBadge({ status }) {
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-700'}`}>{status}</span>
}

function OrderTimeline({ order }) {
  const steps = [
    { key: 'orderedDate', label: 'Ordered' },
    { key: 'approvedDate', label: 'Approved' },
    { key: 'dispatchedDate', label: 'Dispatched' },
    { key: 'deliveredDate', label: 'Delivered' },
    { key: 'activatedDate', label: 'Activated' },
  ]
  return (
    <div className="flex items-center gap-1 flex-wrap mt-3">
      {steps.map((step, i) => {
        const done = !!order[step.key] && order[step.key] !== 'N/A'
        return (
          <div key={step.key} className="flex items-center gap-1">
            <div className={`flex flex-col items-center`}>
              <div className={`w-2.5 h-2.5 rounded-full ${done ? 'bg-green-500' : 'bg-gray-200'}`} />
              <span className="text-xs text-gray-400 mt-0.5 whitespace-nowrap">{step.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`w-6 h-0.5 mb-3 ${done ? 'bg-green-400' : 'bg-gray-200'}`} />}
          </div>
        )
      })}
    </div>
  )
}

export default function MarkOrders() {
  const { currentAgency, currentUser } = useApp()
  const agencyColor = currentAgency?.color || '#003087'
  const isOperator = currentUser?.userType === 'operator'
  const operatorId = currentUser?.operatorId
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [agencyFilter, setAgencyFilter] = useState('')
  const [selected, setSelected] = useState(null)

  // Operators see only their own orders
  const visibleOrders = isOperator ? markOrders.filter(o => o.operatorId === operatorId) : markOrders

  const filtered = visibleOrders.filter(o => {
    const q = search.toLowerCase()
    const matchSearch = !q || o.operatorName.toLowerCase().includes(q) || o.id.toLowerCase().includes(q) || o.product.toLowerCase().includes(q)
    const matchStatus = !statusFilter || o.status === statusFilter
    const matchAgency = !agencyFilter || o.agency === agencyFilter
    return matchSearch && matchStatus && matchAgency
  })

  const counts = STATUS_ORDER.reduce((acc, s) => ({ ...acc, [s]: visibleOrders.filter(o => o.status === s).length }), {})
  const totalValue = visibleOrders.reduce((sum, o) => sum + (o.totalCost || 0), 0)
  const totalMarks = visibleOrders.reduce((sum, o) => sum + (o.quantity || 0), 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Mark Orders</h2>
          <p className="text-gray-500 text-sm">Order and manage government security marks for products</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm hover:opacity-90 self-start" style={{ backgroundColor: agencyColor }}>
          <Plus size={16} /> New Order
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl p-4 bg-blue-50 text-blue-800">
          <div className="text-2xl font-bold">{visibleOrders.length}</div>
          <div className="text-sm font-medium">Total Orders</div>
        </div>
        <div className="rounded-xl p-4 bg-green-50 text-green-800">
          <div className="text-2xl font-bold">{counts['Activated'] || 0}</div>
          <div className="text-sm font-medium">Activated</div>
        </div>
        <div className="rounded-xl p-4 bg-amber-50 text-amber-800">
          <div className="text-2xl font-bold">{(counts['Pending Approval'] || 0) + (counts['Approved'] || 0) + (counts['In Production'] || 0)}</div>
          <div className="text-sm font-medium">In Progress</div>
        </div>
        <div className="rounded-xl p-4 bg-purple-50 text-purple-800">
          <div className="text-2xl font-bold">{(totalMarks / 1e6).toFixed(1)}M</div>
          <div className="text-sm font-medium">Marks Ordered</div>
        </div>
      </div>

      {/* Pipeline overview */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Order Pipeline</div>
        <div className="flex flex-wrap gap-2">
          {STATUS_ORDER.map(s => (
            <button key={s} onClick={() => setStatusFilter(statusFilter === s ? '' : s)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${statusFilter === s ? 'border-current' : 'border-transparent'} ${STATUS_STYLES[s]}`}>
              <span className="font-bold">{counts[s] || 0}</span> {s}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by operator, order ID, product..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Statuses</option>
          {STATUS_ORDER.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={agencyFilter} onChange={e => setAgencyFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Agencies</option>
          {Object.keys(AGENCY_COLORS).map(a => <option key={a}>{a}</option>)}
        </select>
        {(search || statusFilter || agencyFilter) && (
          <button onClick={() => { setSearch(''); setStatusFilter(''); setAgencyFilter('') }} className="px-3 py-2 text-gray-600 text-sm underline">Clear</button>
        )}
      </div>

      {/* Orders list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 text-sm text-gray-500">Showing {filtered.length} of {visibleOrders.length} orders</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                {['Order ID', 'Operator', 'Product', 'Agency', 'Mark Type', 'Quantity', 'Value (KES)', 'Application Site', 'Status', ''].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(order)}>
                  <td className="px-3 py-3 font-mono text-xs text-gray-600">{order.id}</td>
                  <td className="px-3 py-3">
                    <div className="font-medium text-gray-900 text-xs">{order.operatorName}</div>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-600 max-w-32 truncate">{order.product}</td>
                  <td className="px-3 py-3">
                    <span className="px-1.5 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: AGENCY_COLORS[order.agency] || '#666' }}>{order.agency}</span>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-600 whitespace-nowrap">{order.markType}</td>
                  <td className="px-3 py-3 text-gray-900 text-right whitespace-nowrap">{order.quantity.toLocaleString()}</td>
                  <td className="px-3 py-3 text-gray-900 text-right whitespace-nowrap">{order.totalCost.toLocaleString()}</td>
                  <td className="px-3 py-3 text-xs text-gray-500 whitespace-nowrap">{order.applicationSite}</td>
                  <td className="px-3 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-3 py-3">
                    {order.status === 'Awaiting Payment' ? (
                      <a href={ECITIZEN_URL} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 px-2 py-1 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 whitespace-nowrap">
                        <CreditCard size={12} /> Pay
                      </a>
                    ) : (
                      <ChevronRight size={16} className="text-blue-600" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Package size={20} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 font-mono">{selected.id}</h3>
                  <StatusBadge status={selected.status} />
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-5">
              {[
                ['Operator', selected.operatorName],
                ['Agency', selected.agency],
                ['Product', selected.product],
                ['SKU', selected.sku],
                ['Mark Type', selected.markType],
                ['Application Site', selected.applicationSite],
                ['Quantity', selected.quantity.toLocaleString() + ' marks'],
                ['Unit Cost', `KES ${selected.unitCost}`],
                ['Total Value', `KES ${selected.totalCost.toLocaleString()}`],
                ['Import Permit', selected.importPermit],
              ].map(([k, v]) => (
                <div key={k} className={k === 'Operator' || k === 'Product' ? 'col-span-2' : ''}>
                  <div className="text-xs text-gray-500 mb-0.5">{k}</div>
                  <div className="font-medium text-gray-900 text-xs break-all">
                    {k === 'Agency'
                      ? <span className="px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: AGENCY_COLORS[v] || '#666' }}>{v}</span>
                      : v}
                  </div>
                </div>
              ))}
            </div>

            {/* Payment section */}
            <div className="mb-4 rounded-xl border p-4 bg-orange-50 border-orange-100">
              <div className="text-xs font-semibold text-gray-500 uppercase mb-3 flex items-center gap-1.5">
                <CreditCard size={13} /> eCitizen Payment
              </div>
              {selected.paymentStatus === 'Paid' ? (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 text-green-700 font-medium text-sm mb-1">
                      <CheckCircle2 size={15} /> Payment Confirmed
                    </div>
                    <div className="text-xs text-gray-500">PRN: <span className="font-mono font-medium text-gray-800">{selected.paymentRef}</span></div>
                    <div className="text-xs text-gray-500 mt-0.5">Paid on {selected.paymentDate} via {selected.paymentMethod}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Amount</div>
                    <div className="font-bold text-gray-900">KES {selected.totalCost.toLocaleString()}</div>
                  </div>
                </div>
              ) : selected.paymentStatus === 'Pending' ? (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-orange-800 mb-1">Payment Required</div>
                    <div className="text-xs text-gray-600">PRN: <span className="font-mono font-medium text-gray-800">{selected.paymentRef}</span></div>
                    <div className="text-xs text-gray-500 mt-0.5">Use this reference on eCitizen portal</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Amount Due</div>
                      <div className="font-bold text-orange-700">KES {selected.totalCost.toLocaleString()}</div>
                    </div>
                    <a href={ECITIZEN_URL} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700">
                      <CreditCard size={12} /> Pay on eCitizen <ExternalLink size={11} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-400 italic">Payment will be required once the order is approved.</div>
              )}
            </div>

            {selected.notes && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                <span className="font-medium">Notes: </span>{selected.notes}
              </div>
            )}

            <div className="border-t border-gray-100 pt-4">
              <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Order Timeline</div>
              <div className="space-y-2">
                {[
                  ['Ordered', selected.orderedDate],
                  ['Approved', selected.approvedDate],
                  ['Payment', selected.paymentDate],
                  ['Dispatched', selected.dispatchedDate],
                  ['Delivered', selected.deliveredDate],
                  ['Activated', selected.activatedDate],
                ].filter(([, d]) => d && d !== 'N/A').map(([label, date]) => (
                  <div key={label} className="flex items-center justify-between py-1.5 border-b border-gray-50">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-xs font-medium text-gray-800">{date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
