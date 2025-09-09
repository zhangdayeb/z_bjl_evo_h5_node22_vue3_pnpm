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
                  <svg class="road-svg" viewBox="0 0 14 6" xmlns="http://www.w3.org/2000/svg">
                    <!-- 珠盘路数据 - 使用测试数据渲染 -->
                    <g class="road-data">
                      <template v-for="(column, colIndex) in beadColumns" :key="`col-${colIndex}`">
                        <template v-for="(item, rowIndex) in column" :key="`item-${colIndex}-${rowIndex}`">
                          <!-- 主圆圈 -->
                          <circle
                            :cx="colIndex + 0.5"
                            :cy="rowIndex + 0.5"
                            r="0.48"
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
                            font-size="0.6"
                            font-weight="bold"
                          >
                            {{ getResultText(item.result) }}
                          </text>

                          <!-- 闲对标记（左上角蓝点）ext=2 或 ext=3 -->
                          <circle
                            v-if="item.ext === 2 || item.ext === 3"
                            :cx="colIndex + 0.25"
                            :cy="rowIndex + 0.25"
                            r="0.08"
                            fill="#2E83FF"
                          />

                          <!-- 庄对标记（右下角红点）ext=1 或 ext=3 -->
                          <circle
                            v-if="item.ext === 1 || item.ext === 3"
                            :cx="colIndex + 0.75"
                            :cy="rowIndex + 0.75"
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

      <!-- 底部统计栏 -->
      <div class="statistics-bar">
        <!-- 左侧：局数 -->
        <div class="left-section">
          <span class="game-round">
            <span class="hash">#</span>
            <span class="round-number">36</span>
          </span>
        </div>

        <!-- 中间：统计数据 -->
        <div class="center-section">
          <div class="stat-item">
            <div class="stat-circle player">
              <span>P</span>
            </div>
            <span class="stat-count">17</span>
          </div>

          <div class="stat-item">
            <div class="stat-circle banker">
              <span>B</span>
            </div>
            <span class="stat-count">17</span>
          </div>

          <div class="stat-item">
            <div class="stat-circle tie">
              <span>T</span>
            </div>
            <span class="stat-count">2</span>
          </div>
        </div>

        <!-- 右侧：问路预测 -->
        <div class="right-section">
          <div class="prediction-indicator player-predict">
            <span class="predict-label">P</span>
            <div class="predict-dots">
              <span class="dot filled-blue"></span>
              <span class="dot outline-blue"></span>
              <span class="dot filled-red"></span>
            </div>
          </div>

          <div class="prediction-indicator banker-predict">
            <span class="predict-label">B</span>
            <div class="predict-dots">
              <span class="dot filled-red"></span>
              <span class="dot outline-red"></span>
              <span class="dot filled-blue"></span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 测试数据
const res_org_obj = {
  "k0":{"result":1,"ext":0},"k1":{"result":1,"ext":1},"k2":{"result":1,"ext":2},"k3":{"result":1,"ext":3},"k4":{"result":2,"ext":0},"k5":{"result":1,"ext":0},
  "k6":{"result":1,"ext":0},"k7":{"result":1,"ext":0},"k8":{"result":1,"ext":0},"k9":{"result":2,"ext":0},"k10":{"result":2,"ext":0},"k11":{"result":2,"ext":1},
  "k12":{"result":1,"ext":1},"k13":{"result":2,"ext":0},"k14":{"result":2,"ext":0},"k15":{"result":2,"ext":0},"k16":{"result":1,"ext":0},"k17":{"result":2,"ext":0},
  "k18":{"result":2,"ext":0},"k19":{"result":2,"ext":0},"k20":{"result":1,"ext":2},"k21":{"result":3,"ext":0},"k22":{"result":3,"ext":1},"k23":{"result":3,"ext":0},
  "k24":{"result":2,"ext":0},"k25":{"result":1,"ext":1},"k26":{"result":1,"ext":0},"k27":{"result":1,"ext":0},"k28":{"result":1,"ext":0},"k29":{"result":1,"ext":0},
  "k30":{"result":1,"ext":3},"k31":{"result":2,"ext":0},"k32":{"result":1,"ext":2},"k33":{"result":1,"ext":0},"k34":{"result":3,"ext":0},"k35":{"result":2,"ext":2},
  "k36":{"result":2,"ext":0},"k37":{"result":1,"ext":0},"k38":{"result":1,"ext":0},"k39":{"result":1,"ext":0},"k40":{"result":1,"ext":0},"k41":{"result":1,"ext":0},
  "k42":{"result":3,"ext":0},"k43":{"result":1,"ext":0},"k44":{"result":2,"ext":0},"k45":{"result":2,"ext":3},"k46":{"result":2,"ext":0},"k47":{"result":1,"ext":0},
  "k48":{"result":1,"ext":0},"k49":{"result":1,"ext":0}
}

