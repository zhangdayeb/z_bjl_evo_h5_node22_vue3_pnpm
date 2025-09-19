<template>
  <div class="betting-main-layer">
    <!-- 主投注区域 -->
    <div class="main-betting-area">

      <!-- =================== 闲家区域 Player =================== -->
      <div class="bet-spot player-spot" :class="{ 'winner-highlight': isWinner('player') }">
        <!-- SVG形状 -->
        <svg class="svg-builder" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="playerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color: rgb(0, 68, 221);"></stop>
              <stop offset="100%" style="stop-color: rgb(0, 58, 136);"></stop>
            </linearGradient>
            <!-- 赢家高亮渐变 -->
            <linearGradient id="playerWinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color: rgb(0, 150, 255);"></stop>
              <stop offset="100%" style="stop-color: rgb(0, 68, 221);"></stop>
            </linearGradient>
          </defs>
          <path d="M 0,2 C0,1 1,0 2,0 L 96,0 C98,0 100,2 100,4 L 100,96 C100,98 98,100 96,100 L 35,100
                   C34,100 33,99 33,98 L 33,45
                   C33,27 18,14 0,14 Z"
                :fill="isWinner('player') ? 'url(#playerWinGradient)' : 'url(#playerGradient)'"
                stroke="rgba(0, 68, 221, 0.8)"
                stroke-width="1"
                :fill-opacity="isWinner('player') ? 1 : 0.8"/>
        </svg>

        <!-- 背景图案 -->
        <div class="spot-background"></div>

        <!-- 赢家发光效果 -->
        <div v-if="isWinner('player')" class="winner-glow"></div>

        <!-- 标题和赔率 -->
        <div class="spot-content">
          <div class="title-section">
            <div class="zone-odds">1:1</div>
            <div class="zone-title">PLAYER</div>
          </div>
        </div>
      </div>

      <!-- =================== 庄家区域 Banker =================== -->
      <div class="bet-spot banker-spot" :class="{ 'winner-highlight': isWinner('banker') }">
        <!-- SVG形状 -->
        <svg class="svg-builder" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="bankerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color: rgb(230, 0, 0);"></stop>
              <stop offset="100%" style="stop-color: rgb(181, 0, 0);"></stop>
            </linearGradient>
            <!-- 赢家高亮渐变 -->
            <linearGradient id="bankerWinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color: rgb(255, 100, 100);"></stop>
              <stop offset="100%" style="stop-color: rgb(230, 0, 0);"></stop>
            </linearGradient>
          </defs>
          <path d="M 0,2 C0,1 1,0 2,0 L 96,0 C98,0 100,2 100,4 L 100,96 C100,98 98,100 96,100 L 35,100
                   C34,100 33,99 33,98 L 33,45
                   C33,27 18,14 0,14 Z"
                :fill="isWinner('banker') ? 'url(#bankerWinGradient)' : 'url(#bankerGradient)'"
                stroke="rgba(230, 0, 0, 0.8)"
                stroke-width="1"
                :fill-opacity="isWinner('banker') ? 1 : 0.8"/>
        </svg>

        <!-- 背景图案 -->
        <div class="spot-background"></div>

        <!-- 赢家发光效果 -->
        <div v-if="isWinner('banker')" class="winner-glow"></div>

        <!-- 标题和赔率 -->
        <div class="spot-content">
          <div class="title-section">
            <div class="zone-odds">0.95:1</div>
            <div class="zone-title">BANKER</div>
          </div>
        </div>
      </div>

      <!-- =================== 和局区域 Tie =================== -->
      <div class="tie-spot" :class="{ 'winner-highlight': isWinner('tie') }">
        <!-- SVG形状 -->
        <svg class="svg-builder" viewBox="0 0 140 190" preserveAspectRatio="none">
          <defs>
            <linearGradient id="tieGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color: rgb(3, 165, 1);"></stop>
              <stop offset="100%" style="stop-color: rgb(0, 113, 0);"></stop>
            </linearGradient>
            <!-- 赢家高亮渐变 -->
            <linearGradient id="tieWinGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color: rgb(13, 216, 12);"></stop>
              <stop offset="100%" style="stop-color: rgb(3, 165, 1);"></stop>
            </linearGradient>
          </defs>
          <path d="M 70,0 C108.66,0 140,31.34 140,70 L 140,184 C140,188 138,190 134,190 L 6,190 C2,190 0,188 0,184 L 0,70 C0,31.34 31.34,0 70,0 Z"
                :fill="isWinner('tie') ? 'url(#tieWinGradient)' : 'url(#tieGradient)'"
                stroke="rgba(3, 165, 1, 0.8)"
                stroke-width="2"
                :fill-opacity="isWinner('tie') ? 1 : 0.8"/>
        </svg>

        <!-- 背景图案 -->
        <div class="spot-background"></div>

        <!-- 赢家发光效果 -->
        <div v-if="isWinner('tie')" class="winner-glow"></div>

        <div class="spot-content">
          <div class="title-section">
            <div class="zone-title">TIE</div>
            <div class="zone-odds">9:1</div>
          </div>
        </div>
      </div>
    </div>

    <!-- =================== 对子投注区域 Pairs =================== -->
    <div class="pairs-row">
      <!-- 闲对 Player Pair -->
      <div class="pair-zone player-pair">
        <div class="pair-zone-content">
          <div class="pair-zone-title">P PAIR</div>
          <div class="pair-zone-odds">11:1</div>
        </div>
      </div>

      <!-- 庄对 Banker Pair -->
      <div class="pair-zone banker-pair">
        <div class="pair-zone-content">
          <div class="pair-zone-title">B PAIR</div>
          <div class="pair-zone-odds">11:1</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview 百家乐投注区域基础展示层
 * @description 纯展示组件，显示基础形状、标题、赔率和赢家高亮效果
 */

