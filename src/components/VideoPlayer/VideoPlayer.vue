<template>
  <div class="video-player">
    <!-- 视频容器 -->
    <div class="video-container" :style="containerStyles">
      <iframe
        ref="videoIframe"
        :src="videoUrl"
        frameborder="0"
        allowfullscreen
        scrolling="no"
        class="video-iframe"
        :style="videoStyles"
        @load="onVideoLoad"
        @error="onVideoError"
      />
    </div>

    <!-- 加载状态指示器 -->
    <div v-if="showLoadingIndicator" class="loading-indicator">
      <div class="loading-spinner"></div>
      <span>视频加载中...</span>
    </div>

    <!-- 错误状态指示器 -->
    <div v-if="hasError" class="error-indicator">
      <div class="error-icon">⚠️</div>
      <span>视频加载失败</span>
      <button @click="reloadVideo" class="retry-btn">重试</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { CSSProperties } from 'vue'
import { useGameStore } from '@/stores/gameStore'

interface Props {
  videoUrl: string           // 视频地址
  autoZoom?: boolean        // 是否启用自动缩放
  zoomScale?: number        // 缩放比例 (dealing状态时的缩放倍数)
  animationDuration?: number // 动画持续时间(ms)
  resetDelay?: number       // 自动重置延迟时间(ms)
}

const props = withDefaults(defineProps<Props>(), {
  autoZoom: false,
  zoomScale: 1.5,
  animationDuration: 300,
  resetDelay: 12000
})

// 事件定义
const emit = defineEmits<{
  videoLoad: []
  videoError: []
}>()

// 使用 GameStore
const gameStore = useGameStore()

// 模板引用
const videoIframe = ref<HTMLIFrameElement>()

// 状态管理
const currentZoom = ref(1.0)
const isZooming = ref(false)
const isLoaded = ref(false)
const hasError = ref(false)

// 定时器管理
const autoZoomTimers = ref<Set<ReturnType<typeof setTimeout>>>(new Set())

// 计算属性
const showLoadingIndicator = computed(() => !isLoaded.value && !hasError.value)

// 容器样式
const containerStyles = computed((): CSSProperties => ({
  overflow: 'hidden',
  position: 'relative',
  width: '100%',
  height: '100%'
}))

// 视频样式
const videoStyles = computed((): CSSProperties => ({
  transform: `scale(${currentZoom.value})`,
  transition: isZooming.value ? `transform ${props.animationDuration}ms ease-in-out` : 'none',
  transformOrigin: 'center center'
}))

// 清理定时器
const clearAutoZoomTimers = () => {
  autoZoomTimers.value.forEach(timer => clearTimeout(timer))
  autoZoomTimers.value.clear()
}

// 缩放方法
const setZoom = (newZoom: number, animate = true) => {
  if (newZoom === currentZoom.value) {
    return
  }

  console.log(`🔍 自动缩放设置: ${currentZoom.value} → ${newZoom}`)

  if (animate) {
    isZooming.value = true

    // 动画结束后关闭动画状态
    setTimeout(() => {
      isZooming.value = false
    }, props.animationDuration)
  }

  currentZoom.value = newZoom
}

// 渐进缩放（用于动画效果）
const animateZoom = (targetZoom: number, duration = 1000) => {
  const startZoom = currentZoom.value
  const zoomDiff = targetZoom - startZoom
  const startTime = Date.now()

  const animate = () => {
    const elapsed = Date.now() - startTime
    const progress = Math.min(elapsed / duration, 1)

    // 使用 easeInOutQuad 缓动函数
    const easedProgress = progress < 0.5
      ? 2 * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 2) / 2

    const newZoom = startZoom + (zoomDiff * easedProgress)
    setZoom(newZoom, false)

    if (progress < 1) {
      requestAnimationFrame(animate)
    }
  }

  requestAnimationFrame(animate)
}

