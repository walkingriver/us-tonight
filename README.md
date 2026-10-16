# UsTonight — marketing site

Static HTML + CSS on **Cloudflare Pages**. Native apps ship from the private [covenant-couples-app](https://github.com/walkingriver/covenant-couples-app) repo.

**Live URL:** https://ustonight.walkingriver.com/ (Cloudflare Pages, project `us-tonight`)

| Page | URL |
|------|-----|
| Home | `/` |
| Privacy policy (Play / App Store) | `/privacy.html` |
| Terms of use / EULA | `/eula.html` |
| Beta signup | mailto link on home (see `js/site-config.js`) |
| Support | michael@walkingriver.com |

## Deploy (Cloudflare Pages)

Cloudflare Pages project **us-tonight** is connected to this repo and deploys on every push to `main`.

- Build command: `npm run build` (copies the static files into `dist/`)
- Build output: `dist`
- Custom domain: `ustonight.walkingriver.com`

The old GitHub Pages address (`walkingriver.com/us-tonight/`) now serves only the pages in `redirect/`, which send
visitors to the same page on the new domain. `.github/workflows/deploy-pages.yml` publishes them.

## Configure URLs

Edit `js/site-config.js`:

- `marketingBaseUrl` — site origin (no trailing slash)
- `supportEmail` — store / support contact
- `betaSignupEmail` / `betaSignupSubject` — beta interest mailto
- `appStoreUrl` / `playStoreUrl` — set when TestFlight / Play closed testing links exist

## Local preview

```bash
npx http-server . -p 8080 -c-1
```

Open http://127.0.0.1:8080
