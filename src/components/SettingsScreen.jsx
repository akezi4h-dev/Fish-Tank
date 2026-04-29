import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { AvatarDisplay, AvatarPickerModal } from './Avatars'
import './SettingsScreen.css'

const TABS = [
  { id: 'account',       icon: '◯', label: 'Account' },
  { id: 'security',      icon: '⊗', label: 'Security' },
  { id: 'notifications', icon: '◎', label: 'Notifications' },
]

/* ── Sub-panels ──────────────────────────────────────── */

function AccountPanel({ fullName, setFullName, username, setUsername, bio, setBio, email, displayName, avatarId, userId, onChangeAvatar, onSave, saving, saved }) {
  return (
    <div className="settings-panel">
      <h2 className="settings-panel-heading">Account settings</h2>

      <div className="settings-profile-row">
        <button className="avp-trigger-btn" onClick={onChangeAvatar} title="Change avatar">
          <AvatarDisplay avatarId={avatarId} name={displayName} userId={userId} size={64} />
          <div className="avp-trigger-overlay">Change</div>
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: "'pt-serif', serif", fontSize: '1rem', color: '#211E4A', fontWeight: 600 }}>
            {displayName}
          </span>
          <button
            className="sett-btn sett-btn-text"
            style={{ padding: '2px 0', fontSize: '0.82rem', textAlign: 'left' }}
            onClick={onChangeAvatar}
          >
            Change avatar
          </button>
        </div>
      </div>

      <div className="settings-form-grid">
        <div className="settings-field">
          <label className="settings-field-label">Full name</label>
          <input
            className="settings-input"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div className="settings-field">
          <label className="settings-field-label">Email</label>
          <input
            className="settings-input settings-input-readonly"
            value={email}
            readOnly
          />
        </div>
        <div className="settings-field">
          <label className="settings-field-label">Username</label>
          <input
            className="settings-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="@username"
          />
        </div>
        <div className="settings-field settings-field-full">
          <label className="settings-field-label">Bio</label>
          <textarea
            className="settings-input settings-textarea"
            value={bio}
            onChange={e => setBio(e.target.value)}
            placeholder="A few words about you…"
            rows={3}
          />
        </div>
      </div>

      <button
        className={`sett-btn sett-btn-primary${saved ? ' sett-btn-saved' : ''}`}
        onClick={onSave}
        disabled={saving}
      >
        {saving ? 'Saving…' : saved ? '✓ Profile updated' : 'Update profile'}
      </button>
    </div>
  )
}

