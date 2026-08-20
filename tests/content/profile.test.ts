import { describe, expect, it } from 'vitest'
import { siteContent } from '../../src/content/profile'
import { validateContent } from '../../src/content/validate'
import { makeContent } from '../fixtures/content'

describe('site content', () => {
  it('contains valid bilingual public content', () => {
    expect(validateContent(siteContent)).toEqual([])
  })

  it('reports blank localized copy and unsafe external URLs', () => {
    const content = makeContent({
      github: 'javascript:alert(1)',
      headline: { zh: '', en: 'Working products' },
    })

    expect(validateContent(content)).toEqual([
      'headline.zh must not be blank',
      'github must use http or https',
    ])
  })
})
