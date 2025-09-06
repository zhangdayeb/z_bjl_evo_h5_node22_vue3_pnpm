<!-- src/components/Layout/Top.vue - 简化版本 -->
<template>
  <div class="top-section" :style="topSectionStyles">
    <!-- 视频播放器 - 只传入必要的两个参数 -->
    <VideoPlayer
      :autoZoom="true"
      :videoUrl="currentVideoUrl"
      @videoLoad="handleVideoLoad"
      @videoError="handleVideoError"
    />

    <!-- 🔥 浮动UI状态层 -->
    <div class="floating-ui-layer">
      <!-- 🔥 用户余额 -->
      <UserBalance
        currency="CNY"
      />

      <!-- 🔥 游戏局号 -->
      <RoundNumber/>

      <!-- 🔥 游戏状态 -->
      <GameStatus
        :alwaysShow="false"
        :autoHide="true"
        :hideDelay="5"
      />

      <!-- 🔥 倒计时 -->
      <Countdown
        :maxTime="30"
      />

      <!-- 设置按钮 -->
      <SettingsBtn />

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// 组件导入
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.vue'
import UserBalance from '@/components/FloatingUI/UserBalance.vue'
import RoundNumber from '@/components/FloatingUI/RoundNumber.vue'
import GameStatus from '@/components/FloatingUI/GameStatus.vue'
import Countdown from '@/components/FloatingUI/Countdown.vue'
import SettingsBtn from '@/components/FloatingUI/SettingsBtn.vue'


// Props
interface Props {
  height: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
})

// 🔥 使用 GameStore
const gameStore = useGameStore()

// 计算样式
const topSectionStyles = computed((): CSSProperties => ({
  height: `${props.height}px`,
  width: '100%',
  position: 'relative',
  background: '#000',
  borderRadius: '0 0 8px 8px',
  overflow: 'hidden',
  flexShrink: 0
}))

// 🔥 计算属性 - 直接从 GameStore 读取数据
const currentVideoUrl = computed(() => {
  return gameStore.videoUrl || ''
})

// 🔥 视频事件处理器
const handleVideoLoad = () => {
  console.log('🎥 视频加载完成')
}

const handleVideoError = () => {
  console.error('❌ 视频加载失败')
}

// 🔥 简化后的暴露接口
defineExpose({
  // 🔥 暴露 GameStore 数据状态供调试
  currentVideoUrl,
  gameStore
})
</script>

<style scoped>
.top-section {
  position: relative;
  background: #000;
  border-radius: 0 0 8px 8px;
  overflow: hidden;
}

.floating-ui-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
}

.floating-ui-layer > * {
  pointer-events: auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .top-section {
    border-radius: 0 0 6px 6px;
  }
}

/* 确保统计组件在左下角正确显示 */
.floating-ui-layer :deep(.game-count-container) {
  z-index: 20;
}
</style>
