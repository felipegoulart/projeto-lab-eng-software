import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'boards', name: 'BoardsList', component: () => import('pages/IndexPage.vue') },
      { path: 'boards/:uuid', name: 'BoardsSingle', component: () => import('pages/BoardsSingle.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
