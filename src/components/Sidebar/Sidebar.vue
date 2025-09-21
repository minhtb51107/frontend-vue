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

    <div class="uploader-wrapper">
      <KnowledgeUploader />
    </div>
  </aside>
</template>

<script>
import SessionList from './SessionList.vue'
import KnowledgeUploader from './KnowledgeUploader.vue'; // ✅ THÊM MỚI

export default {
  components: {
    SessionList,
    KnowledgeUploader 
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
   height: 100vh; 
}

.sidebar-header {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #171717;
  border-bottom: 1px solid #2e2e2e;
}

/* ✅ THÊM 5: Style cho các wrapper mới */
.session-list-wrapper {
  flex: 1; /* Cho phép danh sách session chiếm đầy không gian */
  overflow-y: auto; /* Thêm thanh cuộn nếu danh sách quá dài */
}

.uploader-wrapper {
  flex-shrink: 0; /* Không co lại, luôn ở dưới cùng */
  /* Border-top đã có trong style của KnowledgeUploader.vue */
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
