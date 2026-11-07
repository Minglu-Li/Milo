<script setup lang="ts">
import { ref } from 'vue'
import { useLocale } from '../composables/useLocale'
import { withBasePath } from '../content/selectors'
import type { SiteContent } from '../content/types'

const props = defineProps<{ content: SiteContent }>()

const { t } = useLocale()
const failedImages = ref(new Set<string>())
const failedLogos = ref(new Set<string>())

function markImageFailed(projectId: string): void {
  failedImages.value = new Set([...failedImages.value, projectId])
}

function markLogoFailed(projectId: string): void {
  failedLogos.value = new Set([...failedLogos.value, projectId])
}
</script>

<template>
  <section id="projects" class="content-section projects-section" aria-labelledby="projects-heading">
    <header class="content-section__heading">
      <h2 id="projects-heading">{{ t(props.content.ui.sections.projects) }}</h2>
    </header>
    <div class="projects-section__grid">
      <article v-for="project in props.content.projects" :key="project.id" class="project-card" data-testid="project-card">
        <div class="project-card__cover">
          <img
            v-if="project.image && !failedImages.has(project.id)"
            :src="withBasePath(project.image)"
            :alt="t(project.title)"
            @error="markImageFailed(project.id)"
          >
          <div v-else class="project-card__blueprint" data-testid="project-blueprint" aria-hidden="true">
            <span>IDEA</span><span>→</span><span>BUILD</span><span>→</span><span>SHIP</span>
          </div>
        </div>
        <div class="project-card__body">
          <div class="project-card__title">
            <img
              v-if="project.logo && !failedLogos.has(project.id)"
              class="project-card__logo"
              data-testid="project-logo"
              :src="withBasePath(project.logo)"
              :alt="`${t(project.title)} ${t(props.content.ui.labels.logo)}`"
              @error="markLogoFailed(project.id)"
            >
            <h3>{{ t(project.title) }}</h3>
          </div>
          <p>{{ t(project.summary) }}</p>
          <dl v-if="!project.compact" class="project-card__details">
            <div><dt>{{ t(props.content.ui.labels.problem) }}</dt><dd>{{ t(project.problem) }}</dd></div>
            <div><dt>{{ t(props.content.ui.labels.contribution) }}</dt><dd>{{ t(project.contribution) }}</dd></div>
            <div><dt>{{ t(props.content.ui.labels.result) }}</dt><dd>{{ t(project.result) }}</dd></div>
          </dl>
          <ul v-if="!project.compact" class="project-card__technologies">
            <li v-for="technology in project.technologies" :key="technology">{{ technology }}</li>
          </ul>
          <p class="project-card__links">
            <a v-if="project.repository" :href="project.repository" target="_blank" rel="noreferrer">{{ t(props.content.ui.labels.repository) }}</a>
            <a v-if="project.demo" :href="project.demo" target="_blank" rel="noreferrer">{{ t(props.content.ui.labels.demo) }}</a>
          </p>
        </div>
      </article>
    </div>
  </section>
</template>
