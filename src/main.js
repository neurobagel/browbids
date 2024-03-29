import { createApp } from 'vue'
import App from './App.vue'
import './index.css'

import LoadScript from "vue-plugin-load-script";


const app = createApp({})
app.use(LoadScript);


createApp(App).mount('#app')
