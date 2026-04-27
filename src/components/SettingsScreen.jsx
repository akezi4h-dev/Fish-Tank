import { useState } from 'react'
import { supabase } from '../supabaseClient'
import './SettingsScreen.css'

export default function SettingsScreen({ currentUser, onLogout }) {
  const [displayName,    setDisplayName]    = useState(currentUser.user_metadata?.full_name ?? '')
  const [nameSaved,      setNameSaved]      = useState(false)
  const [showEmailForm,  setShowEmailForm]  = useState(false)
  const [newEmail,       setNewEmail]       = useState('')
  const [emailMsg,       setEmailMsg]       = useState(null)
  const [passwordMsg,    setPasswordMsg]    = useState(null)

  async function handleNameBlur() {
    const trimmed = displayName.trim()
    if (trimmed === (currentUser.user_metadata?.full_name ?? '')) return
    await supabase.auth.updateUser({ data: { full_name: trimmed } })
    setNameSaved(true)
    setTimeout(() => setNameSaved(false), 2000)
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

  return (
    <div className="settings-page">
      <h2 className="settings-heading">Settings</h2>

      <div className="settings-section">
        <p className="settings-label">Display Name</p>
        <div className="settings-field-row">
          <input
            className="settings-input"
            value={displayName}
            onChange={e => setDisplayName(e.target.value)}
            onBlur={handleNameBlur}
            placeholder="Your name"
          />
          {nameSaved && <span className="settings-saved">✓ saved</span>}
        </div>
      </div>

      <div className="settings-section">
        <p className="settings-label">Email</p>
        <p className="settings-value">{currentUser.email}</p>
        {!showEmailForm ? (
          <button className="settings-btn" onClick={() => setShowEmailForm(true)}>Change Email</button>
        ) : (
          <form className="settings-inline-form" onSubmit={handleEmailSubmit}>
            <input
              className="settings-input"
              type="email"
              placeholder="New email address"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="settings-btn" type="submit">Confirm</button>
              <button className="settings-btn settings-btn-ghost" type="button" onClick={() => { setShowEmailForm(false); setEmailMsg(null) }}>Cancel</button>
            </div>
          </form>
        )}
        {emailMsg && <p className="settings-msg">{emailMsg}</p>}
      </div>

      <div className="settings-section">
        <p className="settings-label">Password</p>
        <button className="settings-btn" onClick={handlePasswordReset}>Send Password Reset Email</button>
        {passwordMsg && <p className="settings-msg">{passwordMsg}</p>}
      </div>

      <div className="settings-signout">
        <button className="settings-btn settings-btn-danger" onClick={onLogout}>Sign Out</button>
      </div>
    </div>
  )
}
