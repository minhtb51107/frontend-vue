<template>
  <section class="chat-window" ref="chatWindow">
<ChatMessage
  v-for="(msg, index) in messages"
  :key="index"
  :message="msg"
  :index="index"
  :isTyping="isTyping && index === normalizedMessages.length - 1 && msg.role === 'assistant'" 
  @copy="$emit('copy-message', $event)"
  @edit="$emit('edit-message', index, $event)"
/>

<!-- Thêm đoạn dưới đây -->
<!-- <div v-if="messages.length === 0 && !isTyping" class="empty-state">
  🗨️ Bắt đầu cuộc trò chuyện mới...
</div> -->

<TypingIndicator v-if="isTyping" />

  </section>
</template>

<script>
import ChatMessage from './ChatMessage.vue'
import TypingIndicator from './TypingIndicator.vue'

export default {
  components: {
    ChatMessage,
    TypingIndicator
  },
  props: {
    messages: Array,
    isTyping: Boolean
  },
  computed: {
  normalizedMessages() {
    return this.messages.map(msg => ({
      ...msg,
      role: msg.role?.toLowerCase?.() === 'ai' ? 'assistant' : msg.role?.toLowerCase?.()
    }))
  }
},
  watch: {
    messages: {
      handler() {
        this.$nextTick(this.scrollToBottom)
      },
      deep: true
    },
    isTyping(newVal) {
      if (newVal) {
        this.$nextTick(this.scrollToBottom)
      }
    }
  },
  methods: {
    scrollToBottom() {
      const el = this.$refs.chatWindow
      if (el) {
        el.scrollTop = el.scrollHeight
      }
    }
  }
}
</script>

<style scoped>
.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 32px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.empty-state {
  margin-top: 100px;
  font-size: 1.1rem;
  color: #999;
  font-style: italic;
  text-align: center;
}

</style>