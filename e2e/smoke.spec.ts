import { test, expect } from '@playwright/test';

test.describe('Vitals Dashboard Smoke Tests', () => {
  let pageErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    pageErrors = [];
    // Listen for page errors
    page.on('pageerror', (error) => {
      pageErrors.push(`Page error: ${error.message}`);
    });
  });

  test.afterEach(async () => {
    // Check for page errors after each test
    expect(pageErrors).toHaveLength(0);
  });

  test('home dashboard loads without errors', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for no application error
    await expect(page.locator('text=Application error')).not.toBeVisible();
    
    // Verify expected content is visible
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('medications page loads without errors', async ({ page }) => {
    await page.goto('/medications');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Application error')).not.toBeVisible();
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('labs page loads without errors', async ({ page }) => {
    await page.goto('/labs');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Application error')).not.toBeVisible();
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('genetics page loads without errors', async ({ page }) => {
    await page.goto('/genetics');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Application error')).not.toBeVisible();
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('providers page loads without errors', async ({ page }) => {
    await page.goto('/providers');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Application error')).not.toBeVisible();
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('wearables page loads without errors', async ({ page }) => {
    await page.goto('/wearables');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Application error')).not.toBeVisible();
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('wearables sleep page loads without errors', async ({ page }) => {
    await page.goto('/wearables/sleep');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Application error')).not.toBeVisible();
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('wearables activity page loads without errors', async ({ page }) => {
    await page.goto('/wearables/activity');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('text=Application error')).not.toBeVisible();
    await expect(page.locator('h1, h2').first()).toBeVisible();
  });

  test('lab detail pages for recent dates load without errors', async ({ request, page }) => {
    // Get lab dates from API
    const agentKey = process.env.VITALS_AGENT_KEY;
    if (!agentKey) {
      throw new Error('VITALS_AGENT_KEY environment variable is required');
    }

    const response = await request.get('/api/labs', {
      headers: {
        'Authorization': `Bearer ${agentKey}`
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const labData = await response.json();
    
    // Get first 3 lab dates for testing
    const labDates = Array.isArray(labData) ? labData.slice(0, 3) : 
                     labData.dates ? labData.dates.slice(0, 3) : 
                     [];

    if (labDates.length === 0) {
      console.warn('No lab dates found, skipping lab detail page tests');
      return;
    }

    for (const dateEntry of labDates) {
      const date = typeof dateEntry === 'string' ? dateEntry : dateEntry.date || dateEntry.collected_date;
      if (date) {
        await page.goto(`/labs/${date}`);
        await page.waitForLoadState('networkidle');
        
        await expect(page.locator('text=Application error')).not.toBeVisible();
        await expect(page.locator('h1, h2').first()).toBeVisible();
      }
    }
  });
});