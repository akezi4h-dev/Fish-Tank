import { useState } from 'react'
import TankGrid from './components/TankGrid'
import './index.css'

const INITIAL_TANKS = [
  {
    id: 'tank-01',
    name: 'Castro Family Fishtank',
    fish: [
      {
        id: 'fish-01',
        type: 'clownfish',
        color: 0,
        message: 'Miss you! Eat something warm today.',
        senderName: 'Mom',
        timestamp: '2026-04-18',
      },
      {
        id: 'fish-02',
        type: 'angelfish',
        color: 200,
        message: 'Come home soon okay? We saved your seat.',
        senderName: 'Dad',
        timestamp: '2026-04-19',
      },
    ],
  },
  {
    id: 'tank-02',
    name: 'Study Abroad Squad',
    fish: [
      {
        id: 'fish-03',
        type: 'betta',
        color: 280,
        message: 'Did you try that ramen place yet??',
        senderName: 'Priya',
        timestamp: '2026-04-17',
      },
      {
        id: 'fish-04',
        type: 'goldfish',
        color: 40,
        message: 'Sending good vibes for your finals week.',
        senderName: 'Leo',
        timestamp: '2026-04-20',
      },
    ],
  },
]

export default function App() {
  const [tanks, setTanks] = useState(INITIAL_TANKS)
  const [selectedTank, setSelectedTank] = useState(null)
  const [selectedFish, setSelectedFish] = useState(null)
  const [filterBy, setFilterBy] = useState({ sender: 'all', date: 'all' })
  const [waterSpeed, setWaterSpeed] = useState(1)
  const [waveIntensity, setWaveIntensity] = useState(1)
  const [tankMood, setTankMood] = useState('day')
  const [backgroundScene, setBackgroundScene] = useState('ocean')
  const [modalOpen, setModalOpen] = useState(false)

  function selectTank(tankId) {
    setSelectedTank(tankId)
    setSelectedFish(null)
  }

  function selectFish(fishId) {
    setSelectedFish(fishId)
  }

  function addFish(newFish) {
    setTanks(prev =>
      prev.map(tank =>
        tank.id === selectedTank
          ? { ...tank, fish: [...tank.fish, newFish] }
          : tank
      )
    )
    setModalOpen(false)
  }

  function addTank(name) {
    const id = `tank-${Date.now()}`
    setTanks(prev => [...prev, { id, name, fish: [] }])
  }

  function onFilterChange(newFilter) {
    setFilterBy(prev => ({ ...prev, ...newFilter }))
  }

  function toggleMood() {
    setTankMood(prev => (prev === 'day' ? 'night' : 'day'))
  }

  function setScene(scene) {
    setBackgroundScene(scene)
  }

  if (!selectedTank) {
    return (
      <TankGrid
        tanks={tanks}
        onSelectTank={selectTank}
        onAddTank={addTank}
      />
    )
  }

  return null
}
