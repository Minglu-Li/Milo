<script setup lang="ts">
import { computed } from 'vue'
import BuildTrace from './components/BuildTrace.vue'
import HeroSection from './components/HeroSection.vue'
import SiteHeader from './components/SiteHeader.vue'
import { useLocale } from './composables/useLocale'
import { deriveVisibility } from './content/selectors'
import { siteContent } from './content/profile'

const { locale } = useLocale()
const visibility = computed(() => deriveVisibility(siteContent, locale.value))
</script>

<template>
  <SiteHeader :content="siteContent" :visibility="visibility" />
  <main id="main-content">
    <HeroSection :content="siteContent" />
    <BuildTrace :steps="siteContent.buildSteps" />
  </main>
</template>
