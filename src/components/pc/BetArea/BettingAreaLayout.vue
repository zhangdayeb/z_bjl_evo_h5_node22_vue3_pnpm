<template>
  <div class="betting-container" :class="`${gamePhase}-phase`">
    <!-- 基础展示层 -->
    <BettingAreaMain />

    <!-- 用户统计信息层 - 始终显示 -->
    <BettingAreaShowUserBetMsg />

    <!-- 筹码显示层 - 始终显示（dealing阶段禁用交互） -->
    <BettingAreaShowChip :disabled="gamePhase === 'dealing'" />

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
/* PC版投注容器 - 适应横向宽屏布局 */
.betting-container {
  width: 100%;
  height: 125px;
  max-width: 700px;
  margin: 0 auto;
  position: relative;
  background: transparent;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  padding: 0;
}
</style>
