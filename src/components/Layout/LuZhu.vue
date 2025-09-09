<!-- 露珠组件 - 完整重构版 -->
<template>
  <div class="luzhu-component">
    <!-- 主容器 -->
    <div class="luzhu-wrapper">

      <!-- 路珠显示区域 -->
      <div class="luzhu-display-area">
        <!-- 视口容器 -->
        <div class="viewport-container">
          <!-- 滑动容器（200%宽度） -->
          <div
            class="scrollable-container"
            ref="scrollContainer"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            @mousedown="handleMouseDown"
            @mousemove="handleMouseMove"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
            :style="{
              transform: `translateX(${currentTranslateX}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }"
          >
            <!-- 左屏：大路 + 下三路 -->
            <div class="screen left-screen">
              <!-- 大路区域 -->
              <div
                class="road-section big-road-section"
                :class="{ 'fullscreen': fullscreenMode === 'big-road' }"
                @click="toggleFullscreen('big-road')"
              >
                <svg class="road-svg" viewBox="0 0 21 6" xmlns="http://www.w3.org/2000/svg">
                  <!-- 大路数据 -->
                  <g class="road-data">
                    <!-- 示例数据 -->
                    <circle cx="0.5" cy="0.5" r="0.43" fill="#EC2024" opacity="0.95" />
                    <text x="0.5" y="0.5" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.55" font-weight="bold">B</text>

                    <circle cx="0.5" cy="1.5" r="0.43" fill="#EC2024" opacity="0.95" />
                    <text x="0.5" y="1.5" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.55" font-weight="bold">B</text>

                    <circle cx="0.5" cy="2.5" r="0.43" fill="#EC2024" opacity="0.95" />
                    <text x="0.5" y="2.5" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.55" font-weight="bold">B</text>

                    <circle cx="1.5" cy="0.5" r="0.43" fill="#2E83FF" opacity="0.95" />
                    <text x="1.5" y="0.5" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.55" font-weight="bold">P</text>

                    <circle cx="1.5" cy="1.5" r="0.43" fill="#2E83FF" opacity="0.95" />
                    <text x="1.5" y="1.5" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.55" font-weight="bold">P</text>

                    <circle cx="2.5" cy="0.5" r="0.43" fill="#EC2024" opacity="0.95" />
                    <text x="2.5" y="0.5" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.55" font-weight="bold">B</text>

                    <g transform="translate(2.5, 1.5)">
                      <circle cx="0" cy="0" r="0.43" fill="#EC2024" opacity="0.95" />
                      <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.55" font-weight="bold">B</text>
                      <line x1="-0.35" y1="-0.35" x2="0.35" y2="0.35" stroke="#159252" stroke-width="0.12" />
                    </g>

                    <circle cx="3.5" cy="0.5" r="0.43" fill="#2E83FF" opacity="0.95" />
                    <text x="3.5" y="0.5" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.55" font-weight="bold">P</text>
                  </g>
                </svg>
              </div>

              <!-- 下三路容器 -->
              <div class="three-roads-overlay">
                <div class="three-roads-container">
                  <!-- 大眼路 -->
                  <div
                    class="road-section eye-road-section"
                    :class="{ 'fullscreen': fullscreenMode === 'eye-road' }"
                    @click="toggleFullscreen('eye-road')"
                  >
                    <svg class="road-svg" viewBox="0 0 14 3" xmlns="http://www.w3.org/2000/svg">
                      <g class="road-data">
                        <circle cx="0.5" cy="0.5" r="0.38" fill="none" stroke="#EC2024" stroke-width="0.12" opacity="0.9" />
                        <circle cx="1.5" cy="0.5" r="0.38" fill="none" stroke="#2E83FF" stroke-width="0.12" opacity="0.9" />
                        <circle cx="1.5" cy="1.5" r="0.38" fill="none" stroke="#2E83FF" stroke-width="0.12" opacity="0.9" />
                        <circle cx="2.5" cy="0.5" r="0.38" fill="none" stroke="#EC2024" stroke-width="0.12" opacity="0.9" />
                      </g>
                    </svg>
                  </div>

                  <!-- 小路 -->
                  <div
                    class="road-section small-road-section"
                    :class="{ 'fullscreen': fullscreenMode === 'small-road' }"
                    @click="toggleFullscreen('small-road')"
                  >
                    <svg class="road-svg" viewBox="0 0 14 3" xmlns="http://www.w3.org/2000/svg">
                      <g class="road-data">
                        <circle cx="0.5" cy="0.5" r="0.35" fill="#EC2024" opacity="0.9" />
                        <circle cx="1.5" cy="0.5" r="0.35" fill="#2E83FF" opacity="0.9" />
                        <circle cx="1.5" cy="1.5" r="0.35" fill="#2E83FF" opacity="0.9" />
                        <circle cx="2.5" cy="0.5" r="0.35" fill="#EC2024" opacity="0.9" />
                      </g>
                    </svg>
                  </div>

                  <!-- 蟑螂路 -->
                  <div
                    class="road-section roach-road-section"
                    :class="{ 'fullscreen': fullscreenMode === 'roach-road' }"
                    @click="toggleFullscreen('roach-road')"
                  >
                    <svg class="road-svg" viewBox="0 0 14 3" xmlns="http://www.w3.org/2000/svg">
                      <g class="road-data">
                        <line x1="0.2" y1="0.2" x2="0.8" y2="0.8" stroke="#EC2024" stroke-width="0.15" opacity="0.9" />
                        <line x1="1.2" y1="0.2" x2="1.8" y2="0.8" stroke="#2E83FF" stroke-width="0.15" opacity="0.9" />
                        <line x1="1.2" y1="1.2" x2="1.8" y2="1.8" stroke="#2E83FF" stroke-width="0.15" opacity="0.9" />
                        <line x1="2.2" y1="0.2" x2="2.8" y2="0.8" stroke="#EC2024" stroke-width="0.15" opacity="0.9" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右屏：珠盘路 -->
            <div class="screen right-screen">
              <div class="bead-road-overlay">
                <div
                  class="road-section bead-road-section"
                  :class="{ 'fullscreen': fullscreenMode === 'bead-road' }"
                  @click="toggleFullscreen('bead-road')"
                >
                  <svg class="road-svg" viewBox="0 0 11 6" xmlns="http://www.w3.org/2000/svg">
                    <!-- 珠盘路数据 - 使用测试数据渲染 -->
                    <g class="road-data">
                      <template v-for="(column, colIndex) in beadColumns" :key="`col-${colIndex}`">
                        <template v-for="(item, rowIndex) in column" :key="`item-${colIndex}-${rowIndex}`">
                          <!-- 主圆圈 -->
                          <circle
                            :cx="colIndex + 0.5"
                            :cy="rowIndex + 0.5"
                            r="0.49"
                            :fill="getResultColor(item.result)"
                            opacity="0.95"
                          />
                          <!-- 字母 -->
                          <text
                            :x="colIndex + 0.5"
                            :y="rowIndex + 0.5"
                            text-anchor="middle"
                            dominant-baseline="middle"
                            fill="white"
                            font-size="0.65"
                            font-weight="bold"
                          >
                            {{ getResultText(item.result) }}
                          </text>

                          <!-- 闲对标记（左上角蓝点）ext=2 或 ext=3 -->
                          <circle
                            v-if="item.ext === 2 || item.ext === 3"
                            :cx="colIndex + 0.2"
                            :cy="rowIndex + 0.2"
                            r="0.08"
                            fill="#2E83FF"
                          />

                          <!-- 庄对标记（右下角红点）ext=1 或 ext=3 -->
                          <circle
                            v-if="item.ext === 1 || item.ext === 3"
                            :cx="colIndex + 0.8"
                            :cy="rowIndex + 0.8"
                            r="0.08"
                            fill="#EC2024"
                          />
                        </template>
                      </template>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 全屏模式遮罩 -->
        <div
          v-if="fullscreenMode"
          class="fullscreen-overlay"
          @click="exitFullscreen"
        >
          <div class="exit-hint">点击退出全屏</div>
        </div>
      </div>

      <!-- 底部统计栏 - 优化版 -->
      <div class="statistics-bar">
        <!-- 左侧：局数 -->
        <div class="left-section">
          <span class="game-round">
            <span class="hash">#</span>
            <span class="round-number">110</span>
          </span>
        </div>

        <!-- 中间：统计数据 -->
        <div class="center-section">
          <!-- 闲家统计 -->
          <div class="stat-item">
            <svg class="stat-svg" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9.5" fill="#2E83FF" />
              <text x="10" y="10" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="12" font-weight="bold">P</text>
            </svg>
            <span class="stat-count">40</span>
          </div>

          <!-- 庄家统计 -->
          <div class="stat-item">
            <svg class="stat-svg" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9.5" fill="#EC2024" />
              <text x="10" y="10" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="12" font-weight="bold">B</text>
            </svg>
            <span class="stat-count">59</span>
          </div>

          <!-- 和局统计 -->
          <div class="stat-item">
            <svg class="stat-svg" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9.5" fill="#159252" />
              <text x="10" y="10" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="12" font-weight="bold">T</text>
            </svg>
            <span class="stat-count">11</span>
          </div>
        </div>

        <!-- 右侧：问路预测 -->
        <div class="right-section">
          <!-- 闲家预测 -->
          <div class="prediction-indicator player-predict">
            <span class="predict-label">P</span>
            <div class="predict-icons">
              <!-- 大眼路 -->
              <svg class="predict-svg" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="4" fill="none" stroke="#EC2024" stroke-width="1.2" />
              </svg>
              <!-- 小路 -->
              <svg class="predict-svg" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="4" fill="#EC2024" />
              </svg>
              <!-- 蟑螂路 -->
              <svg class="predict-svg" viewBox="0 0 10 10">
                <line x1="2" y1="2" x2="8" y2="8" stroke="#EC2024" stroke-width="1.5" />
              </svg>
            </div>
          </div>

          <!-- 庄家预测 -->
          <div class="prediction-indicator banker-predict">
            <span class="predict-label">B</span>
            <div class="predict-icons">
              <!-- 大眼路 -->
              <svg class="predict-svg" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="4" fill="none" stroke="#2E83FF" stroke-width="1.2" />
              </svg>
              <!-- 小路 -->
              <svg class="predict-svg" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="4" fill="#2E83FF" />
              </svg>
              <!-- 蟑螂路 -->
              <svg class="predict-svg" viewBox="0 0 10 10">
                <line x1="2" y1="2" x2="8" y2="8" stroke="#2E83FF" stroke-width="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 扩展测试数据，生成更多数据以填满珠盘路
const generateTestData = () => {
  const data: any = {}
  // 生成66个数据点（11列 x 6行）
  for (let i = 0; i < 66; i++) {
    const key = `k${i}`
    // 随机生成结果：1(庄B), 2(闲P), 3(和T)
    const results = [1, 1, 1, 1, 2, 2, 2, 2, 3] // 让庄闲更常见
    const result = results[Math.floor(Math.random() * results.length)]

    // 随机生成对子：0(无), 1(庄对), 2(闲对), 3(双对)
    const extValues = [0, 0, 0, 0, 0, 0, 1, 2, 3] // 让无对子更常见
    const ext = extValues[Math.floor(Math.random() * extValues.length)]

    data[key] = { result, ext }
  }
  return data
}

// 使用生成的测试数据
const res_org_obj = generateTestData()

// 将数据转换为珠盘路列数组
const beadColumns = computed(() => {
  const columns: any[][] = []
  let currentColumn: any[] = []

  // 按顺序处理 k0, k1, k2...
  for (let i = 0; i < 66; i++) {
    const key = `k${i}`
    if (res_org_obj[key as keyof typeof res_org_obj]) {
      currentColumn.push(res_org_obj[key as keyof typeof res_org_obj])

      // 每6个为一列
      if (currentColumn.length === 6) {
        columns.push([...currentColumn])
        currentColumn = []
      }
    }
  }

  // 处理最后不满6个的列
  if (currentColumn.length > 0) {
    columns.push(currentColumn)
  }

  return columns
})

// 获取结果颜色
const getResultColor = (result: number) => {
  switch(result) {
    case 1: return '#EC2024' // 庄 - 红色
    case 2: return '#2E83FF' // 闲 - 蓝色
    case 3: return '#159252' // 和 - 绿色
    default: return '#666666'
  }
}

// 获取结果文字
const getResultText = (result: number) => {
  switch(result) {
    case 1: return 'B' // 庄
    case 2: return 'P' // 闲
    case 3: return 'T' // 和
    default: return ''
  }
}

// 全屏模式
const fullscreenMode = ref<string | null>(null)

// 滑动相关
const scrollContainer = ref<HTMLElement>()
const isDragging = ref(false)
const startX = ref(0)
const currentTranslateX = ref(0)
const viewportWidth = ref(0)
const startTranslateX = ref(0)

// 初始化视口宽度
onMounted(() => {
  updateViewportWidth()
  window.addEventListener('resize', updateViewportWidth)

  // 打印调试信息
  console.log('珠盘路数据列数:', beadColumns.value.length)
  console.log('珠盘路数据:', beadColumns.value)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateViewportWidth)
})

// 更新视口宽度
const updateViewportWidth = () => {
  if (scrollContainer.value) {
    viewportWidth.value = scrollContainer.value.parentElement?.offsetWidth || 0
  }
}

// 限制滑动范围
const clampTranslateX = (x: number) => {
  const maxScroll = -viewportWidth.value
  return Math.max(maxScroll, Math.min(0, x))
}

// 触摸开始
const handleTouchStart = (e: TouchEvent) => {
  isDragging.value = true
  startX.value = e.touches[0].clientX
  startTranslateX.value = currentTranslateX.value
}

// 触摸移动
const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  e.preventDefault()

  const deltaX = e.touches[0].clientX - startX.value
  const translateX = startTranslateX.value + deltaX
  currentTranslateX.value = clampTranslateX(translateX)
}

// 触摸结束
const handleTouchEnd = () => {
  if (!isDragging.value) return
  isDragging.value = false

  // 自动吸附
  const threshold = viewportWidth.value * 0.25
  if (Math.abs(currentTranslateX.value) > threshold) {
    currentTranslateX.value = -viewportWidth.value
  } else {
    currentTranslateX.value = 0
  }
}

// 鼠标事件
const handleMouseDown = (e: MouseEvent) => {
  isDragging.value = true
  startX.value = e.clientX
  startTranslateX.value = currentTranslateX.value
  e.preventDefault()
}

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return
  e.preventDefault()

  const deltaX = e.clientX - startX.value
  const translateX = startTranslateX.value + deltaX
  currentTranslateX.value = clampTranslateX(translateX)
}

const handleMouseUp = () => {
  if (!isDragging.value) return
  handleTouchEnd()
}

// 切换全屏
const toggleFullscreen = (roadType: string) => {
  if (fullscreenMode.value === roadType) {
    fullscreenMode.value = null
  } else {
    fullscreenMode.value = roadType
  }
}

// 退出全屏
const exitFullscreen = () => {
  fullscreenMode.value = null
}
</script>

<style scoped>
/* ================== 根容器 ================== */
.luzhu-component {
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  position: relative;
  overflow: hidden;
}

.luzhu-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ================== 路珠显示区域 ================== */
.luzhu-display-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  background: linear-gradient(rgba(37, 37, 37, 0.95) 0%, rgb(30, 30, 30) 100%);
  border: 1px solid rgb(85, 85, 85);
  border-bottom: none;
}

/* ================== 视口容器 ================== */
.viewport-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* ================== 滑动容器 ================== */
.scrollable-container {
  width: 200%;
  height: 100%;
  display: flex;
  cursor: grab;
  will-change: transform;
  user-select: none;
  /* 不给滑动容器设置背景 */
  background: transparent;
}

.scrollable-container:active {
  cursor: grabbing;
}

/* ================== 屏幕 ================== */
.screen {
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 0;
  box-sizing: border-box;
  position: relative;
}

/* 左屏布局 - 添加大路背景 */
.left-screen {
  display: flex;
  flex-direction: column;
  /* 只给左屏添加中等点阵背景 */
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.1) 1.3px,
    transparent 1.3px
  );
  background-size: 25px 25px;
  background-position: center;
}

/* 右屏布局 - 不设置背景 */
.right-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

/* ================== 背景覆盖层 ================== */

/* 下三路 - 小点背景覆盖 */
.three-roads-overlay {
  flex: 1;
  position: relative;
  /* 小点背景 */
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.08) 1px,
    transparent 1px
  );
  background-size: 15px 15px;
  background-position: center;
}

/* 珠盘路 - 大点背景覆盖（修复：单独设置背景） */
.bead-road-overlay {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 珠盘路专属大点背景 */
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.12) 1.5px,
    transparent 1.5px
  );
  background-size: 30px 30px;
  background-position: center;
}

/* ================== 路珠区域 ================== */
.road-section {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  transition: opacity 0.2s ease;
  position: relative;
}

.road-section:hover {
  opacity: 0.85;
}

/* 大路 */
.big-road-section {
  flex: 2;
  min-height: 0;
  padding: 8px;
}

/* 珠盘路 - 减小padding让数据贴边 */
.bead-road-section {
  width: 100%;
  height: 100%;
  padding: 8px; /* 从20px减小到8px */
  box-sizing: border-box;
}

/* 下三路容器 */
.three-roads-container {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 0;
  padding: 4px;
  box-sizing: border-box;
}

.eye-road-section,
.small-road-section,
.roach-road-section {
  flex: 1;
}

/* SVG样式 */
.road-svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* ================== 全屏模式 ================== */
.road-section.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 32px !important;
  width: 100% !important;
  height: calc(100% - 32px) !important;
  z-index: 1000;
  padding: 20px;
  background: linear-gradient(rgba(37, 37, 37, 0.98) 0%, rgb(30, 30, 30) 100%);
  animation: zoomIn 0.25s ease-out;
  box-sizing: border-box;
}

/* 全屏时根据类型显示不同背景 */
.big-road-section.fullscreen {
  background-image:
    linear-gradient(rgba(37, 37, 37, 0.98) 0%, rgb(30, 30, 30) 100%),
    radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 1.3px, transparent 1.3px);
  background-size: 100%, 25px 25px;
}

.bead-road-section.fullscreen {
  background-image:
    linear-gradient(rgba(37, 37, 37, 0.98) 0%, rgb(30, 30, 30) 100%),
    radial-gradient(circle at center, rgba(255, 255, 255, 0.12) 1.5px, transparent 1.5px);
  background-size: 100%, 30px 30px;
}

.eye-road-section.fullscreen,
.small-road-section.fullscreen,
.roach-road-section.fullscreen {
  background-image:
    linear-gradient(rgba(37, 37, 37, 0.98) 0%, rgb(30, 30, 30) 100%),
    radial-gradient(circle at center, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 100%, 15px 15px;
}

@keyframes zoomIn {
  from {
    transform: scale(0.92);
    opacity: 0.8;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 32px;
  z-index: 999;
  background: rgba(0, 0, 0, 0.2);
}

.exit-hint {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  pointer-events: none;
  animation: fadeInOut 2s ease-in-out;
}

@keyframes fadeInOut {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

/* ================== 统计栏 - 优化版 ================== */
.statistics-bar {
  height: 32px;
  min-height: 32px;
  background: rgb(37, 37, 37);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  flex-shrink: 0;
  z-index: 1001;
}

/* 左侧：局数 */
.left-section {
  display: flex;
  align-items: center;
  min-width: 50px;
}

.game-round {
  display: flex;
  align-items: center;
  gap: 3px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 13px;
  font-weight: 500;
}

.game-round .hash {
  opacity: 0.6;
  font-size: 12px;
}

.game-round .round-number {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 14px;
}

/* 中间：统计 - 使用SVG */
.center-section {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-svg {
  width: 20px;
  height: 20px;
  display: block;
}

.stat-count {
  color: rgba(255, 255, 255, 0.95);
  font-size: 14px;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

/* 右侧：问路预测 - 优化版 */
.right-section {
  display: flex;
  align-items: center;
  gap: 8px;
}

.prediction-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 12px;
  height: 24px;
}

.player-predict {
  background: rgba(46, 131, 255, 0.12);
  border: 1px solid rgba(46, 131, 255, 0.25);
}

.banker-predict {
  background: rgba(236, 32, 36, 0.12);
  border: 1px solid rgba(236, 32, 36, 0.25);
}

.predict-label {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  font-size: 11px;
  margin-right: 2px;
}

.predict-icons {
  display: flex;
  gap: 2px;
  align-items: center;
}

.predict-svg {
  width: 10px;
  height: 10px;
  display: block;
}

/* ================== 响应式设计 ================== */
:root {
  --root-size: 20px;
}

@media (max-width: 768px) {
  :root {
    --root-size: 18px;
  }

  .left-screen {
    background-size: 22px 22px;
  }

  .three-roads-overlay {
    background-size: 13px 13px;
  }

  .bead-road-overlay {
    background-size: 27px 27px;
  }

  .statistics-bar {
    --stat-height: calc(var(--root-size) * 1.5);
  }

  .left-section,
  .center-section,
  .right-section {
    width: auto;
  }

  .center-section {
    flex: 1;
  }
}

@media (max-width: 480px) {
  :root {
    --root-size: 16px;
  }

  .left-screen {
    background-size: 20px 20px;
  }

  .three-roads-overlay {
    background-size: 12px 12px;
  }

  .bead-road-overlay {
    background-size: 24px 24px;
  }

  .statistics-bar {
    --stat-height: calc(var(--root-size) * 1.6);
    padding: 0 calc(var(--root-size) * 0.5);
  }

  .game-round .hash {
    display: none;
  }

  .prediction-indicator {
    padding: calc(var(--root-size) * 0.1) calc(var(--root-size) * 0.25);
  }
}

/* 超小屏幕适配 */
@media (max-width: 360px) {
  :root {
    --root-size: 14px;
  }

  .statistics-bar {
    --stat-height: calc(var(--root-size) * 1.7);
    padding: 0 calc(var(--root-size) * 0.4);
  }

  .center-section {
    gap: calc(var(--root-size) * 0.4);
  }

  .prediction-indicator {
    min-width: calc(var(--root-size) * 2.5);
  }

  .predict-icons {
    gap: calc(var(--root-size) * 0.05);
  }
}
</style>
