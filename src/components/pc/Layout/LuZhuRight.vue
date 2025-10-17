<!-- LuZhuRight.vue - PC版路单组件（右侧：大路+下三路） -->
<template>
  <div class="pc-luzhu-component">
    <!-- 大路区域 -->
    <div class="pc-road-section pc-big-road-section">
      <div class="pc-road-viewport">
        <div class="pc-road-container" :style="{ transform: `translateX(${bigRoadOffset}px)` }">
          <div
            v-for="(item, index) in roadmapData.bigRoad"
            :key="`big-${index}`"
            class="pc-road-item"
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
                stroke-width="2.5"
              />

              <!-- 庄对标记 -->
              <circle
                v-if="item.ext === 1 || item.ext === 3"
                cx="15"
                cy="15"
                r="3"
                fill="#dc3545"
                stroke="#1a1a1a"
                stroke-width="1.5"
              />

              <!-- 闲对标记 -->
              <circle
                v-if="item.ext === 2 || item.ext === 3"
                cx="5"
                cy="5"
                r="3"
                fill="#007bff"
                stroke="#1a1a1a"
                stroke-width="1.5"
              />

              <!-- 和局数字 -->
              <text
                v-if="item.tieCount"
                x="10"
                y="11"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="#ffc107"
                font-size="10"
                font-weight="bold"
              >
                {{ item.tieCount }}
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 下三路区域 - 横向排列 -->
    <div class="pc-three-roads-section">
      <!-- 大眼路 -->
      <div class="pc-road-section pc-small-road-section">
        <div class="pc-road-viewport-small">
          <div class="pc-road-container" :style="{ transform: `translateX(${bigEyeRoadOffset}px)` }">
            <div
              v-for="(item, index) in roadmapData.bigEyeRoad"
              :key="`eye-${index}`"
              class="pc-road-item-small"
              :style="{
                left: item.left + 'px',
                top: item.top + 'px'
              }"
            >
              <svg viewBox="0 0 10 10">
                <circle
                  cx="5"
                  cy="5"
                  r="3.5"
                  fill="none"
                  :stroke="item.result === 1 ? '#EC2024' : '#2E83FF'"
                  stroke-width="1.2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 小路 -->
      <div class="pc-road-section pc-small-road-section">
        <div class="pc-road-viewport-small">
          <div class="pc-road-container" :style="{ transform: `translateX(${smallRoadOffset}px)` }">
            <div
              v-for="(item, index) in roadmapData.smallRoad"
              :key="`small-${index}`"
              class="pc-road-item-small"
              :style="{
                left: item.left + 'px',
                top: item.top + 'px'
              }"
            >
              <svg viewBox="0 0 10 10">
                <circle
                  cx="5"
                  cy="5"
                  r="3.5"
                  :fill="item.result === 1 ? '#EC2024' : '#2E83FF'"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 蟑螂路 -->
      <div class="pc-road-section pc-small-road-section">
        <div class="pc-road-viewport-small">
          <div class="pc-road-container" :style="{ transform: `translateX(${cockroachRoadOffset}px)` }">
            <div
              v-for="(item, index) in roadmapData.cockroachRoad"
              :key="`roach-${index}`"
              class="pc-road-item-small"
              :style="{
                left: item.left + 'px',
                top: item.top + 'px'
              }"
            >
              <svg viewBox="0 0 10 10">
                <line
                  x1="2"
                  y1="8"
                  x2="8"
                  y2="2"
                  :stroke="item.result === 1 ? '#EC2024' : '#2E83FF'"
                  stroke-width="1.5"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import type { RoadmapData } from '@/utils/roadmapCalculator'

// 使用 gameStore
const gameStore = useGameStore()

// 从 gameStore 获取数据（使用计算属性保持响应性）
const roadmapData = computed<RoadmapData>(() => {
  if (gameStore.roadmapData) {
    return gameStore.roadmapData
  }

  return {
    beadPlate: [],
    bigRoad: [],
    bigEyeRoad: [],
    smallRoad: [],
    cockroachRoad: [],
    sanxing: []
  }
})

// 路单偏移量
const bigRoadOffset = ref(0)
const bigEyeRoadOffset = ref(0)
const smallRoadOffset = ref(0)
const cockroachRoadOffset = ref(0)

