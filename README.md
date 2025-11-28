# Carnilove Animation POC

by Alex Perez [aperez.dev](https://aperez.dev)

## Technology & Documentation

This project uses the following core technologies and libraries. Open the links for official documentation and API references.

- [Astro](https://docs.astro.build/) — framework used for building the site.
- [GSAP (GreenSock)](https://greensock.com/) / [GSAP docs](https://gsap.dev/) — animation engine used throughout the project.
  - [ScrollTrigger plugin](https://greensock.com/scrolltrigger/) — scroll-driven timelines and triggers.
  - [ScrollToPlugin](https://greensock.com/scrollToPlugin/) — smooth programmatic scrolling.
  - [SplitText (Club GreenSock)](https://greensock.com/SplitText/) — text-splitting helper used for headline animations.
  - [Observer plugin](https://greensock.com/observer/) — pointer/wheel/touch observer used for custom scroll handlers.

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Project Layout (important files)

- `src/pages/index.astro` — page composition, includes the `ParallaxSection` instances.
- `src/components/ParallaxSection.astro` — component wrapper for each full-screen section (see details below).
- `src/components/*` — UI and section components (Hero, Feed, Ingredients, etc.).
- `src/scripts/` — animation modules and runtime controllers.
- `src/utils.ts` — animation helpers (SplitText helpers, fonts readiness helpers).

**ParallaxSection — how it works**

- Location: `src/components/ParallaxSection.astro`.
- Purpose: a consistent full-screen section wrapper that provides:

  - `id` and `data-section-id` (section identifier used by scripts)
  - `data-bg-position` — JSON used by the background manager to animate background layers per section
  - an inner `.section-content` element which contains the visible content

- Tall sections:
  - Add `parallax-section--tall` or let the controller detect tall content. In this case `.section-content` becomes the scrollable area (height 100vh + `overflow-y: auto`).
  - Important: content that should make the section scrollable must contribute to natural flow height (avoid _only_ absolutely positioned children).

Example (simplified):

```astro
<ParallaxSection id="shop-by-product" data-bg-position='[{"y":30,"opacity":0.6},...]'>
  <div class="section-content">
    <!-- actual content here -->
  </div>
</ParallaxSection>
```

**Key scripts and their responsibilities**

- `src/scripts/scroll-controller.ts`

  - Core scroll/navigation controller.
  - Collects `.parallax-section` elements and builds `SectionConfig` entries.
  - Handles wheel/touch input via `gsap.Observer` and delegates to `goToNextSection()` / `goToPreviousSection()`.
  - Tall-section handling: when a section is tall the controller lets the inner `.section-content` scroll natively; navigation only happens when the inner scroll reaches its end.
  - Entry/exit animations are played via `getEntryAnimation()` / `getExitAnimation()` (see below) before transitions.

- `src/scripts/background-manager.ts`

  - Controls layered background (savannah/rocks/forest) transitions.
  - `updateBackground(sectionId, positionArray)` animates `y`, `scale`, and `opacity` of layers.

- `src/scripts/sections-animation.ts`

  - Acts as a router for section animations: it maps `element.id` to entry/exit animation factories in `src/scripts/animations/*`.
  - Each animation module returns a GSAP timeline for entry and exit.

- `src/scripts/animations/*` (per-section files)
  - Edit these or add a file here to customize how page sections animate in and out.

**Utilities**

**How animation choreography works**

- When a navigation is triggered:

1.  Controller checks if the current section is tall and can still scroll; if so, let the browser scroll `.section-content` normally.
2.  If inner scroll is exhausted, controller calls `playExitAnimation()` for the current section (if exposed) or plays the exit timeline from `sections-animation.ts`.
3.  Controller transitions sections with a GSAP timeline (move `top` values of section elements), updates background using `background-manager`, then calls `playEntryAnimation()` for the incoming section.

**Developer workflow: add/edit a section**

1. Add a new `ParallaxSection` entry in `src/pages/index.astro` with `id`, `data-bg-position` and content inside `.section-content`.
2. Create entry/exit animation functions in `src/scripts/animations/<your-section>.ts` (export `YourEntryAnimation(element)` and `YourExitAnimation(element)`).

## Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Project Layout (important files)

- `src/pages/index.astro` — page composition, includes the `ParallaxSection` instances.
- `src/components/ParallaxSection.astro` — component wrapper for each full-screen section (see details below).
- `src/components/*` — UI and section components (Hero, Feed, Ingredients, etc.).
- `src/scripts/` — animation modules and runtime controllers.
- `src/utils.ts` — animation helpers (SplitText helpers, fonts readiness helpers).

**ParallaxSection — how it works**

- Location: `src/components/ParallaxSection.astro`.
- Purpose: a consistent full-screen section wrapper that provides:

  - `id` and `data-section-id` (section identifier used by scripts)
  - `data-bg-position` — JSON used by the background manager to animate background layers per section
  - an inner `.section-content` element which contains the visible content

- Tall sections:
  - Add `parallax-section--tall` or let the controller detect tall content. In this case `.section-content` becomes the scrollable area (height 100vh + `overflow-y: auto`).
  - Important: content that should make the section scrollable must contribute to natural flow height (avoid _only_ absolutely positioned children).

Example (simplified):

```astro
<ParallaxSection id="shop-by-product" data-bg-position='[{"y":30,"opacity":0.6},...]'>
  <div class="section-content">
    <!-- actual content here -->
  </div>
</ParallaxSection>
```

**Key scripts and their responsibilities**

- `src/scripts/scroll-controller.ts`

  - Core scroll/navigation controller.
  - Collects `.parallax-section` elements and builds `SectionConfig` entries.
  - Handles wheel/touch input via `gsap.Observer` and delegates to `goToNextSection()` / `goToPreviousSection()`.
  - Tall-section handling: when a section is tall the controller lets the inner `.section-content` scroll natively; navigation only happens when the inner scroll reaches its end.
  - Entry/exit animations are played via `getEntryAnimation()` / `getExitAnimation()` (see below) before transitions.

- `src/scripts/background-manager.ts`

  - Controls layered background (savannah/rocks/forest) transitions.
  - `updateBackground(sectionId, positionArray)` animates `y`, `scale`, and `opacity` of layers.

- `src/scripts/sections-animation.ts`

  - Acts as a router for section animations: it maps `element.id` to entry/exit animation factories in `src/scripts/animations/*`.
  - Each animation module returns a GSAP timeline for entry and exit.

- `src/scripts/animations/*` (per-section files)
  - Edit these or add a file here to customize how page sections animate in and out.

**Utilities**

**How animation choreography works**

- When a navigation is triggered:
  1. Controller checks if the current section is tall and can still scroll; if so, let the browser scroll `.section-content` normally.
  2. If inner scroll is exhausted, controller calls `playExitAnimation()` for the current section (if exposed) or plays the exit timeline from `sections-animation.ts`.
  3. Controller transitions sections with a GSAP timeline (move `top` values of section elements), updates background using `background-manager`, then calls `playEntryAnimation()` for the incoming section.

**Developer workflow: add/edit a section**

1. Add a new `ParallaxSection` entry in `src/pages/index.astro` with `id`, `data-bg-position` and content inside `.section-content`.
2. Create entry/exit animation functions in `src/scripts/animations/<your-section>.ts` (export `YourEntryAnimation(element)` and `YourExitAnimation(element)`).
3. Add mapping in `src/scripts/sections-animation.ts` so the new id returns your new animation timelines.
4. If the section needs child-level entry/leave hooks, add `playEntry`/`playLeave` methods on the section's root DOM element in the component's client script (return GSAP promise/timeline).

---

For quick reference: important files — `src/components/ParallaxSection.astro`, `src/pages/index.astro`, `src/scripts/scroll-controller.ts`, `src/scripts/background-manager.ts`, `src/scripts/sections-animation.ts`, and `src/scripts/animations/*`.
