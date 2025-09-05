<!-- views/GameView.vue -->
<template>
  <div class="game-view" :class="viewClass">
    <!-- 视频背景（桌面版） -->
    <VideoBackground v-if="isDesktop" />
    
    <!-- 顶部状态栏 -->
    <div class="status-bar">
      <GameTimer />
      <GamePhaseIndicator />
      <Balance />
    </div>
    
    <!-- 主游戏区域 -->
    <div class="game-area">
      <!-- 发牌区 -->
      <div class="dealing-area">
        <CardHand side="player" :cards="playerCards" />
        <CardHand side="banker" :cards="bankerCards" />
      </div>
      
      <!-- 投注网格 -->
      <BettingGrid />
      
      <!-- 路单区域 -->
      <div class="roads-container" v-if="showRoads">
        <BigRoad />
        <div class="small-roads">
          <BigEyeRoad />
          <SmallRoad />
          <CockroachRoad />
        </div>
      </div>
    </div>
    
    <!-- 底部控制区 -->
    <div class="control-area">
      <ChipSelector />
      <ActionButtons />
    </div>
    
    <!-- 赢钱展示 -->
    <WinDisplay />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/game'
import { useUIStore } from '@/stores/ui'
import { useResponsive } from '@/composables/useResponsive'

// 组件导入
import VideoBackground from '@/components/Layout/VideoBackground.vue'
import GameTimer from '@/components/GamePhase/Timer.vue'
import GamePhaseIndicator from '@/components/GamePhase/PhaseIndicator.vue'
import Balance from '@/components/GamePhase/Balance.vue'
import CardHand from '@/components/Cards/CardHand.vue'
import BettingGrid from '@/components/BettingGrid/BettingGrid.vue'
import BigRoad from '@/components/Roads/BigRoad.vue'
import BigEyeRoad from '@/components/Roads/BigEyeRoad.vue'
import SmallRoad from '@/components/Roads/SmallRoad.vue'
import CockroachRoad from '@/components/Roads/CockroachRoad.vue'
import ChipSelector from '@/components/Chips/ChipSelector.vue'
import ActionButtons from '@/components/Controls/ActionButtons.vue'
import WinDisplay from '@/components/GamePhase/WinDisplay.vue'

const gameStore = useGameStore()
const uiStore = useUIStore()
const { isDesktop, isMobile, isPortrait } = useResponsive()

const viewClass = computed(() => ({
  'game-view--desktop': isDesktop.value,
  'game-view--mobile': isMobile.value,
  'game-view--portrait': isPortrait.value
}))

const showRoads = computed(() => isDesktop.value || !isPortrait.value)

const playerCards = computed(() => gameStore.playerHand)
const bankerCards = computed(() => gameStore.bankerHand)

onMounted(() => {
  // 初始化游戏
  gameStore.initGame()
})

onUnmounted(() => {
  // 清理
  gameStore.cleanup()
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.game-view {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: $bg-table;
  position: relative;
  overflow: hidden;
  
  .status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(10px);
    z-index: 100;
  }
  
  .game-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    gap: 20px;
    
    .dealing-area {
      display: flex;
      gap: 40px;
      margin-bottom: 20px;
    }
    
    .roads-container {
      display: flex;
      gap: 15px;
      margin-top: 20px;
      
      .small-roads {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
    }
  }
  
  .control-area {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    z-index: 100;
  }
  
  // 移动端适配
  &--mobile {
    .game-area {
      padding: 10px;
      gap: 10px;
      
      .dealing-area {
        gap: 20px;
        margin-bottom: 10px;
      }
    }
    
    .control-area {
      padding: 10px;
    }
  }
  
  // 竖屏适配
  &--portrait {
    .game-area {
      .dealing-area {
        flex-direction: column;
        gap: 10px;
      }
      
      .roads-container {
        flex-direction: column;
        width: 100%;
        
        .small-roads {
          flex-direction: row;
          justify-content: space-between;
        }
      }
    }
  }
}
</style>