import { createApp } from 'vue';
import { createPinia } from 'pinia';
import i18n from './locales/setup';
import router from './router/index';
import App from './App.vue';
import './index.css';

const app = createApp(App);

app.use(createPinia());
app.use(i18n);
app.use(router);

app.mount('#root');
