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
    // Kiểm tra cả text và file
    if (!input.value.trim() && !file) return;

    const sessionId = currentSessionId.value;
    
    // Logic tạo session đã được chuyển lên ChatApp.vue,
    // nên ở đây ta có thể tin rằng sessionId đã tồn tại
    if (!sessionId) {
      console.error("Lỗi nghiêm trọng: sendMessage được gọi mà không có sessionId");
      return; 
    }

    const userMessageContent = input.value;
    
    // Thêm tin nhắn UI ngay lập tức
    const session = sessions.value.find(s => s.id === sessionId);
    if (session) {
      // Hiển thị tên file trên UI nếu có
      const displayContent = userMessageContent + (file ? `\n[Tệp đính kèm: ${file.name}]` : '');
      session.messages.push({
        id: Date.now(),
        content: displayContent,
        role: 'user',
        timestamp: new Date().toISOString()
      });
    }

    input.value = ''; // Xóa input
    isTyping.value = true;

    try {
      // ✅ GỌI HÀM SERVICE ĐÃ SỬA (với 3 tham số)
      const response = await chatService.sendMessage(sessionId, userMessageContent, file);
      
      if (session) {
        // Backend trả về một String (nội dung AI)
        // Chúng ta cần bọc nó trong một object tin nhắn
        const aiMessage = {
          id: response.data.id || Date.now() + 1, // Dùng ID từ backend nếu có, nếu không thì tự tạo
          content: response.data.content || response.data, // Backend có thể trả về object hoặc string
          role: 'assistant',
          sender: 'assistant',
          timestamp: response.data.timestamp || new Date().toISOString()
        };
        // Chuẩn hóa lại role
        aiMessage.role = normalizeRole(aiMessage.role || aiMessage.sender);

        session.messages.push(aiMessage); 
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