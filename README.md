# Tide Lines

A shared fish tank messaging app for international students and diaspora families. Each fish is a message from someone you love. Built with React + Vite, hosted on GitHub Pages.

**Live site:** https://akezi4h-dev.github.io/Fish-Tank/

---

## AI 201 — ESF Documentation

### AI Direction Log

**Project:** Tide Lines — AI 201 Project 2
**Format:** Each entry names the prompt given, what AI produced, what was changed, and why.

---

#### Entry 1 — Domain & Concept Direction

**Session:** Project kickoff
**What I asked:** I told Claude the domain was "my github repo" before clarifying. When I clarified, I said I was going to write a design intent document tonight.
**What AI did:** Claude correctly paused and waited. It did not generate a domain concept on its own or try to interpret "my GitHub repo" as a theme. It asked clarifying questions: was it a portfolio viewer of my repos, or something about this specific repo?
**What I did instead:** I came back with a fully personal design intent — *Tide Lines*, a shared fish tank where each fish is a message from someone you love, rooted in my experience as an international student. The fish metaphor came from me, the name "Tide Lines" came from me, the emotional framing ("connection feels ambient, not obligatory") came from me.
**Why it matters:** The assignment says to be the Art Director of a system. I didn't let AI generate the concept. The domain is personal and specific to my life — AI couldn't have invented it.

---

#### Entry 2 — Build Order Enforcement

**Session:** After design intent was submitted
**What I asked:** I gave Claude the full spec and said: *"Build it one component at a time, starting with the data model and parent state."*
**What AI produced:** Claude built only the parent App component with the full useState shape and mock data — no UI, no components, just state and handlers. It explicitly returned `null` from the render.
**What I did:** I approved this and said "yes" to proceed to Screen 1.
**Why it matters:** The assignment explicitly warns that AI will try to build all three panels at once and make architectural decisions you didn't approve. I enforced the build order: parent state → Screen 1 → Screen 2 → Screen 3. Each step required my explicit go-ahead. Claude did not deviate from this sequence.

---

#### Entry 3 — Fish Type Connection (Caught and Directed)

**Session:** After all three screens were built
**What AI produced:** Claude built `TankView.jsx` with its own internal `FishSVG({ color })` component that rendered a single hardcoded generic fish shape — an ellipse + triangle tail + eye. The `fish.type` field from state was passed into the fish object but was never read in the tank renderer. Every fish in Screen 2 looked identical regardless of type.
**What I asked Claude to show me:** *"Show me where in the code the fish type from state is being used to determine what renders in the tank. If it's not connected, fix it."*
**What I directed:** I caught the disconnection and directed Claude to extract all fish shapes into a shared `FishSVGs.jsx` file, export a single `FishSVG` component that takes both `type` and `color` as props, and use it in both TankView and AddFishModal. Both screens now import from the same source.
**Why it matters:** This is the exact failure mode the assignment warns about — AI builds something that looks connected but the data isn't actually flowing. `fish.type` was in state. It just wasn't being read. I caught it and directed the architectural fix.

---

#### Entry 4 — Custom Artwork Over AI-Generated SVGs

**Session:** After fish type fix
**What AI produced:** Claude had generated five hand-coded SVG fish (clownfish, angelfish, betta, goldfish, pufferfish) using basic geometric shapes — ellipses, polygons, lines. They were functional but generic. The AI designed them from scratch with no reference to my visual intent.
**What I did:** I had my own custom SVG artwork in the repo folder (`Untitled (4)/`): Angel Fish, Clownfish, Eel, Lion Fish, Otter, Puffer Fish, Seal, Shark, Turtle — 9 files. I directed Claude to replace the AI-generated SVGs entirely with my artwork.
**What changed:** The AI's geometric fish shapes were deleted. All 9 custom files were moved to `src/assets/fish/`, imported into `FishSVGs.jsx`, and the `FishSVG` component was rewritten to render `<img>` tags pointing to my files. The color slider still applies `hue-rotate` on top of the real artwork.
**Why it matters:** Visual direction is mine. AI generated placeholder shapes because it had nothing else to work with. When I had real assets, I replaced the placeholders. The final app reflects my artwork, not Claude's geometric approximations.

---

#### Entry 5 — Expanding Fish Types (9 vs 5)

