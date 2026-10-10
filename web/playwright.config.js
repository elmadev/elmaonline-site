import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const hasAuth = !!(process.env.E2E_USER && process.env.E2E_PASS);

export default defineConfig({
  testDir: 'e2e',
  // keep snapshots platform independent so they can be shared between dev machines and CI
  snapshotPathTemplate: '{testDir}/__snapshots__/{arg}{ext}',
  timeout: 90000,
  retries: 1,
  fullyParallel: true,
  // apitest gets slow under load, which makes pages time out and skip calls
  workers: 3,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'guest',
      testMatch: 'smoke.spec.js',
      use: { ...devices['Desktop Chrome'] },
    },
    ...(hasAuth
      ? [
          { name: 'auth-setup', testMatch: 'auth.setup.js' },
          {
            name: 'user',
            testMatch: 'smoke-user.spec.js',
            dependencies: ['auth-setup'],
            use: {
              ...devices['Desktop Chrome'],
              storageState: 'e2e/.auth/user.json',
            },
          },
        ]
      : []),
  ],
  webServer: {
    command: `yarn build --mode test && yarn serve --port ${port} --strictPort`,
    port,
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
