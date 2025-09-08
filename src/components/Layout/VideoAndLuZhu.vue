<!-- src/components/Layout/VideoAndLuZhu.vue - 第一层：视频与露珠 -->
<template>
  <div class="video-and-luzhu-layer">
    <!-- 视频区域 - 绝对定位 -->
    <div
      class="video-section"
      :style="videoStyles"
    >
      <!-- 视频播放器 -->
      <div class="video-player-wrapper">
        <VideoPlayer
          :autoZoom="true"
          :videoUrl="currentVideoUrl"
          @videoLoad="handleVideoLoad"
          @videoError="handleVideoError"
        />
      </div>

      <!-- 倒计时 - 悬浮在视频右上角 -->
      <div class="countdown-overlay">
        <Countdown :maxTime="30" :size="80" />
      </div>

      <!-- 投注信息滚动列表 - 悬浮在视频左下角 -->
      <div class="userbet-overlay">
        <OtherUserBetList />
      </div>
    </div>

    <!-- 露珠区域 - 绝对定位 -->
    <div
      class="luzhu-section"
      :style="luzhuStyles"
    >
      <!-- 切换按钮 - 悬浮在露珠右上角 -->
      <button
        class="switch-button"
        @click="togglePosition"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 3.5L4 7.5L5 8.5L7.5 6V12.5H8.5V6L11 8.5L12 7.5L8 3.5Z"/>
          <path d="M8 12.5L12 8.5L11 7.5L8.5 10V3.5H7.5V10L5 7.5L4 8.5L8 12.5Z" opacity="0.6"/>
        </svg>
      </button>

      <!-- 露珠内容 -->
      <LuZhu />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useConfigStore } from '@/stores/configStore'

// 组件导入
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.vue'
import Countdown from '@/components/FloatingUI/Countdown.vue'
import OtherUserBetList from '@/components/FloatingUI/OtherUserBetList.vue'
import LuZhu from './LuZhu.vue'

// 使用 Stores
const gameStore = useGameStore()
const configStore = useConfigStore()

// 响应式数据
const isVideoOnTop = computed(() => configStore.isVideoOnTop)
const containerWidth = ref(window.innerWidth)
const videoHeight = ref(300)
const luzhuHeight = ref(150)

// 计算属性
const currentVideoUrl = computed(() => {
  return gameStore.videoUrl || ''
})

// 计算高度
const calculateHeights = () => {
  const width = window.innerWidth
  containerWidth.value = width

  // 视频高度 = 宽度 * 9/16 (16:9比例)，但不超过300px
  videoHeight.value = Math.min(width * 9 / 16, 300)

  // 露珠高度 = 宽度 / 2.73，但不超过150px
  luzhuHeight.value = Math.min(width / 2.73, 150)
}

// 计算视频区域的样式
const videoStyles = computed(() => {
  if (isVideoOnTop.value) {
    // 视频在上
    return {
      top: '0',
      height: `${videoHeight.value}px`,
      zIndex: 2
    }
  } else {
    // 露珠在上，视频紧挨着露珠
    return {
      top: `${luzhuHeight.value}px`,
      height: `${videoHeight.value}px`,
      zIndex: 1
    }
  }
})

// 计算露珠区域的样式
const luzhuStyles = computed(() => {
  if (isVideoOnTop.value) {
    // 视频在上，露珠贴着投注区域顶部
    return {
      bottom: configStore.userBetHeightPercentage, // 直接贴着投注区域
      height: `${luzhuHeight.value}px`,
      zIndex: 1
    }
  } else {
    // 露珠在上
    return {
      top: '0',
      height: `${luzhuHeight.value}px`,
      zIndex: 2
    }
  }
})

// 切换位置
const togglePosition = () => {
  configStore.togglePosition()
}

// 视频事件处理器
const handleVideoLoad = () => {
  console.log('🎥 视频加载完成')
}

const handleVideoError = () => {
  console.error('❌ 视频加载失败')
}

// 生命周期
onMounted(() => {
  calculateHeights()
  window.addEventListener('resize', calculateHeights)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateHeights)
})

// 暴露接口
defineExpose({
  currentVideoUrl,
  gameStore,
  togglePosition,
  isVideoOnTop
})
</script>

<style scoped>
/* 第一层容器 - 占满100%高度 */
.video-and-luzhu-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: #D2B48C;
  overflow: hidden;
}

/* 视频区域 */
.video-section {
  position: absolute;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.05);
}

/* 视频播放器包装 */
.video-player-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

/* 露珠区域 */
.luzhu-section {
  position: absolute;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.02);
  overflow: hidden;
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

/* 投注信息浮层 - 左下角 */
.userbet-overlay {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 200px;
  height: 150px;
  z-index: 10;
  overflow: hidden;
}

/* 切换按钮 */
.switch-button {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 20;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
}

.switch-button:hover {
  background: rgba(0, 0, 0, 0.7);
  border-color: rgba(255, 255, 255, 0.25);
  color: rgba(255, 255, 255, 0.95);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .countdown-overlay {
    top: 15px;
    right: 15px;
  }

  .userbet-overlay {
    bottom: 15px;
    left: 15px;
    width: 180px;
    height: 130px;
  }
}

@media (max-width: 768px) {
  .countdown-overlay {
    top: 10px;
    right: 10px;
  }

  .userbet-overlay {
    bottom: 10px;
    left: 10px;
    width: 160px;
    height: 110px;
  }
}

@media (max-width: 480px) {
  .countdown-overlay {
    top: 8px;
    right: 8px;
  }

  .userbet-overlay {
    bottom: 8px;
    left: 8px;
    width: 140px;
    height: 90px;
  }
}
</style>
