import type { LocalizedText, SiteContent } from './types'

function validateLocalizedText(value: LocalizedText, path: string, errors: string[]) {
  if (!value.zh.trim()) {
    errors.push(`${path}.zh must not be blank`)
  }

  if (!value.en.trim()) {
    errors.push(`${path}.en must not be blank`)
  }
}

function validateExternalUrl(value: string, path: string, errors: string[]) {
  try {
    const url = new URL(value)

    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      errors.push(`${path} must use http or https`)
    }
  } catch {
    errors.push(`${path} must use http or https`)
  }
}

function validateLocalAssetPath(value: string, path: string, errors: string[]) {
  const hasTraversalSegment = value.split('/').some((segment) => segment === '.' || segment === '..')

  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\') || hasTraversalSegment) {
    errors.push(`${path} must start with /`)
  }
}

function validateAssetOrExternalUrl(value: string, path: string, errors: string[]) {
  if (value.startsWith('/')) {
    validateLocalAssetPath(value, path, errors)
  } else {
    validateExternalUrl(value, path, errors)
  }
}

export function validateContent(content: SiteContent): string[] {
  const errors: string[] = []

  validateLocalizedText(content.role, 'role', errors)
  validateLocalizedText(content.headline, 'headline', errors)
  validateLocalizedText(content.intro, 'intro', errors)
  validateExternalUrl(content.github, 'github', errors)

  if (content.avatar !== undefined) {
    validateLocalAssetPath(content.avatar, 'avatar', errors)
  }

  if (content.location !== undefined) {
    validateLocalizedText(content.location, 'location', errors)
  }

  if (content.status !== undefined) {
    validateLocalizedText(content.status, 'status', errors)
  }

  for (const locale of ['zh', 'en'] as const) {
    const resume = content.resumes[locale]
    if (resume !== undefined) {
      validateLocalAssetPath(resume, `resumes.${locale}`, errors)
    }
  }

  content.projects.forEach((project, index) => {
    const path = `projects.${index}`
    validateLocalizedText(project.title, `${path}.title`, errors)
    validateLocalizedText(project.summary, `${path}.summary`, errors)
    validateLocalizedText(project.problem, `${path}.problem`, errors)
    validateLocalizedText(project.contribution, `${path}.contribution`, errors)
    validateLocalizedText(project.result, `${path}.result`, errors)

    if (project.repository !== undefined) {
      validateExternalUrl(project.repository, `${path}.repository`, errors)
    }

    if (project.demo !== undefined) {
      validateExternalUrl(project.demo, `${path}.demo`, errors)
    }

    if (project.image !== undefined) {
      validateLocalAssetPath(project.image, `${path}.image`, errors)
    }

    if (project.logo !== undefined) {
      validateLocalAssetPath(project.logo, `${path}.logo`, errors)
    }
  })

  content.experiences.forEach((experience, index) => {
    const path = `experiences.${index}`
    validateLocalizedText(experience.company, `${path}.company`, errors)
    validateLocalizedText(experience.role, `${path}.role`, errors)
    validateLocalizedText(experience.period, `${path}.period`, errors)
    validateLocalizedText(experience.summary, `${path}.summary`, errors)

    if (experience.logo !== undefined) {
      validateLocalAssetPath(experience.logo, `${path}.logo`, errors)
    }

    if (experience.technologies.length === 0) {
      errors.push(path + '.technologies must not be empty')
    }

    experience.technologies.forEach((technology, technologyIndex) => {
      if (!technology.trim()) {
        errors.push(path + '.technologies.' + technologyIndex + ' must not be blank')
      }
    })

    experience.achievements.forEach((achievement, achievementIndex) => {
      validateLocalizedText(achievement, `${path}.achievements.${achievementIndex}`, errors)
    })
  })

  content.posts.forEach((post, index) => {
    const path = `posts.${index}`
    validateLocalizedText(post.title, `${path}.title`, errors)
    validateLocalizedText(post.excerpt, `${path}.excerpt`, errors)
    if (!post.date.trim()) {
      errors.push(`${path}.date must not be blank`)
    }
    post.tags.forEach((tag, tagIndex) => {
      if (!tag.trim()) {
        errors.push(`${path}.tags.${tagIndex} must not be blank`)
      }
    })
    if (post.image !== undefined) {
      validateLocalAssetPath(post.image, `${path}.image`, errors)
    }
    if (post.href !== undefined) {
      validateAssetOrExternalUrl(post.href, `${path}.href`, errors)
    }
  })

  content.interests.forEach((interest, index) => {
    const path = `interests.${index}`
    validateLocalizedText(interest.title, `${path}.title`, errors)
    validateLocalizedText(interest.description, `${path}.description`, errors)
    interest.tags.forEach((tag, tagIndex) => {
      if (!tag.trim()) {
        errors.push(`${path}.tags.${tagIndex} must not be blank`)
      }
    })
    if (interest.image !== undefined) {
      validateLocalAssetPath(interest.image, `${path}.image`, errors)
    }
    if (interest.href !== undefined) {
      validateAssetOrExternalUrl(interest.href, `${path}.href`, errors)
    }
  })

  content.capabilities.forEach((capability, index) => {
    const path = `capabilities.${index}`
    validateLocalizedText(capability.title, `${path}.title`, errors)
    validateLocalizedText(capability.description, `${path}.description`, errors)
    capability.items.forEach((item, itemIndex) => {
      validateLocalizedText(item, `${path}.items.${itemIndex}`, errors)
    })
  })

  content.buildSteps.forEach((step, index) => {
    validateLocalizedText(step.description, `buildSteps.${index}.description`, errors)
  })

  validateLocalizedText(content.contactPrompt, 'contactPrompt', errors)

  for (const key of ['projects', 'experience', 'capabilities', 'contact'] as const) {
    validateLocalizedText(content.ui.nav[key], `ui.nav.${key}`, errors)
    validateLocalizedText(content.ui.sections[key], `ui.sections.${key}`, errors)
  }

  for (const key of ['problem', 'contribution', 'result', 'repository', 'demo', 'logo', 'technologies'] as const) {
    validateLocalizedText(content.ui.labels[key], `ui.labels.${key}`, errors)
  }

  for (const key of ['viewProjects', 'visitGitHub', 'viewResume', 'emailMe'] as const) {
    validateLocalizedText(content.ui.actions[key], `ui.actions.${key}`, errors)
  }

  validateLocalizedText(content.ui.menu, 'ui.menu', errors)
  validateLocalizedText(content.ui.language, 'ui.language', errors)
  validateLocalizedText(content.ui.skipToContent, 'ui.skipToContent', errors)

  validateLocalizedText(content.seo.title, 'seo.title', errors)
  validateLocalizedText(content.seo.description, 'seo.description', errors)
  validateExternalUrl(content.seo.canonical, 'seo.canonical', errors)
  validateLocalAssetPath(content.seo.ogImage, 'seo.ogImage', errors)

  return errors
}
