<template>
  <div class="chip-action-container">
    <div class="chip-action-wrapper">
      <!-- 左侧UNDO按钮 -->
      <div class="action-section left">
        <button
          class="action-button undo-button"
          :class="{ 'disabled': !canUndo }"
          :disabled="!canUndo"
          @click="handleUndo"
        >
          <div class="button-icon">
            <svg viewBox="0 0 24 24" class="icon">
              <path d="M13 6H9V4L4 7l5 3V8h4a4.5 4.5 0 1 1 0 9H5v2h8a6.5 6.5 0 1 0 0-13Z"/>
            </svg>
          </div>
          <span class="button-label">UNDO</span>
        </button>
      </div>

      <!-- 中间插槽区域（用于插入ChipChoose组件） -->
      <div class="content-slot">
        <slot>
          <!-- 默认内容或提示 -->
          <div class="default-content">
            <span>请选择筹码</span>
          </div>
        </slot>
      </div>

      <!-- 右侧DOUBLE按钮 -->
      <div class="action-section right">
        <button
          class="action-button double-button"
          :class="{ 'disabled': !canDouble }"
          :disabled="!canDouble"
          @click="handleDouble"
        >
          <div class="button-icon">
            <svg viewBox="0 0 24 24" class="icon">
              <path d="M12.017 18.881v-1.49l4.63-4.81c.458-.477.841-.92 1.148-1.275l.082-.095c.287-.344.529-.724.72-1.13a2.57 2.57 0 0 0 .25-1.14 2.12 2.12 0 0 0-.33-1.18 2.17 2.17 0 0 0-.87-.77 2.83 2.83 0 0 0-1.25-.27 2.67 2.67 0 0 0-1.29.3 2.21 2.21 0 0 0-.84.85 2.67 2.67 0 0 0-.29 1.29h-2a4.14 4.14 0 0 1 .58-2.19 3.88 3.88 0 0 1 1.58-1.45 4.85 4.85 0 0 1 2.28-.52 4.84 4.84 0 0 1 2.27.51 3.87 3.87 0 0 1 1.55 1.39c.373.6.564 1.294.55 2a4.107 4.107 0 0 1-.28 1.5 6.777 6.777 0 0 1-1 1.62c-.473.593-1.14 1.313-2 2.16l-2.72 2.85v.1h6.16v1.77l-8.93-.02Zm-4.654-8.02L5.061 8.557 4 9.618l2.303 2.303-2.3 2.3 1.06 1.06 2.3-2.3 2.294 2.294 1.06-1.06-2.293-2.294 2.296-2.296-1.06-1.06-2.297 2.295Z"/>
            </svg>
          </div>
          <span class="button-label">DOUBLE</span>
        </button>
      </div>
    </div>

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

// Props
interface Props {
  undoDisabled?: boolean
  doubleDisabled?: boolean
  showToast?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  undoDisabled: false,
  doubleDisabled: false,
  showToast: true
})

// Emits
const emit = defineEmits<{
  'undo': []
  'double': []
}>()

// Stores
const bettingStore = useBettingStore()
const audioSystem = useAudio()

// 状态
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// 计算属性
const canUndo = computed(() => {
  if (props.undoDisabled) return false
  return bettingStore?.canCancel || false
})

const canDouble = computed(() => {
  if (props.doubleDisabled) return false
  const lastBets = bettingStore?.lastBets || {}
  return Object.keys(lastBets).some(key => lastBets[key] > 0)
})

// 处理撤销
const handleUndo = async () => {
  if (!canUndo.value) return

  await playSound()
  bettingStore?.cancelBets?.()
  emit('undo')

  if (props.showToast) {
    showToast('投注已撤销', 'success')
  }
}

// 处理加倍
const handleDouble = async () => {
  if (!canDouble.value) return

  await playSound()
  const success = bettingStore?.repeatLastBets?.()
  emit('double')

  if (props.showToast) {
    if (success) {
      showToast('加倍成功', 'success')
    } else {
      showToast('加倍失败', 'error')
    }
  }
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
  --size: 10px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 8px;
  position: relative;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chip-action-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 600px;
}

/* 动作按钮区域 */
.action-section {
  flex-shrink: 0;
  z-index: 10;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
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
}

.icon {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.button-label {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* 中间内容插槽 */
.content-slot {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 180px;
}

/* 默认内容 */
.default-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
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

/* 响应式 */
@media (max-width: 768px) {
  .chip-action-container {
    --size: 8px;
    height: 160px;
    padding: 6px;
  }

  .action-button {
    min-width: 50px;
    padding: 6px 8px;
  }

  .button-icon {
    width: 20px;
    height: 20px;
  }

  .button-label {
    font-size: 9px;
  }

  .chip-action-wrapper {
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .chip-action-container {
    --size: 7px;
    height: 140px;
  }

  .chip-action-wrapper {
    gap: 8px;
  }
}
</style>
