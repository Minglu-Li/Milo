# Milo Personal GitHub Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a bilingual, responsive Vue 3 portfolio that presents Milo as an AI Agent and full-stack engineer, while cleanly hiding project, experience, resume, email, and portrait content until real assets are configured.

**Architecture:** A single-page Vue 3 application renders typed static content through small section components. A provided locale controller owns language selection, persistence, and document metadata; pure selectors derive section visibility and CTA behavior. Vite emits static assets to `dist`, and GitHub Actions runs tests, browser checks, Lighthouse, and deployment to GitHub Pages.

**Tech Stack:** Vue 3, TypeScript, Vite 8, Vitest, Vue Test Utils, jsdom, Playwright, axe-core, Lighthouse CI, Fontsource, Sharp, GitHub Actions, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-08-19-personal-github-homepage-design.md`

## Global Constraints

- Target repository name is `Minglu-Li.github.io`; Vite `base` is exactly `/`.
- Use Vue 3, Vite, and TypeScript with npm on Node.js 24 or newer.
- Keep one page with anchor navigation; do not add Vue Router, a backend, runtime GitHub API calls, analytics, advertising, cookies, or visitor tracking.
- Public copy is bilingual and manually authored; do not publish invented project, internship, email, resume, or portrait data.
- Empty project and experience arrays hide their sections and navigation; absent resume and email values hide their CTAs; absent or failed portrait images render the `ML` initials fallback.
- Locale priority is saved legal choice, then browser language, then Chinese; switching locale updates visible copy, `<html lang>`, title, description, Open Graph copy, and the locale-specific resume link.
- Use the approved palette exactly: `#14213D`, `#245FD4`, `#8FB6FF`, `#EEF4FF`, and `#FBFCFF`.
- Bundle Instrument Sans, Noto Sans SC, and IBM Plex Mono locally through Fontsource packages; retain system font fallbacks.
- Preserve semantic landmarks, visible keyboard focus, 44px minimum touch targets, WCAG AA contrast, and `prefers-reduced-motion` behavior.
- Support layouts from 320px upward with no horizontal overflow.
- Lighthouse performance, accessibility, best-practices, and SEO category scores must each be at least 0.90.
- During execution, use `superpowers:test-driven-development` for behavior changes, `frontend-design` for visual implementation, and `superpowers:verification-before-completion` before reporting completion.

---

## File Structure

```text
.
├─ .github/workflows/deploy.yml          # CI checks and GitHub Pages deployment
├─ e2e/homepage.spec.ts                  # Browser, accessibility, responsive, and locale flows
├─ public/
│  ├─ favicon.svg                        # Build Trace monogram favicon
│  └─ og-image.png                       # Generated 1200×630 social image
├─ scripts/generate-og.mjs               # Deterministic OG image generator
├─ src/
│  ├─ components/
│  │  ├─ BuildTrace.vue                  # IDEA → AGENT → BUILD → SHIP signature
│  │  ├─ CapabilitiesSection.vue         # Three capability groups
│  │  ├─ ContactSection.vue              # Email, GitHub, and resume actions
│  │  ├─ ExperienceSection.vue           # Typed internship timeline
│  │  ├─ HeroSection.vue                 # Positioning, fallback CTA, portrait fallback
│  │  ├─ ProjectsSection.vue             # Curated project cases
│  │  ├─ SiteFooter.vue                  # Footer and locale state
│  │  └─ SiteHeader.vue                  # Conditional navigation and mobile menu
│  ├─ composables/useLocale.ts            # Locale resolution, persistence, metadata
│  ├─ content/
│  │  ├─ profile.ts                      # Real bilingual site content
│  │  ├─ selectors.ts                    # Visibility, resume, and CTA selectors
│  │  ├─ types.ts                        # Content contracts
│  │  └─ validate.ts                     # Content validation
│  ├─ styles/
│  │  ├─ base.css                        # Reset, typography, focus, shared elements
│  │  ├─ layout.css                      # Desktop/mobile layout and components
│  │  ├─ motion.css                      # Build Trace animation and reduced motion
│  │  └─ tokens.css                      # Approved design tokens
│  ├─ App.vue                            # Conditional page composition
│  ├─ main.ts                            # App bootstrapping and locale provider
│  └─ vite-env.d.ts                      # Vite client types
├─ tests/
│  ├─ assets/staticAssets.test.ts         # Local asset and OG dimensions
│  ├─ components/appShell.test.ts         # Header, Hero, Build Trace behavior
│  ├─ components/contentSections.test.ts  # Projects, experience, skills, contact
│  ├─ config/deployment.test.ts           # Workflow and Pages contract
│  ├─ content/profile.test.ts             # Content model and validation
│  ├─ content/selectors.test.ts           # Visibility and CTA derivation
│  ├─ fixtures/content.ts                 # Complete reusable bilingual fixture
│  ├─ locale/useLocale.test.ts            # Locale and metadata behavior
│  └─ setup.ts                            # Vue test cleanup
├─ index.html
├─ lighthouserc.cjs
├─ package.json
├─ playwright.config.ts
├─ tsconfig.app.json
├─ tsconfig.json
├─ tsconfig.node.json
├─ vite.config.ts
└─ vitest.config.ts
```

