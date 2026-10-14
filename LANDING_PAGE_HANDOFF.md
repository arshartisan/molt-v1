# Molt landing page

Built from `../molt-landing-page-kit/MOLT_LANDING_PAGE_BRIEF.md`, the feature evidence, screenshots and design tokens. Uses Next.js App Router, supplied Inter fonts and original Molt SVG brand assets. The website has no dependency on the mobile app or its APIs.

## Local review

Run `npm run dev` in `molt-v1`, then open http://localhost:3000. Run `npm run lint`, `npx tsc --noEmit` and `npm run build` for verification.

## Interaction and typography update

Framer Motion animates the native demo dialog in and out (240 ms), mobile navigation (200 ms), app preview changes (240 ms) and FAQ disclosure height/opacity (200 ms). The native dialog retains its focus trap until its closing animation finishes; Escape and backdrop clicks use the same closing path. Keyboard tab navigation updates instantly. Reduced-motion preferences remove positional movement and shorten or disable transitions.

Website labels and captions now use approximately 12 px text, navigation uses 14 px, and body copy uses 14–15 px. Miniature text inside the labelled phone illustrations remains scaled for the device preview. Team roles stack at the narrowest breakpoint to keep descriptions readable.

The hero and section introductions now have 600 ms entrances on first visibility. Feature cards and setup steps reveal with a 60 ms stagger. Each reveal plays once per visit; reduced-motion and JavaScript-free visits show content immediately. App tab previews mount with an explicit entrance state on each selection instead of animating while hidden.

## Product illustrations

`app/product-preview.tsx` contains original HTML/CSS illustrations based on the documented screen structure. They are labelled illustrative and are not captures or live data. They use anonymous names and sample recorded counts, preserving the distinction between unavailable camera observations and recorded flock totals. Supplied screenshots remain untouched in the kit and are not served publicly. No farm/account identities, stream credentials or private API requests are used.

`public/brand/` contains unchanged copies of the supplied vector logos; `app/icon.png` copies the supplied Molt raster icon. Inter font files are copied into `app/fonts/` and self-hosted using `next/font/local`.

## Before public release

- Set `NEXT_PUBLIC_MOLT_DEMO_URL` to an approved HTTPS booking destination and rebuild. The example environment file documents this input. Without it, every conversion action opens a pending-booking dialog and submits no information.
- Supply the public domain before adding canonical URLs; supply approved business identity and legal pages before linking them.
- Confirm any store listings before adding download badges. Pricing, testimonials, accuracy percentages and unsupported product features are intentionally omitted.
- Review branding/font distribution rights and approve the labelled sample illustrations. Approved sanitized screenshots can replace them later.
- Complete browser checks at 320, 390, 768, 1024 and 1440 px, including navigation, app tabs, FAQ disclosures, dialog Escape/focus handling, zoom and reduced motion. Automated browser launch was blocked by process permissions in the implementation environment.

No deployment was performed.
