import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ScreenPoint {
  x: number
  y: number
}

interface FlyingResult {
  id: number
  from: ScreenPoint
  to: ScreenPoint
  duration?: number
}

const ANIMATION_DURATION = 1000

export const useResultFlyStore = defineStore('resultFly', () => {
  const isFlying = ref(false)
  const currentResult = ref<FlyingResult | null>(null)
  let resultIdCounter = 0

  const onCompleteCallback = ref<(() => void) | null>(null)

  const getStartPoint = (videoHeight: number, isVideoOnTop: boolean): ScreenPoint => {
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

  const getEndPoint = (luzhuHeight: number, isVideoOnTop: boolean, gameStatus: string = 'betting'): ScreenPoint => {
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

  const startFly = (params: {
    videoHeight?: number
    luzhuHeight?: number
    isVideoOnTop: boolean
    gameStatus?: string
    onComplete?: () => void
  }) => {
    const {
      videoHeight = 300,
      luzhuHeight = 233,
      isVideoOnTop,
      gameStatus = 'betting',
      onComplete
    } = params

    console.log('[ResultFly Store] Start flying animation')

    if (isFlying.value) {
      console.log('[ResultFly Store] Already flying, ignore')
      return
    }

    onCompleteCallback.value = onComplete || null

    const result: FlyingResult = {
      id: resultIdCounter++,
      from: getStartPoint(videoHeight, isVideoOnTop),
      to: getEndPoint(luzhuHeight, isVideoOnTop, gameStatus),
      duration: ANIMATION_DURATION
    }

    console.log('[ResultFly Store] Flying params:', result)

    isFlying.value = true
    currentResult.value = result
  }

  const onFlyComplete = () => {
    if (!currentResult.value) return

    console.log('[ResultFly Store] Flight complete')

    if (onCompleteCallback.value) {
      onCompleteCallback.value()
      onCompleteCallback.value = null
    }

    isFlying.value = false
    currentResult.value = null
  }

  const reset = () => {
    isFlying.value = false
    currentResult.value = null
    onCompleteCallback.value = null
  }

  return {
    isFlying,
    currentResult,
    startFly,
    onFlyComplete,
    reset
  }
})
