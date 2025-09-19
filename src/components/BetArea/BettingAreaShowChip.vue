<template>
  <div class="show-chip-layer">
    <!-- =================== 透明点击区域 =================== -->
    <!-- Player 点击区域 -->
    <div class="click-area player-click-area" @click="handleBet('player')"></div>

    <!-- Banker 点击区域 -->
    <div class="click-area banker-click-area" @click="handleBet('banker')"></div>

    <!-- Tie 点击区域 -->
    <div class="click-area tie-click-area" @click="handleBet('tie')"></div>

    <!-- Player Pair 点击区域 -->
    <div class="click-area player-pair-click-area" @click="handleBet('player-pair')"></div>

    <!-- Banker Pair 点击区域 -->
    <div class="click-area banker-pair-click-area" @click="handleBet('banker-pair')"></div>

    <!-- =================== 筹码显示区域 =================== -->
    <!-- Player 区域筹码 -->
    <div class="chip-area player-chip-area" v-if="chipStacks.player.length">
      <div class="chip-stack" v-for="(stack, index) in chipStacks.player" :key="`p-stack-${index}`">
        <div
          v-for="(chip, chipIndex) in stack"
          :key="`p-chip-${index}-${chipIndex}`"
          class="chip"
          :class="`chip-${chip.value}`"
          :style="{ bottom: `${chipIndex * 3}px` }"
        >
          <span class="chip-value">{{ formatChipValue(chip.value) }}</span>
        </div>
      </div>
    </div>

    <!-- Banker 区域筹码 -->
    <div class="chip-area banker-chip-area" v-if="chipStacks.banker.length">
      <div class="chip-stack" v-for="(stack, index) in chipStacks.banker" :key="`b-stack-${index}`">
        <div
          v-for="(chip, chipIndex) in stack"
          :key="`b-chip-${index}-${chipIndex}`"
          class="chip"
          :class="`chip-${chip.value}`"
          :style="{ bottom: `${chipIndex * 3}px` }"
        >
          <span class="chip-value">{{ formatChipValue(chip.value) }}</span>
        </div>
      </div>
    </div>

    <!-- Tie 区域筹码 -->
    <div class="chip-area tie-chip-area" v-if="chipStacks.tie.length">
      <div class="chip-stack" v-for="(stack, index) in chipStacks.tie" :key="`t-stack-${index}`">
        <div
          v-for="(chip, chipIndex) in stack"
          :key="`t-chip-${index}-${chipIndex}`"
          class="chip"
          :class="`chip-${chip.value}`"
          :style="{ bottom: `${chipIndex * 3}px` }"
        >
          <span class="chip-value">{{ formatChipValue(chip.value) }}</span>
        </div>
      </div>
    </div>

    <!-- Player Pair 区域筹码 -->
    <div class="chip-area player-pair-chip-area" v-if="chipStacks['player-pair'].length">
      <div class="chip-stack" v-for="(stack, index) in chipStacks['player-pair']" :key="`pp-stack-${index}`">
        <div
          v-for="(chip, chipIndex) in stack"
          :key="`pp-chip-${index}-${chipIndex}`"
          class="chip chip-small"
          :class="`chip-${chip.value}`"
          :style="{ bottom: `${chipIndex * 2}px` }"
        >
          <span class="chip-value">{{ formatChipValue(chip.value) }}</span>
        </div>
      </div>
    </div>

    <!-- Banker Pair 区域筹码 -->
    <div class="chip-area banker-pair-chip-area" v-if="chipStacks['banker-pair'].length">
      <div class="chip-stack" v-for="(stack, index) in chipStacks['banker-pair']" :key="`bp-stack-${index}`">
        <div
          v-for="(chip, chipIndex) in stack"
          :key="`bp-chip-${index}-${chipIndex}`"
          class="chip chip-small"
          :class="`chip-${chip.value}`"
          :style="{ bottom: `${chipIndex * 2}px` }"
        >
          <span class="chip-value">{{ formatChipValue(chip.value) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview 百家乐筹码显示层 - 核心交互层
 * @description 处理投注交互，显示筹码堆叠
 */

import { ref, reactive } from 'vue'
// import { useGameStore } from '@/stores/gameStore'
// import { useBettingStore } from '@/stores/bettingStore'

// ========================= 类型定义 =========================

type BetZone = 'player' | 'banker' | 'tie' | 'player-pair' | 'banker-pair'

interface Chip {
  value: number
  id?: string
}

type ChipStack = Chip[]

// ========================= Store =========================
// const gameStore = useGameStore()
// const bettingStore = useBettingStore()

// ========================= 状态管理 =========================

// 默认筹码值（从筹码选择器获取）
const defaultChipValue = ref(100)

// 各区域的筹码堆叠
const chipStacks = reactive<Record<BetZone, ChipStack[]>>({
  player: [],
  banker: [],
  tie: [],
  'player-pair': [],
  'banker-pair': []
})

// ========================= 方法 =========================

/**
 * 处理投注
 * @param zone - 投注区域
 */
const handleBet = (zone: BetZone): void => {
  console.log(`[ChipLayer] 点击投注区域: ${zone}, 筹码值: ${defaultChipValue.value}`)

  // 创建新筹码
  const newChip: Chip = {
    value: defaultChipValue.value,
    id: `chip-${Date.now()}-${Math.random()}`
  }

  // 添加到对应区域（简单示例：每次创建新堆叠）
  // 实际项目中可能需要更复杂的堆叠逻辑
  const targetStacks = chipStacks[zone]
  if (targetStacks.length === 0 || targetStacks[targetStacks.length - 1].length >= 5) {
    // 创建新堆叠
    targetStacks.push([newChip])
  } else {
    // 添加到最后一个堆叠
    targetStacks[targetStacks.length - 1].push(newChip)
  }

  // TODO: 调用 store 方法记录投注
  // bettingStore.placeBet({
  //   zone,
  //   amount: defaultChipValue.value
  // })
}

/**
 * 格式化筹码值显示
 */
const formatChipValue = (value: number): string => {
  if (value >= 1000) {
    return `${value / 1000}K`
  }
  return value.toString()
}

/**
 * 设置默认筹码值（从外部筹码选择器调用）
 */
const setDefaultChipValue = (value: number): void => {
  defaultChipValue.value = value
  console.log(`[ChipLayer] 默认筹码值更新为: ${value}`)
}

// 暴露方法供外部使用
defineExpose({
  setDefaultChipValue
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
  /* 调试时可以添加半透明背景 */
  /* background: rgba(255, 255, 255, 0.1); */
  /* border: 1px dashed rgba(255, 255, 255, 0.3); */
}

/* Player 点击区域 */
.player-click-area {
  top: 0;
  left: 0;
  width: calc(50% - 70px);
  height: calc(100% - 48px);
}

/* Banker 点击区域 */
.banker-click-area {
  top: 0;
  right: 0;
  width: calc(50% - 70px);
  height: calc(100% - 48px);
}

/* Tie 点击区域 */
.tie-click-area {
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 31%;
  height: calc(100% - 78px);
}

/* Player Pair 点击区域 */
.player-pair-click-area {
  bottom: 0;
  left: 0;
  width: calc(50% - 2px);
  height: 45px;
}

/* Banker Pair 点击区域 */
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
  gap: 15px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-end;
  pointer-events: none; /* 筹码不阻止点击 */
}

/* Player 筹码区域 */
.player-chip-area {
  bottom: 60px;
  left: 10%;
  width: 30%;
  height: 80px;
}

/* Banker 筹码区域 */
.banker-chip-area {
  bottom: 60px;
  right: 10%;
  width: 30%;
  height: 80px;
}

/* Tie 筹码区域 */
.tie-chip-area {
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  width: 25%;
  height: 60px;
}

/* Player Pair 筹码区域 */
.player-pair-chip-area {
  bottom: 10px;
  left: 15%;
  width: 20%;
  height: 30px;
}

/* Banker Pair 筹码区域 */
.banker-pair-chip-area {
  bottom: 10px;
  right: 15%;
  width: 20%;
  height: 30px;
}

/* ========================= 筹码堆叠 ========================= */
.chip-stack {
  position: relative;
  height: 100%;
  animation: stackDrop 0.5s ease-out;
}

/* ========================= 筹码样式 ========================= */
.chip {
  position: absolute;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 11px;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.3),
    inset 0 1px 2px rgba(255, 255, 255, 0.3);
  border: 2px solid;
  animation: chipBounce 0.3s ease-out;
  pointer-events: none;
}

/* 小筹码（对子区域） */
.chip-small {
  width: 28px;
  height: 28px;
  font-size: 9px;
}

/* ========================= 筹码颜色 ========================= */

/* $10 - 蓝色 */
.chip-10 {
  background: linear-gradient(135deg, #2E7CE6 0%, #1E5AAF 100%);
  border-color: #1A4F9C;
}

/* $50 - 红色 */
.chip-50 {
  background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%);
  border-color: #A93226;
}

/* $100 - 绿色 */
.chip-100 {
  background: linear-gradient(135deg, #27AE60 0%, #229954 100%);
  border-color: #1E8449;
}

/* $500 - 紫色 */
.chip-500 {
  background: linear-gradient(135deg, #8E44AD 0%, #7D3C98 100%);
  border-color: #6C3483;
}

/* $1000 - 黄色 */
.chip-1000 {
  background: linear-gradient(135deg, #F39C12 0%, #E67E22 100%);
  border-color: #D68910;
  color: #2C3E50;
}

/* $5000 - 黑色 */
.chip-5000 {
  background: linear-gradient(135deg, #34495E 0%, #2C3E50 100%);
  border-color: #1C2833;
}

/* ========================= 筹码装饰 ========================= */
.chip::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 85%;
  height: 85%;
  border-radius: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.3);
}

.chip-value {
  position: relative;
  z-index: 1;
}

/* ========================= 交互反馈 ========================= */
.click-area:hover {
  background: rgba(255, 255, 255, 0.05);
}

.click-area:active {
  background: rgba(255, 255, 255, 0.1);
}

/* ========================= 动画 ========================= */

/* 筹码堆叠下落 */
@keyframes stackDrop {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 筹码弹跳 */
@keyframes chipBounce {
  0% {
    transform: scale(0);
  }
  60% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 渐进动画延迟 */
.chip-stack:nth-child(1) { animation-delay: 0ms; }
.chip-stack:nth-child(2) { animation-delay: 100ms; }
.chip-stack:nth-child(3) { animation-delay: 200ms; }
.chip-stack:nth-child(4) { animation-delay: 300ms; }
.chip-stack:nth-child(5) { animation-delay: 400ms; }
</style>