---

### Task 1: Project Foundation and Typed Content Contract

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `vitest.config.ts`
- Create: `index.html`
- Create: `src/vite-env.d.ts`
- Create: `src/main.ts`
- Create: `src/App.vue`
- Create: `src/content/types.ts`
- Create: `src/content/profile.ts`
- Create: `src/content/validate.ts`
- Create: `tests/setup.ts`
- Create: `tests/fixtures/content.ts`
- Create: `tests/content/profile.test.ts`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: The approved content rules and real GitHub URL from the design spec.
- Produces: `Locale`, `LocalizedText`, `SiteContent`, `Project`, `Experience`, `CapabilityGroup`, `siteContent`, `validateContent(content): string[]`, and `makeContent(overrides): SiteContent` for every later task.

- [ ] **Step 1: Create the Vue and test toolchain**

Run:

```powershell
npm init -y
npm install vue@^3 @fontsource-variable/instrument-sans @fontsource-variable/noto-sans-sc @fontsource/ibm-plex-mono
npm install --save-dev vite@^8 @vitejs/plugin-vue typescript@^5 vue-tsc@^3 vitest@^4 @vue/test-utils@^2 jsdom@^26 @playwright/test@^1 @axe-core/playwright@^4 @lhci/cli@^0.15 sharp@^0.34
```

Set the package scripts and engine to:

```json
{
  "type": "module",
  "engines": { "node": ">=24" },
  "scripts": {
    "dev": "vite",
    "type-check": "vue-tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "npm run type-check && vite build",
    "preview": "vite preview",
    "assets:generate": "node scripts/generate-og.mjs",
    "test:e2e": "playwright test",
    "test:lighthouse": "lhci autorun"
  }
}
```

Create `vite.config.ts` with `base: '/'` and the Vue plugin. Configure `vitest.config.ts` with `environment: 'jsdom'`, `setupFiles: ['./tests/setup.ts']`, and test globs under `tests/**/*.test.ts`. The initial `App.vue` should render only `<main id="main-content"></main>` so the toolchain compiles before UI tasks begin.

Append `lhci-reports/`, `.lighthouseci/`, and `playwright/.cache/` to `.gitignore`; keep the existing `.superpowers/`, dependency, build, coverage, and browser-report exclusions.

- [ ] **Step 2: Write the failing content validation test**

```ts
// tests/content/profile.test.ts
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
```

- [ ] **Step 3: Run the test and verify the red state**

Run: `npm test -- tests/content/profile.test.ts`

Expected: FAIL because `src/content/profile.ts`, `src/content/validate.ts`, and the fixture do not exist.

- [ ] **Step 4: Implement the content contracts and real initial content**

Define the shared types in `src/content/types.ts`:

```ts
export type Locale = 'zh' | 'en'

export interface LocalizedText {
  zh: string
  en: string
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
}

export interface Experience {
  id: string
  company: LocalizedText
  role: LocalizedText
  period: LocalizedText
  summary: LocalizedText
  achievements: LocalizedText[]
}

export interface CapabilityGroup {
  id: string
  title: LocalizedText
  description: LocalizedText
  items: string[]
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
  resumes: Partial<Record<Locale, string>>
  projects: Project[]
  experiences: Experience[]
  capabilities: CapabilityGroup[]
  buildSteps: BuildStep[]
  contactPrompt: LocalizedText
  ui: {
    nav: Record<'projects' | 'experience' | 'capabilities' | 'contact', LocalizedText>
    sections: Record<'projects' | 'experience' | 'capabilities' | 'contact', LocalizedText>
    labels: Record<'problem' | 'contribution' | 'result' | 'repository' | 'demo', LocalizedText>
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
```

