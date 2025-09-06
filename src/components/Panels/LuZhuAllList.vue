<!-- src/components/Panels/LuZhuAllList.vue -->
<template>
  <div class="luzhu-list-panel">
    <!-- 面板头部 -->
    <div class="panel-header">
      <div class="header-left">
        <div class="panel-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
          </svg>
        </div>
        <h3 class="panel-title">路珠列表</h3>
        <span class="panel-subtitle">实时路珠数据</span>
      </div>

      <div class="header-right">
        <!-- 刷新按钮 -->
        <button class="action-btn refresh-btn" @click="handleRefresh" :disabled="isRefreshing">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            :class="{ 'rotating': isRefreshing }"
          >
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
        </button>

        <!-- 关闭按钮 -->
        <button class="action-btn close-btn" @click="handleClose">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 面板内容 -->
    <div class="panel-content" ref="contentRef">
      <!-- 台桌列表 -->
      <div v-if="tableIds.length > 0" class="table-list">
        <div
          v-for="tableId in tableIds"
          :key="tableId"
          class="table-item"
        >
          <!-- 台桌标题 -->
          <div class="table-header">
            <div class="table-info">
              <span class="table-label">台桌</span>
              <span class="table-number">{{ tableId }}</span>
            </div>
            <div class="table-status">
              <span class="status-dot" :class="{ 'active': loadedTables[tableId] }"></span>
              <span class="status-text">{{ loadedTables[tableId] ? '已加载' : '加载中...' }}</span>
            </div>
          </div>

          <!-- iframe 容器 -->
          <div class="iframe-wrapper" :style="iframeWrapperStyle">
            <iframe
              :ref="el => setIframeRef(tableId, el as HTMLIFrameElement)"
              :src="getIframeUrl(tableId)"
              :key="`iframe-${tableId}-${refreshKey}`"
              frameborder="0"
              class="luzhu-iframe"
              :title="`台桌${tableId}路珠`"
              @load="onIframeLoad(tableId)"
              allowfullscreen
            />

            <!-- 加载遮罩 -->
            <div v-if="!loadedTables[tableId]" class="loading-mask">
              <div class="spinner"></div>
              <span>加载中...</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 无数据提示 -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 15.5h-1.5V14h1.5v4.5zm0-5.5h-1.5v-6h1.5v6z"/>
          </svg>
        </div>
        <p class="empty-text">暂无可用的路珠数据</p>
        <p class="empty-hint">当前台桌未配置路珠显示</p>
      </div>
    </div>

    <!-- 面板底部 -->
    <div class="panel-footer">
      <div class="footer-info">
        <span class="info-label">台桌总数:</span>
        <span class="info-value">{{ tableIds.length }}</span>
      </div>
      <div class="footer-time">
        <span class="time-label">最后刷新:</span>
        <span class="time-value">{{ lastRefreshTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// Store
const gameStore = useGameStore()

// Emits
const emit = defineEmits<{
  close: []
}>()

// 响应式数据
const contentRef = ref<HTMLElement>()
const iframeRefs = ref<Record<number, HTMLIFrameElement>>({})
const tableIds = ref<number[]>([])
const loadedTables = ref<Record<number, boolean>>({})
const isRefreshing = ref(false)
const refreshKey = ref(0)
const lastRefreshTime = ref('')
const contentWidth = ref(0)

// 获取基础URL
const getLzListBaseUrl = (): string => {
  return import.meta.env.VITE_LZLIST_URL || ''
}

// 计算 iframe 容器样式
const iframeWrapperStyle = computed(() => {
  const width = contentWidth.value || 800 // 默认宽度
  const height = width * 0.35 // 16:9 比例
  return {
    width: '100%',
    height: `${height}px`,
    minHeight: '120px',
    maxHeight: '280px'
  }
})

// 解析台桌ID列表
const parseTableIds = (showLuzhuList: string | null | undefined): number[] => {
  if (!showLuzhuList || showLuzhuList.trim() === '') {
    return []
  }

  try {
    return showLuzhuList
      .split(',')
      .map(id => parseInt(id.trim()))
      .filter(id => !isNaN(id) && id > 0)
  } catch (error) {
    console.error('解析台桌ID列表失败:', error)
    return []
  }
}

// 设置 iframe 引用
const setIframeRef = (tableId: number, el: HTMLIFrameElement | null) => {
  if (el) {
    iframeRefs.value[tableId] = el
  }
}

// 获取 iframe URL
const getIframeUrl = (tableId: number): string => {
  const baseUrl = getLzListBaseUrl()
  if (!baseUrl) {
    console.warn('VITE_LZLIST_URL 未配置')
    return ''
  }
  return `${baseUrl}?tableId=${tableId}`
}

// iframe 加载完成事件
const onIframeLoad = (tableId: number) => {
  loadedTables.value[tableId] = true
  console.log(`📊 台桌 ${tableId} 路珠加载完成`)
}

// 刷新 iframe
const handleRefresh = () => {
  if (isRefreshing.value) return

  isRefreshing.value = true
  console.log('🔄 刷新所有路珠...')

  // 重置加载状态
  tableIds.value.forEach(id => {
    loadedTables.value[id] = false
  })

  // 更新 key 触发 iframe 重新加载
  refreshKey.value++

  // 更新刷新时间
  updateLastRefreshTime()

  // 500ms 后重置刷新状态，给用户视觉反馈
  setTimeout(() => {
    isRefreshing.value = false
  }, 500)
}

// 关闭面板
const handleClose = () => {
  console.log('❌ 关闭路珠列表面板')
  emit('close')
}

// 更新最后刷新时间
const updateLastRefreshTime = () => {
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')
  lastRefreshTime.value = `${hours}:${minutes}:${seconds}`
}

// 监听容器宽度变化
const observeContentWidth = () => {
  if (!contentRef.value) return

  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      contentWidth.value = entry.contentRect.width
    }
  })

  resizeObserver.observe(contentRef.value)

  return () => {
    resizeObserver.disconnect()
  }
}

