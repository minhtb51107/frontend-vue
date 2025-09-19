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
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const emit = defineEmits(['loginSuccess'])

const isLogin = ref(true)
const loginMessage = ref('')
const registerMessage = ref('')

const onLoginSuccess = (email) => {
  emit('loginSuccess', email)
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