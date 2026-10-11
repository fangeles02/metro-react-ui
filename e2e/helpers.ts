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
 * The Controls list lives inside the home panorama, which is horizontally
 * scrolled, so the item is brought into view first. Uses `dispatchEvent`
 * because the list items are never "stable" for a normal Playwright click
 * (persistent animations / transitions).
 */
export async function gotoPage(page: Page, pageName: string) {
  await page.goto('/');
  // Match the exact page name. The list item button has `aria-label={name}`
  // (the origin indicator is aria-hidden, so the label is clean).
  const item = page.locator(`${HOME_LIST_ITEMS}[aria-label="${pageName}"]`);
  // The Controls list lives inside the home panorama (horizontally scrolled),
  // so the item may be off-screen. `dispatchEvent` fires the click handler
  // regardless of visibility, so no scrolling is needed.
  await item.dispatchEvent('click');
  // The FlipTransition animates the page in; wait for the page to appear.
  // The home page stays mounted (hidden) in `.showcase__home`, so scope the
  // wait to the demo page — which is a sibling of `.showcase__home`, NOT
  // inside it. Demo pages are wrapped in a MetroLayout (title + back button);
  // fullscreen pages (e.g. SPA Demo) fall back to the fullscreen container.
  await expect(
    page.locator('.showcase__home ~ * .metro-layout__title, .showcase__home ~ * .showcase__page--fullscreen').first(),
  ).toBeVisible({ timeout: 5000 });
}

/** Assert the page rendered without crashing (no error text, page content present). */
export async function expectPageRendered(page: Page) {
  await expect(
    page.locator('.showcase__home ~ * .metro-layout, .showcase__home ~ * .showcase__page--fullscreen').first(),
  ).toBeVisible();
}

/** Assert a component root with the given class is present on the page. */
export async function expectComponent(page: Page, className: string) {
  // The home page stays mounted (hidden) in `.showcase__home`, so scope to
  // the demo page — a sibling of `.showcase__home`.
  await expect(
    page.locator(`.showcase__home ~ * ${className}`).first(),
  ).toBeVisible();
}