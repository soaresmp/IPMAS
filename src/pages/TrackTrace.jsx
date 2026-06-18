import { useState } from 'react'
import { traceEvents } from '../data/mockData.js'
import { Search, GitBranch, CheckCircle, XCircle, MapPin, User, Cpu } from 'lucide-react'

const AGENCY_COLORS = { KRA: '#003087', KEBS: '#006600', ACA: '#BB0000', KEPHIS: '#228B22', PPB: '#1a5276' }

const DEMO_CODES = [
  { code: 'GOK-2024-TUSKER-001-487200', label: 'Tusker Lager (Authentic)', authentic: true },
  { code: 'GOK-2024-AMOX-003-187600', label: 'Amoxicillin (Authentic)', authentic: true },
  { code: 'GOK-FAKE-0001', label: 'Unknown Mark (Not Verified)', authentic: false },
]

export default function TrackTrace() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(undefined)
  const [searched, setSearched] = useState(false)

  function handleSearch(q) {
    const key = (q || query).trim()
    if (!key) return
    setQuery(key)
    setSearched(true)
    if (key in traceEvents) {
      setResult(traceEvents[key])
    } else {
      setResult(undefined)
      setSearched(false)
      setResult(null)
    }
  }

  const isAuthentic = searched && result !== null && result !== undefined && Array.isArray(result)
  const isFake = searched && result === null
  const notFound = searched && result === undefined

  return (
    <div className="flex gap-6 h-full">
      {/* Left panel */}
      <div className="w-80 flex-shrink-0 space-y-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Track a Product</h3>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Enter Mark ID or Serial No."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={() => handleSearch()} className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Search size={16} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Demo Codes</h3>
          <div className="space-y-2">
            {DEMO_CODES.map(d => (
              <button
                key={d.code}
                onClick={() => { setQuery(d.code); handleSearch(d.code) }}
                className="w-full text-left p-2 rounded-lg border hover:bg-gray-50 transition-all"
                style={{ borderColor: d.authentic ? '#16a34a' : '#dc2626' }}
              >
                <div className="text-xs font-medium text-gray-900">{d.label}</div>
                <div className="font-mono text-xs text-gray-500 truncate">{d.code}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1">
        {!searched && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-20">
            <GitBranch size={48} className="mb-4 opacity-30" />
            <p className="text-lg font-medium">Track &amp; Trace</p>
            <p className="text-sm mt-1">Enter a Mark ID or Serial Number to trace a product through the supply chain.</p>
          </div>
        )}

        {isAuthentic && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
              <div>
                <div className="font-bold text-green-800 text-lg">PRODUCT VERIFIED — AUTHENTIC</div>
                <div className="text-green-700 text-sm">{result.length} supply chain events recorded for mark: <span className="font-mono">{query}</span></div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-6">Supply Chain Timeline</h3>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="space-y-6">
                  {result.map((event, i) => {
                    const color = AGENCY_COLORS[event.agency] || '#666'
                    return (
                      <div key={event.id} className="relative pl-12">
                        <div className="absolute left-2 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center" style={{ backgroundColor: color }}>
                          <span className="text-white text-xs font-bold">{i + 1}</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-semibold text-gray-900 text-sm">{event.event}</div>
                            <span className="px-2 py-0.5 rounded text-xs font-bold text-white ml-2 flex-shrink-0" style={{ backgroundColor: color }}>{event.agency}</span>
                          </div>
                          <div className="text-xs text-gray-500 mb-2">{event.timestamp}</div>
                          <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-2">
                            <span className="flex items-center gap-1"><MapPin size={11} />{event.location}</span>
                            <span className="flex items-center gap-1"><User size={11} />{event.officer}</span>
                            <span className="flex items-center gap-1"><Cpu size={11} />{event.deviceId}</span>
                          </div>
                          <p className="text-xs text-gray-700 bg-white rounded p-2 border border-gray-100">{event.details}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {isFake && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <XCircle size={24} className="text-red-600 flex-shrink-0" />
              <div>
                <div className="font-bold text-red-800 text-lg">WARNING — PRODUCT NOT VERIFIED</div>
                <div className="text-red-700 text-sm">Mark ID <span className="font-mono">{query}</span> was not found in the IPMAS database.</div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-red-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-2">What this means</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>This product may be counterfeit or illegally imported</li>
                <li>The mark may have been tampered with or forged</li>
                <li>Do not purchase or consume this product</li>
                <li>Please report this to the Anti-Counterfeit Authority (ACA)</li>
              </ul>
              <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
                Report This Product
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
