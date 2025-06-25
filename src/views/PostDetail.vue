<!-- src/views/PostDetail.vue -->
<template>
  <div class="container mt-4">
    <div v-if="post">
      <h2>{{ post.title }}</h2>
      <p>{{ post.content }}</p>
      <img v-if="post.imageUrl" :src="post.imageUrl" class="img-fluid mb-3" />
      <p class="text-muted">Tác giả: {{ post.author }} - {{ formatDate(post.createdAt) }}</p>

      <hr />

      <CommentSection :postId="post.id" />
    </div>
    <div v-else>
      <p>Bài viết không tồn tại.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getPosts } from '../services/postService'
import CommentSection from '../components/CommentSection.vue'

const route = useRoute()
const postId = route.params.id
const post = ref(null)

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString()
}

onMounted(() => {
  const found = getPosts().find(p => p.id === postId)
  if (found) post.value = found
})
</script>
