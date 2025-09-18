<!-- LuZhu.vue - 主露珠组件 -->
<template>
  <div class="luzhu-component">
    <div class="luzhu-wrapper">
      <!-- 路珠显示区域 -->
      <div class="luzhu-display-area">
        <div class="viewport-container">
          <!-- 正常显示容器 -->
          <div
            class="scrollable-container"
            ref="scrollContainer"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            :style="{
              transform: `translateX(${currentTranslateX}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s',
              display: fullscreenMode !== 'none' ? 'none' : 'flex'
            }"
          >
            <!-- 左屏：大路 + 下三路 -->
            <div class="screen left-screen">
              <!-- 大路区域 -->
              <div class="road-section big-road-section" @click="toggleFullscreen('bigRoad')">
                <div class="road-viewport">
                  <div class="road-container" ref="bigRoadContainer" :style="{ transform: `translateX(${bigRoadOffset}px)` }">
                    <div
                      v-for="(item, index) in roadmapData.bigRoad"
                      :key="`big-${index}`"
                      class="road-item"
                      :style="{
                        left: item.left + 'px',
                        top: item.top + 'px'
                      }"
                    >
                      <svg viewBox="0 0 20 20">
                        <!-- 主圆环 -->
                        <circle
                          cx="10"
                          cy="10"
                          r="7"
                          fill="none"
                          :stroke="item.result === 1 ? '#EC2024' : '#2E83FF'"
                          stroke-width="3"
                        />

                        <!-- 庄对标记 -->
                        <circle
                          v-if="item.ext === 1 || item.ext === 3"
                          cx="15.5"
                          cy="15.5"
                          r="4"
                          fill="#dc3545"
                          stroke="#1a1a1a"
                          stroke-width="2"
                        />

                        <!-- 闲对标记 -->
                        <circle
                          v-if="item.ext === 2 || item.ext === 3"
                          cx="4.5"
                          cy="4.5"
                          r="4"
                          fill="#007bff"
                          stroke="#1a1a1a"
                          stroke-width="2"
                        />

                        <!-- 和局数字 -->
                        <text
                          v-if="item.tieCount"
                          x="10"
                          y="10"
                          text-anchor="middle"
                          dominant-baseline="middle"
                          fill="#ffc107"
                          font-size="12"
                          font-weight="bold"
                        >
                          {{ item.tieCount }}
                        </text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 下三路容器 -->
              <div class="three-roads-container">
                <!-- 大眼路 -->
                <div class="road-section small-road" @click.stop="toggleFullscreen('bigEyeRoad')">
                  <div class="road-viewport-small">
                    <div class="road-container small-road-container" ref="bigEyeRoadContainer" :style="{ transform: `translateX(${bigEyeRoadOffset}px)` }">
                      <div
                        v-for="(item, index) in roadmapData.bigEyeRoad"
                        :key="`eye-${index}`"
                        class="road-item-small"
                        :style="{
                          left: item.left + 'px',
                          top: item.top + 'px'
                        }"
                      >
                        <svg viewBox="0 0 10 10">
                          <circle cx="5" cy="5" r="4" fill="none"
                                  :stroke="item.result === 1 ? '#EC2024' : '#2E83FF'"
                                  stroke-width="1.2" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 小路 -->
                <div class="road-section small-road" @click.stop="toggleFullscreen('smallRoad')">
                  <div class="road-viewport-small">
                    <div class="road-container small-road-container" ref="smallRoadContainer" :style="{ transform: `translateX(${smallRoadOffset}px)` }">
                      <div
                        v-for="(item, index) in roadmapData.smallRoad"
                        :key="`small-${index}`"
                        class="road-item-small"
                        :style="{
                          left: item.left + 'px',
                          top: item.top + 'px'
                        }"
                      >
                        <svg viewBox="0 0 10 10">
                          <circle cx="5" cy="5" r="4"
                                  :fill="item.result === 1 ? '#EC2024' : '#2E83FF'" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 蟑螂路 -->
                <div class="road-section small-road" @click.stop="toggleFullscreen('cockroachRoad')">
                  <div class="road-viewport-small">
                    <div class="road-container small-road-container" ref="cockroachRoadContainer" :style="{ transform: `translateX(${cockroachRoadOffset}px)` }">
                      <div
                        v-for="(item, index) in roadmapData.cockroachRoad"
                        :key="`roach-${index}`"
                        class="road-item-small"
                        :style="{
                          left: item.left + 'px',
                          top: item.top + 'px'
                        }"
                      >
                        <svg viewBox="0 0 10 10">
                          <line x1="1.5" y1="8.5" x2="8.5" y2="1.5"
                                :stroke="item.result === 1 ? '#EC2024' : '#2E83FF'"
                                stroke-width="1.5" />
                        </svg>
                      </div>
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
                    v-for="(item, index) in roadmapData.beadPlate"
                    :key="`bead-${index}`"
                    class="bead-item"
                    :style="{
                      left: item.left + 'px',
                      top: item.top + 'px'
                    }"
                  >
                    <svg viewBox="0 0 30 30">
                      <circle cx="15" cy="15" r="12"
                              :fill="getBeadColor(item)" />
                      <text x="15" y="16" text-anchor="middle" dominant-baseline="middle"
                            fill="white" font-size="16" font-weight="bold">
                        {{ getBeadText(item) }}
                      </text>

                      <!-- 闲对标记 -->
                      <circle v-if="item.ext === 2 || item.ext === 3"
                              cx="6" cy="6" r="5" fill="#2E83FF" stroke="#1a1a1a" stroke-width="2" />

                      <!-- 庄对标记 -->
                      <circle v-if="item.ext === 1 || item.ext === 3"
                              cx="24" cy="24" r="5" fill="#EC2024" stroke="#1a1a1a" stroke-width="2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 展开显示容器（占满显示区域） -->
          <div v-if="fullscreenMode !== 'none'" class="expanded-container" @click="toggleFullscreen('none')">
            <!-- 大路展开 -->
            <div v-if="fullscreenMode === 'bigRoad'" class="expanded-road">
              <div class="road-container expanded-road-container">
                <div
                  v-for="(item, index) in roadmapData.bigRoad"
                  :key="`big-exp-${index}`"
                  class="road-item-expanded"
                  :style="{
                    left: (item.left * 1.5) + 'px',
                    top: (item.top * 1.5) + 'px'
                  }"
                >
                  <svg viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="8" fill="none"
                            :stroke="item.result === 1 ? '#EC2024' : '#2E83FF'"
                            stroke-width="1.5" />
                    <circle v-if="item.ext === 1 || item.ext === 3"
                            cx="15.5" cy="15.5" r="2" fill="#dc3545"
                            stroke="#1a1a1a" stroke-width="1" />
                    <circle v-if="item.ext === 2 || item.ext === 3"
                            cx="4.5" cy="4.5" r="2" fill="#007bff"
                            stroke="#1a1a1a" stroke-width="1" />
                    <text v-if="item.tieCount" x="10" y="10"
                          text-anchor="middle" dominant-baseline="middle"
                          fill="#ffc107" font-size="8" font-weight="bold">
                      {{ item.tieCount }}
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            <!-- 大眼路展开 -->
            <div v-if="fullscreenMode === 'bigEyeRoad'" class="expanded-road">
              <div class="road-container expanded-road-container-small">
                <div
                  v-for="(item, index) in roadmapData.bigEyeRoad"
                  :key="`eye-exp-${index}`"
                  class="road-item-expanded-small"
                  :style="{
                    left: (item.left * 2) + 'px',
                    top: (item.top * 2) + 'px'
                  }"
                >
                  <svg viewBox="0 0 10 10">
                    <circle cx="5" cy="5" r="4" fill="none"
                            :stroke="item.result === 1 ? '#EC2024' : '#2E83FF'"
                            stroke-width="1.2" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- 小路展开 -->
            <div v-if="fullscreenMode === 'smallRoad'" class="expanded-road">
              <div class="road-container expanded-road-container-small">
                <div
                  v-for="(item, index) in roadmapData.smallRoad"
                  :key="`small-exp-${index}`"
                  class="road-item-expanded-small"
                  :style="{
                    left: (item.left * 2) + 'px',
                    top: (item.top * 2) + 'px'
                  }"
                >
                  <svg viewBox="0 0 10 10">
                    <circle cx="5" cy="5" r="4"
                            :fill="item.result === 1 ? '#EC2024' : '#2E83FF'" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- 蟑螂路展开 -->
            <div v-if="fullscreenMode === 'cockroachRoad'" class="expanded-road">
              <div class="road-container expanded-road-container-small">
                <div
                  v-for="(item, index) in roadmapData.cockroachRoad"
                  :key="`roach-exp-${index}`"
                  class="road-item-expanded-small"
                  :style="{
                    left: (item.left * 2) + 'px',
                    top: (item.top * 2) + 'px'
                  }"
                >
                  <svg viewBox="0 0 10 10">
                    <line x1="1.5" y1="8.5" x2="8.5" y2="1.5"
                          :stroke="item.result === 1 ? '#EC2024' : '#2E83FF'"
                          stroke-width="1.5" />
                  </svg>
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
import { ref, onMounted, nextTick, watch } from 'vue'
import LuZhuCount from './LuZhuCount.vue'
import roadmapCalculator, {
  type GameResult,
  type RoadmapData,
  type BeadPlatePosition
} from '@/utils/roadmapCalculator'

// 数据状态
const gameData = ref<Record<string, GameResult>>({})
const roadmapData = ref<RoadmapData>({
  beadPlate: [],
  bigRoad: [],
  bigEyeRoad: [],
  smallRoad: [],
  cockroachRoad: [],
  sanxing: []
})

// 全屏模式
type FullscreenMode = 'none' | 'bigRoad' | 'bigEyeRoad' | 'smallRoad' | 'cockroachRoad'
const fullscreenMode = ref<FullscreenMode>('none')

// 路单偏移量
const bigRoadOffset = ref(0)
const bigEyeRoadOffset = ref(0)
const smallRoadOffset = ref(0)
const cockroachRoadOffset = ref(0)

// 路单容器引用
const bigRoadContainer = ref<HTMLElement>()
const bigEyeRoadContainer = ref<HTMLElement>()
const smallRoadContainer = ref<HTMLElement>()
const cockroachRoadContainer = ref<HTMLElement>()

// 滑动控制
const scrollContainer = ref<HTMLElement>()
const isDragging = ref(false)
const startX = ref(0)
const currentTranslateX = ref(0)

// 获取珠盘颜色
const getBeadColor = (item: BeadPlatePosition): string => {
  if (item.result === 1) return '#EC2024' // 庄-红色
  if (item.result === 2) return '#2E83FF' // 闲-蓝色
  if (item.result === 3) return '#159252' // 和-绿色
  return '#666666'
}

// 获取珠盘文字
const getBeadText = (item: BeadPlatePosition): string => {
  // 根据原始结果显示不同文字
  switch(item.result_original) {
    case 1: return 'B' // 庄
    case 2: return 'P' // 闲
    case 3: return 'T' // 和
    case 4: return '6' // 幸运6
    case 6: return 'S' // 小老虎
    case 7: return '7' // 龙7
    case 8: return '8' // 熊8
    case 9: return 'L' // 大老虎
    default: return ''
  }
}

// 切换全屏模式
const toggleFullscreen = (mode: FullscreenMode) => {
  fullscreenMode.value = fullscreenMode.value === mode ? 'none' : mode
}

// 计算路单偏移量
const calculateOffsets = () => {
  nextTick(() => {
    // 大路偏移
    if (roadmapData.value.bigRoad.length > 0) {
      const lastItem = roadmapData.value.bigRoad[roadmapData.value.bigRoad.length - 1]
      const maxX = lastItem.left + 22
      const viewportWidth = window.innerWidth / 2 // 左屏宽度
      if (maxX > viewportWidth) {
        bigRoadOffset.value = -(maxX - viewportWidth + 10)
      } else {
        bigRoadOffset.value = 0
      }
    }

    // 大眼路偏移
    if (roadmapData.value.bigEyeRoad.length > 0) {
      const lastItem = roadmapData.value.bigEyeRoad[roadmapData.value.bigEyeRoad.length - 1]
      const maxX = lastItem.left + 11
      const viewportWidth = window.innerWidth / 6 // 下三路每个占1/3
      if (maxX > viewportWidth) {
        bigEyeRoadOffset.value = -(maxX - viewportWidth + 5)
      } else {
        bigEyeRoadOffset.value = 0
      }
    }

    // 小路偏移
    if (roadmapData.value.smallRoad.length > 0) {
      const lastItem = roadmapData.value.smallRoad[roadmapData.value.smallRoad.length - 1]
      const maxX = lastItem.left + 11
      const viewportWidth = window.innerWidth / 6
      if (maxX > viewportWidth) {
        smallRoadOffset.value = -(maxX - viewportWidth + 5)
      } else {
        smallRoadOffset.value = 0
      }
    }

    // 蟑螂路偏移
    if (roadmapData.value.cockroachRoad.length > 0) {
      const lastItem = roadmapData.value.cockroachRoad[roadmapData.value.cockroachRoad.length - 1]
      const maxX = lastItem.left + 11
      const viewportWidth = window.innerWidth / 6
      if (maxX > viewportWidth) {
        cockroachRoadOffset.value = -(maxX - viewportWidth + 5)
      } else {
        cockroachRoadOffset.value = 0
      }
    }
  })
}

// 监听数据变化，自动计算偏移
watch(roadmapData, () => {
  calculateOffsets()
}, { deep: true })

// 初始化数据（使用模拟数据）
const initData = () => {
  // 使用模拟数据
  const mockData: Record<string, GameResult> = {
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

  gameData.value = mockData

  // 开启调试模式（可选）
  roadmapCalculator.setDebug(false)

  // 计算路单
  roadmapData.value = roadmapCalculator.calculateAll(gameData.value)

  // 计算偏移量
  calculateOffsets()
}

// 添加新结果
const addResult = (result: GameResult) => {
  const newKey = `k${Object.keys(gameData.value).length}`
  gameData.value = {
    ...gameData.value,
    [newKey]: result
  }
  roadmapData.value = roadmapCalculator.calculateAll(gameData.value)
  calculateOffsets()
}

// 触摸事件处理
const handleTouchStart = (e: TouchEvent) => {
  if (fullscreenMode.value !== 'none') return
  isDragging.value = true
  startX.value = e.touches[0].clientX - currentTranslateX.value
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isDragging.value || fullscreenMode.value !== 'none') return
  e.preventDefault()

  const x = e.touches[0].clientX - startX.value
  const maxScroll = -scrollContainer.value!.offsetWidth / 2
  currentTranslateX.value = Math.max(maxScroll, Math.min(0, x))
}

const handleTouchEnd = () => {
  if (fullscreenMode.value !== 'none') return
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
/* 主容器 */
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
  position: relative;
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
  background-size: 22px 22px;
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
  background-size: 33px 33px;
}

/* 路单区域 */
.road-section {
  position: relative;
  cursor: pointer;
}

.road-section:hover {
  background: rgba(255, 255, 255, 0.03);
}

.big-road-section {
  height: 133px;
  box-sizing: border-box;
}

.road-viewport {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.road-viewport-small {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.bead-road-section {
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
}

/* 下三路容器 */
.three-roads-container {
  height: 67px;
  display: flex;
  gap: 0;
  padding: 0;
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.08) 1px,
    transparent 1px
  );
  background-size: 11px 11px;
}

/* 下三路 */
.small-road {
  width: 33.333%;
  height: 67px;
  position: relative;
  padding: 0;
  box-sizing: border-box;
}

.road-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.small-road-container {
  padding: 2px;
  box-sizing: border-box;
}

/* 路单项目 */
.road-item {
  position: absolute;
  width: 22px;
  height: 22px;
}

.road-item-small {
  position: absolute;
  width: 11px;
  height: 11px;
}

.bead-item {
  position: absolute;
  width: 33px;
  height: 33px;
}

.road-item svg,
.road-item-small svg,
.bead-item svg {
  width: 100%;
  height: 100%;
}

/* 展开显示容器（占满显示区域200px） */
.expanded-container {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(rgba(37, 37, 37, 0.95), rgb(30, 30, 30));
  cursor: pointer;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
}

.expanded-road {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

.expanded-road-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.1) 1.5px,
    transparent 1.5px
  );
  background-size: 33px 33px;
}

.expanded-road-container-small {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.08) 1.5px,
    transparent 1.5px
  );
  background-size: 22px 22px;
}

/* 展开模式的路单项目 */
.road-item-expanded {
  position: absolute;
  width: 33px;
  height: 33px;
}

.road-item-expanded-small {
  position: absolute;
  width: 22px;
  height: 22px;
}

/* 响应式 */
@media (max-width: 768px) {
  .left-screen {
    background-size: 20px 20px;
  }

  .right-screen {
    background-size: 30px 30px;
  }

  .three-roads-container {
    background-size: 10px 10px;
  }
}
</style>
