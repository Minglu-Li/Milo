<script setup lang="ts">
import { useLocale } from '../composables/useLocale'
import { withBasePath } from '../content/selectors'
import type { SiteContent } from '../content/types'

const props = defineProps<{ content: SiteContent }>()
const { locale, t } = useLocale()

function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href)
}
</script>

<template>
  <section id="interests" class="content-section interests-section" aria-labelledby="interests-heading">
    <header class="content-section__heading">
      <p class="section-kicker">Outside the build</p>
      <h2 id="interests-heading">{{ t(props.content.ui.sections.interests) }}</h2>
    </header>
    <div class="interests-section__grid">
      <article v-for="interest in props.content.interests" :key="interest.id" class="interest-card" data-testid="interest-card">
        <img v-if="interest.image" :src="withBasePath(interest.image)" :alt="t(interest.title)">
        <div class="interest-card__body">
          <h3>{{ t(interest.title) }}</h3>
          <p>{{ t(interest.description) }}</p>
          <ul class="interest-card__tags" aria-label="Tags">
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
