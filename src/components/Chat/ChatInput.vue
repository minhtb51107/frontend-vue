<template>
  <footer class="chat-input">
    <div v-if="file" class="file-chip">
      <span>{{ file.name }}</span>
      <button @click="removeFile" class="remove-file-btn" title="Xóa file">×</button>
    </div>

    <div class="input-wrapper">
      <button @click="triggerFileInput" :disabled="isUploading" class="upload-button" title="Đính kèm tài liệu">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v11.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/></svg>
      </button>

      <textarea
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @keyup.enter.exact.prevent="$emit('send')"
        placeholder="Gửi một tin nhắn (có thể đính kèm file...)"
        ref="textarea"
        :disabled="isUploading"
      />
      
      <button @click="$emit('send')" :disabled="isUploading" class="send-button" title="Gửi tin nhắn">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z" /></svg>
      </button>
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

<script>
// ❌ XÓA IMPORT NÀY (Vì chúng ta không upload ở đây nữa)
// import { uploadDocument } from '../../services/chatService'; 

export default {
  props: {
    modelValue: String,
    file: Object, // ✅ NHẬN FILE TỪ COMPONENT CHA
  },
  // ✅ CẬP NHẬT EMITS
  emits: ['update:modelValue', 'send', 'update:file'], 
  
  data() {
    return {
      // ✅ VẪN CẦN 'isUploading' ĐỂ VÔ HIỆU HÓA NÚT BẤM
      // (Nó sẽ được kích hoạt bởi component cha, nhưng để đơn giản, ta giữ lại)
      isUploading: false, 
    };
  },

  methods: {
    focus() {
      this.$refs.textarea.focus()
    },
    
    triggerFileInput() {
      // Reset để có thể chọn lại file cũ
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = null;
      }
      this.$refs.fileInput.click();
    },

    /**
     * ✅ THAY ĐỔI: Chỉ cần emit file lên component cha
     */
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Gửi file lên cho ChatApp.vue
      this.$emit('update:file', file);
    },
    
    /**
     * ✅ THÊM: Hàm xóa file
     */
    removeFile() {
      // Báo cho cha biết là file đã bị xóa
      this.$emit('update:file', null);
    }
  }
}
</script>

<style scoped>
.chat-input {
  padding: 20px;
  background: rgb(34, 34, 34);
  border-top: 1px solid #2e2e2e;
  display: flex;
  flex-direction: column; /* ✅ THAY ĐỔI: Để chip nằm trên */
  align-items: center; /* Căn giữa */
}

/* ✅ STYLE MỚI: Cho "chip" file */
.file-chip {
  display: flex;
  align-items: center;
  background: #3a3a3a;
  border: 1px solid #555;
  border-radius: 12px;
  padding: 4px 8px;
  margin-bottom: 10px;
  font-size: 0.85rem;
  color: #ddd;
  max-width: 400px;
}
.file-chip span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.remove-file-btn {
  background: none;
  border: none;
  color: #aaa;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  margin-left: 8px;
  padding: 0;
  line-height: 1;
}
.remove-file-btn:hover {
  color: #fff;
}

.input-wrapper {
  /* ... (style cũ giữ nguyên) ... */
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 750px;
  background: rgb(48, 48, 48);
  border-radius: 18px;
  padding: 12px;
}

.input-wrapper textarea {
  /* ... (style cũ giữ nguyên) ... */
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  resize: none;
  font-size: 1rem;
  line-height: 1.4;
  padding-left: 40px; 
  padding-right: 40px;
}

.send-button {
  /* ... (style cũ giữ nguyên) ... */
  position: absolute;
  right: 12px;
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  opacity: 0.7;
}

.upload-button {
  /* ... (style cũ giữ nguyên) ... */
  position: absolute;
  left: 12px;
  background: transparent;
  border: none;
  color: #ffffff;
  cursor: pointer;
  opacity: 0.7;
}

/* ... (style hover/disabled/hidden giữ nguyên) ... */
.upload-button:hover, .send-button:hover { opacity: 1; }
.upload-button:disabled, .send-button:disabled { opacity: 0.3; cursor: not-allowed; }
.input-wrapper textarea:disabled { opacity: 0.5; }
.file-input-hidden { display: none; }
</style>