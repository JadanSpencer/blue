# Blue Ember Concepts: website demo

A static website. There is no server, database or build step: the files in this
folder are the website, and the host serves them straight from its global network.

## Commands (need Node.js 20.9 or newer)

    npm install        # once: installs sharp, the only dependency (used on your computer only)
    npm run images     # downloads the originals from blueemberja.com and makes small WebP copies in /img
    npm run check      # confirms the security policy still allows the page's start-up script
    npm run audit      # checks the dependency for known vulnerabilities

## Before every deploy

1. `npm run check`. If you edited the small script in any page's `<head>`, its fingerprint
   changes. This prints the new `sha256-...` value to paste into `vercel.json` and `render.yaml`.
   Skip this and browsers will silently block the loader and image fallbacks.
2. `npm run audit`. It should report 0 vulnerabilities. GitHub's Dependabot also opens a pull
   request automatically when a fix is released (see `.github/dependabot.yml`).

## Deploying

- **Vercel:** import the repo; `vercel.json` sets the security and caching headers, and
  `.vercelignore` keeps tools and config off the live site.
- **Render:** `render.yaml` copies only the website files into `dist/` and publishes that.
- Both provide HTTPS certificates automatically and renew them, including on a custom domain.

## Where things live

- `data.js`: projects, phone feed, settings (WhatsApp number, BizPlej date). Edit content here.
- `main.js`: behaviour. `styles.css`: design. `privacy.html` and `terms.html`: legal pages.
- `tools/`: image optimiser, CSP check and one-off helpers. Never deployed.

## To confirm with Blue Ember before launch

- The privacy policy says some illustrations were made with AI image tools. Confirm, or edit.
- The 30-day deletion and response commitments, and the FAQ answers on quotes and timelines.
- Uploads are described as going to a public storage bucket. For client files, private
  storage with expiring links is safer. Update the policy if that changes.
- Have a lawyer review `privacy.html` and `terms.html`.
