import './BottomNav.css'
import { HomeIcon, FishNavIcon, SettingsNavIcon, QuestionIcon } from './Icons'

const navBarStyle = {
  backdropFilter:         'blur(12px)',
  WebkitBackdropFilter:   'blur(12px)',
  border:                 '0.5px solid rgba(255,255,255,0.1)',
  borderRadius:           '999px',
  padding:                '10px 24px',
  position:               'fixed',
  bottom:                 '24px',
  left:                   '50%',
  transform:              'translateX(-50%)',
  display:                'flex',
  alignItems:             'center',
  gap:                    '8px',
  zIndex:                 100,
}

const TABS = [
  { id: 'home',     label: 'Home',     Icon: HomeIcon },
  { id: 'tanks',    label: 'Tanks',    Icon: FishNavIcon },
  { id: 'settings', label: 'Settings', Icon: SettingsNavIcon },
  { id: 'help',     label: 'Help',     Icon: QuestionIcon },
]

export default function BottomNav({ currentScreen, onNavigate }) {
  return (
    <nav className="bottom-nav" style={{ ...navBarStyle, background: 'rgba(4, 16, 30, 0.92)' }}>
      {TABS.map(({ id, label, Icon }) => {
        const active = currentScreen === id
        return (
          <button
            key={id}
            className={`nav-btn${active ? ' nav-btn-active' : ''}`}
            onClick={() => onNavigate(id)}
            title={label}
          >
            <Icon width={18} height={18} />
            {active && <span className="nav-label">{label}</span>}
          </button>
        )
      })}
    </nav>
  )
}
