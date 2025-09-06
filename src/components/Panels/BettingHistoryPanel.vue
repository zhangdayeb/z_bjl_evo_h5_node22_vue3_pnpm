<!-- src/components/Panels/BettingHistoryPanel.vue -->
<template>
  <div class="betting-history-overlay" @click="handleOverlayClick">
    <div class="betting-history-panel" @click.stop>
      <!-- 面板头部 -->
      <div class="panel-header">
        <div class="header-left">
          <div class="header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </div>
          <h2 class="panel-title">投注记录</h2>
          <div class="records-count" v-if="!store.isEmpty">
            ({{ store.totalRecords }}条)
          </div>
        </div>
        <div class="header-right">
          <button
            class="refresh-btn"
            @click="handleRefresh"
            :disabled="store.isLoading"
            title="刷新"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              :class="{ 'spinning': store.isLoading }"
            >
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </button>
          <button class="close-btn" @click="handleClose" title="关闭">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 面板内容 -->
      <div class="panel-content" ref="contentRef">
        <!-- 下拉刷新指示器 -->
        <div
          class="pull-refresh-indicator"
          :class="{ 'visible': pullRefresh.isVisible, 'refreshing': pullRefresh.isRefreshing }"
          :style="{ transform: `translateY(${pullRefresh.distance}px)` }"
        >
          <div class="refresh-icon" :class="{ 'spinning': pullRefresh.isRefreshing }">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
            </svg>
          </div>
          <span>{{ pullRefresh.text }}</span>
        </div>

        <!-- 加载状态 -->
        <div v-if="store.isLoading && store.isEmpty" class="loading-state">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="store.error && store.isEmpty" class="error-state">
          <div class="error-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
            </svg>
          </div>
          <p>{{ store.error }}</p>
          <button class="retry-btn" @click="handleRefresh">
            重试
          </button>
        </div>

        <!-- 空状态 -->
        <div v-else-if="store.isEmpty" class="empty-state">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
          </div>
          <p>暂无投注记录</p>
        </div>

        <!-- 记录列表 -->
        <div v-else class="records-container">
          <div class="records-list">
            <div
              v-for="record in store.records"
              :key="record.id"
              class="record-item"
              :class="record.status"
            >
              <div class="record-header">
                <div class="game-info">
                  <span class="order-id">订单ID: {{ record.id }}</span>
                  <span class="table-id">台桌ID: {{ record.table_id }}</span>
                  <span class="bet-time">{{ record.bet_time }}</span>
                </div>
                <div class="result-badge" :class="record.status">
                  {{ store.getStatusText(record) }}
                </div>
              </div>

              <div class="record-content">
                <div class="bet-info">
                  <div class="bet-amount">
                    投注金额: {{ record.total_bet_amount }}
                  </div>
                  <div class="win-amount">
                    输赢金额:
                    <span
                      :class="{
                        'positive': record.total_win_amount > 0,
                        'negative': record.total_win_amount < 0,
                        'neutral': record.total_win_amount === 0
                      }"
                    >
                      {{ record.total_win_amount >= 0 ? '+' : '' }}{{ record.total_win_amount }}
                    </span>
                  </div>
                </div>

                <div class="bet-result">
                  <div class="result-text">
                    开奖: {{ store.getBetResult(record) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 加载更多 -->
          <div class="load-more-section">
            <!-- 加载中状态 -->
            <div v-if="store.isLoading" class="loading-more">
              <div class="loading-spinner small"></div>
              <span>加载中...</span>
            </div>

            <!-- 加载更多按钮 -->
            <button
              v-else-if="store.canLoadMore"
              class="load-more-btn"
              @click="handleLoadMore"
            >
              加载更多
            </button>

            <!-- 没有更多数据 -->
            <div v-else class="no-more">
              <span>已加载全部记录</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useBettingHistoryStore } from '@/stores/bettingHistoryStore'
import type { BettingRecord } from '@/stores/bettingHistoryStore'

// 事件定义
const emit = defineEmits<{
  close: []
}>()

// 使用 Store
const store = useBettingHistoryStore()

// 引用
const contentRef = ref<HTMLElement>()

// 下拉刷新状态
const pullRefresh = reactive({
  isVisible: false,
  isRefreshing: false,
  distance: 0,
  text: '下拉刷新',
  startY: 0,
  threshold: 60, // 触发刷新的阈值
  maxDistance: 100 // 最大下拉距离
})

// 下拉刷新相关方法
const handleTouchStart = (e: TouchEvent) => {
  if (contentRef.value && contentRef.value.scrollTop === 0) {
    pullRefresh.startY = e.touches[0].clientY
  }
}

const handleTouchMove = (e: TouchEvent) => {
  if (!contentRef.value || contentRef.value.scrollTop > 0 || pullRefresh.isRefreshing) {
    return
  }

  const currentY = e.touches[0].clientY
  const deltaY = currentY - pullRefresh.startY

  if (deltaY > 0) {
    e.preventDefault()

    // 计算下拉距离，添加阻尼效果
    const distance = Math.min(deltaY * 0.5, pullRefresh.maxDistance)
    pullRefresh.distance = distance

    if (distance > 10) {
      pullRefresh.isVisible = true
    }

    if (distance >= pullRefresh.threshold) {
      pullRefresh.text = '释放刷新'
    } else {
      pullRefresh.text = '下拉刷新'
    }
  }
}

const handleTouchEnd = async () => {
  if (pullRefresh.distance >= pullRefresh.threshold && !pullRefresh.isRefreshing) {
    pullRefresh.isRefreshing = true
    pullRefresh.text = '刷新中...'

    try {
      await handleRefresh()
    } finally {
      // 重置状态
      setTimeout(() => {
        pullRefresh.isVisible = false
        pullRefresh.isRefreshing = false
        pullRefresh.distance = 0
        pullRefresh.text = '下拉刷新'
      }, 300)
    }
  } else {
    // 重置状态
    pullRefresh.isVisible = false
    pullRefresh.distance = 0
    pullRefresh.text = '下拉刷新'
  }
}

// 鼠标事件（桌面端支持）
const handleMouseDown = (e: MouseEvent) => {
  if (contentRef.value && contentRef.value.scrollTop === 0) {
    pullRefresh.startY = e.clientY
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
}

const handleMouseMove = (e: MouseEvent) => {
  if (!contentRef.value || contentRef.value.scrollTop > 0 || pullRefresh.isRefreshing) {
    return
  }

  const currentY = e.clientY
  const deltaY = currentY - pullRefresh.startY

  if (deltaY > 0) {
    e.preventDefault()

    const distance = Math.min(deltaY * 0.3, pullRefresh.maxDistance)
    pullRefresh.distance = distance

    if (distance > 10) {
      pullRefresh.isVisible = true
    }

    if (distance >= pullRefresh.threshold) {
      pullRefresh.text = '释放刷新'
    } else {
      pullRefresh.text = '下拉刷新'
    }
  }
}

const handleMouseUp = async () => {
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)

  if (pullRefresh.distance >= pullRefresh.threshold && !pullRefresh.isRefreshing) {
    pullRefresh.isRefreshing = true
    pullRefresh.text = '刷新中...'

    try {
      await handleRefresh()
    } finally {
      setTimeout(() => {
        pullRefresh.isVisible = false
        pullRefresh.isRefreshing = false
        pullRefresh.distance = 0
        pullRefresh.text = '下拉刷新'
      }, 300)
    }
  } else {
    pullRefresh.isVisible = false
    pullRefresh.distance = 0
    pullRefresh.text = '下拉刷新'
  }
}

// 移除不需要的计算投注区域函数
// const getBetZones = (record: BettingRecord) => {
//   ...
// }

// 事件处理
const handleClose = () => {
  emit('close')
}

const handleOverlayClick = () => {
  emit('close')
}

const handleRefresh = async () => {
  try {
    store.clearError()
    await store.refresh()
  } catch (error) {
    console.error('❌ 刷新投注记录失败:', error)
  }
}

const handleLoadMore = async () => {
  try {
    await store.loadMore()
  } catch (error) {
    console.error('❌ 加载更多记录失败:', error)
  }
}

// 生命周期
onMounted(async () => {
  console.log('📚 投注记录面板已挂载')

  // 添加触摸事件监听
  if (contentRef.value) {
    contentRef.value.addEventListener('touchstart', handleTouchStart, { passive: false })
    contentRef.value.addEventListener('touchmove', handleTouchMove, { passive: false })
    contentRef.value.addEventListener('touchend', handleTouchEnd)
    contentRef.value.addEventListener('mousedown', handleMouseDown)
  }

  // 初始化数据
  try {
    await store.init()
    console.log('✅ 投注记录数据初始化完成')
  } catch (error) {
    console.error('❌ 投注记录数据初始化失败:', error)
  }
})

onUnmounted(() => {
  console.log('📚 投注记录面板已卸载')

  // 清理事件监听
  if (contentRef.value) {
    contentRef.value.removeEventListener('touchstart', handleTouchStart)
    contentRef.value.removeEventListener('touchmove', handleTouchMove)
    contentRef.value.removeEventListener('touchend', handleTouchEnd)
    contentRef.value.removeEventListener('mousedown', handleMouseDown)
  }

  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})
</script>

<style scoped>
.betting-history-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  animation: overlayFadeIn 0.3s ease-out;
}

