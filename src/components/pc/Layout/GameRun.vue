<!-- src/components/pc/Layout/GameRun.vue - PC版本固定布局 -->
<template>
  <div class="pc-game-container">
    <!-- 顶部: 视频区域 (固定高度) -->
    <div class="pc-video-section">
      <VideoAndLuZhu />
    </div>

    <!-- 中部: 投注区域 + 路单统计 (横向布局) -->
    <div class="pc-betting-and-road-section">
      <!-- 投注区域 (占据大部分宽度) -->
      <div class="pc-betting-area">
        <UserBet />
      </div>

      <!-- 路单统计 (固定宽度在右侧) -->
      <div class="pc-road-stats">
        <LuZhu />
      </div>
    </div>

    <!-- 弹窗和特效层 -->
    <div class="pc-overlay-layer">
      <Overlay />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// 导入组件
import VideoAndLuZhu from './VideoAndLuZhu.vue'
import UserBet from './UserBet.vue'
import LuZhu from './LuZhu.vue'
import Overlay from './Overlay.vue'

onMounted(() => {
  console.log('[PC-GameRun] PC版游戏布局已加载')
})
</script>

<style scoped>
/* PC版游戏容器 - 垂直布局 */
.pc-game-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #0a0e1a;
}

/* 视频区域 - 占据上方大部分空间 */
.pc-video-section {
  flex: 1;
  min-height: 400px;
  max-height: calc(100vh - 400px);
  position: relative;
  overflow: hidden;
}

/* 投注区域和路单 - 横向布局 */
.pc-betting-and-road-section {
  display: flex;
  height: 250px;
  background: rgba(10, 14, 26, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 投注区域 - 占据剩余宽度 */
.pc-betting-area {
  flex: 1;
  padding: 20px;
  overflow: hidden;
}

/* 路单统计 - 固定宽度 */
.pc-road-stats {
  width: 350px;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(15, 20, 30, 0.8);
  overflow-y: auto;
  overflow-x: hidden;
}

/* 滚动条样式 */
.pc-road-stats::-webkit-scrollbar {
  width: 6px;
}

.pc-road-stats::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.pc-road-stats::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.pc-road-stats::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 弹窗层 - 覆盖整个屏幕 */
.pc-overlay-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

.pc-overlay-layer :deep(.overlay-system > *) {
  pointer-events: auto;
}

/* 响应式调整 - 小屏PC */
@media (max-width: 1366px) {
  .pc-road-stats {
    width: 300px;
  }

  .pc-betting-and-road-section {
    height: 220px;
  }
}

/* 响应式调整 - 大屏PC */
@media (min-width: 1920px) {
  .pc-road-stats {
    width: 400px;
  }

  .pc-betting-and-road-section {
    height: 280px;
  }
}
</style>
