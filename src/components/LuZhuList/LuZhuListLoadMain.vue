<template>
  <div class="modal-container">
    <!-- 关闭按钮 -->
    <button class="close-button" @click="handleClose" aria-label="关闭">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- 内容区域 -->
    <div class="content-area">
      <!-- 空白内容区域 -->
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入 store
import { useoverLayerStore } from '@/stores/overLayerStore'

// 获取 store 实例
const overLayerStore = useoverLayerStore()

// 关闭方法
const handleClose = () => {
  overLayerStore.close()
}
</script>

<style scoped>
.modal-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 85vh;
  background: white;
  z-index: 1000;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
}

.close-button:hover {
  background: #f5f5f5;
}

.content-area {
  height: 100%;
  padding: 20px;
  padding-top: 80px;
  overflow-y: auto;
}
</style>
