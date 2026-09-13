import { test, expect } from '@playwright/test';
import { gotoPage, expectPageRendered, expectComponent, HOME_LIST_ITEMS } from './helpers';

/**
 * Baseline smoke test for the Metro UI showcase.
 *
 * Visits every showcase page and asserts it renders without crashing, then
 * exercises a few interactive behaviors. This is the regression baseline:
 * it must pass identically before and after the production-readiness refactor.
 */

// pageName -> component root class to assert is present.
const PAGES: [string, string][] = [
  ['Button', '.metro-button'],
  ['ToggleSwitch', '.metro-toggle'],
  ['RatingControl', '.metro-rating'],
  ['PhoneTextBox', '.metro-textbox'],
  ['WrapPanel', '.metro-wrappanel'],
  ['ListPicker', '.metro-listpicker'],
  ['AutoCompleteBox', '.metro-autocomplete'],
  ['ExpanderView', '.metro-expander'],
  // CustomMessageBox is hidden by default; handled in its own test below.
  // ['CustomMessageBox (todo)', '.metro-messagebox'],
  ['ContextMenu', '.metro-contextmenu__host'],
  ['DateTimePickers (todo)', '.metro-datetime'],
  ['MultiselectList', '.metro-multiselect'],
  ['LongListMultiSelector (todo)', '.metro-llms'],
  ['HubTile', '.metro-hubtile'],
  ['Tile', '.metro-tile'],
  ['Pivot', '.metro-pivot'],
  ['Effects', '.metro-tilt'],
  ['AppBar', '.metro-appbar'],
  ['PageTransition', '.metro-flip'],
  ['SPA Demo', '.metro-appbar'],
  ['Settings', '.metro-toggle'],
];

for (const [name, rootClass] of PAGES) {
  test(`renders ${name} page`, async ({ page }) => {
    await gotoPage(page, name);
    await expectPageRendered(page);
    await expectComponent(page, rootClass);
  });
}

test('Icons page renders (lazy-loaded)', async ({ page }) => {
  await gotoPage(page, 'Icons');
  await expectPageRendered(page);
  // The icon browser is lazy-loaded; wait for it to appear.
  await expect(page.locator('.icon-browser').first()).toBeVisible({ timeout: 15000 });
});

test('CustomMessageBox: opens on button click', async ({ page }) => {
  await gotoPage(page, 'CustomMessageBox (todo)');
  await expectPageRendered(page);
  // Hidden by default.
  await expect(page.locator('.metro-messagebox')).toHaveCount(0);
  await page.locator('.metro-button', { hasText: 'Show message box' }).click();
  await expect(page.locator('.metro-messagebox')).toBeVisible();
  await expect(page.locator('.metro-messagebox__title')).toHaveText('Confirm');
});

test('ContextMenu: opens on right-click', async ({ page }) => {
  await gotoPage(page, 'ContextMenu');
  await expectPageRendered(page);
  const target = page.locator('.showcase__context-target');
  await target.click({ button: 'right' });
  await expect(page.locator('.metro-contextmenu')).toBeVisible();
  await expect(page.locator('.metro-contextmenu__item', { hasText: 'Copy' })).toBeVisible();
});

test('Button: click works and disabled button is inert', async ({ page }) => {
  await gotoPage(page, 'Button');
  const ok = page.locator('.metro-button', { hasText: 'OK' });
  await ok.click();
  await expect(ok).toBeVisible();

  const disabled = page.locator('.metro-button:disabled', { hasText: 'Disabled' }).first();
  await expect(disabled).toBeDisabled();
});

test('ToggleSwitch: toggles checked state', async ({ page }) => {
  await gotoPage(page, 'ToggleSwitch');
  // "Wi-Fi" is a controlled switch, initially off.
  const wifi = page.locator('.metro-toggle', { hasText: 'Wi-Fi' });
  await expect(wifi).toHaveAttribute('data-checked', 'false');
  await wifi.locator('.metro-toggle__label').click();
  await expect(wifi).toHaveAttribute('data-checked', 'true');
});

test('ListPicker: opens and selects an option', async ({ page }) => {
  await gotoPage(page, 'ListPicker');
  const trigger = page.locator('.metro-listpicker__trigger').first();
  await trigger.click();
  const option = page.locator('.metro-listpicker__option', { hasText: 'Orange' }).first();
  await expect(option).toBeVisible();
  await option.click();
  // After selection the trigger shows the chosen value.
  await expect(page.locator('.metro-listpicker__value', { hasText: 'Orange' }).first()).toBeVisible();
});

test('Settings: switching accent color applies instantly', async ({ page }) => {
  await gotoPage(page, 'Settings');
  const redSwatch = page.locator('.showcase__accent-swatch[aria-label="Red"]');
  await redSwatch.click();
  await expect(page.locator('.showcase__demo-hint', { hasText: '#e51400' })).toBeVisible();
});

test('Home page renders all nav items', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.showcase__hero-title')).toHaveText('Metro UI Toolkit');
  await expect(page.locator(HOME_LIST_ITEMS)).toHaveCount(22);
});