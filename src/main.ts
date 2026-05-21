import { ViteSSG } from 'vite-ssg';
import { createPinia } from 'pinia';
import i18n from './locales/setup';
import { routes, setupRouterGuards } from './router/index';
import App from './App.vue';
import './index.css';

export const createApp = ViteSSG(
  App,
  { routes },
  ({ app, router, isClient }) => {
    const pinia = createPinia();
    app.use(pinia);
    app.use(i18n);

    if (isClient) {
      setupRouterGuards(router);
    }
  }
);
