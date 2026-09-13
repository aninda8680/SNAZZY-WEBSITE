# UI/UX & Frontend Audit Report: SNAZZY Website

## 1. Executive Summary

The SNAZZY website presents a premium, streetwear-focused aesthetic that effectively uses a rich dark green (`#1B3C34`) and cream (`#FAF5E8`) color palette to establish a distinct brand identity. The visual design is intentional, feeling like a high-end boutique rather than a generic template, heavily supported by elegant serif typography for headings and high-quality photography. The top strengths of the site are its strong brand cohesion, excellent use of high-quality imagery, and a clean, minimalist layout that lets the products shine. However, there are significant risks that undermine the user experience. The primary risks include critical accessibility failures (missing form labels and focus states), severe color contrast issues on key pages (especially the login flow and hero section), and a lack of trust signals like customer reviews or prominent support information. Addressing these risks will elevate the site from merely looking good to functioning as a high-converting e-commerce platform.

## 2. Findings Table

| Page | Category | Issue (specific) | Severity | Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| `/` (Home) | Color & contrast | The hero section subtitle text below "Wear Your Story" is virtually illegible against the dark green background. | Critical | Lighten the text color (e.g., to cream or white with 80% opacity) or add a subtle dark gradient overlay behind the text. |
| `/login` | First impressions | The SNAZZY logo image is designed for a dark background and is invisible against the cream (`#FAF5E8`) background. | Critical | Swap the image asset to a dark-colored version of the logo for pages with a cream background. |
| `/login` | Accessibility | Form `<label>` elements lack `htmlFor` attributes and `<input>` elements lack `id` attributes. | High | Add matching `id` and `htmlFor` attributes to properly associate labels with inputs for screen readers. |
| `/login` | Color & contrast | The "or" separator and "← Back to store" link use extremely low opacity (`#1B3C34` at 35% and 45%), failing WCAG 2.1 AA 4.5:1 contrast requirements. | High | Increase the opacity of these text elements to at least 70% to meet contrast guidelines. |
| `/collections` | Layout & spacing | The mobile footer layout is cluttered; spacing between "SHOP", "BRAND", and "SUPPORT" columns is uneven, and social icons float without alignment. | Medium | Refactor the mobile footer into a clean single-column stacked layout or a rigid 2x2 grid with consistent padding. |
| `/about` | Layout & spacing | In the mobile view of the "OUR VALUES" section, the left/right padding is too tight, making text sit too close to the screen edge. | Medium | Increase horizontal padding (`px-4` or `px-6`) on mobile breakpoints to match the top/bottom spaciousness. |
| `/` (Home) | Trust & credibility | The product showcase lacks any form of social proof (reviews, ratings, testimonials). | Medium | Introduce a minimalist star rating system or a curated "Customer Reviews" carousel below the product grid. |
| All Pages | Performance | Actual load time, layout shift, and JS console errors cannot be fully assessed without live interaction and profiling tools. | Medium | Run a full Lighthouse audit and monitor the console in a production build to catch render-blocking issues. |
| All Pages | Interactive elements | Keyboard focus states are visually absent or rely on default browser rings that lack contrast against the dark background. | High | Implement a custom, high-contrast `:focus-visible` state across all interactive elements globally. |

## 3. Prioritized Action Plan

### "Quick wins" (can fix in under a day, high impact)
- **Fix Login Page Logo:** Swap the logo on `/login` to a dark variant so users know what site they are logging into.
- **Correct Hero Contrast:** Increase the brightness/opacity of the subtitle text on the homepage hero section.
- **Fix Form Accessibility:** Add `htmlFor` and `id` tags to the email and password inputs on the login and register forms.
- **Fix Link Contrast:** Increase the opacity of the secondary links ("Back to store", "or") on the auth pages to meet WCAG AA standards.

### "Structural fixes" (need more design/dev time)
- **Global Focus States:** Define and implement a custom `:focus-visible` ring across the entire design system (buttons, links, inputs) that works on both dark and light backgrounds.
- **Mobile Footer Refactor:** Rebuild the footer component to ensure a balanced, legible layout on viewports under 768px.
- **Trust Signals Integration:** Design and integrate a review/rating component for products on the homepage and individual product pages to boost conversion confidence.

### "Nice-to-haves" (polish, not urgent)
- **Filter Bar Enhancements:** Add a subtle micro-animation or a stronger visual indicator (like a pill background) for the active category on the `/collections` page filter bar.
- **Padding Adjustments:** Standardize mobile horizontal padding across all sections (e.g., fixing the tight padding in the `/about` Values section).

## 4. Category Scorecard

| Category | Score | Justification |
| :--- | :--- | :--- |
| **1. First impressions** | 8/10 | Premium, intentional aesthetic, but marred by the invisible logo on auth pages. |
| **2. Typography** | 8/10 | Elegant pairing of serif headings with Inter, though tiny uppercase tracking is slightly extreme. |
| **3. Color & contrast** | 5/10 | Severe contrast failures in hero text and secondary links negatively impact usability. |
| **4. Layout & spacing** | 7/10 | Clean desktop grid, but mobile scaling introduces some awkward padding and footer crowding. |
| **5. Navigation** | 8/10 | Simple and obvious, though breadcrumbs are missing for deeper navigation paths. |
| **6. Responsiveness** | 7/10 | Functional across breakpoints, but mobile layouts lack the polish of the desktop view. |
| **7. Accessibility** | 4/10 | Critical failures with form labeling and missing custom focus states; fails WCAG AA. |
| **8. Performance** | N/A | Cannot be fully assessed without live interaction/profiling (requires Lighthouse run). |
| **9. Content & microcopy** | 8/10 | Tone is consistent and fits the streetwear vibe; lacks persuasive microcopy on CTAs. |
| **10. Forms & elements** | 6/10 | Minimalist forms look good but sacrifice accessibility and clear active/error state visibility. |
| **11. Design system** | 9/10 | Highly consistent reuse of colors, typography, and button styles across pages. |
| **12. CTAs & conversion** | 7/10 | Primary actions are visible, but friction exists due to lack of trust signals before conversion. |
| **13. Trust & credibility** | 5/10 | High visual polish, but completely lacks reviews, ratings, or prominent support information. |
| **14. Technical frontend** | 6/10 | Missing semantic HTML relationships in forms; JS errors cannot be assessed without live interaction. |
| **15. Cross-browser** | N/A | Cannot assess Safari/Firefox specific quirks without live cross-browser testing. |

## 5. Highest-Leverage Change

**The single highest-leverage change to make first is fixing the accessibility and contrast issues on the `/login` page.**
*Why:* The login flow is a critical bottleneck for user retention and conversion. Currently, the invisible logo creates immediate confusion, the low-contrast links cause frustration, and the lack of proper form labeling makes it completely inaccessible to users relying on assistive technologies. Fixing these takes minimal development effort (swapping an image, tweaking CSS opacities, and adding two HTML attributes) but immediately removes massive friction from the most sensitive part of the user journey.
