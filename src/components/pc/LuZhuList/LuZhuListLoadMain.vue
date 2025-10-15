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
      <!-- 列表容器 -->
      <div class="list-container">
        <!-- 无数据提示 -->
        <div v-if="tableIds.length === 0" class="empty-state">
          <p>暂无可用台桌</p>
        </div>

        <!-- 露珠列表项 -->
        <LuZhuListItem
          v-for="tableId in tableIds"
          :key="tableId"
          :table-id="tableId"
          class="list-item"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useoverLayerStore } from '@/stores/overLayerStore'
import { useGameStore } from '@/stores/gameStore'
import LuZhuListItem from './LuZhuListItem.vue'

// 获取 store 实例
const overLayerStore = useoverLayerStore()
const gameStore = useGameStore()

// 台桌ID列表
const tableIds = ref<string[]>([])

// 解析台桌ID字符串
const parseTableIds = (idString: string | undefined): string[] => {
  if (!idString) return []
  // 分割字符串，去除空格，过滤空值
  return idString.split(',')
    .map(id => id.trim())
    .filter(id => id)
}

// 组件挂载时获取数据
onMounted(() => {
  // 直接从 gameStore 读取数据
  const showLuzhuList = gameStore.tableInfo?.show_luzhu_list
  tableIds.value = parseTableIds(showLuzhuList)

  // 打印调试信息
  console.log('露珠列表 - 原始数据:', showLuzhuList)
  console.log('露珠列表 - 解析后的台桌ID:', tableIds.value)
})

// 关闭方法
const handleClose = () => {
  overLayerStore.close()
}
</script>

<style scoped>
/* 模态容器 */
.modal-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 85vh;
  background: #f5f5f5;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

/* 关闭按钮 */
.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  z-index: 10;
}

.close-button:hover {
  background: #f0f0f0;
  transform: scale(1.05);
}

.close-button:active {
  transform: scale(0.95);
}

.close-button svg {
  color: #666;
}

/* 内容区域 */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-top: 60px; /* 为关闭按钮留出空间 */
}

/* 列表容器 */
.list-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

/* 滚动条样式 */
.list-container::-webkit-scrollbar {
  width: 6px;
}

.list-container::-webkit-scrollbar-track {
  background: transparent;
}

.list-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.list-container::-webkit-scrollbar-thumb:hover {
  background: #999;
}

/* 列表项间距 */
.list-item {
  margin-bottom: 12px;
}

.list-item:last-child {
  margin-bottom: 0;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #999;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .modal-container {
    height: 90vh;
    border-radius: 0;
  }

  .content-area {
    padding-top: 56px;
  }

  .list-container {
    padding: 12px;
  }

  .list-item {
    margin-bottom: 10px;
  }
}

/* 平板适配 */
@media (min-width: 768px) {
  .modal-container {
    max-width: 768px;
    left: 50%;
    transform: translateX(-50%);
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
  }
}
</style>
