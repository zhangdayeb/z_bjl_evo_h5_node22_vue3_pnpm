<template>
  <div class="show-card-layer">
    <!-- Player 扑克牌显示 -->
    <div class="cards-container player-cards">
      <div v-for="(card, index) in resultData.player" :key="`p-${index}`"
           class="card" :class="{ horizontal: index === 2 }">
        <div class="card-face">
          <div class="card-value">{{ card.value }}</div>
          <div class="card-suit" :class="card.color">{{ card.suit }}</div>
        </div>
      </div>
    </div>

    <!-- Banker 扑克牌显示 -->
    <div class="cards-container banker-cards">
      <div v-for="(card, index) in resultData.banker" :key="`b-${index}`"
           class="card" :class="{ horizontal: index === 2 }">
        <div class="card-face">
          <div class="card-value">{{ card.value }}</div>
          <div class="card-suit" :class="card.color">{{ card.suit }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview 百家乐开牌显示层
 * @description 显示开牌阶段的扑克牌
 */

import { ref, onMounted } from 'vue'
// import { useGameStore } from '@/stores/gameStore'

// ========================= 类型定义 =========================

interface Card {
  value: string
  suit: string
  color: 'red' | 'black'
}

// ========================= Store =========================
// const gameStore = useGameStore()
// TODO: 实际项目中从 gameStore 获取数据
// const resultData = computed(() => gameStore.gameResult)

// ========================= 模拟数据 =========================
const resultData = ref({
  player: [
    { value: '7', suit: '♣', color: 'black' },
    { value: '5', suit: '♦', color: 'red' },
    { value: 'K', suit: '♠', color: 'black' }
  ] as Card[],
  banker: [
    { value: '8', suit: '♥', color: 'red' },
    { value: '6', suit: '♠', color: 'black' },
    { value: 'A', suit: '♦', color: 'red' }
  ] as Card[]
})

// ========================= 生命周期 =========================

onMounted(() => {
  console.log('[ShowCard] 开牌层已加载')
})
</script>

<style scoped>
/* ========================= 层容器 ========================= */
.show-card-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 4;
}

/* ========================= 扑克牌容器 ========================= */
.cards-container {
  position: absolute;
  top: 30%;
  display: flex;
  gap: 2px;
  align-items: center;
  animation: fadeInCards 0.5s ease-out;
}

/* Player 牌位置 */
.player-cards {
  left: calc(25% - 60px);
}

/* Banker 牌位置 */
.banker-cards {
  right: calc(25% - 60px);
}

/* ========================= 扑克牌样式 ========================= */
.card {
  width: 36px;
  height: 54px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
  border-radius: 4px;
  border: 1px solid #d0d0d0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
  animation: flipCard 0.6s ease-out;
}

/* 横向牌（第三张） */
.card.horizontal {
  transform: rotate(90deg);
  margin: 0 8px;
}

.banker-cards .card.horizontal {
  transform: rotate(-90deg);
}

/* ========================= 牌面样式 ========================= */
.card-face {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.card-value {
  font-size: 20px;
  font-weight: bold;
  font-family: Arial, sans-serif;
}

.card-suit {
  font-size: 16px;
}

.card-suit.red {
  color: #E74C3C;
}

.card-suit.black {
  color: #000000;
}

/* ========================= 动画定义 ========================= */

/* 扑克牌淡入 */
@keyframes fadeInCards {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 翻牌动画 */
@keyframes flipCard {
  0% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

/* ========================= 延迟动画 ========================= */

/* 为每张牌添加渐进延迟 */
.card:nth-child(1) {
  animation-delay: 0ms;
}

.card:nth-child(2) {
  animation-delay: 200ms;
}

.card:nth-child(3) {
  animation-delay: 400ms;
}
</style>