// 自动缩放逻辑
const handleAutoZoom = (gameStatus: string) => {
  if (!props.autoZoom) return

  console.log(`🤖 自动缩放处理: 游戏状态 ${gameStatus}`)

  // 清理之前的定时器
  clearAutoZoomTimers()

  switch (gameStatus) {
    case 'dealing':
      // 开牌时放大
      console.log(`📈 开牌放大到 ${props.zoomScale} 倍`)
      animateZoom(props.zoomScale, props.animationDuration)

      // 设置自动重置定时器
      const resetTimer = setTimeout(() => {
        console.log(`🔄 自动重置缩放到 1.0 倍`)
        animateZoom(1.0, props.animationDuration)
        autoZoomTimers.value.delete(resetTimer)
      }, props.resetDelay)

      autoZoomTimers.value.add(resetTimer)
      break

    case 'betting':
    case 'waiting':
    case 'result':
      // 其他状态恢复正常
      console.log(`📉 恢复正常缩放 1.0 倍`)
      animateZoom(1.0, props.animationDuration)
      break

    default:
      console.log(`⚠️ 未知游戏状态: ${gameStatus}`)
      break
  }
}

// 视频加载事件
const onVideoLoad = () => {
  console.log('✅ 视频加载完成')
  isLoaded.value = true
  hasError.value = false
  emit('videoLoad')
}

// 视频错误事件
const onVideoError = () => {
  console.error('❌ 视频加载失败')
  isLoaded.value = false
  hasError.value = true
  emit('videoError')
}

// 重新加载视频
const reloadVideo = () => {
  console.log('🔄 重新加载视频')
  hasError.value = false
  isLoaded.value = false

  if (videoIframe.value) {
    const currentSrc = videoIframe.value.src
    videoIframe.value.src = ''
    setTimeout(() => {
      if (videoIframe.value) {
        videoIframe.value.src = currentSrc
      }
    }, 100)
  }
}

// 监听游戏状态变化进行自动缩放
watch(() => gameStore.gameStatus, (newStatus) => {
  if (props.autoZoom) {
    handleAutoZoom(newStatus)
  }
}, { immediate: false })

// 监听 videoUrl 变化
watch(() => props.videoUrl, () => {
  hasError.value = false
  isLoaded.value = false
})

// 监听 autoZoom 变化
watch(() => props.autoZoom, (newAutoZoom) => {
  if (!newAutoZoom) {
    // 关闭自动缩放时，清理定时器并重置缩放
    console.log('🛑 关闭自动缩放，重置到正常状态')
    clearAutoZoomTimers()
    animateZoom(1.0, props.animationDuration)
  } else {
    // 开启自动缩放时，立即根据当前游戏状态执行缩放
    console.log('🚀 开启自动缩放，根据当前状态执行缩放')
    handleAutoZoom(gameStore.gameStatus)
  }
})

// 组件挂载时初始化
onMounted(() => {
  console.log('🎬 VideoPlayer 组件已挂载')
  console.log('📺 视频地址:', props.videoUrl)
  console.log('🤖 自动缩放:', props.autoZoom)
  console.log('📏 缩放比例:', props.zoomScale)

  // 如果启用自动缩放，根据当前游戏状态初始化
  if (props.autoZoom) {
    handleAutoZoom(gameStore.gameStatus)
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  console.log('🗑️ VideoPlayer 组件卸载，清理定时器')
  clearAutoZoomTimers()
})

// 暴露简化的接口给父组件（用于调试）
defineExpose({
  currentZoom,
  reloadVideo
})
</script>

<style scoped>
.video-player {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
  border-radius: 8px;
}

.video-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: #000;
  display: block;
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 14px;
  z-index: 15;
  background: rgba(0, 0, 0, 0.7);
  padding: 20px;
  border-radius: 8px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 14px;
  z-index: 15;
  background: rgba(220, 53, 69, 0.8);
  padding: 20px;
  border-radius: 8px;
}

.error-icon {
  font-size: 24px;
}

.retry-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .loading-indicator,
  .error-indicator {
    font-size: 12px;
    padding: 15px;
  }
}

/* 防止缩放时出现滚动条 */
.video-container::-webkit-scrollbar {
  display: none;
}

.video-container {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
