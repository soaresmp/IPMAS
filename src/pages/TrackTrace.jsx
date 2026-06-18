import { useState } from 'react'
import { Search, MapPin, CheckCircle, Package, Truck, ShoppingBag, Shield, User, ChevronRight } from 'lucide-react'
import Header from '../components/layout/Header'
import { useApp } from '../context/AppContext'

import { traceEvents } from '../data/mockData'

const agencyColors = { KRA:'#003087', KEBS:'#006600', ACA:'#BB0000', KEPHIS:'#228B22', PPB:'#1a5276' }

const eventIcons = {
  'Mark Issued': <Shield size={14} className="text-white" />,
  'Mark Received at Manufacturer': <Package size={14} className="text-white" />,
  'Applied on Production Line 3': <Package size={14} className="text-white" />,
  'Applied at Manufacturer': <Package size={14} className="text-white" />,
  'Quality Inspection — KEBS': <CheckCircle size={14} className="text-white" />,
  'PPB Quality Release': <CheckCircle size={14} className="text-white" />,
  'Warehouse Dispatch': <Truck size={14} className="text-white" />,
  'Distributor Receipt': <Truck size={14} className="text-white" />,
  'Wholesale Distribution': <Truck size={14} className="text-white" />,
  'Retail Delivery': <ShoppingBag size={14} className="text-white" />,
  'Retail Pharmacy Receipt': <ShoppingBag size={14} className="text-white" />,
  'Consumer Verification': <User size={14} className="text-white" />,
}

const DEMOS = ['GOK-2024-TUSKER-001', 'GOK-2024-AMOX-003', 'GOK-FAKE-0001']

export default function TrackTrace() {
  const { currentAgency } = useApp()
  const agency = currentAgency
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)

  const doSearch = (q) => {
    const key = q.trim().toUpperCase()
    if (!key) return
    const data = traceEvents[key] ?? undefined
    setResult(data === undefined ? 'not_found' : data)
    setSearched(true)
  }

  return (
    <div className="flex flex-col flex-1">
      <Header title="Track & Trace" subtitle="Full supply chain visibility for Government-Marked products" />
      <main className="flex-1 p-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Left panel */}
          <div className="col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Search Product / Mark</h3>
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={query} onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && doSearch(query)}
                  placeholder="Enter Mark ID or Serial No."
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button onClick={() => doSearch(query)}
                className="w-full py-2.5 text-sm font-medium text-white rounded-lg"
                style={{ backgroundColor: agency?.color || '#003087' }}>
                Search Track Record
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Demo Codes</h3>
              <div className="space-y-2">
                {DEMOS.map(code => (
                  <button key={code} onClick={() => { setQuery(code); doSearch(code) }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:border-gray-300 text-left transition-colors group">
                    <div>
                      <div className="text-xs font-mono font-medium text-gray-700">{code}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {code === 'GOK-FAKE-0001' ? '⚠ Test counterfeit code' : '✓ Authentic product trace'}
                      </div>
                    </div>
                    <ChevronRight size={14} className="text-gray-400 group-hover:text-gray-600" />
                  </button>
                ))}
              </div>
            </div>

            {result && result !== 'not_found' && result?.authentic && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 text-sm space-y-2">
                <h3 className="font-semibold text-gray-900 text-xs uppercase tracking-wide text-gray-500 mb-3">Product Details</h3>
                <div><span className="text-gray-500">Product:</span> <span className="font-medium">{result.product}</span></div>
                <div><span className="text-gray-500">Manufacturer:</span> <span className="font-medium">{result.manufacturer}</span></div>
                <div><span className="text-gray-500">Batch:</span> <span className="font-mono">{result.batchId}</span></div>
                <div><span className="text-gray-500">Produced:</span> {result.productionDate}</div>
                <div><span className="text-gray-500">Expires:</span> {result.expiryDate}</div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {result.agencies.map(a => (
                    <span key={a} className="px-1.5 py-0.5 rounded text-xs font-semibold text-white" style={{ backgroundColor: agencyColors[a] }}>{a}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right panel — timeline */}
          <div className="col-span-2">
            {!searched && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col items-center justify-center text-center p-12">
                <MapPin size={48} className="text-gray-200 mb-4" />
                <h3 className="text-gray-400 font-medium">Enter a Mark ID or Serial Number</h3>
                <p className="text-gray-300 text-sm mt-1">to view the full supply chain trace</p>
              </div>
            )}

            {searched && (result === 'not_found' || result === null) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-4 p-5 bg-red-50 border border-red-200 rounded-xl mb-6">
                  <div className="text-3xl">⚠️</div>
                  <div>
                    <div className="font-bold text-red-700 text-lg">NOT VERIFIED — Possible Counterfeit</div>
                    <div className="text-red-600 text-sm mt-1">This Mark ID was not found in the IPMAS database. The product may be counterfeit or the mark may have been tampered with.</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Code searched:</strong> <span className="font-mono">{query}</span>
                </div>
                <button onClick={() => alert('Report submitted. Reference: RPT-' + Date.now())}
                  className="mt-4 px-4 py-2 text-sm font-medium text-white rounded-lg bg-red-600 hover:bg-red-700">
                  Report Suspicious Product
                </button>
              </div>
            )}

            {searched && result && result !== 'not_found' && result.authentic && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: '#006600' }}>
                  <CheckCircle size={22} className="text-white" />
                  <div>
                    <div className="text-white font-bold text-lg">AUTHENTIC ✓</div>
                    <div className="text-green-100 text-xs">Verified against IPMAS Government of Kenya database</div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-5 uppercase tracking-wide">Supply Chain Timeline — {result.events.length} events recorded</h3>
                  <div className="relative">
                    {/* vertical line */}
                    <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-100" />
                    <div className="space-y-6">
                      {result.events.map((ev, i) => {
                        const color = agencyColors[ev.agency] || '#666'
                        const icon = eventIcons[ev.event]
                        return (
                          <div key={ev.id} className="flex gap-4 relative">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 shadow-sm"
                              style={{ backgroundColor: color }}>
                              {icon || <MapPin size={14} className="text-white" />}
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-100">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="font-semibold text-gray-900 text-sm">{ev.event}</div>
                                  <div className="text-xs text-gray-500 mt-0.5">{ev.timestamp}</div>
                                </div>
                                <span className="px-2 py-0.5 rounded text-xs font-semibold text-white flex-shrink-0"
                                  style={{ backgroundColor: color }}>{ev.agency}</span>
                              </div>
                              <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-600">
                                <MapPin size={11} className="text-gray-400" />
                                {ev.location}, {ev.county} County
                              </div>
                              <div className="text-xs text-gray-500 mt-1.5 bg-white rounded-lg p-2 border border-gray-100">
                                {ev.details}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">Officer: {ev.officer} • Device: {ev.deviceId}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
