<!-- src/components/GameInfo/GameCount.vue - 修复版：正常布局，一行显示，40px高度 -->
<template>
  <div class="game-count-container">
    <div class="count-item" :class="{ 'loading': gameStore.isLoadingStatistics }">
      <span class="count-label">庄</span>
      <span class="count-value zhuang">{{ gameStore.isLoadingStatistics ? '-' : gameStore.statistics.zhuang }}</span>
    </div>

    <div class="count-item" :class="{ 'loading': gameStore.isLoadingStatistics }">
      <span class="count-label">闲</span>
      <span class="count-value xian">{{ gameStore.isLoadingStatistics ? '-' : gameStore.statistics.xian }}</span>
    </div>

    <div class="count-item" :class="{ 'loading': gameStore.isLoadingStatistics }">
      <span class="count-label">和</span>
      <span class="count-value he">{{ gameStore.isLoadingStatistics ? '-' : gameStore.statistics.he }}</span>
    </div>

    <div class="count-item total" :class="{ 'loading': gameStore.isLoadingStatistics }">
      <span class="count-label">总数</span>
      <span class="count-value">{{ gameStore.isLoadingStatistics ? '-' : gameStore.totalStatistics }}</span>
    </div>

    <!-- 刷新按钮 -->
    <button
      class="refresh-btn"
      @click="handleRefresh"
      :disabled="gameStore.isLoadingStatistics"
      :title="gameStore.isLoadingStatistics ? '正在加载...' : '刷新统计'"
    >
      <svg
        class="refresh-icon"
        :class="{ 'spinning': gameStore.isLoadingStatistics }"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M17.65,6.35C16.2,4.9 14.21,4 12,4c-4.42,0 -7.99,3.58 -7.99,8s3.57,8 7.99,8c3.73,0 6.84,-2.55 7.73,-6h-2.08c-0.82,2.33 -3.04,4 -5.65,4c-3.31,0 -6,-2.69 -6,-6s2.69,-6 6,-6c1.66,0 3.14,0.69 4.22,1.78L13,11h7V4L17.65,6.35z"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'

// 直接使用 GameStore，无需任何本地状态
const gameStore = useGameStore()

// 处理刷新 - 通过 GameStore 的方法
const handleRefresh = () => {
  gameStore.refreshStatistics()
}
</script>

<style scoped>
.game-count-container {
  /* 🔥 关键修改：移除绝对定位，改为正常布局 */
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0 16px;
  color: white;
  font-size: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  margin-top: 4px; /* 与上方筹码区域保持间距 */
  flex-shrink: 0; /* 防止被压缩 */
}

.count-item {
  /* 🔥 关键修改：改为横向布局，标签和数值在同一行 */
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.count-item.loading {
  opacity: 0.6;
}

.count-item.total {
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  padding-left: 12px;
  margin-left: 8px;
}

.count-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  white-space: nowrap;
}

.count-value {
  font-size: 13px;
  font-weight: 600;
  color: white;
  min-width: 20px;
  text-align: center;
  white-space: nowrap;
}

/* 不同类型的数值颜色 */
.count-value.zhuang {
  color: #ff6b6b; /* 红色 - 庄 */
}

.count-value.xian {
  color: #4ecdc4; /* 青色 - 闲 */
}

.count-value.he {
  color: #45b7d1; /* 蓝色 - 和 */
}

.total .count-value {
  color: #ffd93d; /* 金色 - 总数 */
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.8);
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  margin-left: 8px;
  height: 28px;
  width: 28px;
}

.refresh-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.refresh-icon {
  transition: transform 0.2s ease;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .game-count-container {
    height: 36px;
    padding: 0 12px;
    gap: 8px;
    margin-top: 3px;
  }

  .count-item {
    gap: 4px;
  }

  .count-item.total {
    padding-left: 8px;
    margin-left: 6px;
  }

  .count-label {
    font-size: 10px;
  }

  .count-value {
    font-size: 12px;
    min-width: 18px;
  }

  .refresh-btn {
    padding: 4px;
    margin-left: 6px;
    height: 24px;
    width: 24px;
  }

  .refresh-icon {
    width: 12px;
    height: 12px;
  }
}

@media (max-width: 480px) {
  .game-count-container {
    height: 32px;
    padding: 0 10px;
    gap: 6px;
  }

  .count-item {
    gap: 3px;
  }

  .count-label {
    font-size: 9px;
  }

  .count-value {
    font-size: 11px;
    min-width: 16px;
  }

  .refresh-btn {
    height: 20px;
    width: 20px;
    padding: 2px;
  }

  .refresh-icon {
    width: 10px;
    height: 10px;
  }
}

/* 暗色主题适配 */
@media (prefers-color-scheme: dark) {
  .game-count-container {
    background: rgba(0, 0, 0, 0.9);
    border-color: rgba(255, 255, 255, 0.15);
  }
}

/* 悬停效果 */
.count-item:hover {
  transform: scale(1.02);
}

/* 动画效果 */
.count-value {
  transition: all 0.3s ease;
}

.count-value:not(:empty) {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
