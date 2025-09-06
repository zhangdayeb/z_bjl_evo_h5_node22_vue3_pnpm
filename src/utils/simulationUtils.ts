// src/utils/simulationUtils.ts - 模拟其他玩家投注数据工具
import type { BaccaratBetType } from '@/stores/bettingStore'

// 🔥 模拟数据接口
export interface SimulatedPlayerData {
  playerCount: number    // 其他玩家数量
  totalAmount: number    // 其他玩家总投注金额
}

// 🔥 模拟配置接口
export interface SimulationConfig {
  intervalMs: number                    // 更新间隔（毫秒）
  playerCountRange: [number, number]    // 每次玩家数量增长范围
  baseAmountRange: [number, number]     // 基础投注金额范围
  popularityWeights: Record<BaccaratBetType, number>  // 各投注区域的热门度权重
}

// 🔥 默认配置
const DEFAULT_CONFIG: SimulationConfig = {
  intervalMs: 1500,                     // 每1.5秒更新一次
  playerCountRange: [1, 3],             // 每次增加1-3个玩家
  baseAmountRange: [10, 500],           // 基础投注金额10-500
  popularityWeights: {
    'banker': 0.35,        // 庄家最热门 35%
    'player': 0.35,        // 闲家最热门 35%
    'tie': 0.08,           // 和较少 8%
    'banker-pair': 0.06,   // 庄对 6%
    'player-pair': 0.06,   // 闲对 6%
    'lucky-6': 0.04,       // 幸运6 4%
    'dragon-7': 0.03,      // 龙7 3%
    'panda-8': 0.03        // 熊8 3%
  }
}

// 🔥 全局状态
let simulationTimer: number | null = null
let simulationConfig: SimulationConfig = { ...DEFAULT_CONFIG }
let currentSimulatedData: Record<BaccaratBetType, SimulatedPlayerData> | null = null
let isSimulationRunning = false

/**
 * 🔥 创建空的模拟数据
 */
export function createEmptySimulatedData(): Record<BaccaratBetType, SimulatedPlayerData> {
  const betTypes: BaccaratBetType[] = [
    'banker', 'player', 'tie', 'banker-pair',
    'player-pair', 'lucky-6', 'dragon-7', 'panda-8'
  ]

  const data = {} as Record<BaccaratBetType, SimulatedPlayerData>

  betTypes.forEach(betType => {
    data[betType] = {
      playerCount: 0,
      totalAmount: 0
    }
  })

  return data
}

/**
 * 🔥 重置模拟数据 - 清空所有模拟投注
 */
export function resetSimulatedData(): void {
  try {
    if (!currentSimulatedData) {
      console.warn('⚠️ 模拟数据未初始化，无法重置')
      return
    }

    Object.keys(currentSimulatedData).forEach(betType => {
      const typedBetType = betType as BaccaratBetType
      currentSimulatedData![typedBetType] = {
        playerCount: 0,
        totalAmount: 0
      }
    })

    console.log('🧹 模拟数据已重置')
  } catch (error) {
    console.error('❌ 重置模拟数据失败:', error)
  }
}

/**
 * 🔥 生成随机整数（包含边界）
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 🔥 根据权重随机选择投注区域
 */
function selectRandomBetTypes(count: number): BaccaratBetType[] {
  const betTypes: BaccaratBetType[] = [
    'banker', 'player', 'tie', 'banker-pair',
    'player-pair', 'lucky-6', 'dragon-7', 'panda-8'
  ]

  // 创建加权数组
  const weightedTypes: BaccaratBetType[] = []
  betTypes.forEach(betType => {
    const weight = simulationConfig.popularityWeights[betType]
    const repeatCount = Math.round(weight * 100) // 转换为整数权重
    for (let i = 0; i < repeatCount; i++) {
      weightedTypes.push(betType)
    }
  })

  // 随机选择
  const selected: BaccaratBetType[] = []
  const usedTypes = new Set<BaccaratBetType>()

  for (let i = 0; i < count && selected.length < betTypes.length; i++) {
    let attempts = 0
    let selectedType: BaccaratBetType

    do {
      const randomIndex = randomInt(0, weightedTypes.length - 1)
      selectedType = weightedTypes[randomIndex]
      attempts++
    } while (usedTypes.has(selectedType) && attempts < 20)

    if (!usedTypes.has(selectedType)) {
      selected.push(selectedType)
      usedTypes.add(selectedType)
    }
  }

  return selected
}

/**
 * 🔥 生成投注金额 - 根据投注类型调整范围
 */
function generateBetAmount(betType: BaccaratBetType): number {
  const [baseMin, baseMax] = simulationConfig.baseAmountRange

  // 根据投注类型调整金额范围
  let multiplier = 1
  switch (betType) {
    case 'banker':
    case 'player':
      multiplier = 1.5  // 主要投注金额较大
      break
    case 'tie':
      multiplier = 0.8  // 和的投注金额较小
      break
    case 'banker-pair':
    case 'player-pair':
      multiplier = 0.6  // 对子投注金额较小
      break
    case 'lucky-6':
      multiplier = 0.5  // 幸运6投注金额较小
      break
    case 'dragon-7':
    case 'panda-8':
      multiplier = 0.4  // 特殊投注金额最小
      break
  }

  const adjustedMin = Math.round(baseMin * multiplier)
  const adjustedMax = Math.round(baseMax * multiplier)

  // 生成随机金额，偏向较小的数值（更真实）
  const random1 = Math.random()
  const random2 = Math.random()
  const skewedRandom = Math.min(random1, random2) // 偏向小值

  return Math.round(adjustedMin + (adjustedMax - adjustedMin) * skewedRandom)
}

