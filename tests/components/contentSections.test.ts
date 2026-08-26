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

  it('renders project and company logos with localized alternative text', () => {
    const base = makeContent()
    const content = makeContent({
      projects: [{ ...base.projects[0], logo: '/logos/projects/agent-assistant.svg' }],
      experiences: [{ ...base.experiences[0], logo: '/logos/companies/example-technology.svg' }],
    })
    const projects = mountWithLocale(ProjectsSection, content)
    const experience = mountWithLocale(ExperienceSection, content)
    const chineseProjects = mountWithLocale(ProjectsSection, content, ['zh-CN'])

    expect(projects.get('[data-testid="project-logo"]').attributes('src')).toBe('/logos/projects/agent-assistant.svg')
    expect(projects.get('[data-testid="project-logo"]').attributes('alt')).toBe('Agent Research Assistant logo')
    expect(experience.get('[data-testid="experience-logo"]').attributes('src')).toBe('/logos/companies/example-technology.svg')
    expect(experience.get('[data-testid="experience-logo"]').attributes('alt')).toBe('Example Technology logo')
    expect(chineseProjects.get('[data-testid="project-logo"]').attributes('alt')).toBe('Agent 研究助手 标志')
  })

  it('removes failed logos without removing the card content', async () => {
    const base = makeContent()
    const content = makeContent({
      projects: [{ ...base.projects[0], logo: '/logos/projects/broken.svg' }],
      experiences: [{ ...base.experiences[0], logo: '/logos/companies/broken.svg' }],
    })
    const projects = mountWithLocale(ProjectsSection, content)
    const experience = mountWithLocale(ExperienceSection, content)

    await projects.get('[data-testid="project-logo"]').trigger('error')
    await experience.get('[data-testid="experience-logo"]').trigger('error')

    expect(projects.find('[data-testid="project-logo"]').exists()).toBe(false)
    expect(projects.text()).toContain('Agent Research Assistant')
    expect(experience.find('[data-testid="experience-logo"]').exists()).toBe(false)
    expect(experience.text()).toContain('Software Engineering Intern')
  })

  it('renders confirmed capability groups as lists', () => {
    const capabilities = mountWithLocale(CapabilitiesSection, makeContent())

    expect(capabilities.findAll('[data-testid="capability-group"]')).toHaveLength(3)
    expect(capabilities.text()).toContain('AI Agent')
    expect(capabilities.text()).toContain('Reinforcement Learning')
    expect(capabilities.text()).toContain('Databases')
    expect(capabilities.text()).toContain('Graph Neural Networks')
    expect(capabilities.text()).not.toContain('强化学习')
  })

  it('renders localized capability items in Chinese', () => {
    const capabilities = mountWithLocale(CapabilitiesSection, makeContent(), ['zh-CN'])

    expect(capabilities.text()).toContain('强化学习')
    expect(capabilities.text()).toContain('数据库')
    expect(capabilities.text()).toContain('图神经网络')
    expect(capabilities.text()).not.toContain('Reinforcement Learning')
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
