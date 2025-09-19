<template>
  <div class="social-login">
    <p class="with-text">Hoặc đăng nhập với</p>
    <div ref="googleSignInBtn" class="google-btn-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useGoogleAuth } from '@/composables/useGoogleAuth'

const emit = defineEmits(['success', 'error'])

const googleSignInBtn = ref(null)
const { isGoogleLoaded, initializeGoogleAuth, handleGoogleLogin } = useGoogleAuth()

const handleGoogleResponse = async (response) => {
  try {
    const token = await handleGoogleLogin(response.credential)
    const payload = JSON.parse(atob(token.split('.')[1]))
    emit('success', payload.sub || payload.email)
  } catch (error) {
    emit('error', error.message)
  }
}

onMounted(() => {
  if (isGoogleLoaded.value && googleSignInBtn.value) {
    initializeGoogleAuth(googleSignInBtn.value, handleGoogleResponse)
  }
})

watch([isGoogleLoaded, googleSignInBtn], ([loaded, element]) => {
  if (loaded && element) {
    initializeGoogleAuth(element, handleGoogleResponse)
  }
})
</script>

<style scoped>
.social-login {
  text-align: center;
  margin: 20px 0;
}

.with-text {
  margin-bottom: 10px;
  font-size: 14px;
}

.google-btn-container {
  display: flex;
  justify-content: center;
}
</style>