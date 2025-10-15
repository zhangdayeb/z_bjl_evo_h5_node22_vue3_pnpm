<template>
  <div v-if="isActive" class="result-fly-layer">
    <!-- 步骤1&2: 横条显示和缩短 -->
    <div
      v-if="currentStep === 'bar'"
      class="result-bar"
      :class="[animConfig.result, { shrinking: isShrinking }]"
      :style="barStyle"
    >
      {{ animConfig.bar.text }}
    </div>

    <!-- 步骤3&4: 圆球显示和飞行 -->
    <div
      v-if="currentStep === 'ball'"
      class="result-ball"
      :class="[animConfig.result, { flying: isFlying, shrinking: isBallShrinking }]"
      :style="ballStyle"
    >
      <div class="ball-highlight"></div>
      {{ animConfig.ball.letter }}
    </div>

    <!-- 步骤5: 路单图标飞散 -->
    <template v-if="currentStep === 'roads'">
      <!-- 大路图标 -->
      <div
        v-if="showRoadIcon.bigRoad"
        class="road-icon big-road"
        :class="{ flying: roadIconFlying.bigRoad }"
        :style="getRoadIconStyle('bigRoad')"
      >
        <div class="big-road-ring" :class="animConfig.result"></div>
      </div>

      <!-- 大眼路图标 -->
      <div
        v-if="showRoadIcon.bigEye"
        class="road-icon big-eye"
        :class="{ flying: roadIconFlying.bigEye }"
        :style="getRoadIconStyle('bigEye')"
      >
        <div class="big-eye-circle" :class="animConfig.result"></div>
      </div>

      <!-- 小路图标 -->
      <div
        v-if="showRoadIcon.smallRoad"
        class="road-icon small-road"
        :class="{ flying: roadIconFlying.smallRoad }"
        :style="getRoadIconStyle('smallRoad')"
      >
        <div class="small-road-dot" :class="animConfig.result"></div>
      </div>

      <!-- 曱甴路图标 -->
      <div
        v-if="showRoadIcon.cockroach"
        class="road-icon cockroach"
        :class="{ flying: roadIconFlying.cockroach }"
        :style="getRoadIconStyle('cockroach')"
      >
        <div class="cockroach-slash" :class="animConfig.result"></div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useoverLayerStore } from '@/stores/overLayerStore'
import { useVideoAndLuZhuTopConfigStore } from '@/stores/VideoAndLuZhuTopConfigStore'
import {
  type ResultType,
  type ResultFlyConfig,
  type Position,
  defaultAnimationConfig,
  getBarStartPosition,
  getBallTargetPosition,
  convertToScreenPosition
} from '@/config/resultFlyConfig'
import roadmapCalculator, { type RoadmapData } from '@/utils/roadmapCalculator'

const gameStore = useGameStore()
const overLayerStore = useoverLayerStore()
const videoAndLuZhuTopConfigStore = useVideoAndLuZhuTopConfigStore()

// 动画状态
type AnimationStep = 'bar' | 'ball' | 'roads' | 'complete'

const isActive = ref(false)
const currentStep = ref<AnimationStep>('bar')
const isShrinking = ref(false)
const isFlying = ref(false)
const isBallShrinking = ref(false)

// 当前动画配置
const animConfig = ref<ResultFlyConfig>(defaultAnimationConfig.banker)

// 位置配置
const barStartPos = ref<Position>({ x: 0, y: 0 })
const ballTargetPos = ref<Position>({ x: 0, y: 0 })
const roadTargetPositions = ref<{
  bigRoad: Position
  bigEye: Position
  smallRoad: Position
  cockroach: Position
}>({
  bigRoad: { x: 0, y: 0 },
  bigEye: { x: 0, y: 0 },
  smallRoad: { x: 0, y: 0 },
  cockroach: { x: 0, y: 0 }
})

// 路单图标状态
const showRoadIcon = ref({
  bigRoad: false,
  bigEye: false,
  smallRoad: false,
  cockroach: false
})

const roadIconFlying = ref({
  bigRoad: false,
  bigEye: false,
  smallRoad: false,
  cockroach: false
})

const lastProcessedPaiInfo = ref<string>('')

// 横条样式
const barStyle = computed(() => {
  return {
    left: `${barStartPos.value.x}px`,
    top: `${barStartPos.value.y}px`,
    width: isShrinking.value ? animConfig.value.bar.endWidth : animConfig.value.bar.startWidth
  }
})

// 圆球样式
const ballStyle = computed(() => {
  if (!isFlying.value) {
    // 初始位置（横条位置）
    return {
      left: `${barStartPos.value.x}px`,
      top: `${barStartPos.value.y}px`,
      width: `${animConfig.value.ball.size}px`,
      height: `${animConfig.value.ball.size}px`,
      opacity: 1
    }
  }

  // 飞行中/到达目标位置
  return {
    left: `${ballTargetPos.value.x}px`,
    top: `${ballTargetPos.value.y}px`,
    width: isBallShrinking.value ? '14px' : `${animConfig.value.ball.size}px`,
    height: isBallShrinking.value ? '14px' : `${animConfig.value.ball.size}px`,
    opacity: isBallShrinking.value ? 0 : 1
  }
})

