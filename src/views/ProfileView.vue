<!-- src/views/ProfileView.vue -->
<template>
  <div class="container mt-4">
    <h2>Thông tin cá nhân</h2>

    <div v-if="user">
      <div class="mb-3">
        <img :src="user.avatar || defaultAvatar" class="rounded-circle" width="100" height="100" />
      </div>

      <div class="mb-3">
        <label class="form-label">Tên</label>
        <input v-model="form.name" type="text" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Email</label>
        <input v-model="form.email" type="email" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Mật khẩu</label>
        <input v-model="form.password" type="password" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Link ảnh đại diện</label>
        <input v-model="form.avatar" type="text" class="form-control" />
      </div>

      <button @click="saveProfile" class="btn btn-primary">Lưu thay đổi</button>
      <div v-if="successMessage" class="text-success mt-2">{{ successMessage }}</div>
    </div>

    <div v-else>
      <p>Bạn chưa đăng nhập.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCurrentUser, updateCurrentUser } from '../services/userService'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)
const form = ref({
  name: '',
  email: '',
  password: '',
  avatar: ''
})
const successMessage = ref('')
const defaultAvatar = 'https://via.placeholder.com/100?text=Avatar'

onMounted(() => {
  const current = getCurrentUser()
  if (!current) {
    router.push('/login')
  } else {
    user.value = current
    form.value = { ...current }
  }
})

function saveProfile() {
  updateCurrentUser(form.value)
  successMessage.value = 'Cập nhật thành công!'
}
</script>
