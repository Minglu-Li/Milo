import type { SiteContent } from './types'

export const siteContent: SiteContent = {
  name: 'Milo',
  initials: 'ML',
  role: {
    zh: 'AI Agent 应用开发者 / 全栈工程师',
    en: 'AI Agent Application Developer / Full-stack Engineer',
  },
  headline: {
    zh: '把复杂想法做成可靠、能用的产品。',
    en: 'I turn complex ideas into reliable, usable products.',
  },
  intro: {
    zh: '连接模型、系统与真实用户。',
    en: 'I connect models, systems, and real users.',
  },
  github: 'https://github.com/Minglu-Li',
  resumes: {},
  projects: [],
  experiences: [],
  capabilities: [
    {
      id: 'agent-systems',
      title: { zh: 'Agent 系统', en: 'Agent Systems' },
      description: {
        zh: '构建由模型、工具和流程协作的智能系统。',
        en: 'Building intelligent systems where models, tools, and workflows work together.',
      },
      items: [
        { zh: 'AI Agent', en: 'AI Agent' },
        { zh: 'LLM', en: 'LLM' },
        { zh: 'NLP', en: 'NLP' },
        { zh: '强化学习', en: 'Reinforcement Learning' },
      ],
    },
    {
      id: 'full-stack-delivery',
      title: { zh: '全栈交付', en: 'Full-stack Delivery' },
      description: {
        zh: '从服务端到界面和部署，完成可维护的产品交付。',
        en: 'Delivering maintainable products from backend services to interfaces and deployment.',
      },
      items: [
        { zh: 'Java', en: 'Java' },
        { zh: 'Spring', en: 'Spring' },
        { zh: 'TypeScript', en: 'TypeScript' },
        { zh: 'Python', en: 'Python' },
        { zh: '数据库', en: 'Databases' },
        { zh: '云部署', en: 'Cloud Deployment' },
      ],
    },
    {
      id: 'applied-ai-domain',
      title: { zh: '应用 AI 与领域', en: 'Applied AI & Domain' },
      description: {
        zh: '把 AI 方法应用到复杂的行业问题中。',
        en: 'Applying AI methods to complex domain problems.',
      },
      items: [
        { zh: '图神经网络', en: 'Graph Neural Networks' },
        { zh: '电力系统', en: 'Power Systems' },
        { zh: '人工智能应用', en: 'AI Applications' },
      ],
    },
  ],
  buildSteps: [
    {
      id: 'idea',
      label: 'IDEA',
      description: {
        zh: '理解真实问题和使用场景。',
        en: 'Understand the real problem and its context.',
      },
    },
    {
      id: 'agent',
      label: 'AGENT',
      description: {
        zh: '设计连接模型、工具和人的智能流程。',
        en: 'Design intelligent flows that connect models, tools, and people.',
      },
    },
    {
      id: 'build',
      label: 'BUILD',
      description: {
        zh: '把想法实现为可验证的系统。',
        en: 'Build ideas into verifiable systems.',
      },
    },
    {
      id: 'ship',
      label: 'SHIP',
      description: {
        zh: '交付可靠、真正能用的产品。',
        en: 'Ship reliable products that people can use.',
      },
    },
  ],
  contactPrompt: {
    zh: '想一起把复杂问题做成可用产品？',
    en: 'Want to turn a complex problem into a usable product together?',
  },
  ui: {
    nav: {
      projects: { zh: '项目', en: 'Projects' },
      experience: { zh: '经历', en: 'Experience' },
      capabilities: { zh: '能力', en: 'Capabilities' },
      contact: { zh: '联系', en: 'Contact' },
    },
    sections: {
      projects: { zh: '代表项目', en: 'Selected Work' },
      experience: { zh: '经历', en: 'Experience' },
      capabilities: { zh: '能力地图', en: 'How I Build' },
      contact: { zh: '联系', en: 'Contact' },
    },
    labels: {
      problem: { zh: '问题', en: 'Problem' },
      contribution: { zh: '贡献', en: 'Contribution' },
      result: { zh: '结果', en: 'Result' },
      repository: { zh: '仓库', en: 'Repository' },
      demo: { zh: '演示', en: 'Demo' },
      logo: { zh: '标志', en: 'logo' },
    },
    actions: {
      viewProjects: { zh: '查看项目', en: 'View projects' },
      visitGitHub: { zh: '访问 GitHub', en: 'Visit GitHub' },
      viewResume: { zh: '查看简历', en: 'View resume' },
      emailMe: { zh: '给我发邮件', en: 'Email me' },
    },
    menu: { zh: '菜单', en: 'Menu' },
    language: { zh: '语言', en: 'Language' },
    skipToContent: { zh: '跳到主要内容', en: 'Skip to main content' },
  },
  seo: {
    title: { zh: 'Milo · AI Agent 与全栈开发', en: 'Milo · AI Agent & Full-stack Development' },
    description: {
      zh: 'Milo 是一名专注 AI Agent 应用的全栈开发者，擅长把复杂想法做成可靠、能用的产品。',
      en: 'Milo is a full-stack developer focused on AI Agent applications and reliable, usable products.',
    },
    canonical: 'https://minglu-li.github.io/',
    ogImage: '/og-image.png',
  },
}
