import { inject, ref, type InjectionKey, type Ref } from 'vue'
import type { Locale, LocalizedText, SiteContent } from '../content/types'

export const LOCALE_STORAGE_KEY = 'milo.locale'

export interface StoragePort {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

export interface LocaleController {
  locale: Readonly<Ref<Locale>>
  setLocale(locale: Locale): void
  t(value: LocalizedText): string
}

export const localeKey: InjectionKey<LocaleController> = Symbol('locale')

export function resolveInitialLocale(storage: StoragePort | null, languages: readonly string[]): Locale {
  try {
    const saved = storage?.getItem(LOCALE_STORAGE_KEY)
    if (saved === 'zh' || saved === 'en') return saved
  } catch {
    // Storage may be unavailable (for example, in private browsing).
  }

  const browserLanguage = languages.find((language) => language.trim().length > 0)
  if (browserLanguage) return browserLanguage.toLowerCase().startsWith('zh') ? 'zh' : 'en'
  return 'zh'
}

function setMeta(document: Document, selector: string, content: string, attribute: string): void {
  let element = document.head.querySelector<HTMLMetaElement>(selector)
  if (!element) {
    element = document.createElement('meta')
    if (selector.includes('name=')) element.setAttribute('name', selector.match(/name="([^"]+)/)?.[1] ?? '')
    else element.setAttribute('property', selector.match(/property="([^"]+)/)?.[1] ?? '')
    document.head.appendChild(element)
  }
  element.setAttribute(attribute, content)
}

export function createLocaleController(options: {
  content: SiteContent
  storage: StoragePort | null
  languages: readonly string[]
  document: Document
}): LocaleController {
  const locale = ref<Locale>(resolveInitialLocale(options.storage, options.languages))

  const updateDocument = (current: Locale) => {
    const title = options.content.seo.title[current]
    const description = options.content.seo.description[current]
    options.document.documentElement.lang = current === 'zh' ? 'zh-CN' : 'en'
    options.document.title = title
    setMeta(options.document, 'meta[name="description"]', description, 'content')
    setMeta(options.document, 'meta[property="og:title"]', title, 'content')
    setMeta(options.document, 'meta[property="og:description"]', description, 'content')
  }

  updateDocument(locale.value)

  return {
    locale,
    setLocale(nextLocale) {
      locale.value = nextLocale
      try {
        options.storage?.setItem(LOCALE_STORAGE_KEY, nextLocale)
      } catch {
        // Persistence is best effort; locale changes must still apply.
      }
      updateDocument(nextLocale)
    },
    t(value) {
      return value[locale.value]
    },
  }
}

export function useLocale(): LocaleController {
  const controller = inject(localeKey)
  if (!controller) throw new Error('Locale controller was not provided')
  return controller
}
