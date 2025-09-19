<!-- components/LoginForm.vue -->
<template>
  <div class="login-form">
    <h2 class="form-title">Đăng nhập</h2>
    <form @submit.prevent="onSubmit">
      <input v-model="form.email" type="text" placeholder="Email" required />
      <div class="password-wrapper">
        <input
          :type="showPassword ? 'text' : 'password'"
          v-model="form.password"
          placeholder="Mật khẩu"
          required
        />
        <span class="toggle-eye" @click="showPassword = !showPassword">
          {{ showPassword ? 'Ẩn' : 'Hiện' }}
        </span>
      </div>
      <div class="login-button">
        <button type="submit">Đăng nhập</button>
      </div>
      <div class="social-login">
        <p class="with-text">Hoặc đăng nhập với</p>
        <div ref="googleSignInBtn"></div>
      </div>
    </form>
    <p class="message">{{ message }}</p>
    <p class="switch-form">
      Bạn chưa có tài khoản?
      <a @click.prevent="$emit('switchForm')" href="#">Hãy đăng ký</a>
    </p>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: ['message'],
  emits: ['loginSuccess', 'switchForm', 'update:message'],
  data() {
    return {
      form: { email: '', password: '' },
      showPassword: false
    };
  },
  mounted() {
    this.renderGoogleButton();
  },
  methods: {
    async onSubmit() {
      try {
        const res = await axios.post('http://localhost:8080/api/auth/login', this.form);
        localStorage.setItem('token', res.data);
        this.$emit('update:message', 'Đăng nhập thành công!');
        this.$emit('loginSuccess', this.form.email);
        this.$router.push('/');
      } catch (err) {
        this.$emit('update:message', err.response?.data || 'Đăng nhập thất bại!');
      }
    },
    renderGoogleButton() {
      if (typeof window.google !== 'undefined' && this.$refs.googleSignInBtn) {
        this.$refs.googleSignInBtn.innerHTML = '';
        window.google.accounts.id.initialize({
          client_id: '758520677856-j98pg9k2fju9545q0ffffmsnr9b1qtk9.apps.googleusercontent.com',
          callback: this.handleGoogleResponse
        });
        window.google.accounts.id.renderButton(this.$refs.googleSignInBtn, {
          theme: 'outline',
          size: 'large'
        });
      }
    },
    async handleGoogleResponse(response) {
      const idToken = response.credential;
      try {
        const res = await axios.post('http://localhost:8080/api/auth/login/google', { idToken });
        localStorage.setItem('token', res.data);
        this.$emit('update:message', 'Đăng nhập Google thành công!');
        const payload = JSON.parse(atob(res.data.split('.')[1]));
        this.$emit('loginSuccess', payload.sub || payload.email);
        this.$router.push('/');
      } catch (err) {
        this.$emit('update:message', err.response?.data || 'Đăng nhập Google thất bại!');
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