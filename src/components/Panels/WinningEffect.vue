<!-- src/components/Panels/WinningEffect.vue -->
<template>
  <div class="winning-effect-overlay">
    <div class="winning-display">
      <canvas ref="arcCanvas" class="arc-canvas"></canvas>

      <!-- 文字内容 -->
      <div class="content-wrapper">
        <!-- YOU WIN 文字 -->
        <div class="win-text">YOU WIN</div>

        <!-- 金额显示 -->
        <div class="amount">
          <span class="currency">€</span>{{ formattedWinAmount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview 中奖效果展示组件
 * @description 显示中奖动画和金额，从 gameStore.betResult 获取中奖数据
 */

import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// ========================= Store =========================
const gameStore = useGameStore()

// ========================= Refs =========================
const arcCanvas = ref<HTMLCanvasElement | null>(null)

// ========================= 计算属性 =========================

/**
 * 中奖金额 - 从 gameStore.betResult 获取
 */
const winAmount = computed(() => {
  const betResult = gameStore.betResult
  if (!betResult) return 0

  // 尝试多个可能的字段名
  return betResult.winAmount || betResult.win_or_loss_info || betResult.totalWin || 0
})

/**
 * 格式化的中奖金额
 */
const formattedWinAmount = computed(() => {
  return winAmount.value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
})

function drawArc() {
  if (!arcCanvas.value) return;

  const canvas = arcCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 设置参数
  const width = window.innerWidth; // 100% 宽度
  const arcDegrees = 180; // 180度
  const squashFactor = 0.6; // 压扁程度 60%
  const centerOpacity = 1; // 中心透明度 100%

  // 将角度转换为弧度
  const arcRadians = (arcDegrees * Math.PI) / 180;

  // 计算椭圆的半径
  const radiusX = width / 2;
  const radiusY = radiusX * squashFactor;

  // 计算弧形的实际高度
  const startAngle = (Math.PI - arcRadians) / 2;
  const endAngle = Math.PI - startAngle;
  const arcHeight = radiusY * (1 - Math.cos(arcRadians / 2));

  // 调整canvas尺寸
  canvas.width = width;
  canvas.height = arcHeight + 40;

  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 计算椭圆中心位置
  const centerX = canvas.width / 2;
  const centerY = radiusY - arcHeight + 20;

  // 保存上下文状态
  ctx.save();

  // 创建椭圆弧形裁剪路径
  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, startAngle, endAngle, false);
  ctx.lineTo(centerX, centerY);
  ctx.closePath();
  ctx.clip();

  // 创建椭圆形径向渐变
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.scale(1, squashFactor);

  const gradient = ctx.createRadialGradient(
    0, 0, 0,
    0, 0, radiusX
  );

  // 慢-快渐变模式：前60%缓慢，后40%快速
  gradient.addColorStop(0, `rgba(0, 0, 0, ${centerOpacity})`);
  gradient.addColorStop(0.2, `rgba(0, 0, 0, ${centerOpacity * 0.95})`);
  gradient.addColorStop(0.4, `rgba(0, 0, 0, ${centerOpacity * 0.85})`);
  gradient.addColorStop(0.6, `rgba(0, 0, 0, ${centerOpacity * 0.7})`);
  gradient.addColorStop(0.75, `rgba(0, 0, 0, ${centerOpacity * 0.4})`);
  gradient.addColorStop(0.85, `rgba(0, 0, 0, ${centerOpacity * 0.15})`);
  gradient.addColorStop(0.95, `rgba(0, 0, 0, ${centerOpacity * 0.03})`);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = gradient;
  ctx.fillRect(-radiusX, -radiusY / squashFactor, radiusX * 2, radiusY * 2 / squashFactor);

  ctx.restore();
  ctx.restore();

  // 绘制顶部发光金边
  ctx.save();

  // 计算顶部直线的起点和终点
  const topLineStartX = centerX - radiusX * Math.sin(arcRadians / 2);
  const topLineEndX = centerX + radiusX * Math.sin(arcRadians / 2);
  const topLineY = centerY + radiusY * Math.cos(arcRadians / 2);

  // 创建线性渐变，两边透明，中间金色
  const edgeGradient = ctx.createLinearGradient(topLineStartX, topLineY, topLineEndX, topLineY);
  edgeGradient.addColorStop(0, 'rgba(255, 215, 0, 0)');
  edgeGradient.addColorStop(0.05, 'rgba(255, 215, 0, 0.2)');
  edgeGradient.addColorStop(0.15, 'rgba(255, 215, 0, 0.6)');
  edgeGradient.addColorStop(0.25, 'rgba(255, 215, 0, 0.9)');
  edgeGradient.addColorStop(0.5, 'rgba(255, 215, 0, 1)');
  edgeGradient.addColorStop(0.75, 'rgba(255, 215, 0, 0.9)');
  edgeGradient.addColorStop(0.85, 'rgba(255, 215, 0, 0.6)');
  edgeGradient.addColorStop(0.95, 'rgba(255, 215, 0, 0.2)');
  edgeGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');

  // 设置金边样式
  ctx.strokeStyle = edgeGradient;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';

  // 添加强烈的发光效果
  ctx.shadowColor = '#FFD700';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 3;

  // 绘制顶部直线
  ctx.beginPath();
  ctx.moveTo(topLineStartX, topLineY);
  ctx.lineTo(topLineEndX, topLineY);
  ctx.stroke();

  // 绘制第二层发光增强效果
  ctx.shadowBlur = 8;
  ctx.shadowOffsetY = 1;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(topLineStartX, topLineY);
  ctx.lineTo(topLineEndX, topLineY);
  ctx.stroke();

  // 绘制第三层柔和光晕
  ctx.shadowBlur = 20;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.moveTo(topLineStartX, topLineY);
  ctx.lineTo(topLineEndX, topLineY);
  ctx.stroke();

  ctx.restore();
}

let resizeTimeout: number;

function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    drawArc();
  }, 100);
}

onMounted(() => {
  drawArc();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  clearTimeout(resizeTimeout);
});
</script>

<style scoped>
.winning-effect-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.winning-display {
  position: relative;
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.arc-canvas {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  z-index: 1;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  text-align: center;
  /* 删除所有内边距 */
  padding: 0;
  /* 稍微向上偏移 */
  transform: translateY(-8px);
}

/* YOU WIN 文字 */
.win-text {
  color: #FFFFFF;
  font-size: 26px;
  /* 删除 font-weight: bold; */
  text-align: center;
  /* 删除所有外边距，让文字紧凑 */
  margin: 0;
  padding: 0;
  line-height: 1;
  text-shadow:
    0 0 4px rgba(0, 0, 0, 0.5),
    2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* 金额显示 */
.amount {
  color: #FFD700;
  font-size: 42px;
  font-weight: bold;
  text-align: center;
  /* 删除所有外边距，让文字紧凑 */
  margin: 0;
  padding: 0;
  line-height: 1.2;
  margin-top: 10px; /* 只保留很小的间距 */
  text-shadow:
    0 0 4px rgba(0, 0, 0, 0.5),
    2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* 货币符号稍小 */
.currency {
  font-size: 0.9em;
  margin-right: 2px;
}

/* 删除所有移动端适配 */

/* 可选：添加简单的淡入动画 */
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

.win-text {
  animation: fadeIn 0.6s ease-out;
}

.amount {
  animation: fadeIn 0.6s ease-out 0.2s both;
}
</style>
