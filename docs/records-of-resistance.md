# Records of Resistance
**Project:** Tide Lines — AI 201 Project 2
**Student:** akezi4h-dev
**Format:** Each entry names the AI output, why it was wrong or insufficient, what was done instead, and why that's better.

---

## Resistance 1 — AI Duplicated Fish Shape Logic Across Two Components

**What AI gave me:**
When Claude built AddFishModal (Screen 3), it defined five fish SVG functions inside the modal file itself — `ClownfishSVG`, `AngelfishSVG`, `BettaSVG`, `GoldfishSVG`, `PufferfishSVG` — and used them only in the modal. Separately, TankView (Screen 2) had its own internal `FishSVG` component that was a completely different generic shape. The same concept — "render a fish" — existed in two places with two different implementations.

**Why I rejected it:**
This is exactly the duplication problem the assignment is built to teach against. The assignment's architectural rule is single source of truth. Having fish rendering logic in two places means if I change one, the other doesn't update. It also means the fish in the modal selector and the fish in the tank would never match — which is exactly what happened: users picked a clownfish in the modal and saw a generic blob in the tank.

**What I did instead:**
I directed Claude to extract all fish shapes into a single shared file, `src/components/FishSVGs.jsx`, and export one `FishSVG` component that both TankView and AddFishModal import. The fish type and color flow through props. One file. One component. Both screens use it.

**Why it's better:**
Now the fish you pick in the modal is exactly the fish that swims in the tank — because they are rendered by the same component reading from the same source. If I change a fish's look, it updates in both places automatically. The modal and the tank are now in sync by design, not by coincidence. This is what single source of truth actually means in practice.

---

## Resistance 2 — AI Used Generic Placeholder Fish in Screen 1 Preview

**What AI gave me:**
The first version of `TankPreview` in `TankGrid.jsx` rendered an SVG tank with hardcoded generic fish shapes inside — a fixed ellipse body, polygon tail, and eye, drawn directly in the SVG using SVG coordinate transforms. These preview fish had no connection to `fish.type` or `fish.color` from state. They were decorative placeholders: every tank card showed the same orange fish regardless of what was actually in the tank.

**Why I rejected it:**
The design intent says the tank is a living preview of messages from real people. If Mom sent a clownfish and Leo sent a goldfish, the tank card on Screen 1 should show a clownfish and a goldfish — not two identical generic blobs. The preview needs to reflect actual state. Showing wrong fish breaks the user's mental model of what's inside the tank before they even open it.

**What I did instead:**
I directed Claude to replace the hardcoded SVG fish with real `FishSVG` components from `FishSVGs.jsx`, using `fish.type` and `fish.color` from `tank.fish.slice(-3)`. The preview now shows the 3 most recent actual fish at ~40% scale with idle swim animations. The Add New Tank card was explicitly kept empty — no fish, ever.

**Why it's better:**
The tank cards on Screen 1 are now truthful. You can glance at the grid and actually see whose fish are in which tank before you open it. The preview communicates real information from state instead of being decorative noise. It also means there is no redundant fish rendering code — the preview reuses the same `FishSVG` component as the full tank view, so any future artwork update is reflected everywhere at once.

---

## Resistance 3 — AI's Generated SVG Artwork Was Not My Visual Direction

**What AI gave me:**
Before I provided my custom SVG files, Claude generated its own fish illustrations using basic SVG geometry: ellipses for bodies, polygons for tails, lines for stripes, circles for eyes. The clownfish was an orange ellipse with white stripe ellipses overlaid. The angelfish was a diamond shape. The betta was a purple ellipse with path fins. These were functional but they were AI-invented visual designs — not mine.

**Why I rejected it:**
My design intent specifies a visual mood: deep ocean, atmospheric, bioluminescent. The AI-generated fish were generic geometric approximations with no relationship to that mood or to any actual fish illustration style. More importantly, I had already created custom SVG artwork. AI did not know this artwork existed. The placeholder shapes had no place in the final product.

**What I did instead:**
I surfaced my custom artwork from `Untitled (4)/` — 9 SVG files I had designed. I directed Claude to copy them into `src/assets/fish/`, import them into `FishSVGs.jsx`, and replace the AI geometry with `<img>` tags pointing to my files. The `hue-rotate` filter was preserved so the color slider still works on top of my artwork. Every fish the user sees in this app — in the modal, in the tank, in the preview cards — is my illustration, not Claude's.

**Why it's better:**
The app now has a consistent visual identity that matches the Tide Lines design intent. The fish have character and style — they look like illustrations, not programmer art. The hue-rotate approach means the color picker still works on top of my artwork, so I kept the functional feature without sacrificing the visual direction. AI-generated geometry would have made the app feel generic; my illustrations make it feel personal.

---

## Resistance 4 — AI Added Diagonal Caustic Stripe Shapes That Obscured the Tank

