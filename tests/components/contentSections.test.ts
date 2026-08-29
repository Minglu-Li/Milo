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

function mountProductionApp(languages: readonly string[] = ['en-US']) {
  const controller = createLocaleController({ content: siteContent, storage: null, languages, document })
  return mount(App, { global: { provide: { [localeKey as symbol]: controller } } })
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

  it('presents an experience technology stack as labelled tags', () => {
    const experience = mountWithLocale(ExperienceSection, makeContent())

    expect(experience.get('[data-testid=experience-technologies]').attributes('aria-label')).toBe('Tech stack')
    expect(experience.findAll('[data-testid=experience-technologies] li').map((tag) => tag.text())).toEqual([
      'Java',
      'Vue',
      'MySQL',
    ])
  })

  it('renders the complete Bosch internship evidence in both languages', () => {
    const english = mountProductionApp()
    const chinese = mountProductionApp(['zh-CN'])
    const englishBosch = english.get('.experience-section__timeline > li:nth-child(1) .experience-card')
    const chineseBosch = chinese.get('.experience-section__timeline > li:nth-child(1) .experience-card')

    expect(englishBosch.text()).toContain('Bosch')
    expect(englishBosch.text()).toContain('Digital Manufacturing & Intelligent Strategy Intern')
    expect(englishBosch.text()).toContain('Jun 2026 – Sep 2026')
    expect(englishBosch.text()).toContain('Prototype Order Lifecycle Management System | Sole Full-stack Developer')
    expect(englishBosch.text()).toContain('42 users')
    expect(englishBosch.text()).toContain('300+ TOs')
    expect(englishBosch.text()).toContain('under 5 minutes')
    expect(englishBosch.findAll('.experience-card__achievements > li')).toHaveLength(9)
    expect(englishBosch.findAll('[data-testid=experience-technologies] li').map((tag) => tag.text())).toEqual([
      'Java 8',
      'Spring Boot 2.7',
      'Spring Security',
      'MyBatis-Plus',
      'MySQL',
      'Redis',
      'Apache POI',
      'Vue 3',
      'TypeScript',
      'Pinia',
      'Vite',
      'OAuth 2.0/OIDC',
      'SMTP',
      'Nginx',
      'Linux',
      'systemd',
      'Python',
    ])
    expect(englishBosch.get('[data-testid=experience-logo]').attributes('src')).toBe('/logos/companies/Bosch-logo.svg')

    expect(chineseBosch.text()).toContain('博世')
    expect(chineseBosch.text()).toContain('数字制造与智能化战略实习生')
    expect(chineseBosch.text()).toContain('2026.06 – 2026.09')
    expect(chineseBosch.text()).toContain('试制订单全生命周期管理系统｜独立全栈开发')
    expect(chineseBosch.text()).toContain('42 名用户')
    expect(chineseBosch.text()).toContain('300+ 条 TO 单')
    expect(chineseBosch.text()).toContain('平均 5 分钟内')
    expect(chineseBosch.findAll('.experience-card__achievements > li')).toHaveLength(9)

    for (const evidence of ['four product categories', 'Apache POI', 'QR code generation', 'field-level audit logs', 'database unique constraints', 'Microsoft JWKS', 'BFF-style', 'no major business incidents', 'Windows Credential Manager']) {
      expect(englishBosch.text()).toContain(evidence)
    }

    for (const evidence of ['四类产品', 'Apache POI', '二维码生成', '字段级审计日志', '数据库唯一约束', 'Microsoft JWKS', 'BFF 式', '无重大业务故障', 'Windows Credential Manager']) {
      expect(chineseBosch.text()).toContain(evidence)
    }
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
    expect(englishDigiwin.text()).toContain('enterprise talent competency assessment')
    expect(englishDigiwin.text()).toContain('F1 score from 73% to 92%')
    expect(englishDigiwin.text()).toContain('Top-3 acceptance rate to 90%')
    expect(englishDigiwin.text()).toContain('from 30 seconds to 15 seconds')
    expect(englishDigiwin.text()).toContain('LangChain callbacks')
    expect(englishDigiwin.text()).toContain('thread pool')
    expect(englishDigiwin.findAll('.experience-card__achievements > li')).toHaveLength(6)
    expect(englishDigiwin.findAll('[data-testid=experience-technologies] li').map((tag) => tag.text())).toEqual([
      'Python',
      'FastAPI',
      'LangChain',
      'LangGraph',
      'MySQL',
      'Chroma',
    ])
    expect(englishDigiwin.get('[data-testid=experience-logo]').attributes('src')).toBe('/logos/companies/digiwin.svg')
    expect(englishDigiwin.get('[data-testid=experience-logo]').attributes('alt')).toBe('Digiwin logo')

    expect(chineseDigiwin.text()).toContain('鼎捷数智')
    expect(chineseDigiwin.text()).toContain('AI 应用开发实习生')
    expect(chineseDigiwin.text()).toContain('2025.09 – 2026.05')
    expect(chineseDigiwin.text()).toContain('企业人才能力评估')
    expect(chineseDigiwin.text()).toContain('F1-score 从 73% 提升至 92%')
    expect(chineseDigiwin.text()).toContain('Top-3 接受率达到 90%')
    expect(chineseDigiwin.text()).toContain('从 30 秒降低至 15 秒')
    expect(chineseDigiwin.text()).toContain('LangChain Callback')
    expect(chineseDigiwin.text()).toContain('线程池')
    expect(chineseDigiwin.findAll('.experience-card__achievements > li')).toHaveLength(6)
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

  it('shows the production experience while keeping unavailable sections out of the app', () => {
    const controller = createLocaleController({ content: siteContent, storage: null, languages: ['en-US'], document })
    const app = mount(App, { global: { provide: { [localeKey as symbol]: controller } } })

    expect(app.find('#projects').exists()).toBe(false)
    expect(app.find('#experience').exists()).toBe(true)
    expect(app.find('#contact').exists()).toBe(false)
    expect(app.find('#capabilities').exists()).toBe(true)
  })
})