**Session:** Same session as custom artwork
**What AI assumed:** The original spec and the AddFishModal were built for exactly 5 fish types — clownfish, angelfish, betta, goldfish, pufferfish — matching the spec I provided.
**What I directed:** When I brought in my custom SVG folder, I had 9 files, not 5. I explicitly asked: *"can i add all the images and the types to the modal selector."* I directed expanding FISH_TYPES from 5 to all 9: clownfish, angelfish, eel, lionfish, otter, pufferfish, seal, shark, turtle.
**What changed:** `FISH_TYPES` array in `FishSVGs.jsx` expanded. The modal selector now arrows through all 9. The tank can render all 9 types.
**Why it matters:** The final creative scope of the species in the tank is my decision. AI had no knowledge of the Otter, Seal, Shark, Turtle, or Eel until I surfaced the files. I defined what belongs in this tank.

---

#### Entry 6 — Replacing Caustic Rays with Sine Wave Water Effect

**Session:** After all three screens were complete and deployed
**What AI produced:** Claude implemented a water effect with three layers: caustic light rays (diagonal SVG rectangles spanning the tank), a surface shimmer band, and floating particles. The caustic layer rendered as large diagonal stripe shapes overlaid across the tank.
**What I rejected:** The diagonal stripes looked wrong — they obscured the tank background instead of enhancing it. I directed Claude to remove the caustic rays entirely.
**What I directed:** I gave Claude a full replacement spec: horizontal SVG sine wave paths only, no diagonal shapes, nothing that blocks the tank background. I specified the technique — cubic bezier sine paths, separate X drift and Y undulation on two different elements — and the visual parameters: 3 waves at different depths, thin strokes at very low opacity, subtle particles, minimal surface shimmer.
**Why it matters:** The water effect is an atmospheric layer. I defined what atmospheric means for this project: horizontal, subtle, background-visible. When AI produced something that contradicted that, I caught it visually, described exactly what was wrong, and gave a precise replacement directive. The final effect looks like water because I directed it to look like water.

---

#### Entry 7 — Connecting Wave Slider to WaterEffect Speed

**Session:** Continued session after water effect rewrite
**What AI produced:** The WaterEffect component used hardcoded animation durations. The Waves slider controlled fish swim speed but wave animation speed was static — sliding the control did nothing to the wave lines themselves.
**What I directed:** I asked for the wave slider to make the waves faster when moved to the right. I directed Claude to pass `waveIntensity` as a `speed` prop into `WaterEffect` and divide each wave's animation durations by that value.
**What changed:** `WaterEffect` now accepts `speed={waveIntensity}` from `TankView`. Both X and Y durations are divided by `speed` at render time. Moving the slider right increases speed across all three wave lines simultaneously.
**Why it matters:** The slider was already wired to fish speed. Extending it to wave speed makes the control feel complete — everything in the tank responds to the same input. I identified the gap and directed the fix.

---

#### Entry 8 — Enlarging Tank Cards on Screen 1

**Session:** Continued session
**What AI produced:** The TankGrid used a `maxWidth: 800px` container with small gaps. The tank cards were functional but small relative to the available screen space.
**What I directed:** I asked for the tanks to be bigger on the first screen. I directed Claude to widen the grid to `maxWidth: 1100px` and increase column gaps to 32px.
**Why it matters:** Layout scale is a visual direction decision. The cards are the primary UI element on Screen 1 — they should read as fish tanks, not thumbnails. Widening the grid gives the preview fish more room and makes the emotional content of each tank more legible at a glance.

---

### Records of Resistance

**Format:** Each entry names the AI output, why it was wrong or insufficient, what was done instead, and why that's better.

---

#### Resistance 1 — AI Duplicated Fish Shape Logic Across Two Components

**What AI gave me:**
When Claude built AddFishModal (Screen 3), it defined five fish SVG functions inside the modal file itself — `ClownfishSVG`, `AngelfishSVG`, `BettaSVG`, `GoldfishSVG`, `PufferfishSVG` — and used them only in the modal. Separately, TankView (Screen 2) had its own internal `FishSVG` component that was a completely different generic shape. The same concept — "render a fish" — existed in two places with two different implementations.

**Why I rejected it:**
This is exactly the duplication problem the assignment is built to teach against. The assignment's architectural rule is single source of truth. Having fish rendering logic in two places means if I change one, the other doesn't update. It also means the fish in the modal selector and the fish in the tank would never match — which is exactly what happened: users picked a clownfish in the modal and saw a generic blob in the tank.

**What I did instead:**
I directed Claude to extract all fish shapes into a single shared file, `src/components/FishSVGs.jsx`, and export one `FishSVG` component that both TankView and AddFishModal import. The fish type and color flow through props. One file. One component. Both screens use it.

**Why it's better:**
Now the fish you pick in the modal is exactly the fish that swims in the tank — because they are rendered by the same component reading from the same source. If I change a fish's look, it updates in both places automatically. The modal and the tank are now in sync by design, not by coincidence. This is what single source of truth actually means in practice.

---

