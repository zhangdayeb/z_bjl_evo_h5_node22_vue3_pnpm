<template>
  <div class="chip-action-container">
    <div class="chip-action-wrapper">
      <!-- UNDO按钮 -->
      <button
        class="action-button undo-button"
        :class="{ 'disabled': !canUndo }"
        :disabled="!canUndo"
        @click="handleUndo"
      >
        <svg viewBox="0 0 24 24" class="button-icon">
          <path d="M13 6H9V4L4 7l5 3V8h4a4.5 4.5 0 1 1 0 9H5v2h8a6.5 6.5 0 1 0 0-13Z"/>
        </svg>
        <span class="button-label">UNDO</span>
      </button>

      <!-- 中间筹码显示 -->
      <div class="chip-display" @click="showChipSelector">
        <div class="chip-wrapper">
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

      <!-- DOUBLE按钮 -->
      <button
        class="action-button double-button"
        :class="{ 'disabled': !canDouble }"
        :disabled="!canDouble"
        @click="handleDouble"
      >
        <svg viewBox="0 0 24 24" class="button-icon">
          <path d="M12.017 18.881v-1.49l4.63-4.81c.458-.477.841-.92 1.148-1.275l.082-.095c.287-.344.529-.724.72-1.13a2.57 2.57 0 0 0 .25-1.14 2.12 2.12 0 0 0-.33-1.18 2.17 2.17 0 0 0-.87-.77 2.83 2.83 0 0 0-1.25-.27 2.67 2.67 0 0 0-1.29.3 2.21 2.21 0 0 0-.84.85 2.67 2.67 0 0 0-.29 1.29h-2a4.14 4.14 0 0 1 .58-2.19 3.88 3.88 0 0 1 1.58-1.45 4.85 4.85 0 0 1 2.28-.52 4.84 4.84 0 0 1 2.27.51 3.87 3.87 0 0 1 1.55 1.39c.373.6.564 1.294.55 2a4.107 4.107 0 0 1-.28 1.5 6.777 6.777 0 0 1-1 1.62c-.473.593-1.14 1.313-2 2.16l-2.72 2.85v.1h6.16v1.77l-8.93-.02Zm-4.654-8.02L5.061 8.557 4 9.618l2.303 2.303-2.3 2.3 1.06 1.06 2.3-2.3 2.294 2.294 1.06-1.06-2.293-2.294 2.296-2.296-1.06-1.06-2.297 2.295Z"/>
        </svg>
        <span class="button-label">DOUBLE</span>
      </button>
    </div>

    <!-- 筹码选择器弹窗 -->
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

    <!-- Toast提示 -->
    <transition name="toast">
      <div v-if="toastMessage" class="toast" :class="toastType">
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'
import { useAudio } from '@/services/Audio'
import ChipSelector from '@/components/Panels/ChipSelector.vue'

// Stores
const bettingStore = useBettingStore()
const audioSystem = useAudio()

// 状态
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const isChipSelectorVisible = ref(false)

// 从 store 获取当前筹码信息
const currentChipValue = computed(() => bettingStore.selectedChip)
const currentChipColor = computed(() => bettingStore.selectedChipColor)

// 计算属性 - 直接从 store 获取
const canUndo = computed(() => bettingStore.canCancel)
const canDouble = computed(() => bettingStore.hasLastRoundData)

// 显示筹码选择器
const showChipSelector = () => {
  isChipSelectorVisible.value = true
  playSound()
}

// 隐藏筹码选择器
const hideChipSelector = () => {
  isChipSelectorVisible.value = false
}

// 处理筹码选择
const handleChipChange = (chip: any) => {
  console.log('Selected chip:', chip)

  // 更新 store 中的筹码
  // bettingStore.setSelectedChip(chip)

  // 选择后自动关闭选择器
  setTimeout(() => {
    hideChipSelector()
  }, 300)

  showToast(`已选择 ${chip.name}`, 'success')
}

// 处理CASHIER
const handleCashier = () => {
  console.log('Cashier clicked')
  hideChipSelector()
  showToast('即将跳转到充值页面', 'success')
}

// 处理撤销
const handleUndo = async () => {
  if (!canUndo.value) return

  await playSound()
  bettingStore.cancelBets()
  showToast('投注已撤销', 'success')
}

// 处理加倍
const handleDouble = async () => {
  if (!canDouble.value) return

  await playSound()
  const success = bettingStore.repeatLastBets()
  showToast(success ? '加倍成功' : '加倍失败', success ? 'success' : 'error')
}

// 播放音效
const playSound = async () => {
  try {
    await audioSystem?.playAudioFile?.('click.mp3')
  } catch (error) {
    console.warn('播放音效失败:', error)
  }
}

// 显示提示
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  toastType.value = type

  setTimeout(() => {
    toastMessage.value = ''
  }, 2000)
}

// 暴露方法供外部调用
defineExpose({
  showToast
})
</script>

<style scoped>
.chip-action-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  padding: 10px;
}

.chip-action-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 400px;
}

/* 动作按钮样式 */
.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 70px;
}

.action-button:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.action-button.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.button-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}

.button-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 中间筹码显示 */
.chip-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  transition: transform 0.3s ease;
}

.chip-display:hover {
  transform: scale(1.05);
}

.chip-wrapper {
  width: 60px;
  height: 60px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.chip-svg {
  width: 100%;
  height: 100%;
}

/* 筹码选择器弹窗 */
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

/* Toast提示 */
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.toast.success {
  border-left: 4px solid #52c41a;
}

.toast.error {
  border-left: 4px solid #ff4d4f;
}

/* 过渡动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -40%);
}

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

/* 响应式 */
@media (max-width: 768px) {
  .chip-action-wrapper {
    gap: 15px;
  }

  .action-button {
    min-width: 60px;
    padding: 8px 12px;
  }

  .button-icon {
    width: 20px;
    height: 20px;
  }

  .button-label {
    font-size: 10px;
  }

  .chip-wrapper {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .chip-action-wrapper {
    gap: 12px;
  }

  .action-button {
    min-width: 55px;
    padding: 6px 10px;
  }

  .chip-wrapper {
    width: 45px;
    height: 45px;
  }

  .chip-hint {
    font-size: 10px;
  }
}
</style>
