<template>
  <div class="table-info-container">
    <!-- 第一行：聊天消息区域 -->
    <div class="message-row">
      <div class="message-one-line" data-role="one-line-chat">
        <div class="chat-message">
          <span class="sender-name">Vita: </span>
          <span class="message-text">Hello, 1234! Welcome to Always 8 Baccarat!</span>
        </div>
      </div>
    </div>

    <!-- 第二行：Total Bet 和 时间 -->
    <div class="info-row">
      <!-- Total Bet -->
      <div class="total-bet-container">
        <div class="info-item">
          <span class="label" data-role="total-bet-title">Total Bet</span>
          <span class="amount" data-role="total-bet-value">€{{ totalBet }}</span>
        </div>
      </div>

      <!-- 时间容器 -->
      <div class="clock-container">
        <div class="clock" data-role="clock">{{ currentTime }}</div>
        <div class="game-time" data-role="game-time">#{{ gameTime }}</div>
      </div>
    </div>

    <!-- 第三行：Balance 和 桌台信息 -->
    <div class="info-row">
      <!-- Balance -->
      <div class="balance-container">
        <div class="info-item">
          <span class="label" data-role="balance-title">Balance</span>
          <span class="amount" data-role="balance-value">€{{ formattedBalance }}</span>
        </div>
      </div>

      <!-- 桌台信息 -->
      <div class="table-name-container">
        <span class="table-name" data-role="table-name">{{ tableName }}</span>
        <span class="table-limits" data-role="table-limits">€{{ minBet }} – {{ formattedMaxBet }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview 游戏底部信息栏组件
 * @description 显示用户余额、投注总额、台桌信息、限红和时间
 */

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useBettingStore } from '@/stores/bettingStore'

// ========================= Stores =========================
const gameStore = useGameStore()
const bettingStore = useBettingStore()

// ========================= 时间相关 =========================
const currentTime = ref('00:00')
const gameTime = ref('00:00:00')
const timeInterval = ref<number | null>(null)
const gameStartTime = ref<number | null>(null)

// ========================= 计算属性 =========================

/**
 * 总投注金额 - 从 bettingStore 获取
 */
const totalBet = computed(() => {
  return bettingStore.totalConfirmedAmount || 0
})

/**
 * 真实余额 - 从 gameStore 获取（后端返回的真实余额）
 */
const realBalance = computed(() => {
  return gameStore.balance || 0
})

/**
 * 虚拟余额 - 用于即时显示（真实余额 - 当前所有投注金额）
 * 这样用户在点击投注时能立即看到余额减少，提供即时反馈
 */
const balance = computed(() => {
  // 真实余额 - 所有当前投注（包括已确认和待确认）
  const virtualBalance = realBalance.value - bettingStore.totalBetAmount

  // 确保余额不为负数
  return Math.max(0, virtualBalance)
})

/**
 * 台桌名称 - 从 gameStore 获取
 */
const tableName = computed(() => {
  return gameStore.tableName || 'Baccarat'
})

/**
 * 最小投注额 - 从 tableInfo 获取（取庄闲最小值）
 */
const minBet = computed(() => {
  const tableInfo = gameStore.tableInfo
  if (!tableInfo) return 1

  // 取庄闲最小限红中的较小值
  const zhuangMin = tableInfo.bjl_xian_hong_zhuang_min || 1
  const xianMin = tableInfo.bjl_xian_hong_xian_min || 1
  return Math.min(zhuangMin, xianMin)
})

/**
 * 最大投注额 - 从 tableInfo 获取（取庄闲最大值）
 */
const maxBet = computed(() => {
  const tableInfo = gameStore.tableInfo
  if (!tableInfo) return 25000

  // 取庄闲最大限红中的较大值
  const zhuangMax = tableInfo.bjl_xian_hong_zhuang_max || 25000
  const xianMax = tableInfo.bjl_xian_hong_xian_max || 25000
  return Math.max(zhuangMax, xianMax)
})

/**
 * 格式化余额显示
 */
const formattedBalance = computed(() => {
  return balance.value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})

/**
 * 格式化最大投注额
 */
const formattedMaxBet = computed(() => {
  return maxBet.value.toLocaleString('en-US')
})

// ========================= 生命周期 =========================

onMounted(() => {
  startClock()
  gameStartTime.value = Date.now()
})

onBeforeUnmount(() => {
  stopClock()
})

// ========================= 方法 =========================

/**
 * 启动时钟
 */
function startClock() {
  updateTime()
  timeInterval.value = window.setInterval(() => {
    updateTime()
  }, 1000)
}

/**
 * 停止时钟
 */
function stopClock() {
  if (timeInterval.value) {
    clearInterval(timeInterval.value)
    timeInterval.value = null
  }
}

/**
 * 更新时间
 */
function updateTime() {
  const now = new Date()
  // 当前时间 HH:MM
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  currentTime.value = `${hours}:${minutes}`

  // 游戏时间（从游戏开始计算的真实时间）
  if (gameStartTime.value) {
    const elapsed = Math.floor((Date.now() - gameStartTime.value) / 1000)
    const gameHours = String(Math.floor(elapsed / 3600)).padStart(2, '0')
    const gameMinutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0')
    const gameSeconds = String(elapsed % 60).padStart(2, '0')
    gameTime.value = `${gameHours}:${gameMinutes}:${gameSeconds}`
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

/* 主容器 */
.table-info-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 49px;
  padding: 0 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-family: Inter, Arial, sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  color: #fff;
  /* 双层渐变背景 - 与目标完全一致 */
  background:
  linear-gradient(rgba(0, 0, 0, 0) 0%, rgb(0, 0, 0) 140%),
  linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 100%),
  #35260d; /* 底色 */
  box-sizing: border-box;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

/* 第一行：聊天消息 - 17px高 */
.message-row {
  height: 17px;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.message-one-line {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.8);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 17px;
  width: 100%;
}

.chat-message {
  display: flex;
  align-items: center;
  gap: 3px;
  overflow: hidden;
}

.sender-name {
  color: #FFD700;
  font-weight: 500;
  flex-shrink: 0;
}

.message-text {
  color: rgba(255, 255, 255, 0.9);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 信息行 - 16px高 */
.info-row {
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 容器 */
.total-bet-container,
.balance-container {
  flex: 1;
}

.info-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

/* 标签 */
.label {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  line-height: 16px;
}

/* 金额 */
.amount {
  font-size: 12px;
  font-weight: 600;
  color: #FFD700;
  line-height: 16px;
}

/* 时钟容器 */
.clock-container {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 16px;
}

.clock {
  font-size: 12px;
  font-weight: 500;
  color: #ffffff80;
  line-height: 16px;
  display: inline-block;
}

.game-time {
  font-size: 12px;
  font-weight: 400;
  color: #ffffff80;
  line-height: 16px;
  display: inline-block;
  position: relative;
}

/* 桌台信息容器 */
.table-name-container {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-end;
}

.table-name {
  font-size: 12px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 16px;
}

.table-limits {
  font-size: 11px;
  font-weight: 400;
  color: #FFD700;
  line-height: 16px;
}
</style>
