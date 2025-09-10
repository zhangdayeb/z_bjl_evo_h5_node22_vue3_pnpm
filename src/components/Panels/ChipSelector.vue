<template>
  <div class="chip-choose-container" @click="toggleExpanded">
    <div class="revolver-container">
      <!-- 筹码列表 -->
      <ul class="chip-list">
        <li
          v-for="(chip, index) in chips"
          :key="chip.value"
          class="chip-item"
          :class="getChipClass(index)"
          :style="getChipStyle(index)"
          @click.stop="selectChip(chip, index)"
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
          :class="{ 'hidden': !isExpanded }"
          :style="getCashierStyle()"
          @click.stop="handleCashier"
        >
          <div class="cashier-button">
            <svg viewBox="0 0 24 24" class="cashier-icon">
              <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm2.77 8.02-.36 1.51H9.16v.83h5.13l-.36 1.51H9.35c.25.88.72 1.51 1.43 1.94.56.31 1.18.47 1.86.47.93 0 1.65-.22 2.12-.66l.42-.39v2.25l-.15.06c-.73.31-1.5.47-2.27.47-2.51 0-4.16-.94-5.05-2.88a6.39 6.39 0 0 1-.39-1.19H5.99l.36-1.51h.79v-.83H6.05l.36-1.51h.9c.35-1.52 1.25-2.69 2.62-3.38.87-.46 1.86-.7 2.94-.7.98 0 1.88.22 2.6.65l.17.1-.52 1.76-.29-.22a3.26 3.26 0 0 0-2.02-.68c-.81 0-1.5.19-2.09.57-.31.19-.59.48-.89.94-.2.3-.35.61-.44.9h5.37l.01-.01Z"/>
            </svg>
            <span class="cashier-text">CASHIER</span>
          </div>
        </li>
      </ul>

      <!-- 点击提示 -->
      <div class="click-hint" :class="{ 'hidden': isExpanded }">
        点击展开更多筹码
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'
import { useUIStore } from '@/stores/uiStore'
import { useAudio } from '@/services/Audio'

interface Chip {
  value: number
  color: string
  name: string
}

// Props
interface Props {
  modelValue?: number
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 100
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: number]
  'change': [chip: Chip]
  'cashier': []
}>()

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
const selectedChip = ref(props.modelValue)
const selectedIndex = ref(4) // 默认选中100的索引
const isExpanded = ref(false)

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  selectedChip.value = newValue
  const index = chips.value.findIndex(c => c.value === newValue)
  if (index !== -1) {
    selectedIndex.value = index
  }
})

// 获取筹码的类名
const getChipClass = (index: number) => {
  if (!isExpanded.value) {
    const relativeIndex = index - selectedIndex.value

    // 循环索引处理
    let adjustedIndex = relativeIndex
    if (relativeIndex < -4) adjustedIndex += chips.value.length
    if (relativeIndex > 4) adjustedIndex -= chips.value.length

    if (adjustedIndex === 0) return 'center'
    if (adjustedIndex === -1 || (selectedIndex.value === 0 && index === chips.value.length - 1)) {
      return 'partial-left'
    }
    if (adjustedIndex === 1 || (selectedIndex.value === chips.value.length - 1 && index === 0)) {
      return 'partial-right'
    }
    return 'hidden'
  }
  return ''
}

// 获取筹码样式
const getChipStyle = (index: number) => {
  const style: any = {}

  if (!isExpanded.value) {
    // 收起状态
    const relativeIndex = index - selectedIndex.value
    let adjustedIndex = relativeIndex

    // 处理循环索引
    if (relativeIndex < -4) adjustedIndex += chips.value.length
    if (relativeIndex > 4) adjustedIndex -= chips.value.length

    if (adjustedIndex === 0) {
      // 中心位置
      style.transform = `translate3d(0, 0, 0)`
      style.zIndex = 5
    } else if (adjustedIndex === -1 || (selectedIndex.value === 0 && index === chips.value.length - 1)) {
      // 左侧位置
      style.transform = `translate3d(calc(var(--size, 10px) * -3.5), 0, 0)`
      style.zIndex = 3
    } else if (adjustedIndex === 1 || (selectedIndex.value === chips.value.length - 1 && index === 0)) {
      // 右侧位置
      style.transform = `translate3d(calc(var(--size, 10px) * 3.5), 0, 0)`
      style.zIndex = 3
    }
  } else {
    // 展开状态 - 半圆形布局
    const positions = [
      { x: -8.8199, y: 1.7912 },  // 1
      { x: -8.7368, y: -2.1605 }, // 2
      { x: -6.9685, y: -5.6956 }, // 5
      { x: -3.8562, y: -8.1320 }, // 25
      { x: 0, y: -9.0000 },        // 100
      { x: 3.8562, y: -8.1320 },  // 500
      { x: 6.9685, y: -5.6956 },  // 1000
      { x: 8.7368, y: -2.1605 }   // 5000
    ]

    const pos = positions[index]
    style.transform = `translate3d(calc(var(--size, 10px) * ${pos.x}), calc(var(--size, 10px) * ${pos.y}), 0)`
    style['--x'] = `calc(var(--size, 10px) * ${pos.x})`
    style['--y'] = `calc(var(--size, 10px) * ${pos.y})`
  }

  return style
}

