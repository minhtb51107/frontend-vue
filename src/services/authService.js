import apiClient from './api'

export const authService = {
  // Login với email/password
  login(credentials) {
    return apiClient.post('/auth/login', credentials)
  },
  
  // Login với Google
  loginWithGoogle(idToken) {
    return apiClient.post('/auth/login/google', { idToken })
  },
  
  // Đăng ký tài khoản
  register(userData) {
    return apiClient.post('/auth/register', userData)
  },
  
  // Gửi mã xác minh
  sendVerificationCode(email) {
    return apiClient.post('/auth/send-code', { email })
  }
}