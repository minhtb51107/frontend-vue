import { onMounted, ref } from 'vue'
import { authService } from '@/services/authService'

export function useGoogleAuth() {
  const isGoogleLoaded = ref(false)

  onMounted(() => {
    // Kiểm tra xem Google API đã được tải chưa
    if (typeof window.google !== 'undefined') {
      isGoogleLoaded.value = true
      return
    }

    // Nếu chưa, thêm script và chờ tải
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => {
      isGoogleLoaded.value = true
    }
    document.head.appendChild(script)
  })

  function initializeGoogleAuth(element, callback) {
    if (!isGoogleLoaded.value || !element) return

    window.google.accounts.id.initialize({
      client_id: '758520677856-j98pg9k2fju9545q0ffffmsnr9b1qtk9.apps.googleusercontent.com',
      callback
    })

    window.google.accounts.id.renderButton(element, {
      theme: 'outline',
      size: 'large'
    })
  }

async function handleGoogleLogin(idToken) {
    try {
        const response = await authService.loginWithGoogle(idToken)
        localStorage.setItem('token', response.data.token)
        // SỬA LẠI DÒNG NÀY:
        return response.data.token // <<< PHẢI TRẢ VỀ CHUỖI TOKEN, KHÔNG PHẢI OBJECT
    } catch (error) {
        throw new Error(error.response?.data || 'Đăng nhập Google thất bại!')
    }
}

  return {
    isGoogleLoaded,
    initializeGoogleAuth,
    handleGoogleLogin
  }
}