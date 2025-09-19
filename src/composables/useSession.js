import { ref, computed } from 'vue'
import { chatService } from '@/services/chatService'
import { normalizeRole } from '@/utils/roleNormalizer'

export function useSession() {
  const sessions = ref([])
  const currentSessionId = ref(null)
  
  const currentSession = computed(() => {
    return sessions.value.find(s => s.id === currentSessionId.value) || null
  })
  
  async function loadSessions() {
    try {
      const response = await chatService.getSessions()
      sessions.value = response.data.map(s => ({
        ...s,
        messages: []
      }))
    } catch (error) {
      console.error("Lỗi khi tải sessions:", error)
      throw error
    }
  }
  
  async function createNewSession() {
    try {
      const response = await chatService.createSession()
      const newSession = {
        id: response.data.id,
        title: '',
        messages: []
      }
      sessions.value.unshift(newSession)
      currentSessionId.value = newSession.id
      return newSession
    } catch (error) {
      console.error("Lỗi khi tạo session mới:", error)
      throw error
    }
  }
  
  async function renameSession(sessionId, title) {
    try {
      await chatService.renameSession(sessionId, title)
      const session = sessions.value.find(s => s.id === sessionId)
      if (session) {
        session.title = title
      }
    } catch (error) {
      console.error("Lỗi khi đổi tên session:", error)
      throw error
    }
  }
  
  async function deleteSession(sessionId) {
    try {
      await chatService.deleteSession(sessionId)
      const index = sessions.value.findIndex(s => s.id === sessionId)
      if (index !== -1) {
        sessions.value.splice(index, 1)
        if (currentSessionId.value === sessionId) {
          currentSessionId.value = sessions.value.length > 0 ? sessions.value[0].id : null
        }
      }
    } catch (error) {
      console.error("Lỗi khi xoá session:", error)
      throw error
    }
  }
  
  return {
    sessions,
    currentSessionId,
    currentSession,
    loadSessions,
    createNewSession,
    renameSession,
    deleteSession
  }
}