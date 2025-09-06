// src/utils/gameUtils.ts
// 游戏逻辑工具函数

import type { BaccaratBetType } from '@/stores/bettingStore'

// 🎯 游戏状态类型
export type GameStatus = 'betting' | 'dealing' | 'waiting' | 'settling' | 'maintenance'

// 🎯 游戏阶段类型
export type GamePhase = 'betting' | 'dealing' | 'result' | 'waiting'

// 🎯 游戏结果数据接口
export interface GameResultData {
  data?: {
    result_info?: {
      pai_flash?: number[]
    }
  }
  pai_flash?: number[]
  // 其他游戏结果字段...
}

// 🎯 中奖信息接口
export interface WinResultData {
  data?: {
    win_amount?: number
    amount?: number
    total_win?: number
  }
  win_amount?: number
  amount?: number
  total_win?: number
}

// 🎯 闪烁效果配置
export interface BlinkConfig {
  duration: number        // 闪烁持续时间（毫秒）
  interval: number        // 闪烁间隔（毫秒）
  iterations: number      // 闪烁次数
}

// 🎯 默认闪烁配置
export const DEFAULT_BLINK_CONFIG: BlinkConfig = {
  duration: 3000,
  interval: 300,
  iterations: 6
}

/**
 * 解析开牌结果中的闪烁区域
 */
export function parseFlashAreas(gameResult: GameResultData): number[] {
  try {
    // 解析 pai_flash 数组 - 多种可能的数据结构
    const paiFlash = gameResult?.data?.result_info?.pai_flash ||
                    gameResult?.pai_flash ||
                    []

    if (Array.isArray(paiFlash)) {
      return paiFlash.filter(id => typeof id === 'number' && id > 0)
    }

    return []
  } catch (error) {
    console.error('❌ 解析闪烁区域失败:', error)
    return []
  }
}

/**
 * 解析中奖金额
 */
export function parseWinAmount(winResult: WinResultData): number {
  try {
    // 多种可能的金额字段
    const amount = winResult?.data?.win_amount ??
                  winResult?.data?.amount ??
                  winResult?.win_amount ??
                  winResult?.amount ??
                  0

    return typeof amount === 'number' ? amount : 0
  } catch (error) {
    console.error('❌ 解析中奖金额失败:', error)
    return 0
  }
}

/**
 * 解析总中奖金额
 */
export function parseTotalWinAmount(winResult: WinResultData): number {
  try {
    const totalWin = winResult?.data?.total_win ??
                    winResult?.total_win ??
                    0

    return typeof totalWin === 'number' ? totalWin : 0
  } catch (error) {
    console.error('❌ 解析总中奖金额失败:', error)
    return 0
  }
}

/**
 * 根据赔率ID查找对应的投注区域
 */
export function mapRateIdToBetType(rateId: number): BaccaratBetType | null {
  // 赔率ID到投注类型的映射表
  const rateIdMap: Record<number, BaccaratBetType> = {
    8: 'banker',        // 庄
    6: 'player',        // 闲
    7: 'tie',           // 和
    4: 'banker-pair',   // 庄对
    2: 'player-pair',   // 闲对
    3: 'lucky-6',       // 幸运6
    9: 'dragon-7',      // 龙7
    10: 'panda-8'       // 熊8
  }

  return rateIdMap[rateId] || null
}

/**
 * 根据赔率ID数组获取投注区域数组
 */
export function mapRateIdsToBetTypes(rateIds: number[]): BaccaratBetType[] {
  return rateIds
    .map(rateId => mapRateIdToBetType(rateId))
    .filter(betType => betType !== null) as BaccaratBetType[]
}

/**
 * 验证游戏状态是否允许投注
 */
export function canPlaceBet(gameStatus: GameStatus): boolean {
  return gameStatus === 'betting'
}

/**
 * 验证游戏状态是否在开牌阶段
 */
export function isDealing(gameStatus: GameStatus): boolean {
  return gameStatus === 'dealing'
}

/**
 * 验证游戏状态是否在等待阶段
 */
export function isWaiting(gameStatus: GameStatus): boolean {
  return gameStatus === 'waiting'
}

/**
 * 格式化游戏状态为中文显示
 */
