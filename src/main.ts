import { createApp } from 'vue'
import '@fontsource-variable/instrument-sans'
import '@fontsource-variable/noto-sans-sc'
import '@fontsource/ibm-plex-mono/500.css'
import '@fontsource/ibm-plex-mono/700.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import './styles/motion.css'
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

