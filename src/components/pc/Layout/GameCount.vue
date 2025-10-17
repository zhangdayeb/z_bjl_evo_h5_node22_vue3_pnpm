<template>
  <div class="pc-game-count">
    <!-- 左侧：收银台按钮 + 余额 + 总投注 -->
    <div class="left-section">
      <!-- 收银台按钮 -->
      <button class="cashier-btn" @click="handleCashier">
        <span class="button-content">
          <div class="button-base"></div>
          <div class="icon-wrapper">
            <span class="euro-symbol">€</span>
          </div>
        </span>
      </button>

      <!-- 余额信息 -->
      <div class="info-capsule">
        <div class="info-label">BALANCE</div>
        <div class="info-value">€{{ formattedBalance }}</div>
      </div>

      <!-- 总投注信息 -->
      <div class="info-capsule">
        <div class="info-label">TOTAL BET</div>
        <div class="info-value">€{{ formattedTotalBet }}</div>
      </div>
    </div>

    <!-- 右侧：路珠、赔率、游戏大厅按钮 -->
    <div class="actions-section">
      <!-- 路珠按钮 -->
      <button class="luzhu-btn" @click="handleLuZhuList">
        <span class="button-content">
          <div class="button-base"></div>
          <div class="icon-wrapper">
            <svg class="icon" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                fill="currentColor"
                d="M12.0042 6.35163C10.8048 6.35163 9.63338 5.98849 8.64424 5.31C7.25248 5.35955 5.93717 5.95901 4.98674 6.97692C4.03631 7.99483 3.52835 9.34811 3.57424 10.74C3.56892 12.128 4.11453 13.4614 5.09131 14.4476C6.06809 15.4337 7.39624 15.9921 8.78424 16H15.2242C16.6114 15.9894 17.938 15.4303 18.9142 14.4447C19.8905 13.4591 20.4369 12.1272 20.4342 10.74C20.4801 9.34811 19.9722 7.99483 19.0217 6.97692C18.0713 5.95901 16.756 5.35955 15.3642 5.31C14.3751 5.98849 13.2037 6.35163 12.0042 6.35163ZM15.5742 17.31H8.43424V17.33C7.57978 17.3209 6.73551 17.1433 5.94973 16.8076C5.16395 16.4718 4.45209 15.9844 3.85487 15.3733C3.25765 14.7621 2.78679 14.0392 2.46924 13.2459C2.15169 12.4526 1.99368 11.6044 2.00424 10.75C1.94204 9.02551 2.56601 7.34668 3.73942 6.08143C4.91282 4.81618 6.53995 4.06769 8.26424 4H8.44424V4.48C9.49614 5.18892 10.7358 5.56764 12.0042 5.56764C13.2727 5.56764 14.5123 5.18892 15.5642 4.48V4H15.7442C17.4685 4.07286 19.0941 4.8243 20.2667 6.09056C21.4393 7.35681 22.0638 9.03523 22.0042 10.76C22.0176 12.4805 21.3482 14.1361 20.1429 15.3639C18.9376 16.5917 17.2947 17.2915 15.5742 17.31ZM19.944 16.9077C18.7586 18.019 17.199 18.6444 15.5742 18.66H8.43424C6.80292 18.6566 5.2333 18.0361 4.04059 16.9231C2.84788 15.8102 2.1204 14.2872 2.00424 12.66V13.42C1.98556 15.1449 2.65223 16.8067 3.85783 18.0404C5.06343 19.2741 6.70939 19.9789 8.43424 20H15.5742C17.2956 19.971 18.9354 19.2614 20.1348 18.0264C21.3343 16.7913 21.9956 15.1315 21.9742 13.41V12.66C21.854 14.2804 21.1293 15.7964 19.944 16.9077Z"
              />
            </svg>
          </div>
        </span>
      </button>

      <!-- 台桌按钮 -->
      <button class="action-btn table-btn" @click="handleTable">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
        </svg>
        <span>TABLE</span>
      </button>

      <!-- 游戏大厅按钮 -->
      <button class="action-btn lobby-btn" @click="handleLobby">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span>LOBBY</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useBettingStore } from '@/stores/bettingStore'
import { useoverLayerStore } from '@/stores/overLayerStore'

const gameStore = useGameStore()
const bettingStore = useBettingStore()
const overLayerStore = useoverLayerStore()

// 余额
const balance = computed(() => gameStore.displayBalance || 0)
const formattedBalance = computed(() => {
  return balance.value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})

// 总投注
const totalBet = computed(() => bettingStore.totalBetAmount || 0)
const formattedTotalBet = computed(() => {
  return totalBet.value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
})

// 事件处理
const handleCashier = () => {
  console.log('[GameCount] 打开收银台')
}

const handleTable = () => {
  console.log('[GameCount] 打开台桌')
}

const handleLobby = () => {
  console.log('[GameCount] 返回游戏大厅')
}

const handleLuZhuList = () => {
  overLayerStore.open('luZhuList')
}
</script>

<style scoped>
.pc-game-count {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  z-index: 20;
}

/* 左侧区域 */
.left-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 收银台按钮 - 统一高度50px */
.cashier-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  padding: 0;
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.6);
  border-radius: 50%;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.2s;
  flex-shrink: 0;
}

.cashier-btn:hover {
  transform: scale(1.05);
  border-color: rgba(255, 215, 0, 0.8);
}

.cashier-btn .button-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cashier-btn .button-base {
  position: absolute;
  inset: 1px;
  border-radius: 50%;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

.cashier-btn .icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: rgba(255, 215, 0, 1);
}

.cashier-btn .icon-wrapper svg {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

.cashier-btn .euro-symbol {
  font-size: 28px;
  font-weight: bold;
  color: rgba(255, 215, 0, 1);
  line-height: 1;
}

/* 信息胶囊 - 改为上下布局，左右半圆，统一高度50px */
.info-capsule {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 2px 20px;
  height: 46px;
  min-width: 120px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 215, 0, 0.6);
  border-radius: 46px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.info-label {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  white-space: nowrap;
  text-align: center;
}

.info-value {
  font-size: 16px;
  font-weight: bold;
  color: #FFD700;
  white-space: nowrap;
  text-align: center;
}

/* 右侧按钮区域 */
.actions-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  height: 50px;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.action-btn:hover {
  border-color: rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.6);
}

.action-btn svg {
  width: 18px;
  height: 18px;
}

.table-btn {
  /* 台桌按钮特殊样式 */
}

.lobby-btn {
  /* 游戏大厅按钮特殊样式 */
}

.luzhu-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  padding: 0;
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.2s;
}

.luzhu-btn:hover {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.6);
}

.luzhu-btn .button-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.luzhu-btn .button-base {
  position: absolute;
  inset: 1px;
  border-radius: 50%;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

.luzhu-btn .icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: rgba(255, 255, 255, 1);
}

.luzhu-btn .icon {
  width: 100%;
  height: 100%;
  fill: currentColor;
}
</style>
