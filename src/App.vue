<template>
  <div id="app">
    <!-- ✅ Chỉ hiện ChatApp nếu đã đăng nhập -->
    <ChatApp
      v-if="username"
      :username="username"
      @logout="handleLogout"
    />

    <!-- ✅ Nếu chưa đăng nhập, hiện trang đăng nhập -->
    <router-view @login-success="handleLoginSuccess" />
  </div>
</template>

<script>
//import ChatApp from './components/ChatApp.vue'
import ChatApp from './views/ChatApp.vue'

export default {
  name: 'App',
  components: {
    ChatApp
  },
  data() {
    return {
      username: null
    };
  },
  created() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.username = payload.sub || payload.email || null;
      } catch (e) {
        this.username = null;
      }
    }
  },
  methods: {
    handleLoginSuccess(username) {
      this.username = username;
    },
    handleLogout() {
      this.username = null;
      localStorage.removeItem('token');
      this.$router.push('/auth');
    }
  }
}
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #343541;
  font-family: 'Segoe UI', sans-serif;
}

#app {
  height: 100vh;
  overflow: hidden;
}

.msg-content {
  user-select: text !important;
}

</style>
