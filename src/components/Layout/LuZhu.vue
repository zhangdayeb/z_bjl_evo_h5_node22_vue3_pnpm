<!-- 露珠组件 - 自包含版本 -->
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
                <div class="road-container">
                  <!-- 大路数据 - 使用绝对定位 -->
                  <div
                    v-for="item in roadmapData.bigRoad"
                    :key="item.id"
                    class="road-item"
                    :style="{
                      left: item.left + 'px',
                      top: item.top + 'px',
                      width: '25px',
                      height: '25px'
                    }"
                  >
                    <svg viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12.5" cy="12.5" r="11" :fill="item.color" opacity="0.95" />
                      <text x="12.5" y="12.5" text-anchor="middle" dominant-baseline="middle"
                            fill="white" font-size="14" font-weight="bold">
                        {{ item.value }}
                      </text>
                      <!-- 和局标记 -->
                      <line v-if="item.tie" x1="5" y1="5" x2="20" y2="20"
                            stroke="#159252" stroke-width="2" />
                    </svg>
                  </div>
                </div>
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
                    <div class="road-container">
                      <div
                        v-for="item in roadmapData.bigEyeRoad"
                        :key="item.id"
                        class="road-item small"
                        :style="{
                          left: item.left + 'px',
                          top: item.top + 'px'
                        }"
                      >
                        <svg viewBox="0 0 12 12">
                          <circle cx="6" cy="6" r="5" fill="none"
                                  :stroke="item.color" stroke-width="1.5" opacity="0.9" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <!-- 小路 -->
                  <div
                    class="road-section small-road-section"
                    :class="{ 'fullscreen': fullscreenMode === 'small-road' }"
                    @click="toggleFullscreen('small-road')"
                  >
                    <div class="road-container">
                      <div
                        v-for="item in roadmapData.smallRoad"
                        :key="item.id"
                        class="road-item small"
                        :style="{
                          left: item.left + 'px',
                          top: item.top + 'px'
                        }"
                      >
                        <svg viewBox="0 0 12 12">
                          <circle cx="6" cy="6" r="5" :fill="item.color" opacity="0.9" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <!-- 蟑螂路 -->
                  <div
                    class="road-section roach-road-section"
                    :class="{ 'fullscreen': fullscreenMode === 'roach-road' }"
                    @click="toggleFullscreen('roach-road')"
                  >
                    <div class="road-container">
                      <div
                        v-for="item in roadmapData.cockroachRoad"
                        :key="item.id"
                        class="road-item small"
                        :style="{
                          left: item.left + 'px',
                          top: item.top + 'px'
                        }"
                      >
                        <svg viewBox="0 0 12 12">
                          <line x1="2" y1="2" x2="10" y2="10"
                                :stroke="item.color" stroke-width="2" opacity="0.9" />
                        </svg>
                      </div>
                    </div>
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
                  <div class="road-container">
                    <!-- 珠盘路数据 - 使用绝对定位 -->
                    <div
                      v-for="item in roadmapData.beadPlate"
                      :key="item.id"
                      class="bead-item"
                      :style="{
                        left: item.left + 'px',
                        top: item.top + 'px'
                      }"
                    >
                      <svg viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                        <!-- 主圆圈 -->
                        <circle cx="15" cy="15" r="14.5" :fill="item.color" opacity="0.95" />
                        <!-- 字母 -->
                        <text x="15" y="15" text-anchor="middle" dominant-baseline="middle"
                              fill="white" font-size="18" font-weight="bold">
                          {{ item.value }}
                        </text>

                        <!-- 闲对标记（左上角蓝点）ext=2 或 ext=3 -->
                        <circle v-if="item.ext === 2 || item.ext === 3"
                                cx="6" cy="6" r="2.5" fill="#2E83FF" />

                        <!-- 庄对标记（右下角红点）ext=1 或 ext=3 -->
                        <circle v-if="item.ext === 1 || item.ext === 3"
                                cx="24" cy="24" r="2.5" fill="#EC2024" />
                      </svg>
                    </div>
                  </div>
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
            <span class="round-number">{{ statistics.total }}</span>
          </span>
        </div>

        <!-- 中间：统计数据 -->
        <div class="center-section">
          <!-- 闲家统计 -->
          <div class="stat-item">
            <svg class="stat-svg" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9.5" fill="#2E83FF" />
              <text x="10" y="10" text-anchor="middle" dominant-baseline="middle"
                    fill="white" font-size="12" font-weight="bold">P</text>
            </svg>
            <span class="stat-count">{{ statistics.player }}</span>
          </div>

          <!-- 庄家统计 -->
          <div class="stat-item">
            <svg class="stat-svg" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9.5" fill="#EC2024" />
              <text x="10" y="10" text-anchor="middle" dominant-baseline="middle"
                    fill="white" font-size="12" font-weight="bold">B</text>
            </svg>
            <span class="stat-count">{{ statistics.banker }}</span>
          </div>

          <!-- 和局统计 -->
          <div class="stat-item">
            <svg class="stat-svg" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10" cy="10" r="9.5" fill="#159252" />
              <text x="10" y="10" text-anchor="middle" dominant-baseline="middle"
                    fill="white" font-size="12" font-weight="bold">T</text>
            </svg>
            <span class="stat-count">{{ statistics.tie }}</span>
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
                <circle cx="5" cy="5" r="4" fill="none"
                        :stroke="getPredictionColor('player', 'bigEye')" stroke-width="1.2" />
              </svg>
              <!-- 小路 -->
              <svg class="predict-svg" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="4"
                        :fill="getPredictionColor('player', 'small')" />
              </svg>
              <!-- 蟑螂路 -->
              <svg class="predict-svg" viewBox="0 0 10 10">
                <line x1="2" y1="2" x2="8" y2="8"
                      :stroke="getPredictionColor('player', 'cockroach')" stroke-width="1.5" />
              </svg>
            </div>
          </div>

          <!-- 庄家预测 -->
          <div class="prediction-indicator banker-predict">
            <span class="predict-label">B</span>
            <div class="predict-icons">
              <!-- 大眼路 -->
              <svg class="predict-svg" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="4" fill="none"
                        :stroke="getPredictionColor('banker', 'bigEye')" stroke-width="1.2" />
              </svg>
              <!-- 小路 -->
              <svg class="predict-svg" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="4"
                        :fill="getPredictionColor('banker', 'small')" />
              </svg>
              <!-- 蟑螂路 -->
              <svg class="predict-svg" viewBox="0 0 10 10">
                <line x1="2" y1="2" x2="8" y2="8"
                      :stroke="getPredictionColor('banker', 'cockroach')" stroke-width="1.5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import roadmapCalculator, {
  type GameResult,
  type RoadmapData,
  type Statistics,
  type Prediction
} from '@/utils/roadmapCalculator'

