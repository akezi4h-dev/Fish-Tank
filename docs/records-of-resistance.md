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

---

## Resistance 11 — AI Added a Second Nav Bar to Tank View Instead of Making Them Match

**What AI gave me:**
When I asked for the two nav bars (home screen and tank view) to look visually consistent, Claude added the home screen `BottomNav` component — the one with Home, Tanks, Settings, Help — as a second floating pill on top of the tank view. The result was two nav bars simultaneously visible: the home navigation pill floating over the tank's own filter/waves/+/scene controls.

**Why I rejected it:**
This missed the entire point of the request. I wanted the one nav that already exists on the tank view to look like the one on the home screen — same shape, same style, same treatment. Adding a second, completely different nav on top of the existing one creates a confusing UI where the user has two overlapping control bars with different purposes and no clear hierarchy. It also broke the tank experience visually, with a "Home" label appearing inside a tank for no reason.

**What I did instead:**
I directed Claude to revert the added component and instead restyle the tank's existing bottom nav to match the home nav's exact appearance: same pill shape, same `rgba(4,16,30,…)` background base (overridden by scene color), same border, same `border-radius: 999px`, same button sizing and icon colors. One nav per screen. The tank's nav keeps its own controls, just styled identically to the home nav.

**Why it's better:**
Each screen has exactly one nav bar. The tank's filter/waves/+/scene controls are the right controls for that screen — they don't need to be replaced or duplicated. The consistency the request was asking for is visual, not structural. Styling the existing nav to match achieves consistency without adding UI complexity.

---

## Resistance 12 — AI's Fish Click Indicator Was a White Box, Not a Glow

**What AI gave me:**
When I directed a selected-fish indicator for the click-to-stop interaction, Claude implemented `.fish-stopped` using `box-shadow: 0 0 12px rgba(255,255,255,0.4)` combined with `border-radius: 50%` on the fish container. The result was a white oval halo around the fish's bounding box — a rectangular glow with rounded corners, not a glow that followed the fish's actual shape.

**Why I rejected it:**
`box-shadow` on a `div` wrapping an `<img>` glows around the rectangular bounds of the container element, not around the visual shape of the fish. The `border-radius: 50%` made the rectangle into an oval, which was closer but still wrong — the fish is not an oval. The white glow also read as a UI selection artifact (like a button being pressed) rather than as an in-world effect. It looked like a UI component, not a living thing responding to touch.

**What I did instead:**
I directed Claude to remove the `box-shadow` and `border-radius` entirely and replace with two layered CSS `drop-shadow` filters: a tight inner glow and a soft outer bloom, both in aquamarine teal (`rgba(127,255,212,…)`). `drop-shadow` in CSS applies to the rendered pixel content — it traces the actual outline of the fish artwork, including transparency, and glows around that shape.

**Why it's better:**
The glow now follows the fish's actual silhouette. It reads as the fish emitting light — a bioluminescent response to being touched — rather than as a UI selection rectangle. The teal color matches the hover glow, so the visual language is consistent: touched fish glow, hovered fish glow, both in the same color. The effect is in-world rather than chrome.

---

## Resistance 13 — AI Kept Two CSS Files in Sync Instead of Extracting a Shared Constant

**What AI gave me:**
After multiple rounds of nav bar styling work, the home screen `BottomNav.css` and `TankView.css` had nearly identical `.bottom-nav` rules — but defined separately in each file. Claude's approach was to update both files whenever a change was needed, keeping them "in sync" by editing two places simultaneously.

**Why I rejected it:**
Two separate CSS rules that are supposed to be identical will always diverge. One edit in one file, one forgotten update, one new property added to one but not the other — and they're different again. The entire history of the nav bar inconsistency came from this pattern. "Keeping them in sync" is not a solution; it's the problem stated differently.

**What I did instead:**
I directed Claude to extract a single `navBarStyle` JavaScript object containing every shared property, defined once and spread into both components' inline style props. Each component applies only its specific override — the home nav sets a fixed dark background, the tank nav sets the scene-matched `barColor`. Both read from the same constant for everything else. The CSS files were stripped of all container rules, leaving only button styles.

**Why it's better:**
A shared constant cannot drift. If you need to change the `border-radius`, you change it in one place and both bars update. If you need to add a `boxShadow`, you add it once. The visual contract between the two bars is now enforced structurally, not by discipline. This is the same single-source-of-truth principle the whole app is built on — applied to CSS values instead of data.

---

## Resistance 14 — AI Built Discover as a List View Instead of a Card Grid

**What AI gave me:**
The first Discover screen was a vertical list — one row per tank, each row showing a wave emoji, the tank name, member count, and a green "Join" button. It was a functional index of public tanks but it looked nothing like the rest of the app. The tank cards on the home screen are animated preview windows into living tanks. The Discover screen showed the same tanks as text rows in a white list.

**Why I rejected it:**
The visual language of Tide Lines is established on the home page: tanks are dark ocean cards with fish swimming inside them. The moment a user lands on Discover, they should recognise the same card format because they already know how it works. A list view breaks that recognition entirely. It also removes the emotional content — you can't see any fish, any life, any atmosphere. A row that says "Midnight Reef — 3 members — Join" communicates nothing about what's inside. A card with two animated fish does.

