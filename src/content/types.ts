export type Locale = 'zh' | 'en'

export interface LocalizedText {
  zh: string
  en: string
}

export interface PersonalLink {
  label: LocalizedText
  href: string
  external?: boolean
}

export interface BlogPost {
  id: string
  title: LocalizedText
  excerpt: LocalizedText
  date: string
  tags: string[]
  href?: string
  image?: string
}

export interface Interest {
  id: string
  title: LocalizedText
  description: LocalizedText
  tags: string[]
  href?: string
  image?: string
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
  logo?: string
}

export interface Experience {
  id: string
  company: LocalizedText
  role: LocalizedText
  period: LocalizedText
  summary: LocalizedText
  technologies: string[]
  achievements: LocalizedText[]
  logo?: string
}

export interface CapabilityGroup {
  id: string
  title: LocalizedText
  description: LocalizedText
  items: LocalizedText[]
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
  location?: LocalizedText
  status?: LocalizedText
  resumes: Partial<Record<Locale, string>>
  projects: Project[]
  experiences: Experience[]
  posts: BlogPost[]
  interests: Interest[]
  capabilities: CapabilityGroup[]
  buildSteps: BuildStep[]
  contactPrompt: LocalizedText
  ui: {
    nav: Record<'projects' | 'experience' | 'notes' | 'interests' | 'capabilities' | 'contact', LocalizedText>
    sections: Record<'projects' | 'experience' | 'notes' | 'interests' | 'capabilities' | 'contact', LocalizedText>
    labels: Record<'problem' | 'contribution' | 'result' | 'repository' | 'demo' | 'logo' | 'technologies', LocalizedText>
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
