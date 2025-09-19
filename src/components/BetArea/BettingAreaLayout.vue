<template>
  <div class="betting-container" :class="`${gamePhase}-phase`">
    <!-- 基础展示层 -->
    <BettingAreaMain />

    <!-- 用户统计信息层 - 投注阶段显示 -->
    <BettingAreaShowUserBetMsg v-if="gamePhase === 'betting'" />

    <!-- 筹码显示层 - 投注阶段显示（包含交互） -->
    <BettingAreaShowChip v-if="gamePhase === 'betting'" />

    <!-- 开牌显示层 - 开牌阶段显示 -->
    <BettingAreaShowCard v-if="gamePhase === 'dealing'" />
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview 百家乐投注区域容器组件
 * @description 管理所有投注区域图层，根据游戏状态控制各图层显示
 */

import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import BettingAreaMain from './BettingAreaMain.vue'
import BettingAreaShowChip from './BettingAreaShowChip.vue'
import BettingAreaShowUserBetMsg from './BettingAreaShowUserBetMsg.vue'
import BettingAreaShowCard from './BettingAreaShowCard.vue'

// ========================= Store 集成 =========================

const gameStore = useGameStore()

const gamePhase = computed(() => {
  return gameStore.gameStatus // 'betting' | 'dealing'
})
</script>

<style scoped>
.betting-container {
  width: 100%;
  position: relative;
  background: #35260d;
  padding-left: 4px;
  padding-right: 2px;
  overflow: hidden;
}

/* 投注阶段高度 */
.betting-container.betting-phase {
  height: 230px;
}

/* 开牌阶段高度 */
.betting-container.dealing-phase {
  height: 180px;
}
</style>
