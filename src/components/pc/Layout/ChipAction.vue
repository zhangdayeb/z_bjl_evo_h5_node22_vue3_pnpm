<template>
  <div class="chip-action-container" :class="{ 'dealing-mode': gameStatus === 'dealing' }">
    <!-- 内容包装器 - 投注状态时显示 -->
    <div class="content-wrapper" v-show="gameStatus === 'betting'">

      <!-- 左侧：回退按钮 -->
      <button class="action-button undo-button" @click="handleUndo" title="撤销">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M13 6H9V4L4 7l5 3V8h4a4.5 4.5 0 1 1 0 9H5v2h8a6.5 6.5 0 1 0 0-13Z"/>
        </svg>
      </button>

      <!-- 中间：所有筹码横向排列 -->
      <div class="chips-list">
        <div
          v-for="chip in availableChips"
          :key="chip.value"
          class="chip-wrapper"
          :class="{ 'selected': selectedChip === chip.value }"
          @click="handleSelectChip(chip.value)"
        >
          <svg viewBox="0 0 78 78" class="chip" :class="`chip-${chip.value}`">
            <g>
              <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
              <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
              <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
              <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
            </g>
            <text class="chip-value" :class="getChipValueClass(chip.value)" x="50%" y="50%" font-weight="bold">{{ chip.text }}</text>
          </svg>
        </div>
      </div>

      <!-- 右侧：双倍按钮 -->
      <button class="action-button double-button" @click="handleDouble" title="双倍投注">
        <span class="double-icon">×2</span>
      </button>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useBettingStore } from '@/stores/bettingStore'

// 获取游戏状态管理器
const gameStore = useGameStore()
const bettingStore = useBettingStore()

// 计算属性：获取当前游戏状态
const gameStatus = computed(() => gameStore.gameStatus)

// 计算属性：获取选中的筹码
const selectedChip = computed(() => bettingStore.selectedChip)

// 可用筹码列表
const availableChips = [
  { value: 1, text: '1' },
  { value: 2, text: '2' },
  { value: 5, text: '5' },
  { value: 25, text: '25' },
  { value: 100, text: '100' },
  { value: 500, text: '500' },
  { value: 1000, text: '1000' },
  { value: 5000, text: '5000' }
]

// 辅助函数：获取筹码文字样式类
const getChipValueClass = (value: number) => {
  if (value >= 1000) return 'chip-value-smaller'  // 四位数及以上: 1000+
  if (value >= 100) return 'chip-value-small'     // 三位数: 100-999
  if (value >= 10) return 'chip-value-normal'     // 两位数: 10-99
  return 'chip-value-large'                       // 一位数: 1-9
}

// 事件处理函数
const handleUndo = () => {
  // 只在投注状态下才能执行撤销
  if (gameStatus.value === 'betting') {
    console.log('[ChipAction] 执行撤销操作')
    bettingStore.undoLastBet()
  }
}

const handleDouble = () => {
  // 只在投注状态下才能执行双倍
  if (gameStatus.value === 'betting') {
    console.log('[ChipAction] 执行重复上局投注')
    const success = bettingStore.repeatLastBets()
    if (!success) {
      console.warn('[ChipAction] 没有上局投注数据')
    }
  }
}

const handleSelectChip = (value: number) => {
  if (gameStatus.value === 'betting') {
    console.log('[ChipAction] 选择筹码:', value)
    bettingStore.selectChip(value)
  }
}
</script>

<style scoped>
/* 主容器 - 透明背景 */
.chip-action-container {
  width: 100%;
  height: 100px;
  max-width: 700px;
  margin: 0 auto;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: height 0.3s ease;
}

/* 开牌状态：高度减少 */
.chip-action-container.dealing-mode {
  height: 50px;
}

/* 内容包装器 - 整体居中 */
.content-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 700px;
  padding: 0 15px;
  transition: opacity 0.2s ease;
}

/* 左右操作按钮 */
.action-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid rgba(255, 215, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.action-button:hover {
  background: rgba(0, 0, 0, 0.6);
  border-color: rgba(255, 215, 0, 0.5);
  transform: scale(1.05);
}

.action-button:active {
  transform: scale(0.95);
}

/* 回退按钮 */
.undo-button svg {
  width: 24px;
  height: 24px;
  color: #FFD700;
}

/* 双倍按钮 */
.double-icon {
  font-size: 24px;
  font-weight: bold;
  color: #FFD700;
}

/* 筹码列表 */
.chips-list {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  justify-content: center;
}

/* 筹码包装器 */
.chip-wrapper {
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.chip-wrapper:hover {
  transform: translateY(-4px);
  filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.3));
}

