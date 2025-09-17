<!-- src/components/FloatingUI/Countdown.vue - 霓虹灯效果倒计时 -->
<template>
  <div class="countdown-wrapper" v-show="showCountdown">
    <div class="countdown-container">
      <!-- 背景层画布 -->
      <canvas
        ref="backgroundCanvas"
        class="background-canvas"
        :width="canvasSize"
        :height="canvasSize"
      ></canvas>

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

// Store
const gameStore = useGameStore()

// 固定配置
const MAX_TIME = 30  // 固定30秒倒计时
const CANVAS_SIZE = 80  // 固定80px画布大小

// Refs
const backgroundCanvas = ref<HTMLCanvasElement>()
const glowCanvas = ref<HTMLCanvasElement>()
const mainCanvas = ref<HTMLCanvasElement>()

// 响应式数据
const timeLeft = ref(MAX_TIME)
const isRunning = ref(false)
const showCountdown = ref(true)
let timer: number | null = null
let animationFrame: number | null = null

// Canvas相关
const canvasSize = CANVAS_SIZE
const centerX = CANVAS_SIZE / 2
const centerY = CANVAS_SIZE / 2
const radius = 32  // 80 * 0.4 = 32 (原版是80)

// 计算属性
const displayTime = computed(() => {
  return timeLeft.value.toString()
})

const isUrgent = computed(() => {
  return timeLeft.value <= 5 && timeLeft.value > 0  // 保持5秒紧急状态
})

const progress = computed(() => {
  return timeLeft.value / MAX_TIME
})

// 获取颜色配置
const getColors = () => {
  if (isUrgent.value) {
    return {
      r: 255,
      g: 68,
      b: 68,
      hex: '#ff4444',
      dark: '#cc2222'
    }
  }
  return {
    r: 0,
    g: 255,
    b: 136,
    hex: '#00ff88',
    dark: '#00dd77'
  }
}

