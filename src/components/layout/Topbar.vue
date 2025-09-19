<template>
  <header class="topbar">
    <div class="topbar-left">
      <span v-if="username">👤 {{ username }}</span>
    </div>

    <div class="topbar-right">
      <button class="btn-settings" @click="$emit('open-settings')" title="Cài đặt">⚙️</button>
      <button v-if="!username" class="btn-login" @click="$router.push('/auth')">Đăng nhập</button>
      <button v-else class="btn-logout" @click="$emit('logout')">Đăng xuất</button>
    </div>
  </header>
</template>

<script>
export default {
  props: {
    username: String
  }
}
</script>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #202123;
  color: white;
  padding: 10px 20px;
  border-bottom: 1px solid #2d2d2f;
}

.btn-settings,
.btn-login,
.btn-logout {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 14px;
  margin-left: 10px;
}

.btn-settings:hover,
.btn-login:hover,
.btn-logout:hover {
  color: #10a37f;
}
</style>
