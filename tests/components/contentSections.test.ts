import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import App from '../../src/App.vue'
import CapabilitiesSection from '../../src/components/CapabilitiesSection.vue'
import ContactSection from '../../src/components/ContactSection.vue'
import ExperienceSection from '../../src/components/ExperienceSection.vue'
import InterestsSection from '../../src/components/InterestsSection.vue'
import NotesSection from '../../src/components/NotesSection.vue'
import PersonalCard from '../../src/components/PersonalCard.vue'
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

function mountProductionApp(languages: readonly string[] = ['en-US']) {
  const controller = createLocaleController({ content: siteContent, storage: null, languages, document })
  return mount(App, { global: { provide: { [localeKey as symbol]: controller } } })
}

describe('content sections', () => {
  it('renders a complete bilingual personal card with profile links', () => {
    const content = makeContent({
      location: { zh: '上海', en: 'Shanghai' },
      status: { zh: '寻找 AI 应用机会', en: 'Open to AI product roles' },
    })
    const card = mountWithLocale(PersonalCard, content)

    expect(card.get('[data-testid="personal-card"]').text()).toContain('Shanghai')
    expect(card.text()).toContain('Open to AI product roles')
    expect(card.get('a[href="mailto:milo@example.com"]').exists()).toBe(true)
    expect(card.get('a[href="https://github.com/Minglu-Li"]').attributes('target')).toBe('_blank')
    expect(card.get('a[href="/resume-en.pdf"]').text()).toContain('View resume')
  })

  it('renders localized notes and interests with configured media', () => {
    const content = makeContent({
      posts: [{
        id: 'first-note',
        title: { zh: '第一篇文章', en: 'First note' },
        excerpt: { zh: '中文摘要', en: 'English excerpt' },
        date: '2026-11-06',
        tags: ['AI', 'Build'],
        href: 'https://example.com/first-note',
        image: '/notes/first-note.png',
      }],
      interests: [{
        id: 'cycling',
        title: { zh: '骑行', en: 'Cycling' },
        description: { zh: '沿江骑行', en: 'Riding by the river' },
        tags: ['weekend'],
        href: 'https://example.com/cycling',
        image: '/interests/cycling.png',
      }],
    })

    const notes = mountWithLocale(NotesSection, content)
    const interests = mountWithLocale(InterestsSection, content)

    expect(notes.get('#notes').text()).toContain('First note')
    expect(notes.get('img').attributes('src')).toBe('/notes/first-note.png')
    expect(notes.get('a[href="https://example.com/first-note"]').attributes('rel')).toBe('noreferrer')
    expect(interests.get('#interests').text()).toContain('Cycling')
    expect(interests.get('img').attributes('src')).toBe('/interests/cycling.png')
    expect(interests.get('a[href="https://example.com/cycling"]').attributes('target')).toBe('_blank')
  })

  it('falls back to a readable card surface when optional media fails', async () => {
    const content = makeContent({
      posts: [{ id: 'broken-note', title: { zh: '文章', en: 'Broken note' }, excerpt: { zh: '摘要', en: 'Excerpt' }, date: '2026-11-06', tags: [], image: '/missing-note.png' }],
      interests: [{ id: 'broken-interest', title: { zh: '兴趣', en: 'Broken interest' }, description: { zh: '描述', en: 'Description' }, tags: [], image: '/missing-interest.png' }],
    })
    const notes = mountWithLocale(NotesSection, content)
    const interests = mountWithLocale(InterestsSection, content)

    await notes.get('img').trigger('error')
    await interests.get('img').trigger('error')
    expect(notes.get('[data-testid="note-image-fallback"]').text()).toContain('Broken note')
    expect(interests.get('[data-testid="interest-image-fallback"]').text()).toContain('Broken interest')
  })

  it('does not render an empty profile metadata landmark', () => {
    const card = mountWithLocale(PersonalCard, makeContent())
    expect(card.find('.personal-card__meta').exists()).toBe(false)
  })

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

  it('supports a compact internship list without detailed evidence', () => {
    const experience = mountWithLocale(ExperienceSection, makeContent(), ['zh-CN'])
    const compact = mount(ExperienceSection, {
      props: { content: makeContent(), compact: true },
      global: { provide: { [localeKey as symbol]: createLocaleController({ content: makeContent(), storage: null, languages: ['zh-CN'], document }) } },
    })

    expect(experience.get('.experience-card__achievements').exists()).toBe(true)
    expect(compact.find('.experience-card__summary').exists()).toBe(false)
    expect(compact.find('.experience-card__stack').exists()).toBe(false)
    expect(compact.find('.experience-card__achievements').exists()).toBe(false)
  })

  it('presents an experience technology stack as labelled tags', () => {
    const experience = mountWithLocale(ExperienceSection, makeContent())

    expect(experience.get('[data-testid=experience-technologies]').attributes('aria-label')).toBe('Tech stack')
    expect(experience.findAll('[data-testid=experience-technologies] li').map((tag) => tag.text())).toEqual([
      'Java',
      'Vue',
      'MySQL',
    ])
  })

  it('renders only the public Bosch internship summary in both languages', () => {
    const english = mountProductionApp()
    const chinese = mountProductionApp(['zh-CN'])
    const englishBosch = english.get('.experience-section__timeline > li:nth-child(1) .experience-card')
    const chineseBosch = chinese.get('.experience-section__timeline > li:nth-child(1) .experience-card')

    expect(englishBosch.text()).toContain('Bosch')
    expect(englishBosch.text()).toContain('Digital Manufacturing & Intelligent Strategy Intern')
    expect(englishBosch.text()).toContain('Jun 2026 – Sep 2026')
    expect(englishBosch.find('.experience-card__summary').exists()).toBe(false)
    expect(englishBosch.find('.experience-card__achievements').exists()).toBe(false)
    expect(englishBosch.find('[data-testid=experience-technologies]').exists()).toBe(false)
    expect(englishBosch.get('[data-testid=experience-logo]').attributes('src')).toBe('/logos/companies/Bosch-logo.svg')

    expect(chineseBosch.text()).toContain('博世')
    expect(chineseBosch.text()).toContain('数字制造与智能化战略实习生')
    expect(chineseBosch.text()).toContain('2026.06 – 2026.09')
    expect(chineseBosch.find('.experience-card__summary').exists()).toBe(false)
    expect(chineseBosch.find('.experience-card__achievements').exists()).toBe(false)
  })

  it('renders the Digiwin AI application internship below Bosch in both languages', () => {
    const english = mountProductionApp()
    const chinese = mountProductionApp(['zh-CN'])

    expect(english.findAll('.experience-card')).toHaveLength(2)
    expect(chinese.findAll('.experience-card')).toHaveLength(2)

    const englishDigiwin = english.get('.experience-section__timeline > li:nth-child(2) .experience-card')
    const chineseDigiwin = chinese.get('.experience-section__timeline > li:nth-child(2) .experience-card')

    expect(englishDigiwin.text()).toContain('Digiwin')
    expect(englishDigiwin.text()).toContain('AI Application Development Intern')
    expect(englishDigiwin.text()).toContain('Sep 2025 – May 2026')
    expect(englishDigiwin.find('.experience-card__summary').exists()).toBe(false)
    expect(englishDigiwin.find('.experience-card__achievements').exists()).toBe(false)
    expect(englishDigiwin.find('[data-testid=experience-technologies]').exists()).toBe(false)
    expect(englishDigiwin.get('[data-testid=experience-logo]').attributes('src')).toBe('/logos/companies/digiwin.svg')
    expect(englishDigiwin.get('[data-testid=experience-logo]').attributes('alt')).toBe('Digiwin logo')

    expect(chineseDigiwin.text()).toContain('鼎捷数智')
    expect(chineseDigiwin.text()).toContain('AI 应用开发实习生')
    expect(chineseDigiwin.text()).toContain('2025.09 – 2026.05')
    expect(chineseDigiwin.find('.experience-card__summary').exists()).toBe(false)
    expect(chineseDigiwin.find('.experience-card__achievements').exists()).toBe(false)
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
    expect(contact.get('a[href="mailto:milo@example.com"]').text()).toBe('Email me')
    expect(contact.find('a[href="https://github.com/Minglu-Li"]').exists()).toBe(false)
    expect(contact.find('a[href="/resume-en.pdf"]').exists()).toBe(false)
  })

  it('omits absent email and safely encodes email URI delimiters', () => {
    const absentEmail = mountWithLocale(ContactSection, makeContent({ email: undefined }))
    const specialEmail = 'milo+jobs?priority#inbox@example.com'
    const encodedEmail = mountWithLocale(ContactSection, makeContent({ email: specialEmail }))

    expect(absentEmail.find('a[href^="mailto:"]').exists()).toBe(false)
    expect(encodedEmail.get('a[href="mailto:milo%2Bjobs%3Fpriority%23inbox@example.com"]').text()).toBe('Email me')
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

  it('shows the production experience while keeping unavailable sections out of the app', () => {
    const controller = createLocaleController({ content: siteContent, storage: null, languages: ['en-US'], document })
    const app = mount(App, { global: { provide: { [localeKey as symbol]: controller } } })

    expect(app.find('#projects').exists()).toBe(false)
    expect(app.find('#experience').exists()).toBe(true)
    expect(app.find('#contact').exists()).toBe(false)
    expect(app.find('#notes').exists()).toBe(true)
    expect(app.find('#interests').exists()).toBe(false)
    expect(app.find('#capabilities').exists()).toBe(true)
  })
})
