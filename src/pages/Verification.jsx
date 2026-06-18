import { useState } from 'react'
import { traceEvents } from '../data/mockData.js'
import { ShieldCheck, CheckCircle, XCircle, Search, X } from 'lucide-react'

export default function Verification() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(undefined)
  const [searched, setSearched] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [reportForm, setReportForm] = useState({ contact: '', description: '', location: '' })

  function handleVerify(q) {
    const key = (q !== undefined ? q : query).trim()
    if (!key) return
    setQuery(key)
    setSearched(true)
    if (key in traceEvents) {
      setResult(traceEvents[key])
    } else {
      setResult(null)
    }
  }

  const isAuthentic = searched && result !== null && result !== undefined && Array.isArray(result)
  const isFake = searched && result === null

  const firstEvent = isAuthentic ? result[0] : null
  const lastEvent = isAuthentic ? result[result.length - 1] : null

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <ShieldCheck size={32} className="text-green-600" />
          <h2 className="text-2xl font-bold text-gray-900">Verify Product Authenticity</h2>
        </div>
        <p className="text-gray-500 text-sm">Check if a product has a valid government mark</p>
      </div>

      {/* Search box */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Mark ID, Serial Number, or QR Code</label>
        <div className="flex gap-3">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleVerify()}
            placeholder="e.g. GOK-2024-TUSKER-001-487200"
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button onClick={() => handleVerify()} className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium text-sm hover:bg-green-700 flex items-center gap-2">
            <Search size={16} /> Verify
          </button>
        </div>
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">Sample codes to try:</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleVerify('GOK-2024-TUSKER-001-487200')} className="px-3 py-1 bg-green-50 border border-green-200 rounded-full text-xs text-green-700 hover:bg-green-100">Try: GOK-2024-TUSKER-001-487200</button>
            <button onClick={() => handleVerify('GOK-2024-AMOX-003-187600')} className="px-3 py-1 bg-green-50 border border-green-200 rounded-full text-xs text-green-700 hover:bg-green-100">Try: GOK-2024-AMOX-003-187600</button>
            <button onClick={() => handleVerify('GOK-FAKE-0001')} className="px-3 py-1 bg-red-50 border border-red-200 rounded-full text-xs text-red-700 hover:bg-red-100">Try: GOK-FAKE-0001</button>
          </div>
        </div>
      </div>

      {/* No search yet */}
      {!searched && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          <ShieldCheck size={40} className="mx-auto mb-3 opacity-20" />
          <p className="font-medium">Enter a code above to verify</p>
          <p className="text-sm mt-1">Consumers can use this tool to confirm products are authentic and have valid government marks.</p>
        </div>
      )}

      {/* Authentic */}
      {isAuthentic && (
        <div className="space-y-4">
          <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-5 flex items-center gap-4">
            <CheckCircle size={36} className="text-green-600 flex-shrink-0" />
            <div>
              <div className="text-xl font-bold text-green-800">PRODUCT VERIFIED — AUTHENTIC</div>
              <div className="text-green-700 text-sm mt-0.5">This mark is registered in the IPMAS database and is valid.</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-3">
            <h3 className="font-semibold text-gray-900 mb-3">Product Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><div className="text-xs text-gray-500">Mark ID</div><div className="font-mono font-medium text-gray-900 text-xs">{query}</div></div>
              <div><div className="text-xs text-gray-500">Supply Chain Events</div><div className="font-medium text-gray-900">{result.length} events recorded</div></div>
              <div><div className="text-xs text-gray-500">Issuing Agency</div><div className="font-medium text-gray-900">{firstEvent?.agency}</div></div>
              <div><div className="text-xs text-gray-500">Issued</div><div className="font-medium text-gray-900">{firstEvent?.timestamp?.split(' ')[0]}</div></div>
              <div><div className="text-xs text-gray-500">Last Seen</div><div className="font-medium text-gray-900">{lastEvent?.location}</div></div>
              <div><div className="text-xs text-gray-500">Last Event</div><div className="font-medium text-gray-900">{lastEvent?.event}</div></div>
            </div>
          </div>
        </div>
      )}

      {/* Fake */}
      {isFake && (
        <div className="space-y-4">
          <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-5 flex items-center gap-4">
            <XCircle size={36} className="text-red-600 flex-shrink-0" />
            <div>
              <div className="text-xl font-bold text-red-800">WARNING — PRODUCT NOT VERIFIED</div>
              <div className="text-red-700 text-sm mt-0.5">This mark was NOT found in the IPMAS database.</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-2">What this means</h3>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside mb-4">
              <li>This product may be counterfeit or illegally imported</li>
              <li>The mark may have been tampered with or forged</li>
              <li>Do not purchase or consume this product</li>
              <li>Report to the Anti-Counterfeit Authority (ACA): 0800 720 660</li>
            </ul>
            <button onClick={() => setShowReport(true)} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">
              Report This Product
            </button>
          </div>
        </div>
      )}

      {/* Report modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Report Suspected Counterfeit</h3>
              <button onClick={() => setShowReport(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Contact (Optional)</label>
                <input value={reportForm.contact} onChange={e => setReportForm(f => ({ ...f, contact: e.target.value }))} placeholder="Phone or email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location Found</label>
                <input value={reportForm.location} onChange={e => setReportForm(f => ({ ...f, location: e.target.value }))} placeholder="Shop name, market, county" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={reportForm.description} onChange={e => setReportForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the product and where you found it..." rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
              </div>
              <button onClick={() => { alert('Report submitted to ACA. Reference: RPT-' + Date.now()); setShowReport(false) }} className="w-full py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                Submit Report to ACA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
