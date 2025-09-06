// src/utils/chipUtils.ts
// 筹码相关工具函数

// 🎯 筹码数据接口
export interface ChipData {
  id: string
  value: number
  name: string
  image: string
  displayValue: string
}

// 🎯 筹码图片映射
export const CHIP_IMAGE_MAP: Record<number, string> = {
  1: '/src/assets/images/chips/B_01.png',
  5: '/src/assets/images/chips/B_05.png',
  10: '/src/assets/images/chips/B_10.png',
  20: '/src/assets/images/chips/B_20.png',
  50: '/src/assets/images/chips/B_50.png',
  100: '/src/assets/images/chips/B_100.png',
  500: '/src/assets/images/chips/B_500.png',
  1000: '/src/assets/images/chips/B_1K.png',
  5000: '/src/assets/images/chips/B_5K.png',
  10000: '/src/assets/images/chips/B_10K.png',
  20000: '/src/assets/images/chips/B_20K.png',
  50000: '/src/assets/images/chips/B_50K.png',
  100000: '/src/assets/images/chips/B_100K.png',
  200000: '/src/assets/images/chips/B_200K.png',
  1000000: '/src/assets/images/chips/B_1M.png',
  5000000: '/src/assets/images/chips/B_5M.png',
  10000000: '/src/assets/images/chips/B_10M.png',
  20000000: '/src/assets/images/chips/B_20M.png',
  50000000: '/src/assets/images/chips/B_50M.png',
  100000000: '/src/assets/images/chips/B_100M.png',
  200000000: '/src/assets/images/chips/B_200M.png',
  500000000: '/src/assets/images/chips/B_500M.png',
  1000000000: '/src/assets/images/chips/B_1000M.png'
}

// 🎯 所有可用筹码值（按从小到大排序）
export const CHIP_VALUES: number[] = [
  1, 5, 10, 20, 50, 100, 500, 1000, 5000, 10000, 20000, 50000,
  100000, 200000, 1000000, 5000000, 10000000, 20000000, 50000000,
  100000000, 200000000, 500000000, 1000000000
]

// 🎯 筹码值（用于分解金额，按从大到小排序）
export const CHIP_VALUES_DESC: number[] = [...CHIP_VALUES].reverse()

// 🎯 所有可用筹码数据
export const AVAILABLE_CHIPS: ChipData[] = CHIP_VALUES.map(value => ({
  id: `chip-${value}`,
  value,
  name: formatChipName(value),
  image: CHIP_IMAGE_MAP[value] || '/src/assets/images/chips/default.png',
  displayValue: formatChipDisplayValue(value)
}))

// 🎯 默认显示筹码
export const DEFAULT_DISPLAY_CHIPS: ChipData[] = [
  { id: 'chip-10', value: 10, name: '10', image: CHIP_IMAGE_MAP[10], displayValue: '10' },
  { id: 'chip-50', value: 50, name: '50', image: CHIP_IMAGE_MAP[50], displayValue: '50' },
  { id: 'chip-100', value: 100, name: '100', image: CHIP_IMAGE_MAP[100], displayValue: '100' }
]

/**
 * 格式化筹码名称
 */
