<template>
  <ul class="session-list">
<SessionItem
  v-for="s in sessions"
  :key="s.id"
  :session="s"
  :isActive="s.id === currentSessionId"
  @click="$emit('switch-chat', s.id)"
  @delete="$emit('delete-session', s.id)"
  @rename="(payload) => $emit('rename-session', payload)"
/>
  </ul>
</template>

<script>
import SessionItem from './SessionItem.vue'

export default {
  components: {
    SessionItem
  },
  props: {
    sessions: Array,
    currentSessionId: [String, Number] // 👈 sửa tên & kiểu
  }
}
</script>

<style scoped>
.session-list {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
