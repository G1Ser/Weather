import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Vcharts from 'vue-echarts'
import * as echarts from 'echarts';

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.component('v-chart',Vcharts)

app.mount('#app')
