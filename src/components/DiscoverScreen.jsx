import { useState } from 'react'
import './DiscoverScreen.css'

const PLACEHOLDER_TANKS = [
  { id: 1, name: 'Midnight Reef',          members: 3  },
  { id: 2, name: 'Sunken Kelp Forest',     members: 7  },
  { id: 3, name: 'The Bioluminescent Bay', members: 12 },
  { id: 4, name: 'Coral Drift',            members: 2  },
]

export default function DiscoverScreen() {
  const [joined, setJoined] = useState(new Set())
  const [toast,  setToast]  = useState(null)

  function handleJoin(tank) {
    if (joined.has(tank.id)) return
    setJoined(prev => new Set([...prev, tank.id]))
    setToast(`Joined "${tank.name}"!`)
    setTimeout(() => setToast(null), 2200)
  }

  return (
    <div className="discover-page">
      <h1 className="discover-heading">Discover Tanks</h1>
      <p className="discover-sub">Find public tanks to explore and join</p>

      <div className="discover-list">
        {PLACEHOLDER_TANKS.map(tank => (
          <div key={tank.id} className="discover-card">
            <span className="discover-wave">🌊</span>
            <div className="discover-info">
              <span className="discover-name">{tank.name}</span>
              <span className="discover-members">{tank.members} members</span>
            </div>
            <button
              className={`discover-join-btn${joined.has(tank.id) ? ' discover-join-done' : ''}`}
              onClick={() => handleJoin(tank)}
              disabled={joined.has(tank.id)}
            >
              {joined.has(tank.id) ? 'Joined ✓' : 'Join'}
            </button>
          </div>
        ))}
      </div>

      {toast && <div className="discover-toast">{toast}</div>}
    </div>
  )
}
