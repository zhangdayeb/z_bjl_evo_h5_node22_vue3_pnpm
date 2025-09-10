<template>
  <div class="user-bet-container">
    <!-- 主内容区域 -->
    <div class="main-content">
      <!-- 顶部：投注区域 -->
      <div class="betting-area-section">
        <BettingArea />
      </div>

      <!-- 中部：筹码操作栏 -->
      <div class="chip-action-section">
        <ChipAction ref="chipActionRef">
          <!-- 默认显示当前选中的筹码 -->
          <div class="current-chip-display" @click="showChipSelector">
            <div class="chip-preview">
              <svg viewBox="0 0 78 78" class="chip-svg">
                <g>
                  <circle cx="39" cy="39" r="38.5" :fill="currentChipColor"/>
                  <circle cx="39" cy="39" r="25.5" fill="white"/>
                  <text
                    x="50%"
                    y="50%"
                    :font-size="currentChipValue >= 1000 ? 18 : (currentChipValue >= 100 ? 24 : 30)"
                    dy="8"
                    text-anchor="middle"
                    fill="black"
                    font-weight="bold"
                  >
                    {{ currentChipValue }}
                  </text>
                </g>
              </svg>
            </div>
            <div class="chip-hint">点击选择筹码</div>
          </div>
        </ChipAction>
      </div>

      <!-- 底部：统计信息 -->
      <div class="game-count-section">
        <GameCount />
      </div>
    </div>

    <!-- 筹码选择器悬浮层 -->
    <transition name="chip-selector">
      <div v-if="isChipSelectorVisible" class="chip-selector-overlay" @click.self="hideChipSelector">
        <div class="chip-selector-container">
          <ChipSelector
            @change="handleChipChange"
            @cashier="handleCashier"
          />
          <button class="close-button" @click="hideChipSelector">
            <svg viewBox="0 0 24 24" class="close-icon">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <!-- 悬浮按钮 -->
    <div class="floating-buttons">
      <!-- 左下角：设置按钮 -->
      <div class="floating-button-left">
        <ButtonSet
          :active="isSettingsOpen"
          @click="handleSettingsClick"
        />
      </div>

      <!-- 右下角：露珠列表按钮 -->
      <div class="floating-button-right">
        <ButtonLuZhuList
          :active="isLuZhuListOpen"
          @click="handleLuZhuListClick"
        />
      </div>
    </div>

    <!-- 设置面板 -->
    <transition name="panel-slide">
      <div v-if="isSettingsOpen" class="settings-panel">
        <div class="panel-header">
          <h3>设置</h3>
          <button @click="isSettingsOpen = false" class="panel-close">×</button>
        </div>
        <div class="panel-content">
          <!-- 设置选项内容 -->
        </div>
      </div>
    </transition>

    <!-- 露珠列表面板 -->
    <transition name="panel-slide">
      <div v-if="isLuZhuListOpen" class="luzhu-panel">
        <div class="panel-header">
          <h3>露珠列表</h3>
          <button @click="isLuZhuListOpen = false" class="panel-close">×</button>
        </div>
        <div class="panel-content">
          <!-- 露珠内容 -->
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'
import { useUIStore } from '@/stores/uiStore'

// 组件导入
import BettingArea from '@/components/BetArea/BettingArea.vue'
import ChipAction from '@/components/BetArea/ChipAction.vue'
import ChipSelector from '@/components/Panels/ChipSelector.vue'
import GameCount from '@/components/BetArea/GameCount.vue'
import ButtonSet from '@/components/FloatingUI/ButtonSet.vue'
import ButtonLuZhuList from '@/components/FloatingUI/ButtonLuZhuList.vue'

// Stores
const bettingStore = useBettingStore()
const uiStore = useUIStore()

// 筹码选择器相关状态
const isChipSelectorVisible = ref(false)
const chipActionRef = ref()

// 从 store 读取当前筹码值和颜色
const currentChipValue = computed(() => bettingStore.selectedChip)
const currentChipColor = computed(() => bettingStore.selectedChipColor)

// 悬浮按钮状态
const isSettingsOpen = ref(false)
const isLuZhuListOpen = ref(false)

// 显示筹码选择器
const showChipSelector = () => {
  isChipSelectorVisible.value = true
}

// 隐藏筹码选择器
const hideChipSelector = () => {
  isChipSelectorVisible.value = false
}

// 处理筹码选择
const handleChipChange = (chip: any) => {
  console.log('Selected chip:', chip)

  // 选择后自动关闭选择器
  setTimeout(() => {
    hideChipSelector()
  }, 300)

  // 显示toast提示
  chipActionRef.value?.showToast(`已选择 ${chip.name}`, 'success')
}

