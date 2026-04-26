import { useState, useEffect } from 'react'
import TankGrid from './components/TankGrid'
import TankView from './components/TankView'
import AddFishModal from './components/AddFishModal'
import InviteModal from './components/InviteModal'
import LoginScreen from './components/LoginScreen'
import { supabase } from './supabaseClient'
import './index.css'

// Map Supabase snake_case rows to the shape the rest of the app expects
function normalizeFish(f) {
  return {
    id:         f.id,
    type:       f.type,
    color:      f.color ?? 0,
    message:    f.message,
    senderName: f.sender_name,
    timestamp:  f.created_at ? f.created_at.split('T')[0] : '',
  }
}

function normalizeTank(t) {
  return {
    id:         t.id,
    name:       t.name,
    pinned:     t.pinned ?? false,
    muted:      t.muted  ?? false,
    archived:   t.archived ?? false,
    inviteCode: t.invite_code ?? t.id,
    fish:       (t.fish ?? []).map(normalizeFish),
  }
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

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

  const [tanks, setTanks]               = useState([])
  const [tanksLoading, setTanksLoading] = useState(false)
  const [selectedTank, setSelectedTank] = useState(null)
  const [selectedFish, setSelectedFish] = useState(null)
  const [filterBy, setFilterBy]         = useState({ sender: 'all', date: 'all' })
  const [waterSpeed, setWaterSpeed]     = useState(1)
  const [waveIntensity, setWaveIntensity] = useState(1)
  const [tankMood, setTankMood]         = useState('day')
  const [backgroundScene, setBackgroundScene] = useState('sea')
  const [modalOpen, setModalOpen]       = useState(false)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteTargetTank, setInviteTargetTank] = useState(null)

  // Load tanks (with fish) whenever the logged-in user changes
  useEffect(() => {
    if (!currentUser) { setTanks([]); return }
    setTanksLoading(true)
    supabase
      .from('tanks')
      .select('*, fish(*)')
      .eq('owner_id', currentUser.id)
      .order('created_at')
      .then(({ data, error }) => {
        if (!error) setTanks((data ?? []).map(normalizeTank))
        setTanksLoading(false)
      })
  }, [currentUser])

  function selectTank(tankId) {
    setSelectedTank(tankId)
    setSelectedFish(null)
  }

  function selectFish(fishId) {
    setSelectedFish(fishId)
  }

  async function addFish(newFish) {
    const { data, error } = await supabase
      .from('fish')
      .insert({
        tank_id:     selectedTank,
        type:        newFish.type,
        color:       newFish.color,
        message:     newFish.message,
        sender_name: newFish.senderName,
      })
      .select()
      .single()
    if (!error) {
      setTanks(prev => prev.map(t =>
        t.id === selectedTank
          ? { ...t, fish: [...t.fish, normalizeFish(data)] }
          : t
      ))
      setModalOpen(false)
    }
  }

  async function addTank(name) {
    const { data, error } = await supabase
      .from('tanks')
      .insert({ name, owner_id: currentUser.id })
      .select('*, fish(*)')
      .single()
    if (!error) setTanks(prev => [...prev, normalizeTank(data)])
  }

  async function pinTank(tankId) {
    const tank = tanks.find(t => t.id === tankId)
    const { error } = await supabase
      .from('tanks').update({ pinned: !tank.pinned }).eq('id', tankId)
    if (!error) setTanks(prev => prev.map(t => t.id === tankId ? { ...t, pinned: !t.pinned } : t))
  }

  async function muteTank(tankId) {
    const tank = tanks.find(t => t.id === tankId)
    const { error } = await supabase
      .from('tanks').update({ muted: !tank.muted }).eq('id', tankId)
    if (!error) setTanks(prev => prev.map(t => t.id === tankId ? { ...t, muted: !t.muted } : t))
  }

  async function archiveTank(tankId) {
    const tank = tanks.find(t => t.id === tankId)
    const { error } = await supabase
      .from('tanks').update({ archived: !tank.archived }).eq('id', tankId)
    if (!error) setTanks(prev => prev.map(t => t.id === tankId ? { ...t, archived: !t.archived } : t))
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

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  if (authLoading) return null
  if (!currentUser) return <LoginScreen />

  if (!selectedTank) {
    const inviteTank = tanks.find(t => t.id === inviteTargetTank) ?? null
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <TankGrid
          tanks={tanks}
          tanksLoading={tanksLoading}
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