Create `siteContent` with `name: 'Milo'`, `initials: 'ML'`, GitHub URL `https://github.com/Minglu-Li`, the approved Chinese and English headline, all three confirmed capability groups, and bilingual UI/build-step copy. Set `email`, `avatar`, and both resume entries to absent; set `projects` and `experiences` to empty arrays. Set canonical to `https://minglu-li.github.io/` and OG image to `/og-image.png`.

Implement `validateContent` as a pure function. It must check every configured localized string with `.trim()`, require `http:` or `https:` for GitHub/repository/demo/canonical URLs, require configured local asset paths to start with `/`, and return deterministic messages in field traversal order.

Create `makeContent` by shallow-merging overrides over a complete fixture and preserve nested fixture objects unless explicitly overridden:

```ts
const completeContent: SiteContent = {
  ...siteContent,
  email: 'milo@example.com',
  avatar: '/portrait.jpg',
  resumes: { zh: '/resume-zh.pdf', en: '/resume-en.pdf' },
  projects: [{
    id: 'agent-assistant',
    title: { zh: 'Agent 研究助手', en: 'Agent Research Assistant' },
    summary: { zh: '用于整理研究资料的智能助手。', en: 'An intelligent assistant for organizing research material.' },
    problem: { zh: '研究资料分散且难以追踪。', en: 'Research material was scattered and difficult to track.' },
    contribution: { zh: '设计 Agent 流程并完成全栈实现。', en: 'Designed the agent flow and delivered the full stack.' },
    result: { zh: '形成可重复使用的研究工作流。', en: 'Produced a reusable research workflow.' },
    technologies: ['AI Agent', 'Vue', 'Spring'],
    repository: 'https://github.com/Minglu-Li/example-agent',
  }],
  experiences: [{
    id: 'software-internship',
    company: { zh: '示例科技', en: 'Example Technology' },
    role: { zh: '软件工程实习生', en: 'Software Engineering Intern' },
    period: { zh: '2025.06 — 2025.09', en: 'Jun 2025 — Sep 2025' },
    summary: { zh: '参与可靠产品功能的设计与交付。', en: 'Helped design and ship reliable product features.' },
    achievements: [{ zh: '完成可验证的端到端交付。', en: 'Completed a verifiable end-to-end delivery.' }],
  }],
}

export function makeContent(overrides: Partial<SiteContent> = {}): SiteContent {
  return {
    ...completeContent,
    ...overrides,
    ui: { ...completeContent.ui, ...overrides.ui },
    seo: { ...completeContent.seo, ...overrides.seo },
  }
}
```

- [ ] **Step 5: Run foundation verification**

Run:

```powershell
npm test -- tests/content/profile.test.ts
npm run type-check
```

Expected: both commands exit 0; two content tests pass.

- [ ] **Step 6: Commit the typed foundation**

```powershell
git add package.json package-lock.json tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts vitest.config.ts index.html src tests .gitignore
git commit -m "chore: bootstrap typed Vue portfolio"
```

---

### Task 2: Locale Controller and Document Metadata

**Files:**
- Create: `src/composables/useLocale.ts`
- Create: `tests/locale/useLocale.test.ts`
- Modify: `src/main.ts`

**Interfaces:**
- Consumes: `Locale`, `LocalizedText`, and `SiteContent` from Task 1.
- Produces: `LOCALE_STORAGE_KEY`, `LocaleController`, `localeKey`, `resolveInitialLocale`, `createLocaleController`, and `useLocale` for every component.

- [ ] **Step 1: Write locale resolution and metadata tests**

```ts
// tests/locale/useLocale.test.ts
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
    expect(document.title).toBe(content.seo.title.en)
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
```

- [ ] **Step 2: Run the locale tests and verify failure**

Run: `npm test -- tests/locale/useLocale.test.ts`

Expected: FAIL because `useLocale.ts` does not exist.

- [ ] **Step 3: Implement the locale controller**

Use these exact public contracts:

```ts
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

export function resolveInitialLocale(
  storage: StoragePort | null,
  languages: readonly string[],
): Locale

export function createLocaleController(options: {
  content: SiteContent
  storage: StoragePort | null
  languages: readonly string[]
  document: Document
}): LocaleController
```

Wrap storage reads and writes in separate `try/catch` blocks. Only accept stored values `zh` and `en`. Treat any language beginning with `zh` case-insensitively as Chinese and any other non-empty browser language as English. `setLocale` must update the ref even when persistence throws.

Set the document language to `zh-CN` for the internal `zh` locale and `en` for the internal `en` locale.

