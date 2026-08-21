<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useLocale } from '../composables/useLocale'
import type { BuildStep } from '../content/types'

defineProps<{ steps: BuildStep[] }>()

const { t } = useLocale()
const isReducedMotion = ref(false)

onMounted(() => {
  isReducedMotion.value = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
})
</script>

<template>
  <section class="build-trace" :class="{ 'is-reduced-motion': isReducedMotion }" aria-label="Build Trace">
    <ol class="build-trace__steps">
      <li
        v-for="(step, index) in steps"
        :key="step.id"
        class="build-trace__step"
        data-testid="build-step"
        :style="{ '--trace-index': index }"
      >
        <strong class="build-trace__label">{{ step.label }}</strong>
        <span class="build-trace__description">{{ t(step.description) }}</span>
      </li>
    </ol>
  </section>
</template>
