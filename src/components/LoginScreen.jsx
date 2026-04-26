import { useState } from 'react'
import './LoginScreen.css'
import { supabase } from '../supabaseClient'

export default function LoginScreen() {
  const [mode, setMode]         = useState('login')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState(null)
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    let result
    if (mode === 'login') {
      result = await supabase.auth.signInWithPassword({ email, password })
    } else {
      result = await supabase.auth.signUp({ email, password })
    }

    if (result.error) {
      setError(result.error.message)
    }
    setLoading(false)
  }

  function switchMode(next) {
    setMode(next)
    setError(null)
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Tide Lines</h1>
        <p className="login-subtitle">your people, swimming toward you</p>

        <div className="login-toggle">
          <button
            className={`login-toggle-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => switchMode('login')}
          >
            Sign in
          </button>
          <button
            className={`login-toggle-btn ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => switchMode('signup')}
          >
            Create account
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label">Email</label>
            <input
              className="login-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              className="login-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="login-error">{error}</div>}

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? '...' : mode === 'login' ? 'Enter the tank' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  )
}
