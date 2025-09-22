<template>
  <section class="chat-window" ref="chatWindow">
    <ChatMessage
      v-for="(msg, index) in messages"
      :key="msg.id || index"
      :message="msg"
    />

    <div v-if="isTyping" class="typing-indicator-wrapper">
      <TypingIndicator />
    </div>
  </section>
</template>

<script setup>
// Chuyển sang <script setup> cho đồng bộ
import { ref, watch, nextTick } from 'vue';
import ChatMessage from './ChatMessage.vue';
import TypingIndicator from './TypingIndicator.vue';

const props = defineProps({
  messages: Array,
  isTyping: Boolean
});

const chatWindow = ref(null);

const scrollToBottom = () => {
  if (chatWindow.value) {
    chatWindow.value.scrollTop = chatWindow.value.scrollHeight;
  }
};

watch(() => props.messages, () => {
  nextTick(scrollToBottom);
}, { deep: true });

watch(() => props.isTyping, (newVal) => {
  if (newVal) {
    nextTick(scrollToBottom);
  }
});
</script>

<style scoped>
.chat-window {
  flex: 1; /* Quan trọng: Chiếm toàn bộ không gian còn lại */
  overflow-y: auto; /* Quan trọng: Cho phép cuộn bên trong */
  padding: 24px 0; /* Tạo khoảng đệm trên và dưới */
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Custom scrollbar cho chuyên nghiệp hơn */
.chat-window::-webkit-scrollbar {
  width: 6px;
}
.chat-window::-webkit-scrollbar-track {
  background: transparent;
}
.chat-window::-webkit-scrollbar-thumb {
  background-color: #444;
  border-radius: 10px;
}

.typing-indicator-wrapper {
  width: 100%;
  max-width: 820px;
  padding: 0 20px;
  margin-top: 1rem;
}
</style>