<template>
  <header class="topbar">
    <div class="topbar-left">
      <h1 class="app-title"></h1>
    </div>

    <div class="topbar-right">
      <div v-if="username" class="user-info">
        <span class="username">{{ username }}</span>
        <div class="avatar" :title="username">
          {{ username.charAt(0).toUpperCase() }}
        </div>
        <button class="icon-btn" @click="$emit('logout')" title="Đăng xuất">
          <svg xmlns="http://www.w.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
            <path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
          </svg>
        </button>
      </div>

      <button v-else class="login-btn" @click="$router.push('/auth')">
        Đăng nhập
      </button>
    </div>
  </header>
</template>

<script setup>
// Sử dụng <script setup> cho đồng bộ và hiện đại
defineProps({
  username: String
});

defineEmits(['logout', 'open-settings']);
</script>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* background-color: #1e1e1e;  */
  color: #e0e0e0;
  padding: 8px 24px;
  /* border-bottom: 1px solid #333; */
  height: 60px; /* Cố định chiều cao */
  flex-shrink: 0;
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background: linear-gradient(90deg, #1e1e1e, #2a2a2a); */
}

/* --- Bên trái --- */
.topbar-left {
  flex: 1;
}
.app-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
}

/* --- Bên phải --- */
.topbar-right {
  display: flex;
  align-items: center;
  gap: 16px; /* Khoảng cách giữa các phần tử */
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  font-weight: 500;
  font-size: 0.9rem;
  color: #ccc;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #0078d4;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 1rem;
  cursor: default;
}

/* --- Các nút bấm --- */
.icon-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, color 0.2s;
}
.icon-btn:hover {
  background-color: #333;
  color: #fff;
}

.login-btn {
  background-color: #0078d4;
  color: #ffffff;
  border: none;
  padding: 8px 18px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}
.login-btn:hover {
  background-color: #005a9e;
}
</style>