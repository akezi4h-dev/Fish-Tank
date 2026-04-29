import { useState } from 'react'
import { supabase } from '../supabaseClient'
import './CreateTankModal.css'

export default function CreateTankModal({ onConfirm, onClose }) {
  const [name,        setName]        = useState('')
  const [isPublic,    setIsPublic]    = useState(false)
  const [codeInput,   setCodeInput]   = useState('')
  const [codeError,   setCodeError]   = useState(null)
  const [codeLoading, setCodeLoading] = useState(false)
  const [members,     setMembers]     = useState([]) // { userId, name, code }

  async function handleAddCode() {
    const code = codeInput.trim().toUpperCase()
    if (!code) return
    if (members.some(m => m.code === code)) { setCodeError('Already added'); return }
    setCodeLoading(true)
    setCodeError(null)
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('profile_code', code)
      .maybeSingle()
    setCodeLoading(false)
    if (!data) { setCodeError('No user found with that code'); return }
    setMembers(prev => [...prev, { userId: data.id, name: data.full_name || 'Unknown', code }])
    setCodeInput('')
  }

  function handleCreate() {
    onConfirm(name.trim(), isPublic, members.map(m => m.userId))
    onClose()
  }

  return (
    <div className="ctm-overlay" onClick={onClose}>
      <div className="ctm-card" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="ctm-header">
          <h2 className="ctm-title">New Tank</h2>
          <button className="ctm-close" onClick={onClose}>✕</button>
        </div>

        {/* Section 1 — Name */}
        <div className="ctm-section">
          <label className="ctm-label">Name your tank</label>
          <input
            className="ctm-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Family Reef"
            maxLength={60}
            autoFocus
          />
        </div>

        {/* Section 2 — Visibility */}
        <div className="ctm-section">
          <label className="ctm-label">Who can see it?</label>
          <div className="ctm-vis-row">
            <button
              className={`ctm-vis-card${!isPublic ? ' ctm-vis-selected' : ''}`}
              onClick={() => setIsPublic(false)}
            >
              <span className="ctm-vis-emoji">🔒</span>
              <span className="ctm-vis-name">Private</span>
              <span className="ctm-vis-desc">Only people you invite</span>
            </button>
            <button
              className={`ctm-vis-card${isPublic ? ' ctm-vis-selected' : ''}`}
              onClick={() => setIsPublic(true)}
            >
              <span className="ctm-vis-emoji">🌊</span>
              <span className="ctm-vis-name">Public</span>
              <span className="ctm-vis-desc">Anyone can discover it</span>
            </button>
          </div>
        </div>

        {/* Section 3 — Add people (optional) */}
        <div className="ctm-section">
          <label className="ctm-label">
            Add people <span className="ctm-optional">(optional)</span>
          </label>
          <div className="ctm-code-row">
            <input
              className="ctm-input ctm-code-input"
              value={codeInput}
              onChange={e => { setCodeInput(e.target.value); setCodeError(null) }}
              placeholder="Enter profile code e.g. TL-A3X9"
              onKeyDown={e => e.key === 'Enter' && handleAddCode()}
            />
            <button
              className="ctm-add-btn"
              onClick={handleAddCode}
              disabled={!codeInput.trim() || codeLoading}
            >
              {codeLoading ? '…' : 'Add'}
            </button>
          </div>
          {codeError && <p className="ctm-code-error">{codeError}</p>}
          {members.length > 0 && (
            <div className="ctm-chips">
              {members.map(m => (
                <div key={m.userId} className="ctm-chip">
                  <span>{m.name}</span>
                  <button
                    className="ctm-chip-remove"
                    onClick={() => setMembers(prev => prev.filter(x => x.userId !== m.userId))}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create button */}
        <button
          className="ctm-btn ctm-btn-primary"
          onClick={handleCreate}
          disabled={!name.trim()}
        >
          Create Tank
        </button>

      </div>
    </div>
  )
}
