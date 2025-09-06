<!-- src/components/FloatingUI/FloatingButtons.vue -->
<template>
  <div class="floating-buttons">
    <!-- 设置按钮 - 始终显示 -->
    <div
      class="btn-wrapper settings-btn"
      @click="handleSettingsClick"
      :class="{ 'active': uiStore.showSettingsPanel }"
    >
      <div class="float-button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
        </svg>
      </div>
    </div>

    <!-- 露珠按钮 - 条件显示 -->
    <div
      v-if="showLuZhuBtn"
      class="btn-wrapper luzhu-btn"
      @click="handleLuZhuClick"
      :class="{ 'active': uiStore.showLuZhuList }"
    >
      <div class="float-button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
        </svg>
      </div>
    </div>

    <!-- 返回按钮 - 条件显示 -->
    <div
      v-if="showBackBtn"
      class="btn-wrapper back-btn"
      :style="backBtnStyle"
      @click="handleBackClick"
      :class="{ 'processing': isBackClickProcessing }"
    >
      <div class="float-button">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useUIStore } from '@/stores/uiStore'
import { useGameStore } from '@/stores/gameStore'

// 使用 Stores
const uiStore = useUIStore()
const gameStore = useGameStore()

// 防抖控制
const isBackClickProcessing = ref(false)

// 计算是否显示露珠按钮
const showLuZhuBtn = computed(() => {
  const list = gameStore.tableInfo?.show_luzhu_list
  return list && list.trim() !== ''
})

// 计算是否显示返回按钮
const showBackBtn = computed(() => {
  return gameStore.tableInfo?.is_show_back === 1
})

// 动态计算返回按钮位置 - 修复间距计算
const backBtnStyle = computed(() => {
  const baseTop = 68 // 设置按钮的位置
  const buttonHeight = 40 // 按钮高度
  const spacing = 12 // 按钮之间的间距

  if (showLuZhuBtn.value) {
    // 露珠按钮显示：设置按钮 -> 露珠按钮 -> 返回按钮
    const luZhuTop = baseTop + buttonHeight + spacing
    const backTop = luZhuTop + buttonHeight + spacing
    return { top: `${backTop}px` }
  } else {
    // 露珠按钮不显示：设置按钮 -> 返回按钮
    const backTop = baseTop + buttonHeight + spacing
    return { top: `${backTop}px` }
  }
})

// 计算露珠按钮位置
const luZhuBtnTop = computed(() => {
  const baseTop = 68
  const buttonHeight = 40
  const spacing = 12
  return baseTop + buttonHeight + spacing
})

// 处理设置按钮点击
const handleSettingsClick = () => {
  console.log('⚙️ 点击设置按钮')
  uiStore.toggleSettingsPanel()
}

// 处理露珠按钮点击
const handleLuZhuClick = () => {
  console.log('📊 点击露珠按钮')
  uiStore.toggleLuZhuList()
}

// 处理返回按钮点击 - 最简单的返回方案
const handleBackClick = () => {
  if (isBackClickProcessing.value) {
    console.log('⚠️ 返回按钮正在处理中')
    return
  }

  console.log('⬅️ 点击返回按钮')
  isBackClickProcessing.value = true

  // 直接使用 referrer 跳转
  window.location.href = document.referrer

  // 重置处理状态
  setTimeout(() => {
    isBackClickProcessing.value = false
  }, 500)
}

// 生命周期
onMounted(() => {
  if (import.meta.env.DEV) {
    console.log('🎮 浮动按钮组已挂载')
    console.log('显示露珠按钮:', showLuZhuBtn.value)
    console.log('显示返回按钮:', showBackBtn.value)
    console.log('露珠按钮位置:', luZhuBtnTop.value)
    console.log('返回按钮位置:', backBtnStyle.value)
  }
})
</script>

<style scoped>
.floating-buttons {
  position: fixed;
  right: 8px;
  z-index: 15;
}

.btn-wrapper {
  position: absolute;
  right: 0;
  cursor: pointer;
  /* 确保整个区域可点击 */
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  /* 增大点击区域 */
  padding: 4px;
  /* 动画 */
  animation: fadeInRight 0.3s ease-out backwards;
}

/* 修正按钮位置 - 使用更精确的计算 */
.settings-btn {
  top: 68px;
  animation-delay: 0ms;
}

.luzhu-btn {
  top: 120px; /* 68 + 40 + 12 = 120px */
  animation-delay: 100ms;
}

.back-btn {
  /* top 通过 computed style 动态设置 */
  animation-delay: 200ms;
}

/* 统一按钮样式 */
.float-button {
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  /* 确保SVG不会阻挡点击 */
  pointer-events: none;
}

/* 悬停效果 */
.btn-wrapper:hover .float-button {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* 激活状态 */
.btn-wrapper.active .float-button {
  background: rgba(64, 169, 255, 0.8);
  border-color: #40a9ff;
  color: white;
}

.btn-wrapper.active:hover .float-button {
  background: rgba(64, 169, 255, 0.9);
}

/* 点击效果 */
.btn-wrapper:active .float-button {
  transform: scale(0.95);
}

/* 处理中状态 */
.btn-wrapper.processing .float-button {
  opacity: 0.6;
  background: rgba(255, 255, 255, 0.2);
}

/* SVG图标 */
.float-button svg {
  pointer-events: none;
  flex-shrink: 0;
}

/* 进入动画 */
@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .floating-buttons {
    right: 8px;
  }

  .btn-wrapper {
    padding: 6px;
  }

  .float-button {
    width: 36px;
    height: 36px;
  }

  .float-button svg {
    width: 16px;
    height: 16px;
  }

  /* 移动端重新计算位置 */
  .settings-btn {
    top: 68px;
  }

  .luzhu-btn {
    top: 116px; /* 68 + 36 + 12 = 116px */
  }
}

/* tooltip 效果 */
.btn-wrapper::after {
  content: attr(data-tooltip);
  position: absolute;
  right: 50px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 1000;
}

/* 为设置按钮添加tooltip */
.settings-btn::after {
  content: "设置";
}

.luzhu-btn::after {
  content: "路珠列表";
}

.back-btn::after {
  content: "返回";
}

.btn-wrapper:hover::after {
  opacity: 1;
}

/* 确保在移动设备上有足够大的触摸目标 */
@media (hover: none) and (pointer: coarse) {
  .btn-wrapper {
    padding: 8px;
    min-width: 48px;
    min-height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-wrapper::after {
    display: none;
  }
}
</style>