.chip-wrapper:active {
  transform: translateY(-2px);
}

/* 选中状态 - PC端：金色圆环边框 */
.chip-wrapper.selected {
  transform: translateY(-2px) scale(1.05);
  filter: drop-shadow(0 4px 10px rgba(255, 215, 0, 0.6));
}

/* 金色圆环边框 */
.chip-wrapper.selected::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% + 8px);
  height: calc(100% + 8px);
  border-radius: 50%;
  border: 3px solid #FFD700;
  box-shadow:
    0 0 10px rgba(255, 215, 0, 0.8),
    inset 0 0 10px rgba(255, 215, 0, 0.3);
  animation: pulse-ring 2s ease-in-out infinite;
  pointer-events: none;
  z-index: -1;
}

/* 金色圆环脉动动画 */
@keyframes pulse-ring {
  0%, 100% {
    box-shadow:
      0 0 10px rgba(255, 215, 0, 0.8),
      inset 0 0 10px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow:
      0 0 20px rgba(255, 215, 0, 1),
      inset 0 0 15px rgba(255, 215, 0, 0.5);
  }
}

/* SVG 筹码样式 */
.chip {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  background: white;
  border-radius: 100%;
}

.chip-outer {
  opacity: 0.1;
}

.chip-value {
  fill: #ffffff;
  font-weight: bold;
  text-anchor: middle;
  dominant-baseline: central;
}

/* 字体大小 */
.chip-value-large {
  font-size: 24px;  /* 一位数: 1-9 */
}

.chip-value-normal {
  font-size: 20px;  /* 两位数: 10-99 */
}

.chip-value-small {
  font-size: 16px;  /* 三位数: 100-999 */
}

.chip-value-smaller {
  font-size: 14px;  /* 四位数及以上: 1000+ */
}

/* 筹码颜色 */
/* 1元 - 灰色 */
.chip-1 .chip-outer { fill: #808080; }
.chip-1 .chip-border { fill: rgba(128, 128, 128, 0.3); }
.chip-1 .chip-center { fill: #808080; }

/* 2元 - 粉色 */
.chip-2 .chip-outer { fill: #ff82d6; }
.chip-2 .chip-border { fill: rgba(255, 130, 214, 0.3); }
.chip-2 .chip-center { fill: #ff82d6; }

/* 5元 - 红色 */
.chip-5 .chip-outer { fill: #ce1d00; }
.chip-5 .chip-border { fill: rgba(206, 29, 0, 0.3); }
.chip-5 .chip-center { fill: #ce1d00; }

/* 25元 - 绿色 */
.chip-25 .chip-outer { fill: #228B22; }
.chip-25 .chip-border { fill: rgba(34, 139, 34, 0.3); }
.chip-25 .chip-center { fill: #228B22; }

/* 100元 - 黑色 */
.chip-100 .chip-outer { fill: #1a1a1a; }
.chip-100 .chip-border { fill: rgba(26, 26, 26, 0.3); }
.chip-100 .chip-center { fill: #1a1a1a; }

/* 500元 - 紫色 */
.chip-500 .chip-outer { fill: #8B008B; }
.chip-500 .chip-border { fill: rgba(139, 0, 139, 0.3); }
.chip-500 .chip-center { fill: #8B008B; }

/* 1000元 - 金色 */
.chip-1000 .chip-outer { fill: #FFA500; }
.chip-1000 .chip-border { fill: rgba(255, 165, 0, 0.3); }
.chip-1000 .chip-center { fill: #FFA500; }

/* 5000元 - 深红色 */
.chip-5000 .chip-outer { fill: #8B0000; }
.chip-5000 .chip-border { fill: rgba(139, 0, 0, 0.3); }
.chip-5000 .chip-center { fill: #8B0000; }

/* 响应式调整 */
@media (max-width: 1366px) {
  .chip-wrapper {
    width: 45px;
    height: 45px;
  }

  .chips-list {
    gap: 6px;
  }

  .action-button {
    width: 45px;
    height: 45px;
  }
}
</style>
