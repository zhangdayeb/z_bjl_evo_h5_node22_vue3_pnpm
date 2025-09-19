<template>
  <div class="show-chip-layer">
    <!-- =================== 透明点击区域 =================== -->
    <!-- Player 点击区域 -->
    <div
      ref="playerClickArea"
      class="click-area player-click-area"
      @click="handleBet('player')"
    ></div>

    <!-- Banker 点击区域 -->
    <div
      ref="bankerClickArea"
      class="click-area banker-click-area"
      @click="handleBet('banker')"
    ></div>

    <!-- Tie 点击区域 -->
    <div
      ref="tieClickArea"
      class="click-area tie-click-area"
      @click="handleBet('tie')"
    ></div>

    <!-- Player Pair 点击区域 -->
    <div
      ref="playerPairClickArea"
      class="click-area player-pair-click-area"
      @click="handleBet('player-pair')"
    ></div>

    <!-- Banker Pair 点击区域 -->
    <div
      ref="bankerPairClickArea"
      class="click-area banker-pair-click-area"
      @click="handleBet('banker-pair')"
    ></div>

    <!-- =================== 筹码显示区域（只显示总金额） =================== -->
    <!-- Player 区域筹码 -->
    <div class="chip-area player-chip-area" v-if="betAmounts.player > 0">
      <svg viewBox="0 0 78 78" class="chip" :class="getChipClass(betAmounts.player)">
        <g>
          <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
          <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
          <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
          <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
        </g>
        <text class="chip-value" :class="getChipValueClass(betAmounts.player)" x="50%" y="50%">
          {{ formatChipValue(betAmounts.player) }}
        </text>
      </svg>
    </div>

    <!-- Banker 区域筹码 -->
    <div class="chip-area banker-chip-area" v-if="betAmounts.banker > 0">
      <svg viewBox="0 0 78 78" class="chip" :class="getChipClass(betAmounts.banker)">
        <g>
          <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
          <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
          <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
          <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
        </g>
        <text class="chip-value" :class="getChipValueClass(betAmounts.banker)" x="50%" y="50%">
          {{ formatChipValue(betAmounts.banker) }}
        </text>
      </svg>
    </div>

    <!-- Tie 区域筹码 -->
    <div class="chip-area tie-chip-area" v-if="betAmounts.tie > 0">
      <svg viewBox="0 0 78 78" class="chip" :class="getChipClass(betAmounts.tie)">
        <g>
          <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
          <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
          <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
          <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
        </g>
        <text class="chip-value" :class="getChipValueClass(betAmounts.tie)" x="50%" y="50%">
          {{ formatChipValue(betAmounts.tie) }}
        </text>
      </svg>
    </div>

    <!-- Player Pair 区域筹码 -->
    <div class="chip-area player-pair-chip-area" v-if="betAmounts['player-pair'] > 0">
      <svg viewBox="0 0 78 78" class="chip chip-small" :class="getChipClass(betAmounts['player-pair'])">
        <g>
          <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
          <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
          <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
          <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
        </g>
        <text class="chip-value" :class="getChipValueClass(betAmounts['player-pair'])" x="50%" y="50%">
          {{ formatChipValue(betAmounts['player-pair']) }}
        </text>
      </svg>
    </div>

    <!-- Banker Pair 区域筹码 -->
    <div class="chip-area banker-pair-chip-area" v-if="betAmounts['banker-pair'] > 0">
      <svg viewBox="0 0 78 78" class="chip chip-small" :class="getChipClass(betAmounts['banker-pair'])">
        <g>
          <circle class="chip-outer" cx="39" cy="39" r="38.5"></circle>
          <path class="chip-border" d="M38.94 12.5A26.5 26.5 0 1 0 65.44 39a26.529 26.529 0 0 0-26.5-26.5zm0 52A25.5 25.5 0 1 1 64.439 39 25.53 25.53 0 0 1 38.94 64.5z"></path>
          <circle class="chip-center" cx="39" cy="39" r="25.5"></circle>
          <path class="chip-border" d="M38.941 0a39 39 0 1 0 39 39 39.046 39.046 0 0 0-39-39zm-2.088 76.439l.483-8.471a28.99 28.99 0 0 1-4.668-.639l-1.783 8.291a37.277 37.277 0 0 1-12.144-5.051l4.6-7.124a29.143 29.143 0 0 1-8.85-8.851l-7.124 4.6a37.28 37.28 0 0 1-5.045-12.13l8.3-1.784a28.99 28.99 0 0 1-.639-4.668l-8.483.482C1.463 40.4 1.44 39.7 1.44 39s.023-1.391.061-2.08l8.478.483a28.99 28.99 0 0 1 .639-4.668l-8.3-1.785a37.275 37.275 0 0 1 5.047-12.142l7.126 4.6a29.143 29.143 0 0 1 8.85-8.851l-4.6-7.125a37.28 37.28 0 0 1 12.142-5.05l1.786 8.3a28.99 28.99 0 0 1 4.668-.639l-.483-8.484c.692-.038 1.388-.061 2.089-.061s1.4.023 2.087.061l-.483 8.484a28.99 28.99 0 0 1 4.668.639L47 2.381a37.276 37.276 0 0 1 12.14 5.05l-4.6 7.126a29.14 29.14 0 0 1 8.849 8.85l7.127-4.6a37.276 37.276 0 0 1 5.044 12.142l-8.3 1.785a28.99 28.99 0 0 1 .64 4.666l8.478-.483c.038.689.061 1.382.061 2.08s-.023 1.4-.062 2.1l-8.477-.486a28.99 28.99 0 0 1-.639 4.668l8.3 1.784a37.282 37.282 0 0 1-5.046 12.132l-7.125-4.6a29.14 29.14 0 0 1-8.849 8.85l4.6 7.125A37.275 37.275 0 0 1 47 75.619l-1.783-8.291a28.99 28.99 0 0 1-4.668.639l.483 8.471c-.691.038-1.386.061-2.087.061s-1.401-.022-2.092-.06z"></path>
        </g>
        <text class="chip-value" :class="getChipValueClass(betAmounts['banker-pair'])" x="50%" y="50%">
          {{ formatChipValue(betAmounts['banker-pair']) }}
        </text>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview 百家乐筹码显示层 - 核心交互层
 * @description 处理投注交互，显示各区域总金额（使用SVG筹码）
 */
