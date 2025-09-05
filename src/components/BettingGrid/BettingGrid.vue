<!-- components/BettingGrid/BettingGrid.vue -->
<template>
  <div class="betting-grid" :class="gridClass">
    <!-- 主投注区 -->
    <div class="main-bets">
      <BetSpot
        type="player"
        :amount="getBetAmount('player')"
        :show-stats="showStats"
        @place-bet="placeBet('player', $event)"
        class="player-spot"
      />
      
      <BetSpot
        type="banker"
        :amount="getBetAmount('banker')"
        :show-stats="showStats"
        @place-bet="placeBet('banker', $event)"
        class="banker-spot"
      />
      
      <BetSpot
        type="tie"
        :amount="getBetAmount('tie')"
        :show-stats="showStats"
        @place-bet="placeBet('tie', $event)"
        class="tie-spot"
      />
    </div>
    
    <!-- 边注区 -->
    <div class="side-bets" v-if="showSideBets">
      <BetSpot
        type="player-pair"
        :amount="getBetAmount('player-pair')"
        @place-bet="placeBet('player-pair', $event)"
        class="player-pair-spot"
      />
      
      <BetSpot
        type="banker-pair"
        :amount="getBetAmount('banker-pair')"
        @place-bet="placeBet('banker-pair', $event)"
        class="banker-pair-spot"
      />
    </div>
    
    <!-- 投注限额显示 -->
    <div class="bet-limits">
      <span class="limit-min">最小: {{ formatCurrency(limits.min) }}</span>
      <span class="limit-max">最大: {{ formatCurrency(limits.max) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import BetSpot from './BetSpot.vue'
import { useBettingStore } from '@/stores/betting'
import { useGameStore } from '@/stores/game'
import { useUIStore } from '@/stores/ui'

const bettingStore = useBettingStore()
const gameStore = useGameStore()
const uiStore = useUIStore()

const showSideBets = computed(() => uiStore.showSideBets)
const showStats = computed(() => uiStore.showBettingStats)

const gridClass = computed(() => ({
  'betting-grid--active': gameStore.isBetsOpen,
  'betting-grid--desktop': uiStore.isDesktop,
  'betting-grid--mobile': uiStore.isMobile,
  'betting-grid--portrait': uiStore.isPortrait
}))

const limits = computed(() => ({
  min: 100,
  max: 10000
}))

function getBetAmount(spot: string): number {
  return bettingStore.bets.get(spot) || 0
}

function placeBet(spot: string, amount: number) {
  bettingStore.placeBet(spot, amount)
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0
  }).format(amount)
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.betting-grid {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: opacity $duration-normal;
  
  &:not(&--active) {
    opacity: 0.6;
    pointer-events: none;
  }
  
  .main-bets {
    display: grid;
    grid-template-areas: 
      "player banker"
      "tie tie";
    gap: 15px;
    
    .player-spot {
      grid-area: player;
    }
    
    .banker-spot {
      grid-area: banker;
    }
    
    .tie-spot {
      grid-area: tie;
      max-width: 60%;
      margin: 0 auto;
    }
  }
  
  .side-bets {
    display: flex;
    gap: 15px;
    justify-content: center;
    
    > * {
      flex: 1;
      max-width: 200px;
    }
  }
  
  .bet-limits {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 15px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    
    span {
      background: rgba(0, 0, 0, 0.5);
      padding: 4px 8px;
      border-radius: 4px;
    }
  }
  
  // 桌面版布局
  &--desktop {
    max-width: 800px;
    margin: 0 auto;
    
    .main-bets {
      grid-template-columns: 1fr 1fr;
    }
  }
  
  // 移动版布局
  &--mobile {
    padding: 10px;
    
    .main-bets {
      gap: 10px;
    }
    
    .side-bets {
      flex-direction: column;
    }
    
    .bet-limits {
      position: static;
      justify-content: center;
      margin-top: 10px;
    }
  }
  
  // 竖屏布局
  &--portrait {
    .main-bets {
      grid-template-areas: 
        "player"
        "banker"
        "tie";
      grid-template-columns: 1fr;
    }
    
    .tie-spot {
      max-width: 100%;
    }
  }
}
</style>