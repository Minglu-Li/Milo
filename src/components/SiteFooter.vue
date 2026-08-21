<script setup lang="ts">
import { useLocale } from '../composables/useLocale'

defineProps<{ name: string }>()
const { locale } = useLocale()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <p>© {{ year }} {{ name }}</p>
    <p :aria-label="locale === 'zh' ? '当前语言：中文' : 'Current language: English'">中文 / EN</p>
  </footer>
</template>
