import { expect, type Page } from '@playwright/test';

/**
 * Shared helpers for the Metro UI showcase E2E tests.
 *
 * The showcase uses animated components (tiles, app bar, flip transitions)
 * that never reach a "stable" state for Playwright's default click/hover
 * waiting. These helpers work around that by dispatching synthetic events
 * directly, as documented in the repo memory.
 */

/** The showcase home page list items (buttons). */
export const HOME_LIST_ITEMS = '.showcase__listitem';

/**
 * Navigate to a showcase page by dispatching a click on its home-list item.
 * Uses `dispatchEvent` because the list items are never "stable" for a normal
 * Playwright click (persistent animations / transitions).
 */
export async function gotoPage(page: Page, pageName: string) {
  await page.goto('/');
  // Match the exact page name (the list item's first span is the name).
  const item = page
    .locator(HOME_LIST_ITEMS)
    .filter({ has: page.locator('.showcase__listitem-header', { hasText: new RegExp(`^${escapeRegex(pageName)}$`) }) });
  await item.dispatchEvent('click');
  // The FlipTransition animates the page in; wait for the page title to appear.
  await expect(page.locator('.showcase__pagetitle')).toHaveText(pageName, { timeout: 5000 });
}

/** Escape regex special characters in a literal string. */
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Assert the page rendered without crashing (no error text, page content present). */
export async function expectPageRendered(page: Page) {
  await expect(page.locator('.showcase__page-content')).toBeVisible();
}

/** Assert a component root with the given class is present on the page. */
export async function expectComponent(page: Page, className: string) {
  await expect(page.locator(className).first()).toBeVisible();
}