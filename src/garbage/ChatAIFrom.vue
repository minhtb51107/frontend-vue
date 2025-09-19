<template>
  <div class="chat-app">
    <!-- Sidebar -->
    <aside class="sidebar" v-show="showSidebar">
      <header class="sidebar-header">
        <h1>ChatGPT</h1>
        <button @click="newChat">＋</button>
      </header>
      <ul class="session-list">
        <li
          v-for="(session, index) in sessions"
          :key="index"
          :class="{ active: currentSession === index }"
          @click="switchChat(index)"
          @mouseenter="hoveredSession = index"
          @mouseleave="hoveredSession = null"
        >
          <span>{{ session.title || 'New chat' }}</span>
          <button
            class="session-options-btn"
            v-if="hoveredSession === index"
            @click.stop="toggleSessionMenu(index)"
          >⋮</button>

          <div
            class="session-options-menu"
            v-if="showSessionMenu === index"
          >
            <div @click.stop="renameSession(index)">✏️ Đổi tên</div>
            <div @click.stop="deleteSession(index)">🗑️ Xoá</div>
          </div>
        </li>
      </ul>
    </aside>

    <!-- Main Chat -->
    <main class="chat-main">
      <section class="chat-window" ref="chatWindow">
        <div
          v-for="(msg, index) in currentMessages"
          :key="index"
          :class="['chat-message', msg.role]"
          @mouseenter="handleMouseEnter(index)"
          @mouseleave="handleMouseLeaveWithDelay(index)"
        >
          <div class="msg-content">
            {{ msg.content }}
          </div>

          <!-- Nút ba chấm phía dưới -->
          <div
            v-if="hoveredMessage === index"
            class="msg-menu-button"
            :class="msg.role"
            @click.stop="toggleMsgMenu(index)"
            title="Tùy chọn"
          >
            ⋮
          </div>

          <!-- Menu chỉnh sửa/sao chép -->
          <div
            class="msg-menu"
            v-if="showMsgMenu === index"
            :class="msg.role"
          >
            <div @click.stop="copyMessage(msg.content)">📋 Sao chép</div>
            <div @click.stop="editMessage(index)">✏️ Sửa</div>
          </div>
        </div>

        <div v-if="isTyping" class="chat-message assistant">
          <div class="msg-content">
            <span class="typing-dots"><span>.</span><span>.</span><span>.</span></span>
          </div>
        </div>
      </section>

      <!-- Input -->
      <footer class="chat-input">
        <div class="input-wrapper">
          <textarea
            v-model="input"
            @keyup.enter.exact.prevent="sendMessage"
            placeholder="Send a message..."
          />
          <button @click="sendMessage">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
            </svg>
          </button>
        </div>
      </footer>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      input: '',
      sessions: [{ title: 'New chat', messages: [] }],
      currentSession: 0,
      isTyping: false,
      showSidebar: true,
      hoveredMessage: null,
      hoveredSession: null,
      showSessionMenu: null,
      showMsgMenu: null,
      hideMsgMenuTimeout: null,
    };
  },
  computed: {
    currentMessages() {
      return this.sessions[this.currentSession].messages;
    },
  },
  methods: {
    newChat() {
      this.sessions.unshift({ title: 'New chat', messages: [] });
      this.currentSession = 0;
    },
    switchChat(index) {
      this.currentSession = index;
      this.showSessionMenu = null;
    },
    async sendMessage() {
      const content = this.input.trim();
      if (!content) return;

      const session = this.sessions[this.currentSession];
      session.messages.push({ role: 'user', content });
      this.input = '';
      this.isTyping = true;
      this.scrollToBottom();

      try {
        const response = await axios.post('http://localhost:8080/api/chat', {
          messages: session.messages,
        });
        session.messages.push({ role: 'assistant', content: response.data.reply });
      } catch (error) {
        session.messages.push({ role: 'assistant', content: 'Lỗi phản hồi từ AI.' });
      } finally {
        this.isTyping = false;
        this.scrollToBottom();
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const el = this.$refs.chatWindow;
        el.scrollTop = el.scrollHeight;
      });
    },
    copyMessage(content) {
      navigator.clipboard.writeText(content);
      this.showMsgMenu = null;
    },
    editMessage(index) {
      const current = this.currentMessages[index];
      const newContent = prompt('Sửa nội dung tin nhắn:', current.content);
      if (newContent !== null && newContent.trim() !== '') {
        this.currentMessages[index].content = newContent.trim();
      }
      this.showMsgMenu = null;
    },
    toggleSessionMenu(index) {
      this.showSessionMenu = this.showSessionMenu === index ? null : index;
    },
    renameSession(index) {
      const newTitle = prompt('Nhập tên mới cho cuộc trò chuyện:');
      if (newTitle !== null && newTitle.trim()) {
        this.sessions[index].title = newTitle.trim();
      }
      this.showSessionMenu = null;
    },
    deleteSession(index) {
      if (confirm('Bạn có chắc muốn xoá cuộc trò chuyện này không?')) {
        this.sessions.splice(index, 1);
        if (this.currentSession === index) {
          this.currentSession = 0;
        }
      }
      this.showSessionMenu = null;
    },
    toggleMsgMenu(index) {
      this.showMsgMenu = this.showMsgMenu === index ? null : index;
    },
    handleMouseEnter(index) {
      clearTimeout(this.hideMsgMenuTimeout);
      this.hoveredMessage = index;
    },
    handleMouseLeaveWithDelay(index) {
      this.hideMsgMenuTimeout = setTimeout(() => {
        if (this.hoveredMessage === index) {
          this.hoveredMessage = null;
          this.showMsgMenu = null;
        }
      }, 400);
    },
  },
};
</script>

