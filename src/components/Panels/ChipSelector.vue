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
            <svg viewBox="0 0 78 78" class="chip-graphics" :style="`color: ${chip.color};`">
              <g>
                <circle class="paint" cx="39.019" cy="38.999" r="38.5"></circle>
                <path class="body" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
                <circle class="textBackground" cx="39" cy="38.997" r="25.5"></circle>
                <path class="body" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
              </g>
              <text
                class="value"
                x="50%"
                y="50%"
                :font-size="chip.fontSize"
                :dy="chip.dy"
              >
                {{ chip.value }}
              </text>
            </svg>
          </div>
        </li>

        <!-- CASHIER按钮 -->
        <li
          v-if="showCashier"
          class="cashier-item"
          :style="getCashierStyle()"
          @click.stop="handleCashier"
        >
          <div class="cashier-button">
            <svg viewBox="0 0 100 100" class="iconWrapper">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon" height="75%" y="12.5%" opacity="80%">
                <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm2.77 8.02-.36 1.51H9.16v.83h5.13l-.36 1.51H9.35c.25.88.72 1.51 1.43 1.94.56.31 1.18.47 1.86.47.93 0 1.65-.22 2.12-.66l.42-.39v2.25l-.15.06c-.73.31-1.5.47-2.27.47-2.51 0-4.16-.94-5.05-2.88a6.39 6.39 0 0 1-.39-1.19H5.99l.36-1.51h.79v-.83H6.05l.36-1.51h.9c.35-1.52 1.25-2.69 2.62-3.38.87-.46 1.86-.7 2.94-.7.98 0 1.88.22 2.6.65l.17.1-.52 1.76-.29-.22a3.26 3.26 0 0 0-2.02-.68c-.81 0-1.5.19-2.09.57-.31.19-.59.48-.89.94-.2.3-.35.61-.44.9h5.37l.01-.01Z"></path>
              </svg>
            </svg>
            <div class="title">
              <span class="text">CASHIER</span>
            </div>
          </div>
        </li>
      </ul>
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
  fontSize: number
  dy: number
}

interface Props {
  showCashier?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCashier: true
})

const emit = defineEmits<{
  'change': [chip: Chip]
  'cashier': []
}>()

const bettingStore = useBettingStore()
const uiStore = useUIStore()
const audioSystem = useAudio()

// 筹码数据
const chips = ref<Chip[]>([
  { value: 1, color: 'rgb(89, 89, 89)', name: '€1', fontSize: 30, dy: 10 },
  { value: 2, color: 'rgb(255, 130, 214)', name: '€2', fontSize: 30, dy: 10 },
  { value: 5, color: 'rgb(206, 29, 0)', name: '€5', fontSize: 30, dy: 10 },
  { value: 25, color: 'rgb(5, 174, 41)', name: '€25', fontSize: 30, dy: 10 },
  { value: 100, color: 'rgb(26, 26, 26)', name: '€100', fontSize: 24, dy: 8 },
  { value: 500, color: 'rgb(133, 72, 176)', name: '€500', fontSize: 24, dy: 8 },
  { value: 1000, color: 'rgb(222, 152, 7)', name: '€1000', fontSize: 18, dy: 5 },
  { value: 5000, color: 'rgb(222, 117, 113)', name: '€5000', fontSize: 18, dy: 5 }
])

const selectedIndex = ref(4) // 默认选中100
const isExpanded = ref(false)

const selectedChipValue = computed(() => bettingStore.selectedChip)

watch(selectedChipValue, (newValue) => {
  const index = chips.value.findIndex(c => c.value === newValue)
  if (index !== -1) {
    selectedIndex.value = index
  }
}, { immediate: true })

// 获取筹码类名
const getChipClass = (index: number) => {
  if (!isExpanded.value) {
    const relativeIndex = index - selectedIndex.value
    const totalChips = chips.value.length

    let adjustedIndex = relativeIndex
    if (relativeIndex < -totalChips / 2) adjustedIndex += totalChips
    if (relativeIndex > totalChips / 2) adjustedIndex -= totalChips

    if (adjustedIndex === 0) return 'chip-center'
    if (adjustedIndex === -1 || (selectedIndex.value === 0 && index === totalChips - 1)) {
      return 'chip-left'
    }
    if (adjustedIndex === 1 || (selectedIndex.value === totalChips - 1 && index === 0)) {
      return 'chip-right'
    }
    return 'chip-hidden'
  }
  return 'chip-expanded'
}