function SecurityPanel({ email, showEmailForm, setShowEmailForm, newEmail, setNewEmail, emailMsg, setEmailMsg, passwordMsg, onEmailSubmit, onPasswordReset }) {
  return (
    <div className="settings-panel">
      <h2 className="settings-panel-heading">Security</h2>

      <div className="settings-section-card">
        <p className="settings-section-label">Email address</p>
        <div className="settings-email-row">
          <span className="settings-email-value">{email}</span>
          {!showEmailForm && (
            <button className="sett-btn sett-btn-ghost" onClick={() => setShowEmailForm(true)}>
              Change email
            </button>
          )}
        </div>
        {showEmailForm && (
          <form className="settings-inline-form" onSubmit={onEmailSubmit}>
            <input
              className="settings-input"
              type="email"
              placeholder="New email address"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              autoFocus
            />
            <div className="settings-form-btns">
              <button className="sett-btn sett-btn-primary" type="submit">Confirm</button>
              <button
                className="sett-btn sett-btn-ghost"
                type="button"
                onClick={() => { setShowEmailForm(false); setEmailMsg(null) }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {emailMsg && <p className="settings-msg">{emailMsg}</p>}
      </div>

      <div className="settings-section-card">
        <p className="settings-section-label">Password</p>
        <p className="settings-section-desc">
          We'll send a reset link to your email address.
        </p>
        <button className="sett-btn sett-btn-ghost" onClick={onPasswordReset}>
          Send password reset email
        </button>
        {passwordMsg && <p className="settings-msg settings-msg-success">{passwordMsg}</p>}
      </div>
    </div>
  )
}

function NotificationsPanel({ notifEnabled, onToggle }) {
  return (
    <div className="settings-panel">
      <h2 className="settings-panel-heading">Notifications</h2>

      <div className="settings-section-card">
        <div className="settings-toggle-row">
          <div>
            <p className="settings-section-label">New fish notifications</p>
            <p className="settings-section-desc">
              Show a dot on tanks when a new fish arrives while you're away.
            </p>
          </div>
          <button
            className={`settings-toggle${notifEnabled ? ' settings-toggle-on' : ''}`}
            onClick={onToggle}
            role="switch"
            aria-checked={notifEnabled}
          >
            <span className="settings-toggle-thumb" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main component ──────────────────────────────────── */

export default function SettingsScreen({ currentUser, onLogout }) {
  const meta = currentUser.user_metadata ?? {}

  const [activeTab,     setActiveTab]     = useState('account')
  const [pickerOpen,    setPickerOpen]    = useState(false)

  // Account
  const [avatarId,       setAvatarId]       = useState(meta.avatar_id   ?? null)
  const [fullName,       setFullName]       = useState(meta.full_name   ?? '')
  const [username,       setUsername]       = useState(meta.username    ?? '')
  const [bio,            setBio]            = useState(meta.bio         ?? '')
  const [savingProfile,  setSavingProfile]  = useState(false)
  const [profileSaved,   setProfileSaved]   = useState(false)

  // Security
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [newEmail,      setNewEmail]      = useState('')
  const [emailMsg,      setEmailMsg]      = useState(null)
  const [passwordMsg,   setPasswordMsg]   = useState(null)

  // Notifications
  const [notifEnabled, setNotifEnabled] = useState(meta.notificationsEnabled !== false)

  const displayName = meta.full_name || currentUser.email?.split('@')[0] || 'You'

  async function handleSelectAvatar(id) {
    setAvatarId(id)
    setPickerOpen(false)
    await supabase.auth.updateUser({ data: { avatar_id: id } })
  }

  async function handleUpdateProfile() {
    setSavingProfile(true)
    await supabase.auth.updateUser({ data: {
      full_name: fullName.trim(),
      username:  username.trim(),
      bio:       bio.trim(),
    }})
    setSavingProfile(false)
    setProfileSaved(true)
    setTimeout(() => setProfileSaved(false), 2500)
  }

  async function handleEmailSubmit(e) {
    e.preventDefault()
    if (!newEmail.trim()) return
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() })
    if (error) {
      setEmailMsg(error.message)
    } else {
      setEmailMsg('Check your new email to confirm the change.')
      setShowEmailForm(false)
      setNewEmail('')
    }
  }

  async function handlePasswordReset() {
    await supabase.auth.resetPasswordForEmail(currentUser.email)
    setPasswordMsg('Password reset email sent — check your inbox.')
  }

  async function handleNotifToggle() {
    const next = !notifEnabled
    setNotifEnabled(next)
    await supabase.auth.updateUser({ data: { notificationsEnabled: next } })
  }

  return (
    <div className="settings-page">

      {/* ── Avatar picker (fixed overlay, always on top) ── */}
      {pickerOpen && (
        <AvatarPickerModal
          currentAvatarId={avatarId}
          onSelect={handleSelectAvatar}
          onClose={() => setPickerOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className="settings-sidebar">
        <div className="settings-logo">Tide Lines</div>

        <div className="settings-avatar-block">
          <AvatarDisplay
            avatarId={avatarId}
            name={displayName}
            userId={currentUser.id}
            size={52}
          />
          <p className="settings-sidebar-name">{displayName}</p>
          <p className="settings-sidebar-email">{currentUser.email}</p>
        </div>

        <nav className="settings-nav">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`settings-nav-item${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="settings-nav-icon">{tab.icon}</span>
              <span className="settings-nav-label">{tab.label}</span>
            </button>
          ))}
        </nav>

        <button className="settings-signout-btn" onClick={onLogout}>
          ↩ Sign Out
        </button>
      </aside>

      {/* ── Content ── */}
      <main className="settings-content">
        {activeTab === 'account' && (
          <AccountPanel
            fullName={fullName}   setFullName={setFullName}
            username={username}   setUsername={setUsername}
            bio={bio}             setBio={setBio}
            email={currentUser.email}
            displayName={displayName}
            avatarId={avatarId}
            userId={currentUser.id}
            onChangeAvatar={() => setPickerOpen(true)}
            onSave={handleUpdateProfile}
            saving={savingProfile}
            saved={profileSaved}
          />
        )}
        {activeTab === 'security' && (
          <SecurityPanel
            email={currentUser.email}
            showEmailForm={showEmailForm} setShowEmailForm={setShowEmailForm}
            newEmail={newEmail}           setNewEmail={setNewEmail}
            emailMsg={emailMsg}           setEmailMsg={setEmailMsg}
            passwordMsg={passwordMsg}
            onEmailSubmit={handleEmailSubmit}
            onPasswordReset={handlePasswordReset}
          />
        )}
        {activeTab === 'notifications' && (
          <NotificationsPanel
            notifEnabled={notifEnabled}
            onToggle={handleNotifToggle}
          />
        )}
      </main>

    </div>
  )
}
