<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'
import { getResumeUrl } from '../content/selectors'
import type { SiteContent } from '../content/types'

const props = defineProps<{ content: SiteContent }>()
const { locale, t } = useLocale()
const resumeUrl = computed(() => getResumeUrl(props.content, locale.value))
const emailUrl = computed(() => `mailto:${props.content.email?.trim() ?? ''}`)
</script>

<template>
  <section id="contact" class="content-section contact-section" aria-labelledby="contact-heading">
    <header class="content-section__heading">
      <h2 id="contact-heading">{{ t(props.content.ui.sections.contact) }}</h2>
    </header>
    <p>{{ t(props.content.contactPrompt) }}</p>
    <p class="contact-section__links">
      <a :href="emailUrl">{{ t(props.content.ui.actions.emailMe) }}</a>
      <a :href="props.content.github" target="_blank" rel="noreferrer">GitHub</a>
      <a v-if="resumeUrl" :href="resumeUrl">{{ t(props.content.ui.actions.viewResume) }}</a>
    </p>
  </section>
</template>
