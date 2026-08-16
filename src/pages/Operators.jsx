import { useState } from 'react'
import { operators } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'
import { Building2, Plus, X, Search } from 'lucide-react'

const AGENCY_COLORS = { KRA: '#003087', KEBS: '#006600', ACA: '#BB0000', KEPHIS: '#228B22', PPB: '#1a5276', VMD: '#5D4037', PCPB: '#4527A0', KEPROBA: '#E65100' }

const TYPE_STYLES = {
  Manufacturer: 'bg-blue-100 text-blue-800',
  Importer: 'bg-purple-100 text-purple-800',
  Distributor: 'bg-amber-100 text-amber-800',
  Retailer: 'bg-green-100 text-green-800',
}

function licenseStatus(status) {
  if (status === 'Active') return <span className="text-xs font-medium text-green-700">✓ Active</span>
  if (status === 'Pending') return <span className="text-xs font-medium text-amber-700">⏳ Pending</span>
  return <span className="text-xs font-medium text-red-700">✗ {status}</span>
}

export default function Operators() {
  const { currentAgency, currentUser } = useApp()
  const agencyColor = currentAgency?.color || '#003087'
  const isOperator = currentUser?.userType === 'operator'
  const operatorId = currentUser?.operatorId
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [agencyFilter, setAgencyFilter] = useState('')
  const [selected, setSelected] = useState(null)

  // Operators can only see their own profile
  const visibleOperators = isOperator ? operators.filter(op => op.id === operatorId) : operators

  const filtered = visibleOperators.filter(op => {
    const q = search.toLowerCase()
    const matchSearch = !q || op.name.toLowerCase().includes(q) || op.pin.toLowerCase().includes(q) || op.sector.toLowerCase().includes(q)
    const matchType = !typeFilter || op.type === typeFilter
    const matchAgency = !agencyFilter || Object.keys(op.licenses).includes(agencyFilter)
    return matchSearch && matchType && matchAgency
  })

  const counts = {
    total: visibleOperators.length,
    manufacturers: visibleOperators.filter(o => o.type === 'Manufacturer').length,
    importers: visibleOperators.filter(o => o.type === 'Importer').length,
    distributors: visibleOperators.filter(o => o.type === 'Distributor').length,
    retailers: visibleOperators.filter(o => o.type === 'Retailer').length,
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Economic Operators</h2>
          <p className="text-gray-500 text-sm">Licensed manufacturers, importers, distributors and retailers</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-white rounded-lg text-sm hover:opacity-90 self-start" style={{ backgroundColor: agencyColor }}>
          <Plus size={16} /> Register Operator
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {[
          ['Manufacturers', counts.manufacturers, 'bg-blue-50 text-blue-800'],
          ['Importers', counts.importers, 'bg-purple-50 text-purple-800'],
          ['Distributors', counts.distributors, 'bg-amber-50 text-amber-800'],
          ['Retailers', counts.retailers, 'bg-green-50 text-green-800'],
        ].map(([label, val, cls]) => (
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
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, PIN, sector..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Types</option>
          {['Manufacturer','Importer','Distributor','Retailer'].map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={agencyFilter} onChange={e => setAgencyFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="">All Agencies</option>
          {Object.keys(AGENCY_COLORS).map(a => <option key={a}>{a}</option>)}
        </select>
        {(search || typeFilter || agencyFilter) && (
          <button onClick={() => { setSearch(''); setTypeFilter(''); setAgencyFilter('') }} className="px-3 py-2 text-gray-600 text-sm underline">Clear</button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 text-sm text-gray-500">Showing {filtered.length} of {visibleOperators.length} operators</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
              <tr>
                {['PIN','Operator Name','Type','Sector','County','Licenses','Products','Marks Ordered','Actions'].map(h => (
                  <th key={h} className="px-3 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(op => (
                <tr key={op.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelected(op)}>
                  <td className="px-3 py-3 font-mono text-xs text-gray-600">{op.pin}</td>
                  <td className="px-3 py-3">
                    <div className="font-medium text-gray-900">{op.name}</div>
                    <div className="text-xs text-gray-400">{op.contact}</div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_STYLES[op.type] || 'bg-gray-100 text-gray-800'}`}>{op.type}</span>
                  </td>
                  <td className="px-3 py-3 text-gray-600 text-xs max-w-32 truncate">{op.sector}</td>
                  <td className="px-3 py-3 text-gray-600">{op.county}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1">
                      {Object.keys(op.licenses).map(a => (
                        <span key={a} className="px-1.5 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: AGENCY_COLORS[a] || '#666' }}>{a}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-900 text-center">{op.productsCount}</td>
                  <td className="px-3 py-3 text-gray-900 text-right">{op.marksOrdered > 0 ? op.marksOrdered.toLocaleString() : '—'}</td>
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                  <Building2 size={20} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selected.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_STYLES[selected.type] || ''}`}>{selected.type}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-4">
              {[['KRA PIN', selected.pin], ['Contact Person', selected.contact], ['Phone', selected.phone], ['Email', selected.email], ['County', selected.county], ['Sector', selected.sector], ['Registered', selected.registeredDate], ['Products Count', selected.productsCount], ['Total Marks Ordered', selected.marksOrdered > 0 ? selected.marksOrdered.toLocaleString() : 'None yet']].map(([k, v]) => (
                <div key={k} className={k === 'Email' ? 'col-span-2' : ''}>
                  <div className="text-xs text-gray-500 mb-0.5">{k}</div>
                  <div className="font-medium text-gray-900 break-all text-xs">{v}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4">
              <div className="text-xs font-semibold text-gray-500 mb-3 uppercase">Agency Licenses</div>
              <div className="space-y-2">
                {Object.entries(selected.licenses).map(([agency, lic]) => (
                  <div key={agency} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-xs font-bold text-white" style={{ backgroundColor: AGENCY_COLORS[agency] || '#666' }}>{agency}</span>
                      <span className="font-mono text-xs text-gray-700">{lic.no}</span>
                    </div>
                    <div className="text-right">
                      {licenseStatus(lic.status)}
                      {lic.expiry && <div className="text-xs text-gray-400">Exp: {lic.expiry}</div>}
                    </div>
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
