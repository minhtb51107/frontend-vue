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

  // ✅ SỬA HÀM NÀY ĐỂ NHẬN `file`
  async function sendMessage(file = null) { 
    if (!input.value.trim() && !file) return;

    const sessionId = currentSessionId.value;
    
    if (!sessionId) {
      console.error("Lỗi nghiêm trọng: sendMessage được gọi mà không có sessionId");
      return; 
    }

    const userMessageContent = input.value;
    const session = sessions.value.find(s => s.id === sessionId);
    
    if (session) {
      const displayContent = userMessageContent + (file ? `\n[Tệp đính kèm: ${file.name}]` : '');
      session.messages.push({
        id: Date.now(),
        content: displayContent,
        role: 'user',
        timestamp: new Date().toISOString()
      });
    }

    input.value = '';
    isTyping.value = true;

    try {
      const response = await chatService.sendMessage(sessionId, userMessageContent, file);
      
      if (session) {
        const aiMessage = {
          id: response.data.id || Date.now() + 1,
          content: response.data.content || response.data,
          role: 'assistant',
          sender: 'assistant',
          timestamp: response.data.timestamp || new Date().toISOString()
        };
        aiMessage.role = normalizeRole(aiMessage.role || aiMessage.sender);
        session.messages.push(aiMessage); 
      }

      // ✅ BỔ SUNG LOGIC GỌI TẠO TIÊU ĐỀ TẠI ĐÂY
      // Nếu session hiện tại chưa có tiêu đề, gọi API để tạo
      if (session && !session.title) {
        console.log(`Session ${sessionId} chưa có tiêu đề, đang tạo...`);
        const titleResponse = await chatService.generateTitle(sessionId);
        session.title = titleResponse.data || "Chat không tên";
      }

    } catch (error) {
      console.error('Lỗi gửi tin nhắn:', error);
      if (session) {
         session.messages.pop(); // Xóa tin nhắn lạc quan
         input.value = userMessageContent; // Trả lại input
         session.messages.push({
           id: Date.now() + 1,
           content: 'Lỗi: Không thể gửi tin nhắn.',
           role: 'assistant',
           timestamp: new Date().toISOString()
         });
      }
    } finally {
      isTyping.value = false;
    }
  };
  
  return {
    isTyping,
    input,
    loadMessages,
    sendMessage // Export hàm đã sửa
  }
}