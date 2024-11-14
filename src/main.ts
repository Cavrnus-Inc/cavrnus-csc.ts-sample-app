import { createApp } from 'vue'

import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css' 

import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

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
	icons: {
		defaultSet: 'mdi',
		aliases,
		sets: {
		  mdi,
		},
	  },
});

createApp(App).use(vuetify).use(router).use(pinia).use(Vue3Toastify, {
	autoClose: 3000,
	position: "top-right"
  }).mount('#app');
