import { useState } from 'react'
import { Plus, Search, Filter, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import Header from '../components/layout/Header'
import StatusBadge from '../components/common/StatusBadge'
import Modal from '../components/common/Modal'
import { useApp } from '../context/AppContext'

import { products, counties } from '../data/mockData'

const ITEMS_PER_PAGE = 10

const agencyColors = { KRA:'#003087', KEBS:'#006600', ACA:'#BB0000', KEPHIS:'#228B22', PPB:'#1a5276' }

export default function Products() {
  const { currentAgency } = useApp()
  const agency = currentAgency
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterAgency, setFilterAgency] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ name:'', category:'', hsCode:'', manufacturer:'', country:'Kenya', agencies:[], status:'Pending' })

  const categories = [...new Set(products.map(p => p.category))].sort()
  const statuses = [...new Set(products.map(p => p.status))]

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    return (
      (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.manufacturer.toLowerCase().includes(q)) &&
      (!filterCategory || p.category === filterCategory) &&
      (!filterStatus || p.status === filterStatus) &&
      (!filterAgency || p.agencies.includes(filterAgency))
    )
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const pageItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  return (
    <div className="flex flex-col flex-1">
      <Header title="Product Registry" subtitle="Unified product database across all agencies" />
      <main className="flex-1 p-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Toolbar */}
          <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search by name, SKU, manufacturer…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <select value={filterCategory} onChange={e => { setFilterCategory(e.target.value); setPage(1) }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              <option value="">All Statuses</option>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <select value={filterAgency} onChange={e => { setFilterAgency(e.target.value); setPage(1) }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              <option value="">All Agencies</option>
              {['KRA','KEBS','ACA','KEPHIS','PPB'].map(a => <option key={a}>{a}</option>)}
            </select>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ backgroundColor: agency?.color || '#003087' }}>
              <Plus size={15} /> Register Product
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['SKU','Product Name','Category','Manufacturer','Country','Agencies','Status','Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pageItems.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-mono text-gray-500">{p.sku}</td>
                    <td className="px-5 py-3.5">
                      <div className="text-sm font-medium text-gray-900">{p.name}</div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{p.category}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{p.manufacturer}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{p.country}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {p.agencies.map(a => (
                          <span key={a} className="px-1.5 py-0.5 rounded text-xs font-semibold text-white"
                            style={{ backgroundColor: agencyColors[a] || '#666' }}>{a}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => setSelected(p)}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                        <Eye size={13} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Showing {(page-1)*ITEMS_PER_PAGE+1}–{Math.min(page*ITEMS_PER_PAGE, filtered.length)} of {filtered.length} products</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p-1)}
                className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"><ChevronLeft size={14} /></button>
              <button disabled={page >= totalPages} onClick={() => setPage(p => p+1)}
                className="p-1.5 rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"><ChevronRight size={14} /></button>
            </div>
          </div>
        </div>
      </main>

      {/* Register Product Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Register New Product" size="lg">
        <div className="grid grid-cols-2 gap-4">
          {[
            ['Product Name', 'name', 'text', 'e.g. Tusker Lager 500ml'],
            ['HS Code', 'hsCode', 'text', 'e.g. 2203.00.10'],
            ['Manufacturer / Importer', 'manufacturer', 'text', 'Company name'],
            ['Country of Origin', 'country', 'text', 'e.g. Kenya'],
          ].map(([label, key, type, ph]) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
              <input type={type} placeholder={ph} value={form[key]}
                onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
              <option value="">Select category…</option>
              {['Beverages - Alcohol','Beverages - Non-Alcoholic','Beverages - Water','Tobacco','Pharmaceuticals','Agricultural Seeds','Agro-inputs','Electronics','Cosmetics','FMCG'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Applicable Agencies</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {['KRA','KEBS','ACA','KEPHIS','PPB'].map(a => (
                <label key={a} className="flex items-center gap-1.5 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.agencies.includes(a)}
                    onChange={e => setForm(f => ({ ...f, agencies: e.target.checked ? [...f.agencies, a] : f.agencies.filter(x => x !== a) }))}
                    className="rounded" />
                  <span className="font-medium" style={{ color: agencyColors[a] }}>{a}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">Upload Certificate / Supporting Document</label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center text-sm text-gray-400">
            Click to upload or drag & drop (PDF, JPG — max 10MB)
          </div>
        </div>
        <div className="flex gap-3 mt-5 justify-end">
          <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
          <button onClick={() => { alert('Product registration submitted for review.'); setShowModal(false) }}
            className="px-5 py-2 text-sm text-white rounded-lg font-medium" style={{ backgroundColor: agency?.color || '#003087' }}>
            Submit for Review
          </button>
        </div>
      </Modal>

      {/* Product Detail Modal */}
      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected.name} size="lg">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ['SKU', selected.sku], ['Category', selected.category],
                ['Manufacturer', selected.manufacturer], ['Country', selected.country],
                ['HS Code', selected.hsCode], ['Registered', selected.registeredDate],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs text-gray-500 font-medium">{k}</div>
                  <div className="text-gray-900 font-mono text-sm">{v}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium mb-2">Status</div>
              <StatusBadge status={selected.status} />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium mb-2">Agency Permits</div>
              <div className="space-y-1">
                {Object.entries(selected.permits).length ? Object.entries(selected.permits).map(([ag, permit]) => (
                  <div key={ag} className="flex items-center gap-2 text-sm">
                    <span className="px-1.5 py-0.5 rounded text-xs font-semibold text-white" style={{ backgroundColor: agencyColors[ag] }}>{ag}</span>
                    <span className="font-mono text-gray-700">{permit}</span>
                  </div>
                )) : <span className="text-gray-400 text-sm">No permits issued yet</span>}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
