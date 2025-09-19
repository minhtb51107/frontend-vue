<template>
  <aside class="sidebar" v-show="showSidebar">
    <header class="sidebar-header">
      <h1>Thêm mới</h1>
      <button @click="$emit('new-chat')">＋</button>
    </header>
    
    <SessionList
      :sessions="sessions"
      :currentSessionId="currentSessionId"
      @switch-chat="$emit('switch-chat', $event)"
      @rename-session="$emit('rename-session', $event)"
      @delete-session="$emit('delete-session', $event)"
    />
  </aside>
</template>

<script>
import SessionList from './SessionList.vue'

export default {
  components: {
    SessionList
  },
  props: {
    sessions: Array,
    currentSessionId: [String, Number], // 👈 Chuyển sang ID
    showSidebar: {
      type: Boolean,
      default: true
    },
    showNewChatByDefault: {
    type: Boolean,
    default: true
  }
  }
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: #171717;
  border-right: 1px solid #2d2d2f;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #171717;
  border-bottom: 1px solid #2e2e2e;
}

.sidebar-header h1 {
  font-size: 1rem;
  margin: 0;
}

.sidebar-header button {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
