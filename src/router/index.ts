import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../App.vue';
import ProposalView from '../components/ProposalView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      // Dynamic import to avoid circular dependency since we'll restructure a bit
      component: () => import('../views/Home.vue') 
    },
    {
      path: '/proposal/:id',
      name: 'proposal',
      component: ProposalView
    }
  ]
});

export default router;
