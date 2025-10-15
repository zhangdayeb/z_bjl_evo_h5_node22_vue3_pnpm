// src/utils/bettingUtils.ts
// 投注相关工具函数

import type { BaccaratBetType } from '@/stores/bettingStore'

// 🎯 投注区域配置接口
export interface BetZoneConfig {
  id: BaccaratBetType
  rateId: number
  displayName: string
  odds: string
  minBetField: string
  maxBetField: string
}

// 🎯 投注区域配置映射
export const BET_ZONE_CONFIGS: Record<BaccaratBetType, BetZoneConfig> = {
  'banker': {
    id: 'banker',
    rateId: 8,
    displayName: '庄',
    odds: '1:0.95',
    minBetField: 'bjl_xian_hong_zhuang_min',
    maxBetField: 'bjl_xian_hong_zhuang_max'
  },
  'player': {
    id: 'player',
    rateId: 6,
    displayName: '闲',
    odds: '1:1',
    minBetField: 'bjl_xian_hong_xian_min',
    maxBetField: 'bjl_xian_hong_xian_max'
  },
  'tie': {
    id: 'tie',
    rateId: 7,
    displayName: '和',
    odds: '1:8',
    minBetField: 'bjl_xian_hong_he_min',
    maxBetField: 'bjl_xian_hong_he_max'
  },
  'banker-pair': {
    id: 'banker-pair',
    rateId: 4,
    displayName: '庄对',
    odds: '1:11',
    minBetField: 'bjl_xian_hong_zhuang_dui_min',
    maxBetField: 'bjl_xian_hong_zhuang_dui_max'
  },
  'player-pair': {
    id: 'player-pair',
    rateId: 2,
    displayName: '闲对',
    odds: '1:11',
    minBetField: 'bjl_xian_hong_xian_dui_min',
    maxBetField: 'bjl_xian_hong_xian_dui_max'
  },
  'lucky-6': {
    id: 'lucky-6',
    rateId: 3,
    displayName: '幸运6',
    odds: '1:12/20',
    minBetField: 'bjl_xian_hong_lucky6_min',
    maxBetField: 'bjl_xian_hong_lucky6_max'
  },
  'dragon-7': {
    id: 'dragon-7',
    rateId: 9,
    displayName: '龙7',
    odds: '1:40',
    minBetField: 'bjl_xian_hong_long7_min',
    maxBetField: 'bjl_xian_hong_long7_max'
  },
  'panda-8': {
    id: 'panda-8',
    rateId: 10,
    displayName: '熊8',
    odds: '1:25',
    minBetField: 'bjl_xian_hong_xiong8_min',
    maxBetField: 'bjl_xian_hong_xiong8_max'
  }
}

// 🎯 限红配置接口
export interface BetLimits {
  [key: string]: {
    min: number
    max: number
  }
}

// 🎯 投注结果接口
export interface BetResult {
  success: boolean
  amount?: number
  message: string
}

// 🎯 投注历史记录接口
export interface BetHistoryStep {
  betType: BaccaratBetType
  amount: number
  action: 'add' | 'remove'
  timestamp: number
}

/**
 * 根据投注类型获取区域配置
 */
export function getBetZoneConfig(betType: BaccaratBetType): BetZoneConfig | null {
  return BET_ZONE_CONFIGS[betType] || null
}

/**
 * 根据赔率ID查找投注类型
 */
export function findBetTypeByRateId(rateId: number): BaccaratBetType | null {
  const entry = Object.entries(BET_ZONE_CONFIGS).find(
    ([_, config]) => config.rateId === rateId
  )
  return entry ? (entry[0] as BaccaratBetType) : null
}

/**
 * 从台桌信息更新限红配置
 */
export function updateBetLimitsFromTableInfo(tableInfo: any): BetLimits {
  const betLimits: BetLimits = {}

  Object.keys(BET_ZONE_CONFIGS).forEach(betType => {
    const key = betType as BaccaratBetType
    const config = BET_ZONE_CONFIGS[key]

    betLimits[key] = {
      min: tableInfo[config.minBetField] || 10,
      max: tableInfo[config.maxBetField] || 50000
    }
  })

  return betLimits
}

/**
 * 计算投注金额是否有效
 */
