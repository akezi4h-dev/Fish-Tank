import { useState } from 'react'
import './AddFishModal.css'

const FISH_TYPES = ['clownfish', 'angelfish', 'betta', 'goldfish', 'pufferfish']

function ClownfishSVG() {
  return (
    <svg viewBox="0 0 120 80" width="120" height="80">
      <ellipse cx="62" cy="40" rx="44" ry="28" fill="#f4a261" />
      <polygon points="18,40 0,24 0,56" fill="#e07a3a" />
      <polygon points="62,12 72,24 52,24" fill="#f4a261" />
      {/* white stripes */}
      <ellipse cx="40" cy="40" rx="5" ry="26" fill="white" opacity="0.7" />
      <ellipse cx="62" cy="40" rx="5" ry="26" fill="white" opacity="0.7" />
      <ellipse cx="84" cy="40" rx="5" ry="24" fill="white" opacity="0.7" />
      <ellipse cx="62" cy="40" rx="44" ry="28" fill="none" stroke="#c05a20" strokeWidth="1.5" opacity="0.4" />
      <circle cx="95" cy="32" r="6" fill="#0a1a2e" />
      <circle cx="96.5" cy="30.5" r="2" fill="white" />
    </svg>
  )
}

function AngelfishSVG() {
  return (
    <svg viewBox="0 0 120 100" width="120" height="100">
      {/* long top fin */}
      <polygon points="60,0 80,38 40,38" fill="#a0c8e8" opacity="0.8" />
      {/* body */}
      <ellipse cx="60" cy="52" rx="30" ry="22" fill="#b8d4f0" />
      {/* long bottom fin */}
      <polygon points="60,100 76,68 44,68" fill="#a0c8e8" opacity="0.8" />
      {/* tail */}
      <polygon points="30,52 10,38 10,66" fill="#90b8e0" />
      {/* stripes */}
      <line x1="55" y1="30" x2="55" y2="74" stroke="#6090b8" strokeWidth="3" opacity="0.5" />
      <line x1="72" y1="32" x2="72" y2="72" stroke="#6090b8" strokeWidth="3" opacity="0.5" />
      <circle cx="84" cy="46" r="5" fill="#0a1a2e" />
      <circle cx="85.2" cy="44.8" r="1.6" fill="white" />
    </svg>
  )
}

function BettaSVG() {
  return (
    <svg viewBox="0 0 130 90" width="130" height="90">
      {/* flowing tail fan */}
      <polygon points="20,45 0,15 10,45 0,75" fill="#9b6fc8" opacity="0.7" />
      {/* body */}
      <ellipse cx="68" cy="45" rx="40" ry="20" fill="#b88ae0" />
      {/* top fin flowing */}
      <path d="M40,25 Q60,5 90,20 L90,25 Q60,15 40,32Z" fill="#9b6fc8" opacity="0.8" />
      {/* bottom fin */}
      <path d="M40,65 Q55,82 80,70 L80,65 Q55,75 40,62Z" fill="#9b6fc8" opacity="0.8" />
      {/* shimmer */}
      <ellipse cx="68" cy="40" rx="20" ry="8" fill="white" opacity="0.12" />
      <circle cx="98" cy="38" r="5" fill="#0a1a2e" />
      <circle cx="99.2" cy="36.8" r="1.6" fill="white" />
    </svg>
  )
}

function GoldfishSVG() {
  return (
    <svg viewBox="0 0 120 90" width="120" height="90">
      {/* fan tail — two lobes */}
      <ellipse cx="18" cy="32" rx="18" ry="10" fill="#f4a261" opacity="0.8" transform="rotate(-30 18 32)" />
      <ellipse cx="18" cy="58" rx="18" ry="10" fill="#f4a261" opacity="0.8" transform="rotate(30 18 58)" />
      {/* body — rounder */}
      <ellipse cx="68" cy="45" rx="38" ry="30" fill="#f4c261" />
      {/* top fin */}
      <path d="M48,15 Q68,5 88,18 L88,26 Q68,14 48,24Z" fill="#e8a040" opacity="0.85" />
      {/* shimmer */}
      <ellipse cx="68" cy="38" rx="18" ry="10" fill="white" opacity="0.15" />
      <circle cx="96" cy="36" r="6" fill="#0a1a2e" />
      <circle cx="97.5" cy="34.5" r="2" fill="white" />
    </svg>
  )
}

