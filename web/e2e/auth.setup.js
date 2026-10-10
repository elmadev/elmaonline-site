import { test as setup, expect } from '@playwright/test';

// Logs in a test account on apitest and stores the auth cookies for the
// 'user' project. Only runs when E2E_USER and E2E_PASS are set.
setup('login', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Kuski').fill(process.env.E2E_USER);
  await page.getByLabel('Password').fill(process.env.E2E_PASS);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page).toHaveURL('/');
  await page.context().storageState({ path: 'e2e/.auth/user.json' });
});