// 内部模拟数据 - 使用您提供的测试数据
const mockGameData: Record<string, GameResult> = {
  "k0":{"result":1,"ext":0},"k1":{"result":1,"ext":1},"k2":{"result":1,"ext":2},
  "k3":{"result":1,"ext":3},"k4":{"result":2,"ext":0},"k5":{"result":1,"ext":0},
  "k6":{"result":1,"ext":0},"k7":{"result":1,"ext":0},"k8":{"result":1,"ext":0},
  "k9":{"result":2,"ext":0},"k10":{"result":2,"ext":0},"k11":{"result":2,"ext":1},
  "k12":{"result":1,"ext":1},"k13":{"result":2,"ext":0},"k14":{"result":2,"ext":0},
  "k15":{"result":2,"ext":0},"k16":{"result":1,"ext":0},"k17":{"result":2,"ext":0},
  "k18":{"result":2,"ext":0},"k19":{"result":2,"ext":0},"k20":{"result":1,"ext":2},
  "k21":{"result":3,"ext":0},"k22":{"result":3,"ext":1},"k23":{"result":3,"ext":0},
  "k24":{"result":2,"ext":0},"k25":{"result":1,"ext":1},"k26":{"result":1,"ext":0},
  "k27":{"result":1,"ext":0},"k28":{"result":1,"ext":0},"k29":{"result":1,"ext":0},
  "k30":{"result":1,"ext":3},"k31":{"result":2,"ext":0},"k32":{"result":1,"ext":2},
  "k33":{"result":1,"ext":0},"k34":{"result":3,"ext":0},"k35":{"result":2,"ext":2},
  "k36":{"result":2,"ext":0},"k37":{"result":1,"ext":0},"k38":{"result":1,"ext":0},
  "k39":{"result":1,"ext":0},"k40":{"result":1,"ext":0},"k41":{"result":1,"ext":0},
  "k42":{"result":3,"ext":0},"k43":{"result":1,"ext":0},"k44":{"result":2,"ext":0},
  "k45":{"result":2,"ext":3},"k46":{"result":2,"ext":0},"k47":{"result":1,"ext":0},
  "k48":{"result":1,"ext":0},"k49":{"result":1,"ext":0}
}

