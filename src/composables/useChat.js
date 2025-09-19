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

  // ✅ SỬA HÀM NÀY
  async function sendMessage(file) { // Thêm 'file' làm tham số
    if (!input.value.trim() && !file) return;

    const sessionId = currentSessionId.value;
    if (!sessionId) return; // Không gửi nếu không có session

    const userMessageContent = input.value;
    const userMessage = {
      id: Date.now(),
      content: userMessageContent + (file ? `\n[Đã đính kèm: ${file.name}]` : ''), // Thêm tên file vào tin nhắn UI
      sender: 'user', // Sử dụng 'sender' thay vì 'role' cho nhất quán (hoặc 'role' tùy bạn)
      timestamp: new Date().toISOString()
    };
    
    // Lấy session hiện tại và thêm tin nhắn UI ngay lập tức
    const session = sessions.value.find(s => s.id === sessionId);
    if (session) {
      session.messages.push({
        ...userMessage,
        role: 'user' // Đảm bảo role được chuẩn hóa
      });
    }

    input.value = ''; // Xóa input
    isTyping.value = true;

    try {
      // ✅ GỌI HÀM SERVICE MỚI VỚI 3 THAM SỐ
      const response = await chatService.sendMessage(sessionId, userMessageContent, file);
      
      // Thêm phản hồi của AI (Giả sử backend trả về ChatMessageDTO)
      // (Mã của bạn trả về string, mã mục tiêu trả về object. Tôi dùng mã mục tiêu)
      // const reply = response.data?.content || response.data; // Lấy content từ object hoặc string
      if (session) {
        // Chuẩn hóa phản hồi từ backend
        const aiMessage = {
          ...response.data, // Giả sử response.data là { id, content, sender, timestamp }
          role: normalizeRole(response.data.role || response.data.sender)
        };
        session.messages.push(aiMessage); 
      }
    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
      if (session) {
        session.messages.push({
          id: Date.now() + 1,
          content: 'Xin lỗi, đã xảy ra lỗi khi gửi tin nhắn.',
          role: 'assistant',
          timestamp: new Date().toISOString()
        });
      }
    } finally {
      isTyping.value = false;
    }
  };
  
  // ❌ ĐÃ XÓA CÁC HÀM TRÙNG LẶP (generateTitle, createNewSession)
  
  return {
    isTyping,
    input,
    loadMessages,
    sendMessage
  }
}