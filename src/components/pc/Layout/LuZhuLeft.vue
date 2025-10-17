<!-- LuZhuLeft.vue - PC版珠子路组件（左侧） -->
<template>
  <div class="pc-bead-plate-component">
    <!-- 珠子路区域 -->
    <div class="pc-bead-plate-section">
      <div class="pc-bead-plate-viewport">
        <div class="pc-bead-plate-container">
          <div
            v-for="(item, index) in roadmapData.beadPlate"
            :key="`bead-${index}`"
            class="pc-bead-item"
            :style="{
              left: item.left + 'px',
              top: item.top + 'px'
            }"
          >
            <svg viewBox="0 0 30 30">
              <!-- 主圆形 -->
              <circle
                cx="15"
                cy="15"
                r="12"
                :fill="getBeadColor(item)"
              />

              <!-- 文字 -->
              <text
                x="15"
                y="16"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="white"
                font-size="16"
                font-weight="bold"
              >
                {{ getBeadText(item) }}
              </text>

              <!-- 闲对标记 -->
              <circle
                v-if="item.ext === 2 || item.ext === 3"
                cx="6"
                cy="6"
                r="5"
                fill="#2E83FF"
                stroke="#1a1a1a"
                stroke-width="2"
              />

              <!-- 庄对标记 -->
              <circle
                v-if="item.ext === 1 || item.ext === 3"
                cx="24"
                cy="24"
                r="5"
                fill="#EC2024"
                stroke="#1a1a1a"
                stroke-width="2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import type { RoadmapData, BeadPlatePosition } from '@/utils/roadmapCalculator'

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
</script>

<style scoped>
/* PC版珠子路主容器 */
.pc-bead-plate-component {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  overflow: hidden;
}

/* 珠子路区域 */
.pc-bead-plate-section {
  flex: 1;
  position: relative;
  background: transparent;
  overflow: hidden;
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

/* 珠子路视口 */
.pc-bead-plate-viewport {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  background-image: radial-gradient(
    circle at center,
    rgba(255, 255, 255, 0.12) 1.5px,
    transparent 1.5px
  );
  background-size: 33px 33px;
}

/* 珠子路容器 */
.pc-bead-plate-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 5px;
  box-sizing: border-box;
}

/* 珠子项目 */
.pc-bead-item {
  position: absolute;
  width: 33px;
  height: 33px;
}

.pc-bead-item svg {
  width: 100%;
  height: 100%;
}

/* 响应式调整 - 大屏PC */
@media (min-width: 1920px) {
  .pc-road-header {
    height: 28px;
    line-height: 28px;
    font-size: 13px;
  }
}
</style>
