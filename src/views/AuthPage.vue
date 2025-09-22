<template>
  <div class="auth-container">
    <transition name="fade" mode="out-in">
      <div key="auth-form">
        <LoginForm
          v-if="isLogin"
          @loginSuccess="onLoginSuccess"
          @switchForm="isLogin = false"
          @update:message="setMessage($event, true)"
        />
        <RegisterForm
          v-else
          @switchForm="isLogin = true"
          @update:message="setMessage($event, false)"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'         // <<< 1. Import useStore
import { useRouter } from 'vue-router'  // <<< 2. Import useRouter
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const store = useStore()                // <<< 3. Khởi tạo store
const router = useRouter()              // <<< 4. Khởi tạo router

const isLogin = ref(true)
const loginMessage = ref('')
const registerMessage = ref('')

/**
 * THAY THẾ TOÀN BỘ HÀM onLoginSuccess BẰNG HÀM NÀY.
 * Đây là nơi xử lý chính sau khi đăng nhập thành công.
 */
const onLoginSuccess = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    // Dùng action trong store để cập nhật trạng thái của toàn bộ ứng dụng
    await store.dispatch('auth/initializeUserFromToken', token);
    
    // Sau khi store đã cập nhật xong, ra lệnh chuyển đến trang chủ
    router.push('/');
  } else {
    console.error("Login successful but token not found in localStorage.");
    // Có thể hiện thông báo lỗi cho người dùng ở đây
    setMessage("Đăng nhập thành công nhưng không tìm thấy token.", true);
  }
}

const setMessage = (message, isLoginForm) => {
  if (isLoginForm) {
    loginMessage.value = message
  } else {
    registerMessage.value = message
  }
}
</script>

<style scoped>
.auth-container {
  max-width: 360px;
  margin: 80px auto;
  font-family: 'Segoe UI', sans-serif;
  color: #000;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>