// 计算路单偏移量（PC版右侧栏宽度350px）
const calculateOffsets = () => {
  nextTick(() => {
    const viewportWidth = 340 // PC右侧栏宽度减去padding
    const smallRoadWidth = viewportWidth / 3 // 三个小路横向排列，每个占 1/3 宽度

    // 大路偏移
    if (roadmapData.value.bigRoad.length > 0) {
      const lastItem = roadmapData.value.bigRoad[roadmapData.value.bigRoad.length - 1]
      const maxX = lastItem.left + 22
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
      if (maxX > smallRoadWidth) {
        bigEyeRoadOffset.value = -(maxX - smallRoadWidth + 5)
      } else {
        bigEyeRoadOffset.value = 0
      }
    }

    // 小路偏移
    if (roadmapData.value.smallRoad.length > 0) {
      const lastItem = roadmapData.value.smallRoad[roadmapData.value.smallRoad.length - 1]
      const maxX = lastItem.left + 11
      if (maxX > smallRoadWidth) {
        smallRoadOffset.value = -(maxX - smallRoadWidth + 5)
      } else {
        smallRoadOffset.value = 0
      }
    }

    // 蟑螂路偏移
    if (roadmapData.value.cockroachRoad.length > 0) {
      const lastItem = roadmapData.value.cockroachRoad[roadmapData.value.cockroachRoad.length - 1]
      const maxX = lastItem.left + 11
      if (maxX > smallRoadWidth) {
        cockroachRoadOffset.value = -(maxX - smallRoadWidth + 5)
      } else {
        cockroachRoadOffset.value = 0
      }
    }
  })
}

// 监听 roadmapData 变化，自动计算偏移
watch(roadmapData, () => {
  calculateOffsets()
}, { deep: true, immediate: true })

// 生命周期
onMounted(() => {
  console.log('[PC-LuZhuRight] PC版大路和下三路组件已加载')

  if (roadmapData.value && Object.keys(roadmapData.value).length > 0) {
    calculateOffsets()
  }

  window.addEventListener('resize', calculateOffsets)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateOffsets)
})
</script>

<style scoped>
/* PC版路单主容器 - 垂直布局 */
.pc-luzhu-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  overflow: hidden;
}

/* 路单区域样式 */
.pc-road-section {
  position: relative;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

/* 大路区域 - 占据更多空间 */
.pc-big-road-section {
  flex: 1;
  min-height: 120px;
  background: transparent;
}

/* 路单标题 */
.pc-road-header {
  height: 24px;
  line-height: 24px;
  padding: 0 10px;
  font-size: 12px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.pc-road-header-small {
  height: 20px;
  line-height: 20px;
  padding: 0 8px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.6);
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* 大路视口 */
.pc-road-viewport {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.1) 1.2px,
    transparent 1.2px
  );
  background-size: 22px 22px;
}

/* 下三路区域 - 横向排列 */
.pc-three-roads-section {
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  height: 70px;
  background: transparent;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 小路区域 - 横向布局，平均分配空间 */
.pc-small-road-section {
  flex: 1;
  height: 100%;
  background: transparent;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.pc-small-road-section:last-child {
  border-right: none;
}

/* 小路视口 */
.pc-road-viewport-small {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.08) 0.8px,
    transparent 0.8px
  );
  background-size: 11px 11px;
}

/* 路单容器 */
.pc-road-container {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

/* 路单项目 */
.pc-road-item {
  position: absolute;
  width: 20px;
  height: 20px;
}

.pc-road-item-small {
  position: absolute;
  width: 10px;
  height: 10px;
}

.pc-road-item svg,
.pc-road-item-small svg {
  width: 100%;
  height: 100%;
}

/* 响应式调整 - 大屏PC */
@media (min-width: 1920px) {
  .pc-big-road-section {
    min-height: 150px;
  }

  .pc-three-roads-section {
    height: 80px;
  }

  .pc-road-header {
    height: 28px;
    line-height: 28px;
    font-size: 13px;
  }

  .pc-road-header-small {
    height: 24px;
    line-height: 24px;
    font-size: 12px;
  }
}
</style>
