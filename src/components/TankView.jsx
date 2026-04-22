import { useState } from 'react'
import './TankView.css'
import { FishSVG } from './FishSVGs'

const SWIM_CLASSES = ['swim-a', 'swim-b', 'swim-c', 'swim-d', 'swim-e']
const SWIM_TOPS    = ['18%', '32%', '50%', '65%', '40%']
// base durations (seconds) per lane — divided by waterSpeed for actual speed
const BASE_DURATIONS = [10, 13, 9, 12, 11]

const SCENES = ['ocean', 'coral', 'deepsea']
const SCENE_LABELS = { ocean: 'Ocean', coral: 'Coral Reef', deepsea: 'Deep Sea' }


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
}) {
  const [activePanel, setActivePanel] = useState(null)
  const [bubblePos, setBubblePos] = useState({ x: 0, y: 0 })

  const hoveredFish = tank.fish.find(f => f.id === selectedFish) ?? null

  const visibleFish = tank.fish.filter(f => {
    if (filterBy.sender !== 'all' && f.senderName !== filterBy.sender) return false
    return true
  })

  function handleFishEnter(fishId, e) {
    onSelectFish(fishId)
    setBubblePos({ x: e.clientX, y: e.clientY })
  }

  function handleFishMove(e) {
    if (selectedFish) setBubblePos({ x: e.clientX, y: e.clientY })
  }

  function handleFishLeave() {
    onSelectFish(null)
  }

  function togglePanel(name) {
    setActivePanel(prev => (prev === name ? null : name))
  }

  function handleSceneClick() {
    const idx = SCENES.indexOf(backgroundScene)
    setScene(SCENES[(idx + 1) % SCENES.length])
  }

  // Scatter bubbles at fixed positions
  const BUBBLES = [
    { left: '12%', bottom: '80px', size: 6, duration: '5s', delay: '0s' },
    { left: '35%', bottom: '60px', size: 4, duration: '7s', delay: '2.1s' },
    { left: '58%', bottom: '90px', size: 8, duration: '6s', delay: '0.8s' },
    { left: '78%', bottom: '70px', size: 5, duration: '8s', delay: '3.5s' },
    { left: '90%', bottom: '85px', size: 3, duration: '5.5s', delay: '1.4s' },
  ]

  return (
    <div className="tank-view">
      {/* Header */}
      <div className="tank-header">
        <button className="tank-back-btn" onClick={onBack}>← Back</button>
        <h2 className="tank-title">{tank.name}</h2>
      </div>

      {/* Tank */}
      <div
        className={`tank-container scene-${backgroundScene} mood-${tankMood}`}
        onMouseMove={handleFishMove}
      >
        <div className="tank-surface" />

        {/* Bubbles */}
        {BUBBLES.map((b, i) => (
          <div
            key={i}
            className="bubble"
            style={{
              left: b.left,
              bottom: b.bottom,
              width: b.size,
              height: b.size,
              animationDuration: b.duration,
              animationDelay: b.delay,
            }}
          />
        ))}

        {/* Fish */}
        {visibleFish.map((fish, i) => (
          <div
            key={fish.id}
            className={`fish-swimmer ${SWIM_CLASSES[i % SWIM_CLASSES.length]}`}
            style={{
              top: SWIM_TOPS[i % SWIM_TOPS.length],
              animationDuration: `${BASE_DURATIONS[i % BASE_DURATIONS.length] / waterSpeed}s`,
              animationDelay: `${-(i * 2.3)}s`,
            }}
            onMouseEnter={e => handleFishEnter(fish.id, e)}
            onMouseLeave={handleFishLeave}
          >
            <FishSVG type={fish.type} color={fish.color} />
          </div>
        ))}

        <div className="tank-floor" />

        {/* Detail bubble */}
        <DetailBubble fish={hoveredFish} x={bubblePos.x} y={bubblePos.y} />
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
      <div className="bottom-nav">
        <button
          className={`nav-btn ${activePanel === 'filter' ? 'active' : ''}`}
          title="Filter"
          onClick={() => togglePanel('filter')}
        >
          ≡
        </button>
        <button
          className={`nav-btn ${activePanel === 'waves' ? 'active' : ''}`}
          title="Waves"
          onClick={() => togglePanel('waves')}
        >
          ≈
        </button>
        <button
          className="nav-btn nav-btn-center"
          title="Add fish"
          onClick={() => { setActivePanel(null); setModalOpen(true) }}
        >
          +
        </button>
        <button
          className={`nav-btn ${tankMood === 'night' ? 'active' : ''}`}
          title={tankMood === 'day' ? 'Switch to night' : 'Switch to day'}
          onClick={toggleMood}
        >
          {tankMood === 'day' ? '☀' : '☽'}
        </button>
        <button
          className="nav-btn"
          title={`Scene: ${SCENE_LABELS[backgroundScene]}`}
          onClick={handleSceneClick}
        >
          ◈
        </button>
      </div>
    </div>
  )
}
