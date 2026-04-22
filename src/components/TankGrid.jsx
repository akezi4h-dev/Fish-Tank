function TankPreview({ fish }) {
  return (
    <svg viewBox="0 0 160 120" width="100%" style={{ display: 'block' }}>
      {/* tank body */}
      <rect x="4" y="4" width="152" height="112" rx="10" ry="10"
        fill="#061a2e" stroke="#1a4a5a" strokeWidth="3" />
      {/* water surface shimmer */}
      <rect x="4" y="4" width="152" height="18" rx="10" ry="10"
        fill="#0d2d45" opacity="0.7" />
      {/* sand floor */}
      <ellipse cx="80" cy="112" rx="72" ry="8" fill="#1a3a2a" opacity="0.6" />
      {/* fish previews */}
      {fish.slice(0, 4).map((f, i) => {
        const x = 28 + (i % 2) * 80
        const y = 45 + Math.floor(i / 2) * 35
        return (
          <g key={f.id} transform={`translate(${x}, ${y})`}
            style={{ filter: `hue-rotate(${f.color}deg)` }}>
            <ellipse cx="0" cy="0" rx="14" ry="8" fill="#f4a261" />
            <polygon points="-14,0 -22,-7 -22,7" fill="#e07a3a" />
            <circle cx="9" cy="-2" r="2" fill="#1a1a2e" />
          </g>
        )
      })}
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
            style={styles.card}
            onClick={() => onSelectTank(tank.id)}
          >
            <div style={styles.previewBox}>
              <TankPreview fish={tank.fish} />
            </div>
            <span style={styles.label}>{tank.name}</span>
          </button>
        ))}

        <button style={{ ...styles.card, ...styles.addCard }} onClick={handleAddTank}>
          <div style={styles.previewBox}>
            <svg viewBox="0 0 160 120" width="100%" style={{ display: 'block' }}>
              <rect x="4" y="4" width="152" height="112" rx="10" ry="10"
                fill="none" stroke="#1a4a5a" strokeWidth="3" strokeDasharray="8 4" />
              <text x="80" y="66" textAnchor="middle"
                fill="#1a4a5a" fontSize="36" fontFamily="Patrick Hand, cursive">+</text>
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
  },
  heading: {
    fontFamily: "'Patrick Hand', cursive",
    fontSize: '2.4rem',
    color: '#7fffd4',
    marginBottom: '32px',
    letterSpacing: '1px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    maxWidth: '800px',
    margin: '0 auto',
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
    opacity: 0.5,
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
