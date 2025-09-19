<!-- src/components/FloatingUI/Countdown.vue - 霓虹灯效果倒计时（从gameStore获取数据版） -->
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// Store
const gameStore = useGameStore()

// 🔥 修改1：使用组件内常量配置最大倒计时（不用props）
const MAX_COUNTDOWN = 30  // 最大倒计时秒数，可根据需要调整

// 固定配置
const CANVAS_SIZE = 80  // 固定80px画布大小

// Refs
const backgroundCanvas = ref<HTMLCanvasElement>()
const glowCanvas = ref<HTMLCanvasElement>()
const mainCanvas = ref<HTMLCanvasElement>()

// 🔥 修改2：移除了内部的 timeLeft 和 isRunning，改为从 gameStore 获取
let animationFrame: number | null = null

// Canvas相关
const canvasSize = CANVAS_SIZE
const centerX = CANVAS_SIZE / 2
const centerY = CANVAS_SIZE / 2
const radius = 32  // 80 * 0.4 = 32

// 🔥 修改3：计算属性改为从 gameStore 获取数据
// 显示倒计时 - 从gameStore获取
const displayTime = computed(() => {
  return gameStore.countdown.toString()
})

// 🔥 修改4：根据gameStatus控制显示/隐藏
const showCountdown = computed(() => {
  return gameStore.gameStatus === 'betting'
})

// 🔥 修改5：紧急状态判断 - 使用gameStore的countdown
const isUrgent = computed(() => {
  return gameStore.countdown <= 3 && gameStore.countdown > 0  // 最后3秒紧急状态
})

// 🔥 修改6：进度计算 - 基于MAX_COUNTDOWN常量
const progress = computed(() => {
  // 使用 Math.min 确保进度不超过 100%
  return Math.min(gameStore.countdown / MAX_COUNTDOWN, 1)
})

// 获取颜色配置（保持不变）
const getColors = () => {
  if (isUrgent.value) {
    return {
      r: 186,
      g: 173,
      b: 21,
      hex: '#baad15',
      dark: '#998f11'  // 稍微深一点的黄色
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

// 绘制倒计时圆环（保持不变）
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

  // 2. 绘制极淡的背景圆环轨道（调整为8）
  bgCtx.beginPath()
  bgCtx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  bgCtx.lineWidth = 8  // 保持8的宽度
  bgCtx.stroke()

  // 3. 定义圆环的起始和结束角度
  const startAngle = -Math.PI / 2  // 顶部正中央
  const totalAngle = Math.PI * 2 * progress.value
  const endAngle = startAngle + totalAngle

  // 4. 绘制发光效果（加强光晕以配合更粗的圆环）
  if (progress.value > 0) {
    // 外层大光晕
    glowCtx.save()
    glowCtx.filter = 'blur(6px)'  // 稍微增加模糊度
    glowCtx.beginPath()
    glowCtx.arc(centerX, centerY, radius, startAngle, endAngle)
    glowCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`  // 稍微增加透明度
    glowCtx.lineWidth = 12  // 增加光晕宽度
    glowCtx.lineCap = 'round'
    glowCtx.stroke()
    glowCtx.restore()

    // 中层光晕
    glowCtx.save()
    glowCtx.filter = 'blur(3px)'  // 稍微增加模糊度
    glowCtx.beginPath()
    glowCtx.arc(centerX, centerY, radius, startAngle, endAngle)
    glowCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.25)`  // 稍微增加透明度
    glowCtx.lineWidth = 10  // 增加光晕宽度
    glowCtx.lineCap = 'round'
    glowCtx.stroke()
    glowCtx.restore()
  }

  // 5. 绘制双层圆环（深色底色 + 亮色边框）
  if (progress.value > 0) {
    // 5.1 先绘制深色底层（调整为8的宽度）
    mainCtx.save()
    mainCtx.beginPath()
    mainCtx.arc(centerX, centerY, radius, startAngle, endAngle)
    mainCtx.strokeStyle = color.dark  // 深色
    mainCtx.lineWidth = 8  // 调整为8
    mainCtx.lineCap = 'round'
    mainCtx.stroke()
    mainCtx.restore()

    // 5.2 绘制亮色边框（上下两条细线，调整位置以适应8的宽度）
    // 外边缘亮线
    mainCtx.save()
    mainCtx.beginPath()
    mainCtx.arc(centerX, centerY, radius + 3.5, startAngle, endAngle)  // 调整到外边缘
    mainCtx.strokeStyle = color.hex  // 亮色
    mainCtx.lineWidth = 1  // 保持细线
    mainCtx.lineCap = 'round'
    mainCtx.stroke()
    mainCtx.restore()

    // 内边缘亮线
    mainCtx.save()
    mainCtx.beginPath()
    mainCtx.arc(centerX, centerY, radius - 3.5, startAngle, endAngle)  // 调整到内边缘
    mainCtx.strokeStyle = color.hex  // 亮色
    mainCtx.lineWidth = 1  // 保持细线
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
          tailX, tailY, 10      // 增加外圆半径以适应更粗的圆环
        )

        // 设置渐变（更陡峭的过渡）
        radialGradient.addColorStop(0, 'rgba(0, 0, 0, 1)')    // 中心：完全擦除
        radialGradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.95)') // 快速渐变
        radialGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.5)') // 中间过渡
        radialGradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.1)') // 接近边缘
        radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')    // 边缘：不擦除

        // 应用径向渐变遮罩
        mainCtx.fillStyle = radialGradient
        mainCtx.fillRect(tailX - 10, tailY - 10, 20, 20)  // 增加遮罩区域

        mainCtx.restore()

        // 重新绘制圆环（避免被遮罩影响的部分）
        // 绘制前80%的部分（不受遮罩影响）
        const safeEndAngle = startAngle + totalAngle * 0.8

        // 深色底层
        mainCtx.save()
        mainCtx.beginPath()
        mainCtx.arc(centerX, centerY, radius, startAngle, safeEndAngle)
        mainCtx.strokeStyle = color.dark
        mainCtx.lineWidth = 8  // 保持8的宽度
        mainCtx.lineCap = 'round'
        mainCtx.stroke()
        mainCtx.restore()

        // 外边缘亮线
        mainCtx.save()
        mainCtx.beginPath()
        mainCtx.arc(centerX, centerY, radius + 3.5, startAngle, safeEndAngle)
        mainCtx.strokeStyle = color.hex
        mainCtx.lineWidth = 1
        mainCtx.lineCap = 'round'
        mainCtx.stroke()
        mainCtx.restore()

        // 内边缘亮线
        mainCtx.save()
        mainCtx.beginPath()
        mainCtx.arc(centerX, centerY, radius - 3.5, startAngle, safeEndAngle)
        mainCtx.strokeStyle = color.hex
        mainCtx.lineWidth = 1
        mainCtx.lineCap = 'round'
        mainCtx.stroke()
        mainCtx.restore()
      }
    }

    // 7. 绘制圆环起点的亮点（稍微增大以配合更粗的圆环）
    mainCtx.save()
    mainCtx.shadowBlur = 6  // 增加光晕
    mainCtx.shadowColor = color.hex
    mainCtx.beginPath()
    const startX = centerX + Math.cos(startAngle) * radius
    const startY = centerY + Math.sin(startAngle) * radius
    mainCtx.arc(startX, startY, 3, 0, Math.PI * 2)  // 稍微增大亮点
    mainCtx.fillStyle = color.hex
    mainCtx.fill()
    mainCtx.restore()
  }
}

