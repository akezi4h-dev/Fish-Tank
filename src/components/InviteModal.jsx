import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import './InviteModal.css'

function getInitials(name) {
  if (!name) return '?'
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function getDisplayName(member, currentUser) {
  // If this is the current user, use their own auth metadata directly
  if (currentUser && member.user_id === currentUser.id) {
    const name = currentUser.user_metadata?.full_name
    if (name && name.trim()) return name.trim()
    return currentUser.email?.split('@')[0] ?? 'You'
  }
  // Otherwise try the profiles join (if table exists)
  const name = member.profiles?.full_name
  if (name && name.trim()) return name.trim()
  const email = member.profiles?.email
  if (email) return email.split('@')[0]
  return 'Member'
}

function MemberSkeleton() {
  return (
    <div style={s.memberRow}>
      <div className="invite-skeleton-avatar" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <div className="invite-skeleton-line" style={{ width: 100 }} />
        <div className="invite-skeleton-line" style={{ width: 60 }} />
      </div>
    </div>
  )
}

export default function InviteModal({ tank, currentUser, onClose }) {
  const [copied,      setCopied]      = useState(false)
  const [members,     setMembers]     = useState(null)   // null = loading
  const link = `tidelinesapp.com/join/${tank.inviteCode ?? tank.id}`

  useEffect(() => {
    async function fetchMembers() {
      // Step 1: get all user_ids for this tank
      const { data: memberRows } = await supabase
        .from('tank_members')
        .select('user_id')
        .eq('tank_id', tank.id)

      if (!memberRows || memberRows.length === 0) {
        setMembers([])
        return
      }

      // Step 2: fetch profiles for those user_ids separately (avoids FK join issue)
      const userIds = memberRows.map(m => m.user_id)
      const { data: profileRows } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds)

      const profileMap = {}
      for (const p of (profileRows ?? [])) {
        profileMap[p.id] = p
      }

      setMembers(memberRows.map(m => ({
        user_id: m.user_id,
        profiles: profileMap[m.user_id] ?? null,
      })))
    }
    fetchMembers()
  }, [tank.id])

  function handleCopy() {
    navigator.clipboard.writeText(link).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const mailtoHref = `mailto:?subject=Join my tank on Tide Lines&body=You've been invited to join my tank "${tank.name}" on Tide Lines. Use this link: ${link}`

  return (
    <div style={s.overlay} onClick={onClose}>
      <div className="invite-card" style={s.card} onClick={e => e.stopPropagation()}>

        <button style={s.closeBtn} onClick={onClose} title="Close">✕</button>

        <h2 style={s.title}>{tank.name}</h2>
        <p style={s.subtitle}>Invite to tank</p>

        {/* ── Members section ── */}
        <p style={s.sectionLabel}>In this tank</p>

        {members === null ? (
          // Loading skeleton
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
            <MemberSkeleton />
            <MemberSkeleton />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
            {members.map(m => {
              const name   = getDisplayName(m, currentUser)
              const isYou  = m.user_id === currentUser?.id
              return (
                <div key={m.user_id} style={s.memberRow}>
                  <div style={s.avatar}>{getInitials(name)}</div>
                  <div style={s.memberInfo}>
                    <span style={s.memberName}>{name}</span>
                    {isYou && <span style={s.youBadge}>you</span>}
                  </div>
                </div>
              )
            })}
            {members.length <= 1 && (
              <p style={s.emptyNote}>No one else has joined yet</p>
            )}
          </div>
        )}

        {/* ── Divider ── */}
        <div style={s.divider} />

        {/* ── Invite section ── */}
        <p style={{ ...s.sectionLabel, marginTop: 16 }}>Share invite link</p>

        <div style={s.linkRow}>
          <code className="invite-link-box" style={s.linkBox}>{link}</code>
          <button
            style={{ ...s.iconBtn, ...(copied ? s.iconBtnDone : {}) }}
            onClick={handleCopy}
            title="Copy link"
          >
            {copied ? '✓' : '⎘'}
          </button>
          <a
            href={mailtoHref}
            style={{ ...s.iconBtn, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Share via email"
          >
            ✉
          </a>
        </div>

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
    background: '#F8F7FF',
    border: '0.5px solid rgba(33, 30, 74, 0.15)',
    borderRadius: '16px',
    padding: '28px 28px 24px',
    width: '340px',
    maxWidth: '90vw',
    position: 'relative',
    boxShadow: '0 12px 40px rgba(33, 30, 74, 0.12)',
    fontFamily: "'pt-serif', serif",
  },
  closeBtn: {
    position: 'absolute',
    top: '14px', right: '14px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.1rem',
    color: 'rgba(33, 30, 74, 0.4)',
    lineHeight: 1,
    padding: '4px',
  },
  title: {
    margin: '0 0 2px',
    fontSize: '1.4rem',
    color: '#211E4A',
    fontFamily: "'pt-serif', serif",
  },
  subtitle: {
    margin: '0 0 16px',
    fontSize: '0.85rem',
    color: 'rgba(33, 30, 74, 0.5)',
    fontFamily: "'pt-serif', serif",
  },
  sectionLabel: {
    margin: '0 0 10px',
    fontSize: '0.75rem',
    color: 'rgba(33, 30, 74, 0.45)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontFamily: "'pt-serif', serif",
  },
  memberRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40, height: 40,
    borderRadius: '50%',
    background: '#1d9e75',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontFamily: "'pt-serif', serif",
    fontWeight: 'bold',
    flexShrink: 0,
  },
  memberInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  memberName: {
    fontSize: '0.95rem',
    color: '#211E4A',
    fontFamily: "'pt-serif', serif",
  },
  youBadge: {
    fontSize: '0.72rem',
    color: 'rgba(33, 30, 74, 0.4)',
    fontFamily: "'pt-serif', serif",
  },
  emptyNote: {
    margin: '4px 0 0',
    fontSize: '0.82rem',
    color: 'rgba(33, 30, 74, 0.4)',
    fontFamily: "'pt-serif', serif",
  },
  divider: {
    height: '0.5px',
    background: 'rgba(33, 30, 74, 0.12)',
    margin: '4px 0 0',
  },
  linkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(33, 30, 74, 0.06)',
    borderRadius: '8px',
    padding: '8px 10px',
  },
  linkBox: {
    flex: 1,
    fontSize: '0.8rem',
    color: '#211E4A',
    fontFamily: 'monospace',
    wordBreak: 'break-all',
    lineHeight: 1.4,
  },
  iconBtn: {
    flexShrink: 0,
    width: '30px', height: '30px',
    borderRadius: '6px',
    border: '1px solid rgba(33, 30, 74, 0.2)',
    background: '#F8F7FF',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#211E4A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.15s, color 0.15s',
  },
  iconBtnDone: {
    background: '#1d9e75',
    color: '#fff',
    borderColor: '#1d9e75',
  },
}
