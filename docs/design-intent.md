# Design Intent — Tide Lines

## Personal Statement

As an international student, distance is what brings my friends and family closer and apart. With busy schedules it's hard to keep in contact with what's going on in our lives. My goal is to create a fish tank that displays messages of different people.

*Tide Lines* is a shared aquarium where each fish is a message from a person you love. The tank is always alive — new fish enter, swim freely, and carry their sender's words. Connection feels ambient, not obligatory.

**Target audience:** Gen Z, Gen Alpha, and Millennials in long distance relationships with family, friends, and partners.

The fish metaphor earns its domain — messages accumulate like a living reef. Unlike a group chat, you browse at your own pace. Unlike social media, there is no feed, no algorithm — just fish.

---

## Design Structure

### Browser — the tank
The shared aquarium. All fish swim here.

- **reads** `fish[]` and `selectedFish` · **writes** `selectedFish`
- Maps over `fish[]`. On click → calls `onSelect(id)` → parent sets `selectedFish`

### Detail View — fish profile
Full message, sender, timestamp, appearance.

- **reads only** — receives `selectedFish` as prop. Reacts, never initiates.

### Controller — add your fish
Write message, customize, release to tank.

- **reads** + **writes** `fish[]`
- On submit → appends new fish object to `fish[]` in parent state

---

## State Flow

```
User clicks fish
→ Browser calls onSelect(id)
→ Parent updates selectedFish
→ Detail View re-renders

User submits Controller
→ Parent calls setFish([...fish, newFish])
→ Browser adds new fish to tank
```

**Architectural rule:** No component holds its own copy of fish data. State lives only in the parent. Props down, events up.

---

## JSON Shape

```json
{
  "selectedFish": "fish-03",
  "fish": [
    {
      "id": "fish-03",
      "senderName": "Mom",
      "message": "Miss you! Eat something warm today.",
      "fishName": "Goldie",
      "color": "#f4a261",
      "pattern": "stripes",
      "finStyle": "flowy",
      "timestamp": "2026-04-18"
    }
  ],
  "filterBy": "all"
}
```

---

## Fish Customization (Controller fields)

- Your name
- Message text
- Fish name
- Body color
- Pattern — solid / stripes / spots / gradient
- Fin style — flowy / spiky / small / fan

---

## Visual Mood

**Deep ocean — dark, atmospheric, bioluminescent**

- Deep navy backgrounds
- Bioluminescent teal/aqua accents
- Warm coral/amber for individual fish
- Soft lavender for hover states
- Monospace or rounded sans for UI text
- Generous negative space
- Fish are the only thing that should glow

---

## Interaction Feel

The tank should feel alive but unhurried — fish drift with subtle CSS animation. Clicking a fish should feel like reaching into water: a gentle pause before the Detail View reveals the message. The Controller should feel like crafting something, not filling out a form. Releasing your fish into the tank is the moment of emotional payoff — it should animate in from the edge.
