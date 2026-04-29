import { useState, useRef } from 'react'
import { supabase } from '../supabaseClient'
import './SettingsScreen.css'

const TABS = [
  { id: 'account',       icon: '◯', label: 'Account' },
  { id: 'security',      icon: '⊗', label: 'Security' },
  { id: 'notifications', icon: '◎', label: 'Notifications' },
]

function getInitials(name) {
  if (!name) return '?'
  return name.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

/* ── Sub-panels ──────────────────────────────────────── */

function AccountPanel({ fullName, setFullName, username, setUsername, bio, setBio, email, displayName, avatarUrl, onUploadAvatar, onRemoveAvatar, uploading, onSave, saving, saved }) {
  const fileInputRef = useRef(null)

  return (
    <div className="settings-panel">
      <h2 className="settings-panel-heading">Account settings</h2>

      <div className="settings-profile-row">
        {avatarUrl
          ? <img src={avatarUrl} alt="Profile" className="settings-avatar settings-avatar-lg settings-avatar-img" />
          : <div className="settings-avatar settings-avatar-lg">{getInitials(displayName)}</div>
        }
        <div className="settings-profile-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={e => { if (e.target.files[0]) onUploadAvatar(e.target.files[0]) }}
          />
          <button
            className="sett-btn sett-btn-ghost"
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
          >
            {uploading ? 'Uploading…' : 'Upload photo'}
          </button>
          {avatarUrl && (
            <button className="sett-btn sett-btn-text" onClick={onRemoveAvatar}>
              Remove
            </button>
          )}
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

  const [activeTab, setActiveTab] = useState('account')

  // Account
  const [fullName,       setFullName]       = useState(meta.full_name  ?? '')
  const [username,       setUsername]       = useState(meta.username   ?? '')
  const [bio,            setBio]            = useState(meta.bio        ?? '')
  const [avatarUrl,      setAvatarUrl]      = useState(meta.avatar_url ?? '')
  const [savingProfile,  setSavingProfile]  = useState(false)
  const [profileSaved,   setProfileSaved]   = useState(false)
  const [uploading,      setUploading]      = useState(false)

  // Security
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [newEmail,      setNewEmail]      = useState('')
  const [emailMsg,      setEmailMsg]      = useState(null)
  const [passwordMsg,   setPasswordMsg]   = useState(null)

  // Notifications
  const [notifEnabled, setNotifEnabled] = useState(meta.notificationsEnabled !== false)

  const displayName = meta.full_name || currentUser.email?.split('@')[0] || 'You'

  async function handleUploadAvatar(file) {
    setUploading(true)
    const ext  = file.name.split('.').pop()
    const path = `${currentUser.id}/${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })
    if (uploadError) { setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path)
    await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })
    setAvatarUrl(publicUrl)
    setUploading(false)
  }

  async function handleRemoveAvatar() {
    await supabase.auth.updateUser({ data: { avatar_url: '' } })
    setAvatarUrl('')
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

      {/* ── Sidebar ── */}
      <aside className="settings-sidebar">
        <div className="settings-logo">Tide Lines</div>

        <div className="settings-avatar-block">
          {avatarUrl
            ? <img src={avatarUrl} alt="Profile" className="settings-avatar settings-avatar-img" />
            : <div className="settings-avatar">{getInitials(displayName)}</div>
          }
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
            avatarUrl={avatarUrl}
            onUploadAvatar={handleUploadAvatar}
            onRemoveAvatar={handleRemoveAvatar}
            uploading={uploading}
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
