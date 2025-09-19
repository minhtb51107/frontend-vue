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
        :messages="messages"
        :isTyping="isTyping"
        @copy-message="copyMessage"
        @edit-message="editMessage"
      />
      <div v-else class="empty-chat">
        <p>Bắt đầu đoạn chat mới bằng cách nhập tin nhắn</p>
      </div>

      <ChatInput
        v-model="input"
        @send="sendMessage"
      />
    </main>
  </div>
</template>

<script>
import Sidebar from './Sidebar/Sidebar.vue'
import ChatWindow from './Chat/ChatWindow.vue'
import ChatInput from './Chat/ChatInput.vue'
import Topbar from './layout/Topbar.vue'
import axios from 'axios'

export default {
  components: {
    Sidebar,
    ChatWindow,
    ChatInput,
    Topbar,
  },
  props: {
    username: String
  },
  data() {
    return {
      input: '',
      sessions: [],
      currentSessionId: null, // 👈 thay currentSession index bằng sessionId
      isTyping: false
    }
  },
  computed: {
    currentSession() {
      return this.sessions.find(s => s.id === this.currentSessionId) || null;
    },
     messages() {
    const session = this.sessions.find(s => s.id === this.currentSessionId)
    return session ? session.messages : []
  },
// Trong computed currentMessages():
// currentMessages() {
//   const msgs = this.currentSession?.messages || []
//   return msgs.map(m => {
//     // Nếu role đã được normalize rồi thì không cần normalize lại
//     const normalizedRole = m.role && ['user', 'assistant'].includes(m.role.toLowerCase()) 
//       ? m.role.toLowerCase()
//       : this.normalizeRole(m.role || m.sender)
    
//     return {
//       ...m,
//       role: normalizedRole
//     }
//   })
// },
// Trong computedRole():
computedRole() {
  console.log('Current message in computedRole:', this.message) // <-- Kiểm tra props nhận được
  const role = this.message?.role?.toLowerCase?.()
  return role === 'ai' ? 'assistant' : (role === 'user' ? role : 'unknown-role')
}
  },
  methods: {
    async loadHistory() {
  try {
    const token = localStorage.getItem('token')
    console.log("Token đang dùng:", token)

    // Thay đổi endpoint từ /api/sessions thành /api/chat/sessions
    const res = await axios.get('http://localhost:8080/api/chat/sessions', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    this.sessions = res.data.map(s => ({
      ...s,
      messages: [] // Khởi tạo rỗng
    }))
    // Luôn để currentSessionId là null khi mới load
    this.currentSessionId = null;

    if (this.sessions.length > 0) {
      const session = this.sessions[0]
      console.log("💥 Gọi GET messages cho session ID:", session.id)

      this.currentSessionId = session.id

      const messageRes = await axios.get(`http://localhost:8080/api/chat/sessions/${session.id}/messages`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log("🔄 Server trả về:", messageRes.data)

      // Gán messages vào đúng session
      const found = this.sessions.find(s => s.id === session.id)
      if (found) found.messages = messageRes.data

found.messages = messageRes.data.map(msg => ({
  ...msg,
  role: this.normalizeRole(msg.role || msg.sender)
}))

    }
  } catch (error) {
    console.error("Lỗi khi tải lịch sử các đoạn chat:", error)
  }
},
async loadMessagesFor(sessionId) {
  const token = localStorage.getItem('token')
  const res = await axios.get(`http://localhost:8080/api/chat/sessions/${sessionId}/messages`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  // Chuẩn hóa ngay tại đây
  const normalizedMessages = res.data.map(msg => ({
    ...msg,
    role: this.normalizeRole(msg.role) // Đảm bảo luôn là 'user' hoặc 'assistant'
  }))

  const found = this.sessions.find(s => s.id === sessionId)
  if (found) {
    // Sử dụng Vue.set hoặc spread operator để đảm bảo reactivity
    this.$set(found, 'messages', normalizedMessages)
  }
},

normalizeRole(raw) {
  if (!raw) return 'unknown-role'
  const r = raw.toLowerCase()
  if (r === 'ai' || r === 'assistant') return 'assistant'
  if (r === 'user') return 'user'
  return 'unknown-role'
},

newChat() {
  this.currentSessionId = null
  this.input = ''
}
,

async switchChat(sessionId) {
  this.currentSessionId = sessionId

  const token = localStorage.getItem('token')
  const messageRes = await axios.get(`http://localhost:8080/api/chat/sessions/${sessionId}/messages`, {
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const found = this.sessions.find(s => s.id === sessionId)
  if (found) {
    found.messages = messageRes.data.map(msg => ({
      ...msg,
      role: this.normalizeRole(msg.role || msg.sender)
    }))
  }
}
,

  startRenaming(session) {
    this.renamingId = session.id;
    this.newTitle = session.title;
  },

async renameSession(payload) {
  if (!payload?.title) {
    console.error('Title is missing in payload:', payload)
    return
  }

  try {
    const token = localStorage.getItem('token')
    console.log('Sending request with:', payload.id, payload.title) // Debug
    
    const response = await axios.put(
      `http://localhost:8080/api/chat/sessions/${payload.id}/title`,
      { title: payload.title },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    )

    // Cập nhật UI
    const session = this.sessions.find(s => s.id === payload.id)
    if (session) {
      session.title = payload.title
    }
  } catch (err) {
    console.error('Rename error:', err)
    alert(err.response?.data || 'Đổi tên thất bại')
  }
},

    async deleteSession(sessionId) {
  try {
    const token = localStorage.getItem('token')

    // GỌI API XOÁ PHIÊN TRÊN BACKEND
    await axios.delete(`http://localhost:8080/api/chat/sessions/${sessionId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    // Xoá local
    const index = this.sessions.findIndex(s => s.id === sessionId)
    if (index !== -1) {
      this.sessions.splice(index, 1)
      if (this.currentSessionId === sessionId) {
        this.currentSessionId = this.sessions.length > 0 ? this.sessions[0].id : null
      }
    }

  } catch (err) {
    console.error('Lỗi khi xoá session:', err)
  }
},

    copyMessage(content) {
      navigator.clipboard.writeText(content)
    },

    editMessage(index, newContent) {
      if (this.currentMessages[index]) {
        this.currentMessages[index].content = newContent
      }
    },

async sendMessage() {
  const content = this.input.trim()
  if (!content) return

  this.isTyping = true
  this.input = ''

  let session

  try {
    //  if (!this.currentSessionId && this.sessions.length > 0) {
    //   // Có thể thêm logic hỏi người dùng muốn tiếp tục session cũ hay tạo mới
    //   // Ở đây mặc định sẽ tạo mới
    //   this.currentSessionId = null;
    // }
    const token = localStorage.getItem('token')

    // ✅ Nếu chưa có session hiện tại → tạo mới
    if (!this.currentSessionId) {
      const res = await axios.post('http://localhost:8080/api/chat/sessions', {}, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      session = {
        id: res.data.id,
        title: '', // ❌ Không gán ngay
        messages: []
      }

      this.sessions.unshift(session)
      this.currentSessionId = session.id
    } else {
      session = this.sessions.find(s => s.id === this.currentSessionId)
    }

    // ✅ Gửi tin nhắn người dùng
    session.messages.push({ role: 'user', content })

    // ✅ Gửi nội dung tới server để lấy phản hồi từ AI
    const response = await axios.post(
      `http://localhost:8080/api/chat/sessions/${session.id}/messages`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const reply = response.data?.content || '⚠️ Không nhận được phản hồi từ AI.'
const assistantMessage = { role: 'assistant', content: '' }
session.messages.push(assistantMessage)

// Kích hoạt "AI đang gõ"
this.isTyping = true
session.messages = [...session.messages]

for (let i = 0; i < reply.length; i++) {
  await new Promise(resolve => setTimeout(resolve, 20)) // Delay từng chữ
  assistantMessage.content += reply[i]

  // Force Vue nhận thay đổi reactive
  session.messages = [...session.messages]
}

// Kết thúc typing
this.isTyping = false


    // ✅ Nếu tiêu đề chưa có → gọi API sinh tiêu đề AI
    if (!session.title || session.title === 'New chat') {
      const titleRes = await axios.post(
        `http://localhost:8080/api/chat/sessions/${session.id}/generate-title`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      session.title = titleRes.data || 'Chat không tên'
    }

    // ⚠️ Force Vue reactivity:
    session.messages = [...session.messages]

    // this.currentSessionId = null
    // this.$nextTick(() => {
    //   this.currentSessionId = session.id
    // })

  } catch (error) {
    console.error("Lỗi gửi tin nhắn:", error)
    if (session) {
      session.messages.push({ role: 'assistant', content: '⚠️ Lỗi khi gửi tin nhắn.' })
    }
  } finally {
    this.isTyping = false
  }
}
,

    openSettings() {
      // TODO: Mở modal cài đặt nếu cần
    }
  },

  async created() {
  await this.loadHistory();
  
  // Thêm event listener để xử lý khi người dùng refresh trang
  window.addEventListener('beforeunload', () => {
    // Đặt lại trạng thái khi refresh
    localStorage.setItem('shouldStartNewChat', 'true');
  });
  
  // Kiểm tra nên bắt đầu chat mới hay không
  if (localStorage.getItem('shouldStartNewChat') === 'true') {
    localStorage.removeItem('shouldStartNewChat');
    this.currentSessionId = null;
  }
},
}
</script>

<style scoped>
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
