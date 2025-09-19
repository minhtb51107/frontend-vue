import { createRouter, createWebHistory } from 'vue-router'
import ChatApp from '../views/ChatApp.vue'
import AuthPage from '../views/AuthPage.vue' // hoặc LoginRegister.vue, tùy tên file bạn đặt

const routes = [
  { path: '/', component: ChatApp },
  { path: '/auth', component: AuthPage } // 👉 Trang đăng nhập/đăng ký
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
