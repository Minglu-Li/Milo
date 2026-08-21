<script setup lang="ts">
import { useLocale } from '../composables/useLocale'
import type { SiteContent } from '../content/types'

const props = defineProps<{ content: SiteContent }>()
const { t } = useLocale()
</script>

<template>
  <section id="experience" class="content-section experience-section" aria-labelledby="experience-heading">
    <header class="content-section__heading">
      <h2 id="experience-heading">{{ t(props.content.ui.sections.experience) }}</h2>
    </header>
    <ol class="experience-section__timeline">
      <li v-for="experience in props.content.experiences" :key="experience.id">
        <article class="experience-card">
          <header>
            <p class="experience-card__company">{{ t(experience.company) }}</p>
            <h3>{{ t(experience.role) }}</h3>
            <span class="experience-card__period">{{ t(experience.period) }}</span>
          </header>
          <p>{{ t(experience.summary) }}</p>
          <ul>
            <li v-for="achievement in experience.achievements" :key="t(achievement)">{{ t(achievement) }}</li>
          </ul>
        </article>
      </li>
    </ol>
  </section>
</template>
