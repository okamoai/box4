import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/index.vue'

export const router = createRouter({
  history: createWebHistory(),
  strict: true,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/:catchAll(.*)',
      redirect: '/',
    },
  ],
})
