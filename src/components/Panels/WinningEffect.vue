<!-- src/components/Effects/WinningEffect.vue -->
<template>
  <div class="winning-effect-overlay">
    <div class="winning-display">
      <!-- 背景光晕 -->
      <div class="glow-bg"></div>

      <!-- YOU WIN 文字 -->
      <div class="win-text">YOU WIN</div>

      <!-- 金额显示 -->
      <div class="amount-container">
        <div class="amount">
          <span class="currency">€</span>13,271.04
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 暂时静态，不需要任何props或逻辑
</script>

<style scoped>
.winning-effect-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.winning-display {
  position: relative;
  text-align: center;
  padding: 30px 120px 40px;
  /* 非常浅的弧形背景 */
  background: #0f0f0f;
  border-radius: 0 0 50% 50% / 0 0 15% 15%;
  min-width: 400px;
  /* 顶部金色边框 */
  border-top: 3px solid #ffd700;
  box-shadow:
    0 -3px 20px rgba(255, 215, 0, 0.5),
    inset 0 -2px 10px rgba(255, 215, 0, 0.2);
}

/* 背景光晕 */
.glow-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  height: 150px;
  background: radial-gradient(ellipse at center,
    rgba(255, 215, 0, 0.15) 0%,
    rgba(255, 215, 0, 0.08) 30%,
    rgba(255, 215, 0, 0.03) 60%,
    transparent 100%);
  filter: blur(20px);
  z-index: 0;
}

/* YOU WIN 文字 */
.win-text {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 2px;
  margin-bottom: 15px;
  text-transform: uppercase;
  opacity: 0.95;
}

/* 金额显示容器 */
.amount-container {
  position: relative;
  display: inline-block;
}

/* 金额文字 - 立体金色效果 */
.amount {
  color: #FFD700;
  font-size: 48px;
  font-weight: 900;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 2;
  /* 立体文字效果 */
  text-shadow:
    /* 底部阴影 - 创建厚度 */
    0 1px 0 #B8860B,
    0 2px 0 #B8860B,
    0 3px 0 #B8860B,
    0 4px 0 #B8860B,
    0 5px 0 #B8860B,
    0 6px 0 #B8860B,
    /* 深色边缘 */
    0 7px 1px rgba(0, 0, 0, 0.4),
    0 8px 2px rgba(0, 0, 0, 0.3),
    0 9px 3px rgba(0, 0, 0, 0.2),
    /* 外发光 */
    0 0 20px rgba(255, 215, 0, 0.5),
    0 0 40px rgba(255, 215, 0, 0.3),
    0 0 60px rgba(255, 215, 0, 0.2);
  /* 渐变填充 */
  background: linear-gradient(
    180deg,
    #FFED4E 0%,
    #FFD700 20%,
    #FFC700 40%,
    #FFB300 60%,
    #B8860B 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 移除之前的伪元素发光效果 */

/* 货币符号稍小 */
.currency {
  font-size: 0.85em;
  margin-right: 3px;
  /* 同样应用立体效果 */
  background: linear-gradient(
    180deg,
    #FFED4E 0%,
    #FFD700 20%,
    #FFC700 40%,
    #FFB300 60%,
    #B8860B 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 简单的呼吸光效 */
@keyframes amountGlow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

.amount {
  animation: amountGlow 3s ease-in-out infinite;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .winning-display {
    padding: 25px 80px 35px;
    min-width: 320px;
  }

  .amount {
    font-size: 36px;
  }

  .win-text {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .winning-display {
    padding: 20px 60px 30px;
    min-width: 280px;
  }

  .amount {
    font-size: 32px;
  }

  .win-text {
    font-size: 14px;
  }

  .glow-bg {
    width: 250px;
    height: 120px;
  }
}
</style>
