<!-- src/components/Layout/Top.vue - 三层定位布局 -->
<template>
  <div class="top-section">
    <!-- 父容器 - 相对最外层绝对定位 -->
    <div class="content-container">
      <!-- 视频播放器 - 相对父容器绝对定位 -->
      <div class="video-area">
        <VideoPlayer
          :autoZoom="true"
          :videoUrl="currentVideoUrl"
          @videoLoad="handleVideoLoad"
          @videoError="handleVideoError"
        />
      </div>

      <!-- 倒计时 - 相对父容器绝对定位 -->
      <div class="countdown-area">
        <Countdown :maxTime="30" />
      </div>
      <!-- 3. 底部路珠区域 -->
      <BottomSection />
      <!-- 投注滚动信息 - 相对父容器绝对定位 -->
      <div class="userbet-area">
        <UserBet />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// 组件导入
import VideoPlayer from '@/components/VideoPlayer/VideoPlayer.vue'
import Countdown from '@/components/FloatingUI/Countdown.vue'
import UserBet from '@/components/FloatingUI/OtherUserBetList.vue'
import BottomSection from './LuZhu.vue'
// 使用 GameStore
const gameStore = useGameStore()

// 计算属性 - 直接从 GameStore 读取数据
const currentVideoUrl = computed(() => {
  return gameStore.videoUrl || ''
})

// 视频事件处理器
const handleVideoLoad = () => {
  console.log('🎥 视频加载完成')
}

const handleVideoError = () => {
  console.error('❌ 视频加载失败')
}

// 暴露接口
defineExpose({
  currentVideoUrl,
  gameStore
})
</script>

<style scoped>
/* 最外层元素 */
.top-section {
  width: 100%;
  height: 100%;
  background-color: #D2B48C; /* 浅棕色 */
  position: relative;
  z-index: 0;
}

/* 父容器 - 相对最外层绝对定位 */
.content-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

/* 视频区域 - 相对父容器绝对定位 */
.video-area {
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 60px; /* 为底部UI留出空间 */
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  overflow: hidden;
}

/* 倒计时区域 - 相对父容器绝对定位 */
.countdown-area {
  position: absolute;
  bottom: 10px;
  left: 10px;
  width: 150px;
  height: 40px;
  z-index: 10;
}

/* 投注滚动区域 - 相对父容器绝对定位 */
.userbet-area {
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 30%;
  height: 200px;
  z-index: 10;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .video-area {
    bottom: 250px; /* 移动端为UI组件留更多空间 */
  }

  .countdown-area {
    left: 50%;
    transform: translateX(-50%);
    bottom: 200px;
  }

  .userbet-area {
    width: 90%;
    left: 5%;
    right: 5%;
    bottom: 10px;
    height: 180px;
  }
}
</style>
