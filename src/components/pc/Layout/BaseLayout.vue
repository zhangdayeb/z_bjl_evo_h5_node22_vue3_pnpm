<template>
  <div class="game-viewport">
    <div class="game-section" ref="gameContainer">
      <!-- 加载页面 -->
      <LoadingPage v-if="showLoading" />

      <!-- 维护模式 - 只显示图标 -->
      <div v-if="isMaintenanceMode" class="maintenance-overlay">
        <div class="maintenance-icon-container">
          <div class="maintenance-icon">⚙️</div>
        </div>
      </div>

      <!-- 游戏主界面 - 改为加载 GameRun -->
      <GameRun v-if="!showLoading && !isMaintenanceMode" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 服务和Store
import { initializeNetworkService, cleanupNetworkService } from '@/services/networkService'
import { useGameStore } from '@/stores/gameStore'

// 组件
import LoadingPage from './Load.vue'
import GameRun from './GameRun.vue'

// 获取gameStore
const gameStore = useGameStore()

// 状态
const showLoading = ref(true)  // 显示加载页面
const gameContainer = ref<HTMLElement | null>(null)  // 游戏容器引用

// 计算属性判断是否维护模式
const isMaintenanceMode = computed(() => {
  if(gameStore.tableInfo?.status === 2){
    showLoading.value = false  // 确保加载页面隐藏
    return true
  }else{
    return false
  }
})

// 缩放逻辑 - 保持16:9比例
const updateScale = () => {
  if (!gameContainer.value) return

  const designWidth = 1280
  const designHeight = 720
  const designRatio = designWidth / designHeight

  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const windowRatio = windowWidth / windowHeight

  let scale = 1

  if (windowRatio > designRatio) {
    // 窗口更宽，以高度为准
    scale = windowHeight / designHeight
  } else {
    // 窗口更高，以宽度为准
    scale = windowWidth / designWidth
  }

  gameContainer.value.style.transform = `scale(${scale})`

  console.log(`🎮 缩放比例: ${scale.toFixed(3)} (窗口: ${windowWidth}x${windowHeight})`)
}

// 组件生命周期
onMounted(async () => {
  console.log('🎮 BaseLayout 组件已挂载')

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

  // 初始化缩放
  updateScale()

  // 监听窗口大小变化
  window.addEventListener('resize', updateScale)

  // 3秒后自动隐藏加载页面
  setTimeout(() => {
    showLoading.value = false
    console.log('✅ 加载页面已隐藏，游戏界面激活')
  }, 100)
})

onUnmounted(() => {
  console.log('🎮 BaseLayout 组件已卸载')

  // 移除窗口监听
  window.removeEventListener('resize', updateScale)

  // 清理网络服务
  cleanupNetworkService()
})
</script>

<style scoped>
/* 外层viewport - 黑色背景，全屏居中 */
.game-viewport {
  width: 100vw;
  height: 100vh;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

/* 游戏容器 - 固定1280×720设计尺寸 */
.game-section {
  width: 1280px;
  height: 720px;
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transform-origin: center center;
  background: #0a0e1a;
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
</style>
