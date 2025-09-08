<template>
  <div class="bet-container">
    <div class="bet-list">
      <div v-for="(bet, index) in bets" :key="index" class="bet-item">
        ${{ bet.amount }}  {{ bet.username }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserBet',
  data() {
    return {
      bets: []
    };
  },
  mounted() {
    // 初始生成一些数据
    for (let i = 0; i < 10; i++) {
      this.addBet();
    }

    // 每秒添加一条新数据
    setInterval(() => {
      this.addBet();
    }, 1000);
  },
  methods: {
    addBet() {
      const amount = (Math.random() * 9999).toFixed(2);
      const username = `yy_${Math.floor(Math.random() * 9999)}`;

      this.bets.push({
        amount,
        username
      });

      // 保持列表不要太长
      if (this.bets.length > 30) {
        this.bets.shift();
      }
    }
  }
};
</script>

<style scoped>
.bet-container {
  width: 30vw;
  height: 200px;
  background: transparent;
  overflow: hidden;
  position: relative;
}

.bet-list {
  animation: scroll-up 10s linear infinite;
}

@keyframes scroll-up {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(-100%);
  }
}

.bet-item {
  color: white;
  padding: 5px 10px;
  font-size: 14px;
  line-height: 1.5;
  white-space: nowrap;
}
</style>
