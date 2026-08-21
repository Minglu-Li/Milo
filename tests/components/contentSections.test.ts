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

function mountWithLocale(component: object, content: SiteContent) {
  const controller = createLocaleController({ content, storage: null, languages: ['en-US'], document })
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
