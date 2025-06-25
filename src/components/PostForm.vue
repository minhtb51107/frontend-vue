<!-- src/components/PostForm.vue -->
<template>
  <form @submit.prevent="submit">
    <div class="mb-3">
      <label class="form-label">Tiêu đề</label>
      <input v-model="title" class="form-control" required />
    </div>
    <div class="mb-3">
      <label class="form-label">Nội dung</label>
      <textarea v-model="content" class="form-control" rows="5" required></textarea>
    </div>
    <div class="mb-3">
      <label class="form-label">Ảnh minh họa (URL)</label>
      <input v-model="imageUrl" class="form-control" />
    </div>
    <button class="btn btn-primary">Đăng bài</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { savePost } from '../services/postService'

const title = ref('')
const content = ref('')
const imageUrl = ref('')

function submit() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  if (!currentUser) {
    alert('Bạn cần đăng nhập để đăng bài!')
    return
  }

  savePost({
    title: title.value,
    content: content.value,
    imageUrl: imageUrl.value,
    author: currentUser.email
  })

  title.value = ''
  content.value = ''
  imageUrl.value = ''
  alert('Đăng bài thành công!')
}
</script>
