<!-- components/BettingGrid/BetSpot.vue -->
<template>
  <div 
    class="bet-spot"
    :class="[
      `bet-spot--${type}`,
      {
        'bet-spot--active': isActive,
        'bet-spot--has-bet': hasBet,
        'bet-spot--winning': isWinning,
        'bet-spot--pulse': isPulsing
      }
    ]"
    @click="handleClick"
    @mouseenter="handleHover(true)"
    @mouseleave="handleHover(false)"
  >
    <!-- SVG 背景 -->
    <svg class="bet-spot__bg" viewBox="0 0 200 100">
      <defs>
        <linearGradient :id="`gradient-${type}`" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :style="`stop-color:${gradientStart};stop-opacity:0.9`" />
          <stop offset="100%" :style="`stop-color:${gradientEnd};stop-opacity:0.7`" />
        </linearGradient>
        
        <!-- 发光效果 -->
        <filter :id="`glow-${type}`">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <rect
        x="2" y="2" 
        width="196" height="96"
        rx="8" ry="8"
        :fill="`url(#gradient-${type})`"
        stroke="rgba(255,255,255,0.3)"
        stroke-width="2"
        :filter="isHovered ? `url(#glow-${type})` : ''"
      />
    </svg>
    
    <!-- 投注区标签 -->
    <div class="bet-spot__content">
      <div class="bet-spot__label">
        {{ label }}
      </div>
      
      <!-- 赔率显示 -->
      <div class="bet-spot__payout">
        {{ payout }}
      </div>
      
      <!-- 筹码堆叠 -->
      <transition name="chip-stack">
        <div v-if="hasBet" class="bet-spot__chips">
          <ChipStack :amount="amount" :size="chipSize" />
        </div>
      </transition>
      
      <!-- 投注统计 -->
      <div v-if="showStats" class="bet-spot__stats">
        <span class="stat-count">{{ betCount }}</span>
        <span class="stat-amount">{{ formatAmount(totalBets) }}</span>
      </div>
    </div>
    
    <!-- 赢钱动画效果 -->
    <transition name="win-effect">
      <div v-if="isWinning" class="bet-spot__win-effect">
        <div class="sparkles"></div>
        <div class="glow-ring"></div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ChipStack from '../Chips/ChipStack.vue'
import { useBettingStore } from '@/stores/betting'
import { useGameStore } from '@/stores/game'

const props = defineProps<{
  type: 'player' | 'banker' | 'tie' | 'player-pair' | 'banker-pair'
  amount: number
  betCount?: number
  totalBets?: number
  showStats?: boolean
}>()

const emit = defineEmits<{
  'place-bet': [amount: number]
  'hover': [isHovered: boolean]
}>()

const bettingStore = useBettingStore()
const gameStore = useGameStore()

const isHovered = ref(false)
const isPulsing = ref(false)

// 计算属性
const isActive = computed(() => gameStore.isBetsOpen)
const hasBet = computed(() => props.amount > 0)
const isWinning = computed(() => 
  gameStore.winningSpots.includes(props.type)
)

const chipSize = computed(() => {
  if (window.innerWidth < 768) return 'small'
  if (window.innerWidth < 1024) return 'medium'
  return 'large'
})

const label = computed(() => {
  const labels = {
    'player': '闲',
    'banker': '庄',
    'tie': '和',
    'player-pair': '闲对',
    'banker-pair': '庄对'
  }
  return labels[props.type]
})

const payout = computed(() => {
  const payouts = {
    'player': '1:1',
    'banker': '0.95:1',
    'tie': '8:1',
    'player-pair': '11:1',
    'banker-pair': '11:1'
  }
  return payouts[props.type]
})

const gradientColors = {
  'player': { start: '#0096FF', end: '#0056b3' },
  'banker': { start: '#FF9792', end: '#c62828' },
  'tie': { start: '#0DD80C', end: '#2e7d32' },
  'player-pair': { start: '#0096FF', end: '#0056b3' },
  'banker-pair': { start: '#FF9792', end: '#c62828' }
}

const gradientStart = computed(() => gradientColors[props.type].start)
const gradientEnd = computed(() => gradientColors[props.type].end)

// 方法
function handleClick() {
  if (isActive.value) {
    emit('place-bet', bettingStore.selectedChipValue)
    // 添加点击动画
    isPulsing.value = true
    setTimeout(() => {
      isPulsing.value = false
    }, 300)
  }
}

function handleHover(hover: boolean) {
  isHovered.value = hover
  emit('hover', hover)
}

function formatAmount(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`
  }
  return amount.toString()
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.bet-spot {
  position: relative;
  cursor: pointer;
  user-select: none;
  transition: transform $duration-fast;
  
  &--player {
    .bet-spot__bg {
      filter: drop-shadow(0 4px 8px rgba(0, 150, 255, 0.3));
    }
  }
  
  &--banker {
    .bet-spot__bg {
      filter: drop-shadow(0 4px 8px rgba(255, 151, 146, 0.3));
    }
  }
  
  &--tie {
    .bet-spot__bg {
      filter: drop-shadow(0 4px 8px rgba(13, 216, 12, 0.3));
    }
  }
  
  &--active:hover {
    transform: scale(1.05);
  }
  
  &--pulse {
    animation: pulse 0.3s ease-out;
  }
  
  &--winning {
    animation: winning-glow 1s ease-in-out infinite;
  }
  
  &__bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
  &__content {
    position: relative;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  
  &__label {
    font-size: 24px;
    font-weight: bold;
    color: white;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    margin-bottom: 5px;
  }
  
  &__payout {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.9);
    background: rgba(0, 0, 0, 0.3);
    padding: 2px 8px;
    border-radius: 4px;
  }
  
  &__chips {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  &__stats {
    position: absolute;
    bottom: 5px;
    right: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    font-size: 11px;
    color: rgba(255, 255, 255, 0.8);
    
    .stat-count {
      background: rgba(0, 0, 0, 0.5);
      padding: 1px 4px;
      border-radius: 3px;
      margin-bottom: 2px;
    }
    
    .stat-amount {
      background: rgba(255, 215, 0, 0.3);
      padding: 1px 4px;
      border-radius: 3px;
    }
  }
  
  &__win-effect {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    
    .sparkles {
      position: absolute;
      width: 100%;
      height: 100%;
      background: url('@/assets/images/sparkles.png') center/cover;
      animation: sparkle 1s linear infinite;
    }
    
    .glow-ring {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 150%;
      height: 150%;
      transform: translate(-50%, -50%);
      border: 3px solid gold;
      border-radius: 50%;
      animation: expand 1s ease-out infinite;
    }
  }
}

// 动画
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes winning-glow {
  0%, 100% { 
    filter: brightness(1) drop-shadow(0 0 10px gold);
  }
  50% { 
    filter: brightness(1.3) drop-shadow(0 0 20px gold);
  }
}

@keyframes sparkle {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

@keyframes expand {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

// 过渡动画
.chip-stack-enter-active,
.chip-stack-leave-active {
  transition: all 0.3s ease;
}

.chip-stack-enter-from {
  transform: scale(0);
  opacity: 0;
}

.chip-stack-leave-to {
  transform: scale(1.2);
  opacity: 0;
}

.win-effect-enter-active {
  animation: fadeIn 0.3s ease;
}

.win-effect-leave-active {
  animation: fadeOut 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>