export function formatGameStatus(status: GameStatus): string {
  const statusMap: Record<GameStatus, string> = {
    'betting': '投注中',
    'dealing': '开牌中',
    'waiting': '等待中',
    'settling': '结算中',
    'maintenance': '维护中'
  }
  return statusMap[status] || status
}

// 🔥 删除：shouldAutoSubmitBet 函数已移除

/**
 * 判断倒计时是否刚开始（用于重置状态）
 */
export function isCountdownStarting(countdown: number, previousCountdown: number): boolean {
  return countdown > previousCountdown && countdown > 10
}

/**
 * 判断倒计时是否结束
 */
export function isCountdownEnded(countdown: number): boolean {
  return countdown <= 0
}

/**
 * 计算倒计时百分比（用于进度条显示）
 */
export function calculateCountdownPercentage(countdown: number, totalTime: number = 30): number {
  if (totalTime <= 0) return 0
  const percentage = (countdown / totalTime) * 100
  return Math.max(0, Math.min(100, percentage))
}

/**
 * 格式化倒计时显示
 */
export function formatCountdown(countdown: number): string {
  if (countdown <= 0) return '00:00'

  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

/**
 * 创建清场事件
 */
export function createClearBettingEvent(detail?: any): void {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('game:clearBetting', {
      detail: detail || { timestamp: Date.now() }
    })
    window.dispatchEvent(event)
    console.log('🎮 发送清场事件:', detail)
  }
}

/**
 * 监听清场事件
 */
export function addClearBettingListener(callback: (event: CustomEvent) => void): () => void {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handler = (event: Event) => {
    callback(event as CustomEvent)
  }

  window.addEventListener('game:clearBetting', handler)

  // 返回清理函数
  return () => {
    window.removeEventListener('game:clearBetting', handler)
  }
}

/**
 * 检查是否需要重置铺状态
 */
export function shouldResetRoundState(
  currentGameNumber: string,
  lastProcessedGameNumber: string
): boolean {
  return currentGameNumber !== lastProcessedGameNumber && currentGameNumber.length > 0
}

/**
 * 提取局号中的铺号
 */
export function extractDealNumber(gameNumber: string): string {
  try {
    // 格式：T01250706001002
    // 最后3位是铺号
    if (gameNumber.length >= 3) {
      return gameNumber.slice(-3)
    }
    return '001'
  } catch (error) {
    console.error('❌ 提取铺号失败:', error)
    return '001'
  }
}

/**
 * 提取局号中的靴号
 */
export function extractShoeNumber(gameNumber: string): string {
  try {
    // 格式：T01250706001002
    // 倒数第4-6位是靴号
    if (gameNumber.length >= 6) {
      return gameNumber.slice(-6, -3)
    }
    return '001'
  } catch (error) {
    console.error('❌ 提取靴号失败:', error)
    return '001'
  }
}

/**
 * 提取局号中的台桌ID
 */
export function extractTableId(gameNumber: string): string {
  try {
    // 格式：T01250706001002
    // 第2-3位是台桌ID
    if (gameNumber.length >= 3) {
      return gameNumber.slice(1, 3)
    }
    return '01'
  } catch (error) {
    console.error('❌ 提取台桌ID失败:', error)
    return '01'
  }
}

/**
 * 验证局号格式
 */
export function validateGameNumber(gameNumber: string): boolean {
  try {
    // 格式：T + tableId(2位) + 日期(6位YYMMDD) + 靴号(3位) + 铺号(3位) = 总共14位
    const pattern = /^T\d{13}$/
    return pattern.test(gameNumber)
  } catch (error) {
    console.error('❌ 验证局号格式失败:', error)
    return false
  }
}

/**
 * 创建投注历史记录
 */
export function createBetHistoryStep(
  betType: BaccaratBetType,
  amount: number,
  action: 'add' | 'remove'
): {
  betType: BaccaratBetType
  amount: number
  action: 'add' | 'remove'
  timestamp: number
} {
  return {
    betType,
    amount,
    action,
    timestamp: Date.now()
  }
}

/**
 * 延迟执行函数
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null

  return (...args: Parameters<T>) => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0

  return (...args: Parameters<T>) => {
    const now = Date.now()

    if (now - lastTime >= wait) {
      lastTime = now
      func(...args)
    }
  }
}
