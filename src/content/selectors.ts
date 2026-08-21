import type { Locale, SiteContent } from './types'

export interface SectionVisibility {
  projects: boolean
  experience: boolean
  resume: boolean
  contact: boolean
}

export function getResumeUrl(content: SiteContent, locale: Locale): string | undefined {
  const value = content.resumes[locale]?.trim()
  return value || undefined
}

export function deriveVisibility(content: SiteContent, locale: Locale): SectionVisibility {
  return {
    projects: content.projects.length > 0,
    experience: content.experiences.length > 0,
    resume: Boolean(getResumeUrl(content, locale)),
    contact: Boolean(content.email?.trim()),
  }
}

export function getPrimaryCta(content: SiteContent) {
  return content.projects.length > 0
    ? { href: '#projects', external: false, kind: 'projects' as const }
    : { href: content.github, external: true, kind: 'github' as const }
}