.betting-history-panel {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 0;
  border: none;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  width: 100%;
  height: 100%;
  overflow: hidden;
  animation: panelSlideIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
}

.panel-header {
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-icon {
  width: 32px;
  height: 32px;
  background: rgba(82, 196, 26, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #52c41a;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: white;
  margin: 0;
}

.records-count {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.refresh-btn,
.close-btn {
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.refresh-btn:hover,
.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
}

.pull-refresh-indicator {
  position: absolute;
  top: -60px;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
  transition: opacity 0.3s ease;
  opacity: 0;
  z-index: 10;
}

.pull-refresh-indicator.visible {
  opacity: 1;
}

.refresh-icon {
  transition: transform 0.3s ease;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

.loading-state,
.empty-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.6);
  flex: 1;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #40a9ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

.loading-spinner.small {
  width: 20px;
  height: 20px;
  border-width: 2px;
  margin-bottom: 0;
  margin-right: 8px;
}

.empty-icon,
.error-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.error-icon {
  color: #ff4d4f;
}

.retry-btn {
  margin-top: 12px;
  padding: 8px 16px;
  background: rgba(64, 169, 255, 0.1);
  border: 1px solid rgba(64, 169, 255, 0.3);
  border-radius: 6px;
  color: #40a9ff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  background: rgba(64, 169, 255, 0.2);
}

.records-container {
  flex: 1;
  padding: 0 24px;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 0;
}

.record-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.2s ease;
}

.record-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-1px);
}

