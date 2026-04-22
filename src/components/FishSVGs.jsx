import angelfish  from '../assets/fish/angelfish.svg'
import clownfish  from '../assets/fish/clownfish.svg'
import eel        from '../assets/fish/eel.svg'
import lionfish   from '../assets/fish/lionfish.svg'
import otter      from '../assets/fish/otter.svg'
import pufferfish from '../assets/fish/pufferfish.svg'
import seal       from '../assets/fish/seal.svg'
import shark      from '../assets/fish/shark.svg'
import turtle     from '../assets/fish/turtle.svg'

export const FISH_TYPES = [
  'clownfish',
  'angelfish',
  'eel',
  'lionfish',
  'otter',
  'pufferfish',
  'seal',
  'shark',
  'turtle',
]

const FISH_IMG_MAP = {
  clownfish,
  angelfish,
  eel,
  lionfish,
  otter,
  pufferfish,
  seal,
  shark,
  turtle,
}

export function FishSVG({ type, color, width = 70, height = 50 }) {
  const src = FISH_IMG_MAP[type] ?? FISH_IMG_MAP.clownfish
  return (
    <img
      src={src}
      width={width}
      height={height}
      alt={type}
      style={{
        filter: `hue-rotate(${color}deg)`,
        objectFit: 'contain',
        display: 'block',
      }}
    />
  )
}
