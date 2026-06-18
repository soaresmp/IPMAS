import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { AGENCIES } from '../data/agencies.js'

export default function Login() {
  const { setCurrentAgency, setCurrentUser } = useApp()
  const navigate = useNavigate()
  const [selectedAgency, setSelectedAgency] = useState(null)
  const [role, setRole] = useState('Inspector/Analyst')
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  function handleSignIn() {
    if (!selectedAgency) { setError('Please select an agency.'); return }
    if (!name.trim()) { setError('Please enter your full name.'); return }
    setCurrentAgency(selectedAgency)
    setCurrentUser({ name: name.trim(), role, email: 'user@go.ke' })
    navigate('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ background: 'linear-gradient(135deg, #006600 0%, #003087 100%)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🇰🇪</div>
          <h1 className="text-3xl font-bold text-gray-900">IPMAS</h1>
          <p className="text-gray-500 mt-1 text-sm">Integrated Product Marking &amp; Authentication System</p>
          <p className="text-gray-400 text-xs mt-1">Government of Kenya — Multi-Agency Platform</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Select Your Agency</label>
          <div className="grid grid-cols-2 gap-3">
            {AGENCIES.map((agency, idx) => (
              <button
                key={agency.id}
                onClick={() => setSelectedAgency(agency)}
                className={`text-left p-3 rounded-xl border-2 transition-all ${idx === 4 ? 'col-span-2' : ''}`}
                style={selectedAgency?.id === agency.id ? { borderColor: agency.color, backgroundColor: agency.color + '10' } : { borderColor: '#e5e7eb' }}
              >
                <div className="flex items-start gap-2">
                  <span className="text-xl">{agency.icon}</span>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{agency.shortName}</div>
                    <div className="text-xs text-gray-500 leading-snug">{agency.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select value={role} onChange={e => setRole(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>System Administrator</option>
              <option>Agency Supervisor</option>
              <option>Inspector/Analyst</option>
              <option>Read-Only</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Enter your full name" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <button onClick={handleSignIn} className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90" style={{ backgroundColor: '#006600' }}>
          Sign In to IPMAS
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">Authorized Government Personnel Only — All activities are logged and monitored.</p>
      </div>
    </div>
  )
}
