<template>
  <div class="betting-container" :class="`${gamePhase}-phase`">
    <!-- 主要投注区域 -->
    <div class="main-betting-area">

      <!-- 闲家区域 -->
      <div class="bet-spot player-spot">
        <!-- SVG形状 - 带凹陷效果 -->
        <svg class="svg-builder" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="playerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color: rgb(0, 68, 221);"></stop>
              <stop offset="100%" style="stop-color: rgb(0, 58, 136);"></stop>
            </linearGradient>
          </defs>
          <path d="M 0,2 C0,1 1,0 2,0 L 96,0 C98,0 100,2 100,4 L 100,96 C100,98 98,100 96,100 L 35,100
                   C34,100 33,99 33,98 L 33,45
                   C33,27 18,14 0,14 Z"
                fill="url(#playerGradient)"
                stroke="rgba(0, 68, 221, 0.8)"
                stroke-width="1"
                fill-opacity="0.8"/>
        </svg>

        <!-- 背景图案 -->
        <div class="spot-background"></div>

        <!-- 投注状态内容 -->
        <div v-if="gamePhase === 'betting'" class="spot-content">
          <!-- 统计信息 -->
          <div class="statistics">
            <div class="indicator">
              <svg viewBox="0 0 46 46">
                <circle cx="23" cy="23" r="20" fill="rgba(0, 30, 90, 0.5)"/>
                <circle cx="23" cy="23" r="18" stroke="rgba(0, 150, 255, 0.3)" stroke-width="3" fill="none"/>
                <circle cx="23" cy="23" r="18" stroke="#0096FF" stroke-width="3"
                        fill="none" stroke-dasharray="113.1"
                        :stroke-dashoffset="113.1 - (113.1 * bettingData.player.percentage / 100)"
                        stroke-linecap="round"/>
              </svg>
              <div class="indicator-text">
                <span class="number">{{ bettingData.player.percentage }}</span>
                <span class="percent">%</span>
              </div>
            </div>
            <div class="info">
              <div class="info-line">
                <svg class="icon-currency" viewBox="0 0 24 24" fill="white">
                  <path d="M15 18.5C12.5 18.5 10.3 17.1 9.2 15H15L16 13H8.6C8.5 12.5 8.5 12 8.5 11.5S8.5 10.5 8.6 10H16L17 8H9.2C10.3 5.9 12.5 4.5 15 4.5C16.3 4.5 17.5 4.9 18.5 5.6L20 4.1C18.6 3 16.9 2.5 15 2.5C11.5 2.5 8.5 4.6 7.1 7.5H4L3 9.5H6.5C6.5 10 6.5 10.5 6.5 11S6.5 12 6.5 12.5H3L2 14.5H7.1C8.5 17.4 11.5 19.5 15 19.5C16.9 19.5 18.6 19 20 17.9L18.5 16.4C17.5 17.1 16.3 17.5 15 18.5Z"/>
                </svg>
                <span class="amount">{{ bettingData.player.amount }}</span>
              </div>
              <div class="info-line">
                <svg class="icon-person" viewBox="0 0 24 24" fill="#00BFFF">
                  <path d="M12,12A6,6 0 0,0 6,18C6,18.55 6.45,19 7,19H17C17.55,19 18,18.55 18,18A6,6 0 0,0 12,12M12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10A4,4 0 0,1 8,6A4,4 0 0,1 12,2Z"/>
                </svg>
                <span>{{ bettingData.player.count }}</span>
              </div>
            </div>
          </div>

          <!-- 标题和赔率 -->
          <div class="title-section">
            <div class="zone-odds">1:1</div>
            <div class="zone-title">PLAYER</div>
          </div>
        </div>

        <!-- 开牌状态内容 -->
        <div v-else class="spot-content dealing-content">
          <div></div>
          <div class="title-section">
            <div class="zone-odds">1:1</div>
            <div class="zone-title">PLAYER</div>
          </div>
        </div>

        <!-- 扑克牌（开牌状态显示） -->
        <div v-if="gamePhase === 'dealing'" class="cards-container">
          <div v-for="(card, index) in resultData.player" :key="`p-${index}`"
               class="card" :class="{ horizontal: index === 2 }">
            <div class="card-face">
              <div class="card-value">{{ card.value }}</div>
              <div class="card-suit" :class="card.color">{{ card.suit }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 庄家区域 -->
      <div class="bet-spot banker-spot">
        <!-- SVG形状 -->
        <svg class="svg-builder" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <linearGradient id="bankerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color: rgb(230, 0, 0);"></stop>
              <stop offset="100%" style="stop-color: rgb(181, 0, 0);"></stop>
            </linearGradient>
          </defs>
          <path d="M 0,2 C0,1 1,0 2,0 L 96,0 C98,0 100,2 100,4 L 100,96 C100,98 98,100 96,100 L 35,100
                   C34,100 33,99 33,98 L 33,45
                   C33,27 18,14 0,14 Z"
                fill="url(#bankerGradient)"
                stroke="rgba(230, 0, 0, 0.8)"
                stroke-width="1"
                fill-opacity="0.8"/>
        </svg>

        <!-- 背景图案 -->
        <div class="spot-background"></div>

        <!-- 投注状态内容 -->
        <div v-if="gamePhase === 'betting'" class="spot-content">
          <!-- 统计信息 -->
          <div class="statistics">
            <div class="indicator">
              <svg viewBox="0 0 46 46">
                <circle cx="23" cy="23" r="20" fill="rgba(80, 0, 0, 0.5)"/>
                <circle cx="23" cy="23" r="18" stroke="rgba(255, 151, 146, 0.3)" stroke-width="3" fill="none"/>
                <circle cx="23" cy="23" r="18" stroke="#FF9792" stroke-width="3"
                        fill="none" stroke-dasharray="113.1"
                        :stroke-dashoffset="113.1 - (113.1 * bettingData.banker.percentage / 100)"
                        stroke-linecap="round"/>
              </svg>
              <div class="indicator-text">
                <span class="number">{{ bettingData.banker.percentage }}</span>
                <span class="percent">%</span>
              </div>
            </div>
            <div class="info">
              <div class="info-line">
                <svg class="icon-currency" viewBox="0 0 24 24" fill="white">
                  <path d="M15 18.5C12.5 18.5 10.3 17.1 9.2 15H15L16 13H8.6C8.5 12.5 8.5 12 8.5 11.5S8.5 10.5 8.6 10H16L17 8H9.2C10.3 5.9 12.5 4.5 15 4.5C16.3 4.5 17.5 4.9 18.5 5.6L20 4.1C18.6 3 16.9 2.5 15 2.5C11.5 2.5 8.5 4.6 7.1 7.5H4L3 9.5H6.5C6.5 10 6.5 10.5 6.5 11S6.5 12 6.5 12.5H3L2 14.5H7.1C8.5 17.4 11.5 19.5 15 19.5C16.9 19.5 18.6 19 20 17.9L18.5 16.4C17.5 17.1 16.3 17.5 15 18.5Z"/>
                </svg>
                <span class="amount">{{ bettingData.banker.amount }}</span>
              </div>
              <div class="info-line">
                <svg class="icon-person" viewBox="0 0 24 24" fill="#DAA520">
                  <path d="M12,12A6,6 0 0,0 6,18C6,18.55 6.45,19 7,19H17C17.55,19 18,18.55 18,18A6,6 0 0,0 12,12M12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10A4,4 0 0,1 8,6A4,4 0 0,1 12,2Z"/>
                </svg>
                <span>{{ bettingData.banker.count }}</span>
              </div>
            </div>
          </div>

          <!-- 标题和赔率 -->
          <div class="title-section">
            <div class="zone-odds">0.95:1</div>
            <div class="zone-title">BANKER</div>
          </div>
        </div>

        <!-- 开牌状态内容 -->
        <div v-else class="spot-content dealing-content">
          <div></div>
          <div class="title-section">
            <div class="zone-odds">0.95:1</div>
            <div class="zone-title">BANKER</div>
          </div>
        </div>

        <!-- 扑克牌（开牌状态显示） -->
        <div v-if="gamePhase === 'dealing'" class="cards-container">
          <div v-for="(card, index) in resultData.banker" :key="`b-${index}`"
               class="card" :class="{ horizontal: index === 2 }">
            <div class="card-face">
              <div class="card-value">{{ card.value }}</div>
              <div class="card-suit" :class="card.color">{{ card.suit }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 和局区域 -->
      <div class="tie-spot" :class="{ 'highlight': resultData.winner === 'tie' }">
        <svg class="svg-builder" viewBox="0 0 140 190" preserveAspectRatio="none">
          <defs>
            <linearGradient id="tieGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color: rgb(3, 165, 1);"></stop>
              <stop offset="100%" style="stop-color: rgb(0, 113, 0);"></stop>
            </linearGradient>
          </defs>
          <path d="M 70,0 C108.66,0 140,31.34 140,70 L 140,184 C140,188 138,190 134,190 L 6,190 C2,190 0,188 0,184 L 0,70 C0,31.34 31.34,0 70,0 Z"
                fill="url(#tieGradient)"
                stroke="rgba(3, 165, 1, 0.8)"
                stroke-width="2"
                fill-opacity="0.8"/>
        </svg>

        <div class="spot-background"></div>

        <div class="spot-content">
          <!-- 投注状态显示统计 -->
          <div v-if="gamePhase === 'betting'" class="statistics">
            <div class="indicator">
              <svg viewBox="0 0 46 46">
                <circle cx="23" cy="23" r="20" fill="rgba(0, 60, 0, 0.5)"/>
                <circle cx="23" cy="23" r="18" stroke="rgba(13, 216, 12, 0.3)" stroke-width="3" fill="none"/>
                <circle cx="23" cy="23" r="18" stroke="#0DD80C" stroke-width="3"
                        fill="none" stroke-dasharray="113.1"
                        :stroke-dashoffset="113.1 - (113.1 * bettingData.tie.percentage / 100)"
                        stroke-linecap="round"/>
              </svg>
              <div class="indicator-text">
                <span class="number">{{ bettingData.tie.percentage }}</span>
                <span class="percent">%</span>
              </div>
            </div>
            <div class="info">
              <div class="info-line">
                <svg class="icon-currency" viewBox="0 0 24 24" fill="white">
                  <path d="M15 18.5C12.5 18.5 10.3 17.1 9.2 15H15L16 13H8.6C8.5 12.5 8.5 12 8.5 11.5S8.5 10.5 8.6 10H16L17 8H9.2C10.3 5.9 12.5 4.5 15 4.5C16.3 4.5 17.5 4.9 18.5 5.6L20 4.1C18.6 3 16.9 2.5 15 2.5C11.5 2.5 8.5 4.6 7.1 7.5H4L3 9.5H6.5C6.5 10 6.5 10.5 6.5 11S6.5 12 6.5 12.5H3L2 14.5H7.1C8.5 17.4 11.5 19.5 15 19.5C16.9 19.5 18.6 19 20 17.9L18.5 16.4C17.5 17.1 16.3 17.5 15 18.5Z"/>
                </svg>
                <span class="amount">{{ bettingData.tie.amount }}</span>
              </div>
              <div class="info-line">
                <svg class="icon-person" viewBox="0 0 24 24" fill="#00FF00">
                  <path d="M12,12A6,6 0 0,0 6,18C6,18.55 6.45,19 7,19H17C17.55,19 18,18.55 18,18A6,6 0 0,0 12,12M12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10A4,4 0 0,1 8,6A4,4 0 0,1 12,2Z"/>
                </svg>
                <span>{{ bettingData.tie.count }}</span>
              </div>
            </div>
          </div>

          <!-- 标题和赔率 -->
          <div class="title-section">
            <div class="zone-title">TIE</div>
            <div class="zone-odds">9:1</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 对子投注区域 -->
    <div class="pairs-row">
      <!-- 闲对 -->
      <div class="pair-zone player-pair" @click="handlePairBet('player-pair')">
        <div class="pair-zone-content">
          <div class="pair-zone-title">P PAIR</div>
          <div class="pair-zone-odds">11:1</div>
        </div>
      </div>

      <!-- 庄对 -->
      <div class="pair-zone banker-pair" @click="handlePairBet('banker-pair')">
        <div class="pair-zone-content">
          <div class="pair-zone-title">B PAIR</div>
          <div class="pair-zone-odds">11:1</div>
        </div>
      </div>
    </div>

    <!-- 控制按钮（仅供测试） -->
    <div class="phase-controls">
      <button @click="togglePhase" class="phase-btn">
        切换到{{ gamePhase === 'betting' ? '开牌' : '投注' }}状态
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 游戏阶段状态
const gamePhase = ref<'betting' | 'dealing'>('betting')

// 投注数据
const bettingData = ref({
  player: {
    percentage: 20,
    amount: 247.36,
    count: 14
  },
  banker: {
    percentage: 75,
    amount: 1844.34,
    count: 47
  },
  tie: {
    percentage: 5,
    amount: 141.39,
    count: 11
  }
})

// 开牌结果数据
const resultData = ref({
  player: [
    { value: '7', suit: '♣', color: 'black' },
    { value: '5', suit: '♦', color: 'red' },
    { value: 'K', suit: '♠', color: 'black' }
  ],
  banker: [
    { value: '8', suit: '♥', color: 'red' },
    { value: '6', suit: '♠', color: 'black' },
    { value: 'A', suit: '♦', color: 'red' }
  ],
  winner: 'banker' as 'player' | 'banker' | 'tie'
})

// 切换游戏阶段
const togglePhase = () => {
  gamePhase.value = gamePhase.value === 'betting' ? 'dealing' : 'betting'
}

// 处理主区域投注
const handleMainBet = (zone: 'player' | 'banker' | 'tie') => {
  if (gamePhase.value !== 'betting') return
  console.log(`投注到 ${zone}`)
}

// 处理对子投注
const handlePairBet = (pair: 'player-pair' | 'banker-pair') => {
  if (gamePhase.value !== 'betting') return
  console.log(`投注到 ${pair}`)
}

onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 主容器 - 带高度动画 */
.betting-container {
  width: 100%;
  max-width: 768px;
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  padding-left: 8px;
  padding-right: 8px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

/* 投注状态高度 */
.betting-container.betting-phase {
  height: 230px;
}

/* 开牌状态高度 */
.betting-container.dealing-phase {
  height: 180px;
}

/* 主要投注区域容器 */
.main-betting-area {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transition: height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.betting-phase .main-betting-area {
  height: 190px;
}

.dealing-phase .main-betting-area {
  height: 140px;
}

/* 庄闲基础区域 */
.bet-spot {
  position: relative;
  width: calc(50% - 2px);
  height: 100%;
  cursor: pointer;
}

/* 内容区域 */
.spot-content {
  position: absolute;
  top: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  color: white;
  z-index: 2;
  transition: opacity 0.3s ease;
}

/* Player区域内容定位 */
.player-spot .spot-content {
  right: 75px;
  left: 15px;
}

/* Banker区域内容定位 */
.banker-spot .spot-content {
  left: 75px;
  right: 15px;
}

/* 开牌状态的内容调整 */
.dealing-content {
  padding: 10px 15px;
}

/* SVG形状构建器 */
.svg-builder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

/* Player区域镜像翻转 */
.player-spot .svg-builder {
  transform: scaleX(-1);
}

/* 背景图案 */
.spot-background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url('https://t.wd9898.top/rainbowpat.webp');
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

/* Player区域背景定位 */
.player-spot .spot-background {
  right: 75px;
  left: 0;
}

/* Banker区域背景定位 */
.banker-spot .spot-background {
  left: 75px;
  right: 0;
}

/* 统计信息区域 */
.statistics {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 圆形百分比指示器 */
.indicator {
  position: relative;
  width: 46px;
  height: 46px;
  --indicator-size: 46px;
  flex-shrink: 0;
}

.indicator svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.indicator-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: baseline;
  gap: 1px;
}

.indicator-text .number {
  font-size: calc(var(--indicator-size) * 0.35);
  font-weight: 700;
}

.indicator-text .percent {
  font-size: calc(var(--indicator-size) * 0.2);
  font-weight: 600;
}

/* 信息显示区域 */
.info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.info-line {
  display: flex;
  align-items: center;
  gap: 3px;
  color: white;
  font-size: 11px;
}

.info-line .amount {
  font-weight: 600;
}

/* 图标样式 */
.icon-person,
.icon-currency {
  width: 12px;
  height: 12px;
  display: inline-block;
}

/* Player统计左对齐 */
.player-spot .statistics {
  flex-direction: row;
}

.player-spot .info {
  align-items: flex-start;
}

/* Banker统计右对齐 */
.banker-spot .statistics {
  flex-direction: row-reverse;
}

.banker-spot .info {
  align-items: flex-end;
}

/* 标题和赔率 */
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

.player-spot .zone-odds {
  color: #0096FF;
}

.banker-spot .zone-odds {
  color: #FF9792;
}

/* 扑克牌容器 */
.cards-container {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 2px;
  align-items: center;
  z-index: 3;
  animation: fadeInCards 0.5s ease-out;
}

.player-spot .cards-container {
  left: 35%;
}

.banker-spot .cards-container {
  left: 65%;
}

/* 扑克牌样式 */
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
}

.card.horizontal {
  transform: rotate(90deg);
  margin: 0 8px;
}

.banker-spot .card.horizontal {
  transform: rotate(-90deg);
}

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

/* 和局区域 */
.tie-spot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: calc(31%);
  z-index: 10;
  transition: all 0.3s ease;
}

.betting-phase .tie-spot {
  top: 30px;
  height: calc(100% - 30px);
}

.dealing-phase .tie-spot {
  top: 23px;
  height: calc(100% - 23px);
}

.tie-spot.highlight {
  animation: tieHighlight 2s ease infinite;
}

.tie-spot .svg-builder {
  z-index: 1;
}

.tie-spot .spot-content {
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  position: relative;
  z-index: 2;
}

/* 和局统计顶部 */
.tie-spot .statistics {
  flex-direction: column;
  margin-top: 12px;
}

.tie-spot .info {
  flex-direction: row;
  gap: 10px;
  align-items: center;
  margin-top: 4px;
}

.tie-spot .info-line {
  font-size: 10px;
  color: white;
}

/* 和局标题和赔率横向排列 */
.tie-spot .title-section {
  flex-direction: row;
  gap: 8px;
  align-items: center;
  margin-bottom: 4px;
}

.dealing-phase .tie-spot .title-section {
  position: absolute;
  bottom: 14px;
}

.tie-spot .zone-title {
  font-size: 18px;
  color: white;
}

.tie-spot .zone-odds {
  color: #0DD80C;
  font-size: 13px;
}

/* 对子投注区域 */
.pairs-row {
  display: flex;
  gap: 4px;
  height: 45px;
  width: 100%;
}

.pair-zone {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: calc(50% - 2px);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.player-pair {
  background: linear-gradient(135deg, rgb(0, 68, 221) 0%, rgb(0, 58, 136) 100%);
  border: 2px solid rgba(0, 68, 221, 0.8);
}

.banker-pair {
  background: linear-gradient(135deg, rgb(230, 0, 0) 0%, rgb(181, 0, 0) 100%);
  border: 2px solid rgba(230, 0, 0, 0.8);
}

.pair-zone-content {
  position: relative;
  z-index: 2;
  display: flex;
  gap: 6px;
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

/* 悬停效果 */
.bet-spot:hover .svg-builder path,
.tie-spot:hover .svg-builder path {
  fill-opacity: 1;
  transition: fill-opacity 0.3s ease;
}

.pair-zone:hover {
  transform: translateY(-1px);
  filter: brightness(1.1);
}

/* 控制按钮（测试用） */
.phase-controls {
  position: absolute;
  top: -40px;
  right: 10px;
  z-index: 100;
}

.phase-btn {
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.phase-btn:hover {
  background: #2980b9;
}

/* 动画效果 */
@keyframes fadeInCards {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes tieHighlight {
  0%, 100% {
    box-shadow: 0 0 20px rgba(13, 216, 12, 0.6);
  }
  50% {
    box-shadow: 0 0 40px rgba(13, 216, 12, 0.9);
  }
}

/* 响应式调整 */
@media (max-width: 480px) {
  .betting-container.betting-phase {
    height: 230px;
  }

  .betting-container.dealing-phase {
    height: 180px;
  }

  .betting-phase .main-betting-area {
    height: 190px;
  }

  .dealing-phase .main-betting-area {
    height: 140px;
  }

  .zone-title {
    font-size: 18px;
  }

  .zone-odds {
    font-size: 12px;
  }

  .tie-spot .zone-title {
    font-size: 16px;
  }

  .pairs-row {
    height: 40px;
  }

  .pair-zone-title {
    font-size: 12px;
  }

  .pair-zone-odds {
    font-size: 11px;
  }

  .player-spot .spot-content {
    right: 65px;
  }

  .banker-spot .spot-content {
    left: 65px;
  }

  .card {
    width: 30px;
    height: 45px;
  }

  .card-value {
    font-size: 16px;
  }

  .card-suit {
    font-size: 14px;
  }
}
</style>
