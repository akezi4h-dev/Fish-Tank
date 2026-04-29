import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import TankView from './TankView'
import AddFishModal from './AddFishModal'
import './SwipeTankView.css'

const NOOP = () => {}

export default function SwipeTankView({ tanks, swipeTankIndex, onSwipeChange, onExit, onAddFish }) {
  const [anim,          setAnim]      = useState(null)
  const [selectedFish,  setSF]        = useState(null)
  const [filterBy,      setFilterBy]  = useState({ sender: 'all', date: 'all' })
  const [waterSpeed,    setWS]        = useState(1)
  const [waveIntensity, setWI]        = useState(1)
  const [tankMood,      setMood]      = useState('day')
  const [bgScene,       setBgScene]   = useState('sea')
  const [modalOpen,     setModal]     = useState(false)

  const rootRef  = useRef(null)
  const touchX   = useRef(0)
  const busy     = useRef(false)
  const idxRef   = useRef(swipeTankIndex)
  const goRef    = useRef(null)
  const fromRef  = useRef(null)
  const toRef    = useRef(null)

  useEffect(() => { idxRef.current = swipeTankIndex }, [swipeTankIndex])

  // Always up-to-date go function via ref — avoids stale closures in listeners
  goRef.current = (dir) => {
    if (busy.current || tanks.length < 2) return
    const from = idxRef.current
    const next = dir === 'left'
      ? (from + 1) % tanks.length
      : (from - 1 + tanks.length) % tanks.length
    busy.current = true
    setAnim({ dir, fromIdx: from, nextIdx: next })
  }

  // Keyboard navigation
  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowLeft')  goRef.current('right')
      if (e.key === 'ArrowRight') goRef.current('left')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Native capture-phase touch listeners so child elements can't block them
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const onStart = e => { touchX.current = e.touches[0].clientX }
    const onEnd   = e => {
      const delta = touchX.current - e.changedTouches[0].clientX
      if (Math.abs(delta) > 50) goRef.current(delta > 0 ? 'left' : 'right')
    }
    el.addEventListener('touchstart', onStart, { capture: true, passive: true })
    el.addEventListener('touchend',   onEnd,   { capture: true, passive: true })
    return () => {
      el.removeEventListener('touchstart', onStart, { capture: true })
      el.removeEventListener('touchend',   onEnd,   { capture: true })
    }
  }, [])

  // Run the slide transition once both layers are mounted
  useLayoutEffect(() => {
    if (!anim || !fromRef.current || !toRef.current) return

    const toStart = anim.dir === 'left' ? '100%'  : '-100%'
    const fromEnd = anim.dir === 'left' ? '-100%' : '100%'

    // Snap to initial positions without transition
    fromRef.current.style.transition = 'none'
    fromRef.current.style.transform  = 'translateX(0%)'
    toRef.current.style.transition   = 'none'
    toRef.current.style.transform    = `translateX(${toStart})`
    void fromRef.current.offsetWidth  // force reflow

    // Double rAF ensures browser has painted the initial state before animating
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!fromRef.current || !toRef.current) return
      fromRef.current.style.transition = 'transform 0.35s ease'
      fromRef.current.style.transform  = `translateX(${fromEnd})`
      toRef.current.style.transition   = 'transform 0.35s ease'
      toRef.current.style.transform    = 'translateX(0%)'
    }))

    const t = setTimeout(() => {
      onSwipeChange(anim.nextIdx)
      setAnim(null)
      setSF(null)
      busy.current = false
    }, 400)

    return () => clearTimeout(t)
  }, [anim])

  const activeIdx = anim?.nextIdx ?? swipeTankIndex

  const sharedProps = {
    filterBy,
    waterSpeed,
    waveIntensity,
    tankMood,
    backgroundScene:  bgScene,
    onFilterChange:   f => setFilterBy(p => ({ ...p, ...f })),
    setWaterSpeed:    setWS,
    setWaveIntensity: setWI,
    toggleMood:       () => setMood(p => p === 'day' ? 'night' : 'day'),
    setScene:         setBgScene,
  }

  return (
    <div ref={rootRef} className="swipe-root">

      {/* Dot indicators */}
      <div className="swipe-dots">
        {tanks.map((_, i) => (
          <div key={i} className={`swipe-dot${i === activeIdx ? ' swipe-dot-active' : ''}`} />
        ))}
      </div>

      {!anim ? (
        <TankView
          {...sharedProps}
          tank={tanks[swipeTankIndex]}
          selectedFish={selectedFish}
          onSelectFish={setSF}
          setModalOpen={setModal}
          onBack={onExit}
          tankIndex={swipeTankIndex}
          tankCount={tanks.length}
          onPrevTank={() => { if (swipeTankIndex > 0) goRef.current('right') }}
          onNextTank={() => { if (swipeTankIndex < tanks.length - 1) goRef.current('left') }}
          isTransitioning={!!anim}
        />
      ) : (
        <>
          <div ref={fromRef} className="swipe-layer">
            <TankView
              {...sharedProps}
              tank={tanks[anim.fromIdx]}
              selectedFish={null}
              onSelectFish={NOOP}
              setModalOpen={NOOP}
              onBack={NOOP}
            />
          </div>
          <div ref={toRef} className="swipe-layer">
            <TankView
              {...sharedProps}
              tank={tanks[anim.nextIdx]}
              selectedFish={null}
              onSelectFish={NOOP}
              setModalOpen={NOOP}
              onBack={NOOP}
            />
          </div>
        </>
      )}

      {modalOpen && (
        <AddFishModal
          onAddFish={async fish => {
            await onAddFish(fish, tanks[swipeTankIndex].id)
            setModal(false)
          }}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  )
}
