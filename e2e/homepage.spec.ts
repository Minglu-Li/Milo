import { expect, test } from '@playwright/test'

test('applies the approved palette to visible page surfaces', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(251, 252, 255)')
  await expect(page.locator('body')).toHaveCSS('color', 'rgb(20, 33, 61)')
  await expect(page.locator('.hero')).toHaveCSS('background-color', 'rgb(238, 244, 255)')
  await expect(page.locator('[data-testid="primary-cta"]')).toHaveCSS('background-color', 'rgb(36, 95, 212)')
  await expect(page.locator('[data-testid="primary-cta"]')).toHaveCSS('color', 'rgb(251, 252, 255)')
  await expect(page.locator('.build-trace')).toHaveCSS('background-color', 'rgb(20, 33, 61)')
  await expect(page.locator('.build-trace')).toHaveCSS('color', 'rgb(251, 252, 255)')
})

test('never overflows at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/')

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test('moves keyboard focus from the skip link to main content', async ({ page }) => {
  await page.goto('/')

  await page.keyboard.press('Tab')
  await expect(page.locator('.skip-link')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('#main-content')).toBeFocused()
})

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('disables the signature animation', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    await expect(page.locator('[data-testid="build-step"]').first()).toHaveCSS('animation-name', 'none')
  })
})