// 路单图标样式
const getRoadIconStyle = (roadType: 'bigRoad' | 'bigEye' | 'smallRoad' | 'cockroach') => {
  const flying = roadIconFlying.value[roadType]

  if (!flying) {
    // 起始位置：圆球目标位置（露珠中心）
    return {
      left: `${ballTargetPos.value.x}px`,
      top: `${ballTargetPos.value.y}px`,
      opacity: 1
    }
  }

  // 飞行目标位置：各路的实际位置
  const endPos = roadTargetPositions.value[roadType]
  return {
    left: `${endPos.x}px`,
    top: `${endPos.y}px`,
    opacity: 0
  }
}

/**
 * 启动完整动画序列
 */
const startAnimation = async (result: ResultType) => {
  console.log('[ResultFly] Starting animation for:', result)

  // 重置状态
  isActive.value = true
  currentStep.value = 'bar'
  isShrinking.value = false
  isFlying.value = false
  isBallShrinking.value = false
  showRoadIcon.value = { bigRoad: false, bigEye: false, smallRoad: false, cockroach: false }
  roadIconFlying.value = { bigRoad: false, bigEye: false, smallRoad: false, cockroach: false }

  // 加载动画配置
  animConfig.value = defaultAnimationConfig[result]

  // 计算位置
  const isVideoOnTop = videoAndLuZhuTopConfigStore.isVideoOnTop

  // 横条起始位置
  barStartPos.value = getBarStartPosition(isVideoOnTop)

  // 圆球目标位置（露珠区域中心）
  ballTargetPos.value = getBallTargetPosition(isVideoOnTop)

  // TODO: 从路珠数据获取各路的最新位置并转换为屏幕坐标
  // 暂时使用临时位置
  roadTargetPositions.value = {
    bigRoad: { x: 100, y: 100 },
    bigEye: { x: 150, y: 150 },
    smallRoad: { x: 200, y: 150 },
    cockroach: { x: 250, y: 150 }
  }

  overLayerStore.open('resultFly')

  await nextTick()

  // 步骤1: 显示横条
  console.log('[ResultFly] Step 1: Show bar')
  await sleep(animConfig.value.bar.showDuration)

  // 步骤2: 横条缩短
  console.log('[ResultFly] Step 2: Shrink bar')
  isShrinking.value = true
  await sleep(animConfig.value.bar.shrinkDuration)

  // 步骤3: 切换到圆球
  console.log('[ResultFly] Step 3: Show ball')
  currentStep.value = 'ball'
  await nextTick()

  // 步骤4: 圆球飞行
  console.log('[ResultFly] Step 4: Ball flying')
  await sleep(50) // 等待DOM更新
  isFlying.value = true
  await sleep(animConfig.value.ball.flyDuration)

  // 圆球到达后缩小消失
  console.log('[ResultFly] Ball shrinking')
  isBallShrinking.value = true
  await sleep(animConfig.value.ball.shrinkDuration)

  // 步骤5: 路单图标飞散
  console.log('[ResultFly] Step 5: Road icons scatter')
  currentStep.value = 'roads'
  await nextTick()

  // 依次显示并飞出路单图标
  const roadTypes: Array<'bigRoad' | 'bigEye' | 'smallRoad' | 'cockroach'> = [
    'bigRoad',
    'bigEye',
    'smallRoad',
    'cockroach'
  ]

  for (const roadType of roadTypes) {
    showRoadIcon.value[roadType] = true
    await nextTick()
    await sleep(50)
    roadIconFlying.value[roadType] = true
    await sleep(animConfig.value.roadIcons.delay)
  }

  // 等待最后一个图标飞行完成
  await sleep(animConfig.value.roadIcons.flyDuration)

  // 动画完成
  console.log('[ResultFly] Animation complete')
  currentStep.value = 'complete'
  isActive.value = false
  overLayerStore.close()
}

/**
 * 辅助函数：延迟
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * 测试用：手动触发动画
 */
const testAnimation = (result: ResultType = 'banker') => {
  startAnimation(result)
}

// 监听游戏结果
watch(
  () => gameStore.gameResult,
  (newResult) => {
    if (!newResult || !newResult.pai_info) {
      return
    }

    if (gameStore.gameStatus !== 'dealing') {
      console.log('[ResultFly] Not in dealing phase, skip')
      return
    }

    if (newResult.pai_info === lastProcessedPaiInfo.value) {
      console.log('[ResultFly] Already processed this pai_info, skip')
      return
    }

    console.log('[ResultFly] Auto trigger - detected new pai_info result')
    lastProcessedPaiInfo.value = newResult.pai_info

    // 根据结果类型触发动画
    const resultType: ResultType = newResult.result === 1 ? 'banker' : newResult.result === 2 ? 'player' : 'tie'
    startAnimation(resultType)
  },
  { deep: true }
)

onMounted(() => {
  console.log('[ResultFly] Component mounted')

  // 开发测试：5秒后自动播放庄家动画
  setTimeout(() => {
    console.log('[ResultFly] Auto test animation')
    testAnimation('banker')
  }, 2000)
})

