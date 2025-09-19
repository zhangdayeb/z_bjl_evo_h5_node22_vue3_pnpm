<template>
  <div class="user-bet-msg-layer">
    <!-- Player 统计信息 -->
    <div class="statistics-area player-statistics">
      <div class="statistics">
        <!-- 圆形百分比指示器 -->
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
        <!-- 金额和人数信息 -->
        <div class="info">
          <div class="info-line">
            <svg class="icon-currency" viewBox="0 0 24 24" fill="white">
              <path d="M15 18.5C12.5 18.5 10.3 17.1 9.2 15H15L16 13H8.6C8.5 12.5 8.5 12 8.5 11.5S8.5 10.5 8.6 10H16L17 8H9.2C10.3 5.9 12.5 4.5 15 4.5C16.3 4.5 17.5 4.9 18.5 5.6L20 4.1C18.6 3 16.9 2.5 15 2.5C11.5 2.5 8.5 4.6 7.1 7.5H4L3 9.5H6.5C6.5 10 6.5 10.5 6.5 11S6.5 12 6.5 12.5H3L2 14.5H7.1C8.5 17.4 11.5 19.5 15 19.5C16.9 19.5 18.6 19 20 17.9L18.5 16.4C17.5 17.1 16.3 17.5 15 18.5Z"/>
            </svg>
            <span class="amount">{{ formatAmount(bettingData.player.amount) }}</span>
          </div>
          <div class="info-line">
            <svg class="icon-person" viewBox="0 0 24 24" fill="#00BFFF">
              <path d="M12,12A6,6 0 0,0 6,18C6,18.55 6.45,19 7,19H17C17.55,19 18,18.55 18,18A6,6 0 0,0 12,12M12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10A4,4 0 0,1 8,6A4,4 0 0,1 12,2Z"/>
            </svg>
            <span>{{ bettingData.player.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Banker 统计信息 -->
    <div class="statistics-area banker-statistics">
      <div class="statistics">
        <!-- 圆形百分比指示器 -->
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
        <!-- 金额和人数信息 -->
        <div class="info">
          <div class="info-line">
            <svg class="icon-currency" viewBox="0 0 24 24" fill="white">
              <path d="M15 18.5C12.5 18.5 10.3 17.1 9.2 15H15L16 13H8.6C8.5 12.5 8.5 12 8.5 11.5S8.5 10.5 8.6 10H16L17 8H9.2C10.3 5.9 12.5 4.5 15 4.5C16.3 4.5 17.5 4.9 18.5 5.6L20 4.1C18.6 3 16.9 2.5 15 2.5C11.5 2.5 8.5 4.6 7.1 7.5H4L3 9.5H6.5C6.5 10 6.5 10.5 6.5 11S6.5 12 6.5 12.5H3L2 14.5H7.1C8.5 17.4 11.5 19.5 15 19.5C16.9 19.5 18.6 19 20 17.9L18.5 16.4C17.5 17.1 16.3 17.5 15 18.5Z"/>
            </svg>
            <span class="amount">{{ formatAmount(bettingData.banker.amount) }}</span>
          </div>
          <div class="info-line">
            <svg class="icon-person" viewBox="0 0 24 24" fill="#DAA520">
              <path d="M12,12A6,6 0 0,0 6,18C6,18.55 6.45,19 7,19H17C17.55,19 18,18.55 18,18A6,6 0 0,0 12,12M12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10A4,4 0 0,1 8,6A4,4 0 0,1 12,2Z"/>
            </svg>
            <span>{{ bettingData.banker.count }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tie 统计信息 -->
    <div class="statistics-area tie-statistics">
      <div class="statistics">
        <!-- 圆形百分比指示器 -->
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
        <!-- 金额和人数信息 -->
        <div class="info">
          <div class="info-line">
            <svg class="icon-currency" viewBox="0 0 24 24" fill="white">
              <path d="M15 18.5C12.5 18.5 10.3 17.1 9.2 15H15L16 13H8.6C8.5 12.5 8.5 12 8.5 11.5S8.5 10.5 8.6 10H16L17 8H9.2C10.3 5.9 12.5 4.5 15 4.5C16.3 4.5 17.5 4.9 18.5 5.6L20 4.1C18.6 3 16.9 2.5 15 2.5C11.5 2.5 8.5 4.6 7.1 7.5H4L3 9.5H6.5C6.5 10 6.5 10.5 6.5 11S6.5 12 6.5 12.5H3L2 14.5H7.1C8.5 17.4 11.5 19.5 15 19.5C16.9 19.5 18.6 19 20 17.9L18.5 16.4C17.5 17.1 16.3 17.5 15 18.5Z"/>
            </svg>
            <span class="amount">{{ formatAmount(bettingData.tie.amount) }}</span>
          </div>
          <div class="info-line">
            <svg class="icon-person" viewBox="0 0 24 24" fill="#00FF00">
              <path d="M12,12A6,6 0 0,0 6,18C6,18.55 6.45,19 7,19H17C17.55,19 18,18.55 18,18A6,6 0 0,0 12,12M12,2A4,4 0 0,1 16,6A4,4 0 0,1 12,10A4,4 0 0,1 8,6A4,4 0 0,1 12,2Z"/>
            </svg>
            <span>{{ bettingData.tie.count }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview 百家乐投注统计信息显示层
 * @description 显示各投注区域的百分比、金额和人数统计
 * @version 2.0.0 - 实现动态数据（真实投注+模拟数据）
 */

import { computed } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'

// ========================= 类型定义 =========================

type BetZone = 'player' | 'banker' | 'tie'

interface BettingInfo {
  percentage: number  // 百分比
  amount: number      // 总金额
  count: number       // 总人数
}

// ========================= Store 集成 =========================
const bettingStore = useBettingStore()

// ========================= 辅助函数 =========================

/**
 * 格式化金额显示
 * @param amount 金额
 * @returns 格式化后的字符串
 */
const formatAmount = (amount: number): string => {
  // 保留2位小数
  return amount.toFixed(2)
}

/**
 * 计算单个区域的统计数据
 * @param betType 投注类型
 * @returns 该区域的统计信息
 */
const calculateZoneData = (betType: BetZone): { amount: number; count: number } => {
  // 从 bettingStore 获取数据
  const displayData = bettingStore.getBetZoneDisplayData(betType)

  // 真实用户投注
  const userAmount = displayData.userAmount || 0
  const userCount = userAmount > 0 ? 1 : 0  // 如果用户有投注，算作1人

  // 模拟的其他玩家数据
  const otherAmount = displayData.otherTotalAmount || 0
  const otherCount = displayData.otherPlayerCount || 0

  // 合并真实和模拟数据
  return {
    amount: userAmount + otherAmount,
    count: userCount + otherCount
  }
}

// ========================= 计算属性 - 动态数据 =========================

/**
 * 计算所有区域的投注统计数据
 * 包括真实投注和模拟数据的混合
 */
const bettingData = computed<Record<BetZone, BettingInfo>>(() => {
  // 获取三个主要区域的数据
  const playerData = calculateZoneData('player')
  const bankerData = calculateZoneData('banker')
  const tieData = calculateZoneData('tie')

  // 计算总金额（用于百分比计算）
  const totalAmount = playerData.amount + bankerData.amount + tieData.amount

  // 避免除零错误
  const safeTotal = totalAmount > 0 ? totalAmount : 1

  // 计算百分比并返回结果
  return {
    player: {
      percentage: Math.round((playerData.amount / safeTotal) * 100),
      amount: playerData.amount,
      count: playerData.count
    },
    banker: {
      percentage: Math.round((bankerData.amount / safeTotal) * 100),
      amount: bankerData.amount,
      count: bankerData.count
    },
    tie: {
      percentage: Math.round((tieData.amount / safeTotal) * 100),
      amount: tieData.amount,
      count: tieData.count
    }
  }
})
</script>

<style scoped>
/* 样式保持不变，与原组件相同 */

/* ========================= 层容器 ========================= */
.user-bet-msg-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 不阻止点击穿透 */
  z-index: 3;
}

/* ========================= 统计区域定位 ========================= */
.statistics-area {
  position: absolute;
  top: 15px;
}

/* Player 统计位置 */
.player-statistics {
  left: 15px;
  width: calc(50% - 90px);
}

/* Banker 统计位置 */
.banker-statistics {
  right: 15px;
  width: calc(50% - 90px);
}

/* Tie 统计位置 */
.tie-statistics {
  left: 50%;
  transform: translateX(-50%);
  top: 42px;
  width: 31%;
}

/* ========================= 统计信息 ========================= */
.statistics {
  display: flex;
  align-items: center;
  gap: 6px;
  animation: fadeIn 0.5s ease-out;
}

/* ========================= 圆形百分比指示器 ========================= */
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

/* ========================= 信息显示区域 ========================= */
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

/* ========================= 区域特定布局 ========================= */

/* Player 统计左对齐 */
.player-statistics .statistics {
  flex-direction: row;
}

.player-statistics .info {
  align-items: flex-start;
}

/* Banker 统计右对齐 */
.banker-statistics .statistics {
  flex-direction: row-reverse;
  justify-content: flex-start;
}

.banker-statistics .info {
  align-items: flex-end;
}

/* Tie 统计居中 */
.tie-statistics .statistics {
  flex-direction: column;
  align-items: center;
}

.tie-statistics .info {
  flex-direction: row;
  gap: 10px;
  align-items: center;
  margin-top: 4px;
}

.tie-statistics .info-line {
  font-size: 10px;
}

/* ========================= 动画 ========================= */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
