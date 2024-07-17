import { createApp } from 'vue';
import router from './router'; // импортируем router как default

import App from './App.vue';

const app = createApp(App);

app.use(router);

app.mount('#app');
