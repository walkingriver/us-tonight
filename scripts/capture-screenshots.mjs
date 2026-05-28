#!/usr/bin/env node
/**
 * Captures portrait screenshots of the built PWA (../www) into assets/screenshots/.
 *
 * Prerequisite: build the PWA so www/ exists (default: ../covenant-couples/www).
 *
 * Usage: PWA_WWW=../covenant-couples/www npm run capture
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.join(__dirname, '..');
const WWW = path.resolve(
  process.env.PWA_WWW || path.join(SITE_ROOT, '..', 'covenant-couples', 'www'),
);
const OUT_DIR = path.join(SITE_ROOT, 'assets', 'screenshots');
const PORT = 4173;
const BASE = `http://127.0.0.1:${PORT}`;

const VIEWPORT = { width: 390, height: 844 };

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

function waitForServer(url, timeoutMs = 90000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = async () => {
      if (Date.now() - start > timeoutMs) {
        reject(new Error(`Server at ${url} did not respond within ${timeoutMs}ms`));
        return;
      }
      try {
        const res = await fetch(url, { method: 'GET' });
        if (res.ok) {
          resolve();
          return;
        }
      } catch {
        /* retry */
      }
      setTimeout(tick, 400);
    };
    tick();
  });
}

/** Minimal static file + SPA fallback (Angular routes) without external CLI tools. */
function startSpaStaticServer(rootDir, port) {
  const root = path.resolve(rootDir);
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const u = new URL(req.url || '/', `http://127.0.0.1`);
        let rel = decodeURIComponent(u.pathname).replace(/^\/+/, '') || 'index.html';
        let filePath = path.resolve(root, rel);
        if (!filePath.startsWith(root + path.sep) && filePath !== root) {
          res.writeHead(403);
          res.end();
          return;
        }
        let st;
        try {
          st = fs.statSync(filePath);
        } catch {
          st = null;
        }
        if (!st || st.isDirectory()) {
          filePath = path.join(root, 'index.html');
        }
        const body = fs.readFileSync(filePath);
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(body);
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(String(e));
      }
    });
    server.listen(port, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

function closeServer(server) {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
}

async function dismissOverlays(page) {
  const dialog = page.locator('ion-alert');
  if (await dialog.isVisible().catch(() => false)) {
    const ok = dialog.getByRole('button', { name: /ok|got it|close/i });
    if (await ok.isVisible().catch(() => false)) await ok.click();
  }
}

async function main() {
  if (!fs.existsSync(path.join(WWW, 'index.html'))) {
    console.error(
      `Missing ${path.relative(process.cwd(), WWW)}/index.html — build the PWA first (e.g. npm run build in ../covenant-couples) or set PWA_WWW.`,
    );
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const server = await startSpaStaticServer(WWW, PORT);
  try {
    await waitForServer(BASE + '/');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: VIEWPORT,
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    const goto = (p) => page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 });

    async function shot(name, fn) {
      await fn();
      await delay(400);
      await page.screenshot({
        path: path.join(OUT_DIR, `${name}.png`),
        fullPage: true,
      });
      console.log('wrote', path.join('assets/screenshots', `${name}.png`));
    }

    await shot('home', async () => {
      await goto('/home');
      await page.waitForSelector('.hero-title', { timeout: 60000 });
    });

    await shot('context', async () => {
      await goto('/session/context');
      await page.waitForSelector('ion-title', { timeout: 60000 });
      await page.getByRole('button', { name: 'Ordinary evening' }).click();
      await delay(200);
    });

    await shot('about', async () => {
      await goto('/about');
      await page.waitForSelector('ion-content.about-content', { timeout: 60000 });
    });

    await shot('solo', async () => {
      await goto('/home');
      await page.waitForSelector('.hero-title', { timeout: 60000 });
      await page.locator('ion-button.home-cta-secondary').click();
      await page.waitForURL('**/session/context**');
      await delay(300);
    });

    await shot('partners', async () => {
      await goto('/home');
      await page.waitForSelector('.hero-title', { timeout: 60000 });
      await page.locator('ion-button.home-cta').filter({ hasText: 'Both of us' }).click();
      await page.waitForURL('**/session/context**');
      await page.getByRole('button', { name: 'Ordinary evening' }).click();
      await page.getByRole('button', { name: 'Next: Both of you' }).click();
      await page.waitForURL('**/session/partners**');
      await dismissOverlays(page);
      await delay(400);
    });

    await shot('reveal', async () => {
      await goto('/home');
      await page.waitForSelector('.hero-title', { timeout: 60000 });
      await page.locator('ion-button.home-cta').filter({ hasText: 'Both of us' }).click();
      await page.waitForURL('**/session/context**');
      await page.getByRole('button', { name: 'Low energy' }).click();
      await page.getByRole('button', { name: 'Next: Both of you' }).click();
      await page.waitForURL('**/session/partners**');

      await page.locator('ion-item').filter({ hasText: 'Mood / bandwidth' }).click();
      await delay(350);
      const lowOpt = page.getByRole('button', { name: 'Low', exact: true }).or(page.getByText('Low', { exact: true }));
      if (await lowOpt.first().isVisible().catch(() => false)) {
        await lowOpt.first().click();
      } else {
        await page.getByRole('radio', { name: 'Low' }).click().catch(() => undefined);
      }
      await delay(250);

      const husbandSeg = page.locator('ion-segment-button[value="husband"]');
      await husbandSeg.click();
      await delay(300);
      await page.locator('ion-item').filter({ hasText: 'Mood / bandwidth' }).click();
      await delay(350);
      const highOpt = page.getByRole('button', { name: 'Energized', exact: true }).or(page.getByText('Energized'));
      if (await highOpt.first().isVisible().catch(() => false)) {
        await highOpt.first().click();
      } else {
        await page.getByRole('radio', { name: 'Energized' }).click().catch(() => undefined);
      }
      await delay(250);

      await page.getByRole('button', { name: 'Submit' }).click();
      await page.waitForURL('**/session/reveal**', { timeout: 30000 });
      await delay(800);
      await dismissOverlays(page);
    });

    await browser.close();
  } finally {
    await closeServer(server);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
