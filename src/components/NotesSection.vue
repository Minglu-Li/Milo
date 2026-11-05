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
  <section id="notes" class="content-section notes-section" aria-labelledby="notes-heading">
    <header class="content-section__heading">
      <p class="section-kicker">Writing</p>
      <h2 id="notes-heading">{{ t(props.content.ui.sections.notes) }}</h2>
    </header>
    <div class="notes-section__grid">
      <article v-for="post in props.content.posts" :key="post.id" class="note-card" data-testid="note-card">
        <img v-if="post.image" :src="withBasePath(post.image)" :alt="t(post.title)">
        <div class="note-card__body">
          <p class="note-card__date">{{ post.date }}</p>
          <h3>{{ t(post.title) }}</h3>
          <p>{{ t(post.excerpt) }}</p>
          <ul class="note-card__tags" aria-label="Tags">
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
