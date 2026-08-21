import { AxeBuilder } from '@axe-core/playwright'
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

test('passes the serious and critical accessibility audit', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  const results = await new AxeBuilder({ page }).analyze()
  const serious = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''))
  expect(serious).toEqual([])
})

test('switches visible metadata and copy to English', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('milo.locale', 'zh'))
  await page.goto('/')
  const menuButton = page.locator('[data-testid="menu-button"]')
  if (await menuButton.isVisible()) await menuButton.click()
  await page.locator('.site-header__locale').click()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page.locator('h1')).toContainText('I turn complex ideas')
  await expect(page).toHaveTitle(/AI Agent & Full-stack Development/)
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Milo is a full-stack developer/)
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /AI Agent & Full-stack Development/)
})

test('keeps visible links safe and anchored', async ({ page }) => {
  await page.goto('/')
  for (const link of await page.locator('a:visible').all()) {
    const href = await link.getAttribute('href')
    if (!href) continue
    if (href.startsWith('http')) expect(await link.getAttribute('rel')).toContain('noreferrer')
    if (href.startsWith('#')) await expect(page.locator(href)).toHaveCount(1)
  }
})