/**
 * 🔥 更新模拟数据 - 随机增长投注
 */
export function updateSimulatedData(): void {
  try {
    if (!currentSimulatedData) {
      console.warn('⚠️ 模拟数据未初始化，无法更新')
      return
    }

    if (!isSimulationRunning) {
      return
    }

    // 随机选择要更新的投注区域数量
    const updateCount = randomInt(1, 4) // 每次更新1-4个区域

    // 根据权重选择投注区域
    const selectedBetTypes = selectRandomBetTypes(updateCount)

    selectedBetTypes.forEach(betType => {
      const data = currentSimulatedData![betType]

      // 随机增加玩家数量
      const playerIncrease = randomInt(
        simulationConfig.playerCountRange[0],
        simulationConfig.playerCountRange[1]
      )
      data.playerCount += playerIncrease

      // 为每个新玩家生成投注金额
      for (let i = 0; i < playerIncrease; i++) {
        const betAmount = generateBetAmount(betType)
        data.totalAmount += betAmount
      }

      console.log(`🎲 模拟更新 ${betType}: +${playerIncrease}人, +${playerIncrease * generateBetAmount(betType)}金额`)
    })

  } catch (error) {
    console.error('❌ 更新模拟数据失败:', error)
  }
}

/**
 * 🔥 启动模拟 - 开始定时更新数据
 */
export function startSimulation(
  simulatedDataRef: Record<BaccaratBetType, SimulatedPlayerData>,
  config?: Partial<SimulationConfig>
): void {
  try {
    // 如果已经在运行，先停止
    if (isSimulationRunning) {
      stopSimulation()
    }

    // 更新配置
    if (config) {
      simulationConfig = { ...simulationConfig, ...config }
    }

    // 设置数据引用
    currentSimulatedData = simulatedDataRef

    // 重置数据
    resetSimulatedData()

    // 标记为运行状态
    isSimulationRunning = true

    // 启动定时器
    simulationTimer = setInterval(() => {
      updateSimulatedData()
    }, simulationConfig.intervalMs)

    console.log(`🎮 模拟器启动成功，更新间隔: ${simulationConfig.intervalMs}ms`)

    // 立即执行一次初始更新
    setTimeout(() => {
      updateSimulatedData()
    }, 500)

  } catch (error) {
    console.error('❌ 启动模拟器失败:', error)
    isSimulationRunning = false
  }
}

/**
 * 🔥 停止模拟 - 清除定时器
 */
export function stopSimulation(): void {
  try {
    if (simulationTimer !== null) {
      clearInterval(simulationTimer)
      simulationTimer = null
    }

    isSimulationRunning = false
    console.log('⏹️ 模拟器已停止')

  } catch (error) {
    console.error('❌ 停止模拟器失败:', error)
  }
}

/**
 * 🔥 获取当前模拟状态
 */
export function getSimulationStatus(): {
  isRunning: boolean
  config: SimulationConfig
  timer: number | null
} {
  return {
    isRunning: isSimulationRunning,
    config: { ...simulationConfig },
    timer: simulationTimer
  }
}

/**
 * 🔥 更新模拟配置
 */
export function updateSimulationConfig(newConfig: Partial<SimulationConfig>): void {
  try {
    simulationConfig = { ...simulationConfig, ...newConfig }
    console.log('⚙️ 模拟配置已更新:', newConfig)

    // 如果正在运行，需要重启以应用新配置
    if (isSimulationRunning && currentSimulatedData) {
      const wasRunning = isSimulationRunning
      stopSimulation()
      if (wasRunning) {
        startSimulation(currentSimulatedData)
      }
    }
  } catch (error) {
    console.error('❌ 更新模拟配置失败:', error)
  }
}

/**
 * 🔥 获取指定投注类型的模拟数据
 */
export function getSimulatedDataForBetType(betType: BaccaratBetType): SimulatedPlayerData {
  if (!currentSimulatedData) {
    return { playerCount: 0, totalAmount: 0 }
  }

  return { ...currentSimulatedData[betType] }
}

/**
 * 🔥 手动添加模拟投注（用于测试或特殊情况）
 */
export function addManualSimulatedBet(
  betType: BaccaratBetType,
  playerCount: number,
  amount: number
): void {
  try {
    if (!currentSimulatedData) {
      console.warn('⚠️ 模拟数据未初始化，无法添加手动投注')
      return
    }

    const data = currentSimulatedData[betType]
    data.playerCount += playerCount
    data.totalAmount += amount

    console.log(`➕ 手动添加模拟投注 ${betType}: +${playerCount}人, +${amount}金额`)
  } catch (error) {
    console.error('❌ 添加手动模拟投注失败:', error)
  }
}

/**
 * 🔥 清理模拟器 - 完全重置
 */
export function cleanupSimulation(): void {
  try {
    stopSimulation()
    currentSimulatedData = null
    simulationConfig = { ...DEFAULT_CONFIG }
    console.log('🧹 模拟器已清理')
  } catch (error) {
    console.error('❌ 清理模拟器失败:', error)
  }
}
