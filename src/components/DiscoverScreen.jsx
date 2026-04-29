import { useState } from 'react'
import { TankPreview } from './TankGrid'
import TankView from './TankView'
import AddFishModal from './AddFishModal'
import './DiscoverScreen.css'

const PLACEHOLDER_TANKS = [
  {
    id: 'd1', name: 'Midnight Reef', members: 3,
    isPublic: true, pinned: false, muted: false, archived: false, inviteCode: null,
    fish: [
      { id: 'f1', type: 'clownfish',  color: 0,   message: 'The ocean misses you 🌊',         senderName: 'Marina', timestamp: '2026-04-20', createdAt: '2026-04-20T10:00:00Z' },
      { id: 'f2', type: 'turtle',     color: 120, message: 'Slow and steady 🐢',               senderName: 'Reef',   timestamp: '2026-04-21', createdAt: '2026-04-21T14:30:00Z' },
    ],
  },
  {
    id: 'd2', name: 'Sunken Kelp Forest', members: 7,
    isPublic: true, pinned: false, muted: false, archived: false, inviteCode: null,
    fish: [
      { id: 'f3', type: 'eel',        color: 200, message: 'Hidden in the kelp 🌿',            senderName: 'Cove',  timestamp: '2026-04-19', createdAt: '2026-04-19T09:00:00Z' },
      { id: 'f4', type: 'angelfish',  color: 60,  message: 'Sunlight filters down ✨',          senderName: 'Pearl', timestamp: '2026-04-22', createdAt: '2026-04-22T11:00:00Z' },
    ],
  },
  {
    id: 'd3', name: 'The Bioluminescent Bay', members: 12,
    isPublic: true, pinned: false, muted: false, archived: false, inviteCode: null,
    fish: [
      { id: 'f5', type: 'pufferfish', color: 280, message: 'Glowing in the dark 💙',           senderName: 'Lumi',  timestamp: '2026-04-18', createdAt: '2026-04-18T20:00:00Z' },
      { id: 'f6', type: 'shark',      color: 210, message: 'Deep blue everything 🦈',           senderName: 'Storm', timestamp: '2026-04-23', createdAt: '2026-04-23T08:00:00Z' },
    ],
  },
  {
    id: 'd4', name: 'Coral Drift', members: 2,
    isPublic: true, pinned: false, muted: false, archived: false, inviteCode: null,
    fish: [
      { id: 'f7', type: 'lionfish',   color: 15,  message: 'Drifting with the current 🌸',     senderName: 'Coral', timestamp: '2026-04-24', createdAt: '2026-04-24T16:00:00Z' },
    ],
  },
]

export default function DiscoverScreen() {
  const [tanks,          setTanks]          = useState(PLACEHOLDER_TANKS)
  const [selectedTankId, setSelectedTankId] = useState(null)
  const [modalOpen,      setModalOpen]      = useState(false)

  const [selectedFish,    setSelectedFish]    = useState(null)
  const [filterBy,        setFilterBy]        = useState({ sender: 'all' })
  const [waterSpeed,      setWaterSpeed]      = useState(1)
  const [waveIntensity,   setWaveIntensity]   = useState(1)
  const [tankMood,        setTankMood]        = useState('day')
  const [backgroundScene, setBackgroundScene] = useState('sea')

  const selectedTank = tanks.find(t => t.id === selectedTankId) ?? null

  function handleAddFish(newFish) {
    const id        = `local-${Date.now()}`
    const enterFrom = Math.random() < 0.5 ? 'left' : 'right'
    setTanks(prev => prev.map(t =>
      t.id === selectedTankId
        ? { ...t, fish: [...t.fish, {
            id, type: newFish.type, color: newFish.color,
            message: newFish.message, senderName: newFish.senderName,
            timestamp: new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            isNew: true, enterFrom,
          }] }
        : t
    ))
    setModalOpen(false)
    setTimeout(() => {
      setTanks(prev => prev.map(t => ({
        ...t,
        fish: t.fish.map(f => f.id === id ? { ...f, isNew: false } : f),
      })))
    }, 2500)
  }

  function handleBack() {
    setSelectedTankId(null)
    setSelectedFish(null)
  }

  if (selectedTank) {
    return (
      <>
        <TankView
          tank={selectedTank}
          selectedFish={selectedFish}
          filterBy={filterBy}
          waterSpeed={waterSpeed}
          waveIntensity={waveIntensity}
          tankMood={tankMood}
          backgroundScene={backgroundScene}
          onSelectFish={setSelectedFish}
          onFilterChange={f => setFilterBy(prev => ({ ...prev, ...f }))}
          setWaterSpeed={setWaterSpeed}
          setWaveIntensity={setWaveIntensity}
          toggleMood={() => setTankMood(prev => prev === 'day' ? 'night' : 'day')}
          setScene={setBackgroundScene}
          setModalOpen={setModalOpen}
          onBack={handleBack}
          isDiscover
        />
        {modalOpen && (
          <AddFishModal
            onAddFish={handleAddFish}
            onClose={() => setModalOpen(false)}
          />
        )}
      </>
    )
  }

  return (
    <div className="grid-page" style={S.page}>
      {/* Header — exact same structure as home page */}
      <div style={S.topBar}>
        <div style={S.headingGroup}>
          <p style={S.welcomeLabel}>Explore some</p>
          <h1 style={S.heading}>tanks</h1>
        </div>
      </div>

      {/* Grid — same class and card structure as home page */}
      <div className="grid-layout">
        {tanks.map(tank => (
          <div
            key={tank.id}
            className="tank-card"
            style={S.cardWrapper}
            onClick={() => setSelectedTankId(tank.id)}
          >
            <div style={S.previewBox}>
              <TankPreview fish={tank.fish} />
            </div>
            <span style={S.label}>{tank.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Style constants copied verbatim from TankGrid styles ── */
const S = {
  page: {
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
  },
  topBar: {
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
    position:        'relative',
    width:           '100%',
    marginBottom:    '32px',
  },
  headingGroup: {
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    gap:            '2px',
  },
  welcomeLabel: {
    fontFamily: "'pt-serif', serif",
    fontSize:   '0.95rem',
    color:      'rgba(33, 30, 74, 0.5)',
    margin:     0,
  },
  heading: {
    fontFamily:     "'pt-serif', serif",
    fontSize:       '2.4rem',
    color:          '#1d9e75',
    letterSpacing:  '1px',
    textAlign:      'center',
    margin:         0,
  },
  cardWrapper: {
    display:       'flex',
    flexDirection: 'column',
    alignItems:    'center',
    gap:           '8px',
    padding:       '8px',
    borderRadius:  '12px',
    transition:    'transform 0.2s',
    cursor:        'pointer',
  },
  previewBox: {
    width:        '100%',
    borderRadius: '10px',
    overflow:     'hidden',
    border:       '1.5px solid rgba(33, 30, 74, 0.12)',
  },
  label: {
    fontFamily: "'pt-serif', serif",
    fontSize:   '1rem',
    color:      '#211E4A',
    textAlign:  'center',
    cursor:     'pointer',
  },
}
