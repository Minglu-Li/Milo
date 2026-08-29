import { siteContent } from '../../src/content/profile'
import type { SiteContent } from '../../src/content/types'

const completeContent: SiteContent = {
  ...siteContent,
  email: 'milo@example.com',
  avatar: '/portrait.jpg',
  resumes: { zh: '/resume-zh.pdf', en: '/resume-en.pdf' },
  projects: [{
    id: 'agent-assistant',
    title: { zh: 'Agent 研究助手', en: 'Agent Research Assistant' },
    summary: { zh: '用于整理研究资料的智能助手。', en: 'An intelligent assistant for organizing research material.' },
    problem: { zh: '研究资料分散且难以追踪。', en: 'Research material was scattered and difficult to track.' },
    contribution: { zh: '设计 Agent 流程并完成全栈实现。', en: 'Designed the agent flow and delivered the full stack.' },
    result: { zh: '形成可重复使用的研究工作流。', en: 'Produced a reusable research workflow.' },
    technologies: ['AI Agent', 'Vue', 'Spring'],
    repository: 'https://github.com/Minglu-Li/example-agent',
  }],
  experiences: [{
    id: 'software-internship',
    company: { zh: '示例科技', en: 'Example Technology' },
    role: { zh: '软件工程实习生', en: 'Software Engineering Intern' },
    period: { zh: '2025.06 – 2025.09', en: 'Jun 2025 – Sep 2025' },
    summary: { zh: '参与可靠产品功能的设计与交付。', en: 'Helped design and ship reliable product features.' },
    technologies: ['Java', 'Vue', 'MySQL'],
    achievements: [{ zh: '完成可验证的端到端交付。', en: 'Completed a verifiable end-to-end delivery.' }],
  }],
}

export function makeContent(overrides: Partial<SiteContent> = {}): SiteContent {
  return {
    ...completeContent,
    ...overrides,
    ui: { ...completeContent.ui, ...overrides.ui },
    seo: { ...completeContent.seo, ...overrides.seo },
  }
}