// 获取CASHIER按钮样式
const getCashierStyle = () => {
  if (isExpanded.value) {
    return {
      transform: `translate3d(calc(var(--size, 10px) * 8.8199), calc(var(--size, 10px) * 1.7912), 0)`
    }
  }
  return {}
}

// 切换展开/收起
const toggleExpanded = () => {
  if (!isExpanded.value) {
    isExpanded.value = true
    playSound()
  }
}

// 选择筹码
const selectChip = async (chip: Chip, index: number) => {
  if (!isExpanded.value) {
    // 如果是收起状态，先展开
    isExpanded.value = true
    await playSound()
    return
  }

  selectedChip.value = chip.value
  selectedIndex.value = index

  // 播放音效
  await playSound()

  // 同步到store
  bettingStore?.selectChip?.(chip.value)

  // 发送事件
  emit('update:modelValue', chip.value)
  emit('change', chip)

  // 选择后自动收起
  setTimeout(() => {
    isExpanded.value = false
  }, 300)
}

// 处理CASHIER
const handleCashier = async () => {
  await playSound()

  emit('cashier')

  // 选择后收起
  setTimeout(() => {
    isExpanded.value = false
  }, 300)
}

// 播放音效
const playSound = async () => {
  try {
    await audioSystem?.playAudioFile?.('click.mp3')
  } catch (error) {
    console.warn('播放音效失败:', error)
  }
}

// 生命周期
onMounted(() => {
  // 初始化选中筹码
  const storeChip = bettingStore?.selectedChip
  if (storeChip) {
    selectedChip.value = storeChip
    const index = chips.value.findIndex(c => c.value === storeChip)
    if (index !== -1) {
      selectedIndex.value = index
    }
  }
})
</script>

<style scoped>
.chip-choose-container {
  --size: 10px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 180px;
  cursor: pointer;
}

.revolver-container {
  position: relative;
  width: calc(var(--size) * 20);
  height: calc(var(--size) * 20);
}

/* 筹码列表 */
.chip-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: absolute;
  width: calc(var(--size) * 18);
  height: calc(var(--size) * 18);
  top: calc(var(--size) * -8.35);
  left: calc(var(--size) * -6.8);
}

.chip-item {
  position: absolute;
  width: calc(var(--size) * 3.2);
  height: calc(var(--size) * 3.2);
  top: calc(var(--size) * 7.4);
  left: calc(var(--size) * 7.4);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

/* 隐藏的筹码 */
.chip-item.hidden {
  opacity: 0;
  pointer-events: none;
  transform: translate3d(0, 0, 0) scale(0.3);
}

/* 部分显示的筹码 */
.chip-item.partial-left {
  clip-path: inset(0 0 0 50%);
  opacity: 0.7;
}

.chip-item.partial-right {
  clip-path: inset(0 50% 0 0);
  opacity: 0.7;
}

/* 中心筹码 */
.chip-item.center {
  z-index: 5;
}

/* 展开状态的hover效果 */
.chip-item:not(.hidden):not(.partial-left):not(.partial-right):hover {
  z-index: 10;
  transform: translate3d(var(--x), var(--y), 0) scale(1.1);
}

.chip {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4));
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
  width: calc(var(--size) * 3.2);
  height: calc(var(--size) * 3.2);
  top: calc(var(--size) * 7.4);
  left: calc(var(--size) * 7.4);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.cashier-item.hidden {
  opacity: 0;
  pointer-events: none;
  transform: translate3d(0, 0, 0) scale(0.3);
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

/* 点击提示 */
.click-hint {
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
  transition: opacity 0.3s ease;
  white-space: nowrap;
}

.click-hint.hidden {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .chip-choose-container {
    --size: 8px;
    height: 160px;
  }
}

@media (max-width: 480px) {
  .chip-choose-container {
    --size: 7px;
    height: 140px;
  }
}
</style>
