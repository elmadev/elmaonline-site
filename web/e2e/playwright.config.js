import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

// paths relative to the web folder, so it works from any working directory
const web = fileURLToPath(new URL('..', import.meta.url));

// E2E_USER/E2E_PASS go in .env.local (gitignored), playwright doesn't read env files itself
try {
  process.loadEnvFile(`${web}.env.local`);
} catch {
  // no .env.local, run without the logged in project
}

const port = 4173;
const hasAuth = !!(process.env.E2E_USER && process.env.E2E_PASS);

export default defineConfig({
  testDir: '.',
  outputDir: `${web}test-results`,
  // keep snapshots platform independent so they can be shared between dev machines and CI
  snapshotPathTemplate: '{testDir}/__snapshots__/{arg}{ext}',
  timeout: 90000,
  retries: 1,
  fullyParallel: true,
  // apitest gets slow under load, which makes pages time out and skip calls
  workers: 3,
  reporter: process.env.CI
    ? [
        ['github'],
        ['html', { open: 'never', outputFolder: `${web}playwright-report` }],
      ]
    : 'list',
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'retain-on-failure',
    // pages with copy buttons
    permissions: ['clipboard-read', 'clipboard-write'],
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
              storageState: `${web}e2e/.auth/user.json`,
            },
          },
        ]
      : []),
  ],
  webServer: {
    command: `yarn build --mode test && yarn serve --port ${port} --strictPort`,
    cwd: web,
    port,
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
  },
});
