<!-- src/components/pc/Layout/GameRun.vue - PC版本固定布局 -->
<template>
  <div class="pc-game-container">
    <!-- 顶部按钮栏 -->
    <TopButtons />

    <!-- 播放层 - 全屏背景，z-index最底层 -->
    <div class="pc-video-background">
      <VideoPlayer :videoUrl="currentVideoUrl" />
    </div>

    <!-- 底部: 路单 + 投注区域 + 路单 (横向布局) -->
    <div class="pc-betting-and-road-section">
      <!-- 左侧路单: 珠子路 (固定宽度) -->
      <div class="pc-road-stats pc-road-left">
        <LuZhuLeft />
      </div>

      <!-- 中间投注区域 (占据剩余宽度) -->
      <div class="pc-betting-area">
        <UserBet />
      </div>

      <!-- 右侧路单: 统计 + 大路和下三路 (固定宽度) -->
      <div class="pc-road-stats pc-road-right">
        <!-- 顶部: 路单统计 -->
        <div class="pc-road-count">
          <LuZhuCount :gameData="gameStore.luZhuData" />
        </div>

        <!-- 下方: 大路和下三路 -->
        <div class="pc-road-maps">
          <LuZhuRight />
        </div>
      </div>
    </div>

    <!-- 游戏统计栏 - 最底部 -->
    <GameCount />

    <!-- 弹窗和特效层 -->
    <div class="pc-overlay-layer">
      <Overlay />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// 导入组件
import TopButtons from './TopButtons.vue'
import VideoPlayer from '../VideoPlayer/VideoPlayer.vue'
import GameCount from './GameCount.vue'
import UserBet from './UserBet.vue'
import LuZhuLeft from './LuZhuLeft.vue'
import LuZhuCount from './LuZhuCount.vue'
import LuZhuRight from './LuZhuRight.vue'
import Overlay from './Overlay.vue'

// 使用 Store
const gameStore = useGameStore()

// 计算属性：获取视频URL
const currentVideoUrl = computed(() => {
  return gameStore.videoUrl || ''
})

onMounted(() => {
  console.log('[PC-GameRun] PC版游戏布局已加载')
})
</script>

<style scoped>
/* PC版游戏容器 - 固定1280×720尺寸 */
.pc-game-container {
  position: relative;
  width: 1280px;
  height: 720px;
  overflow: hidden;
  background: #0a0e1a;
}

/* 播放层背景 - 100%宽高，z-index最底层 */
.pc-video-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #000;
}

/* 底部区域 - 路单 + 投注 + 路单，背景透明 */
.pc-betting-and-road-section {
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
  display: flex;
  height: auto;
  background: transparent;
  z-index: 10;
}

/* 左侧路单 - 固定宽度，半透明黑色背景 */
.pc-road-stats.pc-road-left {
  width: 350px;
  height: 150px;
  background: rgba(0, 0, 0, 0.2);
  position: absolute;
  bottom: 40px;
  left: 0px;
}

/* 中间投注区域 - 绝对定位，固定宽度，居中 */
.pc-betting-area {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 220px;
  padding: 0px 20px;
  overflow: hidden;
  background: transparent;
}

/* 右侧路单 - 固定宽度，半透明黑色背景，垂直布局 */
.pc-road-stats.pc-road-right {
  width: 350px;
  height: 180px;
  background: rgba(0, 0, 0, 0.2);
  overflow: hidden;
  position: absolute;
  bottom: 40px;
  right: 0px;
}

/* 路单统计区域 - 顶部固定高度 */
.pc-road-count {
  flex-shrink: 0;
  background: transparent;
}

/* 大路和下三路区域 - 占据剩余空间 */
.pc-road-maps {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: transparent;
}

/* 路单统计通用样式 */
.pc-road-stats {
  width: 350px;
  background: transparent;
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

/* 弹窗层 - 覆盖整个屏幕，最高层级 */
.pc-overlay-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
}

.pc-overlay-layer :deep(.overlay-system > *) {
  pointer-events: auto;
}
</style>