export function calculateBetAmount(
  betType: BaccaratBetType,
  selectedAmount: number,
  currentBetAmount: number,
  betLimits: BetLimits,
  currentBalance: number
): BetResult {
  try {
    const limits = betLimits[betType]
    const zoneName = BET_ZONE_CONFIGS[betType].displayName

    if (!limits) {
      return { success: false, message: '投注区域配置错误' }
    }

    let actualAmount = selectedAmount
    let adjustmentMessage = ''

    // 余额检查
    if (actualAmount > currentBalance) {
      actualAmount = currentBalance
      adjustmentMessage = `按可用余额投注 $${currentBalance.toLocaleString()}`
    }

    // 最小限红检查
    if (currentBetAmount === 0) {
      if (actualAmount < limits.min) {
        actualAmount = limits.min
        adjustmentMessage = `投注金额已调整至最小限红 $${limits.min.toLocaleString()}`
      }
    } else {
      const newTotal = currentBetAmount + actualAmount
      if (newTotal > limits.max) {
        actualAmount = limits.max - currentBetAmount
        if (actualAmount <= 0) {
          return {
            success: false,
            message: `${zoneName}已达最大限红 $${limits.max.toLocaleString()}`
          }
        }
        adjustmentMessage = `投注金额已调整，累计不超过最大限红 $${limits.max.toLocaleString()}`
      }
    }

    if (actualAmount > currentBalance) {
      return {
        success: false,
        message: `余额不足，需要 $${actualAmount.toLocaleString()}，当前余额 $${currentBalance.toLocaleString()}`
      }
    }

    const finalTotal = currentBetAmount + actualAmount
    if (finalTotal > limits.max) {
      return {
        success: false,
        message: `超过最大限红，${zoneName}最大投注为 $${limits.max.toLocaleString()}`
      }
    }

    return {
      success: true,
      amount: actualAmount,
      message: adjustmentMessage || `投注成功：${zoneName} +$${actualAmount.toLocaleString()} (总计: $${finalTotal.toLocaleString()})`
    }
  } catch (error) {
    console.error('❌ 计算投注金额失败:', error)
    return { success: false, message: '投注计算错误' }
  }
}

/**
 * 构建API投注数据
 */
export function buildBetApiData(
  currentBets: Record<BaccaratBetType, number>,
  _isCommissionFree: boolean = false
): Array<{ money: number; rate_id: number }> {
  return Object.entries(currentBets)
    .filter(([_, amount]) => amount > 0)
    .map(([betType, amount]) => ({
      money: amount,
      rate_id: BET_ZONE_CONFIGS[betType as BaccaratBetType].rateId
    }))
}

/**
 * 验证投注数据
 */
export function validateBetData(
  currentBets: Record<BaccaratBetType, number>,
  betLimits: BetLimits,
  currentBalance: number
): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  let totalAmount = 0

  Object.entries(currentBets).forEach(([betType, amount]) => {
    if (amount > 0) {
      const key = betType as BaccaratBetType
      const limits = betLimits[key]
      const zoneName = BET_ZONE_CONFIGS[key].displayName

      if (!limits) {
        errors.push(`${zoneName}: 限红配置错误`)
        return
      }

      if (amount < limits.min) {
        errors.push(`${zoneName}: 投注金额低于最小限红 $${limits.min.toLocaleString()}`)
      }

      if (amount > limits.max) {
        errors.push(`${zoneName}: 投注金额超过最大限红 $${limits.max.toLocaleString()}`)
      }

      totalAmount += amount
    }
  })

  if (totalAmount > currentBalance) {
    errors.push(`总投注金额 $${totalAmount.toLocaleString()} 超过可用余额 $${currentBalance.toLocaleString()}`)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 获取投注区域显示名称
 */
export function getBetZoneDisplayName(betType: BaccaratBetType): string {
  return BET_ZONE_CONFIGS[betType]?.displayName || betType
}

/**
 * 获取投注区域赔率
 */
export function getBetZoneOdds(betType: BaccaratBetType): string {
  return BET_ZONE_CONFIGS[betType]?.odds || '1:1'
}

/**
 * 检查是否有有效投注
 */
export function hasValidBets(currentBets: Record<BaccaratBetType, number>): boolean {
  return Object.values(currentBets).some(amount => amount > 0)
}

/**
 * 计算总投注金额
 */
export function calculateTotalBetAmount(currentBets: Record<BaccaratBetType, number>): number {
  return Object.values(currentBets).reduce((sum, amount) => sum + amount, 0)
}

/**
 * 清空投注数据
 */
export function clearBetsData(): Record<BaccaratBetType, number> {
  return {
    'banker': 0,
    'player': 0,
    'tie': 0,
    'banker-pair': 0,
    'player-pair': 0,
    'lucky-6': 0,
    'dragon-7': 0,
    'panda-8': 0
  }
}

/**
 * 复制投注数据
 */
export function copyBetsData(
  source: Record<BaccaratBetType, number>
): Record<BaccaratBetType, number> {
  return { ...source }
}
