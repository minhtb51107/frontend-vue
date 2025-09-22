import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import store from './stores'; // <<< Sửa 1: Giờ đây import này sẽ hoạt động

const app = createApp(App);

// Hàm khởi tạo và gắn kết ứng dụng
const mountApp = () => {
  app.use(router);
  app.use(store); // Sử dụng Vuex store
  app.mount('#app');
}

// Lấy token từ localStorage khi ứng dụng bắt đầu
const token = localStorage.getItem('token');

if (token) {
  // Nếu có token, hãy cố gắng xác thực trước khi gắn kết ứng dụng
  store.dispatch('auth/initializeUserFromToken', token).finally(() => {
    mountApp();
  });
} else {
  // Nếu không có token, cứ gắn kết ứng dụng như bình thường
  mountApp();
}

// app.use(createPinia()) // <<< Sửa 2: Xóa hoặc bình luận dòng này đi