// 组件内部状态
const currentGameData = ref<Record<string, GameResult>>(mockGameData)
const roadmapData = ref<RoadmapData>({
  beadPlate: [],
  bigRoad: [],
  bigEyeRoad: [],
  smallRoad: [],
  cockroachRoad: []
})
const statistics = ref<Statistics>({
  total: 0,
  banker: 0,
  player: 0,
  tie: 0,
  bankerPair: 0,
  playerPair: 0
})
const predictions = ref<Prediction | null>(null)

// 全屏模式
const fullscreenMode = ref<string | null>(null)

// 滑动相关
const scrollContainer = ref<HTMLElement>()
const isDragging = ref(false)
const startX = ref(0)
const currentTranslateX = ref(0)
const viewportWidth = ref(0)
const startTranslateX = ref(0)

// 计算路单数据
const calculateRoadmaps = () => {
  roadmapData.value = roadmapCalculator.calculateAll(currentGameData.value)
  statistics.value = roadmapCalculator.calculateStatistics(currentGameData.value)
  predictions.value = roadmapCalculator.calculatePredictions(currentGameData.value)

  console.log('路单数据:', roadmapData.value)
  console.log('统计数据:', statistics.value)
  console.log('预测数据:', predictions.value)
}

// 获取预测颜色
const getPredictionColor = (type: 'banker' | 'player', road: 'bigEye' | 'small' | 'cockroach') => {
  if (!predictions.value) return '#666'
  const color = predictions.value[type][road]
  return color === 'red' ? '#EC2024' : '#2E83FF'
}

// 添加新结果（带动画）- 用于模拟新数据
const addNewResult = (result: GameResult) => {
  const newKey = `k${Object.keys(currentGameData.value).length}`
  currentGameData.value[newKey] = result

  // 重新计算
  const newData = roadmapCalculator.calculateAll(currentGameData.value)

  // 标记新添加的项目
  const markAsNew = (items: any[]) => {
    if (items.length > 0) {
      items[items.length - 1].isNew = true
      setTimeout(() => {
        items[items.length - 1].isNew = false
      }, 500)
    }
  }

  markAsNew(newData.beadPlate)
  markAsNew(newData.bigRoad)
  markAsNew(newData.bigEyeRoad)
  markAsNew(newData.smallRoad)
  markAsNew(newData.cockroachRoad)

  roadmapData.value = newData
  statistics.value = roadmapCalculator.calculateStatistics(currentGameData.value)
  predictions.value = roadmapCalculator.calculatePredictions(currentGameData.value)
}

// 更新游戏数据（用于后续接口集成）
const updateGameData = (newData: Record<string, GameResult>) => {
  currentGameData.value = newData
  calculateRoadmaps()
}

// 初始化
onMounted(() => {
  calculateRoadmaps()
  updateViewportWidth()
  window.addEventListener('resize', updateViewportWidth)
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

// 触摸事件处理
const handleTouchStart = (e: TouchEvent) => {
  isDragging.value = true
  startX.value = e.touches[0].clientX
  startTranslateX.value = currentTranslateX.value
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  e.preventDefault()

  const deltaX = e.touches[0].clientX - startX.value
  const translateX = startTranslateX.value + deltaX
  currentTranslateX.value = clampTranslateX(translateX)
}

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

// 鼠标事件处理
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

// 暴露方法给父组件（如果需要）
defineExpose({
  addNewResult,
  updateGameData,
  calculateRoadmaps
})
</script>

<style scoped>
/* ================== CSS变量 ================== */
:root {
  --root-size: 20px;
  --stat-height: calc(var(--root-size) * 1.4);
}

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
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.1) 1.3px,
    transparent 1.3px
  );
  background-size: 25px 25px;
  background-position: center;
}

