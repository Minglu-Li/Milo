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
  <section id="notes" class="content-section notes-section" aria-labelledby="notes-heading">
    <header class="content-section__heading">
      <p class="section-kicker">{{ locale === 'zh' ? '写作' : 'Writing' }}</p>
      <h2 id="notes-heading">{{ t(props.content.ui.sections.notes) }}</h2>
    </header>
    <p v-if="props.content.posts.length === 0" class="content-section__empty">
      {{ locale === 'zh' ? '笔记正在整理中，之后会在这里更新。' : 'Notes are being prepared and will appear here soon.' }}
    </p>
    <div v-else class="notes-section__grid">
      <article v-for="post in props.content.posts" :key="post.id" class="note-card" data-testid="note-card">
        <img v-if="post.image && !failedImages.has(post.id)" :src="withBasePath(post.image)" :alt="t(post.title)" @error="markImageFailed(post.id)">
        <div v-else-if="post.image" class="content-card__image-fallback" data-testid="note-image-fallback" role="img" :aria-label="t(post.title)">{{ t(post.title) }}</div>
        <div class="note-card__body">
          <p class="note-card__date">{{ post.date }}</p>
          <h3>{{ t(post.title) }}</h3>
          <p>{{ t(post.excerpt) }}</p>
          <ul class="note-card__tags" :aria-label="locale === 'zh' ? '标签' : 'Tags'">
            <li v-for="tag in post.tags" :key="tag">{{ tag }}</li>
          </ul>
          <a
            v-if="post.href"
            :href="isExternal(post.href) ? post.href : withBasePath(post.href)"
            :target="isExternal(post.href) ? '_blank' : undefined"
            :rel="isExternal(post.href) ? 'noreferrer' : undefined"
          >
            {{ locale === 'zh' ? '阅读文章' : 'Read note' }}
          </a>
        </div>
      </article>
    </div>
  </section>
</template>
