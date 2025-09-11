<template>
  <div class="chip-action-container">
    <!-- UNDO 区域：文字在左，按钮在右 -->
    <div class="action-group left" :class="{ 'disabled': !canUndo }">
      <span class="action-label">UNDO</span>
      <button
        class="action-button"
        :disabled="!canUndo"
        @click="handleUndo"
      >
        <svg viewBox="0 0 24 24" class="button-icon">
          <path d="M13 6H9V4L4 7l5 3V8h4a4.5 4.5 0 1 1 0 9H5v2h8a6.5 6.5 0 1 0 0-13Z"/>
        </svg>
      </button>
    </div>

    <!-- 中间筹码 -->
    <div class="chip-display">
      <svg viewBox="0 0 78 78" class="chip-svg">
        <g>
          <circle cx="39" cy="39" r="38.5" :fill="currentChipColor"/>
          <path d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"
                fill="rgba(0,0,0,0.2)"/>
          <circle cx="39" cy="39" r="25.5" fill="white"/>
          <text
            x="50%"
            y="50%"
            :font-size="chipFontSize"
            dy="7"
            text-anchor="middle"
            fill="black"
            font-weight="bold"
          >
            {{ currentChipValue }}
          </text>
        </g>
      </svg>
    </div>

    <!-- DOUBLE 区域：按钮在左，文字在右 -->
    <div class="action-group right" :class="{ 'disabled': !canDouble }">
      <button
        class="action-button"
        :disabled="!canDouble"
        @click="handleDouble"
      >
        <svg viewBox="0 0 24 24" class="button-icon">
          <path d="M12.017 18.881v-1.49l4.63-4.81c.458-.477.841-.92 1.148-1.275l.082-.095c.287-.344.529-.724.72-1.13a2.57 2.57 0 0 0 .25-1.14 2.12 2.12 0 0 0-.33-1.18 2.17 2.17 0 0 0-.87-.77 2.83 2.83 0 0 0-1.25-.27 2.67 2.67 0 0 0-1.29.3 2.21 2.21 0 0 0-.84.85 2.67 2.67 0 0 0-.29 1.29h-2a4.14 4.14 0 0 1 .58-2.19 3.88 3.88 0 0 1 1.58-1.45 4.85 4.85 0 0 1 2.28-.52 4.84 4.84 0 0 1 2.27.51 3.87 3.87 0 0 1 1.55 1.39c.373.6.564 1.294.55 2a4.107 4.107 0 0 1-.28 1.5 6.777 6.777 0 0 1-1 1.62c-.473.593-1.14 1.313-2 2.16l-2.72 2.85v.1h6.16v1.77l-8.93-.02Zm-4.654-8.02L5.061 8.557 4 9.618l2.303 2.303-2.3 2.3 1.06 1.06 2.3-2.3 2.294 2.294 1.06-1.06-2.293-2.294 2.296-2.296-1.06-1.06-2.297 2.295Z"/>
        </svg>
      </button>
      <span class="action-label">DOUBLE</span>
    </div>

    <!-- Toast提示 -->
    <transition name="toast">
      <div v-if="toastMessage" class="toast" :class="toastType">
        {{ toastMessage }}
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'
import { useAudio } from '@/services/Audio'

// Stores
const bettingStore = useBettingStore()
const audioSystem = useAudio()

// 状态
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// 从 store 获取当前筹码信息
const currentChipValue = computed(() => bettingStore.selectedChip || 5000)
const currentChipColor = computed(() => {
  const value = currentChipValue.value
  // 根据筹码值返回对应颜色
  if (value === 1) return '#595959'
  if (value === 2) return '#ff82d6'
  if (value === 5) return '#ce1d00'
  if (value === 25) return '#05ae29'
  if (value === 100) return '#1a1a1a'
  if (value === 500) return '#8548b0'
  if (value === 1000) return '#de9807'
  if (value === 5000) return '#de7571'
  return '#8548b0' // 默认紫色
})

// 根据筹码值计算字体大小
const chipFontSize = computed(() => {
  const value = currentChipValue.value
  if (value >= 1000) return 14
  if (value >= 100) return 18
  return 22
})

// 计算属性
const canUndo = computed(() => bettingStore.canCancel)
const canDouble = computed(() => bettingStore.hasLastRoundData)

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

defineExpose({
  showToast
})
</script>

<style scoped>
/* 主容器 - 固定高度45px，无边距，100%宽度 */
.chip-action-container {
  width: 100%;
  height: 45px;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  background: linear-gradient(135deg,
    rgba(45, 25, 15, 0.98) 0%,
    rgba(61, 37, 20, 0.98) 100%
  );
  position: relative;
  box-sizing: border-box;
}

/* 动作组 - 横向布局 */
.action-group {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 100%;
  padding: 8px 0;
}

/* 按钮样式 - 适应容器高度 */
.action-button {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: linear-gradient(135deg,
    rgba(184, 134, 11, 0.3) 0%,
    rgba(218, 165, 32, 0.2) 100%
  );
  border: 1px solid rgba(255, 215, 0, 0.4);
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0;
}

.action-button:hover:not(:disabled) {
  background: linear-gradient(135deg,
    rgba(184, 134, 11, 0.4) 0%,
    rgba(218, 165, 32, 0.3) 100%
  );
  border-color: rgba(255, 215, 0, 0.6);
  transform: scale(1.05);
}

.action-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.button-icon {
  width: 100%;
  height: 100%;
  fill: #ffd700;
}

/* 标签文字 */
.action-label {
  font-size: 11px;
  font-weight: 700;
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  margin: 0;
  padding: 0;
  line-height: 1;
}

/* 禁用状态 */
.action-group.disabled .action-button {
  background: rgba(128, 128, 128, 0.2);
  border-color: rgba(128, 128, 128, 0.3);
}

.action-group.disabled .button-icon {
  fill: #666;
}

.action-group.disabled .action-label {
  color: #666;
}

/* 中间筹码 - 适应容器高度 */
.chip-display {
  width: 40px;
  height: 40px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  display: flex;
  align-items: center;
  justify-content: center;
}

.chip-svg {
  width: 100%;
  height: 100%;
}

/* Toast提示 */
.toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #2d1810 0%, #3d2514 100%);
  color: #ffd700;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 215, 0, 0.2);
}

/* 动画 */
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}

/* 移除所有响应式设计 - 保持固定尺寸 */
</style>
