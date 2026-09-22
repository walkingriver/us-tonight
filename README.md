# UsTonight — marketing site

Static HTML + CSS for **GitHub Pages**. Native apps ship from the private [covenant-couples-app](https://github.com/walkingriver/covenant-couples-app) repo.

**Live URL:** https://walkingriver.github.io/covenant-couples-site/

| Page | URL |
|------|-----|
| Home | `/` |
| Privacy policy (Play / App Store) | `/privacy.html` |
| Terms of use / EULA | `/eula.html` |
| Beta signup | mailto link on home (see `js/site-config.js`) |
| Support | michael@walkingriver.com |

## GitHub Pages deploy

Workflow `.github/workflows/deploy-pages.yml` publishes on every push to `main`.

**One-time repo setup:**

1. GitHub → **walkingriver/covenant-couples-site** → **Settings** → **Pages**
2. **Build and deployment** → Source: **GitHub Actions**
3. Push to `main` (or run the workflow manually under **Actions**)

## Configure URLs

Edit `js/site-config.js`:

- `marketingBaseUrl` — GitHub Pages origin (no trailing slash)
- `supportEmail` — store / support contact
- `betaSignupEmail` / `betaSignupSubject` — beta interest mailto
- `appStoreUrl` / `playStoreUrl` — set when TestFlight / Play closed testing links exist

## Local preview

```bash
npx http-server . -p 8080 -c-1
```

Open http://127.0.0.1:8080