// 🔥 修改7：简化动画循环
const animate = () => {
  drawCountdown()
  // 只要组件显示就继续动画
  if (showCountdown.value) {
    animationFrame = requestAnimationFrame(animate)
  }
}

// 🔥 修改8：启动动画（简化版，不需要管理倒计时）
const startAnimation = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  animate()
}

// 🔥 修改9：停止动画
const stopAnimation = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}

// 🔥 修改10：监听countdown变化，触发重绘
watch(() => gameStore.countdown, () => {
  // 当倒计时变化时重绘
  if (!animationFrame && showCountdown.value) {
    drawCountdown()
  }
})

// 🔥 修改11：监听游戏状态变化，控制动画
watch(showCountdown, (isShowing) => {
  console.log('⏱️ 倒计时显示状态:', isShowing)

  if (isShowing) {
    startAnimation()
  } else {
    stopAnimation()
  }
})

// 🔥 修改12：监听紧急状态变化（保持脉动效果流畅）
watch(isUrgent, () => {
  // 紧急状态变化时确保动画运行
  if (showCountdown.value && !animationFrame) {
    startAnimation()
  }
})

// 生命周期
onMounted(() => {
  console.log('⏱️ 霓虹倒计时组件已挂载')

  // 初始绘制
  drawCountdown()

  // 如果当前是投注状态，启动动画
  if (showCountdown.value) {
    startAnimation()
  }
})

onUnmounted(() => {
  stopAnimation()
})

// 🔥 修改13：移除 defineExpose，不暴露任何方法
// defineExpose 已删除
</script>

<style scoped>
/* 样式部分完全保持不变 */
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
  font-size: 36px;
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
  text-shadow: 0 0 8px rgba(186, 173, 21, 0.6);
  animation: pulse 1s ease-out infinite;
}

/* 脉动动画 - 每秒跳动一次 */
@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1.5);
  }
  60% {
    transform: translate(-50%, -50%) scale(0.95);
  }
  80% {
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
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
