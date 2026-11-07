<script setup lang="ts">
import { useLocale } from '../composables/useLocale'
import { ref } from 'vue'
import { withBasePath } from '../content/selectors'
import type { SiteContent } from '../content/types'

const props = defineProps<{ content: SiteContent }>()
const { locale, t } = useLocale()
const failedImages = ref(new Set<string>())

function isExternal(href: string): boolean {
  try {
    return ['http:', 'https:'].includes(new URL(href.trim()).protocol)
  } catch {
    return false
  }
}

function markImageFailed(id: string): void {
  failedImages.value = new Set(failedImages.value).add(id)
}
</script>

<template>
  <section id="interests" class="content-section interests-section" aria-labelledby="interests-heading">
    <header class="content-section__heading">
      <p class="section-kicker">{{ locale === 'zh' ? '工作之外' : 'Outside the build' }}</p>
      <h2 id="interests-heading">{{ t(props.content.ui.sections.interests) }}</h2>
    </header>
    <div class="interests-section__grid">
      <article v-for="interest in props.content.interests" :key="interest.id" class="interest-card" data-testid="interest-card">
        <img v-if="interest.image && !failedImages.has(interest.id)" :src="withBasePath(interest.image)" :alt="t(interest.title)" @error="markImageFailed(interest.id)">
        <div v-else-if="interest.image" class="content-card__image-fallback" data-testid="interest-image-fallback" role="img" :aria-label="t(interest.title)">{{ t(interest.title) }}</div>
        <div class="interest-card__body">
          <h3>{{ t(interest.title) }}</h3>
          <p>{{ t(interest.description) }}</p>
          <ul class="interest-card__tags" :aria-label="locale === 'zh' ? '标签' : 'Tags'">
            <li v-for="tag in interest.tags" :key="tag">{{ tag }}</li>
          </ul>
          <a
            v-if="interest.href"
            :href="isExternal(interest.href) ? interest.href : withBasePath(interest.href)"
            :target="isExternal(interest.href) ? '_blank' : undefined"
            :rel="isExternal(interest.href) ? 'noreferrer' : undefined"
          >
            {{ locale === 'zh' ? '继续了解' : 'Explore' }}
          </a>
        </div>
      </article>
    </div>
  </section>
</template>
