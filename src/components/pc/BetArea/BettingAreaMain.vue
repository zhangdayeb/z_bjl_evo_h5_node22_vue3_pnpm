<template>
  <div class="betting-main-layer">
    <!-- 整体布局容器 - 左中右一行 -->
    <div class="betting-layout-row">

      <!-- =================== 左侧：闲对区域 =================== -->
      <div class="pair-zone player-pair left-pair" :class="{ 'winner-highlight': isWinner('player-pair') }">
        <!-- SVG半圆形状 -->
        <svg class="svg-builder" viewBox="-30 0 150 170" preserveAspectRatio="none">
          <defs>
            <linearGradient id="playerPairGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color: rgb(0, 68, 221);"></stop>
              <stop offset="100%" style="stop-color: rgb(0, 58, 136);"></stop>
            </linearGradient>
          </defs>
          <!-- 左侧半圆：右边一小段直线，左边大圆弧 -->
          <path d="M 120,0 L 120,170 L 150,170 A 150,85 0 0,1 150,0 Z"
                fill="url(#playerPairGradient)"
                stroke="rgba(0, 68, 221, 0.8)"
                stroke-width="2"/>
        </svg>

        <div class="pair-zone-content">
          <div class="pair-zone-title">P PAIR</div>
          <div class="pair-zone-odds">11:1</div>
        </div>
      </div>

      <!-- =================== 中间：主投注区域 =================== -->
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
          <path d="M 0,2 C0,1 1,0 2,0 L 96,0 C98,0 100,2 100,4 L 100,96 C100,98 98,100 96,100 L 30,100
                   C30,100 29,99 29,98 L 29,45
                   C29,32 20,22 0,22 Z"
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
          <path d="M 0,2 C0,1 1,0 2,0 L 96,0 C98,0 100,2 100,4 L 100,96 C100,98 98,100 96,100 L 30,100
                   C30,100 29,99 29,98 L 29,45
                   C29,32 20,22 0,22 Z"
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
          <path d="M 70,0 C114.85,0 140,45 140,70 L 140,184 C140,188 138,190 134,190 L 6,190 C2,190 0,188 0,184 L 0,70 C0,45 25.15,0 70,0 Z"
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
          <div class="title-section" style="flex-direction: row;">
            <div class="zone-title">TIE</div>
            <div class="zone-odds">9:1</div>
          </div>
        </div>
      </div>

    </div>

      <!-- =================== 右侧：庄对区域 =================== -->
      <div class="pair-zone banker-pair right-pair" :class="{ 'winner-highlight': isWinner('banker-pair') }">
        <!-- SVG半圆形状 -->
        <svg class="svg-builder" viewBox="0 0 150 170" preserveAspectRatio="none">
          <defs>
            <linearGradient id="bankerPairGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style="stop-color: rgb(181, 0, 0);"></stop>
              <stop offset="100%" style="stop-color: rgb(230, 0, 0);"></stop>
            </linearGradient>
          </defs>
          <!-- 右侧半圆：左边一小段直线，右边大圆弧 -->
          <path d="M 0,0 L 0,170 L -30,170 A 150,85 0 0,0 -30,0 Z"
                fill="url(#bankerPairGradient)"
                stroke="rgba(230, 0, 0, 0.8)"
                stroke-width="2"/>
        </svg>

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

import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// ========================= Store =========================

const gameStore = useGameStore()

// ========================= 工具函数 =========================

/**
 * 解析 pai_info 并计算游戏结果
 * @param paiInfo - JSON 字符串，格式如 {"1":"11|r","2":"5|f","3":"0|0","4":"10|m","5":"3|h","6":"0|0"}
 * 位置说明：
 * - 1,2,3=庄家(Banker); 3是第三张补牌
 * - 4,5,6=闲家(Player); 6是第三张补牌
 * 显示布局：左侧Player[6-横向][4][5], 右侧Banker[1][2][3-横向]
 * @returns result: 1=庄赢 2=闲赢 3=和; ext: 0=无对子 1=庄对 2=闲对 3=双对
 */
