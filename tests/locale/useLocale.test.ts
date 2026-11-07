import { describe, expect, it } from 'vitest'
import { createLocaleController, resolveInitialLocale } from '../../src/composables/useLocale'
import { makeContent } from '../fixtures/content'

describe('locale controller', () => {
  it('prefers saved locale over browser languages', () => {
    const storage = { getItem: () => 'zh', setItem: () => undefined }
    expect(resolveInitialLocale(storage, ['en-US'])).toBe('zh')
  })

  it('uses browser language and falls back to Chinese', () => {
    const empty = { getItem: () => null, setItem: () => undefined }
    expect(resolveInitialLocale(empty, ['en-US'])).toBe('en')
    expect(resolveInitialLocale(empty, ['zh-CN'])).toBe('zh')
    expect(resolveInitialLocale(null, [])).toBe('zh')
  })

  it('updates persistence, html language, title, and meta copy', () => {
    document.head.innerHTML = [
      '<meta name="description" content="">',
      '<meta property="og:title" content="">',
      '<meta property="og:description" content="">',
    ].join('')
    const saved: string[] = []
    const storage = { getItem: () => null, setItem: (_key: string, value: string) => saved.push(value) }
    const content = makeContent()
    const controller = createLocaleController({ content, storage, languages: ['zh-CN'], document })

    controller.setLocale('en')

    expect(controller.locale.value).toBe('en')
    expect(saved).toEqual(['en'])
    expect(document.documentElement.lang).toBe('en')
    expect(document.title).toBe('Milo')
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(content.seo.description.en)
    expect(document.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(content.seo.title.en)
  })

  it('keeps working when browser storage throws', () => {
    const storage = {
      getItem: () => { throw new Error('blocked') },
      setItem: () => { throw new Error('blocked') },
    }
    const controller = createLocaleController({
      content: makeContent(),
      storage,
      languages: ['en-US'],
      document,
    })

    expect(controller.locale.value).toBe('en')
    expect(() => controller.setLocale('zh')).not.toThrow()
    expect(controller.locale.value).toBe('zh')
  })
})
