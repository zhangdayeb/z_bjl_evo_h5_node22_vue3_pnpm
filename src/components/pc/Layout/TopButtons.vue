<template>
  <div class="pc-top-buttons">
    <div class="left-section">
      <!-- 第一行：关闭按钮 + 桌台信息 + 图钉按钮 -->
      <div class="table-info-section">
        <button class="close-button" @click="handleClose">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div class="table-info" @click="handleTableClick">
          <div class="table-name">{{ tableInfo.name }}</div>
          <div class="table-limits">{{ tableInfo.limits }}</div>
        </div>

        <!-- 图钉按钮 -->
        <button class="pin-button" @click="handlePin" :class="{ 'pinned': isPinned }">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z"/>
          </svg>
        </button>
      </div>

      <!-- 第二行：搜索框 -->
      <div class="search-section">
        <input
          type="text"
          class="search-input"
          placeholder="按一下进行游天"
          @click="handleSearchClick"
        />
      </div>
    </div>

    <!-- 右侧区域 -->
    <div class="right-section">
      <!-- 第一行：按钮组 -->
      <div class="action-buttons-section">
        <!-- 聊天按钮 -->
        <button class="action-btn" @click="handleChat" title="聊天">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
          </svg>
        </button>

        <!-- 视频按钮 -->
        <button class="action-btn" @click="handleVideo" title="视频">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
          </svg>
        </button>

        <!-- 音频按钮 -->
        <button class="action-btn" @click="toggleAudio" :class="{ 'active': audioEnabled }" title="音频">
          <svg v-if="audioEnabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
        </button>

        <!-- 设置按钮 -->
        <button class="action-btn" @click="handleSettings" title="设置">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
          </svg>
        </button>

        <!-- 刷新按钮 -->
        <button class="action-btn" @click="handleRefresh" title="刷新">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
          </svg>
        </button>

        <!-- 帮助按钮 -->
        <button class="action-btn" @click="handleHelp" title="帮助">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
          </svg>
        </button>

        <!-- 客服按钮 -->
        <button class="action-btn" @click="handleSupport" title="客服">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1c-4.97 0-9 4.03-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2c0-3.87 3.13-7 7-7s7 3.13 7 7v2h-4v8h3c1.66 0 3-1.34 3-3v-7c0-4.97-4.03-9-9-9z"/>
          </svg>
        </button>

        <!-- 全屏按钮 -->
        <button class="action-btn" @click="toggleFullscreen" :class="{ 'active': isFullscreen }" title="全屏">
          <svg v-if="!isFullscreen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
          </svg>
        </button>
      </div>

      <!-- 第二行：时间显示 -->
      <div class="time-row">
        <div class="time-display">{{ currentTime }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

const audioEnabled = ref(true)
const isFullscreen = ref(false)
const currentTime = ref('')
const isPinned = ref(false)

const tableInfo = computed(() => {
  const minLimit = gameStore.tableInfo?.bjl_xian_hong_zhuang_min || 1
  const maxLimit = gameStore.tableInfo?.bjl_xian_hong_zhuang_max || 25000
  return {
    name: `${gameStore.tableName || 'Table'}`,
    limits: `€${minLimit}-${maxLimit}`
  }
})

const updateTime = () => {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const year = now.getFullYear()
  currentTime.value = `${hours}:${minutes} # ${day}:${month}:${year}`
}

let timer: number | null = null

const handleClose = () => console.log('[TopButtons] Close')
const handleTableClick = () => console.log('[TopButtons] Table Click')
const handlePin = () => {
  isPinned.value = !isPinned.value
  console.log('[TopButtons] Pin:', isPinned.value)
}
const handleSearchClick = () => console.log('[TopButtons] Search Click')
const handleChat = () => console.log('[TopButtons] Chat')
const handleVideo = () => console.log('[TopButtons] Video')
const toggleAudio = () => { audioEnabled.value = !audioEnabled.value }
const handleSettings = () => console.log('[TopButtons] Settings')
const handleRefresh = () => console.log('[TopButtons] Refresh')
const handleHelp = () => console.log('[TopButtons] Help')
const handleSupport = () => console.log('[TopButtons] Support')

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
    isFullscreen.value = true
  } else {
    document.exitFullscreen()
    isFullscreen.value = false
  }
}

const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
.pc-top-buttons {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: auto;
  min-height: 56px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 8px 16px;
  z-index: 50;
}

.left-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.table-info-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.close-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.close-button svg {
  width: 20px;
  height: 20px;
}

.table-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.table-info:hover {
  background: rgba(0, 0, 0, 0.5);
}

.table-name {
  font-size: 14px;
  font-weight: bold;
  color: white;
}

.table-limits {
  font-size: 13px;
  color: #ffd700;
  font-weight: 600;
}

/* 图钉按钮 */
.pin-button {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.pin-button:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

.pin-button.pinned {
  color: #ffd700;
}

.pin-button svg {
  width: 24px;
  height: 24px;
  transform: rotate(315deg);
}

/* 搜索框区域 */
.search-section {
  display: flex;
  align-items: center;
}

.search-input {
  width: 300px;
  height: 36px;
  padding: 0 20px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  color: white;
  font-size: 13px;
  outline: none;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-input:hover {
  background: rgba(0, 0, 0, 0.5);
  border-color: rgba(255, 255, 255, 0.3);
}

.search-input:focus {
  background: rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 215, 0, 0.4);
}

/* 右侧区域 */
.right-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.action-buttons-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.time-row {
  display: flex;
  justify-content: flex-end;
}

.action-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.05);
}

.action-btn.active {
  background: rgba(67, 160, 71, 0.3);
  border-color: rgba(67, 160, 71, 0.5);
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

.time-display {
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  font-family: monospace;
}
</style>
