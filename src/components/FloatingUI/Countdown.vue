<!-- src/components/FloatingUI/Countdown.vue - 霓虹灯效果倒计时 -->
<template>
  <div class="countdown-wrapper" v-show="showCountdown">
    <div class="countdown-container">
      <!-- 发光层画布 -->
      <canvas
        ref="glowCanvas"
        class="glow-canvas"
        :width="canvasSize"
        :height="canvasSize"
      ></canvas>

      <!-- 主画布 -->
      <canvas
        ref="mainCanvas"
        class="main-canvas"
        :width="canvasSize"
        :height="canvasSize"
      ></canvas>

      <!-- 数字显示 -->
      <div class="countdown-number" :class="{ urgent: isUrgent }">
        {{ displayTime }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// Props
interface Props {
  maxTime?: number
  size?: number  // 画布大小
}

const props = withDefaults(defineProps<Props>(), {
  maxTime: 30,
  size: 100  // 默认100px
})

// Store
const gameStore = useGameStore()

// Refs
const glowCanvas = ref<HTMLCanvasElement>()
const mainCanvas = ref<HTMLCanvasElement>()

// 响应式数据
const timeLeft = ref(props.maxTime)
const isRunning = ref(false)
const showCountdown = ref(true)
let timer: number | null = null
let animationFrame: number | null = null

// Canvas相关
const canvasSize = computed(() => props.size)
const centerX = computed(() => props.size / 2)
const centerY = computed(() => props.size / 2)
const radius = computed(() => props.size * 0.35)

// 计算属性
const displayTime = computed(() => {
  return timeLeft.value.toString()
})

const isUrgent = computed(() => {
  return timeLeft.value <= 5 && timeLeft.value > 0
})

const progress = computed(() => {
  return timeLeft.value / props.maxTime
})

// 绘制倒计时圆环
const drawCountdown = () => {
  if (!glowCanvas.value || !mainCanvas.value) return

  const glowCtx = glowCanvas.value.getContext('2d')
  const mainCtx = mainCanvas.value.getContext('2d')

  if (!glowCtx || !mainCtx) return

  // 清空画布
  glowCtx.clearRect(0, 0, canvasSize.value, canvasSize.value)
  mainCtx.clearRect(0, 0, canvasSize.value, canvasSize.value)

  // 计算角度
  const startAngle = -Math.PI / 2
  const endAngle = startAngle + (Math.PI * 2 * progress.value)

  // 1. 绘制黑色半透明背景圆
  mainCtx.beginPath()
  mainCtx.arc(centerX.value, centerY.value, radius.value, 0, Math.PI * 2)
  mainCtx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  mainCtx.fill()

  // 根据紧急状态选择颜色
  const color = isUrgent.value ?
    { r: 255, g: 68, b: 68, hex: '#ff4444' } :
    { r: 0, g: 255, b: 136, hex: '#00ff88' }

  // 2. 绘制多层发光效果
  if (progress.value > 0) {
    // 最外层大光晕
    glowCtx.save()
    glowCtx.filter = 'blur(10px)'
    glowCtx.beginPath()
    glowCtx.arc(centerX.value, centerY.value, radius.value, startAngle, endAngle)
    glowCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`
    glowCtx.lineWidth = 12
    glowCtx.lineCap = 'round'
    glowCtx.stroke()
    glowCtx.restore()

    // 中层光晕
    glowCtx.save()
    glowCtx.filter = 'blur(6px)'
    glowCtx.beginPath()
    glowCtx.arc(centerX.value, centerY.value, radius.value, startAngle, endAngle)
    glowCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.3)`
    glowCtx.lineWidth = 10
    glowCtx.lineCap = 'round'
    glowCtx.stroke()
    glowCtx.restore()

    // 内层光晕
    glowCtx.save()
    glowCtx.filter = 'blur(3px)'
    glowCtx.beginPath()
    glowCtx.arc(centerX.value, centerY.value, radius.value, startAngle, endAngle)
    glowCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.4)`
    glowCtx.lineWidth = 8
    glowCtx.lineCap = 'round'
    glowCtx.stroke()
    glowCtx.restore()
  }

  // 3. 绘制背景圆环
  mainCtx.beginPath()
  mainCtx.arc(centerX.value, centerY.value, radius.value, 0, Math.PI * 2)
  mainCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  mainCtx.lineWidth = 8
  mainCtx.stroke()

  // 4. 绘制主圆环
  if (progress.value > 0) {
    mainCtx.save()
    mainCtx.shadowBlur = 8
    mainCtx.shadowColor = `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)`
    mainCtx.beginPath()
    mainCtx.arc(centerX.value, centerY.value, radius.value, startAngle, endAngle)
    mainCtx.strokeStyle = color.hex
    mainCtx.lineWidth = 8
    mainCtx.lineCap = 'round'
    mainCtx.stroke()
    mainCtx.restore()

    // 5. 绘制中心亮线（霓虹灯管效果）
    mainCtx.save()
    mainCtx.beginPath()
    mainCtx.arc(centerX.value, centerY.value, radius.value, startAngle, endAngle)
    mainCtx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
    mainCtx.lineWidth = 2
    mainCtx.lineCap = 'round'
    mainCtx.stroke()
    mainCtx.restore()
  }
}

// 动画循环
const animate = () => {
  drawCountdown()
  if (isRunning.value) {
    animationFrame = requestAnimationFrame(animate)
  }
}

// 开始倒计时
const startCountdown = () => {
  if (timer) clearInterval(timer)

  isRunning.value = true
  timeLeft.value = props.maxTime
  showCountdown.value = true

  // 开始动画
  animate()

  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      stopCountdown()
    }
  }, 1000) as unknown as number
}

// 停止倒计时
const stopCountdown = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
  isRunning.value = false
  drawCountdown() // 最后绘制一次
}

// 重置倒计时
const resetCountdown = () => {
  stopCountdown()
  timeLeft.value = props.maxTime
  showCountdown.value = false
}

// 监听游戏状态变化
watch(() => gameStore.gameStatus, (newStatus) => {
  console.log('⏱️ 游戏状态变化:', newStatus)

  if (newStatus === 'betting') {
    startCountdown()
  } else if (newStatus === 'dealing' || newStatus === 'waiting') {
    resetCountdown()
  }
})

// 监听时间变化，重绘
watch(timeLeft, () => {
  if (!isRunning.value) {
    drawCountdown()
  }
})

// 生命周期
onMounted(async () => {
  await nextTick()
  console.log('⏱️ 霓虹倒计时组件已挂载')

  // 初始绘制
  drawCountdown()

  // 如果是投注状态就开始
  if (gameStore.gameStatus === 'betting') {
    startCountdown()
  }
})

onUnmounted(() => {
  stopCountdown()
})

// 暴露方法
defineExpose({
  startCountdown,
  stopCountdown,
  resetCountdown,
  timeLeft,
  isRunning
})
</script>

<style scoped>
.countdown-wrapper {
  position: relative;
  display: inline-block;
}

.countdown-container {
  position: relative;
  width: v-bind('canvasSize + "px"');
  height: v-bind('canvasSize + "px"');
}

/* 画布层叠 */
.glow-canvas,
.main-canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.glow-canvas {
  z-index: 1;
}

.main-canvas {
  z-index: 2;
}

/* 数字显示 */
.countdown-number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: calc(v-bind('canvasSize + "px"') * 0.3);
  font-weight: bold;
  color: white;
  font-family: 'Arial', sans-serif;
  z-index: 10;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
  user-select: none;
  line-height: 1;
}

.countdown-number.urgent {
  color: #ff4444;
  text-shadow: 0 0 20px rgba(255, 68, 68, 0.8);
  animation: pulse 1s ease-in-out infinite;
}

/* 脉动动画 */
@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
  }
}

/* 整体淡入动画 */
.countdown-wrapper {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .countdown-number {
    font-size: calc(v-bind('canvasSize + "px"') * 0.28);
  }
}

@media (max-width: 480px) {
  .countdown-number {
    font-size: calc(v-bind('canvasSize + "px"') * 0.25);
  }
}
</style>
