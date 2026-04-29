import { useState, useEffect, useRef, Fragment } from 'react'
import './TankView.css'
import { FishSVG } from './FishSVGs'
import WaterEffect from './WaterEffect'
import { FilterIcon, WaveIcon, PlusIcon, SunIcon, MoonIcon, LocationIcon } from './Icons'
import seaBg    from '../assets/sea.png'
import jungleBg from '../assets/jungle.png'
import deepBg   from '../assets/deep.png'

const SWIM_CLASSES = ['swim-a', 'swim-b', 'swim-c', 'swim-d', 'swim-e']
const SWIM_TOPS    = ['18%', '32%', '50%', '65%', '40%']
// base durations (seconds) per lane — divided by waterSpeed for actual speed
const BASE_DURATIONS = [10, 13, 9, 12, 11]

const SCENES = ['sea', 'jungle', 'deep']
const SCENE_LABELS = { sea: 'Sea', jungle: 'Jungle', deep: 'Deep' }
const SCENE_BG = { sea: seaBg, jungle: jungleBg, deep: deepBg }

const navBarStyle = {
  backdropFilter:         'blur(12px)',
  WebkitBackdropFilter:   'blur(12px)',
  border:                 '0.5px solid rgba(255,255,255,0.1)',
  borderRadius:           '999px',
  padding:                '10px 24px',
  position:               'fixed',
  bottom:                 '24px',
  left:                   '50%',
  transform:              'translateX(-50%)',
  display:                'flex',
  alignItems:             'center',
  gap:                    '8px',
  zIndex:                 100,
}

const SCENE_THEME = {
  sea:    { day: 'rgba(26,  74, 107, 0.92)', night: 'rgba(10,  31,  48, 0.95)', text: '#ffffff' },
  jungle: { day: 'rgba(26,  42,  26, 0.92)', night: 'rgba(10,  18,  10, 0.95)', text: '#ffffff' },
  deep:   { day: 'rgba( 2,  12,  31, 0.92)', night: 'rgba( 1,   8,  16, 0.95)', text: '#ffffff' },
}


function EntryBubbles({ enterFrom, fishTop }) {
  const [bubbles] = useState(() => {
    const count = 6 + Math.floor(Math.random() * 3) // 6–8
    return Array.from({ length: count }, (_, i) => ({
      id:       i,
      size:     6 + Math.random() * 8,              // 6–14px
      xOffset:  -30 + Math.random() * 60,           // -30 to +30px
      duration: 1.5 + Math.random() * 1,            // 1.5–2.5s
      delay:    Math.random() * 0.8,                // 0–0.8s
    }))
  })
  const [dismissed, setDismissed] = useState(new Set())

  const centerLeft = enterFrom === 'left' ? '12%' : '82%'

  return (
    <>
      {bubbles.filter(b => !dismissed.has(b.id)).map(b => (
        <div
          key={b.id}
          className="entry-bubble"
          style={{
            left:             `calc(${centerLeft} + ${b.xOffset}px)`,
            top:              fishTop,
            width:            b.size,
            height:           b.size,
            animationDuration: `${b.duration}s`,
            animationDelay:    `${b.delay}s`,
          }}
          onAnimationEnd={() => setDismissed(prev => new Set([...prev, b.id]))}
        />
      ))}
    </>
  )
}

function ClickBubbles({ x, y, onDone }) {
  const [bubbles] = useState(() => {
    const count = 6 + Math.floor(Math.random() * 3)
    return Array.from({ length: count }, (_, i) => ({
      id:       i,
      size:     6 + Math.random() * 8,
      xOffset:  -30 + Math.random() * 60,
      duration: 1.5 + Math.random() * 1,
      delay:    Math.random() * 0.8,
    }))
  })
  const [dismissed, setDismissed] = useState(new Set())

  function dismiss(id) {
    setDismissed(prev => {
      const next = new Set([...prev, id])
      if (next.size === bubbles.length) onDone()
      return next
    })
  }

  return (
    <>
      {bubbles.filter(b => !dismissed.has(b.id)).map(b => (
        <div
          key={b.id}
          className="entry-bubble"
          style={{
            left:              x + b.xOffset,
            top:               y,
            width:             b.size,
            height:            b.size,
            animationDuration: `${b.duration}s`,
            animationDelay:    `${b.delay}s`,
          }}
          onAnimationEnd={() => dismiss(b.id)}
        />
      ))}
    </>
  )
}

