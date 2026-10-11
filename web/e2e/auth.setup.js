import { fileURLToPath } from 'node:url';
import { test as setup, expect } from '@playwright/test';

// Logs in a test account on apitest and stores the auth cookies for the
// 'user' project. Only runs when E2E_USER and E2E_PASS are set.
setup('login', async ({ page }) => {
  await page.goto('/login');
  await page.locator('input[name=kuski]').fill(process.env.E2E_USER);
  await page.locator('input[name=password]').fill(process.env.E2E_PASS);
  await page.locator('main').getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/');
  await page.context().storageState({
    path: fileURLToPath(new URL('.auth/user.json', import.meta.url)),
  });
});