// 暴露测试方法
defineExpose({
  testAnimation
})
</script>

<style scoped>
.result-fly-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  pointer-events: none;
}

/* ========== 横条样式 ========== */
.result-bar {
  position: fixed;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.4s ease-out;
}

/* 横条渐变背景 - 庄 */
.result-bar.banker {
  background: linear-gradient(
    90deg,
    rgba(139, 0, 0, 0) 0%,
    rgba(139, 0, 0, 1) 33.33%,
    rgba(139, 0, 0, 1) 66.66%,
    rgba(139, 0, 0, 0) 100%
  );
}

.result-bar.banker::before,
.result-bar.banker::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(255, 215, 0, 0) 0%,
    rgba(255, 215, 0, 1) 33.33%,
    rgba(255, 215, 0, 1) 66.66%,
    rgba(255, 215, 0, 0) 100%
  );
}

.result-bar.banker::before {
  top: 0;
}

.result-bar.banker::after {
  bottom: 0;
}

/* 横条渐变背景 - 闲 */
.result-bar.player {
  background: linear-gradient(
    90deg,
    rgba(0, 0, 255, 0) 0%,
    rgba(0, 0, 255, 1) 33.33%,
    rgba(0, 0, 255, 1) 66.66%,
    rgba(0, 0, 255, 0) 100%
  );
}

.result-bar.player::before,
.result-bar.player::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(255, 215, 0, 0) 0%,
    rgba(255, 215, 0, 1) 33.33%,
    rgba(255, 215, 0, 1) 66.66%,
    rgba(255, 215, 0, 0) 100%
  );
}

.result-bar.player::before {
  top: 0;
}

.result-bar.player::after {
  bottom: 0;
}

/* 横条渐变背景 - 和 */
.result-bar.tie {
  background: linear-gradient(
    90deg,
    rgba(0, 128, 0, 0) 0%,
    rgba(0, 128, 0, 1) 33.33%,
    rgba(0, 128, 0, 1) 66.66%,
    rgba(0, 128, 0, 0) 100%
  );
}

.result-bar.tie::before,
.result-bar.tie::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(
    90deg,
    rgba(255, 215, 0, 0) 0%,
    rgba(255, 215, 0, 1) 33.33%,
    rgba(255, 215, 0, 1) 66.66%,
    rgba(255, 215, 0, 0) 100%
  );
}

.result-bar.tie::before {
  top: 0;
}

.result-bar.tie::after {
  bottom: 0;
}

/* ========== 圆球样式 ========== */
.result-ball {
  position: fixed;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  border: 2px solid #ffd700;
  box-shadow:
    0 0 8px rgba(255, 215, 0, 0.8),
    inset 0 -6px 12px rgba(0, 0, 0, 0.3),
    inset 0 6px 12px rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  overflow: hidden;
  transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.result-ball.flying {
  transition: left 1s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              top 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.result-ball.shrinking {
  transition: all 0.3s ease-out;
}

/* 圆球高光 */
.ball-highlight {
  position: absolute;
  top: 4px;
  left: 5px;
  width: 8px;
  height: 8px;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  border-radius: 50%;
  z-index: 1;
}

.result-ball.banker {
  background: radial-gradient(circle at 30% 30%, #ff6666, #cc0000 50%, #8b0000);
}

.result-ball.player {
  background: radial-gradient(circle at 30% 30%, #6666ff, #0000cc 50%, #000088);
}

.result-ball.tie {
  background: radial-gradient(circle at 30% 30%, #66ff66, #00cc00 50%, #008800);
}

/* ========== 路单图标样式 ========== */
.road-icon {
  position: fixed;
  transform: translate(-50%, -50%);
  transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 大路 - 空心圆环 */
.big-road-ring {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 3px solid;
  background: transparent;
  box-sizing: border-box;
}

.big-road-ring.banker {
  border-color: #EC2024;
}

.big-road-ring.player {
  border-color: #2E83FF;
}

.big-road-ring.tie {
  border-color: #00CC00;
}

/* 大眼路 - 空心小圆 */
.big-eye-circle {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 1.2px solid;
  background: transparent;
  box-sizing: border-box;
}

.big-eye-circle.banker {
  border-color: #EC2024;
}

.big-eye-circle.player {
  border-color: #2E83FF;
}

.big-eye-circle.tie {
  border-color: #00CC00;
}

/* 小路 - 实心圆点 */
.small-road-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}

.small-road-dot.banker {
  background: #EC2024;
}

.small-road-dot.player {
  background: #2E83FF;
}

.small-road-dot.tie {
  background: #00CC00;
}

/* 曱甴路 - 斜线 */
.cockroach-slash {
  width: 9px;
  height: 9px;
  position: relative;
}

.cockroach-slash::before {
  content: '';
  position: absolute;
  width: 120%;
  height: 1.5px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
  transform-origin: center;
}

.cockroach-slash.banker::before {
  background: #EC2024;
}

.cockroach-slash.player::before {
  background: #2E83FF;
}

.cockroach-slash.tie::before {
  background: #00CC00;
}
</style>
