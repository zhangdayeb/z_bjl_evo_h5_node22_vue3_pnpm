<!-- 简化版露珠组件 -->
<template>
  <div class="luzhu-container">
    <iframe
      ref="luZhuIframe"
      :src="luZhuUrl"
      frameborder="0"
      class="luzhu-iframe"
      title="游戏路珠"
      @load="onIframeLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'
import { getGameParams } from '@/utils/urlParams'

// Store
const gameStore = useGameStore()
const uiStore = useUIStore()

// Refs
const luZhuIframe = ref<HTMLIFrameElement>()

// 获取游戏参数
const gameParams = getGameParams()

// 路珠基础URL
const getLzBaseUrl = (): string => {
  return import.meta.env.VITE_LZ_URL || ''
}

// 计算路珠URL（带时间戳强制刷新）
const luZhuUrl = computed(() => {
  const baseUrl = getLzBaseUrl()
  const timestamp = Date.now()
  return `${baseUrl}?tableId=${gameParams.table_id}&user_id=${gameParams.user_id}&t=${timestamp}`
})

// 刷新路珠
const refreshLuZhu = (): void => {
  if (!luZhuIframe.value) return

  const baseUrl = getLzBaseUrl()
  const timestamp = Date.now()
  const newUrl = `${baseUrl}?tableId=${gameParams.table_id}&user_id=${gameParams.user_id}&t=${timestamp}`

  luZhuIframe.value.src = newUrl
  console.log('🔄 刷新路珠:', newUrl)
}

// iframe加载完成
const onIframeLoad = () => {
  console.log('✅ 路珠加载完成')
}

// 监听开牌效果显示
watch(() => uiStore.showResultEffect, (newValue) => {
  if (newValue === true) {
    setTimeout(() => {
      refreshLuZhu()
    }, 100)
  }
})

// 监听游戏状态变化
watch(() => gameStore.gameStatus, (newStatus, oldStatus) => {
  if (newStatus !== oldStatus && newStatus) {
    // 在特定状态时刷新路珠
    if (newStatus === 'dealing' || newStatus === 'betting') {
      setTimeout(() => {
        refreshLuZhu()
      }, 100)
    }
  }
})

// 生命周期
onMounted(() => {
  console.log('🎯 路珠组件初始化:', {
    tableId: gameParams.table_id,
    userId: gameParams.user_id,
    url: luZhuUrl.value
  })

  // 初始加载
  setTimeout(() => {
    refreshLuZhu()
  }, 1000)
})

// 暴露方法供外部调用
defineExpose({
  refreshLuZhu
})
</script>

<style scoped>
.luzhu-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #1a1a1a;
  overflow: hidden;
}

.luzhu-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  display: block;
}

/* 加载动画 */
.luzhu-container {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* 深色主题适配 */
@media (prefers-color-scheme: dark) {
  .luzhu-container {
    background: #0a0a0a;
  }
}
</style>
