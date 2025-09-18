<template>
  <div class="chip-action-container" :class="{ 'dealing-mode': gameStatus === 'dealing' }">
    <!-- 内容包装器 - 投注状态时显示 -->
    <div class="content-wrapper" v-show="gameStatus === 'betting'">

      <!-- UNDO 组 -->
      <div class="action-group">
        <span class="action-label">UNDO</span>
        <button class="circle-button" @click="handleUndo">
          <svg viewBox="0 0 24 24">
            <path d="M13 6H9V4L4 7l5 3V8h4a4.5 4.5 0 1 1 0 9H5v2h8a6.5 6.5 0 1 0 0-13Z"/>
          </svg>
        </button>
      </div>

      <!-- 中间筹码堆叠 -->
      <div class="chips-display">
        <!-- 左侧筹码 - 2元粉色（只露出右边一小部分） -->
        <div class="stacked-chip left-chip">
          <svg viewBox="0 0 78 78" class="chip chip-2">
            <g>
              <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
              <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
              <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
              <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
            </g>
            <text class="chip-value chip-value-normal" x="50%" y="50%" dy="7">2</text>
          </svg>
        </div>

        <!-- 右侧筹码 - 5元红色（只露出左边一小部分） -->
        <div class="stacked-chip right-chip">
          <svg viewBox="0 0 78 78" class="chip chip-5">
            <g>
              <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
              <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
              <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
              <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
            </g>
            <text class="chip-value chip-value-normal" x="50%" y="50%" dy="7">5</text>
          </svg>
        </div>

        <!-- 中间主筹码 - 100元黑色 -->
        <div class="stacked-chip main-chip">
          <svg viewBox="0 0 78 78" class="chip chip-100">
            <g>
              <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
              <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
              <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
              <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
            </g>
            <text class="chip-value chip-value-small" x="50%" y="50%" dy="7" font-weight="bold">100</text>
          </svg>
        </div>
      </div>

      <!-- DOUBLE 组 -->
      <div class="action-group">
        <button class="circle-button" @click="handleDouble">
          <svg viewBox="0 0 24 24">
            <path d="M12.017 18.881v-1.49l4.63-4.81c.458-.477.841-.92 1.148-1.275l.082-.095c.287-.344.529-.724.72-1.13a2.57 2.57 0 0 0 .25-1.14 2.12 2.12 0 0 0-.33-1.18 2.17 2.17 0 0 0-.87-.77 2.83 2.83 0 0 0-1.25-.27 2.67 2.67 0 0 0-1.29.3 2.21 2.21 0 0 0-.84.85 2.67 2.67 0 0 0-.29 1.29h-2a4.14 4.14 0 0 1 .58-2.19 3.88 3.88 0 0 1 1.58-1.45 4.85 4.85 0 0 1 2.28-.52 4.84 4.84 0 0 1 2.27.51 3.87 3.87 0 0 1 1.55 1.39c.373.6.564 1.294.55 2a4.107 4.107 0 0 1-.28 1.5 6.777 6.777 0 0 1-1 1.62c-.473.593-1.14 1.313-2 2.16l-2.72 2.85v.1h6.16v1.77l-8.93-.02zm-4.654-8.02L5.061 8.557 4 9.618l2.303 2.303-2.3 2.3 1.06 1.06 2.3-2.3 2.294 2.294 1.06-1.06-2.293-2.294 2.296-2.296-1.06-1.06-2.297 2.295Z"/>
          </svg>
        </button>
        <span class="action-label">DOUBLE</span>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// 获取游戏状态管理器
const gameStore = useGameStore()

// 计算属性：获取当前游戏状态
const gameStatus = computed(() => gameStore.gameStatus)

// 事件处理函数
const handleUndo = () => {
  // 只在投注状态下才能执行撤销
  if (gameStatus.value === 'betting') {
    console.log('执行撤销操作')
    // TODO: 调用撤销投注的逻辑
  }
}

const handleDouble = () => {
  // 只在投注状态下才能执行双倍
  if (gameStatus.value === 'betting') {
    console.log('执行双倍操作')
    // TODO: 调用双倍投注的逻辑
  }
}
</script>

<style scoped>
/* 主容器 - 深棕色背景条 */
.chip-action-container {
  width: 100%;
  height: 45px;
  background: linear-gradient(135deg,
    rgba(45, 25, 15, 0.98) 0%,
    rgba(61, 37, 20, 0.98) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: height 0.3s ease;
}

/* 开牌状态：高度减少到22px */
.chip-action-container.dealing-mode {
  height: 22px;
}

/* 内容包装器 - 三个元素整体居中 */
.content-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  transition: opacity 0.2s ease;
}

/* 圆形按钮组 - UNDO 和 DOUBLE */
.action-group {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 圆形按钮样式 */
.circle-button {
  padding: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(128, 128, 128, 0.1);
  border: 1px solid rgba(128, 128, 128, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.circle-button:hover {
  background: rgba(128, 128, 128, 0.2);
  transform: scale(1.05);
}

.circle-button:active {
  transform: scale(0.95);
}

.circle-button svg {
  width: 22px;
  height: 22px;
  fill: #ccc;
}

/* 文字标签 */
.action-label {
  font-size: 10px;
  font-weight: 600;
  color: #ccc;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

/* 中间筹码容器 */
.chips-display {
  width: 50px;
  height: 40px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 堆叠筹码 */
.stacked-chip {
  position: absolute;
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 40px;
  transition: all 0.3s ease;
}

/* 左侧筹码 - 只露出10% */
.left-chip {
  z-index: 1;
  transform: translateX(-6px);
}

/* 右侧筹码 - 只露出10% */
.right-chip {
  z-index: 2;
  transform: translateX(6px);
}

/* 中间主筹码 */
.main-chip {
  z-index: 3;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.3));
}

/* 鼠标悬停效果 */
.chips-display:hover .left-chip {
  transform: translateX(-10px);
}

.chips-display:hover .right-chip {
  transform: translateX(10px);
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

/* 筹码颜色 */
/* 2元 - 粉色 */
.chip-2 .chip-outer { fill: #ff82d6; }
.chip-2 .chip-border { fill: rgba(255, 130, 214, 0.3); }
.chip-2 .chip-center { fill: #ff82d6; }

/* 5元 - 红色 */
.chip-5 .chip-outer { fill: #ce1d00; }
.chip-5 .chip-border { fill: rgba(206, 29, 0, 0.3); }
.chip-5 .chip-center { fill: #ce1d00; }

/* 100元 - 黑色 */
.chip-100 .chip-outer { fill: #1a1a1a; }
.chip-100 .chip-border { fill: rgba(26, 26, 26, 0.3); }
.chip-100 .chip-center { fill: #1a1a1a; }
</style>
