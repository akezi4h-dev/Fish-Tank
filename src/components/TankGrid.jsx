import './TankGrid.css'

const FISH_COLORS = ['#f4a261', '#e07a3a']

function TankPreview({ fish }) {
  return (
    <svg viewBox="0 0 160 120" width="100%" style={{ display: 'block' }}>
      {/* tank body */}
      <rect x="4" y="4" width="152" height="112" rx="10" ry="10"
        fill="#061a2e" stroke="#1a4a5a" strokeWidth="3" />

      {/* water shimmer layer */}
      <rect className="water-shimmer" x="6" y="6" width="148" height="108" rx="8"
        fill="url(#waterGrad)" />

      {/* gradient def */}
      <defs>
        <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d3a5c" />
          <stop offset="100%" stopColor="#061a2e" />
        </linearGradient>
      </defs>

      {/* bubbles */}
      <circle className="bubble bubble-a" cx="30" cy="100" r="2" fill="none" stroke="#2a6a7a" strokeWidth="1" />
      <circle className="bubble bubble-b" cx="80" cy="105" r="1.5" fill="none" stroke="#2a6a7a" strokeWidth="1" />
      <circle className="bubble bubble-c" cx="120" cy="98" r="2.5" fill="none" stroke="#2a6a7a" strokeWidth="1" />

      {/* sand floor */}
      <ellipse cx="80" cy="113" rx="72" ry="6" fill="#1a3a2a" opacity="0.7" />

      {/* animated fish — translate is handled entirely by CSS keyframes */}
      {fish.slice(0, 4).map((f, i) => (
        <g key={f.id} className={`fish-${i}`}
          style={{ filter: `hue-rotate(${f.color}deg)` }}>
          <ellipse cx="0" cy="0" rx="13" ry="7" fill={FISH_COLORS[0]} />
          <polygon points="-13,0 -21,-6 -21,6" fill={FISH_COLORS[1]} />
          <circle cx="8" cy="-2" r="2" fill="#0a0a1a" />
          <circle cx="8.8" cy="-2.5" r="0.8" fill="#fff" />
        </g>
      ))}

      {/* tank glass glare */}
      <rect x="8" y="8" width="40" height="6" rx="3" fill="white" opacity="0.06" />
    </svg>
  )
}

export default function TankGrid({ tanks, onSelectTank, onAddTank }) {
  function handleAddTank() {
    const name = window.prompt('Name your tank:')
    if (name && name.trim()) {
      onAddTank(name.trim())
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>My Tanks</h1>
      <div style={styles.grid}>
        {tanks.map(tank => (
          <button
            key={tank.id}
            className="tank-card"
            style={styles.card}
            onClick={() => onSelectTank(tank.id)}
          >
            <div style={styles.previewBox}>
              <TankPreview fish={tank.fish} />
            </div>
            <span style={styles.label}>{tank.name}</span>
          </button>
        ))}

        <button className="tank-card" style={{ ...styles.card, ...styles.addCard }} onClick={handleAddTank}>
          <div style={styles.previewBox}>
            <svg viewBox="0 0 160 120" width="100%" style={{ display: 'block' }}>
              <rect x="4" y="4" width="152" height="112" rx="10" ry="10"
                fill="none" stroke="#1a4a5a" strokeWidth="3" strokeDasharray="8 4" />
              <text x="80" y="66" textAnchor="middle"
                fill="#2a6a7a" fontSize="40" fontFamily="Patrick Hand, cursive">+</text>
            </svg>
          </div>
          <span style={styles.label}>Add New Tank</span>
        </button>
      </div>
    </div>
  )
}

const styles = {
  page: {
    padding: '40px 32px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heading: {
    fontFamily: "'Patrick Hand', cursive",
    fontSize: '2.4rem',
    color: '#7fffd4',
    marginBottom: '32px',
    letterSpacing: '1px',
    textAlign: 'center',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    maxWidth: '800px',
    width: '100%',
  },
  card: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    padding: '8px',
    borderRadius: '12px',
    transition: 'transform 0.2s',
  },
  addCard: {
    opacity: 0.45,
  },
  previewBox: {
    width: '100%',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '2px solid #1a4a5a',
  },
  label: {
    fontFamily: "'Patrick Hand', cursive",
    fontSize: '1rem',
    color: '#a0d8d8',
    textAlign: 'center',
  },
}
