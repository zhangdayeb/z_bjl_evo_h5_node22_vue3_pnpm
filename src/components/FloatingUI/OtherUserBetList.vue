<!-- src/components/FloatingUI/OtherUserBetList.vue - 其他用户投注列表 -->
<template>
  <div class="bet-container" v-show="showBetList">
    <!-- 顶部渐变遮罩 -->
    <div class="gradient-mask gradient-top"></div>

    <!-- 滚动内容 -->
    <div class="bet-scroll-wrapper">
      <div class="bet-list" :style="{
        transform: `translate3d(0, ${translateY}px, 0)`,
        transition: `transform ${totalDuration}s linear`
      }">
        <div v-for="(bet, index) in currentBets" :key="`${animationKey}-${index}`"
             class="bet-item"
             :class="{ 'is-gold': index === 0 }">
          <span class="bet-amount">€{{ bet.amount }}</span>&nbsp;<span class="bet-username">{{ bet.username }}</span>
        </div>
      </div>
    </div>

    <!-- 底部渐变遮罩 -->
    <div class="gradient-mask gradient-bottom"></div>
  </div>
</template>

<script>
import { useGameStore } from '@/stores/gameStore'

export default {
  name: 'OtherUserBetList',
  setup() {
    const gameStore = useGameStore()
    return { gameStore }
  },
  data() {
    return {
      showBetList: false,
      // 金额池 - 30个不同的金额
      amountPool: [
        '3,219', '2,408', '1,848', '1,236', '985',
        '884', '748', '632', '511', '499',
        '397', '388', '361', '354', '340',
        '235', '198', '187', '165', '149',
        '99.30', '88.50', '75.20', '61.57', '54.35',
        '46.89', '41.27', '35.75', '30.21', '25.50'
      ],

      // 用户名池 - 30个用户名（韩文为主，少量英文）
      usernamePool: [
        '김민수', '박지성', '이준호', '최강민', '정수연',
        '김태희', '송중기', '한지민', '권지용', '박보검',
        '조인성', '김수현', '이병헌', '현빈', '공유',
        '이동욱', '박서준', '지창욱', '남주혁', '차은우',
        '김우빈', '강동원', '유아인', '이종석', '김종국',
        'Lucas88', 'Tommy_K', 'RICH_JOHN', 'Alex_Pro', 'Star_Player'
      ],

      currentBets: [],
      translateY: 0,
      itemHeight: 24,
      scrollSpeed: 20,
      animationKey: 0, // 用于强制重新渲染
      animationTimer: null
    };
  },
  computed: {
    totalDuration() {
      const containerEl = this.$el;
      const containerHeight = containerEl ? containerEl.offsetHeight : 400;
      const totalDistance = this.currentBets.length * this.itemHeight + containerHeight + 100;
      return totalDistance / this.scrollSpeed;
    }
  },
  watch: {
    // 监听游戏状态变化
    'gameStore.gameStatus'(newStatus) {
      console.log('📊 投注列表 - 游戏状态变化:', newStatus)

      if (newStatus === 'betting') {
        // 投注阶段 - 显示并开始动画
        this.showBetList = true
        this.$nextTick(() => {
          this.startNewAnimation()
        })
      } else if (newStatus === 'dealing' || newStatus === 'waiting') {
        // 发牌或等待阶段 - 隐藏
        this.showBetList = false
        this.stopAnimation()
      }
    }
  },
  mounted() {
    console.log('📊 投注列表组件已挂载')

    // 如果当前是投注状态就开始
    if (this.gameStore.gameStatus === 'betting') {
      this.showBetList = true
      this.$nextTick(() => {
        this.startNewAnimation()
      })
    }
  },
  beforeDestroy() {
    this.stopAnimation();
  },
  methods: {
    // 生成随机组合的投注列表
    generateRandomBets() {
      // 复制池子以避免修改原数组
      const amounts = [...this.amountPool];
      const usernames = [...this.usernamePool];

      // 打乱数组
      this.shuffle(amounts);
      this.shuffle(usernames);

      // 生成20-30条随机数据
      const betCount = Math.floor(Math.random() * 11) + 20; // 20-30条
      const bets = [];

      for (let i = 0; i < betCount; i++) {
        bets.push({
          amount: amounts[i % amounts.length],
          username: usernames[i % usernames.length]
        });
      }

      // 按金额排序（第一个最大，显示金色）
      bets.sort((a, b) => {
        const amountA = parseFloat(a.amount.replace(',', ''));
        const amountB = parseFloat(b.amount.replace(',', ''));
        return amountB - amountA;
      });

      return bets;
    },

    // Fisher-Yates 洗牌算法
    shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    },

    // 开始新的动画
    startNewAnimation() {
      // 生成新的随机数据
      this.currentBets = this.generateRandomBets();

      // 重置动画状态
      this.translateY = 0;
      this.animationKey++; // 强制重新渲染

      // 下一帧开始动画
      this.$nextTick(() => {
        setTimeout(() => {
          this.startScrolling();
        }, 100);
      });
    },

    // 停止动画
    stopAnimation() {
      if (this.animationTimer) {
        clearTimeout(this.animationTimer);
        this.animationTimer = null;
      }
      this.translateY = 0;
      this.currentBets = [];
    },

    // 开始滚动
    startScrolling() {
      const containerEl = this.$el;
      const containerHeight = containerEl ? containerEl.offsetHeight : 400;
      const totalHeight = this.currentBets.length * this.itemHeight + 100;

      this.translateY = -totalHeight;

      const betList = this.$el.querySelector('.bet-list');
      if (betList) {
        betList.style.paddingTop = `${containerHeight}px`;
      }
    }
  }
};
</script>

