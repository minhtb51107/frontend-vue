import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import PostCreate from '../views/PostCreate.vue';
import PostDetail from '../views/PostDetail.vue';
import ProfileView from '../views/ProfileView.vue';

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/post/new', component: PostCreate },
  { path: '/post/:id', component: PostDetail },
  { path: '/profile', component: ProfileView }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('currentUser')

  if (authRequired && !loggedIn) {
    return next('/login')
  }

  next()
})


export default router;