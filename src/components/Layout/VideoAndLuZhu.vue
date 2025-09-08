<!-- src/components/Layout/VideoAndLuZhu.vue - 视频与露珠可切换布局 -->
<template>
  <div class="video-and-luzhu">
    <!-- 视频区域 - 绝对定位 -->
    <div
      class="video-section"
      :style="{
        top: isVideoOnTop ? '0' : 'auto',
        bottom: isVideoOnTop ? 'auto' : '0',
        zIndex: isVideoOnTop ? 2 : 1
      }"
    >
      <!-- 视频容器 - 保持16:9比例 -->
      <div class="video-container">
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
          <Countdown :maxTime="30" />
        </div>

        <!-- 投注信息滚动列表 - 悬浮在视频左下角 -->
        <div class="userbet-overlay">
          <OtherUserBetList />
        </div>
      </div>
    </div>

    <!-- 露珠区域 - 绝对定位 -->
    <div
      class="luzhu-section"
      :style="{
        top: isVideoOnTop ? 'auto' : '0',
        bottom: isVideoOnTop ? '0' : 'auto',
        zIndex: isVideoOnTop ? 1 : 2
      }"
    >
      <!-- 切换按钮 - 悬浮在露珠右上角 -->
      <button
        class="switch-button"
        @click="togglePosition"
        v-if="showSwitchButton"
        :title="isVideoOnTop ? '露珠置顶' : '视频置顶'"
      >
        <!-- 上下箭头图标 -->
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 11L12 6L17 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7 13L12 18L17 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
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

// 组件导入
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.vue'
import Countdown from '@/components/FloatingUI/Countdown.vue'
import OtherUserBetList from '@/components/FloatingUI/OtherUserBetList.vue'
import LuZhu from './LuZhu.vue'

// Props定义
interface Props {
  showSwitchButton?: boolean  // 是否显示切换按钮
  defaultVideoOnTop?: boolean // 默认视频是否在上方
}

const props = withDefaults(defineProps<Props>(), {
  showSwitchButton: true,
  defaultVideoOnTop: true
})

// 使用 GameStore
const gameStore = useGameStore()

// 响应式数据
const isVideoOnTop = ref(props.defaultVideoOnTop)
const containerHeight = ref(0)
const videoSectionHeight = ref(0)

// 计算属性 - 直接从 GameStore 读取数据
const currentVideoUrl = computed(() => {
  return gameStore.videoUrl || ''
})

// 计算视频区域高度（基于16:9比例）
const calculateVideoHeight = () => {
  const container = document.querySelector('.video-and-luzhu') as HTMLElement
  if (container) {
    const width = container.clientWidth
    const height = container.clientHeight

    // 计算16:9比例下的高度
    let videoHeight = width * 9 / 16

    // 如果计算出的高度超过容器高度的60%，则限制为60%
    if (videoHeight > height * 0.6) {
      videoHeight = height * 0.6
    }

    // 设置最小高度
    if (videoHeight < 300) {
      videoHeight = 300
    }

    containerHeight.value = height
    videoSectionHeight.value = videoHeight
  }
}

// 切换位置
const togglePosition = () => {
  isVideoOnTop.value = !isVideoOnTop.value
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
  calculateVideoHeight()
  window.addEventListener('resize', calculateVideoHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateVideoHeight)
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
/* 主容器 */
.video-and-luzhu {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #0f0f0f;
  overflow: hidden; /* 禁止滚动 */
}

/* ==================== 视频区域 ==================== */
.video-section {
  position: absolute;
  left: 0;
  right: 0;
  height: v-bind('videoSectionHeight + "px"');
  background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
  transition: all 0.3s ease-in-out;
}

/* 视频容器 - 维持16:9比例 */
.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  max-width: calc(v-bind('videoSectionHeight + "px"') * 16 / 9);
  margin: 0 auto;
  background: #000;
}

/* 视频播放器包装 */
.video-player-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 倒计时浮层 - 右上角 */
.countdown-overlay {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 8px;
  padding: 10px 20px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 投注信息浮层 - 左下角 */
.userbet-overlay {
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 320px;
  height: 200px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.85);
  border-radius: 8px;
  padding: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

/* ==================== 露珠区域 ==================== */
.luzhu-section {
  position: absolute;
  left: 0;
  right: 0;
  height: calc(100% - v-bind('videoSectionHeight + "px"'));
  background: #0f0f0f;
  border-top: 1px solid #2a2a2a;
  border-bottom: 1px solid #2a2a2a;
  overflow: hidden; /* 禁止滚动 */
  transition: all 0.3s ease-in-out;
}

/* ==================== 切换按钮 ==================== */
.switch-button {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 100;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
}

.switch-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  color: #fff;
  transform: scale(1.05);
}

.switch-button:active {
  transform: scale(0.95);
}

.switch-button svg {
  width: 20px;
  height: 20px;
}

/* ==================== 响应式设计 ==================== */

/* 平板端 */
@media (max-width: 1024px) {
  .countdown-overlay {
    top: 15px;
    right: 15px;
    padding: 8px 16px;
    font-size: 14px;
  }

  .userbet-overlay {
    bottom: 15px;
    left: 15px;
    width: 280px;
    height: 180px;
  }

  .switch-button {
    top: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
  }

  .switch-button svg {
    width: 18px;
    height: 18px;
  }
}

/* 移动端 */
@media (max-width: 768px) {
  .video-container {
    max-width: 100%;
  }

  .countdown-overlay {
    top: 10px;
    right: 10px;
    padding: 6px 12px;
    font-size: 12px;
  }

  .userbet-overlay {
    bottom: 10px;
    left: 10px;
    right: 10px;
    width: auto;
    max-width: 300px;
    height: 150px;
    padding: 10px;
  }

  .switch-button {
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
  }

  .switch-button svg {
    width: 16px;
    height: 16px;
  }
}

/* 小屏幕手机 */
@media (max-width: 480px) {
  .countdown-overlay {
    top: 8px;
    right: 8px;
    padding: 4px 10px;
    font-size: 11px;
  }

  .userbet-overlay {
    bottom: 8px;
    left: 8px;
    right: 8px;
    height: 120px;
    padding: 8px;
  }

  .switch-button {
    top: 8px;
    right: 8px;
    width: 26px;
    height: 26px;
  }

  .switch-button svg {
    width: 12px;
    height: 12px;
  }
}

/* ==================== 动画效果 ==================== */
.countdown-overlay,
.userbet-overlay {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 切换按钮动画 */
.switch-button {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
