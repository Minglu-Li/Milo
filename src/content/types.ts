export type Locale = 'zh' | 'en'

export interface LocalizedText {
  zh: string
  en: string
}

export interface Project {
  id: string
  title: LocalizedText
  summary: LocalizedText
  problem: LocalizedText
  contribution: LocalizedText
  result: LocalizedText
  technologies: string[]
  repository?: string
  demo?: string
  image?: string
}

export interface Experience {
  id: string
  company: LocalizedText
  role: LocalizedText
  period: LocalizedText
  summary: LocalizedText
  achievements: LocalizedText[]
}

export interface CapabilityGroup {
  id: string
  title: LocalizedText
  description: LocalizedText
  items: string[]
}

export interface BuildStep {
  id: 'idea' | 'agent' | 'build' | 'ship'
  label: string
  description: LocalizedText
}

export interface SiteContent {
  name: string
  initials: string
  role: LocalizedText
  headline: LocalizedText
  intro: LocalizedText
  github: string
  email?: string
  avatar?: string
  resumes: Partial<Record<Locale, string>>
  projects: Project[]
  experiences: Experience[]
  capabilities: CapabilityGroup[]
  buildSteps: BuildStep[]
  contactPrompt: LocalizedText
  ui: {
    nav: Record<'projects' | 'experience' | 'capabilities' | 'contact', LocalizedText>
    sections: Record<'projects' | 'experience' | 'capabilities' | 'contact', LocalizedText>
    labels: Record<'problem' | 'contribution' | 'result' | 'repository' | 'demo', LocalizedText>
    actions: Record<'viewProjects' | 'visitGitHub' | 'viewResume' | 'emailMe', LocalizedText>
    menu: LocalizedText
    language: LocalizedText
    skipToContent: LocalizedText
  }
  seo: {
    title: LocalizedText
    description: LocalizedText
    canonical: string
    ogImage: string
  }
}