#### Resistance 2 — AI Used Generic Placeholder Fish in Screen 1 Preview

**What AI gave me:**
The first version of `TankPreview` in `TankGrid.jsx` rendered an SVG tank with hardcoded generic fish shapes inside — a fixed ellipse body, polygon tail, and eye, drawn directly in the SVG using SVG coordinate transforms. These preview fish had no connection to `fish.type` or `fish.color` from state. They were decorative placeholders: every tank card showed the same orange fish regardless of what was actually in the tank.

**Why I rejected it:**
The design intent says the tank is a living preview of messages from real people. If Mom sent a clownfish and Leo sent a goldfish, the tank card on Screen 1 should show a clownfish and a goldfish — not two identical generic blobs. The preview needs to reflect actual state. Showing wrong fish breaks the user's mental model of what's inside the tank before they even open it.

**What I did instead:**
I directed Claude to replace the hardcoded SVG fish with real `FishSVG` components from `FishSVGs.jsx`, using `fish.type` and `fish.color` from `tank.fish.slice(-3)`. The preview now shows the 3 most recent actual fish at ~40% scale with idle swim animations. The Add New Tank card was explicitly kept empty — no fish, ever.

**Why it's better:**
The tank cards on Screen 1 are now truthful. You can glance at the grid and actually see whose fish are in which tank before you open it. The preview communicates real information from state instead of being decorative noise. It also means there is no redundant fish rendering code — the preview reuses the same `FishSVG` component as the full tank view, so any future artwork update is reflected everywhere at once.

---

#### Resistance 3 — AI's Generated SVG Artwork Was Not My Visual Direction

**What AI gave me:**
Before I provided my custom SVG files, Claude generated its own fish illustrations using basic SVG geometry: ellipses for bodies, polygons for tails, lines for stripes, circles for eyes. The clownfish was an orange ellipse with white stripe ellipses overlaid. The angelfish was a diamond shape. The betta was a purple ellipse with path fins. These were functional but they were AI-invented visual designs — not mine.

**Why I rejected it:**
My design intent specifies a visual mood: deep ocean, atmospheric, bioluminescent. The AI-generated fish were generic geometric approximations with no relationship to that mood or to any actual fish illustration style. More importantly, I had already created custom SVG artwork. AI did not know this artwork existed. The placeholder shapes had no place in the final product.

**What I did instead:**
I surfaced my custom artwork from `Untitled (4)/` — 9 SVG files I had designed. I directed Claude to copy them into `src/assets/fish/`, import them into `FishSVGs.jsx`, and replace the AI geometry with `<img>` tags pointing to my files. The `hue-rotate` filter was preserved so the color slider still works on top of my artwork. Every fish the user sees in this app — in the modal, in the tank, in the preview cards — is my illustration, not Claude's.

**Why it's better:**
The app now has a consistent visual identity that matches the Tide Lines design intent. The fish have character and style — they look like illustrations, not programmer art. The hue-rotate approach means the color picker still works on top of my artwork, so I kept the functional feature without sacrificing the visual direction. AI-generated geometry would have made the app feel generic; my illustrations make it feel personal.

---

#### Resistance 4 — AI Added Diagonal Caustic Stripe Shapes That Obscured the Tank

**What AI gave me:**
When I asked for a water/light effect in Screen 2, Claude implemented a three-layer `WaterEffect` component. One of the layers was "caustic light rays" — multiple SVG rectangles rotated at steep diagonal angles, spanning the full height of the tank, with a slow drift animation. These appeared as large diagonal stripe shapes overlaid across the entire tank background.

**Why I rejected it:**
The diagonal stripes looked wrong immediately. They didn't read as underwater light — they read as angled overlays obscuring the tank. The background scene (ocean gradient, coral, deep sea) was meant to be visible through all effects. Large opaque-looking diagonal shapes across the tank contradicted that. The effect was more distracting than atmospheric.

**What I did instead:**
I directed Claude to remove the caustic rays layer entirely and rebuild the water effect from scratch using horizontal SVG sine wave paths. Three sine waves at different depths, each with its own drift speed, vertical undulation, and amplitude. The waves are subtle strokes (`strokeWidth: 1.5`, opacity 6%) that read as water lines rather than light rays. The separation of horizontal drift (X animation) and vertical undulation (Y animation) was achieved by wrapping the SVG in a parent div with independent transforms.

**Why it's better:**
The sine wave lines look like actual water. They are horizontal — which matches how water behaves physically. They are thin strokes at very low opacity, so the tank background is fully visible through them. The two-axis animation (X drift + Y undulation on separate elements) creates genuinely organic-feeling movement without interfering with each other via CSS transform conflicts. The effect adds atmosphere without competing with the fish or the background.
