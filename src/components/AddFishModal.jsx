import { useState } from 'react'
import './AddFishModal.css'
import { FISH_TYPES, FishSVG } from './FishSVGs'
import { spawnBubbles } from '../utils/bubbleEffect'

export default function AddFishModal({ onAddFish, onClose }) {
  const [typeIndex, setTypeIndex]   = useState(0)
  const [color, setColor]           = useState(0)
  const [message, setMessage]       = useState('')
  const [senderName, setSenderName] = useState('')

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
            <FishSVG type={fishType} color={color} width={130} height={90} />
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
          onClick={e => { spawnBubbles(e.currentTarget); handleSubmit() }}
          disabled={!message.trim() || !senderName.trim()}
        >
          Release fish 🐠
        </button>
      </div>
    </div>
  )
}
