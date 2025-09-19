<template>
  <div class="register-form">
    <h2 class="form-title">Đăng ký</h2>
    <form @submit.prevent="handleSubmit">
      <div class="row">
        <FormInput
          v-model="form.fullName"
          class="flex-8"
          placeholder="Họ và tên"
          required
        />
        <FormInput
          v-model.number="form.age"
          class="flex-2"
          type="number"
          placeholder="Tuổi"
          required
        />
      </div>
      
      <FormInput
        v-model="form.occupation"
        placeholder="Công việc hiện tại"
      />
      
      <FormInput
        v-model="form.email"
        type="email"
        placeholder="Email"
        required
      />
      
      <PasswordInput
        v-model="form.password"
        placeholder="Mật khẩu"
        required
      />
      
      <div class="row">
        <FormInput
          v-model="form.verificationCode"
          class="flex-7"
          placeholder="Mã xác minh"
          required
        />
        <Button
          type="button"
          class="flex-3"
          variant="outline"
          @click="sendCode"
          :isLoading="isSendingCode"
        >
          Gửi mã
        </Button>
      </div>
      
      <Button
        type="submit"
        :isLoading="isLoading"
      >
        Đăng ký
      </Button>
    </form>
    
    <p class="message" :class="{ success, error: !success }">{{ message }}</p>
    
    <p class="switch-form">
      Bạn đã có tài khoản?
      <a @click.prevent="$emit('switchForm')" href="#">Hãy đăng nhập</a>
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import FormInput from '@/components/ui/FormInput.vue'
import PasswordInput from '@/components/ui/PasswordInput.vue'
import Button from '@/components/ui/Button.vue'

const emit = defineEmits(['switchForm', 'update:message'])

const { message, success, isLoading, register, sendVerificationCode } = useAuth()
const isSendingCode = ref(false)

const form = ref({
  fullName: '',
  email: '',
  password: '',
  age: '',
  occupation: '',
  verificationCode: ''
})

const sendCode = async () => {
  if (!form.value.email) {
    emit('update:message', 'Vui lòng nhập email trước khi gửi mã')
    return
  }

  isSendingCode.value = true
  try {
    await sendVerificationCode(form.value.email)
    alert('Đã gửi mã xác minh đến email của bạn.')
  } catch (error) {
    emit('update:message', error.message)
  } finally {
    isSendingCode.value = false
  }
}

const handleSubmit = async () => {
  try {
    await register(form.value)
    // Reset form after successful registration
    form.value = {
      fullName: '',
      email: '',
      password: '',
      age: '',
      occupation: '',
      verificationCode: ''
    }
  } catch (error) {
    // Error is already handled in useAuth composable
  }
}
</script>

<style scoped>
.register-form {
  max-width: 360px;
  margin: 0 auto;
}

.form-title {
  margin-bottom: 24px;
  font-size: 28px;
  font-weight: 600;
  text-align: left;
}

.row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.flex-2 { flex: 2; }
.flex-3 { flex: 3; }
.flex-7 { flex: 7; }
.flex-8 { flex: 8; }

.message {
  text-align: center;
  font-size: 14px;
  margin: 10px 0;
}

.success {
  color: green;
}

.error {
  color: red;
}

.switch-form {
  font-size: 14px;
  text-align: center;
  margin-top: 20px;
}

.switch-form a {
  color: black;
  text-decoration: underline;
  cursor: pointer;
}
</style>