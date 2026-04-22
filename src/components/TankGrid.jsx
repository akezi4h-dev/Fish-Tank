import './TankGrid.css'
import { FishSVG } from './FishSVGs'

const SLOTS = [
  { left: '12%', top: '18%', animClass: 'preview-a', delay: '0s'  },
  { left: '50%', top: '46%', animClass: 'preview-b', delay: '-4s' },
  { left: '28%', top: '68%', animClass: 'preview-c', delay: '-7s' },
]

const BUBBLES = [
  { left: '20%', bottom: '14px', size: 4, dur: '4s',   delay: '0s'   },
  { left: '60%', bottom: '10px', size: 3, dur: '5.5s', delay: '-2s'  },
  { left: '80%', bottom: '16px', size: 5, dur: '3.8s', delay: '-1s'  },
]

function TankPreview({ fish }) {
  const previewFish = fish.slice(-3)

  return (
    <div style={preview.tank}>
      {/* water surface shimmer */}
      <div className="preview-shimmer" style={preview.surface} />

      {/* bubbles */}
      {BUBBLES.map((b, i) => (
        <div
          key={i}
          className="preview-bubble"
          style={{
            position: 'absolute',
            left: b.left,
            bottom: b.bottom,
            width: b.size,
            height: b.size,
            borderRadius: '50%',
            border: '1px solid rgba(100,200,220,0.45)',
            animationDuration: b.dur,
            animationDelay: b.delay,
          }}
        />
      ))}

      {/* fish — reusing FishSVG from Screen 2, scaled down */}
      {previewFish.map((f, i) => (
        <div
          key={f.id}
          className={SLOTS[i].animClass}
          style={{
            position: 'absolute',
            left: SLOTS[i].left,
            top: SLOTS[i].top,
            animationDelay: SLOTS[i].delay,
          }}
        >
          <FishSVG type={f.type} color={f.color} width={42} height={30} />
        </div>
      ))}

      {/* sand floor */}
      <div style={preview.sand} />
      {/* glass glare */}
      <div style={preview.glare} />
    </div>
  )
}

export default function TankGrid({ tanks, onSelectTank, onAddTank }) {
  function handleAddTank() {
    const name = window.prompt('Name your tank:')
    if (name && name.trim()) onAddTank(name.trim())
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

        {/* Add New Tank — always empty */}
        <button className="tank-card" style={{ ...styles.card, ...styles.addCard }} onClick={handleAddTank}>
          <div style={styles.previewBox}>
            <div style={{ ...preview.tank, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
              <span style={{ fontSize: '2.2rem', color: '#2a6a7a', fontFamily: "'Patrick Hand', cursive" }}>+</span>
            </div>
          </div>
          <span style={styles.label}>Add New Tank</span>
        </button>
      </div>
    </div>
  )
}

const preview = {
  tank: {
    position: 'relative',
    width: '100%',
    aspectRatio: '4 / 3',
    overflow: 'hidden',
    background: 'linear-gradient(to bottom, #0d3a5c 0%, #061a2e 100%)',
    borderRadius: '8px',
  },
  surface: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: '20px',
    background: 'linear-gradient(to bottom, rgba(13,58,92,0.7), transparent)',
    pointerEvents: 'none',
  },
  sand: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: '14px',
    background: 'radial-gradient(ellipse 80% 100% at 50% 100%, #1a3a2a 0%, transparent 100%)',
    pointerEvents: 'none',
  },
  glare: {
    position: 'absolute',
    top: '8px', left: '8px',
    width: '36px', height: '5px',
    borderRadius: '3px',
    background: 'rgba(255,255,255,0.06)',
    pointerEvents: 'none',
  },
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
    gap: '32px',
    maxWidth: '1100px',
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
