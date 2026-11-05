<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'
import type { SiteContent } from '../content/types'

const props = defineProps<{ content: SiteContent }>()
const { t } = useLocale()
const email = computed(() => props.content.email?.trim() || undefined)
const emailUrl = computed(() => email.value ? `mailto:${encodeURIComponent(email.value).replace(/%40/gi, '@')}` : undefined)
</script>

<template>
  <section id="contact" class="content-section contact-section" aria-labelledby="contact-heading">
    <header class="content-section__heading">
      <h2 id="contact-heading">{{ t(props.content.ui.sections.contact) }}</h2>
    </header>
    <p>{{ t(props.content.contactPrompt) }}</p>
    <p class="contact-section__links">
      <a v-if="emailUrl" :href="emailUrl">{{ t(props.content.ui.actions.emailMe) }}</a>
    </p>
  </section>
</template>
