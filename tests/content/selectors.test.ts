import { describe, expect, it } from 'vitest'
import { deriveVisibility, getPrimaryCta, getResumeUrl } from '../../src/content/selectors'
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

  it('targets the project anchor when curated projects exist', () => {
    const content = makeContent()

    expect(getPrimaryCta(content)).toEqual({ href: '#projects', external: false, kind: 'projects' })
  })
})
