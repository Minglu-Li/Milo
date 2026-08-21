<script setup lang="ts">
import { useLocale } from '../composables/useLocale'
import type { BuildStep } from '../content/types'

defineProps<{ steps: BuildStep[] }>()

const { t } = useLocale()
</script>

<template>
  <section class="build-trace" aria-label="Build Trace">
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
