<template>
  <div class="game-section" :style="sectionStyles">
    <!-- 欢迎页面 -->
    <div v-if="showWelcome" class="welcome-overlay">
      <div class="welcome-container">
        <h1 class="welcome-title">欢迎光临百家乐游戏</h1>
        <button class="welcome-button" @click="startGame">
          开始游戏
        </button>
      </div>
    </div>

    <!-- 游戏主界面 -->
    <div v-else class="game-main">
      <!-- 1. 顶部视频和状态区域 -->
      <TopSection :height="heights.video" />

      <!-- 2. 中间投注区域和筹码 -->
      <MiddleSection :height="heights.betting" />

      <!-- 3. 底部路珠区域 -->
      <BottomSection :width="containerWidth" />

      <!-- 4. 弹出层 - 开牌和中奖特效 -->
      <OverlaySection />

      <!-- 🔥 新增：维护模式遮罩 -->
      <div v-if="isMaintenanceMode" class="maintenance-overlay">
        <div class="maintenance-modal">
          <div class="maintenance-icon">⚙️</div>
          <h2 class="maintenance-title">系统维护中</h2>
          <p class="maintenance-desc">
            当前游戏台桌正在进行系统维护<br>
            预计维护时间：2-4小时<br>
            请稍后再试，给您带来不便敬请谅解
          </p>
          <div class="maintenance-info">
            {{ gameStore.tableName || '百家乐' }} · 维护中
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { CSSProperties } from 'vue'

// 服务和Store
import { initializeNetworkService, cleanupNetworkService } from '@/services/networkService'
import { useAudio } from '@/services/Audio'
import { useGameStore } from '@/stores/gameStore'  // 🔥 新增引入

// 组件
import TopSection from './Top.vue'
import MiddleSection from './Middle.vue'
import BottomSection from './Bottom.vue'
import OverlaySection from './Overlay.vue'

// 音频服务
const { playAudioFile, startBackgroundMusicIfEnabled } = useAudio()

// 🔥 新增：获取gameStore
const gameStore = useGameStore()

// 🔥 新增：计算属性判断是否维护模式
const isMaintenanceMode = computed(() => {
  return gameStore.tableInfo?.status === 2
})

// 状态
const showWelcome = ref(true)
const viewportHeight = ref(window.innerHeight)
const containerWidth = ref(375)

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

// 开始游戏
const startGame = async () => {
  console.log('🎮 用户点击开始游戏')

  // 隐藏欢迎页面
  showWelcome.value = false

  // 启动音频（非阻塞）
  try {
    await playAudioFile('welcome.wav')
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

  console.log('✅ 游戏界面已激活')
}

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

    // 🔥 新增：检查维护状态
    if (isMaintenanceMode.value) {
      console.warn('⚠️ 台桌维护中，status:', gameStore.tableInfo?.status)
    }
  } catch (error) {
    console.error('❌ 网络服务初始化失败:', error)
  }

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

/* 欢迎页面 */
.welcome-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #0d1b2a 0%, #1b4332 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.welcome-container {
  text-align: center;
  color: white;
  padding: 40px 20px;
}

.welcome-title {
  font-size: 32px;
  font-weight: 600;
  margin: 0 0 40px 0;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.welcome-button {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 40px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.welcome-button:hover {
  background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

/* 游戏主界面 */
.game-main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-height: inherit;
}

/* 🔥 新增：维护模式样式 */
.maintenance-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* 完全不透明的深色背景 */
  background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease-in-out;
}

.maintenance-modal {
  /* 卡片样式优化 */
  background: linear-gradient(145deg, #1c2128 0%, #0d1117 100%);
  border-radius: 20px;
  padding: 48px 40px;
  text-align: center;
  border: 1px solid #30363d;
  max-width: 420px;
  width: 90%;
  margin: 20px;
  /* 更柔和的阴影 */
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 107, 107, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.maintenance-icon {
  font-size: 72px;
  margin-bottom: 24px;
  animation: rotate 4s linear infinite;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.maintenance-title {
  color: #f0f6fc;
  font-size: 32px;
  margin-bottom: 20px;
  font-weight: 600;
  letter-spacing: -0.5px;
}

.maintenance-desc {
  color: #8b949e;
  font-size: 16px;
  line-height: 1.7;
  margin-bottom: 32px;
}

.maintenance-info {
  background: linear-gradient(145deg, #21262d 0%, #161b22 100%);
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 14px;
  color: #8b949e;
  border: 1px solid #30363d;
  display: inline-block;
  font-weight: 500;
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
  .welcome-title {
    font-size: 28px;
  }

  .welcome-button {
    padding: 14px 32px;
    font-size: 16px;
  }

  .maintenance-title {
    font-size: 26px;
  }

  .maintenance-modal {
    padding: 36px 28px;
  }

  .maintenance-icon {
    font-size: 60px;
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: 24px;
  }

  .welcome-button {
    padding: 12px 24px;
    font-size: 14px;
  }

  .maintenance-title {
    font-size: 22px;
  }

  .maintenance-desc {
    font-size: 14px;
  }

  .maintenance-modal {
    padding: 28px 20px;
  }

  .maintenance-icon {
    font-size: 52px;
  }

  .maintenance-info {
    font-size: 13px;
    padding: 12px 20px;
  }
}

/* 横屏适配 */
@media (orientation: landscape) and (max-height: 500px) {
  .welcome-container {
    padding: 20px;
  }

  .welcome-title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  .maintenance-modal {
    padding: 24px 32px;
    max-width: 480px;
  }

  .maintenance-icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  .maintenance-title {
    font-size: 24px;
    margin-bottom: 12px;
  }

  .maintenance-desc {
    margin-bottom: 20px;
    font-size: 14px;
  }
}
</style>