**What AI gave me:**
When I asked for a water/light effect in Screen 2, Claude implemented a three-layer `WaterEffect` component. One of the layers was "caustic light rays" — multiple SVG rectangles rotated at steep diagonal angles, spanning the full height of the tank, with a slow drift animation. These appeared as large diagonal stripe shapes overlaid across the entire tank background.

**Why I rejected it:**
The diagonal stripes looked wrong immediately. They didn't read as underwater light — they read as angled overlays obscuring the tank. The background scene (ocean gradient, coral, deep sea) was meant to be visible through all effects. Large opaque-looking diagonal shapes across the tank contradicted that. The effect was more distracting than atmospheric.

**What I did instead:**
I directed Claude to remove the caustic rays layer entirely and rebuild the water effect from scratch using horizontal SVG sine wave paths. Three sine waves at different depths, each with its own drift speed, vertical undulation, and amplitude. The waves are subtle strokes (`strokeWidth: 1.5`, opacity 6%) that read as water lines rather than light rays. The separation of horizontal drift (X animation) and vertical undulation (Y animation) was achieved by wrapping the SVG in a parent div with independent transforms.

**Why it's better:**
The sine wave lines look like actual water. They are horizontal — which matches how water behaves physically. They are thin strokes at very low opacity, so the tank background is fully visible through them. The two-axis animation (X drift + Y undulation on separate elements) creates genuinely organic-feeling movement without interfering with each other via CSS transform conflicts. The effect adds atmosphere without competing with the fish or the background.

---

## Resistance 5 — AI Conflated Hover and Selected Fish into One Parent State Value

**What AI gave me:**
The original fish interaction in TankView used a single `selectedFish` value in parent state for everything — when you hovered a fish, it called `onSelectFish(fishId)` to set parent state, and when you left, it called `onSelectFish(null)` to clear it. Hover and click both wrote to the same parent state field. There was no distinction between "cursor is over this fish" and "this fish is stopped."

**Why I rejected it:**
This conflation broke the design I wanted. If hover and stopped share the same state, then: moving your cursor away from a stopped fish would clear it (the `onMouseLeave` called `onSelectFish(null)`), making it impossible to keep a fish stopped. On mobile there is no hover at all, so the entire interaction model would be wrong. And parent state should not be updated on every cursor movement — hover is purely visual and local.

**What I did instead:**
I directed Claude to split the state: local `hoveredFishId` inside TankView (using `useState`) for hover only, and parent `selectedFish` for the stopped/clicked state only. Mouse enter/leave only touch local state. Click/tap only touches parent state. The bubble displays whichever is active, with stopped taking priority. The `handleTankClick` handler clears the stopped fish when the background is tapped.

**Why it's better:**
The interaction now works correctly on both desktop and mobile. Hover is fast and local — it doesn't trigger parent re-renders on every mouse enter/leave. Stopped fish stay stopped even when the cursor moves away, because the stopped state is independent of cursor position. On mobile, tap sets the stopped state directly with no hover involved. The two states can coexist — you can have a fish stopped and a different fish hovered simultaneously. The architecture matches the actual semantics of the feature.

---

## Resistance 7 — AI Used Snap Carousel With Arrows Instead of Ambient Drift

**What AI gave me:**
The first carousel implementation was a conventional snap carousel: index state, a `setInterval` auto-advance every 4 seconds, left and right arrow buttons, per-card opacity and scale transitions dimming off-center cards, and a `translateX` offset recalculated on every index change. It looked like a standard Netflix-style content slider with interactive navigation.

**Why I rejected it:**
Arrow buttons make the carousel feel like a UI feature — something the user is supposed to interact with. On the login screen, the tank previews are not destinations. They're atmosphere. An interactive slider implies "pick one of these," which is the wrong message before the user has even signed in. The dimming of non-centered cards created a focal point that drew attention to itself instead of receding into the background.

**What I did instead:**
I directed Claude to delete the entire snap logic — no index state, no setInterval, no arrows, no per-card scaling — and replace it with a pure CSS infinite scroll. Cards rendered twice back-to-back, one `@keyframes` rule translating from `0` to `-50%` over 40 seconds, `linear` timing, infinite. No JavaScript involved in the animation at all. I also directed the removal of tank name labels below each card and increased the card size to 260×380px.

**Why it's better:**
The carousel now reads as background texture, not interactive UI. It drifts slowly and continuously, like something you notice rather than something you use. The 40s linear loop is slow enough to feel ambient and fast enough that the cards actually move visibly. Removing the arrows removed the affordance that said "this is for navigating" — the carousel is now purely decorative, which is the correct role for it on the login screen.

---

## Resistance 8 — AI Anchored Login Form to Bottom Instead of Centering It

**What AI gave me:**
The first implementation of the redesigned login screen placed the login card using `position: absolute; bottom: 0; left: 50%; transform: translateX(-50%)` — anchored to the bottom edge of the screen with rounded top corners only (`border-radius: 24px 24px 0 0`). The card slid up from the bottom like a mobile bottom sheet, sitting beneath the carousel rather than on top of it.