// 将数据转换为珠盘路列数组
const beadColumns = computed(() => {
  const columns: any[][] = []
  let currentColumn: any[] = []

  // 按顺序处理 k0, k1, k2...
  for (let i = 0; i < 50; i++) {
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

/* ================== 滑动容器 - 中等点阵背景 ================== */
.scrollable-container {
  width: 200%;
  height: 100%;
  display: flex;
  cursor: grab;
  will-change: transform;
  user-select: none;
  /* 中等点阵背景 - 给大路用 */
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.1) 1.3px,
    transparent 1.3px
  );
  background-size: 25px 25px;
  background-position: center;
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

/* 左屏布局 */
.left-screen {
  display: flex;
  flex-direction: column;
}

/* 右屏布局 */
.right-screen {
  display: flex;
  align-items: center;
  justify-content: center;
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

/* 珠盘路 - 大点背景覆盖 */
.bead-road-overlay {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 大点背景 */
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

/* 珠盘路 */
.bead-road-section {
  width: 100%;
  height: 100%;
  padding: 20px;
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
  bottom: 40px !important;
  width: 100% !important;
  height: calc(100% - 40px) !important;
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
  bottom: 40px;
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

/* ================== 统计栏 ================== */
.statistics-bar {
  height: 40px;
  min-height: 40px;
  background: #1a1a1a;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
  z-index: 1001;
}

/* 左侧：局数 */
.left-section {
  display: flex;
  align-items: center;
}

.game-round {
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 500;
}

.game-round .hash {
  opacity: 0.7;
}

.game-round .round-number {
  color: white;
  font-weight: 600;
}

/* 中间：统计 */
.center-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 13px;
}

.stat-circle.player {
  background: #2E83FF;
}

.stat-circle.banker {
  background: #EC2024;
}

.stat-circle.tie {
  background: #159252;
}

.stat-count {
  color: white;
  font-size: 16px;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

/* 右侧：问路预测 */
.right-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prediction-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 14px;
  height: 28px;
}

.player-predict {
  background: rgba(46, 131, 255, 0.15);
  border: 1px solid rgba(46, 131, 255, 0.3);
}

.banker-predict {
  background: rgba(236, 32, 36, 0.15);
  border: 1px solid rgba(236, 32, 36, 0.3);
}

.predict-label {
  color: white;
  font-weight: 700;
  font-size: 12px;
}

.predict-dots {
  display: flex;
  gap: 3px;
  align-items: center;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 1px solid transparent;
}

.dot.filled-blue {
  background: #2E83FF;
  border-color: #2E83FF;
}

.dot.filled-red {
  background: #EC2024;
  border-color: #EC2024;
}

.dot.outline-blue {
  background: transparent;
  border-color: #2E83FF;
}

.dot.outline-red {
  background: transparent;
  border-color: #EC2024;
}

/* ================== 响应式设计 ================== */
@media (max-width: 768px) {
  .scrollable-container {
    background-size: 22px 22px;
  }

  .three-roads-overlay {
    background-size: 13px 13px;
  }

  .bead-road-overlay {
    background-size: 27px 27px;
  }

  .statistics-bar {
    height: 36px;
    min-height: 36px;
    padding: 0 12px;
  }

  .stat-circle {
    width: 22px;
    height: 22px;
    font-size: 12px;
  }

  .stat-count {
    font-size: 15px;
  }

  .center-section {
    gap: 16px;
  }

  .prediction-indicator {
    height: 26px;
    padding: 3px 8px;
  }

  .dot {
    width: 8px;
    height: 8px;
  }
}

@media (max-width: 480px) {
  .scrollable-container {
    background-size: 20px 20px;
  }

  .three-roads-overlay {
    background-size: 12px 12px;
  }

  .bead-road-overlay {
    background-size: 24px 24px;
  }

  .statistics-bar {
    height: 34px;
    min-height: 34px;
    padding: 0 8px;
  }

  .game-round {
    font-size: 13px;
  }

  .stat-circle {
    width: 20px;
    height: 20px;
    font-size: 11px;
  }

  .stat-count {
    font-size: 14px;
  }

  .center-section {
    gap: 12px;
  }

  .right-section {
    gap: 6px;
  }

  .prediction-indicator {
    height: 24px;
    padding: 2px 6px;
    gap: 4px;
  }

  .predict-label {
    font-size: 11px;
  }

  .dot {
    width: 7px;
    height: 7px;
  }
}
</style>
