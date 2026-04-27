import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import TankView from './TankView'
import AddFishModal from './AddFishModal'
import './SwipeTankView.css'

const NOOP = () => {}

export default function SwipeTankView({ tanks, swipeTankIndex, onSwipeChange, onExit, onAddFish }) {
  const [anim,         setAnim]      = useState(null)
  const [selectedFish, setSF]        = useState(null)
  const [filterBy,     setFilterBy]  = useState({ sender: 'all', date: 'all' })
  const [waterSpeed,   setWS]        = useState(1)
  const [waveIntensity,setWI]        = useState(1)
  const [tankMood,     setMood]      = useState('day')
  const [bgScene,      setBgScene]   = useState('sea')
  const [modalOpen,    setModal]     = useState(false)

  const touchX  = useRef(0)
  const busy    = useRef(false)
  const idxRef  = useRef(swipeTankIndex)
  const goRef   = useRef(null)
  const fromRef = useRef(null)
  const toRef   = useRef(null)

  useEffect(() => { idxRef.current = swipeTankIndex }, [swipeTankIndex])

  // Define go via ref so the keydown handler never goes stale
  goRef.current = function go(dir) {
    if (busy.current || tanks.length < 2) return
    const from = idxRef.current
    const next = dir === 'left'
      ? (from + 1) % tanks.length
      : (from - 1 + tanks.length) % tanks.length
    busy.current = true
    setAnim({ dir, fromIdx: from, nextIdx: next })
  }

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowLeft')  goRef.current('right')
      if (e.key === 'ArrowRight') goRef.current('left')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function onTouchStart(e) { touchX.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    const delta = touchX.current - e.changedTouches[0].clientX
    if (Math.abs(delta) > 50) goRef.current(delta > 0 ? 'left' : 'right')
  }

  // Kick off the CSS transition once both layers are in the DOM
  useLayoutEffect(() => {
    if (!anim || !fromRef.current || !toRef.current) return

    const toStart = anim.dir === 'left' ? '100%'  : '-100%'
    const fromEnd = anim.dir === 'left' ? '-100%' : '100%'

    // Snap to starting positions without transition
    fromRef.current.style.transition = 'none'
    fromRef.current.style.transform  = 'translateX(0%)'
    toRef.current.style.transition   = 'none'
    toRef.current.style.transform    = `translateX(${toStart})`
    void fromRef.current.offsetWidth  // force reflow

    requestAnimationFrame(() => {
      if (!fromRef.current || !toRef.current) return
      fromRef.current.style.transition = 'transform 0.35s ease'
      fromRef.current.style.transform  = `translateX(${fromEnd})`
      toRef.current.style.transition   = 'transform 0.35s ease'
      toRef.current.style.transform    = 'translateX(0%)'
    })

    const t = setTimeout(() => {
      onSwipeChange(anim.nextIdx)
      setAnim(null)
      setSF(null)
      busy.current = false
    }, 380)

    return () => clearTimeout(t)
  }, [anim])

  const activeIdx = anim?.nextIdx ?? swipeTankIndex

  const sharedProps = {
    filterBy,
    waterSpeed,
    waveIntensity,
    tankMood,
    backgroundScene: bgScene,
    onFilterChange:  f => setFilterBy(p => ({ ...p, ...f })),
    setWaterSpeed:   setWS,
    setWaveIntensity: setWI,
    toggleMood:      () => setMood(p => p === 'day' ? 'night' : 'day'),
    setScene:        setBgScene,
  }

  return (
    <div className="swipe-root" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

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
