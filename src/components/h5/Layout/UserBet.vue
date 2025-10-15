<template>
  <div class="user-bet-container">
    <!-- 投注区域 - 固定高度和位置 -->
    <div class="betting-area-section"  :class="{ 'dealing-mode': gameStatus === 'dealing' }">
      <BettingAreaLayout />
    </div>

    <!-- 筹码操作栏 - 固定高度和位置 -->
    <div class="chip-action-section"  :class="{ 'dealing-mode': gameStatus === 'dealing' }">
      <ChipAction />
    </div>

    <!-- 统计信息栏 - 固定在底部 -->
    <div class="game-count-section">
      <GameCount />
    </div>

    <!-- 悬浮按钮 - 始终显示 -->
    <ButtonLuZhuList class="floating-button-left" />
    <ButtonSet class="floating-button-right" />
  </div>
</template>

<script setup lang="ts">
// 组件导入
import BettingAreaLayout from '@/components/h5/BetArea/BettingAreaLayout.vue'
import ChipAction from '@/components/h5/Layout/ChipAction.vue'
import GameCount from '@/components/h5/Layout/GameCount.vue'
import ButtonSet from '@/components/h5/FloatingUI/ButtonSet.vue'
import ButtonLuZhuList from '@/components/h5/FloatingUI/ButtonLuZhuList.vue'

import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// 获取游戏状态管理器
const gameStore = useGameStore()

// 计算属性：获取当前游戏状态
const gameStatus = computed(() => gameStore.gameStatus)

</script>

<style scoped>
.user-bet-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background: linear-gradient(to bottom,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.9) 100%
  );
  overflow: hidden;
}

/* 固定布局的三个主要区域 */

/* 统计信息栏 - 固定在底部 */
.game-count-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  z-index: 100;
  background: rgba(0, 0, 0, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 筹码操作栏 - 固定在统计栏上方 */
.chip-action-section {
  position: absolute;
  bottom: 45px; /* 统计栏高度 */
  left: 0;
  right: 0;
  height: 49px;
  z-index: 99;
}
.chip-action-section.dealing-mode {
  height: 42px;
}

/* 投注区域 - 固定在筹码操作栏上方 */
.betting-area-section {
  position: absolute;
  bottom: 114px;
  left: 4px;
  right: 4px;
  height: 230px;
  z-index: 98;
  justify-content: center;
  overflow: hidden;
}
.betting-area-section.dealing-mode {
  height: 180px;
  bottom: 107px;
}

/* 悬浮按钮位置 */
.floating-button-left {
  position: absolute;
  bottom: 49px; /* 在统计栏上方 */
  left: 4px;
  z-index: 500;
}

.floating-button-right {
  position: absolute;
  bottom: 49px; /* 在统计栏上方 */
  right: 4px;
  z-index: 500;
}


/* 安全区域适配 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .game-count-section {
    padding-bottom: env(safe-area-inset-bottom);
    height: calc(49px + env(safe-area-inset-bottom));
  }

  .chip-action-section {
    bottom: calc(45px + env(safe-area-inset-bottom));
  }

  .betting-area-section {
    bottom: calc(114px + env(safe-area-inset-bottom));
  }
  .betting-area-section.dealing-mode {
    bottom: calc(87px + env(safe-area-inset-bottom));
  }

  .floating-button-left,
  .floating-button-right {
    bottom: calc(69px + env(safe-area-inset-bottom));
  }
}
</style>