export function formatChipName(value: number): string {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toFixed(0)}B`
  } else if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  } else {
    return value.toString()
  }
}

/**
 * 格式化筹码显示值
 */
export function formatChipDisplayValue(value: number): string {
  if (value >= 1000000000) {
    const billions = value / 1000000000
    return billions % 1 === 0 ? `${billions.toFixed(0)}B` : `${billions.toFixed(1)}B`
  } else if (value >= 1000000) {
    const millions = value / 1000000
    return millions % 1 === 0 ? `${millions.toFixed(0)}M` : `${millions.toFixed(1)}M`
  } else if (value >= 1000) {
    const thousands = value / 1000
    return thousands % 1 === 0 ? `${thousands.toFixed(0)}K` : `${thousands.toFixed(1)}K`
  } else {
    return value.toString()
  }
}

/**
 * 根据金额分解成筹码组合
 * @param amount 金额
 * @param maxChips 最大筹码数量（默认6个）
 * @returns 筹码组合数组
 */
export function getChipImages(amount: number, maxChips: number = 6): Array<{value: number, image: string}> {
  try {
    if (amount <= 0) return []

    const chips: Array<{value: number, image: string}> = []
    let remaining = amount

    for (const value of CHIP_VALUES_DESC) {
      while (remaining >= value && chips.length < maxChips) {
        chips.push({
          value,
          image: CHIP_IMAGE_MAP[value] || '/src/assets/images/chips/default.png'
        })
        remaining -= value
      }

      if (chips.length >= maxChips) break
    }

    return chips
  } catch (error) {
    console.error('❌ 获取筹码图片失败:', error)
    return []
  }
}

/**
 * 根据余额智能推荐筹码
 * @param balance 当前余额
 * @returns 推荐的筹码数据数组
 */
export function getRecommendedChips(balance: number): ChipData[] {
  let recommendedValues: number[] = []

  if (balance >= 50000) {
    recommendedValues = [100, 1000, 10000]
  } else if (balance >= 10000) {
    recommendedValues = [50, 500, 5000]
  } else if (balance >= 1000) {
    recommendedValues = [10, 50, 100]
  } else if (balance >= 100) {
    recommendedValues = [1, 5, 10]
  } else {
    recommendedValues = [1, 5, 10]
  }

  return recommendedValues
    .map(value => AVAILABLE_CHIPS.find(chip => chip.value === value))
    .filter(chip => chip !== undefined) as ChipData[]
}

/**
 * 验证筹码值是否有效
 */
export function isValidChipValue(value: number): boolean {
  return CHIP_VALUES.includes(value)
}

/**
 * 获取最接近的有效筹码值
 */
export function getClosestChipValue(targetValue: number): number {
  if (targetValue <= 0) return CHIP_VALUES[0]
  if (targetValue >= CHIP_VALUES[CHIP_VALUES.length - 1]) return CHIP_VALUES[CHIP_VALUES.length - 1]

  let closest = CHIP_VALUES[0]
  let minDiff = Math.abs(targetValue - closest)

  for (const value of CHIP_VALUES) {
    const diff = Math.abs(targetValue - value)
    if (diff < minDiff) {
      minDiff = diff
      closest = value
    }
  }

  return closest
}

/**
 * 根据筹码值获取筹码数据
 */
export function getChipDataByValue(value: number): ChipData | null {
  return AVAILABLE_CHIPS.find(chip => chip.value === value) || null
}

/**
 * 根据筹码值数组获取筹码数据数组
 */
export function getChipDataByValues(values: number[]): ChipData[] {
  return values
    .map(value => getChipDataByValue(value))
    .filter(chip => chip !== null) as ChipData[]
}

/**
 * 创建自定义筹码数据
 */
export function createChipData(value: number): ChipData | null {
  if (!isValidChipValue(value)) return null

  return {
    id: `chip-${value}`,
    value,
    name: formatChipName(value),
    image: CHIP_IMAGE_MAP[value] || '/src/assets/images/chips/default.png',
    displayValue: formatChipDisplayValue(value)
  }
}

/**
 * 批量创建筹码数据
 */
export function createChipsData(values: number[]): ChipData[] {
  return values
    .map(value => createChipData(value))
    .filter(chip => chip !== null) as ChipData[]
}

/**
 * 更新显示筹码（确保最多3个，不足时用默认筹码补充）
 */
export function updateDisplayChips(chips: ChipData[]): ChipData[] {
  const validChips = chips.slice(0, 3)

  if (validChips.length === 0) {
    return [...DEFAULT_DISPLAY_CHIPS]
  }

  // 补充到3个筹码
  while (validChips.length < 3) {
    const defaultChip = DEFAULT_DISPLAY_CHIPS.find(chip =>
      !validChips.some(existing => existing.value === chip.value)
    )
    if (defaultChip) {
      validChips.push(defaultChip)
    } else {
      break
    }
  }

  return validChips
}

/**
 * 获取筹码总数
 */
export function getChipCount(chips: Array<{value: number, image: string}>): number {
  return chips.length
}

/**
 * 获取筹码总价值
 */
export function getChipsTotalValue(chips: Array<{value: number, image: string}>): number {
  return chips.reduce((total, chip) => total + chip.value, 0)
}

/**
 * 合并相同面值的筹码
 */
export function mergeChips(chips: Array<{value: number, image: string}>): Array<{value: number, image: string, count: number}> {
  const merged = new Map<number, {value: number, image: string, count: number}>()

  chips.forEach(chip => {
    const existing = merged.get(chip.value)
    if (existing) {
      existing.count += 1
    } else {
      merged.set(chip.value, {
        value: chip.value,
        image: chip.image,
        count: 1
      })
    }
  })

  return Array.from(merged.values()).sort((a, b) => b.value - a.value)
}
