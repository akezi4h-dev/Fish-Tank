import './TankListView.css'

export default function TankListView({ tanks, onSelectTank }) {
  const visible = [...tanks]
    .filter(t => !t.archived)
    .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))

  return (
    <div className="list-page">
      <h2 className="list-heading">Your Tanks</h2>
      <div className="tank-list">
        {visible.length === 0 && (
          <p className="list-empty">No tanks yet — go to Home to add one.</p>
        )}
        {visible.map(tank => (
          <div key={tank.id} className="list-row" onClick={() => onSelectTank(tank.id)}>
            <div className="list-row-left">
              {tank.hasNotification && <div className="list-notif-dot" />}
              <span className="list-name">
                {tank.pinned && <span className="list-pin">● </span>}
                {tank.name}
              </span>
            </div>
            <span className="list-fish-count">{tank.fish.length} fish</span>
            <span className="list-arrow">›</span>
          </div>
        ))}
      </div>
    </div>
  )
}
