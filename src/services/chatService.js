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
  
  sendMessage(sessionId, content) {
    return apiClient.post(`/chat/sessions/${sessionId}/messages`, { content })
  },
}