**Why I rejected it:**
The bottom-anchored position made the card feel like a mobile-only pattern — a bottom sheet — even on desktop. It also caused layout issues: the carousel's vertical centering had to be offset by the card's height to avoid overlap, creating a `padding-bottom: 240px` hack on the track. The overall screen felt unbalanced with everything pushed down.

**What I did instead:**
I directed Claude to restructure the layout so the root container is a flex centering context (`display: flex; align-items: center; justify-content: center`), the carousel is a full-bleed absolute background layer (`position: absolute; inset: 0`), and the login card uses `position: relative; z-index: 10` with no explicit positioning — the flex parent centers it automatically both horizontally and vertically. `border-radius: 24px` on all four corners.

**Why it's better:**
The card is now truly centered in the viewport on every screen size. The layout no longer requires offset hacks to prevent the carousel from being obscured by the form. The frosted glass card floating in the center of a drifting fish tank background reads as a deliberate composition — the card and the background are in visual dialogue rather than stacked vertically. The centering is structural, not patched with transforms.

---

## Resistance 6 — AI Used Conservative Fish Size That Undersold the Emotional Weight

**What AI gave me:**
The fish were sized at 70px wide throughout the app — a default that ensured multiple fish could fit in view without overlap and that nothing felt crowded. It was technically safe and layout-stable.

**Why I rejected it:**
70px fish are small. In the context of Tide Lines — where each fish is a message from someone you love, possibly someone far away — small fish read as decorative background elements, not as meaningful objects. The app is built around the emotional presence of these fish. They need to feel like the main thing in the tank, not like ambient decoration.

**What I did instead:**
I directed Claude to increase the size first to 105px (1.5x), then decided that was still not bold enough and directed 200px. At 200px each fish is a significant visual presence that fills the tank meaningfully and commands attention the way a real fish in a tank does.

**Why it's better:**
The fish are the entire point of the app. At 200px they read as the primary content rather than as UI decoration. The larger size also makes the custom SVG artwork — which I drew — actually visible in detail. Small fish compress the artwork into thumbnails where the illustration quality is lost. Large fish let the artwork be seen. This was a visual direction decision, not a layout optimization.

---

## Resistance 9 — AI Built a Tank List View Instead of a Swipeable Tank Experience

**What AI gave me:**
The Tanks tab in the bottom nav rendered a flat list — one row per tank showing the name, fish count, and notification dot. Tapping a row opened that tank in the full TankView. It was a functional directory: you find the tank you want, you tap it, you go in.

**Why I rejected it:**
A list view is a utility pattern. It treats tanks like items in a file browser. Tide Lines is not a file browser — it's about emotional presence and connection. The design intent says the tanks are living spaces. A list of names doesn't communicate that at all. It also adds a navigation step: you have to choose a tank before you see anything alive.

**What I did instead:**
I directed Claude to replace the list entirely with a full-screen swipeable tank experience. Tapping Tanks drops you directly into a TankView with fish swimming and water moving — you're already inside a tank. You swipe left and right to travel between your tanks. The dot indicators at the top show where you are without requiring you to step back to a menu. The interaction model is spatial — you move through tanks rather than selecting from a list.

**Why it's better:**
The swipe experience communicates the product's core idea on contact: tanks are places you inhabit, not items you manage. The transition animation makes the spatial metaphor tangible — you literally slide from one tank to the next. There's no directory, no selection step, no list to read. You arrive in a tank immediately and travel between them by feel. That's a fundamentally different product experience than a list view, and it matches what Tide Lines is supposed to be.

---

## Resistance 10 — AI Used React Synthetic Events for Swipe Detection, Causing Silently Broken Gestures

**What AI gave me:**
The first SwipeTankView implementation used React's `onTouchStart` and `onTouchEnd` props on the root container div to detect swipe gestures. This worked correctly in isolation but failed in practice because TankView renders complex interactive children — fish with click handlers, a nav bar with buttons, an animated water layer. These child elements consumed touch events before they bubbled up to the swipe container, silently dropping gestures.

**Why I rejected it:**
The swipe wasn't working. Touch events were being captured by child elements inside TankView and never reaching the swipe handler. The failure was invisible — no errors, no feedback, just nothing happening when the user swiped. This is a fundamental problem with relying on event bubbling when children are interactive.

**What I did instead:**
I directed Claude to replace the React synthetic event props with native `addEventListener` calls using `{ capture: true }` on the root element via a `useRef`. Capture-phase listeners fire before any descendant's handlers, regardless of what children do with the event. This guarantees the swipe detection always runs first. I also directed a double `requestAnimationFrame` for the transition animation to ensure the browser has painted the initial positions before the CSS transition starts.

**Why it's better:**
Capture-phase listeners are the correct tool when you need to intercept input before interactive children can handle it. The fix is architecturally sound — it doesn't disable or wrap the child interactions, it just ensures the swipe gesture is detected at the earliest possible point in the event lifecycle. The swipe now works reliably regardless of what the user touches inside the tank.
