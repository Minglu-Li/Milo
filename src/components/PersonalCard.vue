<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '../composables/useLocale'
import { getResumeUrl, withBasePath } from '../content/selectors'
import type { SiteContent } from '../content/types'

const props = defineProps<{ content: SiteContent }>()

const { locale, t } = useLocale()
const portraitFailed = ref(false)
const resumeUrl = computed(() => {
  const path = getResumeUrl(props.content, locale.value)
  return path ? withBasePath(path) : undefined
})
const email = computed(() => props.content.email?.trim() || undefined)
const emailUrl = computed(() => email.value ? `mailto:${encodeURIComponent(email.value).replace(/%40/gi, '@')}` : undefined)
</script>

<template>
  <aside class="personal-card" data-testid="personal-card" aria-label="Personal profile">
    <div class="personal-card__portrait">
      <img
        v-if="props.content.avatar && !portraitFailed"
        :src="withBasePath(props.content.avatar)"
        :alt="`${props.content.name} portrait`"
        @error="portraitFailed = true"
      >
      <span v-else class="personal-card__portrait-fallback" data-testid="portrait-fallback">{{ props.content.initials }}</span>
    </div>
    <div class="personal-card__identity">
      <p class="personal-card__eyebrow">Personal site</p>
      <h2>{{ props.content.name }}</h2>
      <p class="personal-card__role">{{ t(props.content.role) }}</p>
    </div>
    <dl class="personal-card__meta">
      <template v-if="props.content.location">
        <dt>{{ locale === 'zh' ? '所在地' : 'Based in' }}</dt>
        <dd>{{ t(props.content.location) }}</dd>
      </template>
      <template v-if="props.content.status">
        <dt>{{ locale === 'zh' ? '当前状态' : 'Now' }}</dt>
        <dd>{{ t(props.content.status) }}</dd>
      </template>
    </dl>
    <div class="personal-card__links">
      <a v-if="emailUrl" :href="emailUrl">{{ email }}</a>
      <a :href="props.content.github" target="_blank" rel="noreferrer">GitHub</a>
      <a v-if="resumeUrl" :href="resumeUrl">{{ t(props.content.ui.actions.viewResume) }}</a>
    </div>
  </aside>
</template>