function DetailBubble({ fish, x, y }) {
  if (!fish) return null
  const style = {
    left: Math.min(x + 12, window.innerWidth - 240),
    top: y - 10,
  }
  return (
    <div className="detail-bubble" style={style}>
      <div className="sender">{fish.senderName}</div>
      <div className="message">{fish.message}</div>
      <div className="timestamp">{fish.timestamp}</div>
    </div>
  )
}

function FilterPanel({ fish, filterBy, onFilterChange }) {
  const senders = ['all', ...new Set(fish.map(f => f.senderName))]
  return (
    <div className="nav-panel">
      <div className="panel-title">Filter by sender</div>
      <div className="filter-chips">
        {senders.map(s => (
          <button
            key={s}
            className={`filter-chip ${filterBy.sender === s ? 'selected' : ''}`}
            onClick={() => onFilterChange({ sender: s })}
          >
            {s === 'all' ? 'Everyone' : s}
          </button>
        ))}
      </div>
    </div>
  )
}

function WavesPanel({ waterSpeed, waveIntensity, setWaterSpeed, setWaveIntensity }) {
  return (
    <div className="nav-panel">
      <div className="panel-title">Water controls</div>
      <div className="panel-row">
        <span className="panel-label">Speed</span>
        <input
          type="range" min="0.3" max="3" step="0.1"
          value={waterSpeed}
          className="panel-slider"
          onChange={e => setWaterSpeed(parseFloat(e.target.value))}
        />
      </div>
      <div className="panel-row">
        <span className="panel-label">Waves</span>
        <input
          type="range" min="0" max="3" step="0.1"
          value={waveIntensity}
          className="panel-slider"
          onChange={e => setWaveIntensity(parseFloat(e.target.value))}
        />
      </div>
    </div>
  )
}

