# AI Direction Log
**Project:** Tide Lines — AI 201 Project 2
**Student:** akezi4h-dev
**Format:** Each entry names the prompt given, what AI produced, what was changed, and why.

---

## Entry 1 — Domain & Concept Direction

**Session:** Project kickoff
**What I asked:** I told Claude the domain was "my github repo" before clarifying. When I clarified, I said I was going to write a design intent document tonight.
**What AI did:** Claude correctly paused and waited. It did not generate a domain concept on its own or try to interpret "my GitHub repo" as a theme. It asked clarifying questions: was it a portfolio viewer of my repos, or something about this specific repo?
**What I did instead:** I came back with a fully personal design intent — *Tide Lines*, a shared fish tank where each fish is a message from someone you love, rooted in my experience as an international student. The fish metaphor came from me, the name "Tide Lines" came from me, the emotional framing ("connection feels ambient, not obligatory") came from me.
**Why it matters:** The assignment says to be the Art Director of a system. I didn't let AI generate the concept. The domain is personal and specific to my life — AI couldn't have invented it.

---

## Entry 2 — Build Order Enforcement

**Session:** After design intent was submitted
**What I asked:** I gave Claude the full spec and said: *"Build it one component at a time, starting with the data model and parent state."*
**What AI produced:** Claude built only the parent App component with the full useState shape and mock data — no UI, no components, just state and handlers. It explicitly returned `null` from the render.
**What I did:** I approved this and said "yes" to proceed to Screen 1.
**Why it matters:** The assignment explicitly warns that AI will try to build all three panels at once and make architectural decisions you didn't approve. I enforced the build order: parent state → Screen 1 → Screen 2 → Screen 3. Each step required my explicit go-ahead. Claude did not deviate from this sequence.

---

## Entry 3 — Fish Type Connection (Caught and Directed)

**Session:** After all three screens were built
**What AI produced:** Claude built `TankView.jsx` with its own internal `FishSVG({ color })` component that rendered a single hardcoded generic fish shape — an ellipse + triangle tail + eye. The `fish.type` field from state was passed into the fish object but was never read in the tank renderer. Every fish in Screen 2 looked identical regardless of type.
**What I asked Claude to show me:** *"Show me where in the code the fish type from state is being used to determine what renders in the tank. If it's not connected, fix it."*
**What I directed:** I caught the disconnection and directed Claude to extract all fish shapes into a shared `FishSVGs.jsx` file, export a single `FishSVG` component that takes both `type` and `color` as props, and use it in both TankView and AddFishModal. Both screens now import from the same source.
**Why it matters:** This is the exact failure mode the assignment warns about — AI builds something that looks connected but the data isn't actually flowing. `fish.type` was in state. It just wasn't being read. I caught it and directed the architectural fix.

---

## Entry 4 — Custom Artwork Over AI-Generated SVGs

**Session:** After fish type fix
**What AI produced:** Claude had generated five hand-coded SVG fish (clownfish, angelfish, betta, goldfish, pufferfish) using basic geometric shapes — ellipses, polygons, lines. They were functional but generic. The AI designed them from scratch with no reference to my visual intent.
**What I did:** I had my own custom SVG artwork in the repo folder (`Untitled (4)/`): Angel Fish, Clownfish, Eel, Lion Fish, Otter, Puffer Fish, Seal, Shark, Turtle — 9 files. I directed Claude to replace the AI-generated SVGs entirely with my artwork.
**What changed:** The AI's geometric fish shapes were deleted. All 9 custom files were moved to `src/assets/fish/`, imported into `FishSVGs.jsx`, and the `FishSVG` component was rewritten to render `<img>` tags pointing to my files. The color slider still applies `hue-rotate` on top of the real artwork.
**Why it matters:** Visual direction is mine. AI generated placeholder shapes because it had nothing else to work with. When I had real assets, I replaced the placeholders. The final app reflects my artwork, not Claude's geometric approximations.

---

## Entry 5 — Expanding Fish Types (9 vs 5)

