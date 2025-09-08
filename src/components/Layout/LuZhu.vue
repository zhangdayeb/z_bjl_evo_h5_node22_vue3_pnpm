<!-- 数据驱动的路单自动刷新组件 -->
<template>
  <div class="roadmap-container" :style="containerStyles">
    <iframe
      ref="roadmapIframe"
      :src="roadmapUrl"
      frameborder="0"
      class="roadmap-iframe"
      title="游戏路珠"
      @load="onIframeLoad"
    />

    <!-- 刷新状态指示器 -->
    <div v-if="isRefreshing" class="refresh-indicator">
      <!-- <div class="spinner"></div>
      <span>更新路单中...</span> -->
    </div>

    <!-- 调试信息（开发模式下显示） -->
    <div v-if="isDev && showDebugInfo" class="debug-info">
      <div>状态: {{ gameStore.gameStatus }}</div>
      <div>桌号: {{ gameParams.table_id }}</div>
      <div>刷新次数: {{ refreshCount }}</div>
      <div>最后刷新: {{ lastRefreshTime }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, type CSSProperties } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'
import { getGameParams } from '@/utils/urlParams'

// Props
interface Props {
  width: number
  height?: number
  showDebugInfo?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 375,
  height: 0, // 0表示使用宽度*0.35的自动计算
  showDebugInfo: false
})

// Emits
const emit = defineEmits<{
  refresh: [timestamp: number, gameStatus: string]
  load: [event: Event]
}>()

// Store 和状态
const gameStore = useGameStore()
const uiStore = useUIStore()
const roadmapIframe = ref<HTMLIFrameElement>()
const isRefreshing = ref(false)
const lastRefreshTime = ref('')
const refreshCount = ref(0)
const isDev = ref(import.meta.env.DEV)

// 获取游戏参数
const gameParams = getGameParams()

// 从环境变量获取路珠基础URL
const getLzBaseUrl = (): string => {
  return import.meta.env.VITE_LZ_URL || ''
}

// 计算路珠URL（每次都带新的时间戳）
const roadmapUrl = computed(() => {
  const baseUrl = getLzBaseUrl()
  const timestamp = Date.now()
  return `${baseUrl}?tableId=${gameParams.table_id}&user_id=${gameParams.user_id}&t=${timestamp}`
})

// 计算高度
const calculatedHeight = computed(() => {
  return props.height > 0 ? props.height : Math.round(props.width * 0.35)
})

// 计算容器样式
const containerStyles = computed((): CSSProperties => ({
  width: `${props.width}px`,
  height: `${calculatedHeight.value}px`,
  position: 'relative',
  background: '#1a1a1a',
  borderRadius: '8px',
  overflow: 'hidden',
  flexShrink: 0
}))

// 🔥 核心刷新方法
const refreshRoadmap = async (trigger: string): Promise<void> => {
  if (isRefreshing.value || !roadmapIframe.value) return

  try {
    isRefreshing.value = true
    const timestamp = Date.now()

    // 生成新的URL（带时间戳强制刷新）
    const baseUrl = getLzBaseUrl()
    const newUrl = `${baseUrl}?tableId=${gameParams.table_id}&user_id=${gameParams.user_id}&t=${timestamp}`

    // 更新iframe src
    roadmapIframe.value.src = newUrl

    // 更新状态
    refreshCount.value++
    lastRefreshTime.value = new Date().toLocaleTimeString()

    console.log(`🔄 [${trigger}] 自动刷新路单:`, newUrl)
    emit('refresh', timestamp, trigger)

    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 300))
  } catch (error) {
    console.error('❌ 刷新路单失败:', error)
  } finally {
    isRefreshing.value = false
  }
}

// iframe加载完成
const onIframeLoad = (event: Event) => {
  console.log('✅ 路单iframe加载完成')
  emit('load', event)
}

// 监听 UIStore 的 showResultEffect 变化
watch(() => uiStore.showResultEffect, (newValue, oldValue) => {
  if (newValue === true && newValue !== oldValue) {
    setTimeout(() => {
      refreshRoadmap('开牌效果显示')
    }, 100)
  }
})

// 🔥 监听 gameStore 的 gameStatus 变化
watch(() => gameStore.gameStatus, (newStatus, oldStatus) => {
  // 只在状态真正发生变化时才刷新
  if (newStatus !== oldStatus && newStatus) {
    console.log(`🎯 游戏状态变化: ${oldStatus} -> ${newStatus}`)

    // 在状态变为 dealing 或 betting 时刷新路单
    if (newStatus === 'dealing') {
      setTimeout(() => {
        refreshRoadmap('开牌状态')
      }, 100) // 短暂延迟确保状态已稳定
    } else if (newStatus === 'betting') {
      setTimeout(() => {
        refreshRoadmap('投注状态')
      }, 100)
    }
  }
}, {
  immediate: false, // 不要在初始化时立即执行
  flush: 'post'     // 在 DOM 更新后执行
})

// 生命周期
onMounted(() => {
  console.log('🎯 数据驱动路单组件初始化:', {
    width: props.width,
    height: calculatedHeight.value,
    tableId: gameParams.table_id,
    userId: gameParams.user_id,
    currentGameStatus: gameStore.gameStatus,
    roadmapUrl: roadmapUrl.value
  })

  // 初始加载时也刷新一次
  setTimeout(() => {
    refreshRoadmap('组件初始化')
  }, 1000)
})

onUnmounted(() => {
  console.log('🎯 数据驱动路单组件已卸载')
})
</script>

<style scoped>
.roadmap-container {
  position: relative;
  background: #1a1a1a;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.roadmap-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  display: block;
  transition: opacity 0.3s ease;
}

/* 刷新指示器 - 移除样式 */
/* .refresh-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 10;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #52c41a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
} */

/* 调试信息 */
.debug-info {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px;
  border-radius: 4px;
  font-size: 10px;
  line-height: 1.4;
  z-index: 5;
  max-width: 200px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.debug-info div {
  margin-bottom: 2px;
}

/* 刷新状态的视觉反馈 */
.roadmap-iframe {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.roadmap-container.refreshing .roadmap-iframe {
  opacity: 0.7;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .roadmap-container {
    border-radius: 6px;
  }

  .refresh-indicator {
    padding: 10px 16px;
    font-size: 13px;
  }

  .debug-info {
    font-size: 9px;
    padding: 6px;
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .roadmap-container {
    background: #0a0a0a;
    border-color: rgba(255, 255, 255, 0.05);
  }
}

/* 加载动画效果 */
.roadmap-container {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
