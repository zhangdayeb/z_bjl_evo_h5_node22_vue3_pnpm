<!-- LuZhuCount.vue - 统计栏组件 -->
<template>
  <div class="statistics-bar">
    <!-- 左侧：统计数据组 -->
    <div class="statistics-group">
      <!-- 局数 -->
      <div class="stat-item">
        <span class="game-round">
          <span class="hash">#</span>
          <span class="round-number">{{ statistics.total }}</span>
        </span>
      </div>

      <!-- 闲家统计 -->
      <div class="stat-item">
        <svg class="stat-svg" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="9.5" fill="#2E83FF" />
          <text x="10" y="10" text-anchor="middle" dominant-baseline="middle"
                fill="white" font-size="12" font-weight="bold">P</text>
        </svg>
        <span class="stat-count">{{ statistics.player }}</span>
      </div>

      <!-- 庄家统计 -->
      <div class="stat-item">
        <svg class="stat-svg" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="9.5" fill="#EC2024" />
          <text x="10" y="10" text-anchor="middle" dominant-baseline="middle"
                fill="white" font-size="12" font-weight="bold">B</text>
        </svg>
        <span class="stat-count">{{ statistics.banker }}</span>
      </div>

      <!-- 和局统计 -->
      <div class="stat-item">
        <svg class="stat-svg" viewBox="0 0 20 20">
          <circle cx="10" cy="10" r="9.5" fill="#159252" />
          <text x="10" y="10" text-anchor="middle" dominant-baseline="middle"
                fill="white" font-size="12" font-weight="bold">T</text>
        </svg>
        <span class="stat-count">{{ statistics.tie }}</span>
      </div>
    </div>

    <!-- 右侧：问路预测 -->
    <div class="predictions-group">
      <!-- 闲家预测 -->
      <div class="prediction-indicator player-predict">
        <span class="predict-label">P</span>
        <div class="predict-icons">
          <svg class="predict-svg" viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="4" fill="none"
                    :stroke="predictions.player.bigEye" stroke-width="1.2" />
          </svg>
          <svg class="predict-svg" viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="4" :fill="predictions.player.small" />
          </svg>
          <svg class="predict-svg" viewBox="0 0 10 10">
            <line x1="2" y1="2" x2="8" y2="8"
                  :stroke="predictions.player.cockroach" stroke-width="1.5" />
          </svg>
        </div>
      </div>

      <!-- 庄家预测 -->
      <div class="prediction-indicator banker-predict">
        <span class="predict-label">B</span>
        <div class="predict-icons">
          <svg class="predict-svg" viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="4" fill="none"
                    :stroke="predictions.banker.bigEye" stroke-width="1.2" />
          </svg>
          <svg class="predict-svg" viewBox="0 0 10 10">
            <circle cx="5" cy="5" r="4" :fill="predictions.banker.small" />
          </svg>
          <svg class="predict-svg" viewBox="0 0 10 10">
            <line x1="2" y1="2" x2="8" y2="8"
                  :stroke="predictions.banker.cockroach" stroke-width="1.5" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import roadmapCalculator, { type GameResult } from '@/utils/roadmapCalculator'

// Props
interface Props {
  gameData: Record<string, GameResult>
}

const props = defineProps<Props>()

// 计算属性
const statistics = computed(() =>
  roadmapCalculator.calculateStatistics(props.gameData)
)

const predictions = computed(() =>
  roadmapCalculator.calculatePredictions(props.gameData)
)
</script>

<style scoped>
.statistics-bar {
  height: 33px;
  background: rgb(37, 37, 37);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  box-sizing: border-box;
}

/* 左侧统计组 */
.statistics-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 3px;
}

.game-round {
  display: flex;
  align-items: center;
  gap: 3px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 11px;
}

.game-round .hash {
  opacity: 0.6;
  font-size: 10px;
}

.game-round .round-number {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  font-size: 12px;
}

.stat-svg {
  width: 18px;
  height: 18px;
}

.stat-count {
  color: rgba(255, 255, 255, 0.95);
  font-size: 12px;
  font-weight: 600;
  min-width: 18px;
  text-align: center;
}

/* 右侧预测组 */
.predictions-group {
  display: flex;
  gap: 8px;
}

.prediction-indicator {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 2px 6px;
  border-radius: 10px;
  height: 20px;
}

.player-predict {
  background: linear-gradient(135deg,
    rgba(46, 131, 255, 0.2) 0%,
    rgba(46, 131, 255, 0.08) 100%);
  border: 1px solid rgba(46, 131, 255, 0.3);
}

.banker-predict {
  background: linear-gradient(135deg,
    rgba(236, 32, 36, 0.2) 0%,
    rgba(236, 32, 36, 0.08) 100%);
  border: 1px solid rgba(236, 32, 36, 0.3);
}

.predict-label {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 700;
  font-size: 10px;
}

.predict-icons {
  display: flex;
  gap: 2px;
}

.predict-svg {
  width: 9px;
  height: 9px;
}
</style>
