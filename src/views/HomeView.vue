<template>
  <div class="home">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Bài viết mới nhất</h2>
      <div>
        <select v-model="sortOption" class="form-select">
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
        </select>
      </div>
    </div>

<div v-for="post in posts" :key="post.id" class="card mb-3">
  <img v-if="post.imageUrl" :src="post.imageUrl" class="img-fluid mb-2" />
  <div class="card-body">
    <h5 class="card-title">{{ post.title }}</h5>
    <p class="card-text">{{ post.content.slice(0, 100) }}...</p>
    <p class="card-text">
      <small class="text-muted">Tác giả: {{ post.author }} - {{ post.date }}</small>
    </p>
    <router-link :to="`/post/${post.id}`" class="btn btn-outline-primary btn-sm">Xem chi tiết</router-link>
  </div>
</div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      posts: []
    }
  },
  mounted() {
    const savedPosts = JSON.parse(localStorage.getItem('posts')) || []
    this.posts = savedPosts
  }
}
</script>


<style scoped>
.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}
</style>
