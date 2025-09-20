<!-- LuZhuListItemRoadMap.vue - 简化版路珠组件 -->
<template>
  <div class="luzhu-component">
    <!-- 大路区域 -->
    <div class="big-road-section">
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
                stroke="#ffffff"
                stroke-width="2"
              />

              <!-- 闲对标记 -->
              <circle
                v-if="item.ext === 2 || item.ext === 3"
                cx="4.5"
                cy="4.5"
                r="4"
                fill="#007bff"
                stroke="#ffffff"
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
      <div class="small-road">
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
      <div class="small-road">
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
      <div class="small-road">
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
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import roadmapCalculator, {
  type GameResult,
  type RoadmapData
} from '@/utils/roadmapCalculator'

// Props 定义
interface Props {
  gameData: Record<string, GameResult>
}

const props = defineProps<Props>()

// 计算路单数据
const roadmapData = computed<RoadmapData>(() => {
  // 开启调试模式（可选）
  roadmapCalculator.setDebug(false)

  // 计算所有路单
  return roadmapCalculator.calculateAll(props.gameData)
})

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

// 计算路单偏移量
const calculateOffsets = () => {
  nextTick(() => {
    // 大路偏移
    if (roadmapData.value.bigRoad.length > 0) {
      const lastItem = roadmapData.value.bigRoad[roadmapData.value.bigRoad.length - 1]
      const maxX = lastItem.left + 18
      const viewportWidth = window.innerWidth
      if (maxX > viewportWidth) {
        bigRoadOffset.value = -(maxX - viewportWidth + 10)
      } else {
        bigRoadOffset.value = 0
      }
    }

    // 大眼路偏移
    if (roadmapData.value.bigEyeRoad.length > 0) {
      const lastItem = roadmapData.value.bigEyeRoad[roadmapData.value.bigEyeRoad.length - 1]
      const maxX = lastItem.left + 9
      const viewportWidth = window.innerWidth / 3
      if (maxX > viewportWidth) {
        bigEyeRoadOffset.value = -(maxX - viewportWidth + 5)
      } else {
        bigEyeRoadOffset.value = 0
      }
    }

    // 小路偏移
    if (roadmapData.value.smallRoad.length > 0) {
      const lastItem = roadmapData.value.smallRoad[roadmapData.value.smallRoad.length - 1]
      const maxX = lastItem.left + 9
      const viewportWidth = window.innerWidth / 3
      if (maxX > viewportWidth) {
        smallRoadOffset.value = -(maxX - viewportWidth + 5)
      } else {
        smallRoadOffset.value = 0
      }
    }

    // 蟑螂路偏移
    if (roadmapData.value.cockroachRoad.length > 0) {
      const lastItem = roadmapData.value.cockroachRoad[roadmapData.value.cockroachRoad.length - 1]
      const maxX = lastItem.left + 9
      const viewportWidth = window.innerWidth / 3
      if (maxX > viewportWidth) {
        cockroachRoadOffset.value = -(maxX - viewportWidth + 5)
      } else {
        cockroachRoadOffset.value = 0
      }
    }
  })
}

// 监听路单数据变化，自动计算偏移
watch(roadmapData, () => {
  calculateOffsets()
}, { deep: true, immediate: true })

// 监听 gameData 变化
watch(() => props.gameData, (newVal) => {
  console.log('LuZhuListItemRoadMap - Game data updated:', Object.keys(newVal).length, 'items')
}, { deep: true })

// 添加新结果的方法（供外部调用）
const addResult = (result: GameResult) => {
  // 这个方法现在不需要了，因为数据由父组件管理
  console.log('addResult called but data is managed by parent component', result)
}

// 暴露方法（如果需要）
defineExpose({
  addResult
})
</script>

<style scoped>
/* 主容器 */
.luzhu-component {
  width: 100%;
  height: 108px;
  background: #ffffff;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  border: 1px solid #e0e0e0;
}

/* 大路区域 */
.big-road-section {
  width: 100%;
  height: 54px;
  position: relative;
  background: #fafafa;
  border-bottom: 1px solid #e0e0e0;
  background-image: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0.06) 1px,
    transparent 1px
  );
  background-size: 18px 18px;
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

/* 下三路容器 */
.three-roads-container {
  width: 100%;
  height: 54px;
  display: flex;
  background: #f5f5f5;
  background-image: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0.04) 0.8px,
    transparent 0.8px
  );
  background-size: 9px 9px;
}

/* 下三路各项 */
.small-road {
  width: 33.333%;
  height: 54px;
  position: relative;
  box-sizing: border-box;
  border-right: 1px solid #e8e8e8;
}

.small-road:last-child {
  border-right: none;
}

/* 路单容器 */
.road-container {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.small-road-container {
  padding: 2px;
  box-sizing: border-box;
}

/* 路单项目 */
.road-item {
  position: absolute;
  width: 18px;
  height: 18px;
}

.road-item-small {
  position: absolute;
  width: 9px;
  height: 9px;
}

.road-item svg,
.road-item-small svg {
  width: 100%;
  height: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .big-road-section {
    background-size: 16px 16px;
  }

  .three-roads-container {
    background-size: 8px 8px;
  }

  .road-item {
    width: 16px;
    height: 16px;
  }

  .road-item-small {
    width: 8px;
    height: 8px;
  }
}
</style>