.record-item.win {
  border-color: rgba(82, 196, 26, 0.3);
  background: rgba(82, 196, 26, 0.05);
}

.record-item.lose {
  border-color: rgba(255, 77, 79, 0.3);
  background: rgba(255, 77, 79, 0.05);
}

.record-item.pending {
  border-color: rgba(255, 193, 7, 0.3);
  background: rgba(255, 193, 7, 0.05);
}

.record-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.game-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-id {
  font-size: 14px;
  font-weight: 500;
  color: white;
}

.table-id {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.bet-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.result-badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}

.result-badge.win {
  background: rgba(82, 196, 26, 0.2);
  color: #52c41a;
}

.result-badge.lose {
  background: rgba(255, 77, 79, 0.2);
  color: #ff4d4f;
}

.result-badge.pending {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.record-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.bet-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.bet-amount {
  font-size: 14px;
  color: white;
}

.win-amount {
  font-size: 14px;
  color: white;
}

.bet-result {
  text-align: right;
  flex-shrink: 0;
}

.result-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  max-width: 200px;
  word-break: break-all;
}

.win-amount.positive {
  color: #52c41a;
}

.win-amount.negative {
  color: #ff4d4f;
}

.win-amount.neutral {
  color: rgba(255, 255, 255, 0.6);
}

.load-more-section {
  padding: 20px 0;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.load-more-btn {
  padding: 10px 24px;
  background: rgba(64, 169, 255, 0.1);
  border: 1px solid rgba(64, 169, 255, 0.3);
  border-radius: 8px;
  color: #40a9ff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.load-more-btn:hover {
  background: rgba(64, 169, 255, 0.2);
  transform: translateY(-1px);
}

.no-more {
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
}

@keyframes overlayFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes panelSlideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .betting-history-overlay {
    padding: 0;
  }

  .betting-history-panel {
    border-radius: 0;
    width: 100%;
    height: 100%;
  }

  .panel-header {
    padding: 16px 20px;
  }

  .records-container {
    padding: 0 20px;
  }

  .record-content {
    flex-direction: column;
    gap: 12px;
  }

  .result-info {
    text-align: left;
  }
}
</style>
