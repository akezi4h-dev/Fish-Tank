import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { AvatarDisplay } from './Avatars'
import './MembersPanel.css'

function formatJoinDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `Joined ${d.toLocaleString('en-US', { month: 'short', day: 'numeric' })}`
}

function getDisplayName(member, currentUser) {
  if (currentUser && member.user_id === currentUser.id) {
    const name = currentUser.user_metadata?.full_name
    if (name && name.trim()) return name.trim()
    return currentUser.email?.split('@')[0] ?? 'You'
  }
  const name = member.profiles?.full_name
  if (name && name.trim()) return name.trim()
  const email = member.profiles?.email
  if (email) return email.split('@')[0]
  return 'Member'
}

export default function MembersPanel({ tank, currentUser }) {
  const [members,      setMembers]      = useState(null)    // null = loading
  const [code,         setCode]         = useState('')
  const [searching,    setSearching]    = useState(false)
  const [searchResult, setSearchResult] = useState(null)    // {userId,name,avatarId} | 'notfound' | null
  const [confirmed,    setConfirmed]    = useState(false)

  useEffect(() => {
    async function fetchMembers() {
      const { data: memberRows } = await supabase
        .from('tank_members')
        .select('user_id, created_at')
        .eq('tank_id', tank.id)
        .order('created_at')

      if (!memberRows || memberRows.length === 0) { setMembers([]); return }

      const userIds = memberRows.map(m => m.user_id)
      const { data: profileRows } = await supabase
        .from('profiles')
        .select('id, full_name, email, avatar_id')
        .in('id', userIds)

      const profileMap = {}
      for (const p of (profileRows ?? [])) profileMap[p.id] = p

      setMembers(memberRows.map(m => ({
        user_id:    m.user_id,
        created_at: m.created_at,
        profiles:   profileMap[m.user_id] ?? null,
      })))
    }
    fetchMembers()
  }, [tank.id])

  async function handleSearch(e) {
    e.preventDefault()
    if (!code.trim()) return
    setSearching(true)
    setSearchResult(null)
    setConfirmed(false)

    const { data } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_id')
      .eq('profile_code', code.trim().toUpperCase())
      .maybeSingle()

    setSearching(false)
    if (data) {
      setSearchResult({
        userId:   data.id,
        name:     data.full_name?.trim() || data.email?.split('@')[0] || 'User',
        avatarId: data.avatar_id ?? null,
      })
    } else {
      setSearchResult('notfound')
    }
  }

  return (
    <div className="mp-panel">

      {/* Tank name + privacy icon */}
      <div className="mp-tank-header">
        <span className="mp-privacy-icon">{tank.isPublic ? '🌊' : '🔒'}</span>
        <span className="mp-tank-name">{tank.name}</span>
      </div>

      {/* Members list */}
      <p className="mp-section-label">In this tank</p>

      {members === null ? (
        <div className="mp-skel-group">
          {[120, 90].map((w, i) => (
            <div key={i} className="mp-skel-row">
              <div className="mp-skel-avatar" />
              <div className="mp-skel-line" style={{ width: w }} />
            </div>
          ))}
        </div>
      ) : members.length === 0 ? (
        <p className="mp-empty">No members yet</p>
      ) : (
        <div className="mp-member-list">
          {members.map(m => {
            const name     = getDisplayName(m, currentUser)
            const isYou    = m.user_id === currentUser?.id
            const avatarId = isYou
              ? currentUser?.user_metadata?.avatar_id
              : (m.profiles?.avatar_id ?? null)
            return (
              <div key={m.user_id} className="mp-member-row">
                <AvatarDisplay avatarId={avatarId} name={name} userId={m.user_id} size={38} />
                <div className="mp-member-info">
                  <span className="mp-member-name">
                    {name}
                    {isYou && <span className="mp-you"> · you</span>}
                  </span>
                  <span className="mp-member-date">{formatJoinDate(m.created_at)}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mp-divider" />

      {/* Add by profile code */}
      <p className="mp-section-label">Add by profile code</p>
      <form className="mp-code-form" onSubmit={handleSearch}>
        <input
          className="mp-code-input"
          value={code}
          onChange={e => { setCode(e.target.value); setSearchResult(null); setConfirmed(false) }}
          placeholder="TL-XXXX"
          maxLength={7}
          spellCheck={false}
          autoComplete="off"
        />
        <button className="mp-code-btn" type="submit" disabled={!code.trim() || searching}>
          {searching ? '…' : 'Add'}
        </button>
      </form>

      {searchResult === 'notfound' && (
        <p className="mp-code-error">No user found with that code</p>
      )}

      {searchResult && searchResult !== 'notfound' && !confirmed && (
        <div className="mp-confirm-row">
          <AvatarDisplay
            avatarId={searchResult.avatarId}
            name={searchResult.name}
            userId={searchResult.userId}
            size={36}
          />
          <span className="mp-confirm-name">{searchResult.name}</span>
          <button className="mp-confirm-btn" onClick={() => setConfirmed(true)}>
            Confirm Add
          </button>
        </div>
      )}

      {confirmed && <p className="mp-code-success">✓ Added to tank</p>}
    </div>
  )
}
