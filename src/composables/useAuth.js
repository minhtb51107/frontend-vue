import { ref } from 'vue'
// import { authService } from '@/services/authService' // Không cần service riêng nữa
import { useStore } from 'vuex' // ✅ 1. Import useStore
import { useRouter } from 'vue-router'

export function useAuth() {
  const message = ref('')
  const success = ref(false)
  const isLoading = ref(false)
  const router = useRouter()
  const store = useStore() // ✅ 2. Lấy store instance

  async function login(credentials) {
    isLoading.value = true
    try {
      // ✅ 3. Dispatch action 'auth/login' từ store
      await store.dispatch('auth/login', credentials)
      
      message.value = 'Đăng nhập thành công!'
      success.value = true
      
      // Chuyển hướng sau khi đăng nhập thành công
      router.push({ name: 'ChatApp' }); // Thay 'ChatApp' bằng tên route của bạn
      
    } catch (error) {
      message.value = error.response?.data?.message || 'Đăng nhập thất bại!'
      success.value = false
      throw error
    } finally {
      isLoading.value = false
    }
  }

  // Các hàm register, sendVerificationCode cũng nên được sửa tương tự để dispatch action của store
  async function register(userData) {
    isLoading.value = true
    try {
      await store.dispatch('auth/register', userData)
      message.value = 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực.'
      success.value = true
    } catch (error) {
      message.value = error.response?.data?.message || 'Đăng ký thất bại!'
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