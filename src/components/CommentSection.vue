<!-- src/components/CommentSection.vue -->
<template>
  <div>
    <h5>Bình luận</h5>
    <div v-if="isLoggedIn" class="mb-3">
      <textarea v-model="newComment" class="form-control" placeholder="Nhập bình luận..." rows="3"></textarea>
      <button class="btn btn-primary mt-2" @click="submitComment">Gửi</button>
    </div>
    <div v-else>
      <p class="text-muted">Hãy đăng nhập để bình luận.</p>
    </div>

    <div v-if="comments.length > 0" class="mt-4">
      <div v-for="(cmt, index) in comments" :key="index" class="border-bottom pb-2 mb-2">
        <strong>{{ cmt.user }}</strong> <span class="text-muted">({{ formatDate(cmt.createdAt) }})</span>
        <p class="mb-1">{{ cmt.content }}</p>
      </div>
    </div>
    <div v-else class="text-muted">Chưa có bình luận nào.</div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { getPosts, addCommentToPost } from '../services/postService'

const props = defineProps({
  postId: String
})

const newComment = ref('')
const comments = ref([])

const currentUser = JSON.parse(localStorage.getItem('currentUser'))
const isLoggedIn = !!currentUser

function loadComments() {
  const post = getPosts().find(p => p.id === props.postId)
  comments.value = post?.comments || []
}

function submitComment() {
  if (!newComment.value.trim()) return
  addCommentToPost(props.postId, {
    user: currentUser.name || currentUser.email,
    content: newComment.value.trim()
  })
  newComment.value = ''
  loadComments()
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString()
}

onMounted(loadComments)
</script>
