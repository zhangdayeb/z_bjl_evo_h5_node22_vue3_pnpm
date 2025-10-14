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
import { ref, computed, watch, nextTick } from 'vue'
import { useResultFlyStore } from '@/stores/resultFlyStore'
import { useoverLayerStore } from '@/stores/overLayerStore'

const resultFlyStore = useResultFlyStore()
const overLayerStore = useoverLayerStore()

const isVisible = ref(false)
const flyingDot = ref<any>(null)
const isAnimating = ref(false)

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

watch(() => resultFlyStore.currentResult, (newResult) => {
  if (newResult) {
    startAnimation(newResult)
  } else {
    cancelAnimation()
  }
})

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

const cancelAnimation = () => {
  if (flyingDot.value) {
    flyingDot.value = null
    isAnimating.value = false
  }
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

  console.log('[ResultFly] Animation complete, call onFlyComplete')

  resultFlyStore.onFlyComplete()

  flyingDot.value = null
  isAnimating.value = false
  isVisible.value = false

  overLayerStore.close()
}
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
