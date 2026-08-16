import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { AGENCIES } from '../data/agencies.js'
import { DEMO_USERS } from '../data/users.js'
import { Eye, EyeOff, ChevronDown, ChevronUp, Building2, Briefcase, AlertCircle } from 'lucide-react'

const agencyMap = Object.fromEntries(AGENCIES.map(a => [a.id, a]))

const AGENCY_COLORS_BG = {
  KRA: '#003087', KEBS: '#006600', ACA: '#BB0000', KEPHIS: '#228B22',
  PPB: '#1a5276', VMD: '#5D4037', PCPB: '#4527A0', KEPROBA: '#E65100',
}

function FlagStripe({ heights = [7, 6, 9] }) {
  return (
    <div className="w-full flex-shrink-0" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: heights[0] + 'px', backgroundColor: '#0F0F0F' }} />
      <div style={{ height: heights[1] + 'px', backgroundColor: '#BB0000' }} />
      <div style={{ height: heights[2] + 'px', backgroundColor: '#006600' }} />
    </div>
  )
}

function AgencyChip({ agency }) {
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold text-white"
      style={{ backgroundColor: (AGENCY_COLORS_BG[agency.id] || '#006600') + '55', border: '1px solid rgba(255,255,255,0.15)' }}>
      <span style={{ fontSize: '13px' }}>{agency.icon}</span>
      <span style={{ letterSpacing: '0.04em' }}>{agency.shortName}</span>
    </div>
  )
}

