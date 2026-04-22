import './WaterEffect.css'

const PARTICLES = [
  { left: '8%',  bottom: '12%', size: 2, dur: '7s',  delay: '0s'    },
  { left: '18%', bottom: '25%', size: 3, dur: '9s',  delay: '-2.3s' },
  { left: '30%', bottom: '8%',  size: 2, dur: '6s',  delay: '-4.1s' },
  { left: '42%', bottom: '35%', size: 4, dur: '11s', delay: '-1.7s' },
  { left: '55%', bottom: '15%', size: 2, dur: '8s',  delay: '-5.5s' },
  { left: '63%', bottom: '42%', size: 3, dur: '10s', delay: '-0.9s' },
  { left: '72%', bottom: '20%', size: 2, dur: '7s',  delay: '-3.4s' },
  { left: '80%', bottom: '10%', size: 4, dur: '9s',  delay: '-6.2s' },
  { left: '88%', bottom: '30%', size: 2, dur: '8s',  delay: '-2.8s' },
  { left: '25%', bottom: '55%', size: 3, dur: '12s', delay: '-7.1s' },
  { left: '50%', bottom: '60%', size: 2, dur: '10s', delay: '-4.8s' },
  { left: '75%', bottom: '50%', size: 3, dur: '8s',  delay: '-1.2s' },
]

// SVG caustic rays — diagonal stripes at varying positions and widths
const RAYS = [
  { x1:  '5%', x2: '18%', width: 6,  dur: '10s', delay: '0s'    },
  { x1: '15%', x2: '26%', width: 4,  dur: '13s', delay: '-3s'   },
  { x1: '28%', x2: '38%', width: 8,  dur: '9s',  delay: '-6s'   },
  { x1: '40%', x2: '50%', width: 5,  dur: '11s', delay: '-1.5s' },
  { x1: '52%', x2: '60%', width: 7,  dur: '8s',  delay: '-4.5s' },
  { x1: '62%', x2: '72%', width: 4,  dur: '12s', delay: '-2s'   },
  { x1: '74%', x2: '83%', width: 9,  dur: '10s', delay: '-7s'   },
  { x1: '85%', x2: '96%', width: 5,  dur: '9s',  delay: '-5s'   },
]

export default function WaterEffect() {
  return (
    <div className="water-effect">

      {/* Layer 1 — caustic light rays (SVG diagonal lines drifting down) */}
      <svg className="caustic-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
        {RAYS.map((r, i) => (
          <line
            key={i}
            className="caustic-ray"
            x1={r.x1} y1="-5"
            x2={r.x2} y2="105"
            stroke="rgba(255,255,255,0.045)"
            strokeWidth={r.width}
            style={{ animationDuration: r.dur, animationDelay: r.delay }}
          />
        ))}
      </svg>

      {/* Layer 2 — surface ripple shimmer band */}
      <div className="surface-shimmer" />

      {/* Layer 3 — floating particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="water-particle"
          style={{
            left: p.left,
            bottom: p.bottom,
            width: p.size,
            height: p.size,
            animationDuration: p.dur,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  )
}
