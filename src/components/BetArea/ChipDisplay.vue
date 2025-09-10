<template>
  <div class="chipstack-container">
    <div class="chipstack-wrapper">
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

      <!-- 中间筹码转盘区域 -->
      <div class="revolver-wrapper">
        <div class="revolver-container" :style="revolverStyle">
          <!-- 遮罩层 -->
          <div class="revolver-overlay"></div>

          <!-- 筹码列表 -->
          <ul class="chip-list">
            <li
              v-for="(chip, index) in chips"
              :key="chip.value"
              class="chip-item"
              :class="{ 'active': selectedChip === chip.value }"
              :style="getChipStyle(index)"
              @click="selectChip(chip)"
            >
              <div class="chip" :data-value="chip.value">
                <svg viewBox="0 0 78 78" class="chip-svg">
                  <g>
                    <circle class="chip-outer" cx="39" cy="39" r="38.5" :fill="chip.color"/>
                    <circle class="chip-inner" cx="39" cy="39" r="25.5" fill="white"/>
                    <text
                      class="chip-value"
                      x="50%"
                      y="50%"
                      :font-size="chip.value >= 1000 ? 18 : (chip.value >= 100 ? 24 : 30)"
                      dy="8"
                      text-anchor="middle"
                      fill="black"
                    >
                      {{ chip.value }}
                    </text>
                  </g>
                </svg>
              </div>
            </li>

            <!-- CASHIER按钮 -->
            <li
              class="cashier-item"
              :style="getCashierStyle()"
              @click="handleCashier"
            >
              <div class="cashier-button">
                <svg viewBox="0 0 24 24" class="cashier-icon">
                  <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm2.77 8.02-.36 1.51H9.16v.83h5.13l-.36 1.51H9.35c.25.88.72 1.51 1.43 1.94.56.31 1.18.47 1.86.47.93 0 1.65-.22 2.12-.66l.42-.39v2.25l-.15.06c-.73.31-1.5.47-2.27.47-2.51 0-4.16-.94-5.05-2.88a6.39 6.39 0 0 1-.39-1.19H5.99l.36-1.51h.79v-.83H6.05l.36-1.51h.9c.35-1.52 1.25-2.69 2.62-3.38.87-.46 1.86-.7 2.94-.7.98 0 1.88.22 2.6.65l.17.1-.52 1.76-.29-.22a3.26 3.26 0 0 0-2.02-.68c-.81 0-1.5.19-2.09.57-.31.19-.59.48-.89.94-.2.3-.35.61-.44.9h5.37l.01-.01Z"/>
                </svg>
                <span class="cashier-text">CASHIER</span>
              </div>
            </li>
          </ul>

          <!-- 选中筹码显示 -->
          <div class="selected-chip-container">
            <div class="selected-border">
              <svg viewBox="0 0 52 52" fill="none">
                <defs>
                  <linearGradient id="borderGradient" x1="0" y1="52" x2="52" y2="0">
                    <stop offset="0.26" stop-color="#F7EAA3"/>
                    <stop offset="0.51" stop-color="#C29740"/>
                    <stop offset="0.76" stop-color="#FEF8B9"/>
                  </linearGradient>
                </defs>
                <circle cx="26" cy="26" r="25" stroke="url(#borderGradient)" stroke-width="2"/>
              </svg>
            </div>
            <div class="selected-chip">
              <svg viewBox="0 0 78 78" class="chip-svg">
                <g>
                  <circle class="chip-outer" cx="39" cy="39" r="38.5" :fill="currentChipColor"/>
                  <circle class="chip-inner" cx="39" cy="39" r="25.5" fill="white"/>
                  <text
                    class="chip-value"
                    x="50%"
                    y="50%"
                    :font-size="selectedChip >= 1000 ? 18 : (selectedChip >= 100 ? 24 : 30)"
                    dy="8"
                    text-anchor="middle"
                    fill="black"
                  >
                    {{ selectedChip }}
                  </text>
                </g>
              </svg>
            </div>
          </div>
        </div>
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
import { ref, computed, onMounted } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'
import { useUIStore } from '@/stores/uiStore'
import { useAudio } from '@/services/Audio'

interface Chip {
  value: number
  color: string
  name: string
}

// Stores
const bettingStore = useBettingStore()
const uiStore = useUIStore()
const audioSystem = useAudio()

// 筹码数据
const chips = ref<Chip[]>([
  { value: 1, color: '#595959', name: '€1' },
  { value: 2, color: '#ff82d6', name: '€2' },
  { value: 5, color: '#ce1d00', name: '€5' },
  { value: 25, color: '#05ae29', name: '€25' },
  { value: 100, color: '#1a1a1a', name: '€100' },
  { value: 500, color: '#8548b0', name: '€500' },
  { value: 1000, color: '#de9807', name: '€1000' },
  { value: 5000, color: '#de7571', name: '€5000' }
])

// 状态
const selectedChip = ref(1)
const revolverAngle = ref(0)
const isAnimating = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

// 计算属性
const canUndo = computed(() => bettingStore?.canCancel || false)
const canDouble = computed(() => {
  const lastBets = bettingStore?.lastBets || {}
  return Object.keys(lastBets).some(key => lastBets[key] > 0)
})

