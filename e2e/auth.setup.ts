import { test as setup, expect } from '@playwright/test';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ request }) => {
  const password = process.env.VITALS_PASSWORD;
  
  if (!password) {
    throw new Error('VITALS_PASSWORD environment variable is required');
  }

  // Perform authentication request
  const response = await request.post('/api/auth', {
    data: {
      password: password
    }
  });

  expect(response.ok()).toBeTruthy();

  // Save the authentication state to file
  await request.storageState({ path: authFile });
});