**Session:** Same session as custom artwork
**What AI assumed:** The original spec and the AddFishModal were built for exactly 5 fish types — clownfish, angelfish, betta, goldfish, pufferfish — matching the spec I provided.
**What I directed:** When I brought in my custom SVG folder, I had 9 files, not 5. I explicitly asked: *"can i add all the images and the types to the modal selector."* I directed expanding FISH_TYPES from 5 to all 9: clownfish, angelfish, eel, lionfish, otter, pufferfish, seal, shark, turtle.
**What changed:** `FISH_TYPES` array in `FishSVGs.jsx` expanded. The modal selector now arrows through all 9. The tank can render all 9 types.
**Why it matters:** The final creative scope of the species in the tank is my decision. AI had no knowledge of the Otter, Seal, Shark, Turtle, or Eel until I surfaced the files. I defined what belongs in this tank.

---

## Entry 6 — Replacing Caustic Rays with Sine Wave Water Effect

**Session:** After all three screens were complete and deployed
**What AI produced:** Claude implemented a water effect with three layers: caustic light rays (diagonal SVG rectangles spanning the tank), a surface shimmer band, and floating particles. The caustic layer rendered as large diagonal stripe shapes overlaid across the tank.
**What I rejected:** The diagonal stripes looked wrong — they obscured the tank background instead of enhancing it. I directed Claude to remove the caustic rays entirely.
**What I directed:** I gave Claude a full replacement spec: horizontal SVG sine wave paths only, no diagonal shapes, nothing that blocks the tank background. I specified the technique — cubic bezier sine paths, separate X drift and Y undulation on two different elements — and the visual parameters: 3 waves at different depths, thin strokes at very low opacity, subtle particles, minimal surface shimmer.
**Why it matters:** The water effect is an atmospheric layer. I defined what atmospheric means for this project: horizontal, subtle, background-visible. When AI produced something that contradicted that, I caught it visually, described exactly what was wrong, and gave a precise replacement directive. The final effect looks like water because I directed it to look like water.

---

## Entry 7 — Connecting Wave Slider to WaterEffect Speed

**Session:** Continued session after water effect rewrite
**What AI produced:** The WaterEffect component used hardcoded animation durations from the WAVES array (`xDur`, `yDur`). The Waves slider in the bottom nav already controlled fish swim speed via `waterSpeed`, but wave animation speed was static — sliding the Waves control did nothing to the wave lines themselves.
**What I directed:** I asked for the wave slider to make the waves faster when moved to the right. I directed Claude to pass `waveIntensity` as a `speed` prop into `WaterEffect` and divide each wave's X and Y animation durations by that value.
**What changed:** `WaterEffect` now accepts `speed={waveIntensity}` from `TankView`. Both `xDur` and `yDur` are divided by `speed` at render time. Moving the slider right increases speed across all three wave lines simultaneously.
**Why it matters:** The slider was already wired to fish speed. Extending it to wave speed makes the control feel complete — everything in the tank responds to the same input. I identified the gap between what the slider claimed to do and what it actually did, and directed the fix.

---

## Entry 8 — Enlarging Tank Cards on Screen 1

**Session:** Continued session
**What AI produced:** The TankGrid used a `maxWidth: 800px` container with a 3-column grid and 24px gaps. The tank cards were sized by that constraint — functional but small relative to the available screen space.
**What I directed:** I asked for the tanks to be bigger on the first screen. I directed Claude to widen the grid to `maxWidth: 1100px` and increase the column gap to 32px so each card has more room and the preview windows are larger.
**Why it matters:** Layout scale is a visual direction decision. The cards are the primary UI element on Screen 1 — they should read immediately as fish tanks, not thumbnails. Widening the grid gives the preview fish more room to swim and makes the emotional content of each tank more legible at a glance.

---

## Entry 9 — Tank Management Buttons (Pin, Invite, Mute, Archive)

**Session:** New session
**What I directed:** I specified four new circular icon buttons to appear beneath each tank card on Screen 1 — pin, invite, mute, and archive — each with its own behavior and state toggle. I defined how state should flow: all four booleans (`pinned`, `muted`, `archived`) live on the tank object in parent state, and the invite modal's open/target state also lives in the parent. Tank cards call callbacks only — no local copies of data state inside the card.
**What changed:** `App.jsx` got four new handlers and two new state fields (`inviteModalOpen`, `inviteTargetTank`). A new `InviteModal.jsx` component was created. `TankGrid.jsx` was updated with the button row, pin sort logic, and archived filter with a "show archived" toggle link.
**Why it matters:** This is the props-down/events-up architecture working at scale. Four separate features, all controlled from parent state. I specified that the invite modal must render at the app level — not inside the card — which prevents the modal from being trapped inside a button's stacking context. The architectural rule (state in parent, callbacks down) was mine to specify and enforce.

