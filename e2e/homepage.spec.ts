import { AxeBuilder } from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('applies the editorial palette to visible page surfaces', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(247, 243, 236)')
  await expect(page.locator('body')).toHaveCSS('color', 'rgb(37, 35, 31)')
  await expect(page.locator('.hero')).toHaveCSS('background-color', 'rgb(239, 232, 220)')
  await expect(page.locator('[data-testid="primary-cta"]')).toHaveCSS('background-color', 'rgb(168, 77, 56)')
  await expect(page.locator('[data-testid="primary-cta"]')).toHaveCSS('color', 'rgb(247, 243, 236)')
  await expect(page.locator('.personal-card')).toHaveCSS('background-color', 'rgb(255, 253, 248)')
  await expect(page.locator('.build-trace')).toHaveCount(0)
})

test('leads with the personal card and keeps the process strip out of the homepage flow', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('.hero > .personal-card')).toHaveCount(1)
  await expect(page.locator('.hero > .hero__copy')).toHaveCount(1)
  await expect(page.locator('.build-trace')).toHaveCount(0)
})

test('avoids an orphan line in the desktop Chinese hero heading', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === 'mobile', 'The mobile layout intentionally wraps the headline more freely.')
  await page.addInitScript(() => localStorage.setItem('milo.locale', 'zh'))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto('/')
  await page.evaluate(() => document.fonts.ready)

  const lines = await page.locator('h1').evaluate((heading) => {
    const style = getComputedStyle(heading)
    return Math.round(heading.getBoundingClientRect().height / Number.parseFloat(style.lineHeight))
  })
  expect(lines).toBeLessThanOrEqual(2)
})

test('keeps navigation visible while the page scrolls', async ({ page }) => {
  await page.goto('/')

  await expect(page.locator('[data-testid="site-header"]')).toHaveCSS('position', 'sticky')
  await expect(page.locator('[data-testid="site-header"]')).toHaveCSS('top', '0px')
})

test('stacks hero actions across the mobile breakpoint', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  const actionsWidth = await page.locator('.hero__actions').evaluate((element) => element.getBoundingClientRect().width)
  for (const action of await page.locator('.hero__action').all()) {
    const actionWidth = await action.evaluate((element) => element.getBoundingClientRect().width)
    expect(Math.abs(actionsWidth - actionWidth)).toBeLessThanOrEqual(1)
  }
})

test('presents the company logo without a surrounding module plate', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    const fixture = document.createElement('div')
    fixture.dataset.testid = 'logo-module-fixture'
    fixture.innerHTML = `
      <div class="project-card__title">
        <img class="project-card__logo" alt="" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>" />
        <h3>Project</h3>
      </div>
      <header class="experience-card__header">
        <img class="experience-card__logo" alt="" src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'/>" />
        <div class="experience-card__heading"><h3>Role</h3></div>
      </header>
    `
    document.body.append(fixture)
  })

  const fixture = page.getByTestId('logo-module-fixture')
  await expect(fixture.locator('.project-card__title')).toHaveCSS('display', 'flex')
  await expect(fixture.locator('.experience-card__header')).toHaveCSS('display', 'flex')
  await expect(fixture.locator('.project-card__logo')).toHaveCSS('width', '48px')
  await expect(fixture.locator('.project-card__logo')).toHaveCSS('height', '48px')
  await expect(fixture.locator('.experience-card__logo')).toHaveCSS('width', '136px')
  await expect(fixture.locator('.experience-card__logo')).toHaveCSS('height', '56px')
  await expect(fixture.locator('.project-card__logo')).toHaveCSS('object-fit', 'contain')
  await expect(fixture.locator('.experience-card__logo')).toHaveCSS('object-fit', 'contain')
  await expect(fixture.locator('.experience-card__logo')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  await expect(fixture.locator('.experience-card__logo')).toHaveCSS('border-top-style', 'none')
  await expect(fixture.locator('.experience-card__logo')).toHaveCSS('border-radius', '0px')
  await expect(fixture.locator('.experience-card__logo')).toHaveCSS('padding', '0px')
})

test('gives future project links a 44px pointer target', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => {
    const links = document.createElement('p')
    links.className = 'project-card__links'
    links.innerHTML = '<a href="#main-content">Repository</a><a href="#main-content">Demo</a>'
    document.body.append(links)
  })

  for (const link of await page.locator('.project-card__links a').all()) {
    const height = await link.evaluate((element) => element.getBoundingClientRect().height)
    expect(height).toBeGreaterThanOrEqual(44)
  }
})
test('uses a focus indicator with at least three-to-one contrast on the hero surface', async ({ page }) => {
  await page.goto('/')
  const action = page.locator('[data-testid="primary-cta"]')
  await action.focus()

  const colors = await action.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      outline: style.outlineColor,
      surface: getComputedStyle(element.closest('.hero') as Element).backgroundColor,
    }
  })

  function luminance(color: string): number {
    const channels = color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? []
    const linear = channels.map((channel) => {
      const value = channel / 255
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    })
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2]
  }

  const lighter = Math.max(luminance(colors.outline), luminance(colors.surface))
  const darker = Math.min(luminance(colors.outline), luminance(colors.surface))
  expect((lighter + 0.05) / (darker + 0.05)).toBeGreaterThanOrEqual(3)
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

  test('keeps the editorial hero usable without motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')

    await expect(page.locator('.personal-card')).toBeVisible()
    await expect(page.locator('.hero__copy')).toBeVisible()
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
  await expect(page.locator('#capabilities')).toContainText('Reinforcement Learning')
  await expect(page.locator('#capabilities')).not.toContainText('强化学习')
  await expect(page).toHaveTitle('Milo')
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Milo is a full-stack developer/)
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Milo')
})

test('operates the mobile menu and locale switch with the keyboard', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('milo.locale', 'zh'))
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(page.locator('[data-testid="menu-button"]')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('[data-testid="menu-button"]')).toHaveAttribute('aria-expanded', 'true')

  await page.keyboard.press('Tab')
  await expect(page.locator('.site-header__links a[href="#main-content"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('a[href="#about"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('a[href="#experience"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('a[href="#notes"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.locator('a[href="#capabilities"]')).toBeFocused()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Tab')
  await expect(page.locator('.site-header__locale')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
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
