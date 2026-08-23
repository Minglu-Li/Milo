<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '../composables/useLocale'
import { getPrimaryCta, getResumeUrl } from '../content/selectors'
import type { SiteContent } from '../content/types'

const props = defineProps<{ content: SiteContent }>()

const { locale, t } = useLocale()
const portraitFailed = ref(false)
const primaryCta = computed(() => getPrimaryCta(props.content))
const resumeUrl = computed(() => getResumeUrl(props.content, locale.value))
const emailUrl = computed(() => {
  const email = props.content.email?.trim()
  return email ? `mailto:${encodeURIComponent(email).replace(/%40/gi, '@')}` : undefined
})
</script>

<template>
  <section class="hero" aria-labelledby="hero-heading">
    <div class="hero__copy">
      <p class="hero__role">{{ t(props.content.role) }}</p>
      <h1 id="hero-heading">{{ t(props.content.headline) }}</h1>
      <p class="hero__intro">{{ t(props.content.intro) }}</p>
      <div class="hero__actions" aria-label="Actions">
        <a
          class="hero__action hero__action--primary"
          data-testid="primary-cta"
          :href="primaryCta.href"
          :target="primaryCta.external ? '_blank' : undefined"
          :rel="primaryCta.external ? 'noreferrer' : undefined"
        >
          {{ primaryCta.kind === 'projects' ? t(props.content.ui.actions.viewProjects) : t(props.content.ui.actions.visitGitHub) }}
        </a>
        <a v-if="resumeUrl" class="hero__action" :href="resumeUrl">{{ t(props.content.ui.actions.viewResume) }}</a>
        <a v-if="emailUrl" class="hero__action" :href="emailUrl">{{ t(props.content.ui.actions.emailMe) }}</a>
      </div>
    </div>
    <div class="hero__portrait" aria-label="Portrait">
      <img
        v-if="props.content.avatar && !portraitFailed"
        :src="props.content.avatar"
        :alt="`${props.content.name} portrait`"
        @error="portraitFailed = true"
      >
      <span v-else class="hero__portrait-fallback" data-testid="portrait-fallback">{{ props.content.initials }}</span>
    </div>
  </section>
</template>
