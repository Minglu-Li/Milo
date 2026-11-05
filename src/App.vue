<script setup lang="ts">
import { computed } from 'vue'
import BuildTrace from './components/BuildTrace.vue'
import CapabilitiesSection from './components/CapabilitiesSection.vue'
import ContactSection from './components/ContactSection.vue'
import ExperienceSection from './components/ExperienceSection.vue'
import HeroSection from './components/HeroSection.vue'
import InterestsSection from './components/InterestsSection.vue'
import NotesSection from './components/NotesSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
import { useLocale } from './composables/useLocale'
import { deriveVisibility } from './content/selectors'
import { siteContent } from './content/profile'

const { locale, t } = useLocale()
const visibility = computed(() => deriveVisibility(siteContent, locale.value))
</script>

<template>
  <a class="skip-link" href="#main-content">{{ t(siteContent.ui.skipToContent) }}</a>
  <SiteHeader :content="siteContent" :visibility="visibility" />
  <main id="main-content" tabindex="-1">
    <HeroSection :content="siteContent" />
    <BuildTrace :steps="siteContent.buildSteps" />
    <ProjectsSection v-if="visibility.projects" :content="siteContent" />
    <ExperienceSection v-if="visibility.experience" :content="siteContent" />
    <NotesSection v-if="visibility.notes" :content="siteContent" />
    <InterestsSection v-if="visibility.interests" :content="siteContent" />
    <CapabilitiesSection :content="siteContent" />
    <ContactSection v-if="visibility.contact" :content="siteContent" />
  </main>
  <SiteFooter :name="siteContent.name" />
</template>
