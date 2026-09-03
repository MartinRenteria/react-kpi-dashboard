import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Dashboard Accessibility Compliance Gate', () => {
    test('should not contain any critical WCAG violations on landing view', async ({ page }) => {
        // Navigate to the local server port running your Next.js project
        await page.goto('http://localhost:3000');

        // Inject and execute the axe evaluation matrix
        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        // Enforce that your pipeline fails completely if an engineer pushes an inaccessible change
        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