Define `localeKey` as an `InjectionKey<LocaleController>` and make `useLocale()` throw `new Error('Locale controller was not provided')` when injection is missing. In `src/main.ts`, create one controller using `siteContent`, `window.localStorage`, `navigator.languages`, and `document`, provide it to the Vue app, and mount `App`.

- [ ] **Step 4: Run locale and type verification**

Run:

```powershell
npm test -- tests/locale/useLocale.test.ts
npm run type-check
```

Expected: all locale tests pass and TypeScript reports no errors.

- [ ] **Step 5: Commit locale behavior**

```powershell
git add src/composables/useLocale.ts src/main.ts tests/locale/useLocale.test.ts
git commit -m "feat: add persistent bilingual locale"
```

---

### Task 3: Visibility Selectors, Header, Hero, and Build Trace

**Files:**
- Create: `src/content/selectors.ts`
- Create: `src/components/SiteHeader.vue`
- Create: `src/components/HeroSection.vue`
- Create: `src/components/BuildTrace.vue`
- Create: `tests/content/selectors.test.ts`
- Create: `tests/components/appShell.test.ts`
- Modify: `src/App.vue`

**Interfaces:**
- Consumes: `SiteContent`, `Locale`, and `LocaleController` from Tasks 1–2.
- Produces: `SectionVisibility`, `deriveVisibility`, `getResumeUrl`, `getPrimaryCta`, and the three top-of-page components. Later page composition uses the same visibility object.

- [ ] **Step 1: Write failing selector tests**

```ts
// tests/content/selectors.test.ts
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
```

- [ ] **Step 2: Write failing app shell tests**

Mount components with `global.provide[localeKey as symbol]` set to a controller created with jsdom. Assert:

```ts
expect(wrapper.get('header').attributes('data-testid')).toBe('site-header')
expect(wrapper.get('main h1').text()).toContain('把复杂想法做成可靠、能用的产品')
expect(wrapper.get('[data-testid="primary-cta"]').attributes('href')).toBe('https://github.com/Minglu-Li')
expect(wrapper.find('a[href="#projects"]').exists()).toBe(false)
expect(wrapper.find('[data-testid="portrait-fallback"]').text()).toBe('ML')
expect(wrapper.findAll('[data-testid="build-step"]')).toHaveLength(4)
```

Add a second mount using `makeContent()` and assert that the project navigation link and `#projects` primary CTA exist. Add a mobile-menu test that clicks the menu button and checks `aria-expanded` changes from `false` to `true`. Add a portrait failure test with `avatar: '/broken.png'`, trigger the image `error` event, and assert that `data-testid="portrait-fallback"` becomes visible with `ML`.

- [ ] **Step 3: Run selector and shell tests and verify failure**

Run:

```powershell
npm test -- tests/content/selectors.test.ts tests/components/appShell.test.ts
```

Expected: FAIL because the selectors and components are absent.

- [ ] **Step 4: Implement selectors**

```ts
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
```

- [ ] **Step 5: Implement the top-of-page components**

`SiteHeader.vue` accepts `content: SiteContent` and `visibility: SectionVisibility`. Render semantic `<header><nav aria-label="Primary">`, conditional anchor links, GitHub, a locale toggle, and a mobile menu button with `aria-controls="primary-navigation"` and reactive `aria-expanded`. Close the menu after any navigation click.

`HeroSection.vue` accepts `content: SiteContent`. Use `getPrimaryCta`, `getResumeUrl`, and `useLocale()`. External anchors use `target="_blank" rel="noreferrer"`. Render the portrait only when `content.avatar` is configured and has not emitted `error`; otherwise render `<span data-testid="portrait-fallback">ML</span>`. Render project/GitHub primary, resume secondary, and email secondary actions according to their configured states.

`BuildTrace.vue` accepts `steps: BuildStep[]` and renders one ordered-list item per step with `data-testid="build-step"`. Localize only step descriptions; retain the uppercase IDEA/AGENT/BUILD/SHIP labels.

Update `App.vue` to compute `visibility` from `siteContent` and the current locale, then render `SiteHeader`, a semantic `<main id="main-content">`, `HeroSection`, and `BuildTrace`.

- [ ] **Step 6: Run the shell test cycle**

Run:

```powershell
npm test -- tests/content/selectors.test.ts tests/components/appShell.test.ts
npm run type-check
```

Expected: all selector and app-shell tests pass; type-check exits 0.

- [ ] **Step 7: Commit the app shell**

```powershell
git add src/content/selectors.ts src/components/SiteHeader.vue src/components/HeroSection.vue src/components/BuildTrace.vue src/App.vue tests/content/selectors.test.ts tests/components/appShell.test.ts
git commit -m "feat: add bilingual portfolio hero"
```

