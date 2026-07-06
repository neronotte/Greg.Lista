import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

const BASE_URL = 'http://localhost:3000';

async function saveAuthState(
  email: string,
  password: string,
  secret: string,
  outputPath: string
) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(BASE_URL);

  // Call the test-only auth endpoint; the server sets the Supabase session cookies
  // in the response, which the browser context captures automatically.
  await page.evaluate(
    async ({ email, password, secret }) => {
      const res = await fetch('/api/test/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, secret }),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
    },
    { email, password, secret }
  );

  await context.storageState({ path: outputPath });
  await browser.close();
  console.log(`  ✓ saved auth state for ${email}`);
}

async function globalSetup(_config: FullConfig) {
  // Load env: src/.env.local first (Supabase keys), then test/.env (passwords + secret)
  dotenv.config({ path: path.join(__dirname, '../src/.env.local') });
  dotenv.config({ path: path.join(__dirname, '.env') });

  const secret = process.env.PLAYWRIGHT_TEST_SECRET;
  if (!secret) throw new Error('PLAYWRIGHT_TEST_SECRET not set in test/.env');

  const test01Password = process.env.TEST01_PASSWORD;
  if (!test01Password) throw new Error('TEST01_PASSWORD not set in test/.env');

  const test02Password = process.env.TEST02_PASSWORD;
  if (!test02Password) throw new Error('TEST02_PASSWORD not set in test/.env');

  fs.mkdirSync(path.join(__dirname, '.auth'), { recursive: true });

  await saveAuthState(
    'test01@neronotte.com',
    test01Password,
    secret,
    path.join(__dirname, '.auth/test01.json')
  );

  await saveAuthState(
    'test02@neronotte.com',
    test02Password,
    secret,
    path.join(__dirname, '.auth/test02.json')
  );
}

export default globalSetup;
