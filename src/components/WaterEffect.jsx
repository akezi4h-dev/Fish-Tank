import './WaterEffect.css'

// Generates a cubic-bezier sine-wave path across the full SVG width.
// Extends one period beyond each edge so the 25vw drift loops seamlessly.
function makeSineWave(yCenter, amplitude, period = 360) {
  const start = -period
  const end = 1440 + period
  let d = `M ${start},${yCenter}`
  let x = start
  let goingUp = true
  while (x < end) {
    const half = period / 2
    const peakY = yCenter + (goingUp ? -amplitude : amplitude)
    const cx1 = (x + half * 0.25).toFixed(1)
    const cx2 = (x + half * 0.75).toFixed(1)
    const nx  = x + half
    d += ` C ${cx1},${peakY} ${cx2},${peakY} ${nx},${yCenter}`
    x = nx
    goingUp = !goingUp
  }
  return d
}

const WAVES = [
  { y: 120, amp: 10, xDur: '12s', xDelay: '0s',    yDur: '9s',  yDelay: '0s',    yDist: '-7px'  },
  { y: 260, amp:  8, xDur: '16s', xDelay: '-5s',   yDur: '12s', yDelay: '-3s',   yDist: '-5px'  },
  { y: 390, amp: 12, xDur: '20s', xDelay: '-10s',  yDur: '10s', yDelay: '-7s',   yDist: '-9px'  },
]

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

export default function WaterEffect() {
  return (
    <div className="water-effect">

      {/* Layer 1 — horizontal sine waves, drifting right, undulating vertically */}
      {WAVES.map((w, i) => (
        <div
          key={i}
          className="wave-y"
          style={{
            animationDuration: w.yDur,
            animationDelay: w.yDelay,
            '--y-dist': w.yDist,
          }}
        >
          <svg
            className="wave-x"
            viewBox="0 0 1440 600"
            preserveAspectRatio="none"
            style={{ animationDuration: w.xDur, animationDelay: w.xDelay }}
          >
            <path
              d={makeSineWave(w.y, w.amp)}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>
      ))}

      {/* Layer 2 — surface shimmer band (very subtle) */}
      <div className="surface-shimmer" />

      {/* Layer 3 — floating particles rising upward */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="water-particle"
          style={{
            left: p.left,
            bottom: p.bottom,
            width:  p.size,
            height: p.size,
            animationDuration: p.dur,
            animationDelay:    p.delay,
          }}
        />
      ))}

    </div>
  )
}