import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// ========================= Store =========================

const gameStore = useGameStore()

// ========================= 模拟数据 =========================
// TODO: 实际项目中应该从 gameStore 获取
const resultData = ref({
  winner: 'banker' as 'player' | 'banker' | 'tie'
})

// ========================= 计算属性 =========================

const gamePhase = computed(() => gameStore.gameStatus)

/**
 * 判断是否为赢家
 */
const isWinner = (zone: string): boolean => {
  // 只在开牌阶段显示赢家效果
  if (gamePhase.value !== 'dealing') return false
  return resultData.value.winner === zone
}
</script>

<style scoped>
/* ========================= 基础重置 ========================= */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ========================= 主层容器 ========================= */
.betting-main-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

/* ========================= 主投注区域 ========================= */
.main-betting-area {
  position: relative;
  width: 100%;
  height: calc(100% - 48px);
  display: flex;
  justify-content: space-between;
}

/* ========================= 庄闲区域样式 ========================= */
.bet-spot {
  position: relative;
  width: calc(50% - 2px);
  height: 100%;
}

.spot-content {
  position: absolute;
  bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  z-index: 2;
}

/* Player 区域内容定位 */
.player-spot .spot-content {
  right: 75px;
  left: 15px;
}

/* Banker 区域内容定位 */
.banker-spot .spot-content {
  left: 75px;
  right: 15px;
}

/* ========================= SVG 形状 ========================= */
.svg-builder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  transition: all 0.3s ease;
}

/* Player 区域镜像翻转 */
.player-spot .svg-builder {
  transform: scaleX(-1);
}

/* ========================= 背景图案 ========================= */
.spot-background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url('/src/assets/images/common/rainbowpat.webp');
  background-size: auto;
  background-repeat: repeat;
  background-position: center;
  opacity: 0.15;
  z-index: 1;
  -webkit-mask-image: radial-gradient(ellipse at center,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,1) 40%,
    rgba(0,0,0,0) 70%
  );
  mask-image: radial-gradient(ellipse at center,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,1) 40%,
    rgba(0,0,0,0) 70%
  );
}

/* Player 区域背景定位 */
.player-spot .spot-background {
  right: 75px;
  left: 0;
}

/* Banker 区域背景定位 */
.banker-spot .spot-background {
  left: 75px;
  right: 0;
}

/* ========================= 赢家高亮效果 ========================= */

/* 赢家发光层 */
.winner-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  animation: winnerPulse 2s ease-in-out infinite;
}

/* Player 赢家发光 */
.player-spot .winner-glow {
  background: radial-gradient(ellipse at center,
    rgba(0, 150, 255, 0.3) 0%,
    transparent 70%);
  box-shadow: inset 0 0 50px rgba(0, 150, 255, 0.3);
}

/* Banker 赢家发光 */
.banker-spot .winner-glow {
  background: radial-gradient(ellipse at center,
    rgba(255, 100, 100, 0.3) 0%,
    transparent 70%);
  box-shadow: inset 0 0 50px rgba(255, 100, 100, 0.3);
}

/* Tie 赢家发光 */
.tie-spot .winner-glow {
  background: radial-gradient(ellipse at center,
    rgba(13, 216, 12, 0.3) 0%,
    transparent 70%);
  box-shadow: inset 0 0 50px rgba(13, 216, 12, 0.3);
}

/* 赢家高亮时的边框动画 */
.winner-highlight .svg-builder path {
  stroke-width: 3;
  filter: drop-shadow(0 0 10px currentColor);
  animation: borderGlow 1.5s ease-in-out infinite;
}

/* ========================= 标题和赔率 ========================= */
.title-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.zone-title {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 22px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
  color: #ffffff;
  font-family: 'Palatino', 'Georgia', serif;
  white-space: pre;
}

.zone-odds {
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
  margin-top: 4px;
}

/* Player 赔率颜色 */
.player-spot .zone-odds {
  color: #0096FF;
}

/* Banker 赔率颜色 */
.banker-spot .zone-odds {
  color: #FF9792;
}

/* ========================= 和局区域 ========================= */
.tie-spot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 31%;
  top: 30px;
  height: calc(100% - 30px);
  z-index: 10;
}

.tie-spot .svg-builder {
  z-index: 1;
}

.tie-spot .spot-content {
  position: absolute;
  bottom: 14px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.tie-spot .zone-title {
  font-size: 18px;
  color: white;
}

.tie-spot .zone-odds {
  color: #0DD80C;
  font-size: 13px;
}

/* ========================= 对子区域 ========================= */
.pairs-row {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 4px;
  height: 45px;
}

.pair-zone {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 6px;
}

/* 闲对样式 */
.player-pair {
  background: linear-gradient(135deg, rgb(0, 68, 221) 0%, rgb(0, 58, 136) 100%);
  border: 2px solid rgba(0, 68, 221, 0.8);
}

/* 庄对样式 */
.banker-pair {
  background: linear-gradient(135deg, rgb(230, 0, 0) 0%, rgb(181, 0, 0) 100%);
  border: 2px solid rgba(230, 0, 0, 0.8);
}

.pair-zone-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.pair-zone-title {
  font-size: 13px;
  font-weight: 700;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.pair-zone-odds {
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.player-pair .pair-zone-odds {
  color: #add8ff;
}

.banker-pair .pair-zone-odds {
  color: #ffb8b5;
}

/* ========================= 动画定义 ========================= */

/* 赢家脉冲动画 */
@keyframes winnerPulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.6;
  }
}

/* 边框发光动画 */
@keyframes borderGlow {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 1;
  }
}
</style>
