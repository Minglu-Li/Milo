# Milo — personal homepage

This repository contains the bilingual static homepage published at
[`https://minglu-li.github.io/`](https://minglu-li.github.io/). GitHub Pages expects the repository to be named exactly `Minglu-Li.github.io` (case-sensitive in the public URL), with the site built from the `main` branch.

## Local development

Prerequisite: Node.js 24 or newer and npm. Install the locked dependencies, then start Vite:

```sh
npm ci
npm run dev
```

Useful checks:

```sh
npm test              # unit and component tests
npm run type-check    # TypeScript/Vue type checking
npm run test:e2e      # Playwright browser checks
npm run build         # production build in dist/
npm run test:lighthouse
```

## Updating content

All public copy lives in [`src/content/profile.ts`](src/content/profile.ts). Keep Chinese and English values together in each `LocalizedText` object; components should remain presentation-only. The content map covers identity, headline, capabilities, projects, experience, contact details, resumes, and SEO metadata.

A project requires `id`, `title`, `summary`, `problem`, `contribution`, `result`, and `technologies`. `repository`, `demo`, and `image` are optional. An experience requires `id`, `company`, `role`, `period`, `summary`, and `achievements`.

The following is a documentation-only example; it is not production content and is not published:

```ts
// Documentation-only example — do not copy into the live data without real, verified details.
const exampleProject = {
  id: 'example-agent',
  title: { zh: '示例项目', en: 'Example project' },
  summary: { zh: '示例摘要', en: 'Example summary' },
  problem: { zh: '真实问题', en: 'A real problem' },
  contribution: { zh: '我的贡献', en: 'My contribution' },
  result: { zh: '可验证结果', en: 'A verifiable result' },
  technologies: ['TypeScript'],
}
```

Put real portrait, project images, and PDF files in `public/`. Only set a path such as `/portrait.jpg` or `/project.png` after that exact file exists in `public/`; root-relative paths are published as-is. Keep the two resume files separate: `public/resume-zh.pdf` and `public/resume-en.pdf`, and map them to the matching locale in `profile.ts`.

Empty optional data is intentional: empty `projects` or `experiences` arrays hide their sections and navigation, while missing email, portrait, or resume values hide those actions (the portrait uses the `ML` fallback). Fixture content under `tests/` exists only for automated tests and is never copied to or published from `dist/`.

## Deployment

Every push to `main` (or a manual `workflow_dispatch`) runs dependency installation, tests, a production build, Chromium-backed E2E checks, and the Lighthouse gate. The Pages artifact is uploaded only when all checks pass, then deployed to the `github-pages` environment.
