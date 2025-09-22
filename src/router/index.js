import { createRouter, createWebHistory } from 'vue-router'
import ChatApp from '../views/ChatApp.vue'
import AuthPage from '../views/AuthPage.vue'

const routes = [
  // Thêm 'meta' để định nghĩa các quy tắc cho route
  { path: '/', component: ChatApp, meta: { requiresAuth: true } },
  { path: '/auth', component: AuthPage, meta: { guest: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Thêm một bộ canh gác định tuyến toàn cục (global navigation guard)
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');

  // Nếu route yêu cầu đăng nhập và người dùng chưa đăng nhập
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/auth'); // Chuyển hướng đến trang đăng nhập
  } 
  // Nếu route dành cho khách (guest) và người dùng đã đăng nhập
  else if (to.meta.guest && isAuthenticated) {
    next('/'); // Chuyển hướng đến trang chủ
  } 
  // Các trường hợp khác thì cho phép đi tiếp
  else {
    next();
  }
});

export default router