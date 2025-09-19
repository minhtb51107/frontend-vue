<!-- components/RegisterForm.vue -->
<template>
  <div class="register-form">
    <h2 class="form-title">Đăng ký</h2>
    <form @submit.prevent="onSubmit">
      <div class="row">
        <input class="flex-8" v-model="form.fullName" type="text" placeholder="Họ và tên" required />
        <input class="flex-2" v-model.number="form.age" type="number" placeholder="Tuổi" required />
      </div>
      <input v-model="form.occupation" type="text" placeholder="Công việc hiện tại" />
      <input v-model="form.email" type="email" placeholder="Email" required />
      <input v-model="form.password" type="password" placeholder="Mật khẩu" required />
      <div class="row">
        <input class="flex-7" v-model="form.verificationCode" type="text" placeholder="Mã xác minh" required />
        <button type="button" class="flex-3" @click="sendCode">Gửi mã</button>
      </div>
      <button type="submit">Đăng ký</button>
    </form>
    <p class="message" :class="{ success, error: !success }">{{ message }}</p>
    <p class="switch-form">
      Bạn đã có tài khoản?
      <a @click.prevent="$emit('switchForm')" href="#">Hãy đăng nhập</a>
    </p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['message'],
  emits: ['switchForm', 'update:message'],
  data() {
    return {
      form: {
        fullName: '',
        email: '',
        password: '',
        age: '',
        occupation: '',
        verificationCode: ''
      },
      success: false
    };
  },
  methods: {
    async sendCode() {
      try {
        await axios.post('http://localhost:8080/api/auth/send-code', { email: this.form.email });
        alert('Đã gửi mã xác minh đến email của bạn.');
      } catch {
        alert('Không thể gửi mã xác minh.');
      }
    },
    async onSubmit() {
      try {
        const res = await axios.post('http://localhost:8080/api/auth/register', this.form);
        this.$emit('update:message', res.data);
        this.success = true;
        this.form = {};
      } catch (err) {
        this.$emit('update:message', err.response?.data || 'Đăng ký thất bại!');
        this.success = false;
      }
    }
  }
};
</script>

<style scoped>
.auth-container {
  max-width: 360px;
  margin: 80px auto;
  font-family: 'Segoe UI', sans-serif;
  color: #000;
}

.form-box {
  display: flex;
  flex-direction: column;
}

.form-title {
  margin-bottom: 24px;
  font-size: 28px;
  font-weight: 600;
  text-align: left;
}

input, textarea, button {
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 12px;
  padding: 14px;
  border: 1px solid #aaa;
  border-radius: 8px;
  font-size: 14px;
  background: #fff;
  color: #000;
}

textarea {
  resize: vertical;
}

button[type="submit"], .google-button {
  background: #000;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

button:hover {
  background: #333;
}

.message {
  text-align: center;
  font-size: 14px;
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
}

.switch-form a {
  color: black;
  text-decoration: underline;
  cursor: pointer;
}

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 40px;
}

.toggle-eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 16px;
}

.social-login {
  text-align: center;
  margin: 20px 0;
}

.with-text {
  margin-bottom: 10px;
  font-size: 14px;
}

.google-button {
  background: #fff;
  border: 1px solid #000;
  color: #000;
  font-weight: 500;
}

.google-button:hover {
  background: #f5f5f5;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.google-signin-btn {
  background: #fff;
  border: 1px solid #000;
  color: #000;
  cursor: pointer;
  font-weight: 500;
}

.google-signin-btn:hover {
  background: #333;
  color: #ffffff;
}

.toggle-eye{
  padding-bottom: 15px;
}

.login-button{
  padding-top: 15px;
}
</style>