<style scoped>
.chat-app {
  display: flex;
  height: 100vh;
  background: #343541;
  color: #ffffff;
  font-family: 'Segoe UI', sans-serif;
}

.sidebar {
  width: 250px;
  background: #202123;
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

.session-list {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  list-style: none;
}

.session-list li {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #2e2e2e;
}

.session-list li.active,
.session-list li:hover {
  background: #3b3b3d;
}

.session-options-btn {
  background: transparent;
  border: none;
  color: #bbb;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0 6px;
}

.session-options-btn:hover {
  color: #fff;
}

.session-options-menu {
  position: absolute;
  top: 34px;
  right: 10px;
  background: #2e2f38;
  border: 1px solid #444;
  border-radius: 6px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.session-options-menu div {
  padding: 8px 12px;
  cursor: pointer;
  white-space: nowrap;
  font-size: 14px;
}

.session-options-menu div:hover {
  background: #3f4048;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chat-message {
  width: 100%;
  max-width: 720px;
  padding: 0 32px;
  margin-bottom: 24px;
  display: flex;
  position: relative;
}

.chat-message.user {
  justify-content: flex-end;
}

.chat-message.assistant {
  justify-content: flex-start;
}

.msg-content {
  background: #444654;
  padding: 16px;
  border-radius: 8px;
  color: #ececec;
  font-size: 1rem;
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: 100%;
}

.chat-message.user .msg-content {
  background: #3e3f4b;
}

.msg-menu-button {
  position: absolute;
  top: 8px;
  right: -28px;
  font-size: 18px;
  color: #bbb;
  background: transparent;
  cursor: pointer;
}

.msg-menu-button:hover {
  color: #fff;
}

.msg-menu {
  position: absolute;
  top: 30px;
  right: -10px;
  background: #2e2f38;
  border: 1px solid #444;
  border-radius: 6px;
  z-index: 10;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  min-width: 100px;
}

.msg-menu div {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
}

.msg-menu div:hover {
  background: #3f4048;
}

.chat-input {
  padding: 20px;
  background: #343541;
  border-top: 1px solid #2e2e2e;
  display: flex;
  justify-content: center;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 720px;
  background: #40414f;
  border-radius: 8px;
  padding: 12px;
}

.input-wrapper textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  resize: none;
  font-size: 1rem;
  line-height: 1.4;
  padding-right: 40px;
}

.input-wrapper button {
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: #10a37f;
  cursor: pointer;
}

.typing-dots {
  display: inline-block;
  font-size: 1.5rem;
  letter-spacing: 4px;
  animation: blink 1s infinite steps(1, start);
}

.typing-dots span {
  animation: blink 1.3s infinite;
  opacity: 0.5;
}

.typing-dots span:nth-child(1) {
  animation-delay: 0s;
}
.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}


.msg-menu-button {
  margin-top: 6px;
  font-size: 18px;
  color: #bbb;
  background: transparent;
  cursor: pointer;
  padding: 4px 8px;
  width: fit-content;
}

.msg-menu-button.assistant {
  align-self: flex-start;
}

.msg-menu-button.user {
  align-self: flex-end;
}

.msg-menu {
  margin-top: 4px;
  background: #2e2f38;
  border: 1px solid #444;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  min-width: 100px;
  width: fit-content;
  z-index: 10;
}

.msg-menu.assistant {
  align-self: flex-start;
}

.msg-menu.user {
  align-self: flex-end;
}
</style>
