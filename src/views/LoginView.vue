<template>
  <div>
    <h2>Đăng nhập</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" class="form-control mb-2" />
      <input v-model="password" type="password" placeholder="Mật khẩu" class="form-control mb-2" />
      <button class="btn btn-primary w-100" >Đăng nhập</button>
      <p v-if="error" class="text-danger mt-2">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()


function handleLogin() {
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const found = users.find(u => u.email === email.value && u.password === password.value)
  if (!found) {
    error.value = 'Email hoặc mật khẩu không đúng.'
    return
  }

  localStorage.setItem('currentUser', JSON.stringify(found))
  window.dispatchEvent(new Event('storage'))  // 👈 Thêm dòng này
  alert('Đăng nhập thành công!')
  router.push('/')
}
</script>

