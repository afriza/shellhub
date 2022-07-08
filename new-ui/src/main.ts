import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { key, store } from "./store";
import router from "./router";

import { loadFonts } from './plugins/webfontloader'

loadFonts()

createApp(App)
  .use(vuetify)
  .use(router)
  .use(store, key)
  .mount('#app')
