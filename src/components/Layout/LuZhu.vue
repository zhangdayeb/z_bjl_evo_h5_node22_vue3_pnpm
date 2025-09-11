<!-- LuZhu.vue - 主露珠组件 -->
<template>
  <div class="luzhu-component">
    <div class="luzhu-wrapper">
      <!-- 路珠显示区域 -->
      <div class="luzhu-display-area">
        <div class="viewport-container">
          <!-- 滑动容器 -->
          <div
            class="scrollable-container"
            ref="scrollContainer"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            :style="{
              transform: `translateX(${currentTranslateX}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s'
            }"
          >
            <!-- 左屏：大路 + 下三路 -->
            <div class="screen left-screen">
              <!-- 大路区域 -->
              <div class="road-section big-road-section">
                <div class="road-container">
                  <div
                    v-for="item in roadmapData.bigRoad"
                    :key="item.id"
                    class="road-item"
                    :style="{
                      left: item.left + 'px',
                      top: item.top + 'px'
                    }"
                  >
                    <svg viewBox="0 0 25 25">
                      <!-- 主圆环 -->
                      <circle
                        cx="12.5"
                        cy="12.5"
                        r="10"
                        fill="none"
                        :stroke="item.color"
                        stroke-width="2"
                      />

                      <!-- 庄对标记 -->
                      <circle
                        v-if="item.ext === 1 || item.ext === 3"
                        cx="19.5"
                        cy="19.5"
                        r="2.25"
                        fill="#dc3545"
                        stroke="#1a1a1a"
                        stroke-width="1.5"
                      />

                      <!-- 闲对标记 -->
                      <circle
                        v-if="item.ext === 2 || item.ext === 3"
                        cx="5.5"
                        cy="5.5"
                        r="2.25"
                        fill="#007bff"
                        stroke="#1a1a1a"
                        stroke-width="1.5"
                      />

                      <!-- 和局数字 -->
                      <text
                        v-if="item.tie"
                        x="12.5"
                        y="12.5"
                        text-anchor="middle"
                        dominant-baseline="middle"
                        fill="#ffc107"
                        font-size="10"
                        font-weight="bold"
                      >
                        {{ item.tie }}
                      </text>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- 下三路容器 -->
              <div class="three-roads-container">
                <!-- 大眼路 -->
                <div class="road-section small-road">
                  <div class="road-container">
                    <div
                      v-for="item in roadmapData.bigEyeRoad"
                      :key="item.id"
                      class="road-item-small"
                      :style="{
                        left: item.left + 'px',
                        top: item.top + 'px'
                      }"
                    >
                      <svg viewBox="0 0 12 12">
                        <circle cx="6" cy="6" r="5" fill="none"
                                :stroke="item.color" stroke-width="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- 小路 -->
                <div class="road-section small-road">
                  <div class="road-container">
                    <div
                      v-for="item in roadmapData.smallRoad"
                      :key="item.id"
                      class="road-item-small"
                      :style="{
                        left: item.left + 'px',
                        top: item.top + 'px'
                      }"
                    >
                      <svg viewBox="0 0 12 12">
                        <circle cx="6" cy="6" r="5" :fill="item.color" />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- 蟑螂路 -->
                <div class="road-section small-road">
                  <div class="road-container">
                    <div
                      v-for="item in roadmapData.cockroachRoad"
                      :key="item.id"
                      class="road-item-small"
                      :style="{
                        left: item.left + 'px',
                        top: item.top + 'px'
                      }"
                    >
                      <svg viewBox="0 0 12 12">
                        <line x1="2" y1="2" x2="10" y2="10"
                              :stroke="item.color" stroke-width="2" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 右屏：珠盘路 -->
            <div class="screen right-screen">
              <div class="road-section bead-road-section">
                <div class="road-container">
                  <div
                    v-for="item in roadmapData.beadPlate"
                    :key="item.id"
                    class="bead-item"
                    :style="{
                      left: item.left + 'px',
                      top: item.top + 'px'
                    }"
                  >
                    <svg viewBox="0 0 30 30">
                      <circle cx="15" cy="15" r="14.5" :fill="item.color" />
                      <text x="15" y="15" text-anchor="middle" dominant-baseline="middle"
                            fill="white" font-size="18" font-weight="bold">
                        {{ item.value }}
                      </text>

                      <!-- 闲对标记 -->
                      <circle v-if="item.ext === 2 || item.ext === 3"
                              cx="6" cy="6" r="2.5" fill="#2E83FF" />

                      <!-- 庄对标记 -->
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

      <!-- 统计栏组件 -->
      <LuZhuCount :game-data="gameData" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LuZhuCount from './LuZhuCount.vue'
import roadmapCalculator, {
  type GameResult,
  type RoadmapData
} from '@/utils/roadmapCalculator'

// 数据状态
const gameData = ref<Record<string, GameResult>>({})
const roadmapData = ref<RoadmapData>({
  beadPlate: [],
  bigRoad: [],
  bigEyeRoad: [],
  smallRoad: [],
  cockroachRoad: []
})

// 滑动控制
const scrollContainer = ref<HTMLElement>()
const isDragging = ref(false)
const startX = ref(0)
const currentTranslateX = ref(0)

// 初始化数据
const initData = () => {
  gameData.value = roadmapCalculator.getMockData()
  roadmapData.value = roadmapCalculator.calculateAll(gameData.value)
}

// 添加新结果
const addResult = (result: GameResult) => {
  gameData.value = roadmapCalculator.addResult(gameData.value, result)
  roadmapData.value = roadmapCalculator.calculateAll(gameData.value)
}

// 触摸事件处理
const handleTouchStart = (e: TouchEvent) => {
  isDragging.value = true
  startX.value = e.touches[0].clientX - currentTranslateX.value
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  e.preventDefault()

  const x = e.touches[0].clientX - startX.value
  const maxScroll = -scrollContainer.value!.offsetWidth / 2
  currentTranslateX.value = Math.max(maxScroll, Math.min(0, x))
}

const handleTouchEnd = () => {
  isDragging.value = false
  // 自动吸附
  const threshold = scrollContainer.value!.offsetWidth / 4
  if (Math.abs(currentTranslateX.value) > threshold) {
    currentTranslateX.value = -scrollContainer.value!.offsetWidth / 2
  } else {
    currentTranslateX.value = 0
  }
}

// 生命周期
onMounted(() => {
  initData()
})

// 暴露方法
defineExpose({
  addResult
})
</script>

<style scoped>
.luzhu-component {
  width: 100%;
  height: 233px;
  background: #1a1a1a;
  overflow: hidden;
}

.luzhu-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* 显示区域 */
.luzhu-display-area {
  height: 200px;
  background: linear-gradient(rgba(37, 37, 37, 0.95), rgb(30, 30, 30));
  border: 1px solid rgb(85, 85, 85);
  border-bottom: none;
  overflow: hidden;
}

.viewport-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.scrollable-container {
  width: 200%;
  height: 100%;
  display: flex;
  cursor: grab;
  user-select: none;
}

.scrollable-container:active {
  cursor: grabbing;
}

/* 屏幕布局 */
.screen {
  width: 50%;
  height: 100%;
  position: relative;
}

.left-screen {
  display: flex;
  flex-direction: column;
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.1) 1.3px,
    transparent 1.3px
  );
  background-size: 25px 25px;
}

.right-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.12) 1.5px,
    transparent 1.5px
  );
  background-size: 30px 30px;
}

/* 路单区域 */
.road-section {
  position: relative;
  padding: 8px;
}

.big-road-section {
  flex: 2;
}

.bead-road-section {
  width: 100%;
  height: 100%;
}

.three-roads-container {
  flex: 1;
  display: flex;
  gap: 0;
  padding: 4px;
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.08) 1px,
    transparent 1px
  );
  background-size: 15px 15px;
}

.small-road {
  flex: 1;
}

.road-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 路单项目 */
.road-item {
  position: absolute;
  width: 25px;
  height: 25px;
}

.road-item-small {
  position: absolute;
  width: 12px;
  height: 12px;
}

.bead-item {
  position: absolute;
  width: 30px;
  height: 30px;
}

.road-item svg,
.road-item-small svg,
.bead-item svg {
  width: 100%;
  height: 100%;
}

/* 响应式 */
@media (max-width: 768px) {
  .left-screen {
    background-size: 22px 22px;
  }

  .right-screen {
    background-size: 27px 27px;
  }

  .three-roads-container {
    background-size: 13px 13px;
  }
}
</style>
