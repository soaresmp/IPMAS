import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { AGENCIES } from '../data/agencies'
import { Shield, ChevronRight } from 'lucide-react'

const roles = [
  'System Administrator',
  'Agency Supervisor',
  'Inspector / Analyst',
  'Read-Only Viewer',
]

export default function Login() {
  const { setCurrentAgency, setCurrentUser } = useApp()
  const navigate = useNavigate()
  const [selectedAgency, setSelectedAgency] = useState(null)
  const [role, setRole] = useState(roles[0])
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSignIn = () => {
    if (!selectedAgency) { setError('Please select an agency.'); return }
    if (!name.trim()) { setError('Please enter your name.'); return }
    setCurrentAgency(selectedAgency)
    setCurrentUser({ name: name.trim(), role, email: `${name.toLowerCase().replace(/\s+/g,'.')}@${selectedAgency.id.toLowerCase()}.go.ke` })
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #003087 0%, #006600 50%, #003087 100%)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="text-center px-8 pt-8 pb-6" style={{ background: 'linear-gradient(135deg, #003087, #006600)' }}>
          <div className="text-5xl mb-3">🛡️</div>
          <h1 className="text-2xl font-bold text-white">IPMAS</h1>
          <p className="text-green-200 text-sm mt-1">Integrated Product Marking & Authentication System</p>
          <p className="text-blue-200 text-xs mt-1">Government of Kenya — Inter-Agency Platform</p>
        </div>

        <div className="px-8 py-6">
          {/* Kenya flag stripe */}
          <div className="flex rounded-md overflow-hidden mb-6 h-1.5">
            <div className="flex-1 bg-black" />
            <div className="flex-1" style={{ backgroundColor: '#BB0000' }} />
            <div className="flex-1 bg-black" />
            <div className="flex-1" style={{ backgroundColor: '#006600' }} />
            <div className="flex-1 bg-black" />
          </div>

          <h2 className="text-sm font-semibold text-gray-700 mb-3">Select your Agency</h2>
          <div className="grid grid-cols-1 gap-2 mb-5">
            {AGENCIES.map((agency) => (
              <button
                key={agency.id}
                onClick={() => { setSelectedAgency(agency); setError('') }}
                className={`flex items-center gap-4 p-3 rounded-xl border-2 text-left transition-all ${
                  selectedAgency?.id === agency.id
                    ? 'shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={selectedAgency?.id === agency.id ? { borderColor: agency.color, backgroundColor: agency.lightColor } : {}}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: agency.color }}>
                  {agency.shortName.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm">{agency.shortName}</div>
                  <div className="text-xs text-gray-500 truncate">{agency.name}</div>
                </div>
                <div className="text-xs text-gray-400 text-right hidden sm:block">
                  <div>{agency.markType}</div>
                </div>
                {selectedAgency?.id === agency.id && (
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: agency.color }}>
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Your Name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. James Mwangi"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {roles.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          {error && <p className="text-red-600 text-xs mb-3">{error}</p>}

          <button
            onClick={handleSignIn}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: selectedAgency?.color || '#003087' }}
          >
            Sign in to IPMAS <ChevronRight size={16} />
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Authorized government personnel only • Integrated Government of Kenya Mark Act, 2022
          </p>
        </div>
      </div>
    </div>
  )
}