/* 右屏布局 */
.right-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

/* ================== 背景覆盖层 ================== */
.three-roads-overlay {
  flex: 1;
  position: relative;
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.08) 1px,
    transparent 1px
  );
  background-size: 15px 15px;
  background-position: center;
}

.bead-road-overlay {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  padding: 8px;
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

/* ================== 路单容器（绝对定位） ================== */
.road-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 路单项目 */
.road-item {
  position: absolute;
  transition: all 0.3s ease;
}

.road-item.small {
  width: 12px;
  height: 12px;
}

/* 珠盘路项目 */
.bead-item {
  position: absolute;
  width: 30px;
  height: 30px;
  transition: all 0.3s ease;
}

.bead-item.new {
  animation: flyIn 0.5s ease-out;
}

@keyframes flyIn {
  from {
    transform: translateY(-100px) scale(0);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

/* SVG样式 */
.road-item svg,
.bead-item svg {
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
  bottom: var(--stat-height) !important;
  width: 100% !important;
  height: calc(100% - var(--stat-height)) !important;
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
  bottom: var(--stat-height);
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
  height: var(--stat-height);
  min-height: var(--stat-height);
  background: rgb(37, 37, 37);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 calc(var(--root-size) * 0.8) calc(var(--root-size) * 0.25);
  flex-shrink: 0;
  z-index: 1001;
  font-weight: 600;
}

/* 左侧：局数 */
.left-section {
  display: flex;
  align-items: center;
  width: 46%;
}

.game-round {
  display: flex;
  align-items: center;
  gap: calc(var(--root-size) * 0.2);
  color: rgba(255, 255, 255, 0.65);
  font-size: calc(var(--root-size) * 0.6);
  font-weight: 500;
}

.game-round .hash {
  opacity: 0.6;
  font-size: calc(var(--root-size) * 0.55);
}

.game-round .round-number {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: calc(var(--root-size) * 0.65);
}

/* 中间：统计 */
.center-section {
  display: flex;
  align-items: center;
  gap: calc(var(--root-size) * 0.6);
  height: 100%;
  width: 46%;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: calc(var(--root-size) * 0.2);
  height: 100%;
}

.stat-svg {
  width: calc(var(--root-size) * 1);
  height: calc(var(--root-size) * 1);
  display: block;
  flex-shrink: 0;
}

.stat-count {
  color: rgba(255, 255, 255, 0.95);
  font-size: calc(var(--root-size) * 0.65);
  font-weight: 600;
  min-width: calc(var(--root-size) * 1);
  text-align: center;
  line-height: 1;
}

/* 右侧：问路预测 */
.right-section {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: calc(var(--root-size) * 0.3);
  width: 46%;
}

.prediction-indicator {
  display: flex;
  align-items: center;
  gap: calc(var(--root-size) * 0.2);
  padding: calc(var(--root-size) * 0.15) calc(var(--root-size) * 0.4);
  border-radius: calc(var(--root-size) * 0.6);
  height: calc(var(--root-size) * 1.2);
  min-width: calc(var(--root-size) * 3);
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
  font-size: calc(var(--root-size) * 0.55);
  margin-right: calc(var(--root-size) * 0.1);
}

.predict-icons {
  display: flex;
  gap: calc(var(--root-size) * 0.1);
  align-items: center;
}

.predict-svg {
  width: calc(var(--root-size) * 0.5);
  height: calc(var(--root-size) * 0.5);
  display: block;
}

/* ================== 响应式设计 ================== */
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

  .game-round .hash {
    display: none;
  }
}

@media (max-width: 360px) {
  :root {
    --root-size: 14px;
  }

  .statistics-bar {
    padding: 0 calc(var(--root-size) * 0.4);
  }

  .center-section {
    gap: calc(var(--root-size) * 0.4);
  }
}
</style>