---

## Entry 10 — Full Responsive Layout

**Session:** Continued session
**What I directed:** I wrote a detailed spec for responsive behavior across all three screens and both modals. Desktop: 3-column grid. Tablet: 2 columns. Mobile: 1 column, full width. I specified how each screen should adapt individually — bottom sheet panels for mobile nav in Screen 2, larger touch targets, smaller title font, modal height limits on mobile. I required CSS media queries only — no external libraries.
**What changed:** Grid layout properties were moved from TankGrid's inline styles to CSS classes (necessary because media queries cannot override inline styles). Media query blocks were added to `TankGrid.css`, `TankView.css`, `AddFishModal.css`, and a new `InviteModal.css`.
**Why it matters:** I defined the exact layout behavior at each breakpoint rather than letting AI decide what "responsive" means. The bottom sheet behavior for nav panels was a specific interaction decision — panels should feel native on mobile, not like floating cards scaled down. I directed that too.

---

## Entry 11 — Click-to-Stop Fish Interaction + Separated Hover State

**Session:** Continued session
**What I directed:** I specified a two-mode fish interaction system: hover (desktop only, existing bubble behavior preserved) and click/tap (stops the fish in place, locks the bubble, works on mobile). I specified the exact state architecture — local `hoveredFishId` inside TankView for hover only, parent `selectedFish` for the stopped state only. I specified that these are separate visual states that can coexist and that clicking the tank background should dismiss the stopped fish.
**What changed:** `TankView.jsx` gained local `hoveredFishId` state. The three hover handlers were decoupled from `onSelectFish`. A new `handleFishClick` and `handleTankClick` were added. Fish get `animationPlayState: 'paused'` and a `.fish-stopped` CSS class with glow when stopped.
**Why it matters:** The original code conflated hover and selected into one `selectedFish` value in parent state. That was AI's default — simplest thing that worked. I caught the architectural problem and directed the split: hover is local and visual, stopped is shared state. This distinction matters for mobile where there is no hover.

---

## Entry 12 — Tank Title Centered

**Session:** Continued session
**What I directed:** I asked for the tank title in the Screen 2 header to be truly centered relative to the full bar width, not just placed after the back button with a gap. I directed the `position: absolute; left: 50%; transform: translateX(-50%)` approach so the title anchors to the center of the bar regardless of button width.
**What changed:** `.tank-title` in `TankView.css` gained `position: absolute`, centering transform, and `pointer-events: none` so it doesn't block clicks on elements behind it.
**Why it matters:** Visual centering is a design detail. "Centered" in a flex row after a left-aligned button is not actually centered — it's offset. I specified the correct technique.

---

## Entry 14 — Supabase Auth & Full Data Integration

**Session:** New session after visual build was complete
**What I directed:** I asked Claude to connect Supabase to the project and walk through auth, live data, and all CRUD operations. I provided the project URL and anon key, specified the exact table schema (tanks, fish, tank_members with invite_code), wrote the RLS SQL myself in the Supabase editor, and approved each step before it was wired into the app.
**What changed:** `supabaseClient.js` was created. `LoginScreen.jsx` was rewritten with real `signInWithPassword` / `signUp` calls. `App.jsx` replaced all mock data with live Supabase queries — `loadTanks`, `addFish`, `addTank`, `joinTank` — and auth state was wired via `getSession` + `onAuthStateChange`.
**Why it matters:** The move from mock data to live Supabase was a deliberate architectural decision I directed step by step. I chose the schema, wrote the SQL, set the RLS policies. AI connected the wiring I designed — it didn't design the database.

---

## Entry 15 — RLS Debugging and Policy Repair