// 生命周期
onMounted(async () => {
  console.log('📈 路珠列表面板已挂载')

  // 直接从 gameStore 读取数据
  const showLuzhuList = gameStore.tableInfo?.show_luzhu_list
  tableIds.value = parseTableIds(showLuzhuList)

  // 初始化加载状态
  tableIds.value.forEach(id => {
    loadedTables.value[id] = false
  })

  // 更新时间
  updateLastRefreshTime()

  console.log('📊 解析到的台桌列表:', tableIds.value)

  // 设置宽度监听
  await nextTick()
  const disconnect = observeContentWidth()

  onUnmounted(() => {
    disconnect?.()
  })
})

onUnmounted(() => {
  console.log('📈 路珠列表面板已卸载')
})
</script>

<style scoped>
.luzhu-list-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 1200px;
  height: 85vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 10000;
  animation: panelSlideIn 0.3s ease-out;
}

/* 面板头部 */
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.panel-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
}

.panel-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
}

.panel-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  transform: translateY(-1px);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

/* 面板内容 */
.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
}

.panel-content::-webkit-scrollbar {
  width: 8px;
}

.panel-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.panel-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.panel-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 台桌列表 */
.table-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.table-item {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.table-item:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.15);
}

.table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.table-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.table-number {
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.table-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.status-dot.active {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.status-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

/* iframe 容器 */
.iframe-wrapper {
  position: relative;
  width: 100%;
  background: #000000;
}

.luzhu-iframe {
  width: 100%;
  height: 100%;
  display: block;
  border: none;
}

.loading-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  margin-bottom: 20px;
}

.empty-text {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.empty-hint {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
}

/* 面板底部 */
.panel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-info,
.footer-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.info-label,
.time-label {
  color: rgba(255, 255, 255, 0.5);
}

.info-value,
.time-value {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

/* 动画 */
@keyframes panelSlideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.rotating {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .luzhu-list-panel {
    width: 95%;
    height: 90vh;
    border-radius: 12px;
  }

  .panel-header {
    padding: 16px 20px;
  }

  .panel-title {
    font-size: 18px;
  }

  .panel-subtitle {
    display: none;
  }

  .panel-content {
    padding: 16px;
  }

  .table-list {
    gap: 16px;
  }
}
</style>
