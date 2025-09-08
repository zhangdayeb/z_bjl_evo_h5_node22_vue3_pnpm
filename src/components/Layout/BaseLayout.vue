<template>
  <div class="game-section" :style="sectionStyles">
    <!-- 加载页面 -->
    <LoadingPage v-if="showLoading" />

    <!-- 维护模式 - 只显示图标 -->
    <div v-if="isMaintenanceMode" class="maintenance-overlay">
      <div class="maintenance-icon-container">
        <div class="maintenance-icon">⚙️</div>
      </div>
    </div>

    <!-- 游戏主界面 -->
    <div v-if="!showLoading && !isMaintenanceMode" class="game-main">
      <!-- 1. 顶部视频和状态区域 -->
      <TopSection :height="heights.video" />

      <!-- 2. 中间投注区域和筹码 -->
      <MiddleSection :height="heights.betting" />

      <!-- 4. 弹出层 - 开牌和中奖特效 -->
      <OverlaySection />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { CSSProperties } from 'vue'

// 服务和Store
import { initializeNetworkService, cleanupNetworkService } from '@/services/networkService'
import { useAudio } from '@/services/Audio'
import { useGameStore } from '@/stores/gameStore'

// 组件
import LoadingPage from './Load.vue'
import TopSection from './VideoAndLuZhu.vue'
import MiddleSection from './UserBet.vue'
import OverlaySection from './Overlay.vue'

// 音频服务
const { playAudioFile, startBackgroundMusicIfEnabled } = useAudio()

// 获取gameStore
const gameStore = useGameStore()

// 状态
const showLoading = ref(true)  // 显示加载页面
const viewportHeight = ref(window.innerHeight)
const containerWidth = ref(375)

// 计算属性判断是否维护模式
const isMaintenanceMode = computed(() => {
  if(gameStore.tableInfo?.status === 2){
    showLoading.value = false  // 确保加载页面隐藏
    return true
  }else{
    return false
  }
})

// 获取真实视口高度
const getRealViewportHeight = () => {
  if (window.visualViewport) {
    return window.visualViewport.height
  }
  return window.innerHeight || document.documentElement.clientHeight
}

// 高度计算
const calculateHeights = () => {
  const realHeight = getRealViewportHeight()
  const videoHeight = 300
  const roadmapHeight = Math.round(containerWidth.value * 0.35)
  const bettingHeight = Math.max(200, realHeight - videoHeight - roadmapHeight)

  return {
    total: realHeight,
    video: videoHeight,
    roadmap: roadmapHeight,
    betting: bettingHeight
  }
}

const heights = computed(() => calculateHeights())

// 容器样式
const sectionStyles = computed((): CSSProperties => ({
  height: `${heights.value.total}px`,
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: 'linear-gradient(135deg, #0d1b2a 0%, #1b4332 100%)',
  position: 'relative',
  overflow: 'hidden'
}))

// 窗口大小变化处理
const handleResize = () => {
  viewportHeight.value = getRealViewportHeight()

  nextTick(() => {
    const container = document.querySelector('.game-section') as HTMLElement
    if (container) {
      containerWidth.value = container.offsetWidth
    }
  })
}

// 防抖处理
let resizeTimer: number | null = null
const debouncedResize = () => {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(handleResize, 100)
}

// iOS Safari 视口变化处理
const handleVisualViewportChange = () => {
  if (window.visualViewport) {
    viewportHeight.value = window.visualViewport.height
  }
}

// 组件生命周期
onMounted(async () => {
  console.log('🎮 GameSection 组件已挂载')

  // 初始化网络服务
  try {
    await initializeNetworkService()
    console.log('✅ 网络服务初始化完成')

    // 检查维护状态
    if (isMaintenanceMode.value) {
      console.warn('⚠️ 台桌维护中，status:', gameStore.tableInfo?.status)
    }
  } catch (error) {
    console.error('❌ 网络服务初始化失败:', error)
  }

  // 3秒后自动隐藏加载页面
  setTimeout(() => {
    showLoading.value = false
    console.log('✅ 加载页面已隐藏，游戏界面激活')

    // 播放欢迎音效
    try {
      playAudioFile('welcome.wav')
    } catch (error) {
      console.log('🔇 欢迎音效播放失败:', error)
    }

    // 启动背景音乐
    setTimeout(() => {
      try {
        startBackgroundMusicIfEnabled()
      } catch (error) {
        console.log('🔇 背景音乐启动失败:', error)
      }
    }, 500)
  }, 3000)

  // 初始化尺寸
  handleResize()

  // 监听窗口变化
  window.addEventListener('resize', debouncedResize)
  window.addEventListener('orientationchange', debouncedResize)

  // iOS Safari 特殊处理
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', handleVisualViewportChange)
    window.visualViewport.addEventListener('scroll', handleVisualViewportChange)
  }

  // 监听容器大小变化
  if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        containerWidth.value = entry.contentRect.width
      }
    })

    const container = document.querySelector('.game-section')
    if (container) {
      resizeObserver.observe(container)
    }
  }
})

onUnmounted(() => {
  console.log('🎮 GameSection 组件已卸载')

  // 清理网络服务
  cleanupNetworkService()

  // 清理事件监听
  window.removeEventListener('resize', debouncedResize)
  window.removeEventListener('orientationchange', debouncedResize)

  if (window.visualViewport) {
    window.visualViewport.removeEventListener('resize', handleVisualViewportChange)
    window.visualViewport.removeEventListener('scroll', handleVisualViewportChange)
  }

  if (resizeTimer) {
    clearTimeout(resizeTimer)
  }
})
</script>

<style scoped>
/* 容器样式 */
.game-section {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0d1b2a 0%, #1b4332 100%);
  position: relative;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 游戏主界面 */
.game-main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: inherit;
}

/* 维护模式 - 只有图标 */
.maintenance-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.maintenance-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.maintenance-icon {
  font-size: 72px;
  animation: rotate 3s linear infinite;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .maintenance-icon {
    font-size: 60px;
  }
}

@media (max-width: 480px) {
  .maintenance-icon {
    font-size: 52px;
  }
}

/* 横屏适配 */
@media (orientation: landscape) and (max-height: 500px) {
  .maintenance-icon {
    font-size: 48px;
  }
}
</style>