---

### Task 4: Projects, Experience, Capabilities, Contact, and Footer

**Files:**
- Create: `src/components/ProjectsSection.vue`
- Create: `src/components/ExperienceSection.vue`
- Create: `src/components/CapabilitiesSection.vue`
- Create: `src/components/ContactSection.vue`
- Create: `src/components/SiteFooter.vue`
- Create: `tests/components/contentSections.test.ts`
- Modify: `src/App.vue`

**Interfaces:**
- Consumes: typed arrays and `LocaleController`; consumes `SectionVisibility` to decide which components enter the page.
- Produces: the complete semantic page structure and stable anchors `projects`, `experience`, `capabilities`, and `contact`.

- [ ] **Step 1: Write failing section tests**

Create one test per section using `makeContent()` and the locale provider. Required assertions:

```ts
expect(projects.get('section').attributes('id')).toBe('projects')
expect(projects.text()).toContain('Agent Research Assistant')
expect(projects.findAll('[data-testid="project-card"]')).toHaveLength(1)
expect(projects.get('a[href="https://github.com/Minglu-Li/example-agent"]').attributes('rel')).toBe('noreferrer')

expect(experience.get('section').attributes('id')).toBe('experience')
expect(experience.findAll('article')).toHaveLength(1)
expect(experience.text()).toContain('Software Engineering Intern')

expect(capabilities.findAll('[data-testid="capability-group"]')).toHaveLength(3)
expect(capabilities.text()).toContain('AI Agent')

expect(contact.get('a[href="mailto:milo@example.com"]').exists()).toBe(true)
```

Mount `App.vue` with the real `siteContent` and assert that `#projects`, `#experience`, and `#contact` do not render while `#capabilities` does. This validates that fixture data never leaks into production content.

- [ ] **Step 2: Run section tests and verify failure**

Run: `npm test -- tests/components/contentSections.test.ts`

Expected: FAIL because the section components do not exist.

- [ ] **Step 3: Implement project and experience sections**

`ProjectsSection.vue` accepts `content: SiteContent`, renders the localized `content.ui.sections.projects` heading and one `<article data-testid="project-card">` per `content.projects` case, and localizes title, summary, problem, contribution, and result. Use the localized `content.ui.labels` values for field and link labels. Render technology tags as a list. Show repository and demo anchors only when configured; use safe external-link attributes. Use a CSS-only Build Trace blueprint cover when `image` is absent, and switch a failed configured image to the same cover on `error`.

`ExperienceSection.vue` accepts `content: SiteContent`, uses the localized `content.ui.sections.experience` heading, and renders each `content.experiences` item as a timeline article with localized company, role, period, summary, and achievements. Use `<time>` only for machine-readable ISO dates; the current content contract presents periods as visible text and therefore uses a styled `<span>`.

- [ ] **Step 4: Implement capabilities, contact, and footer**

`CapabilitiesSection.vue` accepts `content: SiteContent`, uses the localized `content.ui.sections.capabilities` heading, and renders `content.capabilities` as the three confirmed capability clusters with lists, not loose chips.

`ContactSection.vue` accepts `content: SiteContent`, obtains locale through `useLocale()`, and renders localized prompt, `mailto:${content.email}`, GitHub, and the current locale resume when each exists.

`SiteFooter.vue` accepts `name: string`; render `© ${new Date().getFullYear()} Milo` plus the visible `中文 / EN` locale state. Do not add analytics or external badges.

Update `App.vue` in this exact order: Hero, Build Trace, conditional Projects, conditional Experience, Capabilities, conditional Contact, Footer. Pass `visibility` from Task 3 so missing production content never renders empty sections.

- [ ] **Step 5: Run section and regression tests**

Run:

```powershell
npm test -- tests/components/contentSections.test.ts tests/components/appShell.test.ts
npm run type-check
```

Expected: all tests pass and the complete page type-checks.

- [ ] **Step 6: Commit page content components**

```powershell
git add src/components src/App.vue tests/components/contentSections.test.ts
git commit -m "feat: add portfolio content sections"
```

---

