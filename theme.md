# Visual Theme & Design System Audit

## Step 2: Audit Findings

### 1. Color Palette
- **Colors Used:**
  - An overarching hardcoded scheme of `#1B3C34` (dark green/emerald) and `#FAF5E8` (cream/ivory).
  - Minor shades: `#050505` (near black), `#0D2A23`, `#1a1a1a`, `#2a3a32`.
  - Copious arbitrary opacity variants: `text-[#1B3C34]/20`, `/30`, `/40`, `/45`, `/50`, `/55`, `/60`.
- **Hardcoded bypasses:** The vast majority of the app uses raw bracketed hex codes (`bg-[#FAF5E8]`, `text-[#1B3C34]`).
- **Token System failure:** `tailwind.config.js` defines semantic palettes (`luxe`, `bloom`, `midnight`, `earth`), but these are virtually ignored in the components. A massive standalone CSS file (`css/styles.css`) defines a "Snazzy - Luxury Glassmorphism" theme with `--emerald`, `--gold`, and `--ivory` variables, but this file is **not even imported** into the Vite app, making it dead code.
- **Contrast issues:** Instances like `text-[#1B3C34]/20` or `/30` on `#FAF5E8` backgrounds are highly likely to fail WCAG AA contrast ratios, as the opacity washes out the text.

### 2. Typography
- **Fonts Used:** `font-bodoni` ("Bodoni Moda") and `font-inter` ("Inter").
- **Scale & Sizing:** Completely ad hoc. Instead of using Tailwind's robust type scale (`text-xs`, `text-sm`, `text-lg`), the codebase relies heavily on arbitrary bracketed values: `text-[9px]`, `text-[10px]`, `text-[11px]`, `text-[12px]`, `text-[13px]`, `text-[1.8rem]`, `text-[3.8rem]`.
- **Line Heights & Tracking:** Extremely arbitrary. `tracking-[0.25em]`, `tracking-[0.3em]`, `tracking-[0.35em]`, `tracking-[0.4em]`, `tracking-[0.5em]` are scattered everywhere to force layout rather than relying on a cohesive tracking token scale.
- **Inline Styles:** Files like `About.tsx` and `Home.tsx` inject raw responsive inline font sizes (`style={{ fontSize: '95vw', lineHeight: 0.85 }}`).

### 3. Spacing & Layout
- **Scale:** Standard Tailwind spacing is used for macro layouts (`py-12`, `mb-5`), but micro-layouts frequently use arbitrary values to force alignment: `py-[18px]`, `min-h-[52px]`, `w-9 h-9`.
- **Rhythm:** The mix of rigid pixel font sizes (`text-[11px]`) and fluid spacing makes the rhythm feel very brittle and screen-dependent.

### 4. Component Consistency
- **Divergence:** Components are highly localized and hand-rolled rather than drawing from shared abstractions. A button in `Shop.tsx` (`w-full py-3.5 bg-white/95 ... flex items-center justify-center gap-2`) is completely separate from a button in `ProductFeature.tsx` (`inline-flex items-center gap-3 ... px-8 py-4 bg-[#1B3C34]`).
- **UI Elements:** Dividers are manually drawn with varying opacities (`border-[#1B3C34]/10`, `border-[#1B3C34]/20`, `bg-[#1B3C34]/30`).

### 5. Dark/Light Mode
- **Absence of Mode:** There is no structural dark or light mode. Specific sections are hardcoded to act as "dark mode" visually (e.g., Hero/Heritage sections using `#050505` or `#000` backgrounds), while others are "light mode" (e.g., Shop using `#FAF5E8`).
- **Theme-aware failure:** Since raw hex codes are used (`text-[#1B3C34]`), true `dark:` or `light:` class-switching is non-existent.

### 6. Design Tokens vs Hardcoded Values
- **Usage:** ~95% of styling bypasses the theme token system in favor of inline bracketed classes (`[#hex]`, `[13px]`, `[0.25em]`).
- **Worst offending files:**
  - `src/sections/Shop.tsx`
  - `src/sections/ProductFeature.tsx`
  - `src/sections/Gallery.tsx`
  - `src/sections/Home.tsx`

### 7. Brand/Aesthetic Coherence
- **The Ideal:** The phantom `styles.css` describes a "Luxury Glassmorphism" system rich with glowing gold orbs, emerald gradients, and a custom gold cursor. 
- **The Reality:** The actual deployed React code discards this entirely for a flat, brutalist-luxury editorial vibe rooted in flat cream (`#FAF5E8`) and dark green (`#1B3C34`), leaning on excessive letter-spacing and ultra-thin typography.
- **Breakdown:** The codebase identity is split. The styles are cohesive visually on the screen, but structurally chaotic.

