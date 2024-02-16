/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import ToastPlugin from 'vue-toast-notification'
// import './style.css'
import 'primevue/resources/themes/aura-light-green/theme.css'

loadFonts()

// Create vue app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(vuetify)
app.use(router)
app.use(PrimeVue)
app.use(layoutsPlugin)
app.use(ToastPlugin)

// Mount vue app
app.mount('#app')

export const useGlobals = () => app.config.globalProperties
