<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '../composables/useLocale'
import { getPrimaryCta } from '../content/selectors'
import type { SiteContent } from '../content/types'
import PersonalCard from './PersonalCard.vue'

const props = defineProps<{ content: SiteContent }>()

const { t } = useLocale()
const primaryCta = computed(() => getPrimaryCta(props.content))
</script>

<template>
  <section class="hero" aria-labelledby="hero-heading">
    <PersonalCard :content="props.content" />
    <div class="hero__copy">
      <p class="hero__role">Personal site / AI applications / Notes</p>
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
        <a v-if="props.content.posts.length > 0" class="hero__action" href="#notes">
          {{ t(props.content.ui.sections.notes) }}
        </a>
      </div>
    </div>
  </section>
</template>
