import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import App from '../../src/App.vue'
import HeroSection from '../../src/components/HeroSection.vue'
import SiteHeader from '../../src/components/SiteHeader.vue'
import { createLocaleController, localeKey } from '../../src/composables/useLocale'
import { deriveVisibility } from '../../src/content/selectors'
import { siteContent } from '../../src/content/profile'
import type { SiteContent } from '../../src/content/types'
import { makeContent } from '../fixtures/content'

function createController(content: SiteContent) {
  return createLocaleController({ content, storage: null, languages: ['zh-CN'], document })
}

function mountShell(content: SiteContent) {
  const controller = createController(content)
  const Shell = defineComponent({
    setup() {
      const visibility = computed(() => deriveVisibility(content, controller.locale.value))
      return () => h('div', [
        h(SiteHeader, { content, visibility: visibility.value }),
        h('main', { id: 'main-content' }, [
          h(HeroSection, { content }),
        ]),
      ])
    },
  })

  return mount(Shell, { global: { provide: { [localeKey as symbol]: controller } } })
}

describe('application shell', () => {
  it('keeps unavailable production content out of the header and falls back to GitHub', () => {
    const controller = createController(siteContent)
    const wrapper = mount(App, { global: { provide: { [localeKey as symbol]: controller } } })

    expect(wrapper.get('header').attributes('data-testid')).toBe('site-header')
    expect(wrapper.get('main h1').text()).toContain('把复杂想法做成可靠、能用的产品')
    expect(wrapper.get('[data-testid="primary-cta"]').attributes('href')).toBe('https://github.com/Minglu-Li')
    expect(wrapper.find('a[href="#projects"]').exists()).toBe(false)
    expect(wrapper.get('.personal-card__portrait img').attributes('src')).toBe('/portrait.png')
    expect(wrapper.find('[data-testid="portrait-fallback"]').exists()).toBe(false)
    expect(wrapper.find('.build-trace').exists()).toBe(false)
  })

  it('shows project navigation and a project CTA when curated work is available', () => {
    const wrapper = mountShell(makeContent({
      posts: [{
        id: 'first-note',
        title: { zh: '第一篇', en: 'First note' },
        excerpt: { zh: '摘要', en: 'Excerpt' },
        date: '2026-11-06',
        tags: ['AI'],
      }],
      interests: [{
        id: 'cycling',
        title: { zh: '骑行', en: 'Cycling' },
        description: { zh: '描述', en: 'Description' },
        tags: ['life'],
      }],
    }))

    expect(wrapper.find('a[href="#projects"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#notes"]').exists()).toBe(true)
    expect(wrapper.find('a[href="#interests"]').exists()).toBe(true)
    expect(wrapper.get('[data-testid="primary-cta"]').attributes('href')).toBe('#projects')
  })

  it('opens the mobile menu from its accessible control', async () => {
    const wrapper = mountShell(makeContent())
    const menuButton = wrapper.get('[data-testid="menu-button"]')

    expect(menuButton.attributes('aria-expanded')).toBe('false')
    await menuButton.trigger('click')
    expect(menuButton.attributes('aria-expanded')).toBe('true')
  })

  it('safely encodes email URI delimiters in the hero action', () => {
    const specialEmail = 'milo+jobs?priority#inbox@example.com'
    const wrapper = mountShell(makeContent({ email: specialEmail }))

    expect(wrapper.get('a[href="mailto:milo%2Bjobs%3Fpriority%23inbox@example.com"]').text()).toBe(specialEmail)
  })
  it('shows initials after a configured portrait fails to load', async () => {
    const wrapper = mountShell(makeContent({ avatar: '/broken.png' }))

    await wrapper.get('img').trigger('error')
    await nextTick()

    expect(wrapper.get('[data-testid="portrait-fallback"]').text()).toBe('ML')
  })
})
