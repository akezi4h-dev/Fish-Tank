import { useState, useEffect } from 'react'
import TankGrid from './components/TankGrid'
import TankView from './components/TankView'
import AddFishModal from './components/AddFishModal'
import InviteModal from './components/InviteModal'
import LoginScreen from './components/LoginScreen'
import { supabase } from './supabaseClient'
import './index.css'

const INITIAL_TANKS = [
  {
    id: 'tank-01',
    name: 'Castro Family Fishtank',
    pinned: false,
    muted: false,
    archived: false,
    fish: [
      {
        id: 'fish-01',
        type: 'clownfish',
        color: 0,
        message: 'Miss you! Eat something warm today.',
        senderName: 'Mom',
        timestamp: '2026-04-18',
      },
      {
        id: 'fish-02',
        type: 'angelfish',
        color: 200,
        message: 'Come home soon okay? We saved your seat.',
        senderName: 'Dad',
        timestamp: '2026-04-19',
      },
    ],
  },
  {
    id: 'tank-02',
    name: 'Study Abroad Squad',
    pinned: false,
    muted: false,
    archived: false,
    fish: [
      {
        id: 'fish-03',
        type: 'betta',
        color: 280,
        message: 'Did you try that ramen place yet??',
        senderName: 'Priya',
        timestamp: '2026-04-17',
      },
      {
        id: 'fish-04',
        type: 'goldfish',
        color: 40,
        message: 'Sending good vibes for your finals week.',
        senderName: 'Leo',
        timestamp: '2026-04-20',
      },
    ],
  },
]

export default function App() {
  const [currentUser, setCurrentUser]   = useState(null)
  const [authLoading, setAuthLoading]   = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null)
      setAuthLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const [tanks, setTanks] = useState(INITIAL_TANKS)
  const [selectedTank, setSelectedTank] = useState(null)
  const [selectedFish, setSelectedFish] = useState(null)
  const [filterBy, setFilterBy] = useState({ sender: 'all', date: 'all' })
  const [waterSpeed, setWaterSpeed] = useState(1)
  const [waveIntensity, setWaveIntensity] = useState(1)
  const [tankMood, setTankMood] = useState('day')
  const [backgroundScene, setBackgroundScene] = useState('sea')
  const [modalOpen, setModalOpen] = useState(false)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteTargetTank, setInviteTargetTank] = useState(null)

  function selectTank(tankId) {
    setSelectedTank(tankId)
    setSelectedFish(null)
  }

  function selectFish(fishId) {
    setSelectedFish(fishId)
  }

  function addFish(newFish) {
    setTanks(prev =>
      prev.map(tank =>
        tank.id === selectedTank
          ? { ...tank, fish: [...tank.fish, newFish] }
          : tank
      )
    )
    setModalOpen(false)
  }

  function addTank(name) {
    const id = `tank-${Date.now()}`
    setTanks(prev => [...prev, { id, name, pinned: false, muted: false, archived: false, fish: [] }])
  }

  function pinTank(tankId) {
    setTanks(prev =>
      prev.map(t => t.id === tankId ? { ...t, pinned: !t.pinned } : t)
    )
  }

  function muteTank(tankId) {
    setTanks(prev =>
      prev.map(t => t.id === tankId ? { ...t, muted: !t.muted } : t)
    )
  }

  function archiveTank(tankId) {
    setTanks(prev =>
      prev.map(t => t.id === tankId ? { ...t, archived: !t.archived } : t)
    )
  }

  function openInvite(tankId) {
    setInviteTargetTank(tankId)
    setInviteModalOpen(true)
  }

  function closeInvite() {
    setInviteModalOpen(false)
    setInviteTargetTank(null)
  }

  function onFilterChange(newFilter) {
    setFilterBy(prev => ({ ...prev, ...newFilter }))
  }

  function toggleMood() {
    setTankMood(prev => (prev === 'day' ? 'night' : 'day'))
  }

  function setScene(scene) {
    setBackgroundScene(scene)
  }

  if (authLoading) return null

  if (!currentUser) return <LoginScreen />

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  if (!selectedTank) {
    const inviteTank = tanks.find(t => t.id === inviteTargetTank) ?? null
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <TankGrid
          tanks={tanks}
          onSelectTank={selectTank}
          onAddTank={addTank}
          onPinTank={pinTank}
          onMuteTank={muteTank}
          onArchiveTank={archiveTank}
          onInviteClick={openInvite}
          onLogout={handleLogout}
        />
        {inviteModalOpen && inviteTank && (
          <InviteModal tank={inviteTank} onClose={closeInvite} />
        )}
      </div>
    )
  }

  const currentTank = tanks.find(t => t.id === selectedTank)

  return (
    <>
      <TankView
        tank={currentTank}
        selectedFish={selectedFish}
        filterBy={filterBy}
        waterSpeed={waterSpeed}
        waveIntensity={waveIntensity}
        tankMood={tankMood}
        backgroundScene={backgroundScene}
        onSelectFish={selectFish}
        onFilterChange={onFilterChange}
        setWaterSpeed={setWaterSpeed}
        setWaveIntensity={setWaveIntensity}
        toggleMood={toggleMood}
        setScene={setScene}
        setModalOpen={setModalOpen}
        onBack={() => selectTank(null)}
      />
      {modalOpen && (
        <AddFishModal
          onAddFish={addFish}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  )
}
