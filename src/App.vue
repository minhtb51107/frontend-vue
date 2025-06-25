<template>
  <div class="chat-container">
    <h2>Trợ lý AI Dạy Lập Trình</h2>
    <div class="chat-box">
      <div v-for="(msg, index) in messages" :key="index">
        <p><b>{{ msg.role }}:</b> {{ msg.content }}</p>
      </div>
    </div>
    <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Hỏi lỗi code của bạn..." />
    <button @click="sendMessage">Gửi</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const userInput = ref('')
const messages = ref([])

const sendMessage = async () => {
  if (!userInput.value.trim()) return
  messages.value.push({ role: 'Bạn', content: userInput.value })
  const res = await fetch('http://localhost:8080/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userInput.value })
  })
  const data = await res.json()
  messages.value.push({ role: 'AI', content: data.reply })
  userInput.value = ''
}
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: auto;
  font-family: Arial, sans-serif;
}
.chat-box {
  height: 400px;
  overflow-y: auto;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 10px;
  background: #f9f9f9;
}
</style>
