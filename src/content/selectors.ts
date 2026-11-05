import type { Locale, SiteContent } from './types'

export function withBasePath(path: string, baseUrl = import.meta.env.BASE_URL): string {
  return `${baseUrl}${path.replace(/^\/+/, '')}`
}

export interface SectionVisibility {
  projects: boolean
  experience: boolean
  notes: boolean
  interests: boolean
  resume: boolean
  contact: boolean
}

export function getResumeUrl(content: SiteContent, locale: Locale): string | undefined {
  const value = content.resumes[locale]?.trim()
  return value || undefined
}

export function getConfiguredLocalAssets(content: SiteContent): string[] {
  return [
    content.avatar,
    content.resumes.zh,
    content.resumes.en,
    ...content.projects.flatMap((project) => [project.image, project.logo]),
    ...content.experiences.map((experience) => experience.logo),
    ...content.posts.map((post) => post.image),
    ...content.interests.map((interest) => interest.image),
    content.seo.ogImage,
  ].filter((asset): asset is string => Boolean(asset))
}
export function deriveVisibility(content: SiteContent, locale: Locale): SectionVisibility {
  return {
    projects: content.projects.length > 0,
    experience: content.experiences.length > 0,
    notes: content.posts.length > 0,
    interests: content.interests.length > 0,
    resume: Boolean(getResumeUrl(content, locale)),
    contact: Boolean(content.email?.trim()),
  }
}

export function getPrimaryCta(content: SiteContent) {
  return content.projects.length > 0
    ? { href: '#projects', external: false, kind: 'projects' as const }
    : { href: content.github, external: true, kind: 'github' as const }
}
