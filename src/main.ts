/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import errorimage from "@images/custom/404.jpg"
import loadimage from "@images/custom/loading.gif"
import '@styles/styles.scss'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import VueLazyload from 'vue-lazyload'
import ToastPlugin from 'vue-toast-notification'

// import './style.css'
import 'primevue/resources/themes/aura-light-green/theme.css'
import 'vue-easy-lightbox/dist/external-css/vue-easy-lightbox.css'

loadFonts()

// Create vue app
const app = createApp(App)

// Use plugins
app.use(createPinia())
app.use(VueLazyload, {
  preLoad: 1.3,
  error: errorimage,
  loading: loadimage,
  attempt: 1
})
app.use(vuetify)
app.use(router)
app.use(PrimeVue)
app.use(layoutsPlugin)
app.use(VueEasyLightbox)
app.use(ToastPlugin)

// Mount vue app
app.mount('#app')

export const useGlobals = () => app.config.globalProperties
