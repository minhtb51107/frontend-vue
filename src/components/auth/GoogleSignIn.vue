<template>
  <div class="social-login">
    <p class="with-text">Hoặc đăng nhập với</p>
    <div ref="googleSignInBtn" class="google-btn-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useGoogleAuth } from '@/composables/useGoogleAuth';

// Sửa lại: Component này chỉ emit 'success' với token, hoặc 'error'
const emit = defineEmits(['success', 'error']);

const googleSignInBtn = ref(null);
const { isGoogleLoaded, initializeGoogleAuth, handleGoogleLogin } = useGoogleAuth();

const handleGoogleResponse = async (response) => {
  try {
    // Lấy token từ composable
    const token = await handleGoogleLogin(response.credential);
    // Gửi token lên cho component cha để xử lý
    emit('success', token);
  } catch (error) {
    emit('error', error.message);
  }
};

onMounted(() => {
  if (isGoogleLoaded.value && googleSignInBtn.value) {
    initializeGoogleAuth(googleSignInBtn.value, handleGoogleResponse);
  }
});

watch([isGoogleLoaded, googleSignInBtn], ([loaded, element]) => {
  if (loaded && element) {
    initializeGoogleAuth(element, handleGoogleResponse);
  }
});
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