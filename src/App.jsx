import { useState, useEffect } from 'react'
import TankGrid from './components/TankGrid'
import TankView from './components/TankView'
import AddFishModal from './components/AddFishModal'
import InviteModal from './components/InviteModal'
import LoginScreen from './components/LoginScreen'
import { supabase } from './supabaseClient'
import './index.css'

function normalizeFish(f) {
  return {
    id:         f.id,
    type:       f.type,
    color:      f.color ?? 0,
    message:    f.message,
    senderName: f.sender_name,
    timestamp:  f.created_at ? f.created_at.split('T')[0] : '',
    createdAt:  f.created_at ?? '',
  }
}

function normalizeTank(t) {
  return {
    id:         t.id,
    name:       t.name,
    pinned:     t.pinned    ?? false,
    muted:      t.muted     ?? false,
    archived:   t.archived  ?? false,
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

  const [tanks, setTanks]                     = useState([])
  const [tanksLoading, setTanksLoading]       = useState(false)
  const [selectedTank, setSelectedTank]       = useState(null)
  const [selectedFish, setSelectedFish]       = useState(null)
  const [filterBy, setFilterBy]               = useState({ sender: 'all', date: 'all' })
  const [waterSpeed, setWaterSpeed]           = useState(1)
  const [waveIntensity, setWaveIntensity]     = useState(1)
  const [tankMood, setTankMood]               = useState('day')
  const [backgroundScene, setBackgroundScene] = useState('sea')
  const [modalOpen, setModalOpen]             = useState(false)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteTargetTank, setInviteTargetTank] = useState(null)

  // ── Fetch all tanks the user owns or has joined ──────
  async function loadTanks(userId) {
    setTanksLoading(true)

    const [ownedRes, memberRes, visitedRes] = await Promise.all([
      supabase
        .from('tanks')
        .select('*, fish(*)')
        .eq('owner_id', userId)
        .order('created_at'),
      supabase
        .from('tank_members')
        .select('tanks(*, fish(*))')
        .eq('user_id', userId),
      supabase
        .from('last_visited')
        .select('tank_id, visited_at')
        .eq('user_id', userId),
    ])

    const visitedMap = {}
    for (const row of (visitedRes.data ?? [])) {
      visitedMap[row.tank_id] = row.visited_at
    }

    const owned = ownedRes.data ?? []
    const joined = (memberRes.data ?? [])
      .map(row => row.tanks)
      .filter(t => t && t.owner_id !== userId)

    setTanks([...owned, ...joined].map(t => {
      const lastVisit = visitedMap[t.id]
      const hasNotification = (t.fish ?? []).some(f =>
        f.created_at && (!lastVisit || new Date(f.created_at) > new Date(lastVisit))
      )
      return { ...normalizeTank(t), hasNotification }
    }))
    setTanksLoading(false)
  }

  useEffect(() => {
    if (!currentUser) { setTanks([]); return }
    loadTanks(currentUser.id)
  }, [currentUser])

  function selectTank(tankId) {
    setSelectedTank(tankId)
    setSelectedFish(null)
    if (tankId && currentUser) {
      supabase.from('last_visited').upsert(
        { user_id: currentUser.id, tank_id: tankId, visited_at: new Date().toISOString() },
        { onConflict: 'user_id,tank_id' }
      )
      setTanks(prev => prev.map(t => t.id === tankId ? { ...t, hasNotification: false } : t))
    }
  }
  function selectFish(fishId)  { setSelectedFish(fishId) }

  // ── Add fish → insert + refetch that tank's fish ─────
  async function addFish(newFish) {
    const { error } = await supabase.from('fish').insert({
      tank_id:     selectedTank,
      type:        newFish.type,
      color:       newFish.color,
      message:     newFish.message,
      sender_name: newFish.senderName,
    })
    if (error) return

    const { data: freshFish } = await supabase
      .from('fish').select('*').eq('tank_id', selectedTank)

    setTanks(prev => prev.map(t =>
      t.id === selectedTank
        ? { ...t, fish: (freshFish ?? []).map(normalizeFish) }
        : t
    ))
    setModalOpen(false)
  }

  // ── Add tank → insert tank + insert member row + refetch
  async function addTank(name) {
    const { data: tank, error } = await supabase
      .from('tanks')
      .insert({ name, owner_id: currentUser.id })
      .select()
      .single()
    if (error) { console.error('addTank insert error:', error); return }
    if (!tank)  { console.error('addTank: no tank returned'); return }

    const { error: memberError } = await supabase
      .from('tank_members')
      .insert({ tank_id: tank.id, user_id: currentUser.id })
    if (memberError) console.error('tank_members insert error:', memberError)

    await loadTanks(currentUser.id)
  }

  // ── Join tank by invite code ─────────────────────────
  async function joinTank(rawCode) {
    if (!currentUser) return 'Sign in first to join a tank.'
    const inviteCode = rawCode.includes('/') ? rawCode.split('/').pop() : rawCode

    const { data: result, error } = await supabase.rpc('join_tank_by_invite', { p_invite_code: inviteCode })

    if (error) return 'Could not join tank.'
    if (result === 'not_found') return 'No tank found with that code.'

    await loadTanks(currentUser.id)
    return null
  }

  // ── Tank toggles ─────────────────────────────────────
  async function pinTank(tankId) {
    const tank = tanks.find(t => t.id === tankId)
    const { error } = await supabase.from('tanks').update({ pinned: !tank.pinned }).eq('id', tankId)
    if (!error) setTanks(prev => prev.map(t => t.id === tankId ? { ...t, pinned: !t.pinned } : t))
  }

  async function muteTank(tankId) {
    const tank = tanks.find(t => t.id === tankId)
    const { error } = await supabase.from('tanks').update({ muted: !tank.muted }).eq('id', tankId)
    if (!error) setTanks(prev => prev.map(t => t.id === tankId ? { ...t, muted: !t.muted } : t))
  }

  async function archiveTank(tankId) {
    const tank = tanks.find(t => t.id === tankId)
    const { error } = await supabase.from('tanks').update({ archived: !tank.archived }).eq('id', tankId)
    if (!error) setTanks(prev => prev.map(t => t.id === tankId ? { ...t, archived: !t.archived } : t))
  }

  function openInvite(tankId)  { setInviteTargetTank(tankId); setInviteModalOpen(true) }
  function closeInvite()       { setInviteModalOpen(false); setInviteTargetTank(null) }
  function onFilterChange(f)   { setFilterBy(prev => ({ ...prev, ...f })) }
  function toggleMood()        { setTankMood(prev => prev === 'day' ? 'night' : 'day') }
  function setScene(scene)     { setBackgroundScene(scene) }
  async function handleLogout(){ await supabase.auth.signOut() }

  if (authLoading) return null
  if (!currentUser) return <LoginScreen onJoinTank={joinTank} />

  if (!selectedTank) {
    const inviteTank = tanks.find(t => t.id === inviteTargetTank) ?? null
    return (
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        <TankGrid
          tanks={tanks}
          tanksLoading={tanksLoading}
          onSelectTank={selectTank}
          onAddTank={addTank}
          onJoinTank={joinTank}
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
