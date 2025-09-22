<template>
  <div class="knowledge-panel">
    <div class="panel-header">
      <h2 class="panel-title">Kho Tri Thức</h2>
      <button @click="triggerFileUpload" :disabled="isUploading || isLoadingList" class="upload-button" title="Tải lên tài liệu mới">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
          <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
        </svg>
        Tải Lên
      </button>
      <input 
        type="file" 
        ref="fileInput" 
        @change="handleFilesSelected" 
        multiple 
        hidden
        accept=".pdf,.doc,.docx,.txt,.md" 
      />
    </div>

    <div class="status-message-container" v-if="uploadMessage">
      <p :class="['status-message', { 'error': isError, 'success': !isError }]">
        {{ uploadMessage }}
      </p>
    </div>

    <div class="file-list-container">
      <div v-if="isLoadingList" class="centered-feedback">
        <p>Đang tải danh sách...</p>
      </div>
      
      <ul v-else-if="knowledgeFiles.length > 0" class="file-list">
        <li v-for="file in knowledgeFiles" :key="file.fileName" class="file-item">
          <span class="file-icon">📄</span>
          <span class="file-name" :title="file.fileName">{{ file.fileName }}</span>
          <button @click="handleDeleteFile(file.fileName)" class="delete-btn" title="Xóa file">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
              <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92H4.885a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
            </svg>
          </button>
        </li>
      </ul>

      <div v-else class="centered-feedback">
        <p>Kho tri thức của bạn trống.</p>
        <span>Tải lên tài liệu để bắt đầu.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { chatService } from '@/services/chatService';

// --- State cho Upload ---
const fileInput = ref(null);
const isUploading = ref(false);
const uploadMessage = ref('');
const isError = ref(false);

// --- State cho List/Delete ---
const knowledgeFiles = ref([]); // [{ fileName: '...' }]
const isLoadingList = ref(true);

// === 1. LOGIC TẢI LÊN (UPLOAD) ===
const triggerFileUpload = () => {
  uploadMessage.value = '';
  fileInput.value.click();
};

const handleFilesSelected = async (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) return;

  isUploading.value = true;
  isError.value = false;
  uploadMessage.value = `Đang tải lên ${files.length} tệp...`;

  try {
    const response = await chatService.uploadKnowledgeFiles(files);
    isError.value = false;
    uploadMessage.value = response.data.message || 'Tải lên thành công!';
    await fetchFiles(); 
  } catch (error) {
    isError.value = true;
    uploadMessage.value = error.response?.data?.message || 'Có lỗi khi tải file.';
  } finally {
    isUploading.value = false;
    if (fileInput.value) fileInput.value.value = null;
  }
};

// === 2. LOGIC LẤY DANH SÁCH (GET) ===
const fetchFiles = async () => {
  isLoadingList.value = true;
  try {
    const response = await chatService.getKnowledgeFiles();
    knowledgeFiles.value = response.data;
  } catch (error) {
    isError.value = true;
    uploadMessage.value = "Không thể tải danh sách tài liệu.";
    knowledgeFiles.value = [];
  } finally {
    isLoadingList.value = false;
  }
};

// === 3. LOGIC XÓA (DELETE) ===
const handleDeleteFile = async (fileName) => {
  if (!confirm(`Bạn có chắc muốn xóa vĩnh viễn file "${fileName}"?`)) return;

  isError.value = false;
  uploadMessage.value = `Đang xóa ${fileName}...`;

  try {
    await chatService.deleteKnowledgeFile(fileName);
    uploadMessage.value = `Đã xóa thành công ${fileName}.`;
    await fetchFiles(); 
  } catch (error) {
    isError.value = true;
    uploadMessage.value = error.response?.data?.message || `Lỗi khi xóa ${fileName}.`;
  }
};

// === 4. LIFECYCLE ===
onMounted(fetchFiles);
</script>

<style scoped>
.knowledge-panel {
  display: flex;
  flex-direction: column;
  height: 20vh; /* Tăng chiều cao một chút để dễ thao tác */
  background-color: #1a1a1a;
  border-top: 1px solid #333;
  padding: 12px;
  gap: 12px; /* Khoảng cách giữa các thành phần */
}

/* --- Header --- */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.panel-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e0e0e0;
  margin: 0;
}

.upload-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background-color: #7e7e7e;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.upload-button:hover:not(:disabled) {
  background-color: #464646;
}

.upload-button:disabled {
  background-color: #333;
  color: #777;
  cursor: not-allowed;
}

/* --- Status Message --- */
.status-message-container {
  flex-shrink: 0;
}

.status-message {
  font-size: 0.8rem;
  margin: 0;
  text-align: center;
  padding: 6px;
  border-radius: 4px;
}

.status-message.success {
  color: #a5d6a7;
  background-color: rgba(76, 175, 80, 0.1);
}

.status-message.error {
  color: #ef9a9a;
  background-color: rgba(244, 67, 54, 0.1);
}


/* --- File List --- */
.file-list-container {
  flex: 1;
  overflow-y: auto;
  background-color: #222;
  border-radius: 8px;
  padding: 4px;
}

/* Custom Scrollbar */
.file-list-container::-webkit-scrollbar {
  width: 5px;
}
.file-list-container::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 10px;
}
.file-list-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  font-size: 0.9rem;
  color: #ccc;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.file-item:hover {
  background-color: #2c2f33;
}

.file-icon {
  margin-right: 10px;
  color: #888;
}

.file-name {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-btn {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s, background-color 0.2s;
}

.delete-btn:hover {
  color: #ef5350;
  background-color: rgba(239, 83, 80, 0.1);
}

/* --- Loading/Empty State --- */
.centered-feedback {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #777;
  font-size: 0.85rem;
  text-align: center;
}
.centered-feedback span {
  font-size: 0.75rem;
  color: #555;
}
</style>