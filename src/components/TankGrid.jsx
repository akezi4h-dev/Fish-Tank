import { useState } from 'react'
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
      <div className="preview-shimmer" style={preview.surface} />

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

      <div style={preview.sand} />
      <div style={preview.glare} />
    </div>
  )
}

function MgmtBtn({ onClick, active, title, children }) {
  return (
    <button
      className={`mgmt-btn${active ? ' mgmt-btn-active' : ''}`}
      title={title}
      onClick={e => { e.stopPropagation(); onClick() }}
    >
      {children}
    </button>
  )
}

export default function TankGrid({ tanks, onSelectTank, onAddTank, onPinTank, onMuteTank, onArchiveTank, onInviteClick }) {
  const [showArchived, setShowArchived] = useState(false)

  function handleAddTank() {
    const name = window.prompt('Name your tank:')
    if (name && name.trim()) onAddTank(name.trim())
  }

  const sorted = [...tanks].sort((a, b) => {
    if (a.pinned === b.pinned) return 0
    return a.pinned ? -1 : 1
  })

  const visible = sorted.filter(t => showArchived ? t.archived : !t.archived)
  const hasArchived = tanks.some(t => t.archived)

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>My Tanks</h1>
      <div style={styles.grid}>
        {visible.map(tank => (
          <div key={tank.id} className="tank-card" style={styles.cardWrapper}>
            <div style={styles.previewBox} onClick={() => onSelectTank(tank.id)}>
              <TankPreview fish={tank.fish} />
            </div>
            <span style={styles.label} onClick={() => onSelectTank(tank.id)}>
              {tank.pinned && <span style={styles.pinIndicator}>● </span>}
              {tank.name}
            </span>
            <div className="mgmt-row">
              <MgmtBtn
                active={tank.pinned}
                title={tank.pinned ? 'Unpin tank' : 'Pin tank'}
                onClick={() => onPinTank(tank.id)}
              >
                ⊙
              </MgmtBtn>
              <MgmtBtn
                active={false}
                title="Invite members"
                onClick={() => onInviteClick(tank.id)}
              >
                ⊕
              </MgmtBtn>
              <MgmtBtn
                active={tank.muted}
                title={tank.muted ? 'Unmute notifications' : 'Mute notifications'}
                onClick={() => onMuteTank(tank.id)}
              >
                {tank.muted ? '◎' : '◉'}
              </MgmtBtn>
              <MgmtBtn
                active={tank.archived}
                title={tank.archived ? 'Unarchive tank' : 'Archive tank'}
                onClick={() => onArchiveTank(tank.id)}
              >
                ▣
              </MgmtBtn>
            </div>
          </div>
        ))}

        {/* Add New Tank — always empty, only shown when not viewing archived */}
        {!showArchived && (
          <div className="tank-card" style={{ ...styles.cardWrapper, ...styles.addCard }} onClick={handleAddTank}>
            <div style={styles.previewBox}>
              <div style={{ ...preview.tank, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                <span style={{ fontSize: '2.2rem', color: '#2a6a7a', fontFamily: "'Patrick Hand', cursive" }}>+</span>
              </div>
            </div>
            <span style={styles.label}>Add New Tank</span>
          </div>
        )}
      </div>

      {hasArchived && (
        <button style={styles.archiveToggle} onClick={() => setShowArchived(v => !v)}>
          {showArchived ? '← back to tanks' : `show archived (${tanks.filter(t => t.archived).length})`}
        </button>
      )}
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
    cursor: 'pointer',
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
  cardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '8px',
    borderRadius: '12px',
    transition: 'transform 0.2s',
    cursor: 'default',
  },
  addCard: {
    opacity: 0.45,
    cursor: 'pointer',
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
    cursor: 'pointer',
  },
  pinIndicator: {
    color: '#7fffd4',
    fontSize: '0.65rem',
    verticalAlign: 'middle',
  },
  archiveToggle: {
    marginTop: '32px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Patrick Hand', cursive",
    fontSize: '0.9rem',
    color: 'rgba(160,216,216,0.5)',
    textDecoration: 'underline',
    padding: '4px 8px',
  },
}