function parseGameResult(paiInfo: string): { result: number; ext: number } | null {
  try {
    if (!paiInfo || paiInfo === '') return null

    const cards = JSON.parse(paiInfo)

    // 解析牌面点数
    const getCardValue = (cardStr: string): number => {
      if (!cardStr || cardStr === '0|0') return 0
      const value = parseInt(cardStr.split('|')[0], 10)
      // 百家乐规则：10、J(11)、Q(12)、K(13) 算 0 点
      return value >= 10 ? 0 : value
    }

    // 闲家牌（位置 4, 5, 6）
    const player1 = getCardValue(cards['4'])
    const player2 = getCardValue(cards['5'])
    const player3 = getCardValue(cards['6']) // 第三张补牌
    const playerTotal = (player1 + player2 + player3) % 10

    // 庄家牌（位置 1, 2, 3）
    const banker1 = getCardValue(cards['1'])
    const banker2 = getCardValue(cards['2'])
    const banker3 = getCardValue(cards['3']) // 第三张补牌
    const bankerTotal = (banker1 + banker2 + banker3) % 10

    // 计算主结果：1=庄赢 2=闲赢 3=和
    let result: number
    if (bankerTotal > playerTotal) {
      result = 1 // 庄赢
    } else if (playerTotal > bankerTotal) {
      result = 2 // 闲赢
    } else {
      result = 3 // 和局
    }

    // 计算对子：检查前两张牌的数值是否相同（不包括第三张补牌）
    const getCardNumber = (cardStr: string): number => {
      if (!cardStr || cardStr === '0|0') return -1
      return parseInt(cardStr.split('|')[0], 10)
    }

    const playerPair = getCardNumber(cards['4']) === getCardNumber(cards['5'])
    const bankerPair = getCardNumber(cards['1']) === getCardNumber(cards['2'])

    // ext: 0=无对子 1=庄对 2=闲对 3=双对
    let ext = 0
    if (playerPair && bankerPair) {
      ext = 3 // 双对
    } else if (bankerPair) {
      ext = 1 // 庄对
    } else if (playerPair) {
      ext = 2 // 闲对
    }

    return { result, ext }
  } catch (error) {
    console.error('解析 pai_info 失败:', error)
    return null
  }
}

// ========================= 计算属性 =========================

const gamePhase = computed(() => gameStore.gameStatus)

/**
 * 获取当前这一局的游戏结果数据
 * 直接从 pai_info 解析并计算
 * result: 1=庄 2=闲 3=和
 * ext: 0=无对子 1=庄对 2=闲对 3=双对
 */
const gameResult = computed(() => {
  // 只在 dealing 阶段显示赢家高亮
  if (gamePhase.value !== 'dealing') return null

  // 从 gameStore.gameResult.pai_info 获取牌面数据
  const gameResultData = gameStore.gameResult
  if (!gameResultData || !gameResultData.pai_info) return null

  // 解析 pai_info 并计算结果
  return parseGameResult(gameResultData.pai_info)
})

/**
 * 判断是否为赢家
 * @param zone - 区域标识: 'player', 'banker', 'tie', 'player-pair', 'banker-pair'
 */
