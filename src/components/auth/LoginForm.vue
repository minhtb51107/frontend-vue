<template>
  <div class="login-form">
    <h2 class="form-title">Đăng nhập</h2>
    <form @submit.prevent="handleSubmit">
      <FormInput
        v-model="form.email"
        type="email"
        placeholder="Email"
        required
      />
      <PasswordInput
        v-model="form.password"
        placeholder="Mật khẩu"
        required
      />
      <Button
        type="submit"
        :isLoading="isLoading"
      >
        Đăng nhập
      </Button>
      
      <GoogleSignIn
        @success="onLoginSuccess"
        @error="onGoogleError"
      />
    </form>
    
    <p class="message" :class="{ success, error: !success }">{{ message }}</p>
    
    <p class="switch-form">
      Bạn chưa có tài khoản?
      <a @click.prevent="$emit('switchForm')" href="#">Hãy đăng ký</a>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import FormInput from '@/components/ui/FormInput.vue'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import Button from '@/components/ui/Button.vue'
import GoogleSignIn from '@/components/auth/GoogleSignIn.vue'

const emit = defineEmits(['loginSuccess', 'switchForm', 'update:message'])

const { message, success, isLoading, login } = useAuth()

const form = ref({
  email: '',
  password: ''
})

const handleSubmit = async () => {
  try {
    await login(form.value)
    emit('loginSuccess', form.value.email)
  } catch (error) {
    // Error is already handled in useAuth composable
  }
}

const onLoginSuccess = (email) => {
  emit('loginSuccess', email)
}

const onGoogleError = (errorMessage) => {
  emit('update:message', errorMessage)
}
</script>

<style scoped>
.login-form {
  max-width: 360px;
  margin: 0 auto;
}

.form-title {
  margin-bottom: 24px;
  font-size: 28px;
  font-weight: 600;
  text-align: left;
}

.message {
  text-align: center;
  font-size: 14px;
  margin: 10px 0;
}

.success {
  color: green;
}

.error {
  color: red;
}

.switch-form {
  font-size: 14px;
  text-align: center;
  margin-top: 20px;
}

.switch-form a {
  color: black;
  text-decoration: underline;
  cursor: pointer;
}
</style>