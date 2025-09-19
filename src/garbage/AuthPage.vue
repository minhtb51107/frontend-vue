<template>
  <div class="auth-container">
    <transition name="fade" mode="out-in">
      <div key="auth-form">
        <LoginForm
          v-if="isLogin"
          :message="loginMessage"
          @loginSuccess="onLoginSuccess"
          @switchForm="isLogin = false"
          @update:message="loginMessage = $event"
        />
        <RegisterForm
          v-else
          :message="registerMessage"
          @switchForm="isLogin = true"
          @update:message="registerMessage = $event"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import LoginForm from '../garbage/LoginForm.vue';
import RegisterForm from '../garbage/RegisterForm.vue';

export default {
  components: { LoginForm, RegisterForm },
  data() {
    return {
      isLogin: true,
      loginMessage: '',
      registerMessage: ''
    };
  },
  methods: {
    onLoginSuccess(email) {
      this.$emit('login-success', email);
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