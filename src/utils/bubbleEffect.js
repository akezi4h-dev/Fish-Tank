// Spawn rising teal bubbles from a button element on completion actions.
// Uses the Web Animations API — no CSS injection, each bubble cleans itself up.
export function spawnBubbles(buttonEl) {
  const rect  = buttonEl.getBoundingClientRect()
  const count = 6 + Math.floor(Math.random() * 3)  // 6–8 bubbles

  for (let i = 0; i < count; i++) {
    const size     = 6  + Math.random() * 6          // 6–12 px
    const startX   = rect.left + Math.random() * rect.width
    const startY   = rect.top  + rect.height * 0.5
    const travel   = 40 + Math.random() * 30          // 40–70 px upward
    const wobble   = (Math.random() - 0.5) * 24       // ±12 px left/right drift
    const duration = 600 + Math.random() * 400        // 600–1000 ms
    const delay    = Math.random() * 150              // 0–150 ms stagger
    const g        = Math.round(143 + Math.random() * 30)  // 143–173 (green channel variation)
    const b        = Math.round(100 + Math.random() * 34)  // 100–134 (blue channel variation)
    const alpha    = +(0.5 + Math.random() * 0.3).toFixed(2)

    const el = document.createElement('div')
    el.style.cssText = [
      'position:fixed',
      `width:${size}px`,
      `height:${size}px`,
      'border-radius:50%',
      `background:rgba(29,${g},${b},${alpha})`,
      `left:${startX - size / 2}px`,
      `top:${startY - size / 2}px`,
      'pointer-events:none',
      'z-index:9999',
    ].join(';')

    document.body.appendChild(el)

    el.animate(
      [
        { transform: 'translateY(0px) translateX(0px)', opacity: alpha },
        { transform: `translateY(-${travel}px) translateX(${wobble}px)`, opacity: 0 },
      ],
      { duration, delay, easing: 'ease-out', fill: 'forwards' }
    ).onfinish = () => el.remove()
  }
}
