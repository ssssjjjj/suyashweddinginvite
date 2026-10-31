# Project architecture

This is an original Indian wedding invitation built with TanStack Start, React 19, TypeScript, and Vite. It is configured for static prerendering and Cloudflare Pages. The single index route renders the complete guest experience. No backend or paid API is required to serve the invitation.

## Key files

- `src/wedding.config.ts`: central editable content, enabled ceremonies/story, dates, photos, and optional music.
- `src/routes/index.tsx`: stationery cover and click-gated lazy loading of the invitation.
- `src/components/full-invitation.tsx`: full invitation, date reveal, countdown, calendar download, itinerary, music controls, and RSVP component.
- `src/routes/__root.tsx`: HTML shell, accessible error pages, and share metadata derived from the configuration.
- `src/styles.css`: ivory, gold and maroon design, responsive layout, typography, and reduced-motion support.
- `public/img/palace.png`: original palace background served as a normal static asset.
- `src/components/invitation.test.tsx`: guest interaction and RSVP response tests.

## Conventions and decisions

Keep all personal details in the configuration. Event dates use explicit time-zone offsets and display in Asia/Kolkata. Browser APIs are used only in effects or event handlers because the page is prerendered at build time. Initial countdown values are dashes until the client mounts to avoid hydration mismatches.

RSVP is a browser-only preview with no backend requests or persistence. Display the notice from the wedding configuration before and after completion, explaining that no response is sent or saved and guests must contact the hosts directly. Never claim attendance is recorded or reserved.

Unused ceremonies are filtered from the page and RSVP options using the same configuration. Music is optional, absent by default, and always guest-initiated. Gallery viewing uses Radix Dialog for focus trapping and Escape handling, with arrow keys and swipe support added.

Preserve keyboard focus styling, accessible labels, minimum comfortable touch controls, responsive layouts, and the reduced-motion media query. The main invitation remains navigable without requiring the opening animation.

Use pnpm and keep its lockfile. Validate with `pnpm build`, `pnpm typecheck`, and `pnpm test` before sharing the production URL. The deployment target is Cloudflare Pages with build output `dist/client`.
