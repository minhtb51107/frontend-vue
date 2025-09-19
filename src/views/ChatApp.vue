<template>
  <div class="chat-app">
    <!-- Sidebar -->
    <Sidebar
      :show-new-chat-by-default="!currentSessionId"
      :sessions="sessions"
      :currentSessionId="currentSessionId"
      @new-chat="newChat"
      @switch-chat="switchChat"
      @rename-session="renameSession"
      @delete-session="deleteSession"
    />

    <!-- Main Chat Area -->
    <main class="chat-main">
      <Topbar
        :username="username"
        @logout="$emit('logout')"
        @open-settings="openSettings"
      />

      <ChatWindow
        v-if="currentSessionId"
        :messages="currentSession.messages"
        :isTyping="isTyping"
        @copy-message="copyMessage"
        @edit-message="editMessage"
      />
      <div v-else class="empty-chat">
        <p>Bắt đầu đoạn chat mới bằng cách nhập tin nhắn</p>
      </div>

      <ChatInput
        v-model="input"
        v-model:file="attachedFile" 
        @send="handleSend"
        :is-uploading="isUploading" />     </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'; // ✅ THÊM 'ref'
import { useSession } from '@/composables/useSession'
import { useChat } from '@/composables/useChat'
import Sidebar from '@/components/Sidebar/Sidebar.vue'
import ChatWindow from '@/components/chat/ChatWindow.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import Topbar from '@/components/layout/Topbar.vue'

const props = defineProps({
  username: String
})

defineEmits(['logout'])

// Khởi tạo sessions
const { sessions, currentSessionId, currentSession, loadSessions, createNewSession, renameSession, deleteSession } = useSession()
// ✅ SỬA 2: Giữ nguyên tên gốc `sendMessage` từ useChat
const { isTyping, input, loadMessages, sendMessage } = useChat(sessions, currentSessionId)

const attachedFile = ref(null);
const isUploading = ref(false);

// ✅ SỬA 3: Đơn giản hóa hàm handleSend
const handleSend = async () => {
  if (isUploading.value) return; 

  const file = attachedFile.value;
  const text = input.value;
  
  if (!text.trim() && !file) {
    return; 
  }

  isUploading.value = true;
  // isTyping.value sẽ được xử lý bên trong useChat

  try {
    // BƯỚC 0: TẠO SESSION MỚI NẾU CHƯA CÓ (Logic này vẫn đúng)
    if (!currentSessionId.value) {
        const newSession = await createNewSession(); 
        if (!newSession || !newSession.id) {
            throw new Error("Không thể tạo session mới.");
        }
        // useSession đã tự động set currentSessionId.value, không cần gán lại
    }

    // BƯỚC 1: GỌI `sendMessage` TỪ `useChat`
    // (Hàm này bây giờ đã nhận file)
    await sendMessage(file); 
    
    // Xóa file khỏi input sau khi gửi thành công
    attachedFile.value = null; 

  } catch (error) {
    console.error('Lỗi khi gửi (từ ChatApp):', error);
  } finally {
    isUploading.value = false;
  }
};

// Các methods
const newChat = () => {
  currentSessionId.value = null
  input.value = ''
}

const switchChat = async (sessionId) => {
  currentSessionId.value = sessionId
  await loadMessages(sessionId)
}

const copyMessage = (content) => {
  navigator.clipboard.writeText(content)
}

const editMessage = (index, newContent) => {
  if (currentSession.value.messages[index]) {
    currentSession.value.messages[index].content = newContent
  }
}

const openSettings = () => {
  // TODO: Mở modal cài đặt nếu cần
}

// Lifecycle hooks
onMounted(async () => {
  await loadSessions()
  
  // Thêm event listener để xử lý khi người dùng refresh trang
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('shouldStartNewChat', 'true')
  })
  
  // Kiểm tra nên bắt đầu chat mới hay không
  if (localStorage.getItem('shouldStartNewChat') === 'true') {
    localStorage.removeItem('shouldStartNewChat')
    currentSessionId.value = null
  }
})
</script>

<style scoped>
/* Giữ nguyên styles từ file cũ */
.chat-app {
  display: flex;
  height: 100vh;
  background: rgb(34, 34, 34);
  color: #ffffff;
  font-family: 'Segoe UI', sans-serif;
}

@media (min-width: 768px) {
  .chat-app {
    flex-direction: row;
  }
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.empty-chat {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #aaa;
  font-size: 1.2em;
}
</style>