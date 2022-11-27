import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    redirect: { name: 'BoardsList' },
    children: [
      { path: 'boards', name: 'BoardsList', component: () => import('src/pages/BoardsList.vue') },
      { path: 'boards/:uuid', name: 'BoardsSingle', component: () => import('pages/BoardsSingle.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
