<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <button class="new-chat-btn" @click="$emit('new-chat')">
        <span>＋</span> Mới
      </button>
    </div>

    <div class="session-list-wrapper">
      <SessionList
        :sessions="sessions"
        :currentSessionId="currentSessionId"
        @switch-chat="$emit('switch-chat', $event)"
        @rename-session="$emit('rename-session', $event)"
        @delete-session="$emit('delete-session', $event)"
      />
    </div>

    <div class="uploader-wrapper">
      <KnowledgeUploader />
    </div>
  </aside>
</template>

<script setup>
import SessionList from './SessionList.vue';
import KnowledgeUploader from './KnowledgeUploader.vue';

defineProps({
  sessions: Array,
  currentSessionId: [String, Number],
});

defineEmits(['new-chat', 'switch-chat', 'rename-session', 'delete-session']);
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: #111111;
  border-right: 1px solid #333;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.sidebar-header {
  padding: 12px;
  flex-shrink: 0;
}

.new-chat-btn {
  width: 100%;
  padding: 5px;
  background-color: transparent;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s, border-color 0.2s;
}

.new-chat-btn:hover {
  background-color: #2a2a2a;
  border-color: #555;
}

.new-chat-btn span {
  font-size: 1.2rem;
}

.session-list-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
}

/* Tùy chỉnh thanh cuộn cho đẹp hơn */
.session-list-wrapper::-webkit-scrollbar {
  width: 6px;
}
.session-list-wrapper::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 3px;
}
.session-list-wrapper::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.uploader-wrapper {
  flex-shrink: 0;
  height: auto; /* Để chiều cao tự động theo nội dung */
}
</style>