import { test, expect } from '@playwright/test';
import { captureApi } from './apiCapture';

// Generates one loose smoke test per route: page renders, nothing crashes,
// and the set of api calls matches the committed snapshot.
export const smokeTest = (routes, snapshotPrefix) => {
  for (const route of routes) {
    test(route.name, async ({ page }, testInfo) => {
      if (route.timeout) test.setTimeout(route.timeout);

      const pageErrors = [];
      const consoleErrors = [];
      page.on('pageerror', error => pageErrors.push(error));
      page.on('console', message => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      const api = await captureApi(page);

      await page.goto(route.path);
      await api.settle();
      if (route.actions) {
        await route.actions(page);
        await api.settle();
      }

      if (consoleErrors.length) {
        await testInfo.attach('console-errors', {
          body: consoleErrors.join('\n'),
          contentType: 'text/plain',
        });
      }

      if (api.failures().length) {
        await testInfo.attach('failed-api-calls', {
          body: api.failures().join('\n'),
          contentType: 'text/plain',
        });
      }

      expect(pageErrors.map(e => e.message)).toEqual([]);
      await expect(page.getByText('Something went wrong')).toHaveCount(0);
      await expect(page.locator('#root')).not.toBeEmpty();
      if (route.anchor) {
        await expect(page.getByText(route.anchor).first()).toBeVisible();
      }

      expect(api.snapshot()).toMatchSnapshot(
        `${snapshotPrefix}/${route.name}.api.txt`,
      );
    });
  }
};