// 绘制倒计时圆环
const drawCountdown = () => {
  if (!backgroundCanvas.value || !glowCanvas.value || !mainCanvas.value) return

  const bgCtx = backgroundCanvas.value.getContext('2d')
  const glowCtx = glowCanvas.value.getContext('2d')
  const mainCtx = mainCanvas.value.getContext('2d')

  if (!bgCtx || !glowCtx || !mainCtx) return

  // 获取颜色配置
  const color = getColors()

  // 清空所有画布
  bgCtx.clearRect(0, 0, canvasSize, canvasSize)
  glowCtx.clearRect(0, 0, canvasSize, canvasSize)
  mainCtx.clearRect(0, 0, canvasSize, canvasSize)

  // 1. 绘制黑色半透明背景圆
  bgCtx.beginPath()
  bgCtx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  bgCtx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  bgCtx.fill()

  // 2. 绘制极淡的背景圆环轨道
  bgCtx.beginPath()
  bgCtx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  bgCtx.lineWidth = 4  // 10 * 0.4
  bgCtx.stroke()

  // 3. 定义圆环的起始和结束角度
  const startAngle = -Math.PI / 2  // 顶部正中央
  const totalAngle = Math.PI * 2 * progress.value
  const endAngle = startAngle + totalAngle

  // 4. 绘制发光效果（减弱光晕强度）
  if (progress.value > 0) {
    // 外层大光晕
    glowCtx.save()
    glowCtx.filter = 'blur(5px)'  // 12px * 0.4 ≈ 5px
    glowCtx.beginPath()
    glowCtx.arc(centerX, centerY, radius, startAngle, endAngle)
    glowCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.15)`
    glowCtx.lineWidth = 10  // 25 * 0.4
    glowCtx.lineCap = 'round'
    glowCtx.stroke()
    glowCtx.restore()

    // 中层光晕
    glowCtx.save()
    glowCtx.filter = 'blur(2px)'  // 6px * 0.4 ≈ 2px
    glowCtx.beginPath()
    glowCtx.arc(centerX, centerY, radius, startAngle, endAngle)
    glowCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`
    glowCtx.lineWidth = 6  // 15 * 0.4
    glowCtx.lineCap = 'round'
    glowCtx.stroke()
    glowCtx.restore()
  }

  // 5. 绘制双层圆环（深色底色 + 亮色边框）
  if (progress.value > 0) {
    // 5.1 先绘制深色底层（更粗）
    mainCtx.save()
    mainCtx.beginPath()
    mainCtx.arc(centerX, centerY, radius, startAngle, endAngle)
    mainCtx.strokeStyle = color.dark  // 深色
    mainCtx.lineWidth = 4  // 10 * 0.4
    mainCtx.lineCap = 'round'
    mainCtx.stroke()
    mainCtx.restore()

    // 5.2 绘制亮色边框（上下两条细线）
    // 外边缘亮线
    mainCtx.save()
    mainCtx.beginPath()
    mainCtx.arc(centerX, centerY, radius + 1.6, startAngle, endAngle)  // 4 * 0.4
    mainCtx.strokeStyle = color.hex  // 亮色
    mainCtx.lineWidth = 1  // 2 * 0.4 ≈ 1
    mainCtx.lineCap = 'round'
    mainCtx.stroke()
    mainCtx.restore()

    // 内边缘亮线
    mainCtx.save()
    mainCtx.beginPath()
    mainCtx.arc(centerX, centerY, radius - 1.6, startAngle, endAngle)  // 4 * 0.4
    mainCtx.strokeStyle = color.hex  // 亮色
    mainCtx.lineWidth = 1  // 2 * 0.4 ≈ 1
    mainCtx.lineCap = 'round'
    mainCtx.stroke()
    mainCtx.restore()

    // 6. 在尾部位置添加径向渐变遮罩
    if (progress.value > 0.1) {
      // 计算尾部位置
      const tailX = centerX + Math.cos(endAngle) * radius
      const tailY = centerY + Math.sin(endAngle) * radius

      // 创建临时画布用于遮罩
      const maskCanvas = document.createElement('canvas')
      maskCanvas.width = canvasSize
      maskCanvas.height = canvasSize
      const maskCtx = maskCanvas.getContext('2d')

      if (maskCtx) {
        // 先将主画布内容复制到临时画布
        maskCtx.drawImage(mainCanvas.value, 0, 0)

        // 清空主画布
        mainCtx.clearRect(0, 0, canvasSize, canvasSize)

        // 重新绘制，但在尾部应用径向渐变遮罩
        mainCtx.save()
        mainCtx.drawImage(maskCanvas, 0, 0)

        // 设置合成模式为"destination-out"（擦除模式）
        mainCtx.globalCompositeOperation = 'destination-out'

        // 创建径向渐变（中心完全透明，边缘不透明）
        const radialGradient = mainCtx.createRadialGradient(
          tailX, tailY, 0,      // 内圆中心
          tailX, tailY, 8       // 外圆半径（20 * 0.4）
        )

        // 设置渐变（更陡峭的过渡）
        radialGradient.addColorStop(0, 'rgba(0, 0, 0, 1)')    // 中心：完全擦除
        radialGradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.95)') // 快速渐变
        radialGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.5)') // 中间过渡
        radialGradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.1)') // 接近边缘
        radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')    // 边缘：不擦除

        // 应用径向渐变遮罩
        mainCtx.fillStyle = radialGradient
        mainCtx.fillRect(tailX - 8, tailY - 8, 16, 16)  // 40 * 0.4 = 16

        mainCtx.restore()

        // 重新绘制圆环（避免被遮罩影响的部分）
        // 绘制前80%的部分（不受遮罩影响）
        const safeEndAngle = startAngle + totalAngle * 0.8

        // 深色底层
        mainCtx.save()
        mainCtx.beginPath()
        mainCtx.arc(centerX, centerY, radius, startAngle, safeEndAngle)
        mainCtx.strokeStyle = color.dark
        mainCtx.lineWidth = 4
        mainCtx.lineCap = 'round'
        mainCtx.stroke()
        mainCtx.restore()

        // 外边缘亮线
        mainCtx.save()
        mainCtx.beginPath()
        mainCtx.arc(centerX, centerY, radius + 1.6, startAngle, safeEndAngle)
        mainCtx.strokeStyle = color.hex
        mainCtx.lineWidth = 1
        mainCtx.lineCap = 'round'
        mainCtx.stroke()
        mainCtx.restore()

        // 内边缘亮线
        mainCtx.save()
        mainCtx.beginPath()
        mainCtx.arc(centerX, centerY, radius - 1.6, startAngle, safeEndAngle)
        mainCtx.strokeStyle = color.hex
        mainCtx.lineWidth = 1
        mainCtx.lineCap = 'round'
        mainCtx.stroke()
        mainCtx.restore()
      }
    }

    // 7. 绘制圆环起点的亮点
    mainCtx.save()
    mainCtx.shadowBlur = 4  // 10 * 0.4
    mainCtx.shadowColor = color.hex
    mainCtx.beginPath()
    const startX = centerX + Math.cos(startAngle) * radius
    const startY = centerY + Math.sin(startAngle) * radius
    mainCtx.arc(startX, startY, 2, 0, Math.PI * 2)  // 5 * 0.4 = 2
    mainCtx.fillStyle = color.hex
    mainCtx.fill()
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
  timeLeft.value = MAX_TIME
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
  timeLeft.value = MAX_TIME
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
  animation: fadeIn 0.3s ease-out;
}

.countdown-container {
  position: relative;
  width: 80px;
  height: 80px;
}

/* 画布层叠 */
.background-canvas,
.glow-canvas,
.main-canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.background-canvas {
  z-index: 1;
}

.glow-canvas {
  z-index: 2;
}

.main-canvas {
  z-index: 3;
}

/* 数字显示 */
.countdown-number {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  font-weight: 600;
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  z-index: 10;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
  user-select: none;
  line-height: 1;
}

/* 紧急状态时数字保持白色，只改变光晕 */
.countdown-number.urgent {
  color: white;
  text-shadow: 0 0 6px rgba(255, 255, 150, 0.4);
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

/* 淡入动画 */
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
</style>
