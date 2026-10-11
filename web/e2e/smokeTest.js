import { test, expect } from '@playwright/test';
import { captureApi } from './apiCapture';
import { explore as explorePage } from './explore';

// E2E_EXPLORE=0 skips interacting with pages for a quicker run
const explore = process.env.E2E_EXPLORE !== '0';

// Known errors that aren't regressions. Keep this short and explain each one.
const ignoredPageErrors = [
  // recplayer-react's file parser throws when a replay/level preview is
  // replaced while it's still loading (eg. paging quickly through comments)
  /^out of range: \d+$/,
];

const toSnapshot = calls => calls.join('\n') + '\n';

const expectHealthyPage = async (page, pageErrors, route) => {
  expect(pageErrors.map(e => e.message)).toEqual([]);
  await expect(page.getByText('Something went wrong')).toHaveCount(0);
  await expect(page.locator('#root')).not.toBeEmpty();
  if (route.anchor) {
    await expect(page.getByText(route.anchor).first()).toBeVisible();
  }
};

// Generates one loose smoke test per route: page renders, nothing crashes,
// and the set of api calls matches the committed snapshot. Then interacts with
// everything on the page and checks the same for the calls that triggers.
// exploreRoute decides per route whether to interact with it after loading
export const smokeTest = (
  routes,
  snapshotPrefix,
  exploreRoute = () => true,
) => {
  for (const route of routes) {
    test(route.name, async ({ page }, testInfo) => {
      test.setTimeout(route.timeout || 180000);

      const pageErrors = [];
      const consoleErrors = [];
      page.on('pageerror', error => {
        if (!ignoredPageErrors.some(regex => regex.test(error.message))) {
          pageErrors.push(error);
        }
      });
      page.on('console', message => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      const api = await captureApi(page, route.mocks);

      try {
        await page.goto(route.path);
        await api.settle();
        if (route.actions) {
          await route.actions(page);
          await api.settle();
        }
        const loadCalls = api.calls();
        await expectHealthyPage(page, pageErrors, route);
        expect
          .soft(toSnapshot(loadCalls))
          .toMatchSnapshot(`${snapshotPrefix}/${route.name}.api.txt`);

        if (explore && route.explore !== false && exploreRoute(route)) {
          const visited = await explorePage(page, api, route.explore);
          await testInfo.attach('explored', {
            body: visited.join('\n'),
            contentType: 'text/plain',
          });
          await expectHealthyPage(page, pageErrors, route);
          expect
            .soft(toSnapshot(api.calls(loadCalls)))
            .toMatchSnapshot(`${snapshotPrefix}/${route.name}.explore.api.txt`);
        }
      } finally {
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
      }
    });
  }
};