export default function Login() {
  const { setCurrentAgency, setCurrentUser } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [showDemo, setShowDemo] = useState(false)
  const [demoTab, setDemoTab] = useState('agency')

  const agencyUsers = DEMO_USERS.filter(u => u.userType === 'agency')
  const operatorUsers = DEMO_USERS.filter(u => u.userType === 'operator')

  function handleSignIn(e) {
    e.preventDefault()
    setError('')
    const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    if (!user) {
      setError('Invalid email or password.')
      return
    }
    setCurrentAgency(agencyMap[user.agencyId])
    setCurrentUser({
      name: user.name,
      role: user.role,
      email: user.email,
      userType: user.userType,
      operatorId: user.operatorId || null,
      company: user.company || null,
      operatorType: user.operatorType || null,
      note: user.note || null,
      agencies: user.agencies || [user.agencyId],
    })
    navigate('/')
  }

  function fillCredential(user) {
    setEmail(user.email)
    setPassword(user.password)
    setError('')
    setShowDemo(false)
  }

  return (
    <div className="flex flex-col md:flex-row" style={{ minHeight: '100vh' }}>

      {/* ── Left branding panel ──────────────────────────────────── */}
      <div className="hidden md:flex flex-col md:w-5/12"
        style={{ backgroundColor: '#1A5C1A', position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>

        <FlagStripe heights={[7, 6, 10]} />

        {/* Subtle diagonal pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0, top: '23px',
          backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 40px, rgba(0,0,0,0.08) 40px, rgba(0,0,0,0.08) 41px)',
          pointerEvents: 'none',
        }} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '3rem 2.5rem', position: 'relative', zIndex: 1 }}>

          {/* Shield logo */}
          <svg viewBox="0 0 72 84" width="80" height="94" style={{ marginBottom: '1.75rem', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>
            <defs>
              <clipPath id="shield">
                <path d="M4,4 H68 V52 Q68,80 36,80 Q4,80 4,52 Z" />
              </clipPath>
            </defs>
            <rect x="4" y="4" width="64" height="24" fill="#0F0F0F" clipPath="url(#shield)" />
            <rect x="4" y="28" width="64" height="24" fill="#BB0000" clipPath="url(#shield)" />
            <rect x="4" y="52" width="64" height="28" fill="#006600" clipPath="url(#shield)" />
            {/* Spear */}
            <line x1="36" y1="4" x2="36" y2="80" stroke="white" strokeWidth="2" opacity="0.85" clipPath="url(#shield)" />
            {/* Maasai shield ellipses */}
            <ellipse cx="24" cy="40" rx="7" ry="11" fill="white" opacity="0.85" clipPath="url(#shield)" />
            <ellipse cx="48" cy="40" rx="7" ry="11" fill="white" opacity="0.85" clipPath="url(#shield)" />
            <ellipse cx="24" cy="40" rx="4" ry="7" fill="#BB0000" clipPath="url(#shield)" />
            <ellipse cx="48" cy="40" rx="4" ry="7" fill="#BB0000" clipPath="url(#shield)" />
            {/* Shield outline */}
            <path d="M4,4 H68 V52 Q68,80 36,80 Q4,80 4,52 Z" fill="none" stroke="white" strokeWidth="2.5" />
          </svg>

          {/* Wordmark */}
          <h1 style={{
            fontFamily: 'Georgia, Cambria, "Times New Roman", serif',
            fontSize: '3.75rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em',
            lineHeight: 1, marginBottom: '0.6rem', textAlign: 'center',
          }}>IPMAS</h1>

          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', textAlign: 'center', lineHeight: 1.5, maxWidth: '280px', marginBottom: '0.5rem' }}>
            Integrated Product Marking<br />& Authentication System
          </p>

          {/* Mini flag divider */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', margin: '1.25rem 0' }}>
            <div style={{ width: '18px', height: '4px', backgroundColor: '#0F0F0F', borderRadius: '2px' }} />
            <div style={{ width: '18px', height: '4px', backgroundColor: '#BB0000', borderRadius: '2px' }} />
            <div style={{ width: '18px', height: '4px', backgroundColor: '#006600', borderRadius: '2px' }} />
          </div>

          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textAlign: 'center', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2.5rem' }}>
            Government of Kenya · Multi-Agency Platform
          </p>

          {/* Agency chips */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', width: '100%', maxWidth: '300px' }}>
            {AGENCIES.map(a => <AgencyChip key={a.id} agency={a} />)}
          </div>
        </div>

        {/* Bottom notice */}
        <div style={{ padding: '1rem 2rem', borderTop: '1px solid rgba(255,255,255,0.08)', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', textAlign: 'center', letterSpacing: '0.05em' }}>
            ALL ACTIVITIES LOGGED & MONITORED · AUTHORIZED USERS ONLY
          </p>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: '#F4FAF4', minHeight: '100vh' }}>

        {/* Mobile header */}
        <div className="md:hidden" style={{ backgroundColor: '#0A2A0A' }}>
          <FlagStripe heights={[5, 4, 7]} />
          <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '6px', backgroundColor: '#006600', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg viewBox="0 0 72 84" width="20" height="23">
                <defs><clipPath id="s2"><path d="M4,4 H68 V52 Q68,80 36,80 Q4,80 4,52 Z"/></clipPath></defs>
                <rect x="4" y="4" width="64" height="24" fill="#111" clipPath="url(#s2)"/>
                <rect x="4" y="28" width="64" height="24" fill="#BB0000" clipPath="url(#s2)"/>
                <rect x="4" y="52" width="64" height="28" fill="#006600" clipPath="url(#s2)"/>
                <line x1="36" y1="4" x2="36" y2="80" stroke="white" strokeWidth="3" clipPath="url(#s2)"/>
                <path d="M4,4 H68 V52 Q68,80 36,80 Q4,80 4,52 Z" fill="none" stroke="white" strokeWidth="3"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: 'Georgia, serif', color: 'white', fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.01em' }}>IPMAS</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Government of Kenya</div>
            </div>
          </div>
        </div>

        {/* Form area */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem' }}>
          <div style={{ width: '100%', maxWidth: '420px' }}>

            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'Georgia, Cambria, serif', fontSize: '1.65rem', fontWeight: 700, color: '#0A1F0A', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
                Sign in to IPMAS
              </h2>
              <p style={{ color: '#4a6a4a', fontSize: '0.85rem' }}>
                Enter your government or operator email address
              </p>
            </div>

            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#2a4a2a', marginBottom: '0.45rem' }}>
                  Email address
                </label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="officer@agency.go.ke"
                  required autoComplete="username"
                  style={{
                    width: '100%', padding: '0.7rem 0.9rem',
                    border: '1.5px solid #c8d8c8', borderRadius: '6px',
                    fontSize: '0.9rem', color: '#0A1F0A', backgroundColor: 'white',
                    outline: 'none', boxSizing: 'border-box',
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#006600'; e.target.style.boxShadow = '0 0 0 3px rgba(0,102,0,0.12)' }}
                  onBlur={e => { e.target.style.borderColor = '#c8d8c8'; e.target.style.boxShadow = 'none' }}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#2a4a2a', marginBottom: '0.45rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required autoComplete="current-password"
                    style={{
                      width: '100%', padding: '0.7rem 2.8rem 0.7rem 0.9rem',
                      border: '1.5px solid #c8d8c8', borderRadius: '6px',
                      fontSize: '0.9rem', color: '#0A1F0A', backgroundColor: 'white',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.15s, box-shadow 0.15s',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#006600'; e.target.style.boxShadow = '0 0 0 3px rgba(0,102,0,0.12)' }}
                    onBlur={e => { e.target.style.borderColor = '#c8d8c8'; e.target.style.boxShadow = 'none' }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#7a9a7a', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 0.9rem', backgroundColor: '#fff5f5', border: '1px solid #fecaca', borderRadius: '6px', color: '#c0392b', fontSize: '0.82rem' }}>
                  <AlertCircle size={14} />
                  {error} Try a demo credential below.
                </div>
              )}

              {/* Sign In button */}
              <button type="submit"
                style={{
                  width: '100%', padding: '0.8rem', borderRadius: '6px', border: 'none',
                  backgroundColor: '#006600', color: 'white', fontSize: '0.9rem', fontWeight: 600,
                  cursor: 'pointer', letterSpacing: '0.02em', transition: 'background-color 0.15s',
                  marginTop: '0.25rem',
                }}
                onMouseOver={e => e.target.style.backgroundColor = '#005500'}
                onMouseOut={e => e.target.style.backgroundColor = '#006600'}>
                Sign In to IPMAS
              </button>
            </form>

            {/* Demo credentials */}
            <div style={{ marginTop: '1.75rem' }}>
              <button
                onClick={() => setShowDemo(!showDemo)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.65rem 0.9rem', borderRadius: '6px', border: '1px solid #c8d8c8',
                  backgroundColor: 'white', color: '#2a4a2a', fontSize: '0.8rem', fontWeight: 600,
                  cursor: 'pointer', letterSpacing: '0.04em', textTransform: 'uppercase',
                }}>
                <span>Demo Credentials</span>
                {showDemo ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>

              {showDemo && (
                <div style={{ marginTop: '0.5rem', border: '1px solid #c8d8c8', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'white' }}>

                  {/* Tabs */}
                  <div style={{ display: 'flex', borderBottom: '1px solid #e8f0e8' }}>
                    {[{ key: 'agency', label: 'Agency Officers', icon: Building2 }, { key: 'operator', label: 'Operators', icon: Briefcase }].map(({ key, label, icon: Icon }) => (
                      <button key={key} onClick={() => setDemoTab(key)}
                        style={{
                          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                          padding: '0.6rem 0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
                          letterSpacing: '0.03em',
                          backgroundColor: demoTab === key ? '#f0f7f0' : 'white',
                          color: demoTab === key ? '#006600' : '#6a8a6a',
                          borderBottom: demoTab === key ? '2px solid #006600' : '2px solid transparent',
                        }}>
                        <Icon size={13} /> {label}
                      </button>
                    ))}
                  </div>

                  {/* Credential list */}
                  <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                    {(demoTab === 'agency' ? agencyUsers : operatorUsers).map(user => {
                      const agency = agencyMap[user.agencyId]
                      return (
                        <button key={user.email} onClick={() => fillCredential(user)}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.7rem 0.9rem', border: 'none', borderBottom: '1px solid #f0f7f0',
                            backgroundColor: 'white', cursor: 'pointer', textAlign: 'left',
                            transition: 'background-color 0.12s',
                          }}
                          onMouseOver={e => e.currentTarget.style.backgroundColor = '#f4faf4'}
                          onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
                          <div style={{
                            width: '32px', height: '32px', borderRadius: '6px', flexShrink: 0,
                            backgroundColor: (AGENCY_COLORS_BG[user.agencyId] || '#006600') + '22',
                            border: `1.5px solid ${AGENCY_COLORS_BG[user.agencyId] || '#006600'}55`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px',
                          }}>
                            {agency?.icon}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0A1F0A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {user.name}
                            </div>
                            <div style={{ fontSize: '0.7rem', color: '#5a7a5a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {user.userType === 'operator' ? user.company : agency?.name} · {user.role}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#8aaa8a', fontFamily: 'monospace', marginTop: '1px' }}>
                              {user.email}
                            </div>
                          </div>
                          <div style={{
                            fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                            padding: '2px 6px', borderRadius: '3px', flexShrink: 0,
                            backgroundColor: user.userType === 'operator' ? '#fff3e0' : '#e8f5e9',
                            color: user.userType === 'operator' ? '#e65100' : '#2e7d32',
                          }}>
                            {user.userType === 'operator' ? user.operatorType : 'Agency'}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <div style={{ padding: '0.5rem 0.9rem', backgroundColor: '#f8fbf8', borderTop: '1px solid #e8f0e8' }}>
                    <p style={{ fontSize: '0.68rem', color: '#8aaa8a' }}>Password for all demo accounts: <strong style={{ color: '#2a4a2a', fontFamily: 'monospace' }}>ipmas2024</strong></p>
                  </div>
                </div>
              )}
            </div>

            <p style={{ marginTop: '1.5rem', fontSize: '0.68rem', color: '#9aaa9a', textAlign: 'center', lineHeight: 1.5 }}>
              Authorized personnel only. All sessions are recorded and monitored in accordance with the<br />
              Kenya Information &amp; Communications Act.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
