import { useState, useEffect } from 'react'
import TankGrid from './components/TankGrid'
import TankView from './components/TankView'
import AddFishModal from './components/AddFishModal'
import InviteModal from './components/InviteModal'
import LoginScreen from './components/LoginScreen'
import BottomNav from './components/BottomNav'
import SwipeTankView from './components/SwipeTankView'
import SettingsScreen from './components/SettingsScreen'
import HelpScreen from './components/HelpScreen'
import DiscoverScreen from './components/DiscoverScreen'
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

function generateProfileCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const rand4 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `TL-${rand4}`
}

function normalizeTank(t) {
  return {
    id:         t.id,
    name:       t.name,
    pinned:     t.pinned    ?? false,
    muted:      t.muted     ?? false,
    archived:   t.archived  ?? false,
    isPublic:   t.is_public ?? false,
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
      setAuthLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const [tanks, setTanks]                     = useState([])
  const [tanksLoading, setTanksLoading]       = useState(false)
  const [selectedTank, setSelectedTank]       = useState(null)
  const [currentScreen, setCurrentScreen]     = useState('home')
  const [swipeTankIndex, setSwipeTankIndex]   = useState(0)
  const [selectedFish, setSelectedFish]       = useState(null)
  const [filterBy, setFilterBy]               = useState({ sender: 'all', date: 'all' })
  const [waterSpeed, setWaterSpeed]           = useState(1)
  const [waveIntensity, setWaveIntensity]     = useState(1)
  const [tankMood, setTankMood]               = useState('day')
  const [backgroundScene, setBackgroundScene] = useState('sea')
  const [modalOpen, setModalOpen]             = useState(false)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteTargetTank, setInviteTargetTank] = useState(null)

  // ── Tank navigation / slide transition ───────────────
  const [prevTankId,      setPrevTankId]      = useState(null)
  const [slideDirection,  setSlideDirection]  = useState(null)   // 'prev' | 'next'
  const [isTransitioning, setIsTransitioning] = useState(false)

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
    // Assign a profile code on first login if the user doesn't have one yet
    if (!currentUser.user_metadata?.profile_code) {
      const code = generateProfileCode()
      supabase.auth.updateUser({ data: { profile_code: code } })
    }
  }, [currentUser?.id])

  // ── Clear isNew flag 2.5s after a fish enters ────────
  const newFishIds = tanks.flatMap(t => t.fish).filter(f => f.isNew).map(f => f.id).join(',')
  useEffect(() => {
    if (!newFishIds) return
    const ids = newFishIds.split(',').filter(Boolean)
    const timers = ids.map(id =>
      setTimeout(() => {
        setTanks(prev => prev.map(t => ({
          ...t,
          fish: t.fish.map(f => f.id === id ? { ...f, isNew: false } : f),
        })))
      }, 2500)
    )
    return () => timers.forEach(clearTimeout)
  }, [newFishIds])

  async function selectTank(tankId) {
    setSelectedTank(tankId)
    setSelectedFish(null)
    if (tankId && currentUser) {
      await supabase
        .from('last_visited')
        .upsert(
          { user_id: currentUser.id, tank_id: tankId, visited_at: new Date().toISOString() },
          { onConflict: 'user_id,tank_id' }
        )
      setTanks(prev => prev.map(t => t.id === tankId ? { ...t, hasNotification: false } : t))
    }
  }
  function selectFish(fishId)  { setSelectedFish(fishId) }

  // ── Add fish → insert + refetch that tank's fish ─────
  async function addFish(newFish, tankId = selectedTank) {
    const { data: inserted, error } = await supabase.from('fish').insert({
      tank_id:     tankId,
      type:        newFish.type,
      color:       newFish.color,
      message:     newFish.message,
      sender_name: newFish.senderName,
    }).select().single()
    if (error) return

    const { data: freshFish } = await supabase
      .from('fish').select('*').eq('tank_id', tankId)

    const newId     = inserted?.id
    const enterFrom = Math.random() < 0.5 ? 'left' : 'right'

    setTanks(prev => prev.map(t =>
      t.id === tankId
        ? { ...t, fish: (freshFish ?? []).map(f => ({
              ...normalizeFish(f),
              isNew:     f.id === newId,
              enterFrom: f.id === newId ? enterFrom : undefined,
            })) }
        : t
    ))
    if (tankId === selectedTank) setModalOpen(false)
  }

  // ── Add tank → insert tank + insert member row + refetch
  async function addTank(name, isPublic = false) {
    const { data: tank, error } = await supabase
      .from('tanks')
      .insert({ name, owner_id: currentUser.id, is_public: isPublic })
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

  function navigateTank(direction) {
    if (isTransitioning) return
    const active = tanks.filter(t => !t.archived)
    const idx    = active.findIndex(t => t.id === selectedTank)
    const next   = direction === 'next' ? idx + 1 : idx - 1
    if (next < 0 || next >= active.length) return
    const nextId = active[next].id
    setPrevTankId(selectedTank)
    setSlideDirection(direction)
    setIsTransitioning(true)
    selectTank(nextId)
    setTimeout(() => {
      setPrevTankId(null)
      setSlideDirection(null)
      setIsTransitioning(false)
    }, 380)
  }

  function openInvite(tankId)  { setInviteTargetTank(tankId); setInviteModalOpen(true) }
  function closeInvite()       { setInviteModalOpen(false); setInviteTargetTank(null) }
  function onFilterChange(f)   { setFilterBy(prev => ({ ...prev, ...f })) }
  function toggleMood()        { setTankMood(prev => prev === 'day' ? 'night' : 'day') }
  function setScene(scene)     { setBackgroundScene(scene) }
  async function handleLogout(){ await supabase.auth.signOut() }

  if (authLoading) return (
    <div style={{ width: '100vw', height: '100vh', background: '#04101e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: "'pt-serif', serif", fontSize: '1.4rem', color: '#1d9e75', letterSpacing: '2px' }}>Tide Lines</span>
    </div>
  )
  if (!currentUser) return <LoginScreen onJoinTank={joinTank} />

  const firstName = currentUser.user_metadata?.full_name?.trim().split(' ')[0]
    || currentUser.email?.split('@')[0]
    || 'there'

  // ── Screen 2: Tank view ──────────────────────────────
  if (selectedTank) {
    const activeTanks  = tanks.filter(t => !t.archived)
    const tankIndex    = activeTanks.findIndex(t => t.id === selectedTank)
    const currentTank  = tanks.find(t => t.id === selectedTank)
    const prevTank     = prevTankId ? tanks.find(t => t.id === prevTankId) : null

    // CSS animation class names for the slide panels
    const outClass = slideDirection === 'next' ? 'tank-slide-out-left' : 'tank-slide-out-right'
    const inClass  = slideDirection === 'next' ? 'tank-slide-in-right' : 'tank-slide-in-left'

    // Shared props for TankView instances
    const sharedViewProps = {
      selectedFish, filterBy, waterSpeed, waveIntensity,
      tankMood, backgroundScene,
      onSelectFish: selectFish, onFilterChange,
      setWaterSpeed, setWaveIntensity,
      toggleMood, setScene, setModalOpen,
      onBack: () => selectTank(null),
    }

    return (
      <>
        <div className="tank-slide-wrapper">
          {/* Outgoing tank (slides away during transition) */}
          {prevTank && isTransitioning && (
            <div className={`tank-slide-panel ${outClass}`} style={{ zIndex: 1, pointerEvents: 'none' }}>
              <TankView
                tank={prevTank}
                tankIndex={activeTanks.findIndex(t => t.id === prevTankId)}
                tankCount={activeTanks.length}
                isTransitioning
                onPrevTank={() => {}} onNextTank={() => {}}
                {...sharedViewProps}
              />
            </div>
          )}

          {/* Current / incoming tank */}
          <div
            className={`tank-slide-panel${isTransitioning ? ` ${inClass}` : ''}`}
            style={{ zIndex: 2 }}
          >
            <TankView
              tank={currentTank}
              tankIndex={tankIndex}
              tankCount={activeTanks.length}
              onPrevTank={() => navigateTank('prev')}
              onNextTank={() => navigateTank('next')}
              isTransitioning={isTransitioning}
              currentUser={currentUser}
              {...sharedViewProps}
            />
          </div>
        </div>

        {modalOpen && (
          <AddFishModal
            onAddFish={addFish}
            onClose={() => setModalOpen(false)}
          />
        )}
      </>
    )
  }

  // ── Tanks swipe view (full screen, no bottom nav) ────
  if (currentScreen === 'tanks') {
    const swipeable = tanks.filter(t => !t.archived)
    if (swipeable.length === 0) {
      setCurrentScreen('home')
      return null
    }
    const safeIdx = Math.min(swipeTankIndex, swipeable.length - 1)
    return (
      <SwipeTankView
        tanks={swipeable}
        swipeTankIndex={safeIdx}
        onSwipeChange={setSwipeTankIndex}
        onExit={() => setCurrentScreen('home')}
        onAddFish={addFish}
      />
    )
  }

  // ── Main screens + bottom nav ─────────────────────────
  const inviteTank = tanks.find(t => t.id === inviteTargetTank) ?? null
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {currentScreen === 'home' && (
        <>
          <TankGrid
            tanks={tanks}
            tanksLoading={tanksLoading}
            userName={firstName}
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
            <InviteModal tank={inviteTank} currentUser={currentUser} onClose={closeInvite} />
          )}
        </>
      )}
      {currentScreen === 'discover' && <DiscoverScreen />}
      {currentScreen === 'settings' && (
        <SettingsScreen currentUser={currentUser} onLogout={handleLogout} />
      )}
      {currentScreen === 'help' && <HelpScreen />}
      <BottomNav currentScreen={currentScreen} onNavigate={setCurrentScreen} />
    </div>
  )
}
