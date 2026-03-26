import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://127.0.0.1:3001',
    headless: true,
  },
  webServer: [
    {
      command: 'dotnet run --project ../albums-api/albums-api.csproj --launch-profile http',
      port: 3000,
      reuseExistingServer: true,
      timeout: 30_000,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1',
      port: 3001,
      reuseExistingServer: true,
      timeout: 30_000,
    },
  ],
})