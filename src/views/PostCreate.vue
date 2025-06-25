<!-- src/views/PostCreate.vue -->
<template>
  <div class="container mt-4">
    <h3>Đăng bài mới</h3>
    <PostForm />
    <hr />
    <h3>Danh sách bài viết</h3>
    <PostList />
  </div>
</template>

<script setup>
import PostForm from '../components/PostForm.vue'
import PostList from '../components/PostList.vue'
</script>
