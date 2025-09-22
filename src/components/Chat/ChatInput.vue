<template>
  <footer class="chat-input-container">
    <div class="input-wrapper">
            <button @click="triggerFileInput" :disabled="isUploading" class="action-btn" title="Đính kèm tài liệu">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v11.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>
      </button>
      
      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @keyup.enter.exact.prevent="$emit('send')"
        placeholder="Nhập tin nhắn..."
        ref="textarea"
        :disabled="isUploading"
        rows="1"
      />
      
       <button @click="$emit('send')" :disabled="isUploading" class="action-btn send-button" title="Gửi tin nhắn">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
      </button>
    </div>
    
    <div v-if="file" class="file-chip">
      <span>{{ file.name }}</span>
      <button @click="removeFile" class="remove-file-btn" title="Xóa file">×</button>
    </div>

    <input 
      type="file" 
      ref="fileInput" 
      @change="handleFileUpload" 
      class="file-input-hidden" 
      accept=".pdf,.doc,.docx,.txt,.md"
    />
  </footer>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  modelValue: String,
  file: Object,
  isUploading: Boolean,
});

const emit = defineEmits(['update:modelValue', 'update:file', 'send']);

const fileInput = ref(null);
const textarea = ref(null);

const triggerFileInput = () => {
  fileInput.value.value = null; // Reset để có thể chọn lại file cũ
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const selectedFile = event.target.files[0];
  if (selectedFile) {
    emit('update:file', selectedFile);
  }
};

const removeFile = () => {
  emit('update:file', null);
};
</script>


<style scoped>
.chat-input-container {
  padding: 20px 0px;
  /* background-color: #111111; */
  /* border-top: 1px solid #333; */
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 820px;
  margin: 0 auto;
  background-color: #2c2c2c;
  border: 1px solid #444;
  border-radius: 24px;
  padding: 4px;
}

textarea {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #e0e0e0;
  resize: none;
  font-size: 1rem;
  line-height: 1.5;
  padding: 8px 12px;
  max-height: 200px; /* Giới hạn chiều cao tối đa */
}

.action-btn {
  background: transparent;
  border: none;
  color: #9e9e9e;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 8px;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, background-color 0.2s;
}

.action-btn:hover:not(:disabled) {
  color: #e0e0e0;
  background-color: #3a3a3a;
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.send-btn {
  color: #0078d4;
}
.send-btn:hover:not(:disabled) {
  background-color: #0078d4;
  color: white;
}

.file-chip {
  display: inline-flex;
  align-items: center;
  background: #3a3a3a;
  border: 1px solid #555;
  border-radius: 16px;
  padding: 4px 12px;
  margin: 10px auto 0;
  font-size: 0.85rem;
  color: #ddd;
  max-width: 400px;
}

.remove-file-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 8px;
  padding: 0;
}

.file-input-hidden {
  display: none;
}
</style>