import { useoverLayerStore } from '@/stores/overLayerStore'
import { ref, reactive } from 'vue'
import { useChipFlyStore } from '@/stores/chipFlyStore'
// import { useGameStore } from '@/stores/gameStore'
// import { useBettingStore } from '@/stores/bettingStore'

// ========================= 类型定义 =========================
type BetZone = 'player' | 'banker' | 'tie' | 'player-pair' | 'banker-pair'

// ========================= Store =========================
const chipFlyStore = useChipFlyStore()
// const gameStore = useGameStore()
// const bettingStore = useBettingStore()
const overLayerStore = useoverLayerStore()


// ========================= DOM引用 =========================
const playerClickArea = ref<HTMLElement>()
const bankerClickArea = ref<HTMLElement>()
const tieClickArea = ref<HTMLElement>()
const playerPairClickArea = ref<HTMLElement>()
const bankerPairClickArea = ref<HTMLElement>()

// ========================= 状态管理 =========================

// 默认筹码值（从筹码选择器获取）
const defaultChipValue = ref(100)

// 各区域的投注总金额
const betAmounts = reactive<Record<BetZone, number>>({
  player: 0,
  banker: 0,
  tie: 0,
  'player-pair': 0,
  'banker-pair': 0
})

// ========================= 方法 =========================

/**
 * 获取点击区域的中心坐标
 */
const getZoneCenterPosition = (zone: BetZone): { x: number, y: number } => {
  const selector = `.${zone.replace('-', '-')}-chip-area`
  const chipArea = document.querySelector(selector) as HTMLElement

  if (chipArea) {
    const rect = chipArea.getBoundingClientRect()
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    }
  }

  // 默认位置
  return {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  }
}

/**
 * 处理投注
 */
const handleBet = (zone: BetZone): void => {
  console.log(`[BettingArea] 点击投注区域: ${zone}, 筹码值: ${defaultChipValue.value}`)

  const targetPosition = getZoneCenterPosition(zone)
  overLayerStore.open('chipFly')

  chipFlyStore.startFly({
    value: defaultChipValue.value,
    to: targetPosition,
    zone,
    onComplete: (completedZone, amount) => {
      betAmounts[completedZone] += amount
      console.log(`[BettingArea] 更新${completedZone}区域金额: +${amount}, 总计: ${betAmounts[completedZone]}`)
    }
  })
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

/**
 * 设置默认筹码值
 */
const setDefaultChipValue = (value: number): void => {
  defaultChipValue.value = value
  console.log(`[BettingArea] 默认筹码值更新为: ${value}`)
}

/**
 * 重置所有投注
 */
const resetBets = (): void => {
  Object.keys(betAmounts).forEach(key => {
    betAmounts[key as BetZone] = 0
  })
  chipFlyStore.reset()
}

defineExpose({
  setDefaultChipValue,
  resetBets
})
</script>

<style scoped>
/* ========================= 层容器 ========================= */
.show-chip-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

/* ========================= 透明点击区域 ========================= */
.click-area {
  position: absolute;
  background: transparent;
  cursor: pointer;
}

.player-click-area {
  top: 0;
  left: 0;
  width: calc(50% - 70px);
  height: calc(100% - 48px);
}

.banker-click-area {
  top: 0;
  right: 0;
  width: calc(50% - 70px);
  height: calc(100% - 48px);
}

.tie-click-area {
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 31%;
  height: calc(100% - 78px);
}

.player-pair-click-area {
  bottom: 0;
  left: 0;
  width: calc(50% - 2px);
  height: 45px;
}

.banker-pair-click-area {
  bottom: 0;
  right: 0;
  width: calc(50% - 2px);
  height: 45px;
}

/* ========================= 筹码区域定位 ========================= */
.chip-area {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
  background-color: #ffffff;
  border-radius: 50%;
}

.player-chip-area {
  bottom: 60px;
  left: 20%;
  transform: translateX(-50%);
}

.banker-chip-area {
  bottom: 60px;
  right: 20%;
  transform: translateX(50%);
}

.tie-chip-area {
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
}

.player-pair-chip-area {
  bottom: 15px;
  left: 20%;
  transform: translateX(-50%);
}

.banker-pair-chip-area {
  bottom: 15px;
  right: 20%;
  transform: translateX(50%);
}

/* ========================= SVG筹码样式 ========================= */
.chip {
  width: 40px;
  height: 40px;
}

.chip-small {
  width: 32px;
  height: 32px;
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

/* ========================= 筹码颜色（严格按照选择器样式） ========================= */

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

/* ========================= 交互反馈 ========================= */
.click-area:hover {
  background: rgba(255, 255, 255, 0.05);
}

.click-area:active {
  background: rgba(255, 255, 255, 0.1);
}
</style>
