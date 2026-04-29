import { useState } from 'react'
import './TankGrid.css'
import { FishSVG } from './FishSVGs'
import { PinIcon, ShareIcon, MuteIcon, ArchiveIcon, PlusIcon } from './Icons'

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

export function TankPreview({ fish, fishWidth = 42, fishHeight = 30 }) {
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
          <FishSVG type={f.type} color={f.color} width={fishWidth} height={fishHeight} />
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

function JoinTankForm({ onJoin }) {
  const [code, setCode]       = useState('')
  const [error, setError]     = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    setError(null)
    const err = await onJoin(code.trim())
    if (err) {
      setError(err)
    } else {
      setSuccess(true)
      setCode('')
      setTimeout(() => setSuccess(false), 2000)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} style={joinStyles.form}>
      <p style={joinStyles.label}>Have an invite code?</p>
      <div style={joinStyles.row}>
        <input
          style={joinStyles.input}
          placeholder="Paste code here…"
          value={code}
          onChange={e => setCode(e.target.value)}
        />
        <button style={joinStyles.btn} type="submit" disabled={loading || !code.trim()}>
          {loading ? '…' : success ? '✓' : 'Join'}
        </button>
      </div>
      {error && <p style={joinStyles.error}>{error}</p>}
    </form>
  )
}

const joinStyles = {
  form:  { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginTop: '24px' },
  label: { fontFamily: "'pt-serif', serif", fontSize: '0.85rem', color: 'rgba(33, 30, 74, 0.5)', margin: 0 },
  row:   { display: 'flex', gap: '8px' },
  input: {
    background: 'rgba(33, 30, 74, 0.06)',
    border: '1px solid rgba(33, 30, 74, 0.2)',
    borderRadius: '10px',
    color: '#211E4A',
    fontFamily: "'pt-serif', serif",
    fontSize: '0.95rem',
    padding: '8px 14px',
    outline: 'none',
    width: '180px',
  },
  btn: {
    background: 'rgba(29, 158, 117, 0.12)',
    border: '1px solid rgba(29, 158, 117, 0.35)',
    borderRadius: '10px',
    color: '#1d9e75',
    fontFamily: "'pt-serif', serif",
    fontSize: '0.95rem',
    padding: '8px 18px',
    cursor: 'pointer',
  },
  error: { fontFamily: "'pt-serif', serif", fontSize: '0.8rem', color: '#ff8a80', margin: 0 },
}

export default function TankGrid({ tanks, tanksLoading, userName, onSelectTank, onAddTank, onJoinTank, onPinTank, onMuteTank, onArchiveTank, onInviteClick, onLogout }) {
  const [showArchived, setShowArchived] = useState(false)

  if (tanksLoading) return (
    <div className="grid-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <span style={{ fontFamily: "'pt-serif', serif", color: '#211E4A', fontSize: '1.2rem' }}>loading your tanks…</span>
    </div>
  )

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
    <div className="grid-page" style={styles.page}>
      <div style={styles.topBar}>
        <div style={styles.headingGroup}>
          <p style={styles.welcomeLabel}>Welcome back,</p>
          <h1 style={styles.heading}>{userName}</h1>
        </div>
        <button style={styles.logoutBtn} onClick={onLogout} title="Sign out">↩ sign out</button>
      </div>
      <div className="grid-layout">
        {visible.map(tank => (
          <div key={tank.id} className="tank-card" style={{ ...styles.cardWrapper, position: 'relative' }}>
            {tank.hasNotification && <div style={styles.notifDot} />}
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
                <PinIcon width={16} height={16} />
              </MgmtBtn>
              <MgmtBtn
                active={false}
                title="Invite members"
                onClick={() => onInviteClick(tank.id)}
              >
                <ShareIcon width={16} height={16} />
              </MgmtBtn>
              <MgmtBtn
                active={tank.muted}
                title={tank.muted ? 'Unmute notifications' : 'Mute notifications'}
                onClick={() => onMuteTank(tank.id)}
              >
                <MuteIcon width={16} height={16} />
              </MgmtBtn>
              <MgmtBtn
                active={tank.archived}
                title={tank.archived ? 'Unarchive tank' : 'Archive tank'}
                onClick={() => onArchiveTank(tank.id)}
              >
                <ArchiveIcon width={16} height={16} />
              </MgmtBtn>
            </div>
          </div>
        ))}

        {/* Add New Tank — always empty, only shown when not viewing archived */}
        {!showArchived && (
          <div className="tank-card" style={{ ...styles.cardWrapper, ...styles.addCard }} onClick={handleAddTank}>
            <div style={styles.previewBox}>
              <div style={{ ...preview.tank, justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
                <PlusIcon width={32} height={32} style={{ color: 'rgba(33, 30, 74, 0.3)' }} />
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

      <JoinTankForm onJoin={onJoinTank} />
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    marginBottom: '32px',
  },
  headingGroup: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
  },
  welcomeLabel: {
    fontFamily: "'pt-serif', serif",
    fontSize: '0.95rem',
    color: 'rgba(33, 30, 74, 0.5)',
    margin: 0,
  },
  heading: {
    fontFamily: "'pt-serif', serif",
    fontSize: '2.4rem',
    color: '#1d9e75',
    letterSpacing: '1px',
    textAlign: 'center',
    margin: 0,
  },
  logoutBtn: {
    position: 'absolute',
    right: 0,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'pt-serif', serif",
    fontSize: '0.85rem',
    color: 'rgba(33, 30, 74, 0.4)',
    padding: '4px 8px',
  },
  grid: {},
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
    border: '1.5px solid rgba(33, 30, 74, 0.12)',
  },
  label: {
    fontFamily: "'pt-serif', serif",
    fontSize: '1rem',
    color: '#211E4A',
    textAlign: 'center',
    cursor: 'pointer',
  },
  pinIndicator: {
    color: '#1d9e75',
    fontSize: '0.65rem',
    verticalAlign: 'middle',
  },
  notifDot: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#e74c3c',
    zIndex: 2,
    pointerEvents: 'none',
  },
  archiveToggle: {
    marginTop: '32px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'pt-serif', serif",
    fontSize: '0.9rem',
    color: 'rgba(33, 30, 74, 0.45)',
    textDecoration: 'underline',
    padding: '4px 8px',
  },
}
