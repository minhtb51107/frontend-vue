<template>
  <div>
    <h2>Đăng ký</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="name" placeholder="Tên" class="form-control mb-2" />
      <input v-model="email" type="email" placeholder="Email" class="form-control mb-2" />
      <input v-model="password" type="password" placeholder="Mật khẩu" class="form-control mb-2" />
      <button class="btn btn-success w-100">Đăng ký</button>
      <p v-if="error" class="text-danger mt-2">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

function handleRegister() {
  if (!name.value || !email.value || !password.value) {
    error.value = 'Vui lòng nhập đầy đủ thông tin.'
    return
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const exists = users.find(u => u.email === email.value)
  if (exists) {
    error.value = 'Email đã được đăng ký.'
    return
  }

  users.push({ name: name.value, email: email.value, password: password.value })
  localStorage.setItem('users', JSON.stringify(users))
  alert('Đăng ký thành công! Hãy đăng nhập.')
  router.push('/login')
}
</script>
