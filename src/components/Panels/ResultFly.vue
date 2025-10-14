<template>
  <div class="result-fly-container">
    <!-- 飞行的红点 -->
    <Transition
      v-for="dot in flyingDots"
      :key="dot.id"
      name="fly"
      @after-leave="removeDot(dot.id)"
    >
      <div
        v-if="dot.visible"
        class="flying-dot"
        :style="getDotStyle(dot)"
      ></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useVideoAndLuZhuTopConfigStore } from '@/stores/VideoAndLuZhuTopConfigStore'

// ========================= 类型定义 =========================
interface FlyingDot {
  id: number
  visible: boolean
  startX: number
  startY: number
  endX: number
  endY: number
}

interface Props {
  // 视频区域的高度
  videoHeight?: number
  // 露珠区域的高度
  luzhuHeight?: number
  // 是否触发飞行动画
  trigger?: boolean
}

// ========================= Props & Emits =========================
const props = withDefaults(defineProps<Props>(), {
  videoHeight: 300,
  luzhuHeight: 233,
  trigger: false
})

const emit = defineEmits<{
  animationComplete: []
}>()

// ========================= Stores =========================
const videoAndLuZhuTopConfigStore = useVideoAndLuZhuTopConfigStore()

// ========================= 响应式数据 =========================
const flyingDots = ref<FlyingDot[]>([])
let dotIdCounter = 0

// ========================= 计算属性 =========================
// 视频是否在上方
const isVideoOnTop = computed(() => videoAndLuZhuTopConfigStore.isVideoOnTop)

// 计算起点位置（视频区域中心底部）
const startPosition = computed(() => {
  const screenWidth = window.innerWidth
  const x = screenWidth / 2 // 屏幕中心

  if (isVideoOnTop.value) {
    // 视频在上方：起点在视频底部中心
    const y = props.videoHeight - 20 // 距离视频底部20px
    return { x, y }
  } else {
    // 视频在下方：起点在 233px（露珠高度）+ 视频中心
    const y = 233 + props.videoHeight / 2
    return { x, y }
  }
})

// 计算终点位置（露珠区域左侧中心）
const endPosition = computed(() => {
  const x = 40 // 距离左侧40px

  if (isVideoOnTop.value) {
    // 视频在上方，露珠在下方
    // 露珠距离底部的位置 + 露珠高度的一半
    const bottomOffset = 346 // 从 VideoAndLuZhu.vue 中获取
    const y = window.innerHeight - bottomOffset + props.luzhuHeight / 2
    return { x, y }
  } else {
    // 露珠在上方
    const y = props.luzhuHeight / 2
    return { x, y }
  }
})

// ========================= 方法 =========================
// 创建飞行红点
const createFlyingDot = () => {
  const newDot: FlyingDot = {
    id: dotIdCounter++,
    visible: true,
    startX: startPosition.value.x,
    startY: startPosition.value.y,
    endX: endPosition.value.x,
    endY: endPosition.value.y
  }

  flyingDots.value.push(newDot)

  // 动画开始后，等待一小段时间再隐藏（触发离场动画）
  setTimeout(() => {
    const dot = flyingDots.value.find(d => d.id === newDot.id)
    if (dot) {
      dot.visible = false
    }
  }, 50) // 50ms 后开始飞行动画
}

// 移除已完成动画的红点
const removeDot = (id: number) => {
  const index = flyingDots.value.findIndex(d => d.id === id)
  if (index > -1) {
    flyingDots.value.splice(index, 1)
  }

  // 通知父组件动画完成
  if (flyingDots.value.length === 0) {
    emit('animationComplete')
  }
}

// 获取红点的样式（初始位置）
const getDotStyle = (dot: FlyingDot) => {
  return {
    '--start-x': `${dot.startX}px`,
    '--start-y': `${dot.startY}px`,
    '--end-x': `${dot.endX}px`,
    '--end-y': `${dot.endY}px`
  }
}

// 触发飞行动画
const triggerFly = () => {
  createFlyingDot()
}

// ========================= 监听 =========================
// 监听 trigger 属性变化
watch(() => props.trigger, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    triggerFly()
  }
})

// ========================= 暴露接口 =========================
defineExpose({
  triggerFly
})
</script>

<style scoped>
.result-fly-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
}

/* 飞行的红点 */
.flying-dot {
  position: absolute;
  width: 14px;
  height: 14px;
  background: radial-gradient(circle, #ff4444 0%, #ff0000 50%, #cc0000 100%);
  border-radius: 50%;
  box-shadow:
    0 0 8px rgba(255, 0, 0, 0.8),
    0 0 16px rgba(255, 0, 0, 0.4);
  left: var(--start-x);
  top: var(--start-y);
  transform: translate(-50%, -50%);
}

/* Vue Transition 动画 */
.fly-enter-active {
  animation: fly-animation 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.fly-leave-active {
  animation: fade-out 0.2s ease-out forwards;
}

/* 飞行动画 - 使用贝塞尔曲线实现抛物线效果 */
@keyframes fly-animation {
  0% {
    left: var(--start-x);
    top: var(--start-y);
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
  }

  10% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }

  /* 升起阶段 */
  30% {
    left: calc(var(--start-x) - (var(--start-x) - var(--end-x)) * 0.2);
    top: calc(var(--start-y) - (var(--start-y) - var(--end-y)) * 0.3 - 50px);
  }

  /* 飞行阶段 */
  70% {
    left: calc(var(--start-x) - (var(--start-x) - var(--end-x)) * 0.7);
    top: calc(var(--start-y) - (var(--start-y) - var(--end-y)) * 0.7 - 30px);
  }

  /* 到达阶段 */
  90% {
    left: var(--end-x);
    top: var(--end-y);
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }

  100% {
    left: var(--end-x);
    top: var(--end-y);
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }
}

/* 淡出动画 */
@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
