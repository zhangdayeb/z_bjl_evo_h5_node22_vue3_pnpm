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
                <!-- 最外层装饰圆 -->
                <circle class="paint" cx="39.019" cy="38.999" r="38.5"></circle>

                <!-- 内圆环边框 -->
                <path class="body" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>

                <!-- 文字背景圆 -->
                <circle class="textBackground" cx="39" cy="38.997" r="25.5"></circle>

                <!-- 齿轮装饰路径 -->
                <path class="body" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
              </g>

              <!-- 数值文本 -->
              <text
                class="value"
                x="50%"
                y="50%"
                :font-size="chip.fontSize"
                :dy="chip.dy"
                data-role="chip-value"
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
          :class="{ 'hidden': !isExpanded }"
          :style="getCashierStyle()"
          @click.stop="handleCashier"
        >
          <div class="cashier-button up">
            <div class="button">
              <svg viewBox="0 0 100 100" class="iconWrapper" style="height: 100%;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon" height="75%" y="12.5%" opacity="80%">
                  <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm2.77 8.02-.36 1.51H9.16v.83h5.13l-.36 1.51H9.35c.25.88.72 1.51 1.43 1.94.56.31 1.18.47 1.86.47.93 0 1.65-.22 2.12-.66l.42-.39v2.25l-.15.06c-.73.31-1.5.47-2.27.47-2.51 0-4.16-.94-5.05-2.88a6.39 6.39 0 0 1-.39-1.19H5.99l.36-1.51h.79v-.83H6.05l.36-1.51h.9c.35-1.52 1.25-2.69 2.62-3.38.87-.46 1.86-.7 2.94-.7.98 0 1.88.22 2.6.65l.17.1-.52 1.76-.29-.22a3.26 3.26 0 0 0-2.02-.68c-.81 0-1.5.19-2.09.57-.31.19-.59.48-.89.94-.2.3-.35.61-.44.9h5.37l.01-.01Z"></path>
                </svg>
              </svg>
            </div>
            <div class="title">
              <span class="text"><span>CASHIER</span></span>
            </div>
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
  fontSize: number
  dy: number
}

// Props
interface Props {
  showCashier?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showCashier: true
})

// Emits
const emit = defineEmits<{
  'change': [chip: Chip]
  'cashier': []
}>()

// Stores
const bettingStore = useBettingStore()
const uiStore = useUIStore()
const audioSystem = useAudio()

// 筹码数据 - 严格按照原版配色和字体大小
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

// 状态
const selectedIndex = ref(4) // 默认选中100的索引
const isExpanded = ref(false)

// 从 store 获取选中的筹码值
const selectedChipValue = computed(() => bettingStore.selectedChip)

// 监听 store 中筹码值的变化，更新索引
watch(selectedChipValue, (newValue) => {
  const index = chips.value.findIndex(c => c.value === newValue)
  if (index !== -1) {
    selectedIndex.value = index
  }
}, { immediate: true })

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

// 获取筹码样式 - 严格按照原版位置
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
    // 展开状态 - 严格按照原版坐标
    const positions = [
      { x: -8.8199, y: 1.7912 },  // 1
      { x: -8.7368, y: -2.1605 }, // 2
      { x: -6.9685, y: -5.6956 }, // 5
      { x: -3.8562, y: -8.1320 }, // 25
      { x: -0.0000, y: -9.0000 }, // 100
      { x: 3.8562, y: -8.1320 },  // 500
      { x: 6.9685, y: -5.6956 },  // 1000
      { x: 8.7368, y: -2.1605 }   // 5000
    ]

    const pos = positions[index]
    style.transform = `translate3d(calc(var(--size, 10px) * ${pos.x}), calc(var(--size, 10px) * ${pos.y}), 0)`
  }

  style.top = `calc(var(--size, 10px) * 7.4)`
  style.left = `calc(var(--size, 10px) * 7.4)`
  style.width = `calc(var(--size, 10px) * 3.2)`
  style.height = `calc(var(--size, 10px) * 3.2)`

  return style
}

// 获取CASHIER按钮样式 - 严格按照原版位置
const getCashierStyle = () => {
  return {
    transform: isExpanded.value
      ? `translate3d(calc(var(--size, 10px) * 8.8199), calc(var(--size, 10px) * 1.7912), 0)`
      : `translate3d(0, 0, 0) scale(0)`,
    top: `calc(var(--size, 10px) * 7.4)`,
    left: `calc(var(--size, 10px) * 7.4)`,
    width: `calc(var(--size, 10px) * 3.2)`,
    height: `calc(var(--size, 10px) * 3.2)`
  }
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

  // 更新 store 中的筹码
  bettingStore.selectChip(chip.value)
  selectedIndex.value = index

  // 播放音效
  await playSound()

  // 发送事件
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
  // 初始化选中筹码索引
  const storeChip = bettingStore.selectedChip
  const index = chips.value.findIndex(c => c.value === storeChip)
  if (index !== -1) {
    selectedIndex.value = index
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

/* 筹码列表 - 严格按照原版布局 */
.chip-list {
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  width: calc(var(--size) * 18);
  height: calc(var(--size) * 18);
  top: calc(var(--size) * -8.35);
  left: calc(var(--size) * -6.8);
}

.chip-item {
  position: absolute;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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

/* 筹码容器 */
.chip {
  width: 100%;
  height: 100%;
  position: relative;
}

/* SVG样式 - 严格按照原版 */
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

/* CASHIER按钮 - 严格按照原版样式 */
.cashier-item {
  position: absolute;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.cashier-item.hidden {
  opacity: 0;
  pointer-events: none;
}

.cashier-button {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.2), rgba(24, 144, 255, 0.1));
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.cashier-button:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.4);
}

.cashier-button .button {
  width: 100%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cashier-button .iconWrapper {
  width: 100%;
  height: 100%;
}

.cashier-button .icon {
  fill: #40a9ff;
}

.cashier-button .title {
  position: absolute;
  bottom: 15%;
  width: 100%;
  text-align: center;
}

.cashier-button .text {
  font-size: 7px;
  font-weight: 600;
  color: #40a9ff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

/* 展开状态的hover效果 */
.chip-item:hover .chip {
  transform: scale(1.15);
  filter: brightness(1.2);
}

/* 移除响应式，保持固定大小 */
</style>
