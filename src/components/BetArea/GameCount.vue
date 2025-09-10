<template>
  <div class="table-info-container">
    <!-- 第一行：Total Bet 和 时间 -->
    <div class="info-row">
      <!-- Total Bet -->
      <div class="info-item">
        <span class="label">Total Bet</span>
        <span class="amount">€{{ totalBet }}</span>
      </div>

      <!-- 时间 -->
      <div class="time-container">
        <span>{{ currentTime }}</span>
        <span class="time-separator">#</span>
        <span>{{ gameTime }}</span>
      </div>
    </div>

    <!-- 第二行：Balance 和 桌台信息 -->
    <div class="info-row">
      <!-- Balance -->
      <div class="info-item">
        <span class="label">Balance</span>
        <span class="amount">€{{ formattedBalance }}</span>
      </div>

      <!-- 桌台信息 -->
      <div class="table-info">
        <span class="table-name">{{ tableName }}</span>
        <span class="table-limits">€{{ minBet }} – {{ formattedMaxBet }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameCount',
  data() {
    return {
      // 固定数据
      totalBet: 0,
      balance: 931889.82,
      tableName: 'Always 8 Baccarat',
      minBet: 1,
      maxBet: 25000,

      // 时间相关
      currentTime: '00:00',
      gameTime: '00:00:00',
      timeInterval: null
    }
  },
  computed: {
    // 格式化余额显示
    formattedBalance() {
      return this.balance.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    },
    // 格式化最大投注额
    formattedMaxBet() {
      return this.maxBet.toLocaleString('en-US');
    }
  },
  mounted() {
    this.startClock();
    // TODO: 后续从 store 获取数据
    // this.loadDataFromStore();
  },
  beforeUnmount() {
    this.stopClock();
  },
  methods: {
    // 启动时钟
    startClock() {
      this.updateTime();
      this.timeInterval = setInterval(() => {
        this.updateTime();
      }, 1000);
    },
    // 停止时钟
    stopClock() {
      if (this.timeInterval) {
        clearInterval(this.timeInterval);
        this.timeInterval = null;
      }
    },
    // 更新时间
    updateTime() {
      const now = new Date();
      // 当前时间 HH:MM
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      this.currentTime = `${hours}:${minutes}`;

      // 游戏时间（示例：使用当前时间的秒数模拟）
      // TODO: 实际使用时，这里应该是从游戏开始时计算的时间
      const seconds = now.getSeconds();
      const gameHours = String(Math.floor(seconds / 3600)).padStart(2, '0');
      const gameMinutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
      const gameSeconds = String(seconds % 60).padStart(2, '0');
      this.gameTime = `${gameHours}:${gameMinutes}:${gameSeconds}`;
    },

    // 从 store 加载数据（预留方法）
    loadDataFromStore() {
      // TODO: 后续实现
      // this.totalBet = this.$store.state.game.totalBet;
      // this.balance = this.$store.state.user.balance;
      // this.tableName = this.$store.state.game.tableName;
      // this.minBet = this.$store.state.game.minBet;
      // this.maxBet = this.$store.state.game.maxBet;
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 主容器 - 两行布局 */
.table-info-container {
  width: 100%;
  background: #000;
  padding: 4px 12px 6px 12px;
  font-size: 13px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  color: white;
}

/* 信息行 */
.info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 0;
}

/* 信息项 */
.info-item {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

/* 标签样式 */
.label {
  color: rgba(255, 255, 255, 1);
  font-weight: 400;
}

/* 金额黄色 */
.amount {
  color: #ffd700;
  font-weight: 600;
}

/* 时间容器 */
.time-container {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #888;
}

/* 时间分隔符 */
.time-separator {
  color: #666;
}

/* 桌台信息 */
.table-info {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.table-name {
  color: #ffffff;
  font-weight: 500;
}

.table-limits {
  color: rgba(255, 255, 255, 0.7);
}

/* 响应式布局 */
@media (max-width: 768px) {
  .table-info-container {
    font-size: 12px;
    padding: 3px 10px 5px 10px;
  }
}

@media (max-width: 640px) {
  .table-info-container {
    font-size: 11px;
    padding: 3px 8px 4px 8px;
  }

  /* 小屏幕时隐藏桌台限额 */
  .table-limits {
    display: none;
  }
}

@media (max-width: 480px) {
  .table-info-container {
    font-size: 10px;
  }

  .info-item,
  .time-container,
  .table-info {
    gap: 4px;
  }
}
</style>
