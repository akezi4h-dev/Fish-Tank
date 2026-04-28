import { useState } from 'react'
import './InviteModal.css'

export default function InviteModal({ tank, onClose }) {
  const [copied, setCopied] = useState(false)
  const link = `tidelinesapp.com/join/${tank.inviteCode ?? tank.id}`
  const members = [...new Set(tank.fish.map(f => f.senderName))]

  function handleCopy() {
    navigator.clipboard.writeText(link).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function getInitials(name) {
    return name.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <div style={s.overlay} onClick={onClose}>
      <div className="invite-card" style={s.card} onClick={e => e.stopPropagation()}>

        <button style={s.closeBtn} onClick={onClose} title="Close">✕</button>

        <h2 style={s.title}>{tank.name}</h2>
        <p style={s.subtitle}>Invite to tank</p>

        <div style={s.linkRow}>
          <code className="invite-link-box" style={s.linkBox}>{link}</code>
          <button style={{ ...s.copyBtn, ...(copied ? s.copyBtnDone : {}) }} onClick={handleCopy} title="Copy link">
            {copied ? '✓' : '⎘'}
          </button>
        </div>

        <p style={s.membersLabel}>Members</p>
        {members.length === 0 ? (
          <p style={s.emptyMembers}>No members yet — share the link to invite someone.</p>
        ) : (
          <div style={s.membersRow}>
            {members.map(name => (
              <div key={name} style={s.memberItem}>
                <div style={s.avatar}>{getInitials(name)}</div>
                <span style={s.memberName}>{name}</span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

const s = {
  overlay: {
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    padding: '28px 28px 24px',
    width: '340px',
    maxWidth: '90vw',
    position: 'relative',
    boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
    fontFamily: "'pt-serif', serif",
  },
  closeBtn: {
    position: 'absolute',
    top: '14px', right: '14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    color: '#888',
    lineHeight: 1,
    padding: '4px',
  },
  title: {
    margin: '0 0 2px',
    fontSize: '1.4rem',
    color: '#1a3a50',
    fontFamily: "'pt-serif', serif",
  },
  subtitle: {
    margin: '0 0 16px',
    fontSize: '0.85rem',
    color: '#7a9aaa',
    fontFamily: "'pt-serif', serif",
  },
  linkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#f0f5f8',
    borderRadius: '8px',
    padding: '8px 10px',
    marginBottom: '22px',
  },
  linkBox: {
    flex: 1,
    fontSize: '0.8rem',
    color: '#2a6a7a',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    lineHeight: 1.4,
  },
  copyBtn: {
    flexShrink: 0,
    width: '30px', height: '30px',
    borderRadius: '6px',
    border: '1px solid #b0ccd4',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#2a6a7a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.15s, color 0.15s',
  },
  copyBtnDone: {
    background: '#2a6a7a',
    color: '#fff',
    borderColor: '#2a6a7a',
  },
  membersLabel: {
    margin: '0 0 10px',
    fontSize: '0.8rem',
    color: '#7a9aaa',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontFamily: "'pt-serif', serif",
  },
  emptyMembers: {
    fontSize: '0.85rem',
    color: '#aaa',
    fontFamily: "'pt-serif', serif",
    margin: 0,
  },
  membersRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },
  memberItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  avatar: {
    width: '40px', height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0d3a5c, #1a7a8a)',
    color: '#7fffd4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontFamily: "'pt-serif', serif",
    fontWeight: 'bold',
  },
  memberName: {
    fontSize: '0.75rem',
    color: '#3a5a6a',
    fontFamily: "'pt-serif', serif",
  },
}
