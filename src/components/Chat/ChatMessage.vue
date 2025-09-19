<template>
  <div
    :class="['chat-message', computedRole]"
    @mouseenter="hovered = true"
    @mouseleave="handleMouseLeave"
  >
    <div class="msg-content">
      <!-- Hiển thị nội dung streaming -->
      <span v-if="message.isStreaming" class="streaming-content">
        {{ message.content }}<span class="streaming-cursor">|</span>
      </span>
      
      <!-- Hiển thị nội dung bình thường -->
      <div v-else-if="isTyping">{{ animatedText }}</div>
      <div v-else v-html="message.content"></div>
    </div>

    <div
      v-if="hovered && !message.isStreaming"
      class="msg-menu-button"
      :class="computedRole"
      @click.stop="showMenu = !showMenu"
      title="Tùy chọn"
    >
      ...
    </div>

    <div
      class="msg-menu"
      v-if="showMenu"
      :class="computedRole"
      v-click-outside="closeMenu"
    >
      <div @click.stop="copyMessage">Sao chép</div>
      <div @click.stop="editMessage">Sửa</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: Object,
    isTyping: Boolean,
    index: Number
  },
  computed: {
    computedRole() {
      const role = this.message?.role?.toLowerCase?.()
      if (role === 'ai') return 'assistant'
      return role === 'user' || role === 'assistant' ? role : 'unknown-role'
    },
    animatedText() {
      // Chỉ áp dụng hiệu ứng typing cho tin nhắn đang được gõ
      if (this.isTyping && this.message.role === 'assistant') {
        return this.message.content + '...'
      }
      return this.message.content
    }
  },
  data() {
    return {
      hovered: false,
      showMenu: false,
      hideTimeout: null
    }
  },
  methods: {
    copyMessage() {
      this.$emit('copy', this.message.content)
      this.closeMenu()
    },
    editMessage() {
      // Chỉ cho phép sửa tin nhắn không phải đang streaming
      if (this.message.isStreaming) return;
      
      const newContent = prompt('Sửa nội dung tin nhắn:', this.message.content)
      if (newContent !== null && newContent.trim() !== '') {
        this.$emit('edit', newContent.trim())
      }
      this.closeMenu()
    },
    handleMouseLeave() {
      this.hideTimeout = setTimeout(() => {
        this.hovered = false
        this.closeMenu()
      }, 400)
    },
    closeMenu() {
      this.showMenu = false
      clearTimeout(this.hideTimeout)
    }
  },
  directives: {
    'click-outside': {
      bind(el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value()
          }
        }
        document.body.addEventListener('click', el.clickOutsideEvent)
      },
      unbind(el) {
        document.body.removeEventListener('click', el.clickOutsideEvent)
      }
    }
  }
}
</script>

<style scoped>
.chat-message {
  width: 100%;
  max-width: 820px;
  padding: 0 32px;
  margin-bottom: 24px;
  position: relative;
  display: flex;
  flex-direction: column;
}

/* Tin nhắn user căn phải */
.chat-message.user {
  align-items: flex-end;
}

/* Tin nhắn AI căn trái */
.chat-message.assistant {
  align-items: flex-start;
}

.msg-content {
  padding: 16px;
  border-radius: 20px;
  color: #ececec;
  font-size: 1rem;
  line-height: 2.0;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: 100%;
}

.chat-message.user .msg-content {
  background: #303030;
}

.chat-message.assistant .msg-content {
  margin-bottom: -20px;
}

/* Nút menu - sử dụng position absolute */
.msg-menu-button {
  position: absolute;
  font-size: 28px;
  color: #bbb;
  background: transparent;
  cursor: pointer;
  padding: 4px 8px;
  width: fit-content;
  top: 100%;
  margin-top: -20px;
}

.chat-message.user .msg-menu-button {
  right: 32px;
}

.chat-message.assistant .msg-menu-button {
  left: 32px;
}

/* Menu tùy chọn */
.msg-menu {
  position: absolute;
  background: #2e2f38;
  border: 1px solid #444;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  min-width: 100px;
  width: fit-content;
  z-index: 10;
  top: calc(100% + 4px);
}

.chat-message.user .msg-menu {
  right: 32px;
}

.chat-message.assistant .msg-menu {
  left: 32px;
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

.msg-content {
  user-select: text !important;
}

/* Hiệu ứng streaming */
.streaming-content {
  position: relative;
}

.streaming-cursor {
  animation: blink 1s infinite;
  color: #4ade80;
  font-weight: bold;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Vô hiệu hóa tương tác khi đang streaming */
.chat-message .msg-menu-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>