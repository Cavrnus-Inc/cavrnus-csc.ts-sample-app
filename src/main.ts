import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import pinia from "./state"
import App from './App.vue';
import { createMemoryHistory, createRouter } from 'vue-router'
import { routes } from './router/routes'

const router = createRouter({
	history: createMemoryHistory(),
	routes,
  })

const vuetify = createVuetify({
	components,
	directives,
});

createApp(App).use(vuetify).use(router).use(pinia).mount('#app');
