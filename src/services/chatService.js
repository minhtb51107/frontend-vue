// src/services/chatService.js
import apiClient from './api'

export const chatService = {
  // === QUẢN LÝ SESSION ===
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
  
  // === GỬI TIN NHẮN (LUỒNG 1: TẠM THỜI) ===
  getMessages(sessionId) {
    return apiClient.get(`/chat/sessions/${sessionId}/messages`)
  },
  
  sendMessage(sessionId, content, file = null) {
    const formData = new FormData();
    formData.append('content', content);
    
    if (file) {
      formData.append('file', file);
    }

    // Gọi đến ChatMessageController
    return apiClient.post(`/chat/sessions/${sessionId}/messages`, formData, {
      headers: {
        // Để Axios tự set Content-Type
      }
    });
  },

  // === QUẢN LÝ KHO TRI THỨC (LUỒNG 2) ===

  /**
   * Tải file lên kho tri thức (Backend: DocumentIngestionController @PostMapping)
   */
  uploadKnowledgeFiles(files) {
    const formData = new FormData();
    
    for (const file of files) {
      formData.append('files', file); // Key "files" (số nhiều)
    }

    // Gọi đến DocumentIngestionController
    return apiClient.post('/documents/upload', formData);
  },

  /**
   * Lấy danh sách file từ kho tri thức (Backend: DocumentIngestionController @GetMapping)
   */
  getKnowledgeFiles() {
    return apiClient.get('/documents');
  },

  /**
   * Xóa 1 file khỏi kho tri thức (Backend: DocumentIngestionController @DeleteMapping)
   */
  deleteKnowledgeFile(fileName) {
    // Gửi fileName dưới dạng query parameter
    return apiClient.delete('/documents', {
      params: { fileName } // -> /documents?fileName=example.pdf
    });
  }
}