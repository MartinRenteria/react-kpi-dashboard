import { test, expect } from '@playwright/test';

test.describe('Accessibility Quality Assurance: Keyboard & SRX Timeline Simulator', () => {
    test('should simulate full keyboard flow and ensure no focus loops or traps exist', async ({ page }) => {
        const targetUrl = process.env.TEST_URL || 'http://localhost:3000/';
        await page.goto(targetUrl);
        await page.waitForLoadState('networkidle');

        const timelineHistory: Array<{ step: number; accessibleTreeYaml: string; tag: string }> = [];
        const visitedElementIdentifiers = new Set<string>();

        let previousActiveHTML: string | null = null;
        const MAX_STEPS = 40;

        console.log(`Starting Live Screen Reader Experience Simulation for: ${targetUrl}`);

        for (let step = 0; step < MAX_STEPS; step++) {
            await page.keyboard.press('Tab');
            await page.waitForTimeout(80);

            const currentFocus = await page.evaluate(() => {
                const el = document.activeElement;
                if (!el || el === document.body) return null;
                return {
                    tagName: el.tagName.toLowerCase(),
                    id: el.id || '',
                    className: el.className || '',
                    outerHTMLSnippet: el.outerHTML.substring(0, 120)
                };
            });

            if (!currentFocus) {
                console.log(`[Step ${step}]: Focus moved out of navigable document layout.`);
                break;
            }

            if (currentFocus.outerHTMLSnippet === previousActiveHTML) {
                console.error(`\n🚨 KEYBOARD FOCUS TRAP DETECTED at Step ${step}!`);
                throw new Error(`Accessibility Failure: Keyboard focus is completely locked on <${currentFocus.tagName}>.`);
            }

            const elementIdKey = `${currentFocus.tagName}#${currentFocus.id || 'no-id'}[${currentFocus.outerHTMLSnippet}]`;

            if (visitedElementIdentifiers.has(elementIdKey)) {
                console.log(`Infinite Cyclic Loop Closed at Step ${step}. Repetitive keyboard pattern found.`);
                break;
            }

            visitedElementIdentifiers.add(elementIdKey);
            previousActiveHTML = currentFocus.outerHTMLSnippet;

            // 🔥 FIX: Use the new ariaSnapshot API instead of the deleted page.accessibility
            // Passing { mode: 'raw' } or fetching the page layout snapshot yields clean YAML structures.
            const rawAriaYaml = await page.ariaSnapshot();

            const currentRecord = {
                step,
                accessibleTreeYaml: rawAriaYaml || 'No semantic mappings found',
                tag: currentFocus.tagName
            };

            timelineHistory.push(currentRecord);

            // Clean up the string to output a compact terminal summary
            const conciseYamlSummary = currentRecord.accessibleTreeYaml.trim().split('\n').slice(0, 3).join(' | ');
            console.log(` [Step ${step}] Focus: <${currentRecord.tag}> ──► Tree Segment: ${conciseYamlSummary}`);
        }

        expect(timelineHistory.length).toBeGreaterThan(0);
        console.log(`SRX Timeline Exported: Checked ${timelineHistory.length} unique elements successfully.`);
    });
});
