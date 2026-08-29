<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '../composables/useLocale'
import type { SiteContent } from '../content/types'

const props = defineProps<{ content: SiteContent }>()
const { t } = useLocale()
const failedLogos = ref(new Set<string>())

function markLogoFailed(experienceId: string): void {
  failedLogos.value = new Set([...failedLogos.value, experienceId])
}
</script>

<template>
  <section id="experience" class="content-section experience-section" aria-labelledby="experience-heading">
    <header class="content-section__heading">
      <h2 id="experience-heading">{{ t(props.content.ui.sections.experience) }}</h2>
    </header>
    <ol class="experience-section__timeline">
      <li v-for="experience in props.content.experiences" :key="experience.id">
        <article class="experience-card">
          <header class="experience-card__header">
            <img
              v-if="experience.logo && !failedLogos.has(experience.id)"
              class="experience-card__logo"
              data-testid="experience-logo"
              :src="experience.logo"
              :alt="`${t(experience.company)} ${t(props.content.ui.labels.logo)}`"
              @error="markLogoFailed(experience.id)"
            >
            <div class="experience-card__heading">
              <p class="experience-card__company">{{ t(experience.company) }}</p>
              <h3>{{ t(experience.role) }}</h3>
              <span class="experience-card__period">{{ t(experience.period) }}</span>
            </div>
          </header>
          <p class="experience-card__summary">{{ t(experience.summary) }}</p>
          <div class="experience-card__stack">
            <p class="experience-card__stack-label">{{ t(props.content.ui.labels.technologies) }}</p>
            <ul class="experience-card__technologies" data-testid="experience-technologies" :aria-label="t(props.content.ui.labels.technologies)">
              <li v-for="technology in experience.technologies" :key="technology">{{ technology }}</li>
            </ul>
          </div>
          <ul class="experience-card__achievements">
            <li v-for="(achievement, index) in experience.achievements" :key="`${experience.id}-${index}`">{{ t(achievement) }}</li>
          </ul>
        </article>
      </li>
    </ol>
  </section>
</template>
