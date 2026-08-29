import { describe, expect, it } from 'vitest'
import { siteContent } from '../../src/content/profile'
import { validateContent } from '../../src/content/validate'
import { makeContent } from '../fixtures/content'

describe('site content', () => {
  it('contains valid bilingual public content', () => {
    expect(validateContent(siteContent)).toEqual([])
  })

  it('reports whitespace-only localized capability items', () => {
    const content = makeContent()
    const capabilities = content.capabilities.map((group, index) => index === 0
      ? { ...group, items: [{ zh: '强化学习', en: '   ' }, ...group.items.slice(1)] }
      : group)

    expect(validateContent(makeContent({ capabilities }))).toContain('capabilities.0.items.0.en must not be blank')
  })
  it('reports whitespace-only localized copy', () => {
    const content = makeContent({
      headline: { zh: ' \t\n', en: 'Working products' },
    })

    expect(validateContent(content)).toEqual(['headline.zh must not be blank'])
  })

  it('reports blank experience technology labels', () => {
    const content = makeContent()
    const experiences = [{ ...content.experiences[0], technologies: ['Java', '   '] }]

    expect(validateContent(makeContent({ experiences }))).toContain('experiences.0.technologies.1 must not be blank')
  })

  it('requires every experience to name at least one technology', () => {
    const content = makeContent()
    const experiences = [{ ...content.experiences[0], technologies: [] }]

    expect(validateContent(makeContent({ experiences }))).toContain('experiences.0.technologies must not be empty')
  })

  it.each([
    ['github', (url: string) => makeContent({ github: url }), 'github must use http or https'],
    [
      'project repository',
      (url: string) => {
        const content = makeContent()
        return makeContent({ projects: [{ ...content.projects[0], repository: url }] })
      },
      'projects.0.repository must use http or https',
    ],
    [
      'project demo',
      (url: string) => {
        const content = makeContent()
        return makeContent({ projects: [{ ...content.projects[0], demo: url }] })
      },
      'projects.0.demo must use http or https',
    ],
    [
      'canonical URL',
      (url: string) => {
        const content = makeContent()
        return makeContent({ seo: { ...content.seo, canonical: url } })
      },
      'seo.canonical must use http or https',
    ],
  ])('rejects unsafe external %s', (_field, makeInvalidContent, expectedError) => {
    expect(validateContent(makeInvalidContent('javascript:alert(1)'))).toEqual([expectedError])
  })

  it.each([
    ['avatar', (path: string) => makeContent({ avatar: path }), 'avatar must start with /'],
    [
      'resume',
      (path: string) => {
        const content = makeContent()
        return makeContent({ resumes: { ...content.resumes, zh: path } })
      },
      'resumes.zh must start with /',
    ],
    [
      'project image',
      (path: string) => {
        const content = makeContent()
        return makeContent({ projects: [{ ...content.projects[0], image: path }] })
      },
      'projects.0.image must start with /',
    ],
    [
      'project logo',
      (path: string) => {
        const content = makeContent()
        return makeContent({ projects: [{ ...content.projects[0], logo: path }] })
      },
      'projects.0.logo must start with /',
    ],
    [
      'experience logo',
      (path: string) => {
        const content = makeContent()
        return makeContent({ experiences: [{ ...content.experiences[0], logo: path }] })
      },
      'experiences.0.logo must start with /',
    ],
    [
      'Open Graph image',
      (path: string) => {
        const content = makeContent()
        return makeContent({ seo: { ...content.seo, ogImage: path } })
      },
      'seo.ogImage must start with /',
    ],
  ])('rejects unsafe local %s paths', (_field, makeInvalidContent, expectedError) => {
    expect(validateContent(makeInvalidContent('//cdn.example.test/asset.png'))).toEqual([expectedError])
    expect(validateContent(makeInvalidContent('/assets\\asset.png'))).toEqual([expectedError])
  })

  it.each([
    [
      'project logo',
      (path: string) => {
        const content = makeContent()
        return makeContent({ projects: [{ ...content.projects[0], logo: path }] })
      },
      'projects.0.logo must start with /',
    ],
    [
      'experience logo',
      (path: string) => {
        const content = makeContent()
        return makeContent({ experiences: [{ ...content.experiences[0], logo: path }] })
      },
      'experiences.0.logo must start with /',
    ],
  ])('rejects traversal segments in %s paths', (_field, makeInvalidContent, expectedError) => {
    expect(validateContent(makeInvalidContent('/logos/../outside.svg'))).toEqual([expectedError])
    expect(validateContent(makeInvalidContent('/logos/./outside.svg'))).toEqual([expectedError])
  })
})
