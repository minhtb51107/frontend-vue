import apiClient from './api'

export const chatService = {
  // Session operations
  getSessions() {
    return apiClient.get('/chat/sessions')
  },
  
  createSession() {
    return apiClient.post('/chat/sessions', {})
  },
  
  renameSession(sessionId, title) {
    return apiClient.put(`/chat/sessions/${sessionId}/title`, { title })
  },
  
  deleteSession(sessionId) {
    return apiClient.delete(`/chat/sessions/${sessionId}`)
  },
  
  generateTitle(sessionId) {
    return apiClient.post(`/chat/sessions/${sessionId}/generate-title`, {})
  },
  
  // Message operations
  getMessages(sessionId) {
    return apiClient.get(`/chat/sessions/${sessionId}/messages`)
  },
  
// ✅ HÀM MỚI: Chỉ để upload file, gọi đúng controller backend
  uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Gọi đúng endpoint của DocumentIngestionController
    return apiClient.post('/api/documents/upload', formData, {
       // Để Axios tự xử lý headers 'multipart/form-data'
    });
  },

  // ... (các hàm message khác) ...
  
// ✅ SỬA LẠI HÀM NÀY
  // Nó phải nhận 3 tham số (id, content, file)
  sendMessage(sessionId, content, file = null) {
    // 1. Tạo FormData
    const formData = new FormData();
    formData.append('content', content);
    
    // 2. Thêm file nếu nó tồn tại
    if (file) {
      formData.append('file', file);
    }

    // 3. Gửi dưới dạng multipart/form-data
    // Backend ChatMessageController đang chờ chính xác điều này
    return apiClient.post(`/chat/sessions/${sessionId}/messages`, formData, {
       headers: {
         // Để Axios tự set Content-Type
       }
    });
  },
}
