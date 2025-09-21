<template>
  <div class="knowledge-uploader">
    
    <button @click="triggerFileUpload" :disabled="isUploading" class="upload-btn">
      {{ isUploading ? 'Đang tải lên...' : 'Tải Lên Tri Thức' }}
    </button>
    
    <input 
      type="file" 
      ref="fileInput" 
      @change="handleFilesSelected" 
      multiple 
      hidden
      accept=".pdf,.doc,.docx,.txt,.md" 
    />

    <p v-if="uploadMessage" :class="{ 'message-error': isError, 'message-success': !isError }">
      {{ uploadMessage }}
    </p>

    <div class="file-list-header">
      <h2>Tài Liệu Của Bạn</h2>
      <button @click="fetchFiles" :disabled="isLoadingList" class="refresh-btn" title="Làm mới">
        ↻
      </button>
    </div>
    
    <div v-if="isLoadingList" class="loading">Đang tải danh sách...</div>
    
    <ul v-else-if="knowledgeFiles.length > 0" class="file-list">
      <li v-for="file in knowledgeFiles" :key="file.fileName" class="file-item">
        <span :title="file.fileName">{{ file.fileName }}</span>
        <button @click="handleDeleteFile(file.fileName)" class="delete-btn" title="Xóa file">
          ×
        </button>
      </li>
    </ul>

    <div v-else class="empty-list">
      <p>Chưa có tài liệu nào.</p>
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
  uploadMessage.value = ''; // Xóa thông báo cũ
  fileInput.value.click();
};

const handleFilesSelected = async (event) => {
  const files = event.target.files;
  if (!files || files.length === 0) {
    return;
  }

  isUploading.value = true;
  isError.value = false;
  uploadMessage.value = `Đang tải lên ${files.length} tệp...`;

  try {
    const response = await chatService.uploadKnowledgeFiles(files);
    
    isError.value = false;
    uploadMessage.value = response.data.message || 'Tải lên thành công!';
    
    // Tải lại danh sách file sau khi upload thành công
    await fetchFiles(); 
    
  } catch (error) {
    isError.value = true;
    uploadMessage.value = error.response?.data?.message || 'Có lỗi khi tải file.';
    console.error("Lỗi upload kho kiến thức:", error);
    
  } finally {
    isUploading.value = false;
    if (fileInput.value) {
      fileInput.value.value = null;
    }
  }
};

// === 2. LOGIC LẤY DANH SÁCH (GET) ===

const fetchFiles = async () => {
  isLoadingList.value = true;
  uploadMessage.value = ''; // Xóa thông báo upload
  try {
    const response = await chatService.getKnowledgeFiles();
    knowledgeFiles.value = response.data; // Backend trả về List<DocumentInfoDTO>
  } catch (error) {
    console.error("Lỗi khi tải danh sách file:", error);
    isError.value = true;
    uploadMessage.value = "Không thể tải danh sách tài liệu.";
    knowledgeFiles.value = []; // Xóa danh sách cũ nếu lỗi
  } finally {
    isLoadingList.value = false;
  }
};

// === 3. LOGIC XÓA (DELETE) ===

const handleDeleteFile = async (fileName) => {
  // Hỏi xác nhận trước khi xóa
  if (!confirm(`Bạn có chắc muốn xóa vĩnh viễn file "${fileName}" khỏi kho tri thức?`)) {
    return;
  }

  isError.value = false;
  uploadMessage.value = `Đang xóa ${fileName}...`;

  try {
    await chatService.deleteKnowledgeFile(fileName);
    uploadMessage.value = `Đã xóa thành công ${fileName}.`;
    
    // Tải lại danh sách file sau khi xóa
    await fetchFiles(); 

  } catch (error) {
    isError.value = true;
    uploadMessage.value = error.response?.data?.message || `Lỗi khi xóa ${fileName}.`;
    console.error("Lỗi khi xóa file:", error);
  }
};


// === 4. LIFECYCLE ===
// Tự động tải danh sách file khi component được hiển thị
onMounted(() => {
  fetchFiles();
});
</script>

<style scoped>
.knowledge-uploader {
  padding: 10px;
  border-top: 1px solid #3a3a3a;
  text-align: center;
  /* Thêm để nó có thể cuộn nếu danh sách quá dài */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Ngăn wrapper ngoài cuộn */
  height: 25vh;
}

/* --- Phần Upload --- */
.upload-btn {
  width: 100%;
  padding: 10px;
  background-color: #4a4a4a;
  color: #ddd;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: bold;
}
.upload-btn:hover {
  background-color: #5a5a5a;
}
.upload-btn:disabled {
  background-color: #333;
  color: #777;
  cursor: not-allowed;
}
p {
  font-size: 0.8rem;
  margin-top: 10px;
}
.message-success {
  color: #4caf50;
}
.message-error {
  color: #f44336;
}

/* --- Phần Danh Sách --- */
.file-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-bottom: 5px;
  border-bottom: 1px solid #3a3a3a; 
}
.file-list-header h2 {
  font-size: 0.9rem;
  color: #aaa;
  margin: 0;
}
.refresh-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  font-size: 1.2rem;
}
.refresh-btn:hover {
  color: #fff;
}
.refresh-btn:disabled {
  color: #555;
  cursor: not-allowed;
}

.loading, .empty-list {
  color: #777;
  font-size: 0.85rem;
  padding: 20px 0;
  text-align: center;
}

.file-list {
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
  flex: 1; /* Cho phép danh sách này cuộn */
  overflow-y: auto;
}
.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 5px;
  font-size: 0.85rem;
  color: #ddd;
  border-radius: 4px;
}
.file-item:hover {
  background-color: #333;
}
.file-item span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}
.delete-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  line-height: 1;
  padding: 0 5px;
}
.delete-btn:hover {
  color: #f44336;
}
</style>