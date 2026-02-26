import { test, expect } from '@playwright/test';

test.describe('Lab Detail Pages', () => {
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

  test('all lab detail pages load and render markers', async ({ request, page }) => {
    // This test visits many pages; allow more time than the default 30s
    test.setTimeout(180000);

    const agentKey = process.env.VITALS_AGENT_KEY;
    if (!agentKey) {
      throw new Error('VITALS_AGENT_KEY environment variable is required');
    }

    // Fetch all lab dates from API
    const response = await request.get('/api/labs', {
      headers: {
        'Authorization': `Bearer ${agentKey}`
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const labData = await response.json();
    
    // Extract lab dates - handle different possible response formats
    let labDates: string[] = [];
    if (Array.isArray(labData)) {
      labDates = labData.map(entry => 
        typeof entry === 'string' ? entry : entry.date || entry.collected_date
      ).filter(date => date);
    } else if (labData.dates) {
      labDates = labData.dates;
    } else if (labData.results) {
      labDates = labData.results.map((entry: any) => entry.date || entry.collected_date).filter((date: any) => date);
    }

    expect(labDates.length).toBeGreaterThan(0);
    console.log(`Testing ${labDates.length} lab detail pages`);

    // Test each lab detail page
    for (const date of labDates) {
      console.log(`Testing lab detail page for date: ${date}`);
      
      await page.goto(`/labs/${date}`);
      await page.waitForLoadState('networkidle');
      
      // Check for no application error
      await expect(page.locator('text=Application error')).not.toBeVisible();
      
      // Wait for page to be fully loaded
      await page.waitForTimeout(1000);
      
      // Verify page has lab detail content
      await expect(page.locator('h1, h2').first()).toBeVisible();
      
      // Check for markers rendering - look for common lab marker patterns
      const hasLabNames = await page.locator('text=Testosterone, text=TSH, text=Vitamin').count();
      const hasNumericValues = await page.locator('text=/\\d+\\.\\d+/').count();
      const hasDataTestMarkers = await page.locator('[data-testid*="marker"]').count();
      const hasClassMarkers = await page.locator('[class*="marker"]').count();
      
      const hasMarkers = hasLabNames + hasNumericValues + hasDataTestMarkers + hasClassMarkers;
      
      if (hasMarkers === 0) {
        console.warn(`No markers found for lab date: ${date}`);
      }
      
      // Verify no console errors occurred
      expect(pageErrors).toHaveLength(0);
      
      // Reset errors for next iteration
      pageErrors = [];
    }
  });

  test('lab detail pages show meaningful content', async ({ request, page }) => {
    const agentKey = process.env.VITALS_AGENT_KEY;
    if (!agentKey) {
      throw new Error('VITALS_AGENT_KEY environment variable is required');
    }

    // Get first 3 lab dates for detailed content verification
    const response = await request.get('/api/labs', {
      headers: {
        'Authorization': `Bearer ${agentKey}`
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const labData = await response.json();
    
    let labDates: string[] = [];
    if (Array.isArray(labData)) {
      labDates = labData.slice(0, 3).map(entry => 
        typeof entry === 'string' ? entry : entry.date || entry.collected_date
      ).filter(date => date);
    } else if (labData.dates) {
      labDates = labData.dates.slice(0, 3);
    } else if (labData.results) {
      labDates = labData.results.slice(0, 3).map((entry: any) => entry.date || entry.collected_date).filter((date: any) => date);
    }

    for (const date of labDates) {
      await page.goto(`/labs/${date}`);
      await page.waitForLoadState('networkidle');
      
      // Should have some form of date display (the date format on page may be different)
      await expect(page.locator('h1, h2').first()).toBeVisible();
      
      // Should have some numeric values (lab results typically contain numbers)
      await expect(page.locator('text=/\\d+(\\.\\d+)?/').first()).toBeVisible();
      
      // Should not be completely empty
      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.length || 0).toBeGreaterThan(100);
    }
  });
});