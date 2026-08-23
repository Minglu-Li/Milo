import { mount } from '@vue/test-utils'
import { computed, defineComponent, h, nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import App from '../../src/App.vue'
import BuildTrace from '../../src/components/BuildTrace.vue'
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
          h(BuildTrace, { steps: content.buildSteps }),
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
    expect(wrapper.find('[data-testid="portrait-fallback"]').text()).toBe('ML')
    expect(wrapper.findAll('[data-testid="build-step"]')).toHaveLength(4)
  })

  it('shows project navigation and a project CTA when curated work is available', () => {
    const wrapper = mountShell(makeContent())

    expect(wrapper.find('a[href="#projects"]').exists()).toBe(true)
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

    expect(wrapper.get('a[href="mailto:milo%2Bjobs%3Fpriority%23inbox@example.com"]').text()).toContain('邮件')
  })
  it('shows initials after a configured portrait fails to load', async () => {
    const wrapper = mountShell(makeContent({ avatar: '/broken.png' }))

    await wrapper.get('img').trigger('error')
    await nextTick()

    expect(wrapper.get('[data-testid="portrait-fallback"]').text()).toBe('ML')
  })
})
