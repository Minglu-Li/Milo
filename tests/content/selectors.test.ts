import { describe, expect, it } from 'vitest'
import { deriveVisibility, getConfiguredLocalAssets, getPrimaryCta, getResumeUrl } from '../../src/content/selectors'
import { makeContent } from '../fixtures/content'

describe('content selectors', () => {
  it('hides optional sections and falls the primary action back to GitHub', () => {
    const content = makeContent({ projects: [], experiences: [], email: undefined, resumes: {} })

    expect(deriveVisibility(content, 'zh')).toEqual({
      projects: false,
      experience: false,
      resume: false,
      contact: false,
    })
    expect(getPrimaryCta(content)).toEqual({ href: content.github, external: true, kind: 'github' })
    expect(getResumeUrl(content, 'zh')).toBeUndefined()
  })

  it('collects every configured local asset including project images', () => {
    const content = makeContent({
      avatar: '/portrait.jpg',
      resumes: { zh: '/resume-zh.pdf', en: '/resume-en.pdf' },
      projects: [{ ...makeContent().projects[0], image: '/project-cover.png' }],
    })

    expect(getConfiguredLocalAssets(content)).toEqual([
      '/portrait.jpg',
      '/resume-zh.pdf',
      '/resume-en.pdf',
      '/project-cover.png',
      '/og-image.png',
    ])
  })
  it('targets the project anchor when curated projects exist', () => {
    const content = makeContent()

    expect(getPrimaryCta(content)).toEqual({ href: '#projects', external: false, kind: 'projects' })
  })
})
