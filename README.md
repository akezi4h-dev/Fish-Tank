# Tide Lines

A shared fish tank messaging app for international students and diaspora families. Each fish is a message from someone you love. Built with React + Vite, hosted on GitHub Pages.

**Live site:** https://akezi4h-dev.github.io/Fish-Tank/

---

## What It Does

Tide Lines lets you create shared fish tanks with the people you're close to. Every fish in a tank is a message — someone picked a species, chose a color, wrote a note, and sent it swimming toward you. You can share tanks with friends and family using invite codes.

---

## Features

### Login & Auth
- Email/password sign in and sign up via Supabase Auth
- First name captured at signup, displayed on the home screen
- Session persists across page reloads — you stay logged in
- Join a shared tank directly from the login screen using an invite code
- Infinite-scroll carousel of live tank previews runs behind the login form

### Home Screen
- Personalized welcome message ("Welcome back, [name]")
- Grid of all your tanks with live fish previews
- Red notification dot on any tank that has new fish since your last visit
- Pin, mute, archive, and invite controls per tank

### Tank View (Screen 2)
- Full-screen immersive tank with animated fish swimming in real time
- Water effect: three horizontal sine-wave lines that drift and undulate independently
- Click or tap a fish to stop it and read its message bubble
- Hover (desktop) shows the bubble without stopping the fish
- Filter by sender and date; control wave speed and intensity
- Switch between day and night mood, and between ocean background scenes

### Tanks Tab — Swipeable Experience
- Tapping Tanks in the bottom nav drops you directly into a full-screen tank
- Swipe left and right to travel between your tanks
- Dot indicators at the top show your position without a list
- Touch events use capture-phase native listeners so fish and buttons never block swipe gestures

### Add Fish (Screen 3)
- Pick from 9 species: clownfish, angelfish, eel, lionfish, otter, pufferfish, seal, shark, turtle
- Color slider applies hue-rotate on top of the actual SVG artwork
- Write a message; fish appear in the tank immediately

### Bottom Navigation
- Persistent bar: Home, Tanks, Settings, Help
- Floating pill design, frosted glass, always accessible

### Settings
- Update display name (saves to Supabase user metadata)
- Change email
- Send a password reset email
- Sign out

---

## Tech Stack

- **React + Vite** — component architecture, no external state library
- **Supabase** — auth, Postgres database, Row Level Security, SECURITY DEFINER RPC for invite join
- **GitHub Pages** — deployed via GitHub Actions on every push to main
- **CSS** — all styling handwritten; no UI library

### Architecture

State lives entirely in `App.jsx` and flows down through props. No Context, no Redux. Key components:

| File | Role |
|------|------|
| `App.jsx` | All state, Supabase calls, screen routing |
| `TankGrid.jsx` | Screen 1 — home grid + `TankPreview` |
| `TankView.jsx` | Screen 2 — full tank, fish interaction, water effect |
| `AddFishModal.jsx` | Screen 3 — species picker, color, message |
| `FishSVGs.jsx` | Single source for all 9 fish species (shared by all screens) |
| `SwipeTankView.jsx` | Wraps TankView with swipe gesture handling and slide transitions |
| `BottomNav.jsx` | Persistent navigation bar |
| `LoginScreen.jsx` | Auth form + infinite-scroll carousel background |
| `SettingsScreen.jsx` | Account management |
| `HelpScreen.jsx` | Usage guide |

---

## AI 201 — ESF Documentation

This project was built for SCAD AI 201 Project 2. Full documentation of AI direction decisions and resistance choices is in the `/docs` folder:

- **[AI Direction Log](docs/ai-direction-log.md)** — 22 entries documenting every significant prompt, what AI produced, what was changed, and why
- **[Records of Resistance](docs/records-of-resistance.md)** — 10 entries where I explicitly rejected AI output and directed something different, with reasoning

### What AI Did and Did Not Do

AI wrote code when given specific architectural direction. It did not:
- Invent the concept, name, or emotional framing (Tide Lines is personal — rooted in being an international student)
- Choose the fish species, visual style, or artwork (9 custom SVG illustrations are mine)
- Determine the state architecture (single App.jsx hub, props down, events up)
- Decide the interaction model (swipeable tanks instead of a list, click-to-stop fish, capture-phase touch listeners)
- Choose the visual direction (deep ocean mood, sine wave water effect, 200px fish, ambient carousel)

Every significant deviation from AI's first output is documented in the records above.