// 获取筹码样式
const getChipStyle = (index: number) => {
  const style: any = {
    // 所有筹码的基准位置
    top: '67px',  // calc(var(--size, 10px) * 6.7)
    left: '67px', // calc(var(--size, 10px) * 6.7)
  }

  if (!isExpanded.value) {
    // 收起状态 - 显示3个筹码
    const relativeIndex = index - selectedIndex.value
    const totalChips = chips.value.length

    let adjustedIndex = relativeIndex
    if (relativeIndex < -totalChips / 2) adjustedIndex += totalChips
    if (relativeIndex > totalChips / 2) adjustedIndex -= totalChips

    if (adjustedIndex === 0) {
      // 中心筹码 - 不偏移
      style.transform = 'translate3d(0, 0, 0)'
      style.zIndex = 5
    } else if (adjustedIndex === -1 || (selectedIndex.value === 0 && index === totalChips - 1)) {
      // 左侧筹码
      style.transform = 'translate3d(-32px, 0, 0)'
      style.clipPath = 'inset(0 0 0 50%)'
      style.opacity = 0.7
      style.zIndex = 3
    } else if (adjustedIndex === 1 || (selectedIndex.value === totalChips - 1 && index === 0)) {
      // 右侧筹码
      style.transform = 'translate3d(32px, 0, 0)'
      style.clipPath = 'inset(0 50% 0 0)'
      style.opacity = 0.7
      style.zIndex = 3
    } else {
      // 隐藏
      style.display = 'none'
    }
  } else {
    // 展开状态 - 使用实际的transform坐标
    const positions = [
      { x: -8.3300, y: 1.6917 },   // 1
      { x: -8.1060, y: -2.5580 },  // 2
      { x: -5.8501, y: -6.1666 },  // 5
      { x: -2.1278, y: -8.2294 },  // 25
      { x: 2.1278, y: -8.2294 },   // 100 (注意是正值)
      { x: 5.8501, y: -6.1666 },   // 500
      { x: 8.1060, y: -2.5580 },   // 1000
      { x: 8.3300, y: 1.6917 }     // 5000 (这个实际上是CASHIER的位置，需要调整)
    ]

    const pos = positions[index]
    // 使用calc和CSS变量
    style.transform = `translate3d(calc(var(--size, 10px) * ${pos.x}), calc(var(--size, 10px) * ${pos.y}), 0)`
    style.zIndex = 1
    style.opacity = 1
  }

  return style
}

// 获取CASHIER按钮样式
const getCashierStyle = () => {
  const style: any = {
    top: '67px',  // calc(var(--size, 10px) * 6.7)
    left: '67px', // calc(var(--size, 10px) * 6.7)
  }

  if (!isExpanded.value) {
    style.display = 'none'
  } else {
    // CASHIER的实际位置
    style.transform = 'translate3d(calc(var(--size, 10px) * 8.3300), calc(var(--size, 10px) * 1.6917), 0)'
  }

  return style
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
    isExpanded.value = true
    await playSound()
    return
  }

  bettingStore.selectChip(chip.value)
  selectedIndex.value = index
  await playSound()
  emit('change', chip)

  setTimeout(() => {
    isExpanded.value = false
  }, 300)
}

// 处理CASHIER
const handleCashier = async () => {
  await playSound()
  emit('cashier')
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

onMounted(() => {
  const storeChip = bettingStore.selectedChip
  const index = chips.value.findIndex(c => c.value === storeChip)
  if (index !== -1) {
    selectedIndex.value = index
  }
})
</script>

<style scoped>
.chip-choose-container {
  position: fixed;
  bottom: 49px;
  left: 50%;
  transform: translateX(-50%);
  width: 170px;
  height: 170px;
  cursor: pointer;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.2); /* 添加半透明背景便于查看边界 */
  border: 1px solid rgba(255, 255, 255, 0.1); /* 添加边框便于查看 */
}

.revolver-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.chip-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  width: 100%;
  height: 100%;
}

/* 筹码基础样式 */
.chip-item {
  position: absolute;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* CASHIER按钮 */
.cashier-item {
  position: absolute;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 收起状态的筹码样式 */
.chip-center {
  z-index: 5;
  opacity: 1;
}

.chip-left {
  z-index: 3;
  opacity: 0.7;
  clip-path: inset(0 0 0 50%);
}

.chip-right {
  z-index: 3;
  opacity: 0.7;
  clip-path: inset(0 50% 0 0);
}

.chip-hidden {
  opacity: 0;
  pointer-events: none;
}

/* 展开状态 */
.chip-expanded {
  opacity: 1;
}

.chip-expanded:hover {
  transform: translateX(-50%) scale(1.15);
  filter: brightness(1.2);
}

/* 筹码内容 */
.chip {
  width: 100%;
  height: 100%;
  position: relative;
}

.chip-graphics {
  width: 100%;
  height: 100%;
}

.chip-graphics .paint {
  fill: currentColor;
  opacity: 0.9;
}

.chip-graphics .body {
  fill: currentColor;
}

.chip-graphics .textBackground {
  fill: white;
}

.chip-graphics .value {
  font-weight: bold;
  fill: black;
  text-anchor: middle;
}

/* CASHIER按钮样式 */
.cashier-button {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.2), rgba(24, 144, 255, 0.1));
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.cashier-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.4);
}

.cashier-button .iconWrapper {
  width: 60%;
  height: 60%;
}

.cashier-button .icon {
  fill: #40a9ff;
}

.cashier-button .title {
  font-size: 6px;
  font-weight: 600;
  color: #40a9ff;
  text-transform: uppercase;
  margin-top: 2px;
}

.cashier-button .text {
  display: block;
}
</style>