### Task 5: Build Trace Visual System, Responsive Layout, and Motion

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`
- Create: `src/styles/layout.css`
- Create: `src/styles/motion.css`
- Create: `playwright.config.ts`
- Create: `e2e/homepage.spec.ts`
- Modify: `src/main.ts`
- Modify: `src/components/*.vue`

**Interfaces:**
- Consumes: semantic markup and stable test IDs from Tasks 3–4.
- Produces: the approved visual system, responsive behavior, keyboard focus, reduced-motion behavior, and Playwright browser harness.

- [ ] **Step 1: Configure Playwright and write failing visual behavior tests**

```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run build && npm run preview -- --host 127.0.0.1',
    port: 4173,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
})
```

Add browser assertions:

```ts
test('uses the approved design tokens and never overflows at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto('/')
  const root = page.locator(':root')
  await expect(root).toHaveCSS('--color-ink', '#14213d')
  await expect(root).toHaveCSS('--color-circuit', '#245fd4')
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
})

test.use({ reducedMotion: 'reduce' })
test('disables the signature animation when reduced motion is requested', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-testid="build-step"]').first()).toHaveCSS('animation-name', 'none')
})
```

Add a keyboard test that presses `Tab`, expects the skip link to receive focus first, presses `Enter`, and expects `#main-content` to receive focus.

- [ ] **Step 2: Run browser tests and verify failure**

Run:

```powershell
npx playwright install chromium
npm run test:e2e
```

Expected: FAIL because design tokens, responsive styles, skip link, and reduced-motion rules are absent.

- [ ] **Step 3: Implement design tokens and typography**

`tokens.css` must contain:

```css
:root {
  --color-ink: #14213d;
  --color-circuit: #245fd4;
  --color-signal: #8fb6ff;
  --color-ice: #eef4ff;
  --color-paper: #fbfcff;
  --color-muted: #52617b;
  --content-max: 73.75rem;
  --radius-card: 1rem;
  --shadow-card: 0 1.25rem 3.75rem rgb(20 33 61 / 12%);
  --font-display: 'Instrument Sans Variable', 'Noto Sans SC Variable', system-ui, sans-serif;
  --font-body: 'Noto Sans SC Variable', system-ui, sans-serif;
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
}
```

Import these files at the top of `main.ts`, before application code:

```ts
import '@fontsource-variable/instrument-sans'
import '@fontsource-variable/noto-sans-sc'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/700.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/motion.css'
```

`base.css` must set semantic typography, `box-sizing`, body background, link behavior, a visible `:focus-visible` outline using signal blue, 44px control minimums, and a visually hidden skip link that becomes visible on focus. Add `<a class="skip-link" href="#main-content">` before `SiteHeader` and render its copy from `content.ui.skipToContent` through the locale controller.

- [ ] **Step 4: Implement the approved layout**

Use a maximum width of `var(--content-max)` and a 12-column desktop grid. Hero copy spans seven columns and portrait spans five. Restrict the blueprint grid background to Hero. Place Build Trace directly below Hero as a dark ink strip. Make the first project card span more columns than following cards. Use the timeline line only inside Experience. Render capability groups in three equal columns.

At `max-width: 48rem`, switch all sections to one column, hide desktop navigation behind the menu button, stack Hero CTAs, make project cards full width, and preserve 44px control heights. At 320px, use 1rem horizontal page padding and prevent long URLs/technology names from widening the document.

- [ ] **Step 5: Implement the single orchestrated animation**

```css
@keyframes trace-activate {
  from { opacity: 0.35; transform: scale(0.82); }
  to { opacity: 1; transform: scale(1); }
}

.build-trace__step {
  animation: trace-activate 240ms ease-out both;
  animation-delay: calc(var(--trace-index) * 180ms);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .build-trace__step { animation-name: none; }
}
```

Bind `style="--trace-index: index"` on each Build Trace list item. Keep project hover feedback to a maximum 2px upward translation and a border-color change.

- [ ] **Step 6: Run tests and visually inspect desktop and mobile**

Run:

```powershell
npm run test:e2e
npm test
npm run type-check
```

Expected: all commands exit 0. Capture Playwright screenshots at 1440×1000 and 390×844, inspect them for hierarchy, clipping, bilingual line length, and empty-section gaps, then remove any ornamental element that does not support the Build Trace concept.

- [ ] **Step 7: Commit the visual system**

```powershell
git add src/styles src/main.ts src/components src/App.vue playwright.config.ts e2e/homepage.spec.ts
git commit -m "feat: apply Build Trace visual system"
```

---

### Task 6: Static Assets, SEO, Link Integrity, and Accessibility

**Files:**
- Create: `public/favicon.svg`
- Create: `scripts/generate-og.mjs`
- Create: `tests/assets/staticAssets.test.ts`
- Modify: `public/og-image.png` (generated)
- Modify: `index.html`
- Modify: `src/content/validate.ts`
- Modify: `e2e/homepage.spec.ts`

**Interfaces:**
- Consumes: `siteContent.seo`, optional asset paths, and locale metadata updates.
- Produces: deterministic favicon/OG assets, validated local assets, crawlable default metadata, link integrity, and an axe browser audit.

- [ ] **Step 1: Write failing asset and browser accessibility tests**

```ts
// tests/assets/staticAssets.test.ts
import { access } from 'node:fs/promises'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import { siteContent } from '../../src/content/profile'

describe('static assets', () => {
  it('ships the favicon and a 1200 by 630 Open Graph image', async () => {
    await access(resolve('public/favicon.svg'))
    const metadata = await sharp(resolve('public/og-image.png')).metadata()
    expect(metadata.width).toBe(1200)
    expect(metadata.height).toBe(630)
  })

  it('resolves every configured local public asset', async () => {
    const configured = [siteContent.avatar, ...Object.values(siteContent.resumes)].filter(Boolean) as string[]
    await Promise.all(configured.map((asset) => access(resolve('public', asset.replace(/^\//, '')))))
  })
})
```

Extend `e2e/homepage.spec.ts` with `AxeBuilder` and fail on serious or critical violations. Add a language-switch test that asserts the visible heading, `<html lang>`, title, description, and Open Graph title all change to English. Add link assertions that every visible external link uses `rel="noreferrer"` and every visible internal anchor resolves to an existing element.

- [ ] **Step 2: Run asset and accessibility tests and verify failure**

Run:

```powershell
npm test -- tests/assets/staticAssets.test.ts
npm run test:e2e
```

Expected: asset test FAIL because favicon and OG image do not exist; browser tests report any remaining metadata, link, or accessibility gaps.

- [ ] **Step 3: Create deterministic identity assets**

Create a square `favicon.svg` using only the approved colors. It should contain an ink background, a circuit-blue path connecting four signal-blue nodes, and a centered white `ML` monogram with no embedded raster data.

Create `scripts/generate-og.mjs` using Sharp. Render a 1200×630 SVG buffer with the ice background, a subtle 40px blueprint grid, Milo’s English headline in ink and circuit blue, the `AI AGENT · FULL-STACK ENGINEER` label in monospace styling, and the four Build Trace nodes. Write the PNG to `public/og-image.png` and log its final path. Run `npm run assets:generate` and commit the generated PNG.

- [ ] **Step 4: Complete static metadata and validation**

Set Chinese default metadata in `index.html`:

```html
<html lang="zh-CN">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="canonical" href="https://minglu-li.github.io/">
<meta name="description" content="Milo 是一名专注 AI Agent 应用的全栈开发者，擅长把复杂想法做成可靠、能用的产品。">
<meta property="og:type" content="website">
<meta property="og:url" content="https://minglu-li.github.io/">
<meta property="og:title" content="Milo · AI Agent 与全栈开发">
<meta property="og:description" content="把复杂想法做成可靠、能用的产品。">
<meta property="og:image" content="https://minglu-li.github.io/og-image.png">
<meta name="twitter:card" content="summary_large_image">
```

Extend `validateContent` so configured local assets must begin with `/` and external content URLs must be valid `http:` or `https:` URLs. Keep absent optional content legal. Do not create blank PDF or portrait files.

- [ ] **Step 5: Run asset, accessibility, and build verification**

Run:

```powershell
npm run assets:generate
npm test
npm run test:e2e
npm run build
```

Expected: all commands exit 0; `dist/favicon.svg` and `dist/og-image.png` exist; no serious or critical axe violations remain.

- [ ] **Step 6: Commit assets and accessibility**

```powershell
git add public scripts index.html src/content/validate.ts tests/assets/staticAssets.test.ts e2e/homepage.spec.ts package.json package-lock.json
git commit -m "feat: add accessible metadata and identity assets"
```

---

### Task 7: Lighthouse Gate, GitHub Pages Workflow, and Maintainer Guide

**Files:**
- Create: `lighthouserc.cjs`
- Create: `.github/workflows/deploy.yml`
- Create: `tests/config/deployment.test.ts`
- Create: `README.md`

**Interfaces:**
- Consumes: `npm test`, `npm run build`, `npm run test:e2e`, generated `dist`, and the root-path deployment contract.
- Produces: a blocking quality gate, GitHub Pages deployment, and exact instructions for adding real projects, internships, contact details, portrait, and resumes.

- [ ] **Step 1: Write the failing deployment contract test**

```ts
// tests/config/deployment.test.ts
import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

describe('GitHub Pages workflow', () => {
  it('checks the site before deploying dist from main', async () => {
    const workflow = await readFile('.github/workflows/deploy.yml', 'utf8')
    expect(workflow).toContain("branches: ['main']")
    expect(workflow).toContain('npm ci')
    expect(workflow).toContain('npm test')
    expect(workflow).toContain('npm run build')
    expect(workflow).toContain('npm run test:e2e')
    expect(workflow).toContain("path: './dist'")
    expect(workflow).toContain('actions/deploy-pages@v5')
  })
})
```

- [ ] **Step 2: Run the deployment test and verify failure**

Run: `npm test -- tests/config/deployment.test.ts`

Expected: FAIL with `ENOENT` for `.github/workflows/deploy.yml`.

- [ ] **Step 3: Add the Lighthouse quality gate**

```js
// lighthouserc.cjs
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      numberOfRuns: 3,
      settings: { chromeFlags: '--no-sandbox' },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: { target: 'filesystem', outputDir: './lhci-reports' },
  },
}
```

Run `npm run build` followed by `npm run test:lighthouse`. If any category is below 0.90, inspect the report and fix the concrete issue before proceeding.

- [ ] **Step 4: Add the GitHub Pages workflow**

Create `.github/workflows/deploy.yml` with:

- triggers for pushes to `main` and `workflow_dispatch`;
- permissions `contents: read`, `pages: write`, and `id-token: write`;
- concurrency group `pages` with `cancel-in-progress: true`;
- Node `lts/*` with npm cache;
- `npm ci`, `npm test`, `npm run build`;
- Chromium installation and `npm run test:e2e`;
- `npm run test:lighthouse`;
- `actions/configure-pages@v6`;
- `actions/upload-pages-artifact@v5` with `path: './dist'`;
- a dependent deploy job using `actions/deploy-pages@v5` and the `github-pages` environment.

The workflow must not deploy when any check fails.

- [ ] **Step 5: Write the maintainer guide**

`README.md` must include:

1. Local prerequisites and `npm ci`, `npm run dev`, `npm test`, `npm run test:e2e`, and `npm run build` commands.
2. The exact deployment URL and repository naming requirement.
3. A content update map pointing to `src/content/profile.ts`.
4. The required fields for a project and experience, with one non-production example explicitly labeled as documentation-only.
5. Instructions to place real assets in `public/` and set `/filename.ext` paths only after files exist.
6. Instructions to use separate `resume-zh.pdf` and `resume-en.pdf` files.
7. A reminder that empty optional data intentionally hides its UI and that fixture content under `tests/` is never published.

- [ ] **Step 6: Run deployment and full regression verification**

Run:

```powershell
npm test -- tests/config/deployment.test.ts
npm test
npm run build
npm run test:e2e
npm run test:lighthouse
git status --short
```

Expected: all checks exit 0; Lighthouse category scores are each at least 0.90; `git status --short` lists only the files created in this task before commit.

- [ ] **Step 7: Commit CI and documentation**

```powershell
git add .github/workflows/deploy.yml lighthouserc.cjs tests/config/deployment.test.ts README.md
git commit -m "ci: verify and deploy GitHub Pages site"
```

---

### Task 8: Final Production Review

**Files:**
- Modify: only files implicated by verification failures

**Interfaces:**
- Consumes: the complete site and every command from Tasks 1–7.
- Produces: a clean, release-ready commit whose evidence satisfies the design spec.

- [ ] **Step 1: Run the complete clean verification sequence**

```powershell
npm ci
npm run assets:generate
npm test
npm run build
npm run test:e2e
npm run test:lighthouse
```

Expected: every command exits 0 without relying on a previously running development server.

- [ ] **Step 2: Perform visual and interaction review**

Review fresh desktop and mobile screenshots from Playwright. Verify:

- Hero is the clear visual thesis and Build Trace is the only conspicuous animation.
- No empty project, internship, email, resume, or broken portrait state is visible.
- GitHub is the production primary CTA while projects remain empty.
- Chinese and English headings wrap intentionally without overlap or layout shift.
- Mobile menu, skip link, language switch, and GitHub links work with keyboard only.
- At 320px there is no horizontal scroll.
- Reduced-motion mode shows the final Build Trace state immediately.

- [ ] **Step 3: Confirm repository state and commit any verification correction**

Run:

```powershell
git status --short --branch
git log --oneline --decorate -8
```

If verification required a correction, stage only the implicated files and commit with `fix: resolve final portfolio verification findings`. If no correction was needed, create no empty commit. The final working tree must be clean.
