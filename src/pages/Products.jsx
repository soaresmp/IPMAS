import { useState } from 'react'
import { products } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import { Search, Plus, X, Eye } from 'lucide-react'

function statusBadge(status) {
  const map = {
    Registered: 'bg-green-100 text-green-800',
    Active: 'bg-green-100 text-green-800',
    Pending: 'bg-amber-100 text-amber-800',
    Suspended: 'bg-red-100 text-red-800',
    'Under Review': 'bg-blue-100 text-blue-800',
  }
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>
}

const AGENCY_COLORS = { KRA: '#003087', KEBS: '#006600', ACA: '#BB0000', KEPHIS: '#228B22', PPB: '#1a5276' }

function agencyBadge(id) {
  const color = AGENCY_COLORS[id] || '#666'
  return <span key={id} className="px-2 py-0.5 rounded text-xs font-bold text-white mr-1" style={{ backgroundColor: color }}>{id}</span>
}

export default function Products() {
  const { currentAgency, currentUser } = useApp()
  const isOperator = currentUser?.userType === 'operator'
  const operatorId = currentUser?.operatorId
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [agencyFilter, setAgencyFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [selected, setSelected] = useState(null)

  // Operators see only their own products
  const visibleProducts = isOperator ? products.filter(p => p.operatorId === operatorId) : products

  const categories = [...new Set(visibleProducts.map(p => p.category))].sort()

  const filtered = visibleProducts.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.manufacturer.toLowerCase().includes(q)
    const matchCat = !catFilter || p.category === catFilter
    const matchAgency = !agencyFilter || p.agencies.includes(agencyFilter)
    const matchStatus = !statusFilter || p.status === statusFilter
    return matchSearch && matchCat && matchAgency && matchStatus
  })

  const counts = {
    total: visibleProducts.length,
    registered: visibleProducts.filter(p => p.status === 'Registered').length,
    pending: visibleProducts.filter(p => p.status === 'Pending').length,
    suspended: visibleProducts.filter(p => p.status === 'Suspended').length,
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Products Registry</h2>
          <p className="text-gray-500 text-sm">Registered products across all agencies</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm self-start" style={{ backgroundColor: currentAgency?.color || '#003087' }}>
          <Plus size={16} /> Register Product
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {[['Total Products', counts.total, 'bg-blue-50 text-blue-800'], ['Registered', counts.registered, 'bg-green-50 text-green-800'], ['Pending', counts.pending, 'bg-amber-50 text-amber-800'], ['Suspended', counts.suspended, 'bg-red-50 text-red-800']].map(([label, val, cls]) => (
          <div key={label} className={`rounded-xl p-4 ${cls}`}>
            <div className="text-2xl font-bold">{val}</div>
            <div className="text-sm font-medium">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, SKU, manufacturer..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={agencyFilter} onChange={e => setAgencyFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Agencies</option>
          {['KRA','KEBS','ACA','KEPHIS','PPB'].map(a => <option key={a}>{a}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Statuses</option>
          {['Registered','Pending','Suspended','Under Review'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 text-sm text-gray-500">
          Showing {filtered.length} of {visibleProducts.length} products
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                {['SKU','Product Name','Category','Manufacturer','Country','Agencies','Status','Registered','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{p.sku}</td>
                  <td className="px-4 py-3 font-medium text-gray-900 max-w-48 truncate">{p.name}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.category}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-40 truncate">{p.manufacturer}</td>
                  <td className="px-4 py-3 text-gray-600">{p.country}</td>
                  <td className="px-4 py-3">{p.agencies.map(a => agencyBadge(a))}</td>
                  <td className="px-4 py-3">{statusBadge(p.status)}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{p.registeredDate}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(p)} className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs">
                      <Eye size={14} /> View
                    </button>
                  </td>
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
                <h3 className="text-lg font-bold text-gray-900">{selected.name}</h3>
                <p className="text-sm text-gray-500">{selected.sku}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              {[['Category', selected.category], ['Manufacturer', selected.manufacturer], ['Country of Origin', selected.country], ['HS Code', selected.hsCode], ['Registered Date', selected.registeredDate], ['Status', selected.status]].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs text-gray-500 mb-0.5">{k}</div>
                  <div className="font-medium text-gray-900">{k === 'Status' ? statusBadge(v) : v}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4">
              <div className="text-xs font-semibold text-gray-500 mb-2 uppercase">Permits &amp; Registrations</div>
              {Object.keys(selected.permits).length === 0 ? (
                <p className="text-sm text-gray-400 italic">No permits yet — registration in progress</p>
              ) : (
                <div className="space-y-1">
                  {Object.entries(selected.permits).map(([agency, permit]) => (
                    <div key={agency} className="flex items-center gap-2">
                      {agencyBadge(agency)}
                      <span className="font-mono text-xs text-gray-700">{permit}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Regulated by: {selected.agencies.map(a => agencyBadge(a))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
