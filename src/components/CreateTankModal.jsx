import { useState } from 'react'
import './CreateTankModal.css'

export default function CreateTankModal({ onConfirm, onClose }) {
  const [step,     setStep]     = useState(1)
  const [name,     setName]     = useState('')
  const [isPublic, setIsPublic] = useState(false)

  function handleNameNext(e) {
    e.preventDefault()
    if (name.trim()) setStep(2)
  }

  function handleCreate() {
    onConfirm(name.trim(), isPublic)
    onClose()
  }

  return (
    <div className="ctm-overlay" onClick={onClose}>
      <div className="ctm-card" onClick={e => e.stopPropagation()}>
        <button className="ctm-close" onClick={onClose}>✕</button>

        {step === 1 && (
          <>
            <h2 className="ctm-title">Name your tank</h2>
            <form className="ctm-form" onSubmit={handleNameNext}>
              <input
                className="ctm-input"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Family Reef"
                maxLength={60}
                autoFocus
              />
              <button className="ctm-btn" type="submit" disabled={!name.trim()}>
                Next →
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="ctm-title">Who can join?</h2>
            <div className="ctm-vis-row">
              <button
                className={`ctm-vis-card${!isPublic ? ' ctm-vis-selected' : ''}`}
                onClick={() => setIsPublic(false)}
              >
                <span className="ctm-vis-emoji">🔒</span>
                <span className="ctm-vis-name">Private</span>
                <span className="ctm-vis-desc">Only people you invite can join</span>
              </button>
              <button
                className={`ctm-vis-card${isPublic ? ' ctm-vis-selected' : ''}`}
                onClick={() => setIsPublic(true)}
              >
                <span className="ctm-vis-emoji">🌊</span>
                <span className="ctm-vis-name">Public</span>
                <span className="ctm-vis-desc">Anyone can discover and join</span>
              </button>
            </div>
            <button className="ctm-btn" onClick={handleCreate}>
              Create Tank
            </button>
          </>
        )}
      </div>
    </div>
  )
}