<style scoped>
.bet-container {
  position: absolute;
  left: 0;
  top: 20%;
  width: 30%;
  height: 60%;
  background: rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border-radius: 8px;
  pointer-events: none;
}

.bet-scroll-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.bet-list {
  will-change: transform;
}

.bet-item {
  color: rgba(255, 255, 255, 0.9);
  padding: 1px 15px;  /* 减少上下padding，从2px改为1px */
  height: 20px;  /* 减小高度，从24px改为20px */
  line-height: 18px;  /* 调整行高 */
  font-size: 13px;  /* 稍微减小字体，从14px改为13px */
  display: flex;
  align-items: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 金色高亮第一名 */
.bet-item.is-gold {
  color: #ffd700;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.bet-item.is-gold .bet-amount {
  color: #ffd700;
}

/* 金额样式 - 金黄色 */
.bet-amount {
  color: #ffb800;
  font-weight: 500;
  text-shadow: 0 0 5px rgba(255, 184, 0, 0.3);
}

/* 用户名样式 */
.bet-username {
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 渐变遮罩效果 - 四周透明淡出 */
.gradient-mask {
  position: absolute;
  pointer-events: none;
  z-index: 10;
}

/* 上下渐变 - 边缘完全透明 */
.gradient-top {
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(
    to bottom,
    transparent 0%,              /* 顶部完全透明 */
    transparent 20%,             /* 保持透明 */
    rgba(0, 0, 0, 0.02) 50%,    /* 非常轻微的黑色 */
    rgba(0, 0, 0, 0.03) 100%    /* 中间部分极淡的遮罩 */
  );
}

.gradient-bottom {
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(
    to top,
    transparent 0%,              /* 底部完全透明 */
    transparent 20%,             /* 保持透明 */
    rgba(0, 0, 0, 0.02) 50%,    /* 非常轻微的黑色 */
    rgba(0, 0, 0, 0.03) 100%    /* 中间部分极淡的遮罩 */
  );
}

/* 左右渐变 - 边缘完全透明 */
.gradient-left {
  top: 0;
  bottom: 0;
  left: 0;
  width: 50px;
  background: linear-gradient(
    to right,
    transparent 0%,              /* 左边完全透明 */
    transparent 20%,             /* 保持透明 */
    rgba(0, 0, 0, 0.02) 50%,    /* 非常轻微的黑色 */
    rgba(0, 0, 0, 0.03) 100%    /* 中间部分极淡的遮罩 */
  );
}

.gradient-right {
  top: 0;
  bottom: 0;
  right: 0;
  width: 50px;
  background: linear-gradient(
    to left,
    transparent 0%,              /* 右边完全透明 */
    transparent 20%,             /* 保持透明 */
    rgba(0, 0, 0, 0.02) 50%,    /* 非常轻微的黑色 */
    rgba(0, 0, 0, 0.03) 100%    /* 中间部分极淡的遮罩 */
  );
}

/* 响应式调整 - 已移除 */
</style>
