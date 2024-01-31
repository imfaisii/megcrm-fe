/* eslint-disable import/order */
import '@/@iconify/icons-bundle'
import App from '@/App.vue'
import layoutsPlugin from '@/plugins/layouts'
import vuetify from '@/plugins/vuetify'
import { loadFonts } from '@/plugins/webfontloader'
import router from '@/router'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import LaravelPermissionToVueJS from 'laravel-permission-to-vuejs'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import ToastPlugin from 'vue-toast-notification'

import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

loadFonts()

// Create vue app
const app = createApp(App)

// Use plugins
app.use(vuetify)
app.use(createPinia())
app.use(router)
app.use(layoutsPlugin)
app.use(ToastPlugin)
app.use(LaravelPermissionToVueJS)
app.component('VueDatePicker', VueDatePicker);

// Mount vue app
app.mount('#app')

export const useGlobals = () => app.config.globalProperties
