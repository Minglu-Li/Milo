import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from '../../src/App.vue'
import CapabilitiesSection from '../../src/components/CapabilitiesSection.vue'
import ContactSection from '../../src/components/ContactSection.vue'
import ExperienceSection from '../../src/components/ExperienceSection.vue'
import ProjectsSection from '../../src/components/ProjectsSection.vue'
import { createLocaleController, localeKey } from '../../src/composables/useLocale'
import { siteContent } from '../../src/content/profile'
import type { SiteContent } from '../../src/content/types'
import { makeContent } from '../fixtures/content'

function mountWithLocale(component: object, content: SiteContent, languages: readonly string[] = ['en-US']) {
  const controller = createLocaleController({ content, storage: null, languages, document })
  return mount(component, {
    props: { content },
    global: { provide: { [localeKey as symbol]: controller } },
  })
}

describe('content sections', () => {
  it('renders configured projects with safe repository links', () => {
    const projects = mountWithLocale(ProjectsSection, makeContent())

    expect(projects.get('section').attributes('id')).toBe('projects')
    expect(projects.text()).toContain('Agent Research Assistant')
    expect(projects.findAll('[data-testid="project-card"]')).toHaveLength(1)
    expect(projects.get('a[href="https://github.com/Minglu-Li/example-agent"]').attributes('rel')).toBe('noreferrer')
    expect(projects.get('a[href="https://github.com/Minglu-Li/example-agent"]').attributes('target')).toBe('_blank')
  })

  it('renders configured experience as timeline articles', () => {
    const experience = mountWithLocale(ExperienceSection, makeContent())

    expect(experience.get('section').attributes('id')).toBe('experience')
    expect(experience.findAll('article')).toHaveLength(1)
    expect(experience.text()).toContain('Software Engineering Intern')
  })

  it('renders confirmed capability groups as lists', () => {
    const capabilities = mountWithLocale(CapabilitiesSection, makeContent())

    expect(capabilities.findAll('[data-testid="capability-group"]')).toHaveLength(3)
    expect(capabilities.text()).toContain('AI Agent')
  })

  it('renders configured contact routes', () => {
    const contact = mountWithLocale(ContactSection, makeContent())

    expect(contact.get('a[href="mailto:milo@example.com"]').exists()).toBe(true)
    expect(contact.get('a[href="mailto:milo@example.com"]').text()).toBe('milo@example.com')
    expect(contact.get('a[href="https://github.com/Minglu-Li"]').attributes('target')).toBe('_blank')
    expect(contact.get('a[href="https://github.com/Minglu-Li"]').attributes('rel')).toBe('noreferrer')
  })

  it('omits absent email and safely encodes email URI delimiters', () => {
    const absentEmail = mountWithLocale(ContactSection, makeContent({ email: undefined }))
    const specialEmail = 'milo+jobs?priority#inbox@example.com'
    const encodedEmail = mountWithLocale(ContactSection, makeContent({ email: specialEmail }))

    expect(absentEmail.find('a[href^="mailto:"]').exists()).toBe(false)
    expect(encodedEmail.get('a[href="mailto:milo%2Bjobs%3Fpriority%23inbox@example.com"]').text()).toBe(specialEmail)
  })

  it('exposes configured project images and restores the decorative fallback on error', async () => {
    const projects = mountWithLocale(ProjectsSection, makeContent({
      projects: [{ ...makeContent().projects[0], image: '/project-cover.png' }],
    }))

    expect(projects.get('img').attributes('alt')).toBe('Agent Research Assistant')
    expect(projects.find('[data-testid="project-blueprint"]').exists()).toBe(false)

    await projects.get('img').trigger('error')

    expect(projects.find('img').exists()).toBe(false)
    expect(projects.get('[data-testid="project-blueprint"]').attributes('aria-hidden')).toBe('true')
  })

  it('renders project content in Chinese when Chinese is selected', () => {
    const projects = mountWithLocale(ProjectsSection, makeContent(), ['zh-CN'])

    expect(projects.text()).toContain('Agent 研究助手')
  })

  it('keeps fixture-only sections out of the production app while retaining capabilities', () => {
    const controller = createLocaleController({ content: siteContent, storage: null, languages: ['en-US'], document })
    const app = mount(App, { global: { provide: { [localeKey as symbol]: controller } } })

    expect(app.find('#projects').exists()).toBe(false)
    expect(app.find('#experience').exists()).toBe(false)
    expect(app.find('#contact').exists()).toBe(false)
    expect(app.find('#capabilities').exists()).toBe(true)
  })
})
