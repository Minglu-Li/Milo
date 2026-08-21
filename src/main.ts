import { createApp } from 'vue'
import App from './App.vue'
import { siteContent } from './content/profile'
import { createLocaleController, localeKey } from './composables/useLocale'

const app = createApp(App)
const localeController = createLocaleController({
  content: siteContent,
  storage: window.localStorage,
  languages: navigator.languages,
  document,
})

app.provide(localeKey, localeController)
app.mount('#app')