### 8. Responsive/Adaptive Consistency
- **Handling:** Breakpoints are handled ad hoc per component. The developer throws `md:`, `lg:`, and `sm:` prefixes at elements until they fit the screen visually, rather than using a standard fluid layout. 
- Instances like `text-[3.8rem] sm:text-7xl md:text-8xl lg:text-9xl` mixed with inline `style={{ fontSize: '28vw' }}` represent a chaotic approach to scaling.

---

## Step 3: Summary & Prioritized Fixes

| Area | Status | Notes |
| :--- | :--- | :--- |
| **Color Palette** | 🔴 Major Issues | Rampant hardcoded `#1B3C34` & `#FAF5E8`; orphaned CSS variables. |
| **Typography** | 🔴 Major Issues | Extensive use of arbitrary `text-[9px]` to `text-[13px]` and chaotic letter-spacing. |
| **Spacing/Layout** | 🟡 Minor Issues | Generally relies on Tailwind core spacing but breaks for micro-adjustments. |
| **Component Consistency** | 🔴 Major Issues | Hand-rolled UI components (buttons, badges) in every section file. |
| **Dark/Light Mode** | 🔴 Major Issues | Hardcoded per-section; no true system toggle capability. |
| **Tokens vs Hardcoded** | 🔴 Major Issues | Tailwind config is basically unused; >90% hardcoded styling. |
| **Brand Coherence** | 🟡 Minor Issues | Visually works on-screen, but codebase implies two conflicting design systems (`styles.css` vs `[#hex]`). |
| **Responsive** | 🔴 Major Issues | Excessive responsive breakpoint bloat and arbitrary viewport units. |

### Top 5 Prioritized Fixes (Impact vs Effort)

1. **Extract Core Colors to `tailwind.config.js`**
   - *Impact: High / Effort: Low*
   - Define `#1B3C34` as `brand-dark` and `#FAF5E8` as `brand-light`. Do a global find/replace to kill the `[#hex]` brackets.
2. **Standardize Typography Scales**
   - *Impact: High / Effort: Medium*
   - Extend the Tailwind config with custom font sizes (e.g., `text-micro` for 9-11px, `text-hero` for `3.8rem`) to eliminate `text-[9px]` and `tracking-[0.5em]`.
3. **Delete Dead Code (`css/styles.css`) or Integrate It**
   - *Impact: Medium / Effort: Low*
   - There's a 1,300-line unused CSS file defining a totally different visual system. Either import it and use its classes, or delete it to reduce cognitive overhead.
4. **Create a Unified Button Component**
   - *Impact: High / Effort: Medium*
   - Extract the repetitive `w-full py-3.5 bg-white/95 ...` logic from `Shop.tsx` and `ProductFeature.tsx` into a `src/components/Button.tsx`.
5. **Convert Inline Style Viewport Typography to Tailwind Utilities**
   - *Impact: Medium / Effort: Low*
   - Remove `style={{ fontSize: '95vw' }}` in `About.tsx` and `Home.tsx`, and define a `text-fluid-hero` class or equivalent in Tailwind plugins to handle it cleanly.

### Specific File:Line References for Flagged Issues

- **Dead Theme System:** `css/styles.css` (entire file is orphaned and conflicts with React app design).
- **Hardcoded Colors:** 
  - `src/sections/Shop.tsx:190` (`accent: '#1B3C34'`)
  - `src/sections/Shop.tsx:206` (`bg-[#FAF5E8]`)
  - `src/sections/Home.tsx:64` (inline style `linear-gradient(160deg, #0A1C17 0%, #1B3C34 50%, #0D2A23 100%)`)
- **Accessibility/Contrast Fails:**
  - `src/sections/Shop.tsx:277` (`text-[#1B3C34]/30`) - too faint.
  - `src/sections/Gallery.tsx:156` (`text-[#1B3C34]/20`)
- **Arbitrary Typography:**
  - `src/sections/Shop.tsx:236` (`text-[9px] tracking-[0.25em]`)
  - `src/sections/Shop.tsx:248` (`text-[11px] tracking-[0.3em]`)
  - `src/sections/Gallery.tsx:96` (`text-[10px] tracking-[0.4em]`)
- **Inline Viewport Spacing/Typography:**
  - `src/pages/About.tsx:43` (`style={{ fontSize: '95vw', lineHeight: 0.85, ... }}`)
  - `src/sections/Craftsmanship.tsx:83` (`style={{ fontSize: '22vw' }}`)
  - `src/sections/Home.tsx:82` (`text-[3.8rem] sm:text-7xl md:text-8xl lg:text-9xl`)
- **Inconsistent/Hand-rolled Buttons:**
  - `src/sections/Shop.tsx:248` (Shop button implementation)
  - `src/sections/ProductFeature.tsx:117` (Product button implementation - completely different classes for same visual role)
- **Arbitrary Spacing:**
  - `src/sections/ProductFeature.tsx:89` (`py-[18px]`)
  - `src/sections/Home.tsx:97` (`min-h-[52px]`)