export default function TankView({
  tank,
  selectedFish,
  filterBy,
  waterSpeed,
  waveIntensity,
  tankMood,
  backgroundScene,
  onSelectFish,
  onFilterChange,
  setWaterSpeed,
  setWaveIntensity,
  toggleMood,
  setScene,
  setModalOpen,
  onBack,
  tankIndex    = 0,
  tankCount    = 1,
  onPrevTank   = () => {},
  onNextTank   = () => {},
  isTransitioning = false,
}) {
  const theme    = SCENE_THEME[backgroundScene] ?? SCENE_THEME.sea
  const barColor = theme[tankMood] ?? theme.day

  const [activePanel,     setActivePanel]     = useState(null)
  const [bubblePos,       setBubblePos]       = useState({ x: 0, y: 0 })
  const [hoveredFishId,   setHoveredFishId]   = useState(null)
  const [clickBubbleSets, setClickBubbleSets] = useState([])
  const tankRef = useRef(null)

  const stoppedFish = tank.fish.find(f => f.id === selectedFish) ?? null
  const hoverFish   = tank.fish.find(f => f.id === hoveredFishId) ?? null
  const bubbleFish  = stoppedFish ?? hoverFish

  const visibleFish = tank.fish.filter(f => {
    if (filterBy.sender !== 'all' && f.senderName !== filterBy.sender) return false
    return true
  })

  function handleFishEnter(fishId, e) {
    setHoveredFishId(fishId)
    if (!selectedFish) setBubblePos({ x: e.clientX, y: e.clientY })
  }

  function handleFishMove(e) {
    if (hoveredFishId && !selectedFish) setBubblePos({ x: e.clientX, y: e.clientY })
  }

  function handleFishLeave() {
    setHoveredFishId(null)
  }

  function handleFishClick(fishId, e) {
    e.stopPropagation()
    if (selectedFish === fishId) {
      onSelectFish(null)
    } else {
      onSelectFish(fishId)
      setBubblePos({ x: e.clientX, y: e.clientY })
    }
    // Spawn rising bubbles at the click point, relative to the tank container
    if (tankRef.current) {
      const rect = tankRef.current.getBoundingClientRect()
      setClickBubbleSets(prev => [
        ...prev,
        { id: Date.now(), x: e.clientX - rect.left, y: e.clientY - rect.top },
      ])
    }
  }

  function handleTankClick() {
    if (selectedFish) onSelectFish(null)
  }

  function togglePanel(name) {
    setActivePanel(prev => (prev === name ? null : name))
  }

  function handleSceneClick() {
    const idx = SCENES.indexOf(backgroundScene)
    setScene(SCENES[(idx + 1) % SCENES.length])
  }

  // ── Ambient bubble spawner ────────────────────────────
  const [ambientBubbles, setAmbientBubbles] = useState([])

  useEffect(() => {
    let mounted = true
    let timerId

    function spawnNext() {
      timerId = setTimeout(() => {
        if (!mounted || !tankRef.current) return
        const w    = tankRef.current.offsetWidth
        const size = 4 + Math.random() * 10                    // 4–14 px
        const left = Math.random() * Math.max(0, w - size)
        const dur  = 4 + Math.random() * 4                     // 4–8 s
        setAmbientBubbles(prev => [
          ...prev,
          { id: `ab-${Date.now()}-${Math.random()}`, size, left, dur },
        ])
        spawnNext()
      }, 600 + Math.random() * 300)                            // 600–900 ms gap
    }

    spawnNext()
    return () => { mounted = false; clearTimeout(timerId) }
  }, [])

  return (
    <div className="tank-view">
      {/* Header */}
      <div className="tank-header" style={{ background: barColor, color: theme.text, transition: 'background 0.4s ease, color 0.4s ease' }}>
        <button className="tank-back-btn" onClick={onBack}>← Back</button>

        {/* Tank title flanked by header nav arrows */}
        <div className="tank-header-center">
          <button
            className={`tank-header-arrow${tankIndex === 0 ? ' tank-nav-arrow-dim' : ''}`}
            onClick={onPrevTank}
            disabled={tankIndex === 0 || isTransitioning}
            aria-label="Previous tank"
          >
            ←
          </button>
          <h2 className="tank-title">{tank.name}</h2>
          <button
            className={`tank-header-arrow${tankIndex === tankCount - 1 ? ' tank-nav-arrow-dim' : ''}`}
            onClick={onNextTank}
            disabled={tankIndex === tankCount - 1 || isTransitioning}
            aria-label="Next tank"
          >
            →
          </button>
        </div>
      </div>

      {/* Tank */}
      <div
        ref={tankRef}
        className={`tank-container mood-${tankMood}`}
        style={{ backgroundImage: `url(${SCENE_BG[backgroundScene]})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        onMouseMove={handleFishMove}
        onClick={handleTankClick}
      >
        <div className="tank-surface" />
        <WaterEffect speed={waveIntensity} />

        {/* Left/right navigation arrows (appear on hover of tank body) */}
        <button
          className={`tank-nav-arrow tank-nav-arrow-left${tankIndex === 0 ? ' tank-nav-arrow-dim' : ''}`}
          onClick={onPrevTank}
          disabled={tankIndex === 0 || isTransitioning}
          aria-label="Previous tank"
        >
          ←
        </button>
        <button
          className={`tank-nav-arrow tank-nav-arrow-right${tankIndex === tankCount - 1 ? ' tank-nav-arrow-dim' : ''}`}
          onClick={onNextTank}
          disabled={tankIndex === tankCount - 1 || isTransitioning}
          aria-label="Next tank"
        >
          →
        </button>

        {/* Ambient bubbles */}
        {ambientBubbles.map(b => (
          <div
            key={b.id}
            className="ambient-bubble"
            style={{
              width:             b.size,
              height:            b.size,
              left:              b.left,
              bottom:            0,
              animationDuration: `${b.dur}s`,
            }}
            onAnimationEnd={() =>
              setAmbientBubbles(prev => prev.filter(ab => ab.id !== b.id))
            }
          />
        ))}

        {/* Fish */}
        {visibleFish.map((fish, i) => {
          const isStopped  = fish.id === selectedFish
          const isEntering = fish.isNew === true
          const enterDir   = fish.enterFrom ?? 'left'
          const fishTop    = SWIM_TOPS[i % SWIM_TOPS.length]
          return (
            <Fragment key={fish.id}>
              <div
                className={`fish-swimmer${isEntering ? '' : ` ${SWIM_CLASSES[i % SWIM_CLASSES.length]}`}${isStopped ? ' fish-stopped' : ''}`}
                style={isEntering ? {
                  top:       fishTop,
                  animation: `fish-enter-from-${enterDir} 1.5s ease-out forwards`,
                } : {
                  top:                fishTop,
                  animationDuration:  `${BASE_DURATIONS[i % BASE_DURATIONS.length] / waterSpeed}s`,
                  animationDelay:     `${-(i * 2.3)}s`,
                  animationPlayState: isStopped ? 'paused' : 'running',
                }}
                onMouseEnter={e => handleFishEnter(fish.id, e)}
                onMouseLeave={handleFishLeave}
                onClick={e => handleFishClick(fish.id, e)}
              >
                <FishSVG type={fish.type} color={fish.color} width={100} height={71} />
              </div>
              {isEntering && (
                <EntryBubbles enterFrom={enterDir} fishTop={fishTop} />
              )}
            </Fragment>
          )
        })}

        {/* Click bubbles */}
        {clickBubbleSets.map(set => (
          <ClickBubbles
            key={set.id}
            x={set.x}
            y={set.y}
            onDone={() => setClickBubbleSets(prev => prev.filter(s => s.id !== set.id))}
          />
        ))}

        {/* Detail bubble */}
        <DetailBubble fish={bubbleFish} x={bubblePos.x} y={bubblePos.y} />
      </div>

      {/* Panels */}
      {activePanel === 'filter' && (
        <FilterPanel
          fish={tank.fish}
          filterBy={filterBy}
          onFilterChange={onFilterChange}
        />
      )}
      {activePanel === 'waves' && (
        <WavesPanel
          waterSpeed={waterSpeed}
          waveIntensity={waveIntensity}
          setWaterSpeed={setWaterSpeed}
          setWaveIntensity={setWaveIntensity}
        />
      )}

      {/* Bottom nav */}
      <div className="bottom-nav" style={{ ...navBarStyle, background: barColor, transition: 'background 0.4s ease' }}>
        <button
          className={`nav-btn ${activePanel === 'filter' ? 'active' : ''}`}
          title="Filter"
          onClick={() => togglePanel('filter')}
        >
          <FilterIcon width={18} height={18} />
        </button>
        <button
          className={`nav-btn ${activePanel === 'waves' ? 'active' : ''}`}
          title="Waves"
          onClick={() => togglePanel('waves')}
        >
          <WaveIcon width={18} height={18} />
        </button>
        <button
          className="nav-btn nav-btn-center"
          title="Add fish"
          onClick={() => { setActivePanel(null); setModalOpen(true) }}
        >
          <PlusIcon width={20} height={20} />
        </button>
        <button
          className={`nav-btn ${tankMood === 'night' ? 'active' : ''}`}
          title={tankMood === 'day' ? 'Switch to night' : 'Switch to day'}
          onClick={toggleMood}
        >
          {tankMood === 'day' ? <SunIcon width={18} height={18} /> : <MoonIcon width={18} height={18} />}
        </button>
        <button
          className="nav-btn"
          title={`Scene: ${SCENE_LABELS[backgroundScene]}`}
          onClick={handleSceneClick}
        >
          <LocationIcon width={18} height={18} />
        </button>
      </div>
    </div>
  )
}
