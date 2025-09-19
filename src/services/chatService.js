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
  
  sendMessage(sessionId, content, file = null) {
    // 1. Tạo FormData
    const formData = new FormData();
    formData.append('content', content);
    
    // 2. Thêm file nếu nó tồn tại
    if (file) {
      formData.append('file', file);
    }

    // 3. Gửi dưới dạng multipart/form-data
    // Axios sẽ tự động set Content-Type đúng khi bạn gửi FormData
    return apiClient.post(`/chat/sessions/${sessionId}/messages`, formData, {
       headers: {
         // KHÔNG set 'Content-Type': 'multipart/form-data' ở đây!
         // Hãy để Axios tự làm điều đó.
       }
    });
  },
}