// 处理CASHIER
const handleCashier = () => {
  console.log('Cashier clicked')
  hideChipSelector()

  // 这里可以添加跳转到充值页面的逻辑
  chipActionRef.value?.showToast('即将跳转到充值页面', 'success')
}

// 处理设置按钮点击
const handleSettingsClick = () => {
  isSettingsOpen.value = !isSettingsOpen.value
  // 关闭露珠列表
  if (isSettingsOpen.value) {
    isLuZhuListOpen.value = false
  }
}

// 处理露珠列表按钮点击
const handleLuZhuListClick = () => {
  isLuZhuListOpen.value = !isLuZhuListOpen.value
  // 关闭设置面板
  if (isLuZhuListOpen.value) {
    isSettingsOpen.value = false
  }
}
</script>

<style scoped>
.user-bet-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.9) 100%
  );
  overflow: hidden;
}

/* 主内容区域 */
.main-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 投注区域 */
.betting-area-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 筹码操作栏 */
.chip-action-section {
  flex-shrink: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* 当前筹码显示 */
.current-chip-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  padding: 20px;
  transition: transform 0.3s ease;
}

.current-chip-display:hover {
  transform: scale(1.05);
}

.chip-preview {
  width: 60px;
  height: 60px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.chip-svg {
  width: 100%;
  height: 100%;
}

.chip-hint {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  transition: color 0.3s ease;
}

.current-chip-display:hover .chip-hint {
  color: rgba(255, 255, 255, 0.8);
}

/* 统计信息区域 */
.game-count-section {
  flex-shrink: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 筹码选择器悬浮层 */
.chip-selector-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.chip-selector-container {
  position: relative;
  background: rgba(26, 26, 26, 0.95);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  max-width: 90%;
  max-height: 80%;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.close-icon {
  width: 20px;
  height: 20px;
  fill: white;
}

/* 悬浮按钮容器 */
.floating-buttons {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  z-index: 500;
}

.floating-button-left {
  position: absolute;
  bottom: 20px;
  left: 20px;
  pointer-events: auto;
}

.floating-button-right {
  position: absolute;
  bottom: 20px;
  right: 20px;
  pointer-events: auto;
}

/* 面板样式 */
.settings-panel,
.luzhu-panel {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 320px;
  background: rgba(26, 26, 26, 0.98);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  z-index: 600;
  display: flex;
  flex-direction: column;
}

.settings-panel {
  left: 0;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.luzhu-panel {
  right: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  color: white;
  font-size: 18px;
  margin: 0;
}

.panel-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.panel-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

.panel-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

/* 动画过渡 */
.chip-selector-enter-active,
.chip-selector-leave-active {
  transition: all 0.3s ease;
}

.chip-selector-enter-from,
.chip-selector-leave-to {
  opacity: 0;
}

.chip-selector-enter-from .chip-selector-container,
.chip-selector-leave-to .chip-selector-container {
  transform: scale(0.8);
}

.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: transform 0.3s ease;
}

.panel-slide-enter-from.settings-panel,
.panel-slide-leave-to.settings-panel {
  transform: translateX(-100%);
}

.panel-slide-enter-from.luzhu-panel,
.panel-slide-leave-to.luzhu-panel {
  transform: translateX(100%);
}

/* 滚动条样式 */
.betting-area-section::-webkit-scrollbar,
.panel-content::-webkit-scrollbar {
  width: 6px;
}

.betting-area-section::-webkit-scrollbar-track,
.panel-content::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.betting-area-section::-webkit-scrollbar-thumb,
.panel-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.betting-area-section::-webkit-scrollbar-thumb:hover,
.panel-content::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .betting-area-section {
    padding: 8px;
  }

  .floating-button-left {
    bottom: 15px;
    left: 15px;
  }

  .floating-button-right {
    bottom: 15px;
    right: 15px;
  }

  .settings-panel,
  .luzhu-panel {
    width: 280px;
  }

  .chip-preview {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .betting-area-section {
    padding: 6px;
  }

  .floating-button-left {
    bottom: 10px;
    left: 10px;
  }

  .floating-button-right {
    bottom: 10px;
    right: 10px;
  }

  .settings-panel,
  .luzhu-panel {
    width: 100%;
  }

  .chip-selector-container {
    max-width: 95%;
    padding: 15px;
  }

  .chip-preview {
    width: 45px;
    height: 45px;
  }

  .current-chip-display {
    padding: 15px;
  }
}

/* 安全区域适配 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .floating-button-left,
  .floating-button-right {
    bottom: calc(20px + env(safe-area-inset-bottom));
  }

  .game-count-section {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
