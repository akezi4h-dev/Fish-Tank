import { useState } from 'react'
import './LoginScreen.css'
import { supabase } from '../supabaseClient'
import { TankPreview } from './TankGrid'

const MOCK_TANKS = [
  { id: 1, name: 'Ocean Drift',   fish: [{ id:1, type:'clownfish',  color:0 }, { id:2, type:'angelfish', color:1 }, { id:3, type:'turtle',    color:2 }] },
  { id: 2, name: 'Coral Cove',    fish: [{ id:4, type:'otter',      color:3 }, { id:5, type:'pufferfish',color:0 }, { id:6, type:'eel',        color:1 }] },
  { id: 3, name: 'Deep Blue',     fish: [{ id:7, type:'shark',      color:1 }, { id:8, type:'seal',      color:2 }, { id:9, type:'otter',      color:0 }] },
  { id: 4, name: 'Kelp Forest',   fish: [{ id:10,type:'lionfish',   color:0 }, { id:11,type:'turtle',    color:1 }, { id:12,type:'clownfish',  color:3 }] },
  { id: 5, name: 'Tide Pool',     fish: [{ id:13,type:'pufferfish', color:2 }, { id:14,type:'angelfish', color:0 }, { id:15,type:'eel',        color:1 }] },
  { id: 6, name: 'Midnight Reef', fish: [{ id:16,type:'shark',      color:3 }, { id:17,type:'lionfish',  color:0 }, { id:18,type:'seal',       color:2 }] },
]

const CARDS = [...MOCK_TANKS, ...MOCK_TANKS]

function Carousel() {
  return (
    <div className="carousel-root">
      <div className="carousel-track">
        {CARDS.map((tank, i) => (
          <div key={i} className="carousel-card">
            <div className="carousel-preview-box">
              <TankPreview fish={tank.fish} fishWidth={65} fishHeight={46} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LoginScreen({ onJoinTank }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(null)
  const [loading,  setLoading]  = useState(false)

  const [joinCode,    setJoinCode]    = useState('')
  const [joinError,   setJoinError]   = useState(null)
  const [joinLoading, setJoinLoading] = useState(false)
  const [joinSuccess, setJoinSuccess] = useState(false)

  async function handleAuth(mode) {
    setError(null)
    setLoading(true)
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    if (result.error) setError(result.error.message)
    setLoading(false)
  }

  async function handleJoin(e) {
    e.preventDefault()
    if (!joinCode.trim()) return
    setJoinLoading(true)
    setJoinError(null)
    const err = await onJoinTank(joinCode.trim())
    if (err) {
      setJoinError(err)
    } else {
      setJoinSuccess(true)
      setJoinCode('')
      setTimeout(() => setJoinSuccess(false), 2000)
    }
    setJoinLoading(false)
  }

  return (
    <div className="login-page">
      <Carousel />

      <div className="login-sheet">
        <h1 className="login-title">Tide Lines</h1>
        <p className="login-subtitle">your people, swimming toward you</p>

        <div className="login-fields">
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="login-auth-row">
          <button
            className="login-btn"
            onClick={() => handleAuth('login')}
            disabled={loading || !email || !password}
          >
            {loading ? '...' : 'Sign in'}
          </button>
          <button
            className="login-btn login-btn-outline"
            onClick={() => handleAuth('signup')}
            disabled={loading || !email || !password}
          >
            {loading ? '...' : 'Sign up'}
          </button>
        </div>

        <div className="login-divider" />

        <form className="login-join-row" onSubmit={handleJoin}>
          <input
            className="login-input login-join-input"
            placeholder="Invite code"
            value={joinCode}
            onChange={e => setJoinCode(e.target.value)}
          />
          <button
            className="login-btn login-join-btn"
            type="submit"
            disabled={joinLoading || !joinCode.trim()}
          >
            {joinLoading ? '…' : joinSuccess ? '✓' : 'Join'}
          </button>
        </form>
        {joinError && <p className="login-join-error">{joinError}</p>}
      </div>
    </div>
  )
}
