# Wedding Invitation — Cloudflare Pages edition

This project is configured as a **static, pre-rendered website** for Cloudflare Pages. It does not need Netlify, a server, a database, or paid APIs to serve the invitation.

## What changed for Cloudflare

- Removed the Netlify Vite plugin and Netlify deployment configuration.
- Removed the Netlify image CDN URL. The palace image now loads directly from `public/img/palace.png`.
- Enabled TanStack Start build-time prerendering. Cloudflare Pages serves the generated HTML and static assets; guests do not invoke a server function for each visit.
- Removed unused Netlify database/functions packages, Drizzle database files, and a separate artwork-generation script that depended on Netlify AI Gateway.
- Kept the invitation UI and browser-side features, including the cover/open interaction, music, date reveal, countdown, calendar download, navigation, WhatsApp sharing, and local RSVP preview.

## Build locally

Requires Node.js 22.13+ (or Node 24+) and pnpm.

```sh
corepack enable
corepack prepare pnpm@latest --activate
pnpm install
pnpm build
pnpm preview
```

Open the local preview URL printed by Vite. Confirm the invitation opens and all images/music load.

## Deploy to Cloudflare Pages

1. Push this project to a GitHub repository.
2. In Cloudflare, open **Workers & Pages → Create application → Pages → Connect to Git**.
3. Select the repository and configure:
   - **Framework preset:** None
   - **Build command:** `pnpm build`
   - **Build output directory:** `dist/client`
   - **Root directory:** `/`
4. Set the Node.js version to 22 if Cloudflare asks for it (for example, environment variable `NODE_VERSION=22`).
5. Deploy. Cloudflare will provide a `*.pages.dev` URL.

Every subsequent push to the production branch triggers a new deployment.

## Important RSVP note

The RSVP form is intentionally a local preview only. It validates the form in the browser and displays a confirmation, but does not send or save guest responses. Guests should contact the hosts directly to confirm attendance unless a real RSVP service is added later.

## Custom domain

After deployment, open the Pages project → **Custom domains** and follow Cloudflare's instructions. You can keep using the `pages.dev` URL if you do not own a domain.

## Wedding content

Edit `src/wedding.config.ts` to update names, family details, dates, venue, ceremonies, music URL, RSVP wording, and other invitation content. Local images and music belong under `public/`.
