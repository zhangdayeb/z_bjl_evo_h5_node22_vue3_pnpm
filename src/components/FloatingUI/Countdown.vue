<!-- src/components/FloatingUI/Countdown.vue -->
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
/**
 * @fileoverview 霓虹灯倒计时组件
 * @description
 * 显示投注倒计时的圆环进度条组件，具有霓虹灯光晕效果
 * - 从 gameStore 实时获取倒计时数据
 * - 根据游戏状态自动显示/隐藏
 * - 最后3秒显示黄色警告动画
 *
 * @version 2.0.0
 * @author Claude
 * @date 2024
 */

import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// ========================= Store 引用 =========================
const gameStore = useGameStore()

// ========================= 配置常量 =========================
/**
 * 最大倒计时秒数
 * @constant {number}
 * @description 用于计算圆环进度，当实际倒计时超过此值时显示100%
 */
const MAX_COUNTDOWN = 30

/**
 * 画布大小
 * @constant {number}
 * @description Canvas 画布的宽高尺寸（像素）
 */
const CANVAS_SIZE = 80

// ========================= DOM 引用 =========================
const backgroundCanvas = ref<HTMLCanvasElement>()
const glowCanvas = ref<HTMLCanvasElement>()
const mainCanvas = ref<HTMLCanvasElement>()

// ========================= 内部状态 =========================
/**
 * 动画帧ID
 * @type {number | null}
 * @description 用于管理 requestAnimationFrame
 */
let animationFrame: number | null = null

// ========================= Canvas 配置 =========================
const canvasSize = CANVAS_SIZE
const centerX = CANVAS_SIZE / 2
const centerY = CANVAS_SIZE / 2
const radius = 32  // 圆环半径

// ========================= 计算属性 =========================
/**
 * 显示的倒计时数字
 * @computed
 * @returns {string} 当前倒计时秒数
 */
const displayTime = computed(() => {
  return gameStore.countdown.toString()
})

/**
 * 组件显示状态
 * @computed
 * @returns {boolean} 是否显示倒计时
 * @description 仅在投注状态时显示
 */
const showCountdown = computed(() => {
  return gameStore.gameStatus === 'betting'
})

/**
 * 紧急状态判断
 * @computed
 * @returns {boolean} 是否处于紧急状态
 * @description 最后3秒触发紧急状态，显示黄色警告
 */
const isUrgent = computed(() => {
  return gameStore.countdown <= 3 && gameStore.countdown > 0
})

/**
 * 圆环进度
 * @computed
 * @returns {number} 进度值 (0-1)
 * @description 根据当前倒计时计算圆环进度百分比
 */
const progress = computed(() => {
  // 使用 Math.min 确保进度不超过 100%
  return Math.min(gameStore.countdown / MAX_COUNTDOWN, 1)
})

// ========================= 辅助方法 =========================
/**
 * 获取当前状态的颜色配置
 * @returns {Object} 颜色配置对象
 * @property {number} r - 红色分量
 * @property {number} g - 绿色分量
 * @property {number} b - 蓝色分量
 * @property {string} hex - 十六进制颜色值
 * @property {string} dark - 深色版本
 */
const getColors = () => {
  if (isUrgent.value) {
    // 紧急状态：黄色
    return {
      r: 186,
      g: 173,
      b: 21,
      hex: '#baad15',
      dark: '#998f11'
    }
  }
  // 正常状态：绿色
  return {
    r: 0,
    g: 255,
    b: 136,
    hex: '#00ff88',
    dark: '#00dd77'
  }
}

// ========================= 绘制方法 =========================
/**
 * 绘制倒计时圆环
 * @description
 * 在三层 Canvas 上绘制倒计时效果：
 * - 背景层：黑色半透明背景和轨道
 * - 发光层：模糊光晕效果
 * - 主层：圆环进度和装饰
 */
