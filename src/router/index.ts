import { RouteRecordRaw, Router } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import ProposalView from '../components/ProposalView.vue';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/proposal/:id',
    name: 'proposal',
    component: ProposalView
  }
];

export const setupRouterGuards = (router: Router) => {
  router.beforeEach((to, from, next) => {
    // Only run auth store logic on the client
    if (typeof window !== 'undefined') {
      const authStore = useAuthStore();
      const isAuthenticated = authStore.isAuthenticated();

      if (to.meta.requiresAuth && !isAuthenticated) {
        // Redirect to login if route requires auth and user is not logged in
        next('/login');
        return;
      } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
        // Redirect to dashboard if logged-in user tries to access auth pages
        next('/dashboard');
        return;
      }
    }
    next();
  });
};
