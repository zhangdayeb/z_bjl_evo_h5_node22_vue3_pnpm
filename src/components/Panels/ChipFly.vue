<template>
  <div v-if="isVisible" class="chip-fly-layer">
    <div
      v-if="flyingChip"
      class="flying-chip-wrapper"
      :style="flyingChipStyle"
      @transitionend="onTransitionEnd"
    >
      <svg viewBox="0 0 78 78" class="flying-chip" :class="getChipClass(flyingChip.value)">
        <g>
          <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
          <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
          <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
          <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
        </g>
        <text class="chip-value" :class="getChipValueClass(flyingChip.value)" x="50%" y="50%">
          {{ formatChipValue(flyingChip.value) }}
        </text>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview 筹码飞行动画组件
 * @description 负责展示筹码从起点飞到终点的动画效果
 */

import { ref, computed, watch } from 'vue'
import { useChipFlyStore } from '@/stores/chipFlyStore'
import { useoverLayerStore } from '@/stores/overLayerStore'

// ========================= Store =========================
const chipFlyStore = useChipFlyStore()
const overLayerStore = useoverLayerStore()

// ========================= 状态 =========================
const isVisible = ref(false)
const flyingChip = ref<any>(null)
const isAnimating = ref(false)

// ========================= 计算属性 =========================
const flyingChipStyle = computed(() => {
  if (!flyingChip.value) return {}

  const chip = flyingChip.value

  // 初始位置（动画开始前）
  if (!isAnimating.value) {
    return {
      left: `${chip.from.x}px`,
      top: `${chip.from.y}px`,
      transform: 'translate(-50%, -50%) scale(1)',
      transition: 'none'
    }
  }

  // 飞行到目标位置
  return {
    left: `${chip.from.x}px`,
    top: `${chip.from.y}px`,
    transform: `translate(calc(-50% + ${chip.to.x - chip.from.x}px), calc(-50% + ${chip.to.y - chip.from.y}px)) scale(0.8)`,
    transition: `transform ${chip.duration || 400}ms cubic-bezier(0.4, 0, 0.2, 1)`
  }
})

// ========================= 监听 Store 变化 =========================
watch(() => chipFlyStore.currentChip, (newChip) => {
  if (newChip) {
    startAnimation(newChip)
  } else {
    cancelAnimation()
  }
})

// ========================= 方法 =========================

/**
 * 开始飞行动画
 */
const startAnimation = (chip: any) => {
  // 显示图层
  isVisible.value = true
  overLayerStore.open('chipFly')

  // 设置飞行筹码
  flyingChip.value = { ...chip }
  isAnimating.value = false

  // 强制重排，确保初始位置生效
  void document.body.offsetHeight

  // 下一帧开始动画
  requestAnimationFrame(() => {
    isAnimating.value = true
  })
}

/**
 * 取消当前动画
 */
const cancelAnimation = () => {
  if (flyingChip.value) {
    flyingChip.value = null
    isAnimating.value = false
  }
}

/**
 * 动画结束处理
 */
const onTransitionEnd = () => {
  if (!isAnimating.value) return

  // 通知 Store 动画完成
  chipFlyStore.onFlyComplete()

  // 清理状态
  flyingChip.value = null
  isAnimating.value = false
  isVisible.value = false

  // 关闭图层
  overLayerStore.close()
}

/**
 * 根据金额获取筹码样式类
 */
const getChipClass = (amount: number): string => {
  // 根据金额选择最接近的筹码面值样式
  if (amount >= 1000) return 'chip-1000'
  if (amount >= 500) return 'chip-500'
  if (amount >= 100) return 'chip-100'
  if (amount >= 25) return 'chip-25'
  if (amount >= 5) return 'chip-5'
  if (amount >= 2) return 'chip-2'
  return 'chip-1'
}

/**
 * 格式化筹码值显示
 */
const formatChipValue = (value: number): string => {
  if (value >= 1000) {
    return '1K'
  }
  return value.toString()
}

/**
 * 获取筹码文字样式类
 */
const getChipValueClass = (value: number): string => {
  if (value >= 100 && value < 1000) return 'chip-value-small'
  if (value >= 1000) return 'chip-value-small-more'
  return 'chip-value-normal'
}
</script>

<style scoped>
/* ========================= 图层容器 ========================= */
.chip-fly-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
}

/* ========================= 飞行筹码容器 ========================= */
.flying-chip-wrapper {
  position: fixed;
  width: 40px;
  height: 40px;
  background-color: #ffffff;
  border-radius: 50%;
  will-change: transform;
}

/* ========================= SVG筹码样式 ========================= */
.flying-chip {
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

/* 字体大小 */
.chip-value-normal {
  font-size: 36px;
}

.chip-value-small {
  font-size: 26px;
}

.chip-value-small-more {
  font-size: 24px;
}

/* ========================= 筹码颜色 ========================= */

/* $1 - 灰色 */
.chip-1 .chip-outer { fill: #808080; }
.chip-1 .chip-border { fill: #808080; }
.chip-1 .chip-center { fill: #808080; stroke: #808080; }

/* $2 - 粉色 */
.chip-2 .chip-outer { fill: #FF69B4; }
.chip-2 .chip-border { fill: #FF69B4; }
.chip-2 .chip-center { fill: #FF69B4; stroke: #FF69B4; }

/* $5 - 红色 */
.chip-5 .chip-outer { fill: #DC143C; }
.chip-5 .chip-border { fill: #DC143C; }
.chip-5 .chip-center { fill: #DC143C; stroke: #DC143C; }

/* $25 - 绿色 */
.chip-25 .chip-outer { fill: #228B22; }
.chip-25 .chip-border { fill: #228B22; }
.chip-25 .chip-center { fill: #228B22; stroke: #228B22; }

/* $100 - 黑色 */
.chip-100 .chip-outer { fill: #1a1a1a; }
.chip-100 .chip-border { fill: #1a1a1a; }
.chip-100 .chip-center { fill: #1a1a1a; stroke: #1a1a1a; }

/* $500 - 紫色 */
.chip-500 .chip-outer { fill: #8B008B; }
.chip-500 .chip-border { fill: #8B008B; }
.chip-500 .chip-center { fill: #8B008B; stroke: #8B008B; }

/* $1000 - 橙色 */
.chip-1000 .chip-outer { fill: #FFA500; }
.chip-1000 .chip-border { fill: #FFA500; }
.chip-1000 .chip-center { fill: #FFA500; stroke: #FFA500; }

.chip-center {
  stroke-width: 0.5;
}
</style>