const drawCountdown = () => {
  // 检查 Canvas 元素是否存在
  if (!backgroundCanvas.value || !glowCanvas.value || !mainCanvas.value) return

  // 获取绘图上下文
  const bgCtx = backgroundCanvas.value.getContext('2d')
  const glowCtx = glowCanvas.value.getContext('2d')
  const mainCtx = mainCanvas.value.getContext('2d')

  if (!bgCtx || !glowCtx || !mainCtx) return

  // 获取当前颜色配置
  const color = getColors()

  // 清空所有画布
  bgCtx.clearRect(0, 0, canvasSize, canvasSize)
  glowCtx.clearRect(0, 0, canvasSize, canvasSize)
  mainCtx.clearRect(0, 0, canvasSize, canvasSize)

  // =================== 1. 背景层绘制 ===================
  // 绘制黑色半透明背景圆
  bgCtx.beginPath()
  bgCtx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  bgCtx.fillStyle = 'rgba(0, 0, 0, 0.3)'
  bgCtx.fill()

  // 绘制圆环轨道
  bgCtx.beginPath()
  bgCtx.arc(centerX, centerY, radius, 0, Math.PI * 2)
  bgCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  bgCtx.lineWidth = 8
  bgCtx.stroke()

  // =================== 2. 计算圆环角度 ===================
  const startAngle = -Math.PI / 2  // 从顶部开始
  const totalAngle = Math.PI * 2 * progress.value
  const endAngle = startAngle + totalAngle

  // =================== 3. 发光层绘制 ===================
  if (progress.value > 0) {
    // 外层光晕
    glowCtx.save()
    glowCtx.filter = 'blur(6px)'
    glowCtx.beginPath()
    glowCtx.arc(centerX, centerY, radius, startAngle, endAngle)
    glowCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.2)`
    glowCtx.lineWidth = 12
    glowCtx.lineCap = 'round'
    glowCtx.stroke()
    glowCtx.restore()

    // 中层光晕
    glowCtx.save()
    glowCtx.filter = 'blur(3px)'
    glowCtx.beginPath()
    glowCtx.arc(centerX, centerY, radius, startAngle, endAngle)
    glowCtx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 0.25)`
    glowCtx.lineWidth = 10
    glowCtx.lineCap = 'round'
    glowCtx.stroke()
    glowCtx.restore()
  }

  // =================== 4. 主层圆环绘制 ===================
  if (progress.value > 0) {
    // 深色底层
    mainCtx.save()
    mainCtx.beginPath()
    mainCtx.arc(centerX, centerY, radius, startAngle, endAngle)
    mainCtx.strokeStyle = color.dark
    mainCtx.lineWidth = 8
    mainCtx.lineCap = 'round'
    mainCtx.stroke()
    mainCtx.restore()

    // 外边缘亮线
    mainCtx.save()
    mainCtx.beginPath()
    mainCtx.arc(centerX, centerY, radius + 3.5, startAngle, endAngle)
    mainCtx.strokeStyle = color.hex
    mainCtx.lineWidth = 1
    mainCtx.lineCap = 'round'
    mainCtx.stroke()
    mainCtx.restore()

    // 内边缘亮线
    mainCtx.save()
    mainCtx.beginPath()
    mainCtx.arc(centerX, centerY, radius - 3.5, startAngle, endAngle)
    mainCtx.strokeStyle = color.hex
    mainCtx.lineWidth = 1
    mainCtx.lineCap = 'round'
    mainCtx.stroke()
    mainCtx.restore()

    // =================== 5. 尾部渐变效果 ===================
    if (progress.value > 0.1) {
      // 计算尾部位置
      const tailX = centerX + Math.cos(endAngle) * radius
      const tailY = centerY + Math.sin(endAngle) * radius

      // 创建临时画布
      const maskCanvas = document.createElement('canvas')
      maskCanvas.width = canvasSize
      maskCanvas.height = canvasSize
      const maskCtx = maskCanvas.getContext('2d')

      if (maskCtx) {
        // 复制主画布内容
        maskCtx.drawImage(mainCanvas.value, 0, 0)

        // 清空主画布
        mainCtx.clearRect(0, 0, canvasSize, canvasSize)

        // 重新绘制并应用渐变遮罩
        mainCtx.save()
        mainCtx.drawImage(maskCanvas, 0, 0)

        // 设置擦除模式
        mainCtx.globalCompositeOperation = 'destination-out'

        // 创建径向渐变
        const radialGradient = mainCtx.createRadialGradient(
          tailX, tailY, 0,
          tailX, tailY, 10
        )

        radialGradient.addColorStop(0, 'rgba(0, 0, 0, 1)')
        radialGradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.95)')
        radialGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.5)')
        radialGradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.1)')
        radialGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        // 应用渐变遮罩
        mainCtx.fillStyle = radialGradient
        mainCtx.fillRect(tailX - 10, tailY - 10, 20, 20)
        mainCtx.restore()

        // 重新绘制不受遮罩影响的部分（前80%）
        const safeEndAngle = startAngle + totalAngle * 0.8

        // 深色底层
        mainCtx.save()
        mainCtx.beginPath()
        mainCtx.arc(centerX, centerY, radius, startAngle, safeEndAngle)
        mainCtx.strokeStyle = color.dark
        mainCtx.lineWidth = 8
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

    // =================== 6. 起点装饰 ===================
    // 绘制起点亮点
    mainCtx.save()
    mainCtx.shadowBlur = 6
    mainCtx.shadowColor = color.hex
    mainCtx.beginPath()
    const startX = centerX + Math.cos(startAngle) * radius
    const startY = centerY + Math.sin(startAngle) * radius
    mainCtx.arc(startX, startY, 3, 0, Math.PI * 2)
    mainCtx.fillStyle = color.hex
    mainCtx.fill()
    mainCtx.restore()
  }
}

