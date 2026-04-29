import { useState } from 'react'
import './Avatars.css'

// ── Preset ocean avatars ──────────────────────────────────
export const AVATARS = [
  { id: 'crab',       emoji: '🦀', bg: '#F87171' },
  { id: 'octopus',    emoji: '🐙', bg: '#C084FC' },
  { id: 'shark',      emoji: '🦈', bg: '#94A3B8' },
  { id: 'clownfish',  emoji: '🐠', bg: '#FB923C' },
  { id: 'whale',      emoji: '🐋', bg: '#60A5FA' },
  { id: 'turtle',     emoji: '🐢', bg: '#4ADE80' },
  { id: 'pufferfish', emoji: '🐡', bg: '#FBBF24' },
  { id: 'squid',      emoji: '🦑', bg: '#818CF8' },
  { id: 'dolphin',    emoji: '🐬', bg: '#38BDF8' },
  { id: 'lobster',    emoji: '🦞', bg: '#EF4444' },
  { id: 'shell',      emoji: '🐚', bg: '#D4A06A' },
  { id: 'coral',      emoji: '🪸', bg: '#FB7185' },
]

export function getAvatar(avatarId) {
  return AVATARS.find(a => a.id === avatarId) ?? null
}

// Deterministic color for members without a custom avatar
const MEMBER_COLORS = ['#1d9e75', '#60A5FA', '#C084FC', '#FB923C', '#4ADE80', '#F87171']

export function getMemberColor(userId) {
  if (!userId) return MEMBER_COLORS[0]
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0
  }
  return MEMBER_COLORS[hash % MEMBER_COLORS.length]
}

// ── Shared avatar display ─────────────────────────────────
// avatarId → show emoji circle   |   fallback → initials + deterministic color
export function AvatarDisplay({ avatarId, name, userId, size = 40, style = {} }) {
  const av = avatarId ? getAvatar(avatarId) : null

  if (av) {
    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: av.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.round(size * 0.48),
        flexShrink: 0,
        userSelect: 'none',
        lineHeight: 1,
        ...style,
      }}>
        {av.emoji}
      </div>
    )
  }

  // Fallback: initials
  const initials = name
    ? name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: getMemberColor(userId),
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: Math.round(size * 0.35),
      fontFamily: "'pt-serif', serif",
      fontWeight: 'bold',
      flexShrink: 0,
      userSelect: 'none',
      ...style,
    }}>
      {initials}
    </div>
  )
}

// ── Avatar picker modal ───────────────────────────────────
export function AvatarPickerModal({ currentAvatarId, onSelect, onClose }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="avp-overlay" onClick={onClose}>
      <div className="avp-card" onClick={e => e.stopPropagation()}>
        <h2 className="avp-title">Choose your avatar</h2>
        <div className="avp-grid">
          {AVATARS.map(av => {
            const isSelected = av.id === currentAvatarId
            return (
              <button
                key={av.id}
                className={`avp-option${isSelected ? ' avp-option--selected' : ''}`}
                style={{
                  background: av.bg,
                  transform: hovered === av.id && !isSelected ? 'scale(1.08)' : 'scale(1)',
                }}
                onMouseEnter={() => setHovered(av.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect(av.id)}
                title={av.id.charAt(0).toUpperCase() + av.id.slice(1)}
              >
                <span className="avp-emoji">{av.emoji}</span>
                {isSelected && <span className="avp-check">✓</span>}
              </button>
            )
          })}
        </div>
        <button className="avp-cancel" onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}