const currentChipColor = computed(() => {
  const chip = chips.value.find(c => c.value === selectedChip.value)
  return chip?.color || '#595959'
})

const revolverStyle = computed(() => ({
  transform: `rotate(${revolverAngle.value}deg)`,
  transition: isAnimating.value ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
}))

// 方法
const getChipStyle = (index: number) => {
  const angle = (index * 45) // 8个筹码，每个45度
  const radius = 85 // 半径
  const radian = (angle * Math.PI) / 180
  const x = Math.cos(radian) * radius
  const y = Math.sin(radian) * radius

  return {
    transform: `translate(${x}px, ${y}px)`,
    '--chip-angle': `${-angle}deg`
  }
}

const getCashierStyle = () => {
  // CASHIER按钮位置（在最后一个筹码旁边）
  const angle = 315 // 315度位置
  const radius = 85
  const radian = (angle * Math.PI) / 180
  const x = Math.cos(radian) * radius
  const y = Math.sin(radian) * radius

  return {
    transform: `translate(${x}px, ${y}px)`
  }
}

const selectChip = async (chip: Chip) => {
  if (selectedChip.value === chip.value) return

  selectedChip.value = chip.value

  // 计算旋转角度，让选中的筹码转到顶部
  const chipIndex = chips.value.findIndex(c => c.value === chip.value)
  const targetAngle = -chipIndex * 45

  isAnimating.value = true
  revolverAngle.value = targetAngle

  // 播放音效
  await playSound()

  // 同步到store
  bettingStore?.selectChip?.(chip.value)

  setTimeout(() => {
    isAnimating.value = false
  }, 500)
}

const handleUndo = async () => {
  if (!canUndo.value) return

  await playSound()
  bettingStore?.cancelBets?.()
  showToast('投注已撤销', 'success')
}

const handleDouble = async () => {
  if (!canDouble.value) return

  await playSound()
  const success = bettingStore?.repeatLastBets?.()

  if (success) {
    showToast('加倍成功', 'success')
  } else {
    showToast('加倍失败', 'error')
  }
}

const handleCashier = async () => {
  await playSound()
  uiStore?.openCashier?.()
  showToast('打开收银台', 'success')
}

const playSound = async () => {
  try {
    await audioSystem?.playAudioFile?.('click.mp3')
  } catch (error) {
    console.warn('播放音效失败:', error)
  }
}

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  toastType.value = type

  setTimeout(() => {
    toastMessage.value = ''
  }, 2000)
}

// 生命周期
onMounted(() => {
  // 初始化选中筹码
  const storeChip = bettingStore?.selectedChip
  if (storeChip) {
    selectedChip.value = storeChip
  }
})
</script>

<style scoped>
.chipstack-container {
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

.chipstack-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 600px;
}

/* 动作按钮区域 */
.action-section {
  flex-shrink: 0;
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

/* 转盘容器 */
.revolver-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 180px;
}

.revolver-container {
  position: relative;
  width: 180px;
  height: 180px;
}

.revolver-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* 筹码列表 */
.chip-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  width: 100%;
  height: 100%;
}

.chip-item {
  position: absolute;
  width: 48px;
  height: 48px;
  top: 50%;
  left: 50%;
  margin: -24px 0 0 -24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chip-item:hover {
  transform: translate(var(--x), var(--y)) scale(1.1);
  z-index: 10;
}

.chip-item.active {
  transform: translate(var(--x), var(--y)) scale(1.2);
  filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.6));
}

.chip {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.chip-svg {
  width: 100%;
  height: 100%;
}

.chip-outer {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.chip-value {
  font-weight: bold;
  fill: black;
}

/* CASHIER按钮 */
.cashier-item {
  position: absolute;
  width: 56px;
  height: 56px;
  top: 50%;
  left: 50%;
  margin: -28px 0 0 -28px;
  cursor: pointer;
}

.cashier-button {
  width: 100%;
  height: 100%;
  background: rgba(24, 144, 255, 0.15);
  border: 2px solid rgba(24, 144, 255, 0.3);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  transition: all 0.3s ease;
}

.cashier-button:hover {
  background: rgba(24, 144, 255, 0.25);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
}

.cashier-icon {
  width: 24px;
  height: 24px;
  fill: #40a9ff;
}

.cashier-text {
  font-size: 8px;
  font-weight: 600;
  color: #40a9ff;
  text-transform: uppercase;
}

/* 选中筹码显示 */
.selected-chip-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 52px;
  height: 52px;
  pointer-events: none;
}

.selected-border {
  position: absolute;
  inset: -2px;
  animation: borderRotate 3s linear infinite;
}

.selected-chip {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

@keyframes borderRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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
  .chipstack-container {
    height: 160px;
    padding: 6px;
  }

  .revolver-container {
    width: 140px;
    height: 140px;
  }

  .chip-item {
    width: 40px;
    height: 40px;
    margin: -20px 0 0 -20px;
  }

  .selected-chip-container {
    width: 44px;
    height: 44px;
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
}

@media (max-width: 480px) {
  .chipstack-container {
    height: 140px;
  }

  .chipstack-wrapper {
    gap: 8px;
  }

  .revolver-container {
    width: 120px;
    height: 120px;
  }

  .chip-item {
    width: 36px;
    height: 36px;
    margin: -18px 0 0 -18px;
  }
}
</style>
