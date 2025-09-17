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

        <!-- 倒计时 - 悬浮在视频右上角 -->
        <div class="countdown-overlay">
          <Countdown />
        </div>

        <!-- 投注信息滚动列表 - 悬浮在视频左侧 -->
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
        <svg
          class="swap-icon"
          :style="iconStyles"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 14"
          fill="none"
        >
          <path
            d="M15.1468 12.5256c-.39-.209-4.9162-3.50583-7.13056-5.11655L.853265 12.5256M15.1468 6.59087c-.39-.20896-4.9162-3.50582-7.13056-5.11655L.853265 6.59087"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
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
import { useVideoAndLuZhuTopConfigStore } from '@/stores/VideoAndLuZhuTopConfigStore'

// 组件导入
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.vue'
import Countdown from '@/components/FloatingUI/Countdown.vue'
import OtherUserBetList from '@/components/FloatingUI/OtherUserBetList.vue'
import LuZhu from './LuZhu.vue'

// 使用 Stores
const gameStore = useGameStore()
const VideoAndLuZhuTopConfigStore = useVideoAndLuZhuTopConfigStore()

// 响应式数据
const isVideoOnTop = computed(() => VideoAndLuZhuTopConfigStore.isVideoOnTop)
const containerWidth = ref(window.innerWidth)
const videoHeight = ref(300)
const luzhuHeight = ref(233) // 固定露珠高度为233px

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

  // 露珠高度固定为233px
  luzhuHeight.value = 233
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
      top: '233px', // 露珠固定高度233px
      height: `${videoHeight.value}px`,
      zIndex: 1
    }
  }
})

// 计算露珠区域的样式
const luzhuStyles = computed(() => {
  if (isVideoOnTop.value) {
    // 视频在上，露珠在底部
    return {
      bottom: '320px', // 固定距离底部320px
      height: '233px', // 固定高度233px
      zIndex: 1
    }
  } else {
    // 露珠在上
    return {
      top: '0',
      height: '233px', // 固定高度233px
      zIndex: 2
    }
  }
})

// 计算箭头图标的样式
const iconStyles = computed(() => {
  if (isVideoOnTop.value) {
    // 视频在上，露珠在下，箭头向上
    return {
      transform: 'rotate(0deg)'
    }
  } else {
    // 露珠在上，视频在下，箭头向下
    return {
      transform: 'rotate(180deg)'
    }
  }
})

// 切换位置
const togglePosition = () => {
  console.log('切换前:', VideoAndLuZhuTopConfigStore.videoAndLuZhuWhoIsTop)
  VideoAndLuZhuTopConfigStore.togglePosition()
  console.log('切换后:', VideoAndLuZhuTopConfigStore.videoAndLuZhuWhoIsTop)
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
  background: #8d744c;
  overflow: hidden;
}

/* 视频区域 */
.video-section {
  position: absolute;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.05);
}

/* 视频播放器包装 - 作为定位容器 */
.video-player-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  position: relative; /* 为子组件提供定位上下文 */
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

/* 切换按钮 - 圆形设计 */
.switch-button {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 20;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.switch-button:hover {
  background: rgba(0, 0, 0, 0.4);
  color: rgba(255, 255, 255, 0.8);
}

.switch-button:active {
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.9);
}

/* SVG 图标样式 */
.swap-icon {
  width: 20px;
  height: 18px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .countdown-overlay {
    top: 15px;
    right: 15px;
  }

  .switch-button {
    width: 40px;
    height: 40px;
    top: 12px;
    right: 12px;
  }

  .swap-icon {
    width: 18px;
    height: 16px;
  }
}

@media (max-width: 768px) {
  .countdown-overlay {
    top: 10px;
    right: 10px;
  }

  .switch-button {
    width: 38px;
    height: 38px;
    top: 10px;
    right: 10px;
  }

  .swap-icon {
    width: 17px;
    height: 15px;
  }
}

@media (max-width: 480px) {
  .countdown-overlay {
    top: 8px;
    right: 8px;
  }

  .switch-button {
    width: 36px;
    height: 36px;
    top: 8px;
    right: 8px;
  }

  .swap-icon {
    width: 16px;
    height: 14px;
  }
}
</style>
