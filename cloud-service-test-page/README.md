# Cloud Service Test Page

Minimal static smoke test: verifies a cloud host is reachable, serves static assets, and renders at any screen size. Plain HTML + CSS + vanilla JS, no dependencies, no build step.

## Running locally

Open `index.html` directly in a browser (`file://`), or serve the folder over HTTP: `python3 -m http.server 8000` then visit `http://localhost:8000/`. Both must render with no console errors; the `/healthz` check is expected to fail locally unless you provide that endpoint.

## Deploying to a static host

Upload `index.html`, `styles.css`, and `script.js` (repo root, relative paths) to any static host — Vercel, Netlify, Cloudflare Pages, S3, GitHub Pages, or nginx — and open the site URL. Optionally add a `/healthz` route/file on the host to see a successful health check; otherwise the button reports a clear failure without breaking the page.

## Changing the health-check endpoint

Edit `script.js` line 5: `const HEALTH_ENDPOINT = "/healthz";` — replace `"/healthz"` with your path or absolute URL.
