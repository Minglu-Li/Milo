import { describe, expect, it } from 'vitest'
import { deriveVisibility, getConfiguredLocalAssets, getPrimaryCta, getResumeUrl, withBasePath } from '../../src/content/selectors'
import { makeContent } from '../fixtures/content'

describe('content selectors', () => {
  it('prefixes local asset paths with the deployment base path', () => {
    expect(withBasePath('/portrait.png', '/Milo/')).toBe('/Milo/portrait.png')
    expect(withBasePath('logos/companies/digiwin.svg', '/Milo/')).toBe('/Milo/logos/companies/digiwin.svg')
  })

  it('hides optional sections and falls the primary action back to GitHub', () => {
    const content = makeContent({ projects: [], experiences: [], email: undefined, resumes: {} })

    expect(deriveVisibility(content, 'zh')).toEqual({
      projects: false,
      experience: false,
      resume: false,
      contact: false,
      notes: false,
      interests: false,
    })
    expect(getPrimaryCta(content)).toEqual({ href: content.github, external: true, kind: 'github' })
    expect(getResumeUrl(content, 'zh')).toBeUndefined()
  })

  it('shows notes and interests when content is available', () => {
    const content = makeContent({
      posts: [{
        id: 'first-note',
        title: { zh: '第一篇', en: 'First note' },
        excerpt: { zh: '摘要', en: 'Excerpt' },
        date: '2026-11-06',
        tags: ['AI'],
      }],
      interests: [{
        id: 'cycling',
        title: { zh: '骑行', en: 'Cycling' },
        description: { zh: '描述', en: 'Description' },
        tags: ['life'],
      }],
    })

    expect(deriveVisibility(content, 'zh')).toMatchObject({ notes: true, interests: true })
  })

  it('collects every configured local asset including project images', () => {
    const content = makeContent({
      avatar: '/portrait.jpg',
      resumes: { zh: '/resume-zh.pdf', en: '/resume-en.pdf' },
      projects: [{
        ...makeContent().projects[0],
        image: '/project-cover.png',
        logo: '/logos/projects/agent-assistant.svg',
      }],
      experiences: [{
        ...makeContent().experiences[0],
        logo: '/logos/companies/example-technology.svg',
      }],
      posts: [{
        id: 'first-note',
        title: { zh: '第一篇', en: 'First note' },
        excerpt: { zh: '摘要', en: 'Excerpt' },
        date: '2026-11-06',
        tags: ['AI'],
        image: '/notes/first-note.png',
      }],
      interests: [{
        id: 'cycling',
        title: { zh: '骑行', en: 'Cycling' },
        description: { zh: '描述', en: 'Description' },
        tags: ['life'],
        image: '/interests/cycling.png',
      }],
    })

    expect(getConfiguredLocalAssets(content)).toEqual([
      '/portrait.jpg',
      '/resume-zh.pdf',
      '/resume-en.pdf',
      '/project-cover.png',
      '/logos/projects/agent-assistant.svg',
      '/logos/companies/example-technology.svg',
      '/notes/first-note.png',
      '/interests/cycling.png',
      '/og-image.png',
    ])
  })
  it('targets the project anchor when curated projects exist', () => {
    const content = makeContent()

    expect(getPrimaryCta(content)).toEqual({ href: '#projects', external: false, kind: 'projects' })
  })
})
