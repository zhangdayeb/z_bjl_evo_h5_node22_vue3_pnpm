<template>
  <div class="pc-game-count">
    <!-- 左侧：余额 -->
    <div class="balance-section">
      <div class="balance-label">余额</div>
      <div class="balance-amount">€{{ formattedBalance }}</div>
      <button class="refresh-btn" @click="handleRefresh" title="刷新余额">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
        </svg>
      </button>
    </div>

    <!-- 中间：终局和总投注 -->
    <div class="center-section">
      <div class="stat-item">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" fill="#4CAF50"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-label">终局</div>
          <div class="stat-value">{{ gameNumber }}</div>
        </div>
      </div>

      <div class="stat-item">
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="10" fill="#FFA726"/>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-label">总投注</div>
          <div class="stat-value">€{{ formattedTotalBet }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧：赔率和游戏大厅按钮 -->
    <div class="actions-section">
      <button class="action-btn odds-btn" @click="handleOdds">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
        </svg>
        <span>赔率</span>
      </button>

      <button class="action-btn lobby-btn" @click="handleLobby">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span>游戏大厅</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useBettingStore } from '@/stores/bettingStore'

const gameStore = useGameStore()
const bettingStore = useBettingStore()

// 余额
const balance = computed(() => gameStore.displayBalance || 0)
const formattedBalance = computed(() => {
  return balance.value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})

// 局号
const gameNumber = computed(() => gameStore.gameNumber || '0')

// 总投注
const totalBet = computed(() => bettingStore.totalBetAmount || 0)
const formattedTotalBet = computed(() => {
  return totalBet.value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
})

// 事件处理
const handleRefresh = () => {
  console.log('[GameCount] 刷新余额')
  gameStore.refreshBalance()
}

const handleOdds = () => {
  console.log('[GameCount] 打开赔率')
}

const handleLobby = () => {
  console.log('[GameCount] 返回游戏大厅')
}
</script>

<style scoped>
.pc-game-count {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(53, 38, 13, 0.8) 100%);
  z-index: 20;
}

/* 左侧余额区域 */
.balance-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
}

.balance-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.balance-amount {
  font-size: 18px;
  font-weight: bold;
  color: #FFD700;
}

.refresh-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(180deg);
}

.refresh-btn svg {
  width: 18px;
  height: 18px;
}

/* 中间统计区域 */
.center-section {
  display: flex;
  gap: 24px;
  align-items: center;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
}

.stat-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 100%;
  height: 100%;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: white;
}

/* 右侧按钮区域 */
.actions-section {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  color: white;
}

.action-btn svg {
  width: 20px;
  height: 20px;
}

.odds-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.odds-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.lobby-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.lobby-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
}

/* 响应式调整 */
@media (max-width: 1366px) {
  .pc-game-count {
    height: 50px;
    padding: 0 16px;
  }

  .balance-amount {
    font-size: 16px;
  }

  .stat-value {
    font-size: 13px;
  }

  .action-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
}

@media (min-width: 1920px) {
  .pc-game-count {
    height: 70px;
  }

  .balance-amount {
    font-size: 20px;
  }

  .stat-value {
    font-size: 16px;
  }
}
</style>
