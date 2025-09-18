<template>
  <div class="chip-action-container">
    <!-- UNDO 区域 -->
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

    <!-- 中间筹码区域 - 堆叠效果 -->
    <div class="chip-display">
      <!-- 左侧筹码 -->
      <div class="stacked-chip left-chip">
        <svg viewBox="0 0 78 78" class="chip" :class="`chip-${leftChipValue}`">
          <g>
            <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
            <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
            <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
            <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
          </g>
          <text class="chip-value" :class="getChipValueClass(leftChipValue)" x="50%" y="50%" dy="7">
            {{ getChipText(leftChipValue) }}
          </text>
        </svg>
      </div>

      <!-- 右侧筹码 -->
      <div class="stacked-chip right-chip">
        <svg viewBox="0 0 78 78" class="chip" :class="`chip-${rightChipValue}`">
          <g>
            <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
            <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
            <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
            <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
          </g>
          <text class="chip-value" :class="getChipValueClass(rightChipValue)" x="50%" y="50%" dy="7">
            {{ getChipText(rightChipValue) }}
          </text>
        </svg>
      </div>

      <!-- 中间主筹码 -->
      <div class="stacked-chip main-chip">
        <svg viewBox="0 0 78 78" class="chip" :class="`chip-${currentChipValue}`">
          <g>
            <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
            <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
            <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
            <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
          </g>
          <text class="chip-value" :class="getChipValueClass(currentChipValue)" x="50%" y="50%" dy="7" font-weight="bold">
            {{ getChipText(currentChipValue) }}
          </text>
        </svg>
      </div>
    </div>

    <!-- DOUBLE 区域 -->
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
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'
import { useAudio } from '@/services/Audio'

// Store 和服务
const bettingStore = useBettingStore()
const audioSystem = useAudio()

// 获取显示的筹码列表
const displayChips = computed(() => {
  return bettingStore.displayChips || [
    { value: 100 },
    { value: 500 },
    { value: 1000 }
  ]
})

// 当前选中的筹码（中间）
const currentChipValue = computed(() => bettingStore.selectedChip || 100)

// 左侧筹码
const leftChipValue = computed(() => {
  const chips = displayChips.value
  if (chips.length < 2) return 100

  if (currentChipValue.value === chips[0]?.value) {
    return chips[1]?.value || 500
  }
  return chips[0]?.value || 100
})

// 右侧筹码
const rightChipValue = computed(() => {
  const chips = displayChips.value
  if (chips.length < 2) return 1000

  const lastIndex = chips.length - 1
  if (currentChipValue.value === chips[lastIndex]?.value) {
    return chips[lastIndex - 1]?.value || 500
  }
  return chips[lastIndex]?.value || 1000
})

// 筹码文本
const getChipText = (value: number): string => {
  if (value === 1000) return '1K'
  if (value === 5000) return '5K'
  return value.toString()
}

// 筹码文字大小
const getChipValueClass = (value: number): string => {
  if (value >= 1000) return 'chip-value-small-more'
  if (value >= 100) return 'chip-value-small'
  return 'chip-value-normal'
}

// 按钮状态
const canUndo = computed(() => bettingStore.canCancel)
const canDouble = computed(() => bettingStore.hasLastRoundData)

// 处理撤销
const handleUndo = async () => {
  if (!canUndo.value) return
  await playSound()
  bettingStore.cancelBets()
}

// 处理加倍
const handleDouble = async () => {
  if (!canDouble.value) return
  await playSound()
  bettingStore.repeatLastBets()
}

// 播放音效
const playSound = async () => {
  try {
    await audioSystem?.playAudioFile?.('click.mp3')
  } catch (error) {
    console.warn('播放音效失败:', error)
  }
}
</script>

<style scoped>
/* 主容器 */
.chip-action-container {
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  background: linear-gradient(135deg,
    rgba(45, 25, 15, 0.98) 0%,
    rgba(61, 37, 20, 0.98) 100%
  );
  position: relative;
}

/* 动作组 */
.action-group {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

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

.action-label {
  font-size: 11px;
  font-weight: 700;
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
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

/* 筹码显示区域 */
.chip-display {
  width: 80px;
  height: 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stacked-chip {
  position: absolute;
  width: 40px;
  height: 40px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  transition: all 0.3s ease;
}

.left-chip {
  left: 0;
  z-index: 1;
  opacity: 0.7;
  transform: translateX(-8px);
}

.right-chip {
  right: 0;
  z-index: 2;
  opacity: 0.7;
  transform: translateX(8px);
}

.main-chip {
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
}

/* 悬停效果 */
.chip-display:hover .left-chip {
  transform: translateX(-12px);
}

.chip-display:hover .right-chip {
  transform: translateX(12px);
}

.chip-display:hover .main-chip {
  transform: translateX(-50%) scale(1.05);
}

/* SVG 筹码样式 */
.chip {
  width: 100%;
  height: 100%;
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

.chip-value-normal {
  font-size: 22px;
}

.chip-value-small {
  font-size: 18px;
}

.chip-value-small-more {
  font-size: 14px;
}

/* 筹码颜色 */
.chip-1 .chip-outer { fill: #595959; }
.chip-1 .chip-border { fill: rgba(89, 89, 89, 0.3); }
.chip-1 .chip-center { fill: #595959; }

.chip-2 .chip-outer { fill: #ff82d6; }
.chip-2 .chip-border { fill: rgba(255, 130, 214, 0.3); }
.chip-2 .chip-center { fill: #ff82d6; }

.chip-5 .chip-outer { fill: #ce1d00; }
.chip-5 .chip-border { fill: rgba(206, 29, 0, 0.3); }
.chip-5 .chip-center { fill: #ce1d00; }

.chip-25 .chip-outer { fill: #05ae29; }
.chip-25 .chip-border { fill: rgba(5, 174, 41, 0.3); }
.chip-25 .chip-center { fill: #05ae29; }

.chip-100 .chip-outer { fill: #1a1a1a; }
.chip-100 .chip-border { fill: rgba(26, 26, 26, 0.3); }
.chip-100 .chip-center { fill: #1a1a1a; }

.chip-500 .chip-outer { fill: #8548b0; }
.chip-500 .chip-border { fill: rgba(133, 72, 176, 0.3); }
.chip-500 .chip-center { fill: #8548b0; }

.chip-1000 .chip-outer { fill: #de9807; }
.chip-1000 .chip-border { fill: rgba(222, 152, 7, 0.3); }
.chip-1000 .chip-center { fill: #de9807; }

.chip-5000 .chip-outer { fill: #de7571; }
.chip-5000 .chip-border { fill: rgba(222, 117, 113, 0.3); }
.chip-5000 .chip-center { fill: #de7571; }
</style>
