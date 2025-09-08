<!-- src/components/Layout/GameRun.vue -->
<template>
  <div class="game-run-container" :style="containerStyles">
    <!-- 第一层：底层 - 视频和路珠背景层 -->
    <div class="layer-bottom">
      <VideoAndLuZhu :height="heights.video" />
    </div>

    <!-- 第二层：中间层 - 用户投注操作层 -->
    <div class="layer-middle">
      <UserBet :height="heights.betting" />
    </div>

    <!-- 第三层：顶层 - 弹窗和特效层 -->
    <div class="layer-top">
      <Overlay />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import type { CSSProperties } from 'vue'
import { useGameStore } from '@/stores/gameStore'


// 导入三层组件
import VideoAndLuZhu from './VideoAndLuZhu.vue'  // 底层：视频和路珠
import UserBet from './UserBet.vue'              // 中间层：投注区域
import Overlay from './Overlay.vue'              // 顶层：弹窗和特效

// Store
const gameStore = useGameStore()


// 状态
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
const containerStyles = computed((): CSSProperties => ({
  height: `${heights.value.total}px`,
  minHeight: '100vh',
  width: '100%',
  position: 'relative',
  overflow: 'hidden'
}))

// 窗口大小变化处理
const handleResize = () => {
  viewportHeight.value = getRealViewportHeight()

  nextTick(() => {
    const container = document.querySelector('.game-run-container') as HTMLElement
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

// 生命周期
onMounted(() => {
  console.log('🎮 GameRun 三层布局已加载')
  console.log('├─ 底层: VideoAndLuZhu (视频、路珠、倒计时、投注滚动)')
  console.log('├─ 中间层: UserBet (投注区域、筹码、游戏统计)')
  console.log('└─ 顶层: Overlay (弹窗、特效、面板)')

  // 初始化游戏状态
  console.log('当前游戏状态:', gameStore.gameStatus)

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

    const container = document.querySelector('.game-run-container')
    if (container) {
      resizeObserver.observe(container)
    }
  }
})

onUnmounted(() => {
  console.log('🎮 GameRun 组件已卸载')

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
/* 游戏运行容器 - 占满父容器 */
.game-run-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
}

/* 三层布局样式 */

/* 第一层：底层 - 视频和路珠背景 */
.layer-bottom {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: auto;
}

/* 第二层：中间层 - 投注操作区域 */
.layer-middle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  pointer-events: none; /* 默认不拦截事件 */
}

/* 中间层的子元素需要交互的部分 */
.layer-middle :deep(.betting-area-wrapper),
.layer-middle :deep(.chip-display),
.layer-middle :deep(.game-count-container) {
  pointer-events: auto; /* 投注区域可交互 */
}

/* 第三层：顶层 - 弹窗和特效 */
.layer-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  pointer-events: none; /* 默认不拦截事件 */
}

/* 顶层的弹窗和特效需要交互 */
.layer-top :deep(.overlay-system > *) {
  pointer-events: auto; /* 弹窗可交互 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .game-run-container {
    /* 移动端适配 */
  }
}

/* 横屏模式 */
@media (orientation: landscape) and (max-height: 500px) {
  .game-run-container {
    /* 横屏适配 */
  }
}

/* 层级过渡动画 */
.layer-bottom,
.layer-middle,
.layer-top {
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

/* 确保内容不会溢出 */
.layer-bottom > *,
.layer-middle > *,
.layer-top > * {
  width: 100%;
  height: 100%;
}
</style>
