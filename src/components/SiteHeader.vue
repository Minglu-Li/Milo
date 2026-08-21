<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '../composables/useLocale'
import type { SiteContent } from '../content/types'
import type { SectionVisibility } from '../content/selectors'

const props = defineProps<{
  content: SiteContent
  visibility: SectionVisibility
}>()

const { locale, setLocale, t } = useLocale()
const menuOpen = ref(false)
const nextLocale = computed(() => locale.value === 'zh' ? 'en' : 'zh')

function closeMenu(): void {
  menuOpen.value = false
}

function toggleLocale(): void {
  setLocale(nextLocale.value)
}
</script>

<template>
  <header class="site-header" data-testid="site-header">
    <nav class="site-header__nav" aria-label="Primary">
      <a class="site-header__brand" href="#main-content" @click="closeMenu">{{ props.content.name }}</a>
      <button
        class="site-header__menu"
        type="button"
        data-testid="menu-button"
        aria-controls="primary-navigation"
        :aria-expanded="menuOpen"
        @click="menuOpen = !menuOpen"
      >
        {{ t(props.content.ui.menu) }}
      </button>
      <div id="primary-navigation" class="site-header__links" :class="{ 'is-open': menuOpen }">
        <a v-if="props.visibility.projects" href="#projects" @click="closeMenu">{{ t(props.content.ui.nav.projects) }}</a>
        <a v-if="props.visibility.experience" href="#experience" @click="closeMenu">{{ t(props.content.ui.nav.experience) }}</a>
        <a href="#capabilities" @click="closeMenu">{{ t(props.content.ui.nav.capabilities) }}</a>
        <a v-if="props.visibility.contact" href="#contact" @click="closeMenu">{{ t(props.content.ui.nav.contact) }}</a>
        <a :href="props.content.github" target="_blank" rel="noreferrer" @click="closeMenu">GitHub</a>
        <button class="site-header__locale" type="button" :aria-label="t(props.content.ui.language)" @click="toggleLocale">
          {{ locale === 'zh' ? 'EN' : '中文' }}
        </button>
      </div>
    </nav>
  </header>
</template>
