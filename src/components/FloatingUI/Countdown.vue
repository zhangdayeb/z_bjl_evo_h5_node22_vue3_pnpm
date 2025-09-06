<!-- src/components/FloatingUI/Countdown.vue - 完全数据驱动版 -->
<template>
  <div v-show="shouldShow" class="countdown">
    <div class="countdown-container">
      <div class="countdown-circle">
        <svg class="progress-ring" :width="circleSize" :height="circleSize">
          <circle
            class="progress-ring-background"
            :stroke-width="strokeWidth"
            :r="normalizedRadius"
            :cx="circleSize / 2"
            :cy="circleSize / 2"
          />
          <circle
            class="progress-ring-progress"
            :stroke-width="strokeWidth"
            :stroke-dasharray="circumference + ' ' + circumference"
            :style="{ strokeDashoffset: strokeDashoffset }"
            :r="normalizedRadius"
            :cx="circleSize / 2"
            :cy="circleSize / 2"
            :class="{ 'urgent': isUrgent }"
          />
        </svg>
        <div class="countdown-number" :class="{ 'urgent': isUrgent }">
          {{ gameStore.countdown }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// 直接使用 GameStore，无需任何 props
const gameStore = useGameStore()

// 圆圈配置常量
const circleSize = 50
const strokeWidth = 4
const normalizedRadius = (circleSize - strokeWidth * 2) / 2
const circumference = normalizedRadius * 2 * Math.PI

// 计算属性：是否应该显示组件
const shouldShow = computed(() => gameStore.countdown > 0)

// 计算属性：是否紧急状态（小于等于10秒）
const isUrgent = computed(() => {
  return gameStore.countdown <= 10 && gameStore.countdown > 0
})

// 计算属性：进度条偏移
const strokeDashoffset = computed(() => {
  const maxTime = gameStore.countdown || 30
  const progress = gameStore.countdown / maxTime
  return circumference - progress * circumference
})
</script>

<style scoped>
.countdown {
  position: absolute;
  top: 55px;
  left: 15px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(6px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px;
  color: white;
  z-index: 15;
  animation: slideInDown 0.3s ease-out;
}

.countdown-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.countdown-circle {
  position: relative;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-ring {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotate(-90deg);
}

.progress-ring-background {
  fill: transparent;
  stroke: rgba(255, 255, 255, 0.2);
}

.progress-ring-progress {
  fill: transparent;
  stroke: #52c41a;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.5s ease-in-out, stroke 0.3s ease;
}

.progress-ring-progress.urgent {
  stroke: #ff7875;
}

.countdown-number {
  font-size: 18px;
  font-weight: 700;
  color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  transition: color 0.3s ease;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  margin: 0;
  padding: 0;
  pointer-events: none;
}

.countdown-number.urgent {
  color: #ff7875;
  text-shadow: 0 0 8px rgba(255, 120, 117, 0.5);
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 紧急状态脉动动画 */
.countdown:has(.countdown-number.urgent) {
  animation: pulse 1s ease-in-out infinite alternate;
}

@keyframes pulse {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.05);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .countdown {
    top: 48px;
    left: 12px;
    padding: 10px;
  }

  .countdown-circle {
    width: 50px;
    height: 50px;
  }

  .countdown-number {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .countdown {
    top: 42px;
    left: 10px;
    padding: 8px;
  }

  .countdown-circle {
    width: 50px;
    height: 50px;
  }

  .countdown-number {
    font-size: 14px;
  }
}
</style>
