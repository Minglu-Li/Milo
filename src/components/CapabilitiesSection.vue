<script setup lang="ts">
import { useLocale } from '../composables/useLocale'
import type { SiteContent } from '../content/types'

const props = defineProps<{ content: SiteContent }>()
const { t } = useLocale()
</script>

<template>
  <section id="capabilities" class="content-section capabilities-section" aria-labelledby="capabilities-heading">
    <header class="content-section__heading">
      <h2 id="capabilities-heading">{{ t(props.content.ui.sections.capabilities) }}</h2>
    </header>
    <div class="capabilities-section__groups">
      <article v-for="group in props.content.capabilities" :key="group.id" class="capability-group" data-testid="capability-group">
        <h3>{{ t(group.title) }}</h3>
        <p>{{ t(group.description) }}</p>
        <ul>
          <li v-for="item in group.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>
