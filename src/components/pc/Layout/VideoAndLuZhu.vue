<!-- src/components/pc/Layout/VideoAndLuZhu.vue - PC版视频区域 -->
<template>
  <div class="pc-video-layer">
    <!-- 视频播放器 -->
    <div class="video-player-wrapper">
      <VideoPlayer
        :autoZoom="true"
        :videoUrl="currentVideoUrl"
        @videoLoad="handleVideoLoad"
        @videoError="handleVideoError"
      />

      <!-- 视频底部渐变过渡带 -->
      <div class="video-to-background"></div>

      <!-- 倒计时 - 悬浮在视频右上角 -->
      <div class="countdown-overlay">
        <Countdown />
      </div>

      <!-- 投注信息滚动列表 - 悬浮在视频左侧 -->
      <OtherUserBetList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// 组件导入
import VideoPlayer from '@/components/pc/VideoPlayer/VideoPlayer.vue'
import Countdown from '@/components/pc/FloatingUI/Countdown.vue'
import OtherUserBetList from '@/components/pc/FloatingUI/OtherUserBetList.vue'

// 使用 Stores
const gameStore = useGameStore()

// 计算属性：获取视频URL
const currentVideoUrl = computed(() => {
  return gameStore.videoUrl || ''
})

// 视频事件处理器
const handleVideoLoad = () => {
  console.log('[PC-VideoAndLuZhu] 视频加载完成')
}

const handleVideoError = () => {
  console.error('[PC-VideoAndLuZhu] 视频加载失败')
}

// 生命周期
onMounted(() => {
  console.log('[PC-VideoAndLuZhu] PC版视频区域已加载')
})
</script>

<style scoped>
/* PC版视频层容器 - 占满父容器100% */
.pc-video-layer {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(to bottom, #c8102e 70%, rgba(200, 16, 46, 0.8) 100%);
  overflow: hidden;
}

/* 视频播放器包装 - 作为定位容器 */
.video-player-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

/* 视频底部渐变过渡带 */
.video-to-background {
  width: 100%;
  height: 100px;
  position: absolute;
  bottom: -100px;
  backdrop-filter: blur(10px);
  background: linear-gradient(
    rgba(200, 16, 46, 0) 0%,
    rgba(200, 16, 46, 0.5) 50%,
    #c8102e 100%
  );
}

/* 倒计时浮层 - 右上角 */
.countdown-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
