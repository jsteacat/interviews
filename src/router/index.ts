import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw, RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const checkAuth = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  let isAuth = false
  onAuthStateChanged(getAuth(), (user) => {
    if (user && !isAuth) {
      isAuth = true
      next()
    } else if (!user && !isAuth) {
      isAuth = true
      next('/auth')
    }
  })
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/PageHome.vue'),
    beforeEnter: checkAuth
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/views/PageAuth.vue')
  },
  {
    path: '/list',
    name: 'list',
    component: () => import('@/views/PageInterviewList.vue'),
    beforeEnter: checkAuth
  },
  {
    path: '/interview/:id',
    name: 'interview',
    component: () => import('@/views/PageInterview.vue'),
    beforeEnter: checkAuth
  },
  {
    path: '/statistic',
    name: 'statistic',
    component: () => import('@/views/PageStatistic.vue'),
    beforeEnter: checkAuth
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
