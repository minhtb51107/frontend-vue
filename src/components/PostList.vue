<!-- src/components/PostList.vue -->
<template>
  <div v-for="post in posts" :key="post.id" class="card mb-3">
    <div class="card-body">
      <img v-if="post.imageUrl" :src="post.imageUrl" class="img-fluid mb-2" />
      <h5 class="card-title">{{ post.title }}</h5>
      <p class="card-text">{{ post.content }}</p>
      <p class="text-muted">Đăng lúc: {{ formatDate(post.createdAt) }}</p>

      <div v-if="isAuthor(post)" class="mt-2">
        <RouterLink :to="`/post/${post.id}`" class="btn btn-secondary btn-sm">Xem chi tiết</RouterLink>
        <button class="btn btn-warning btn-sm me-2" @click="editPost(post)">Sửa</button>
        <button class="btn btn-danger btn-sm" @click="deletePostById(post.id)">Xoá</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPosts, deletePost } from '../services/postService'

const posts = ref([])

onMounted(() => {
  posts.value = getPosts()
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString()
}

function isAuthor(post) {
  const user = JSON.parse(localStorage.getItem('currentUser'))
  return user && post.author === user.email
}

function deletePostById(id) {
  if (confirm('Bạn chắc chắn xoá?')) {
    deletePost(id)
    posts.value = getPosts()
  }
}

function editPost(post) {
  alert('Phần chỉnh sửa bạn có thể làm ở phần sau nếu muốn mở rộng')
}
</script>
