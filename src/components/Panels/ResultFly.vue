<template>
  <div v-if="isVisible" class="result-fly-layer">
    <div
      v-if="flyingDot"
      class="flying-dot-wrapper"
      :style="flyingDotStyle"
      @transitionend="onTransitionEnd"
    >
      <div class="flying-dot"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useoverLayerStore } from '@/stores/overLayerStore'
import { useVideoAndLuZhuTopConfigStore } from '@/stores/VideoAndLuZhuTopConfigStore'

const gameStore = useGameStore()
const overLayerStore = useoverLayerStore()
const videoAndLuZhuTopConfigStore = useVideoAndLuZhuTopConfigStore()

const isVisible = ref(false)
const flyingDot = ref<any>(null)
const isAnimating = ref(false)
const lastProcessedPaiInfo = ref<string>('')

const flyingDotStyle = computed(() => {
  if (!flyingDot.value) return {}

  const dot = flyingDot.value

  if (!isAnimating.value) {
    return {
      left: `${dot.from.x}px`,
      top: `${dot.from.y}px`,
      transform: 'translate(-50%, -50%) scale(0.5)',
      opacity: '0',
      transition: 'none'
    }
  }

  return {
    left: `${dot.to.x}px`,
    top: `${dot.to.y}px`,
    transform: 'translate(-50%, -50%) scale(0.8)',
    opacity: '0',
    transition: `all ${dot.duration || 1000}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`
  }
})

const getStartPoint = (videoHeight: number, isVideoOnTop: boolean) => {
  const screenWidth = window.innerWidth
  const x = screenWidth / 2

  if (isVideoOnTop) {
    const y = videoHeight - 20
    return { x, y }
  } else {
    const y = 233 + videoHeight / 2
    return { x, y }
  }
}

const getEndPoint = (luzhuHeight: number, isVideoOnTop: boolean, gameStatus: string = 'betting') => {
  const x = 40

  if (isVideoOnTop) {
    const bottomOffset = gameStatus === 'betting' ? 346 : 270
    const y = window.innerHeight - bottomOffset + luzhuHeight / 2
    return { x, y }
  } else {
    const y = luzhuHeight / 2
    return { x, y }
  }
}

const createFlyingDot = () => {
  const videoHeight = 300
  const luzhuHeight = 233
  const isVideoOnTop = videoAndLuZhuTopConfigStore.isVideoOnTop
  const gameStatus = gameStore.gameStatus

  return {
    id: Date.now(),
    from: getStartPoint(videoHeight, isVideoOnTop),
    to: getEndPoint(luzhuHeight, isVideoOnTop, gameStatus),
    duration: 1000
  }
}

const startAnimation = async (result: any) => {
  console.log('[ResultFly] Start animation:', result)

  isVisible.value = true
  overLayerStore.open('resultFly')

  flyingDot.value = { ...result }
  isAnimating.value = false

  await nextTick()

  void document.body.offsetHeight

  requestAnimationFrame(() => {
    console.log('[ResultFly] Start transform animation')
    isAnimating.value = true
  })
}

const onTransitionEnd = (event: TransitionEvent) => {
  console.log('[ResultFly] transitionend event:', event.propertyName)

  if (!isAnimating.value) {
    console.log('[ResultFly] isAnimating is false, ignore')
    return
  }

  if (event.propertyName !== 'opacity') {
    console.log('[ResultFly] Not opacity property, ignore')
    return
  }

  console.log('[ResultFly] Animation complete')

  flyingDot.value = null
  isAnimating.value = false
  isVisible.value = false

  overLayerStore.close()
}

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

    const dot = createFlyingDot()
    startAnimation(dot)
  },
  { deep: true }
)

onMounted(() => {
  console.log('[ResultFly] Component mounted, auto watch enabled')
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

.flying-dot-wrapper {
  position: fixed;
  width: 14px;
  height: 14px;
  will-change: transform, opacity;
}

.flying-dot {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, #ff4444 0%, #ff0000 50%, #cc0000 100%);
  border-radius: 50%;
  box-shadow:
    0 0 8px rgba(255, 0, 0, 0.8),
    0 0 16px rgba(255, 0, 0, 0.4);
}
</style>