**What I did instead:**
I directed Claude to completely rewrite the Discover screen using the exact same `TankPreview` component and card structure as the home page. Same `grid-layout` CSS class, same card dimensions and border, same font for the tank name below. Each placeholder tank was given 1–2 fish with real messages so the preview cards show animated fish immediately. Clicking a card opens the full `TankView` just like home. The Join button was removed entirely — entry is just clicking the card, exactly as on the home page.

**Why it's better:**
Discover now speaks the same visual language as Home. A user who knows how to use the home grid already knows how to use the Discover grid because they are literally the same component. The animated fish in each card communicate what's inside before you open it — the same way home cards do. Consistency here is not cosmetic; it's how the product teaches itself.

---

## Resistance 15 — AI's Card Grid Had Extra Elements That Broke Visual Parity with Home

**What AI gave me:**
After I directed the card grid redesign, the first implementation added two elements the home page doesn't have: a `🌊 Public` badge in the top-right corner of each card, and a member count line below the tank name. It also used `gap: '6px'` in the card wrapper instead of the home page's `gap: '8px'`, and used a separate `discover-page` CSS class instead of the shared `grid-page` class.

**Why I rejected it:**
I specified pixel-perfect identical — zero visual differences between Discover cards and Home cards. The badge and member count are additions, not equivalences. Even small additions break the visual parity: a user glancing between the two screens would see that Discover cards have extra elements, which implies they are a different type of thing. The wrong gap value meant card contents were positioned differently at a subpixel level. The separate CSS class meant the background, padding, and alignment could drift independently.

**What I did instead:**
I directed Claude to remove the badge and member count entirely, copy the style constants verbatim from `TankGrid`'s `styles` object (same gap, same padding, same border radius, same font), use the shared `grid-page` and `grid-layout` CSS classes with no discover-specific overrides, and strip `DiscoverScreen.css` down to a single comment. The card render became exactly: `TankPreview` + tank name. Nothing else.

**Why it's better:**
The cards are now structurally identical because they use identical code — not code that approximates the same values, but the same values copied from the same source. "Pixel-perfect" is only achievable when the two things share their definition, not when two separate definitions happen to match. This is the same single-source-of-truth principle that governs the data architecture applied to the visual layer.

---

## Resistance 16 — Tank Delete Silently Failed Due to Missing RLS Policy and Cascades

**What AI gave me:**
The initial `deleteTank` implementation called `supabase.from('tanks').delete().eq('id', tankId)` and checked for an error response. In testing, the delete appeared to trigger (the confirmation toast showed) but the tank reappeared on page refresh. Then on a second attempt the delete returned an error and showed the failure toast — but still no deletion.

**Why I rejected it:**
Two separate problems were blocking the delete at the database level. First, no RLS DELETE policy existed on the `tanks` table — Supabase silently blocked the operation and returned no error in some cases, making it look like success when nothing was deleted. Second, even after adding the DELETE policy, the foreign key relationships on `fish`, `tank_members`, and `last_visited` all referenced `tank_id` without `ON DELETE CASCADE`, so Postgres rejected the deletion with a constraint violation. The `last_visited` table was the final blocker that wasn't caught in the first round of SQL fixes.

**What I did instead:**
I ran three rounds of SQL in Supabase: (1) `CREATE POLICY "Owners can delete their tanks" ON public.tanks FOR DELETE USING (auth.uid() = owner_id)`, (2) `ALTER TABLE public.fish` and `ALTER TABLE public.tank_members` to add `ON DELETE CASCADE`, (3) `ALTER TABLE public.last_visited` to add `ON DELETE CASCADE` after the first two rounds still failed.

**Why it's better:**
The cascade approach means deletion is handled entirely at the database level — deleting a tank atomically removes all its fish, members, and visit records in one query. The RLS policy ensures only the tank owner can delete. Together these make the delete both safe and complete.

---

## Resistance 17 — Swipe View Arrows Were Wired to No-Op Defaults

**What AI gave me:**
When the tank navigation arrows were built for the home page tank-to-tank slide, TankView received `onPrevTank`, `onNextTank`, `tankIndex`, and `tankCount` props defaulting to `() => {}` and `0`/`1`. The arrows rendered correctly and worked on the home page. But when a tank was opened from the Tanks (swipe) tab via SwipeTankView, the same TankView was rendered without those props — so the arrows displayed but did nothing when clicked.

**Why I rejected it:**
The arrows were visible and looked functional but were silently broken in the swipe context. A user tapping ← in a swipe-tab tank would see the button respond visually but no navigation would occur. This is a hidden failure — no error, no feedback, just a button that lies about what it does.

**What I did instead:**
I directed wiring the four props into SwipeTankView's TankView render: `tankIndex={swipeTankIndex}`, `tankCount={tanks.length}`, `onPrevTank` and `onNextTank` calling `goRef.current` with boundary checks. The boundary checks ensure the arrows dim and stop at the first and last tank rather than wrapping around as the swipe gesture does.

**Why it's better:**
The arrows now behave identically in both navigation contexts — home page slide and swipe tab. The fix was four lines of props. The infrastructure was already correct; the gap was that SwipeTankView never passed the handlers it needed to.