// ========================= 动画控制 =========================
/**
 * 动画循环
 * @description 使用 requestAnimationFrame 持续更新画布
 */
const animate = () => {
  drawCountdown()
  if (showCountdown.value) {
    animationFrame = requestAnimationFrame(animate)
  }
}

/**
 * 启动动画
 * @description 开始绘制动画循环
 */
const startAnimation = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  animate()
}

/**
 * 停止动画
 * @description 取消动画循环
 */
const stopAnimation = () => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
    animationFrame = null
  }
}

// ========================= 响应式监听 =========================
/**
 * 监听倒计时变化
 * @description 当倒计时更新时触发重绘
 */
watch(() => gameStore.countdown, () => {
  if (!animationFrame && showCountdown.value) {
    drawCountdown()
  }
})

/**
 * 监听显示状态变化
 * @description 控制动画的启动和停止
 */
watch(showCountdown, (isShowing) => {
  console.log('⏱️ 倒计时显示状态:', isShowing)

  if (isShowing) {
    startAnimation()
  } else {
    stopAnimation()
  }
})

/**
 * 监听紧急状态变化
 * @description 确保紧急状态动画流畅运行
 */
watch(isUrgent, () => {
  if (showCountdown.value && !animationFrame) {
    startAnimation()
  }
})

// ========================= 生命周期 =========================
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
</script>

<style scoped>
/* ========================= 容器样式 ========================= */
/**
 * 倒计时包装器
 */
.countdown-wrapper {
  position: relative;
  display: inline-block;
  animation: fadeIn 0.3s ease-out;
}

/**
 * 倒计时容器
 * @description 固定尺寸的正方形容器
 */
.countdown-container {
  position: relative;
  width: 80px;
  height: 80px;
}

/* ========================= Canvas 层级 ========================= */
/**
 * Canvas 通用样式
 */
.background-canvas,
.glow-canvas,
.main-canvas {
  position: absolute;
  top: 0;
  left: 0;
}

/**
 * 背景层
 * @description 最底层，绘制背景和轨道
 */
.background-canvas {
  z-index: 1;
}

/**
 * 发光层
 * @description 中间层，绘制光晕效果
 */
.glow-canvas {
  z-index: 2;
}

/**
 * 主画布层
 * @description 最上层，绘制圆环主体
 */
.main-canvas {
  z-index: 3;
}

/* ========================= 数字显示 ========================= */
/**
 * 倒计时数字
 * @description 显示在圆环中心的倒计时数字
 */
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

/**
 * 紧急状态样式
 * @description 最后3秒的警告动画
 */
.countdown-number.urgent {
  color: white;
  text-shadow: 0 0 8px rgba(186, 173, 21, 0.6);
  animation: pulse 1s ease-out infinite;
}

/* ========================= 动画定义 ========================= */
/**
 * 脉动动画
 * @description 紧急状态下的数字缩放动画
 */
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

/**
 * 淡入动画
 * @description 组件显示时的进入动画
 */
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
