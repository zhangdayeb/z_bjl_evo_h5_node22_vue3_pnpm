/**
 * @fileoverview 筹码飞行状态管理
 * @description 控制筹码飞行动画的起点、终点、时间等参数
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

// ========================= 类型定义 =========================
export type BetZone = 'player' | 'banker' | 'tie' | 'player-pair' | 'banker-pair'

interface BottomPoint {
  x: number
  bottom: number // 距离屏幕底部的距离
}

interface FlyingChip {
  value: number
  from: BottomPoint
  to: BottomPoint
  zone: BetZone
  duration?: number
}

// ========================= 常量 =========================
const DEBOUNCE_TIME = 100 // 防抖时间（毫秒）
const ANIMATION_DURATION = 400 // 标准动画时长
const FAST_ANIMATION_DURATION = 250 // 快速动画时长（连续点击时）

export const useChipFlyStore = defineStore('chipFly', () => {
  // ========================= 状态 =========================
  const isFlying = ref(false)
  const currentChip = ref<FlyingChip | null>(null)
  const lastClickTime = ref(0)
  const pendingAmount = ref(0) // 被取消的飞行金额（需要累加）
  const pendingZone = ref<BetZone | null>(null)

  // 飞行完成回调
  const onCompleteCallback = ref<((zone: BetZone, amount: number) => void) | null>(null)

  // ========================= 方法 =========================

  /**
   * 获取筹码起点位置(固定在底部筹码选择器中心)
   * @returns 起点坐标 (使用 bottom 定位,兼容性更好)
   */
  const getStartPoint = (): BottomPoint => {
    const CHIP_SIZE = 40
    const BOTTOM_MARGIN = 49

    return {
      x: window.innerWidth / 2,  // 水平居中
      bottom: BOTTOM_MARGIN + (CHIP_SIZE / 2)  // 距离屏幕底部的距离
    }
  }

  /**
   * 获取筹码终点位置(根据投注区域返回固定的筹码显示位置)
   * @param zone 投注区域
   * @returns 终点坐标 (使用 bottom 定位,兼容性更好)
   */
  const getEndPoint = (zone: BetZone): BottomPoint => {
    const CHIP_SIZE = 40
    const SMALL_CHIP_SIZE = 32
    const windowWidth = window.innerWidth

    // 投注区域容器距离屏幕底部的距离
    const BETTING_AREA_BOTTOM_OFFSET = 114

    // 根据不同区域返回对应的筹码显示位置
    // 计算方式: BETTING_AREA_BOTTOM_OFFSET + CSS_BOTTOM + CHIP_SIZE/2
    switch (zone) {
      case 'player':
        // CSS: bottom: 60px, left: 20%
        return {
          x: windowWidth * 0.2,
          bottom: BETTING_AREA_BOTTOM_OFFSET + 60 + CHIP_SIZE / 2
        }
      case 'banker':
        // CSS: bottom: 60px, right: 20% (即 left: 80%)
        return {
          x: windowWidth * 0.8,
          bottom: BETTING_AREA_BOTTOM_OFFSET + 60 + CHIP_SIZE / 2
        }
      case 'tie':
        // CSS: bottom: 80px, left: 50%
        return {
          x: windowWidth * 0.5,
          bottom: BETTING_AREA_BOTTOM_OFFSET + 80 + CHIP_SIZE / 2
        }
      case 'player-pair':
        // CSS: bottom: 15px, left: 20%
        return {
          x: windowWidth * 0.2,
          bottom: BETTING_AREA_BOTTOM_OFFSET + 15 + SMALL_CHIP_SIZE / 2
        }
      case 'banker-pair':
        // CSS: bottom: 15px, right: 20% (即 left: 80%)
        return {
          x: windowWidth * 0.8,
          bottom: BETTING_AREA_BOTTOM_OFFSET + 15 + SMALL_CHIP_SIZE / 2
        }
      default:
        return {
          x: windowWidth / 2,
          bottom: 200  // 默认位置
        }
    }
  }

  /**
   * 开始飞行动画(简化版 - 只需传入区域和金额)
   * @param params 飞行参数
   */
  const startFly = (params: {
    value: number
    zone: BetZone
    onComplete?: (zone: BetZone, amount: number) => void
  }) => {
    const now = Date.now()

    // 防抖检查（过快的点击忽略）
    if (now - lastClickTime.value < DEBOUNCE_TIME) {
      console.log('[ChipFly] 点击过快，忽略')
      return
    }

    lastClickTime.value = now

    // 如果正在飞行，取消当前飞行
    if (isFlying.value && currentChip.value) {
      console.log('[ChipFly] 取消当前飞行，金额:', currentChip.value.value)

      // 记录被取消的金额
      if (pendingZone.value === params.zone) {
        // 同一区域，累加金额
        pendingAmount.value += currentChip.value.value
      } else {
        // 不同区域，先结算之前的
        if (pendingZone.value !== null && pendingAmount.value > 0 && onCompleteCallback.value) {
          onCompleteCallback.value(pendingZone.value, pendingAmount.value)
        }
        pendingAmount.value = currentChip.value.value
        pendingZone.value = params.zone
      }

      // 清除当前飞行
      currentChip.value = null
    } else {
      // 新区域投注，先结算待处理金额
      if (pendingZone.value !== null && pendingZone.value !== params.zone && pendingAmount.value > 0 && onCompleteCallback.value) {
        onCompleteCallback.value(pendingZone.value, pendingAmount.value)
        pendingAmount.value = 0
        pendingZone.value = null
      }
    }

    // 设置回调
    onCompleteCallback.value = params.onComplete || null

    // 计算动画时长（连续点击时加速）
    const timeSinceLastClick = now - lastClickTime.value
    const duration = timeSinceLastClick < 500 ? FAST_ANIMATION_DURATION : ANIMATION_DURATION

    // 创建新的飞行筹码
    const chip: FlyingChip = {
      value: params.value + pendingAmount.value, // 包含待处理金额
      from: getStartPoint(),
      to: getEndPoint(params.zone), // 根据区域自动计算终点
      zone: params.zone,
      duration
    }

    // 如果是同一区域且有待处理金额，一起飞
    if (pendingZone.value === params.zone && pendingAmount.value > 0) {
      pendingAmount.value = 0
      pendingZone.value = null
    }

    console.log('[ChipFly] 开始飞行:', chip)

    isFlying.value = true
    currentChip.value = chip
  }

  /**
   * 飞行动画完成
   */
  const onFlyComplete = () => {
    if (!currentChip.value) return

    const chip = currentChip.value
    console.log('[ChipFly] 飞行完成:', chip.zone, chip.value)

    // 触发完成回调
    if (onCompleteCallback.value) {
      onCompleteCallback.value(chip.zone, chip.value)
      onCompleteCallback.value = null
    }

    // 清理状态
    isFlying.value = false
    currentChip.value = null
  }

  /**
   * 重置所有状态
   */
  const reset = () => {
    isFlying.value = false
    currentChip.value = null
    lastClickTime.value = 0
    pendingAmount.value = 0
    pendingZone.value = null
    onCompleteCallback.value = null
  }

  return {
    // 状态
    isFlying,
    currentChip,

    // 方法
    startFly,
    onFlyComplete,
    reset
  }
})
