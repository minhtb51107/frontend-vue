import { ref } from 'vue'
import { chatService } from '@/services/chatService'
import { normalizeRole } from '@/utils/roleNormalizer'

export function useChat(sessions, currentSessionId) {
  const isTyping = ref(false)
  const input = ref('')
  
  async function loadMessages(sessionId) {
    try {
      const response = await chatService.getMessages(sessionId)
      const normalizedMessages = response.data.map(msg => ({
        ...msg,
        role: normalizeRole(msg.role || msg.sender)
      }))
      
      const session = sessions.value.find(s => s.id === sessionId)
      if (session) {
        session.messages = normalizedMessages
      }
    } catch (error) {
      console.error("Lỗi khi tải messages:", error)
      throw error
    }
  }
  
  async function sendMessage() { // ✅ XÓA THAM SỐ content
    const content = input.value.trim() // ✅ LẤY TỪ input.value
    if (!content) return
  
    isTyping.value = true
    input.value = ''
    
    let session
    
    try {
      // Nếu chưa có session hiện tại → tạo mới
      if (!currentSessionId.value) {
        // ✅ THÊM IMPORT VÀ GỌI createNewSession
        const newSession = await createNewSession()
        session = newSession
        currentSessionId.value = newSession.id // ✅ CẬP NHẬT currentSessionId
      } else {
        session = sessions.value.find(s => s.id === currentSessionId.value)
      }
      
      // Thêm tin nhắn người dùng
      session.messages.push({ role: 'user', content })
      
      // Gửi tin nhắn đến server
      const response = await chatService.sendMessage(session.id, content)
      const reply = response.data?.content || '⚠️ Không nhận được phản hồi từ AI.'
      
      // Thêm tin nhắn assistant và hiệu ứng typing
      const assistantMessage = { role: 'assistant', content: '' }
      session.messages.push(assistantMessage)
      
      // Hiệu ứng gõ từng chữ
      for (let i = 0; i < reply.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 20))
        assistantMessage.content += reply[i]
        // Force reactivity - cần thiết vì Vue 3
        sessions.value = [...sessions.value]
      }
      
      // Nếu session chưa có tiêu đề, tạo tiêu đề tự động
      if (!session.title || session.title === 'New chat') {
        await generateTitle(session.id)
      }
      
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error)
      if (session) {
        session.messages.push({ role: 'assistant', content: '⚠️ Lỗi khi gửi tin nhắn.' })
      }
    } finally {
      isTyping.value = false
    }
  }
  
  async function generateTitle(sessionId) {
    try {
      const response = await chatService.generateTitle(sessionId)
      const session = sessions.value.find(s => s.id === sessionId)
      if (session) {
        session.title = response.data || 'Chat không tên'
        // Force reactivity
        sessions.value = [...sessions.value]
      }
    } catch (error) {
      console.error("Lỗi khi tạo tiêu đề:", error)
    }
  }
  
  // ✅ THÊM HÀM createNewSession (copy từ useSession hoặc import)
  async function createNewSession() {
    try {
      const response = await chatService.createSession()
      const newSession = {
        id: response.data.id,
        title: '',
        messages: []
      }
      sessions.value.unshift(newSession)
      return newSession
    } catch (error) {
      console.error("Lỗi khi tạo session mới:", error)
      throw error
    }
  }
  
  return {
    isTyping,
    input,
    loadMessages,
    sendMessage
  }
}