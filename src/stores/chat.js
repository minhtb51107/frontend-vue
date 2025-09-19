import { defineStore } from "pinia";
import { chatService } from "@/services/chatService";
import { normalizeRole } from "@/utils/normalizeRole";

export const useChatStore = defineStore("chat", {
  state: () => ({
    sessions: [],
    currentSessionId: null,
    isTyping: false,
  }),

  getters: {
    currentSession: (state) =>
      state.sessions.find((s) => s.id === state.currentSessionId) || null,
    messages: (state) => {
      const s = state.sessions.find((x) => x.id === state.currentSessionId);
      return s ? s.messages : [];
    },
  },

  actions: {
    async loadHistory(token) {
      const res = await chatService.getSessions(token);
      this.sessions = res.data.map((s) => ({ ...s, messages: [] }));
      this.currentSessionId = null;
    },

    async loadMessagesFor(sessionId, token) {
      const res = await chatService.getMessages(sessionId, token);
      const normalized = res.data.map((m) => ({
        ...m,
        role: normalizeRole(m.role || m.sender),
      }));
      const session = this.sessions.find((s) => s.id === sessionId);
      if (session) session.messages = normalized;
    },

    async newChat(token) {
      const res = await chatService.createSession(token);
      const session = { id: res.data.id, title: "", messages: [] };
      this.sessions.unshift(session);
      this.currentSessionId = session.id;
    },

    async sendMessage(content, token) {
      if (!content.trim()) return;
      let session = this.sessions.find((s) => s.id === this.currentSessionId);

      if (!session) {
        await this.newChat(token);
        session = this.sessions.find((s) => s.id === this.currentSessionId);
      }

      session.messages.push({ role: "user", content });

      this.isTyping = true;
      const res = await chatService.sendMessage(session.id, content, token);
      session.messages.push({
        role: "assistant",
        content: res?.data?.content || "⚠️ Không nhận được phản hồi từ AI.",
      });
      this.isTyping = false;

      if (!session.title) {
        const t = await chatService.generateTitle(session.id, token);
        session.title = t?.data || "Chat không tên";
      }
    },

    async renameSession(sessionId, title, token) {
      await chatService.renameSession(sessionId, title, token);
      const session = this.sessions.find((s) => s.id === sessionId);
      if (session) session.title = title;
    },

    async deleteSession(sessionId, token) {
      await chatService.deleteSession(sessionId, token);
      this.sessions = this.sessions.filter((s) => s.id !== sessionId);
      if (this.currentSessionId === sessionId) {
        this.currentSessionId = this.sessions[0]?.id || null;
      }
    },
  },
});