const isWinner = (zone: string): boolean => {
  // 只在开牌阶段显示赢家效果
  if (gamePhase.value !== 'dealing') return false

  // 如果没有结果数据，不显示高亮
  if (!gameResult.value) return false

  const { result, ext } = gameResult.value

  // 判断主要结果：1=庄 2=闲 3=和
  switch (zone) {
    case 'banker':
      return result === 1
    case 'player':
      return result === 2
    case 'tie':
      return result === 3
    case 'player-pair':
      // ext: 2=闲对 3=双对
      return ext === 2 || ext === 3
    case 'banker-pair':
      // ext: 1=庄对 3=双对
      return ext === 1 || ext === 3
    default:
      return false
  }
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

/* ========================= 整体布局：左中右一行 ========================= */
.betting-layout-row {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: stretch;
  gap: 4px;
}

/* ========================= 主投注区域（中间部分）========================= */
.main-betting-area {
  position: relative;
  flex: 1;
  height: 100%;
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
  bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  z-index: 2;
}

/* Player 区域内容定位 */
.player-spot .spot-content {
  right: 50px;
  left: 10px;
}

/* Banker 区域内容定位 */
.banker-spot .spot-content {
  left: 50px;
  right: 10px;
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
  right: 50px;
  left: 0;
}

/* Banker 区域背景定位 */
.banker-spot .spot-background {
  left: 50px;
  right: 0;
}

/* ========================= 赢家高亮效果 ========================= */

/* 赢家发光层 - 静态高亮，无动画 */
.winner-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  opacity: 0.5;
}

/* Player 赢家发光 */
.player-spot .winner-glow {
  background: radial-gradient(ellipse at center,
    rgba(0, 150, 255, 0.4) 0%,
    transparent 70%);
  box-shadow: inset 0 0 50px rgba(0, 150, 255, 0.4);
}

/* Banker 赢家发光 */
.banker-spot .winner-glow {
  background: radial-gradient(ellipse at center,
    rgba(255, 100, 100, 0.4) 0%,
    transparent 70%);
  box-shadow: inset 0 0 50px rgba(255, 100, 100, 0.4);
}

/* Tie 赢家发光 */
.tie-spot .winner-glow {
  background: radial-gradient(ellipse at center,
    rgba(13, 216, 12, 0.4) 0%,
    transparent 70%);
  box-shadow: inset 0 0 50px rgba(13, 216, 12, 0.4);
}

/* 赢家高亮时的边框 - 静态效果，无动画 */
.winner-highlight .svg-builder path {
  stroke-width: 3;
  filter: drop-shadow(0 0 10px currentColor);
}

/* 对子区域赢家高亮 */
.pair-zone.winner-highlight {
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.3);
  border-width: 3px;
}

/* ========================= 标题和赔率 ========================= */
.title-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.zone-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0;
  line-height: 18px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
  color: #ddd;
  font-family: 'Palatino', 'Georgia', serif;
  white-space: pre;
}

.zone-odds {
  font-size: 14px;
  font-weight: 700;
  margin-left: 4px;
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
  width: 28%;
  top:17%;
  height: calc(100% - 17%);
  z-index: 10;
}

.tie-spot .svg-builder {
  z-index: 1;
}

.tie-spot .spot-content {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.tie-spot .zone-title {
  font-size: 14px;
  color: #ddd;
}

.tie-spot .zone-odds {
  color: #0DD80C;
}

/* ========================= 对子区域（左右两侧半圆）========================= */
.pair-zone {
  position: relative;
  width: 120px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 左侧闲对 */
.left-pair {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

/* 右侧庄对 */
.right-pair {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

/* 闲对样式 - 不需要背景渐变，SVG已经处理 */
.player-pair {
  /* SVG 已经有渐变，这里不需要额外背景 */
}

/* 庄对样式 - 不需要背景渐变，SVG已经处理 */
.banker-pair {
  /* SVG 已经有渐变，这里不需要额外背景 */
}

.pair-zone-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 4px;
}

.pair-zone-title {
  font-size: 13px;
  font-weight: 700;
  color: #ddd;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 2px;
}

.pair-zone-odds {
  font-size: 12px;
  font-weight: 600;
  color: white;
  writing-mode: vertical-rl;
}

.player-pair .pair-zone-odds {
  color: #add8ff;
}

.banker-pair .pair-zone-odds {
  color: #ffb8b5;
}

/* 对子区域的 SVG 形状 */
.pair-zone .svg-builder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

</style>
