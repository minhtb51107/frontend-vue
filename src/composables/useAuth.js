import { ref } from 'vue'
import { authService } from '@/services/authService'
import { useRouter } from 'vue-router'

export function useAuth() {
  const message = ref('')
  const success = ref(false)
  const isLoading = ref(false)
  const router = useRouter()

  async function login(credentials) {
    isLoading.value = true
    try {
      const response = await authService.login(credentials)
      localStorage.setItem('token', response.data)
      message.value = 'Đăng nhập thành công!'
      success.value = true
      return response.data
    } catch (error) {
      message.value = error.response?.data || 'Đăng nhập thất bại!'
      success.value = false
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function register(userData) {
    isLoading.value = true
    try {
      const response = await authService.register(userData)
      message.value = response.data
      success.value = true
      return response.data
    } catch (error) {
      message.value = error.response?.data || 'Đăng ký thất bại!'
      success.value = false
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function sendVerificationCode(email) {
    try {
      await authService.sendVerificationCode(email)
      return true
    } catch (error) {
      throw new Error('Không thể gửi mã xác minh.')
    }
  }

  return {
    message,
    success,
    isLoading,
    login,
    register,
    sendVerificationCode
  }
}