**Session:** Continued Supabase integration session
**What happened:** After connecting Supabase, `addTank` returned a 403 RLS error. I provided a screenshot of the console error. Claude traced the root cause to the wrong anon key format (`sb_publishable_` prefix doesn't attach the JWT to requests, so `auth.uid()` returns null). I provided the correct `eyJ...` JWT key and Claude applied it. A second round of debugging found that the `tanks` table had zero RLS policies — none had been created. A third issue: the `tank_members` SELECT policy was missing, and `fish` had no policies at all.
**What I directed:** I ran diagnostic SQL in the Supabase editor at Claude's direction, confirmed the policy gaps, and approved each `CREATE POLICY` block before it was run. I also ran a `join_tank_by_invite` RPC to solve the chicken-and-egg problem: a new user can't SELECT from `tanks` to find a tank by invite code because they're not yet a member — but they need to find the tank to become a member. The RPC runs with `SECURITY DEFINER` to bypass RLS for the lookup only.
**Why it matters:** Every RLS policy in this database was deliberately reviewed and approved by me. I caught the gaps by running diagnostic queries, not by guessing. The RPC solution was a real architectural decision about where to break the RLS boundary safely.

---

## Entry 16 — Red Notification Dot Architecture

**Session:** After Supabase integration was stable
**What I directed:** I specified a full notification system: a `last_visited` table tracking when each user last opened each tank, an upsert on every tank open, and `hasNotification` computed in the parent from Supabase data and passed down to each card as a prop. I explicitly ruled out the card fetching its own data or computing its own notification state.
**What changed:** `last_visited` table and RLS were created in Supabase. `loadTanks` gained a third parallel query for visited timestamps, then computed `hasNotification` per tank. `selectTank` became an async function that fire-and-forgets an upsert and immediately clears the dot in local state. `TankGrid` renders a 10px red circle absolutely positioned in the top-right corner of each card only when `tank.hasNotification` is true.
**Why it matters:** I specified the state rule explicitly: `hasNotification` is a derived value computed in the parent, not fetched by the card. This is the same props-down/events-up principle enforced throughout the app — the card renders what it receives, it doesn't own data logic.

---

## Entry 17 — Login Screen Redesign: Carousel + Frosted Glass

**Session:** After notification dot feature
**What I directed:** I gave a full redesign spec for the login screen: a full-viewport carousel of animated tank previews as a background layer, and the login form as a frosted glass card floating on top. I specified the exact structural layering — carousel as `position: absolute` background, form as `position: relative` centered by the flex root. I specified the frosted glass treatment (`backdrop-filter: blur(12px)`, dark translucent background, `border-radius: 24px`), the teal button color (`#1d9e75`), and the Join Tank row beneath the auth buttons so users can join a tank from the login screen.
**What changed:** `LoginScreen.jsx` was completely rewritten with a `Carousel` component rendering mock tank data via the existing `TankPreview` component (exported from `TankGrid.jsx`). `LoginScreen.css` was rebuilt from scratch. `App.jsx` passes `onJoinTank` to `LoginScreen`.
**Why it matters:** The original login screen was a plain dark card. The redesign communicates the product before login — you see fish tanks in motion before you even sign in. That's a deliberate product direction decision I specified completely.

---

## Entry 18 — Carousel: From Snap Navigation to Infinite Ambient Scroll

**Session:** Continued login redesign
**What I rejected:** The first carousel implementation used index-based snap navigation with auto-advance (setInterval), left/right arrow buttons, and per-card opacity/scale that dimmed non-centered cards. It was interactive and had clear affordances.
**What I directed:** I replaced the entire logic with a continuous infinite scroll — no arrows, no index state, no timers. The card array is rendered twice back-to-back, and a single CSS keyframe (`translateX(0)` to `translateX(-50%)`) loops infinitely at 40s linear. I also directed the final card size (260×380px), larger fish inside the previews (65×46px), and removal of the tank name labels below each card.
**Why it matters:** The carousel isn't a navigation element on the login screen — it's atmosphere. Interactive navigation implies the cards are meaningful destinations before login, which they aren't. An ambient drift reads as environmental backdrop, not UI chrome. The direction shifted from "feature" to "mood" — that's an art direction decision.

---

## Entry 19 — Session Persistence, Welcome Message, and First Name Signup

**Session:** New session
**What I directed:** I specified three connected features: persistent login using Supabase's localStorage session so users don't see the login screen on return visits, a welcome message on Screen 1 showing the user's first name, and a first name prompt added to the signup flow that stores `full_name` in Supabase `user_metadata`.
**What changed:** The `authLoading` null return was replaced with a full-screen loading state (teal "Tide Lines" on dark background) so the login screen never flashes. `App.jsx` derives `firstName` from `user_metadata.full_name` or falls back to the email prefix. `TankGrid` receives `userName` and shows "Welcome back, / [name]" in teal instead of "My Tanks". `LoginScreen` gained `showFirstName` state — clicking Sign up once reveals the first name field with a slide-in animation, clicking again completes registration with the name stored in Supabase.
**Why it matters:** These three features are connected by a single product principle: the app should feel like it knows you. The welcome message is the payoff of storing the name at signup. I specified the full chain — collection → storage → display — and the exact fallback logic for users who signed up before the name field existed.

---

## Entry 20 — Persistent Bottom Navigation Bar

**Session:** Continued session
**What I directed:** I gave a full spec for a persistent bottom nav bar styled after a reference image showing a pill-shaped floating bar where the active button expands into a labeled pill. I specified 4 tabs: Home (tank grid), Tanks (swipeable experience), Settings (Supabase account management), and Help (static content). I specified the exact bar style (frosted glass pill, `rgba(4,16,30,0.9)`, `backdrop-filter: blur(12px)`), inactive button appearance (icon only, 45% opacity), active button appearance (teal `#1d9e75` pill, icon + label, `0.3s ease` transition), and the state rule: `currentScreen` lives in the parent, the nav reads it as a prop and calls `onNavigate`.
**What changed:** `BottomNav.jsx` and `BottomNav.css` were created. `SettingsScreen.jsx` was created with display name (saves to `user_metadata` on blur), change email, password reset, and sign out. `HelpScreen.jsx` was created with 4 content sections. `App.jsx` gained `currentScreen` state and routing logic. The Tanks button renders a full-screen swipeable experience (not the nav bar), so `BottomNav` is hidden when `currentScreen === 'tanks'`.
**Why it matters:** The navigation architecture was mine to define. I specified which features belong in the nav, which don't (tank view has its own controls), and how state should flow. The active pill animation was a specific visual direction decision — it communicates focus without being noisy.

---

## Entry 21 — Tanks Nav: List View Rejected, Swipeable Experience Directed

**Session:** Continued session
**What AI built first:** The Tanks tab rendered a flat list view — tank name, fish count, notification dot, tap to open. Functional but passive: just a directory.
**What I directed:** I replaced the list entirely with a full-screen swipeable tank experience. Tapping Tanks takes you directly into a TankView — fish swimming, water effects, all controls — and you swipe left/right to move between tanks with a horizontal slide animation. Dot indicators at the top show your position. I specified the state architecture: `swipeTankIndex` in parent state, touch detection via `onTouchEnd` delta > 50px, keyboard arrow key support, and the exact CSS transition approach (both tanks visible simultaneously during the slide, `translateX` with `0.35s ease`).
**What changed:** `TankListView.jsx` was replaced by `SwipeTankView.jsx`. The component reuses the existing `TankView` component unchanged — no new fish rendering system. Touch events use native capture-phase listeners so child elements can't block them. `addFish` was updated to accept an explicit `tankId` parameter so fish can be added from swipe mode.
**Why it matters:** A list of tanks is a utility screen. A swipeable tank view is an experience. The product direction is that tanks are living spaces you move through, not items in a directory. I directed the interaction model — swipe to travel between tanks — not just the visual style.

---

## Entry 22 — Login Screen Title Hierarchy

**Session:** Continued session
**What I directed:** I asked to add a large "Tide Lines" title at the top of the login screen, above the carousel, and to add a "Sign up" label inside the login card.
**What changed:** A `.login-hero-title` element was added as an absolutely positioned heading at the top of the full viewport (`top: 36px`, `3.2rem`, teal with a soft text shadow). The card's internal title was changed to "Sign up" in a smaller weight, separate from the hero title. The two headings now serve different purposes — the hero establishes the brand at the top of the screen, the card title names the action.
**Why it matters:** Hierarchy is a visual direction decision. The hero title is branding — it belongs to the whole screen. The card title is a form label — it belongs to the interaction. Separating them clarifies what each element is communicating.

---

## Entry 13 — Fish Size Direction (200px)

**Session:** Continued session
**What AI defaulted to:** The fish were built at 70px width — a safe, conservative size that fits multiple fish comfortably on screen without overlap.
**What I directed:** I asked for the fish to be 1.5x bigger (105px), then decided that still wasn't right and directed 200px — a large, bold size that makes the fish the dominant visual presence in the tank.
**Why it matters:** Fish size is a visual direction decision, not a technical one. The default size was chosen by AI for safe layout. I overrode it twice to arrive at the size that matches the emotional weight the fish are supposed to carry — each fish is a message from someone you love, and they should feel substantial, not small.

---

## Entry 23 — Fish Entrance Animation and Entry Bubbles

**Session:** New session
**What I directed:** When a new fish is added via the modal, it should animate into the tank from a random screen edge — sliding in from off-screen left or right — with a cluster of rising bubbles appearing at the entry point. I gave the full spec: `isNew` and `enterFrom` fields on the fish object in parent state, a `useEffect` keyed on a derived `newFishIds` string to clear flags after 2500ms, CSS `@keyframes fish-enter-from-left/right` (sliding from ±110vw, fading in over the first 33%), and a separate `EntryBubbles` component that uses lazy `useState` initializer for stable randomised bubble data and `onAnimationEnd` for DOM self-cleanup.
**What changed:** `addFish` in `App.jsx` now uses `.select().single()` on insert to capture the new fish ID and randomly assigns `enterFrom: 'left' | 'right'`. `TankView.jsx` gained the `EntryBubbles` component and renders it alongside each entering fish in a `Fragment`. New keyframes and `.entry-bubble` styles were added to `TankView.css`.
**Why it matters:** The entrance animation makes the arrival of a new message feel like an event — the fish swims in from the edge of the world, which is exactly the metaphor Tide Lines is built on. The lazy initializer pattern I specified ensures bubble randomness is stable across re-renders. I specified the architecture for clearing the `isNew` flag via a derived string dependency rather than watching the full tanks array, to prevent infinite re-render loops.

---

## Entry 24 — Rising Bubbles on Fish Click

**Session:** Continued session
**What I directed:** When a fish is clicked, release a cluster of rising bubbles from the click point in addition to stopping the fish. I specified `getBoundingClientRect()` to convert viewport coordinates to tank-relative coordinates, `Date.now()` keys so multiple rapid clicks each produce independent bubble clouds, and a `ClickBubbles` component that calls `onDone` when all its bubbles finish animating so it removes itself cleanly.
**What changed:** `TankView.jsx` gained `clickBubbleSets` state, `tankRef`, and a position calculation in `handleFishClick`. The `ClickBubbles` component renders inside the tank container and self-removes.
**Why it matters:** The click interaction needed a physical response beyond just stopping. Bubbles rising from where you touch reads as tactile feedback — you disturbed the water. Each click set having its own key means you can tap multiple fish in quick succession and all their bubble clouds coexist independently without race conditions.

---

## Entry 25 — Font Switch to Adobe Typekit pt-serif

**Session:** Continued session
**What I directed:** Replace all instances of Patrick Hand (Google Fonts) with `pt-serif` loaded via Adobe Typekit. I provided the exact `<link>` tag for the Typekit kit.
**What changed:** `index.html` gained the Typekit stylesheet link. The Google Fonts import was removed from `index.css`. All `font-family` declarations across every component were updated to `'pt-serif', serif`.
**Why it matters:** Typography is a visual direction decision. Patrick Hand was a development placeholder. pt-serif is a deliberate choice — it gives the app a literary, considered quality that matches the emotional register of Tide Lines. Messages between people should feel like correspondence, not UI copy.

---

## Entry 26 — Full Light Color Scheme Across All Screens

**Session:** Continued session
**What I directed:** A complete color scheme overhaul across the entire app: `#F8F7FF` background, `#211E4A` dark navy text, `rgba(33,30,74,…)` for borders and tinted fills, `#1d9e75` teal accent. I specified this for the login screen, all panel popups (filter, water controls), `AddFishModal`, `InviteModal`, the tank header, the bottom nav, and the home screen grid. I gave exact values for each surface: card backgrounds, input fields, placeholder text opacity, border weights, button variants.
**What changed:** `LoginScreen.css`, `AddFishModal.css`, `TankView.css`, `TankGrid.css`, and `InviteModal.jsx` were all updated. The home screen gets its light background via `.grid-page` so it doesn't affect the dark tank view body.
**Why it matters:** The original color scheme was generic dark-mode UI. The light scheme I specified is warmer and more personal — it reads more like correspondence paper than a dashboard. The decision to scope the light background to `.grid-page` rather than `body` was a deliberate architectural choice so the tank view stays dark (it's underwater).

---

## Entry 27 — Scene-Based Dynamic Bar Colors with Night Mode

**Session:** Continued session
**What I directed:** The top header bar and bottom nav in the tank view should change color based on the active background scene, with a separate darker tone for night mode. I defined a `SCENE_THEME` object with `day` and `night` keys for each scene (`sea`, `jungle`, `deep`) using rgba values tuned to each environment. Both bars read from `sceneTheme[backgroundScene][tankMood]` so they are always a matched pair. The transition should be `0.4s ease` so scene changes feel smooth.
**What changed:** `TankView.jsx` gained the `SCENE_THEME` constant, `theme` and `barColor` derived values, and inline `style` props on both the header and bottom nav that override the CSS background with the current `barColor`. The CSS was updated to use `color: inherit` and white-based button backgrounds so icons work on any dark surface.
**Why it matters:** The bars are part of the tank environment — they should feel like they belong to the scene you're in, not like UI chrome floating above it. Having the top bar and bottom nav always match each other means the entire frame of the screen changes together, which reinforces the spatial metaphor of being inside a specific underwater environment.

---

## Entry 28 — Fish Click Glow: Drop-Shadow Instead of Box-Shadow Halo

**Session:** Continued session
**What I directed:** Remove the white rectangular halo that appeared when a fish was clicked (a `box-shadow` + `border-radius: 50%` combination) and replace it with a `drop-shadow` filter that traces the actual fish silhouette.
**What changed:** `.fish-stopped` in `TankView.css` was updated to use two layered `drop-shadow` filters — a tighter inner glow and a softer outer bloom — both in aquamarine teal, matching the hover glow.
**Why it matters:** `box-shadow` on an image element creates a rectangular glow around the bounding box, not around the fish shape. A white rectangle around an organically shaped fish looks like a UI selection artifact, not an in-world effect. `drop-shadow` follows the actual pixel boundaries of the artwork, so the glow feels like it's emanating from the fish itself.

---

## Entry 29 — Settings Screen Dashboard Redesign

**Session:** New session
**What I directed:** A complete redesign of the Settings screen into a two-panel dashboard layout: a 220px fixed sidebar with app logo, user avatar (initials), display name, email, and three nav links (Account, Security, Notifications), and a main content panel that fills the remaining width. I specified the active state (left border accent, teal fill), Sign Out in coral red at the bottom of the sidebar, and the content for all three panels — Account (two-column form grid for name/username/bio, read-only email), Security (change email inline form, password reset), and Notifications (a single toggle for the new-fish dot feature storing state in `user_metadata`). Mobile collapses the sidebar to a horizontal icon strip.
**What changed:** `SettingsScreen.jsx` was completely rewritten with three sub-panel components. `SettingsScreen.css` was rebuilt from scratch with the two-column layout, sidebar nav styles, toggle animation, and mobile responsive collapse.
**Why it matters:** The original settings screen was a single column of form fields with no navigation. For a product that's already layered and structured, the settings should feel like a considered space, not a catch-all form. The two-panel layout gives each concern its own room and makes the settings feel as intentional as the rest of the app.

---

## Entry 30 — Unified navBarStyle: Single Source of Truth for Both Nav Pills

**Session:** Continued session
**What I directed:** Both nav bars (home screen BottomNav and tank view bottom nav) were drifting apart in styling despite ostensibly using the same approach. I specified extracting a single `navBarStyle` JS object defining every shared property — `backdropFilter`, `border`, `borderRadius`, `padding`, `position`, `bottom`, `left`, `transform`, `gap`, `zIndex` — and applying it as a spread to both bars' inline style props. The tank view nav overrides only `background` with the scene color. Icon colors were specified explicitly: `rgba(255,255,255,0.55)` inactive, `#ffffff` active, identical in both bars. CSS container rules were stripped from both stylesheet files since the JS object is now the single source.
**What changed:** `navBarStyle` constant added to both `BottomNav.jsx` and `TankView.jsx`. Both `.bottom-nav` CSS rules stripped to button-only styles. `nav-btn-center` color corrected from `#1d9e75` to `rgba(255,255,255,0.55)`. Both bars now render from the same specification.
**Why it matters:** Two components with "the same" styles defined in two separate CSS files will always diverge. One z-index update, one padding tweak, one opacity change — and they're different again. A shared JS constant is the only structural guarantee of visual consistency. This is the same single-source-of-truth principle enforced throughout the app's data architecture, applied to design tokens.
