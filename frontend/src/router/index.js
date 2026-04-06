import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CategoryView from '../views/CategoryView.vue'
import ModelView from '../views/ModelView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/category/:id',
    name: 'category',
    component: CategoryView,
    props: true,
  },
  {
    path: '/model/:id',
    name: 'model',
    component: ModelView,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
