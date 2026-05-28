# Covenant Couples — marketing site

Static HTML + CSS for **GitHub Pages**. Separate from the Ionic/Angular PWA in [walkingriver/covenant-couples](https://github.com/walkingriver/covenant-couples) (private app repo).

**Live URL:** https://walkingriver.github.io/covenant-couples-site/

| Page | URL |
|------|-----|
| Home | `/` |
| Privacy policy (Play Store) | `/privacy.html` |
| Terms of use / EULA | `/eula.html` |
| Support | michael@walkingriver.com |

The PWA stays on Cloudflare Pages (`pwaBaseUrl` in `js/site-config.js`). Legal pages live on this marketing site.

## GitHub Pages deploy

Workflow `.github/workflows/deploy-pages.yml` publishes on every push to `main`.

**One-time repo setup:**

1. GitHub → **walkingriver/covenant-couples-site** → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. Push to `main` (or run the workflow manually under **Actions**)

Optional custom domain (e.g. `covenant-couples.walkingriver.com`): add the hostname under Pages settings and commit a `CNAME` file in this repo root.

## Configure URLs

Edit `js/site-config.js`:

- `marketingBaseUrl` — GitHub Pages origin (no trailing slash)
- `pwaBaseUrl` — Cloudflare Pages app host
- `supportEmail` — store / support contact
- `appStoreUrl` / `playStoreUrl` — set when listings exist

## Screenshot capture (Playwright)

Captures PWA screenshots from a built `www/` folder in the sibling app repo.

```bash
# In ../covenant-couples (or set PWA_WWW to your build output)
npm run build

# In this repo
npm install
PWA_WWW=../covenant-couples/www npm run capture
```

## Local preview

```bash
npx http-server . -p 8080 -c-1
```

Open http://127.0.0.1:8080 — legal links use relative paths; app links use `pwaBaseUrl`.