function PufferfishSVG() {
  return (
    <svg viewBox="0 0 110 110" width="110" height="110">
      {/* very round body */}
      <circle cx="55" cy="55" r="40" fill="#d4c84a" />
      {/* spines */}
      {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => {
        const r = Math.PI * deg / 180
        const x1 = 55 + 40 * Math.cos(r)
        const y1 = 55 + 40 * Math.sin(r)
        const x2 = 55 + 52 * Math.cos(r)
        const y2 = 55 + 52 * Math.sin(r)
        return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#a8a030" strokeWidth="2" />
      })}
      {/* small tail */}
      <polygon points="15,55 0,44 0,66" fill="#c0b838" />
      {/* small fins */}
      <ellipse cx="55" cy="18" rx="10" ry="6" fill="#c0b838" opacity="0.8" transform="rotate(-10 55 18)" />
      <ellipse cx="55" cy="92" rx="10" ry="6" fill="#c0b838" opacity="0.8" transform="rotate(10 55 92)" />
      {/* big eyes */}
      <circle cx="78" cy="46" r="9" fill="white" />
      <circle cx="80" cy="46" r="5.5" fill="#0a1a2e" />
      <circle cx="81.5" cy="44.5" r="1.8" fill="white" />
      {/* mouth */}
      <path d="M72,64 Q78,70 84,64" fill="none" stroke="#a8a030" strokeWidth="2" />
    </svg>
  )
}

const FISH_SVGS = {
  clownfish:  <ClownfishSVG />,
  angelfish:  <AngelfishSVG />,
  betta:      <BettaSVG />,
  goldfish:   <GoldfishSVG />,
  pufferfish: <PufferfishSVG />,
}

export default function AddFishModal({ onAddFish, onClose }) {
  const [typeIndex, setTypeIndex]     = useState(0)
  const [color, setColor]             = useState(0)
  const [message, setMessage]         = useState('')
  const [senderName, setSenderName]   = useState('')

  const fishType = FISH_TYPES[typeIndex]

  function prevType() {
    setTypeIndex(i => (i - 1 + FISH_TYPES.length) % FISH_TYPES.length)
  }
  function nextType() {
    setTypeIndex(i => (i + 1) % FISH_TYPES.length)
  }

  function handleSubmit() {
    if (!message.trim() || !senderName.trim()) return
    onAddFish({
      id: `fish-${Date.now()}`,
      type: fishType,
      color,
      message: message.trim(),
      senderName: senderName.trim(),
      timestamp: new Date().toISOString().split('T')[0],
    })
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal-card">
        <h2 className="modal-title">Add your fish</h2>

        {/* Fish type selector */}
        <div className="fish-selector">
          <button className="fish-arrow" onClick={prevType}>‹</button>
          <div className="fish-preview">
            <div
              className="fish-preview-svg"
              style={{ filter: `hue-rotate(${color}deg)` }}
            >
              {FISH_SVGS[fishType]}
            </div>
            <span className="fish-type-label">{fishType}</span>
          </div>
          <button className="fish-arrow" onClick={nextType}>›</button>
        </div>

        {/* Color slider */}
        <div className="color-slider-wrap">
          <span className="color-slider-label">Color</span>
          <input
            type="range"
            min="0" max="360" step="1"
            value={color}
            className="color-slider"
            onChange={e => setColor(parseInt(e.target.value))}
          />
        </div>

        {/* Message */}
        <div className="modal-field">
          <label>Message</label>
          <textarea
            className="modal-input"
            rows="3"
            placeholder="Write something warm..."
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </div>

        {/* Sender name */}
        <div className="modal-field">
          <label>Your name</label>
          <input
            type="text"
            className="modal-input"
            placeholder="Who's sending this fish?"
            value={senderName}
            onChange={e => setSenderName(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          className="release-btn"
          onClick={handleSubmit}
          disabled={!message.trim() || !senderName.trim()}
        >
          Release fish 🐠
        </button>
      </div>
    </div>
  )
}
