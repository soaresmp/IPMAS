import { useState } from 'react'
import { ScanLine, Search, CheckCircle, AlertTriangle, Shield, Package } from 'lucide-react'
import Header from '../components/layout/Header'
import Modal from '../components/common/Modal'
import { useApp } from '../context/AppContext'

import { traceEvents } from '../data/mockData'

const agencyColors = { KRA:'#003087', KEBS:'#006600', ACA:'#BB0000', KEPHIS:'#228B22', PPB:'#1a5276' }

export default function Verification() {
  const { currentAgency } = useApp()
  const agency = currentAgency
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [searched, setSearched] = useState(false)
  const [showReport, setShowReport] = useState(false)

  const doVerify = (q) => {
    const key = q.trim().toUpperCase()
    if (!key) return
    const data = traceEvents[key] ?? undefined
    setResult(data === undefined ? 'not_found' : data)
    setSearched(true)
  }

  const demos = [
    { code:'GOK-2024-TUSKER-001', label:'Tusker Lager 500ml', result:'AUTHENTIC' },
    { code:'GOK-2024-AMOX-003', label:'Amoxicillin 500mg', result:'AUTHENTIC' },
    { code:'GOK-FAKE-0001', label:'Unknown product', result:'NOT VERIFIED' },
  ]

  return (
    <div className="flex flex-col flex-1">
      <Header title="Product Verification" subtitle="Verify Government of Kenya Mark authenticity in real time" />
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">

          {/* Search box */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: agency?.color || '#003087' }}>
                <ScanLine size={28} className="text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Verify a Government Mark</h2>
              <p className="text-gray-500 text-sm mt-1">Enter the Mark ID or scan the QR code on your product</p>
            </div>

            <div className="relative mb-4">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doVerify(query)}
                placeholder="e.g. GOK-2024-TUSKER-001"
                className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 transition-colors"
              />
            </div>
            <button onClick={() => doVerify(query)}
              className="w-full py-3.5 text-base font-semibold text-white rounded-xl transition-all hover:opacity-90"
              style={{ backgroundColor: agency?.color || '#003087' }}>
              Verify Product
            </button>

            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center mb-3">Try these demo codes</p>
              <div className="grid grid-cols-3 gap-2">
                {demos.map(d => (
                  <button key={d.code} onClick={() => { setQuery(d.code); doVerify(d.code) }}
                    className={`p-3 rounded-xl border-2 text-left transition-all hover:shadow-sm ${d.result === 'AUTHENTIC' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                    <div className={`text-xs font-bold mb-1 ${d.result === 'AUTHENTIC' ? 'text-green-700' : 'text-red-700'}`}>{d.result}</div>
                    <div className="text-xs font-mono text-gray-500">{d.code}</div>
                    <div className="text-xs text-gray-400">{d.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          {searched && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {result && result !== 'not_found' && result?.authentic ? (
                <>
                  <div className="px-8 py-6 flex items-center gap-4" style={{ backgroundColor: '#006600' }}>
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                      <CheckCircle size={30} className="text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white">AUTHENTIC ✓</div>
                      <div className="text-green-100 text-sm mt-0.5">Verified in IPMAS Government of Kenya Database</div>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-start gap-6">
                      <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package size={32} className="text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900">{result.product}</h3>
                        <p className="text-gray-500 mt-1">{result.manufacturer}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {result.agencies?.map(a => (
                            <span key={a} className="px-2 py-0.5 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: agencyColors[a] }}>{a} Certified</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {[
                        ['Batch ID', result.batchId],
                        ['Production Date', result.productionDate],
                        ['Expiry Date', result.expiryDate],
                        ['Supply Chain Events', `${result.events?.length} events recorded`],
                      ].map(([k, v]) => (
                        <div key={k} className="bg-gray-50 rounded-xl p-4">
                          <div className="text-xs text-gray-500 mb-1">{k}</div>
                          <div className="font-semibold text-gray-900">{v}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-5 p-4 bg-green-50 rounded-xl border border-green-100">
                      <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                        <Shield size={15} /> This product has a complete and verified Government of Kenya Mark audit trail.
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="px-8 py-6 flex items-center gap-4 bg-red-600">
                    <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                      <AlertTriangle size={30} className="text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white">⚠ NOT VERIFIED</div>
                      <div className="text-red-100 text-sm mt-0.5">This mark was not found in the IPMAS database</div>
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="p-5 bg-red-50 border border-red-100 rounded-xl mb-5">
                      <p className="text-red-700 font-medium text-sm">This product may be:</p>
                      <ul className="list-disc list-inside text-red-600 text-sm mt-2 space-y-1">
                        <li>Counterfeit — mark is fabricated or altered</li>
                        <li>Smuggled — imported without Government Mark</li>
                        <li>Expired — mark has been reused illegally</li>
                        <li>Not yet registered in IPMAS</li>
                      </ul>
                    </div>
                    <p className="text-gray-600 text-sm mb-4"><strong>Code checked:</strong> <span className="font-mono">{query}</span></p>
                    <button onClick={() => setShowReport(true)}
                      className="w-full py-3 text-sm font-semibold text-white rounded-xl bg-red-600 hover:bg-red-700 transition-colors">
                      Report Suspicious Product to ACA
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <Modal isOpen={showReport} onClose={() => setShowReport(false)} title="Report Suspicious Product">
        <div className="space-y-4 text-sm">
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-700">
            Your report will be submitted to the Anti-Counterfeit Authority (ACA) for investigation.
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Mark ID / Code Found</label>
            <input defaultValue={query} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-red-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Product Description</label>
            <input placeholder="e.g. Shampoo bottle, red packaging" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Purchase Location</label>
              <input placeholder="e.g. Nakuru Town Mall" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Your Phone (optional)</label>
              <input type="tel" placeholder="+254 7XX XXX XXX" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Additional Details</label>
            <textarea rows={3} placeholder="Any other relevant information…" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none resize-none" />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => setShowReport(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg">Cancel</button>
            <button onClick={() => { alert(`Report submitted. Reference: RPT-ACA-${Date.now().toString().slice(-6)}\n\nACA will contact you within 48 hours.`); setShowReport(false) }}
              className="px-5 py-2 text-sm text-white rounded-lg font-medium bg-red-600 hover:bg-red-700">
              Submit Report
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
