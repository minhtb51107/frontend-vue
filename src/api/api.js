import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Thêm interceptor để tự động gắn token vào header
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  // Auth
  login(credentials) {
    return api.post('/api/auth/login', credentials);
  },
  register(userData) {
    return api.post('/api/auth/register', userData);
  },
  sendVerificationCode(email) {
    return api.post('/api/auth/send-code', { email });
  },
  
  // Chat
  getSessions() {
    return api.get('/api/sessions');
  },
  createSession(title) {
    return api.post('/api/sessions', { title });
  },
  getMessages(sessionId) {
    return api.get(`/api/chat/${sessionId}/messages`);
  },
  sendMessage(sessionId, content) {
    return api.post(`/api/chat/sessions/${sessionId}/messages`, { content });
  },
  
  // User
  getUser() {
    return api.get('/api/user');
  }
};