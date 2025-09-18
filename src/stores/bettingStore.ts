// src/stores/bettingStore.ts
/**
 * @fileoverview 百家乐投注管理 Store
 * @description 使用 Pinia 组合式 API 管理投注状态、筹码选择、投注确认、模拟投注等功能
 * @version 2.0.0 - 支持两阶段确认、模拟投注、智能筹码推荐
 */

import { defineStore } from 'pinia'
import { ref, computed, reactive, nextTick, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// ========================= 工具函数导入 =========================

// 投注相关工具
import {
  BET_ZONE_CONFIGS,
  type BetLimits,
  type BetResult,
  type BetHistoryStep,
  updateBetLimitsFromTableInfo,
  calculateBetAmount,
  buildBetApiData,
  getBetZoneDisplayName,
  hasValidBets,
  calculateTotalBetAmount,
  clearBetsData,
  copyBetsData
} from '@/utils/bettingUtils'

// 筹码相关工具
import {
  CHIP_IMAGE_MAP,
  AVAILABLE_CHIPS,
  DEFAULT_DISPLAY_CHIPS,
  type ChipData,
  getChipImages,
  getRecommendedChips,
  isValidChipValue,
  getClosestChipValue,
  getChipDataByValue,
  updateDisplayChips as updateDisplayChipsUtil
} from '@/utils/chipUtils'

// 游戏相关工具
import {
  type GameStatus,
  type GameResultData,
  parseFlashAreas,
  mapRateIdsToBetTypes,
  canPlaceBet,
  addClearBettingListener
} from '@/utils/gameUtils'

// 验证工具
import {
  ensureNumber,
} from '@/utils/validationUtils'

// 模拟投注工具
import {
  startSimulation,
  stopSimulation,
  resetSimulatedData,
  createEmptySimulatedData,
  updateSimulationConfig,
  getSimulationStatus,
  cleanupSimulation,
  type SimulatedPlayerData
} from '@/utils/simulationUtils'

// ========================= 类型定义 =========================

/**
 * 百家乐投注类型
 * @type {string}
 * @description 定义所有支持的投注类型
 */
export type BaccaratBetType =
  | 'banker'        // 庄
  | 'player'        // 闲
  | 'tie'           // 和
  | 'banker-pair'   // 庄对
  | 'player-pair'   // 闲对
  | 'lucky-6'       // 幸运6
  | 'dragon-7'      // 龙7
  | 'panda-8'       // 熊猫8

/**
 * 筹码信息接口
 * @interface ChipInfo
 * @description 定义筹码的完整信息
 */
export interface ChipInfo {
  /** 筹码面值 */
  value: number
  /** 筹码颜色 */
  color: string
  /** 筹码显示名称 */
  name: string
}

/**
 * 确认投注结果接口
 * @interface ConfirmBetResult
 * @description 投注确认后的返回结果
 */
export interface ConfirmBetResult {
  /** 是否成功 */
  success: boolean
  /** 结果消息 */
  message: string
  /** 新的余额（可选） */
  newBalance?: number
}

// ========================= Store 定义 =========================

/**
 * 投注管理 Store
 * @description 管理百家乐游戏的所有投注相关逻辑
 */
export const useBettingStore = defineStore('betting', () => {

  // ========================= 基础状态 =========================

  /**
   * 选中的筹码面值
   * @type {Ref<number>}
   * @default 100
   */
  const selectedChipRef = ref(100)

  /**
   * 是否免佣模式
   * @type {Ref<boolean>}
   * @default false
   * @description 影响庄家投注的赔率计算
   */
  const isCommissionFree = ref(false)

  /**
   * 筹码颜色映射表
   * @const
   * @type {Record<number, string>}
   * @description 每个筹码面值对应的颜色
   */
  const chipColorMap: Record<number, string> = {
    1: '#595959',     // 灰色
    2: '#ff82d6',     // 粉色
    5: '#ce1d00',     // 红色
    25: '#05ae29',    // 绿色
    100: '#1a1a1a',   // 黑色
    500: '#8548b0',   // 紫色
    1000: '#de9807',  // 金色
    5000: '#de7571'   // 橙红色
  }

  // ========================= 投注数据状态 =========================

  /**
   * 当前投注数据
   * @type {Reactive<Record<BaccaratBetType, number>>}
   * @description 记录每个投注区域的金额
   */
  const currentBets = reactive<Record<BaccaratBetType, number>>(clearBetsData())

  /**
   * 已确认投注数据
   * @type {Reactive<Record<BaccaratBetType, number>>}
   * @description 已提交到服务器的投注
   */
  const confirmedBets = reactive<Record<BaccaratBetType, number>>(clearBetsData())

  /**
   * 是否已提交投注
   * @type {Ref<boolean>}
   * @default false
   * @description 防止重复提交
   */
  const hasSubmittedBets = ref(false)

  /**
   * 投注历史记录
   * @type {Ref<BetHistoryStep[]>}
   * @description 用于支持撤销功能
   */
  const betHistory = ref<BetHistoryStep[]>([])

  /**
   * 上一局投注数据
   * @type {Reactive<Record<BaccaratBetType, number>>}
   * @description 用于重复投注功能
   */
  const lastBets = reactive<Record<BaccaratBetType, number>>(clearBetsData())

  /**
   * 模拟玩家投注数据
   * @type {Reactive<Record<BaccaratBetType, SimulatedPlayerData>>}
   * @description 显示其他玩家的投注情况
   */
  const simulatedData = reactive<Record<BaccaratBetType, SimulatedPlayerData>>(
    createEmptySimulatedData()
  )

  // ========================= 限红配置 =========================

  /**
   * 投注限额配置
   * @type {Ref<BetLimits>}
   * @description 每个投注类型的最小和最大限额
   */
  const betLimits = ref<BetLimits>({
    'banker': { min: 10, max: 50000 },
    'player': { min: 10, max: 50000 },
    'tie': { min: 10, max: 10000 },
    'banker-pair': { min: 10, max: 5000 },
    'player-pair': { min: 10, max: 5000 },
    'lucky-6': { min: 10, max: 3000 },
    'dragon-7': { min: 10, max: 1000 },
    'panda-8': { min: 10, max: 2000 }
  })

  // ========================= 筹码状态 =========================

  /**
   * 显示的筹码列表
   * @type {Ref<ChipData[]>}
   * @description 当前显示给用户选择的筹码
   */
  const displayChips = ref<ChipData[]>([...DEFAULT_DISPLAY_CHIPS])

  /**
   * 可用筹码列表
   * @type {Ref<ChipData[]>}
   * @description 系统支持的所有筹码面值
   */
  const availableChips = ref<ChipData[]>(AVAILABLE_CHIPS)

  // ========================= 效果管理 =========================

  /**
   * 闪烁区域集合
   * @type {Ref<Set<BaccaratBetType>>}
   * @description 记录正在闪烁的投注区域
   */
  const blinkingZones = ref<Set<BaccaratBetType>>(new Set())

  /**
   * 清场事件监听器清理函数
   * @type {(() => void) | null}
   */
  let clearEventCleanup: (() => void) | null = null

  // ========================= GameStore 访问 =========================

  /**
   * 安全获取 GameStore 实例
   * @returns {ReturnType<typeof useGameStore> | null}
   * @description 防止循环依赖错误
   */
  const getGameStore = () => {
    try {
      return useGameStore()
    } catch (error) {
      console.error('❌ 获取 GameStore 失败:', error)
      return null
    }
  }

  // ========================= 计算属性 - 筹码相关 =========================

  /**
   * 选中的筹码值
   * @computed
   * @description 确保筹码值有效，无效时自动修正
   */
  const selectedChip = computed({
    get: () => selectedChipRef.value,
    set: (value: number) => {
      selectedChipRef.value = isValidChipValue(value) ? value : getClosestChipValue(value)
    }
  })

  /**
   * 选中筹码的颜色
   * @computed
   * @returns {string} 筹码颜色代码
   */
  const selectedChipColor = computed(() => {
    return chipColorMap[selectedChipRef.value] || '#1a1a1a'
  })

  /**
   * 选中筹码的完整信息
   * @computed
   * @returns {ChipInfo} 筹码信息对象
   */
  const selectedChipInfo = computed((): ChipInfo => {
    return {
      value: selectedChipRef.value,
      color: selectedChipColor.value,
      name: `€${selectedChipRef.value}`
    }
  })

  // ========================= 计算属性 - GameStore 数据 =========================

  /**
   * 游戏阶段
   * @computed
   * @returns {GameStatus} 当前游戏状态
   * @description 安全地从 GameStore 读取游戏状态
   */
  const gamePhase = computed(() => {
    try {
      const gameStore = getGameStore()
      return gameStore?.gameStatus ?? 'betting'
    } catch (error) {
      console.error('❌ 获取游戏状态失败:', error)
      return 'betting'
    }
  })

  /**
   * 用户余额
   * @computed
   * @returns {number} 当前余额
   * @description 安全地从 GameStore 读取余额
   */
  const balance = computed(() => {
    try {
      const gameStore = getGameStore()
      return ensureNumber(gameStore?.balance, 0)
    } catch (error) {
      console.error('❌ 获取余额失败:', error)
      return 0
    }
  })

  /**
   * 倒计时
   * @computed
   * @returns {number} 剩余秒数
   * @description 安全地从 GameStore 读取倒计时
   */
  const countdown = computed(() => {
    try {
      const gameStore = getGameStore()
      return ensureNumber(gameStore?.countdown, 0)
    } catch (error) {
      console.error('❌ 获取倒计时失败:', error)
      return 0
    }
  })

  /**
   * 开牌结果
   * @computed
   * @returns {any} 游戏结果数据
   * @description 安全地从 GameStore 读取开牌结果
   */
  const gameResult = computed(() => {
    try {
      const gameStore = getGameStore()
      return gameStore?.gameResult ?? null
    } catch (error) {
      console.error('❌ 获取开牌结果失败:', error)
      return null
    }
  })

  // ========================= 计算属性 - 投注金额 =========================

  /**
   * 总投注金额
   * @computed
   * @returns {number} 所有投注区域的总金额
   */
  const totalBetAmount = computed(() => {
    try {
      return calculateTotalBetAmount(currentBets)
    } catch (error) {
      console.error('❌ 计算总投注金额失败:', error)
      return 0
    }
  })

  /**
   * 已确认投注总额
   * @computed
   * @returns {number} 已提交的投注总金额
   */
  const totalConfirmedAmount = computed(() => {
    try {
      return calculateTotalBetAmount(confirmedBets)
    } catch (error) {
      console.error('❌ 计算已确认投注金额失败:', error)
      return 0
    }
  })

  /**
   * 待确认投注金额
   * @computed
   * @returns {number} 未提交的投注金额
   */
  const totalPendingAmount = computed(() => {
    try {
      return totalBetAmount.value - totalConfirmedAmount.value
    } catch (error) {
      console.error('❌ 计算待确认投注金额失败:', error)
      return 0
    }
  })

  // ========================= 计算属性 - 状态判断 =========================

  /**
   * 是否可以确认投注
   * @computed
   * @returns {boolean}
   */
  const canConfirm = computed(() => {
    return totalPendingAmount.value > 0 && canPlaceBet(gamePhase.value as GameStatus)
  })

  /**
   * 是否可以取消投注
   * @computed
   * @returns {boolean}
   */
  const canCancel = computed(() => {
    return totalBetAmount.value > 0
  })

  /**
   * 是否有活跃投注
   * @computed
   * @returns {boolean}
   */
  const hasActiveBets = computed(() => {
    return hasValidBets(currentBets)
  })

  /**
   * 是否有上局数据
   * @computed
   * @returns {boolean}
   */
  const hasLastRoundData = computed(() => {
    try {
      return hasValidBets(lastBets)
    } catch (error) {
      console.error('❌ 检查上局数据失败:', error)
      return false
    }
  })

  /**
   * 获取显示筹码数据
   * @computed
   * @returns {ChipData[]}
   */
  const getDisplayChipsData = computed(() => {
    return displayChips.value
  })

  // ========================= 监听器 - 倒计时 =========================

  /**
   * 监听倒计时变化，控制模拟投注
   * @watch countdown
   */
  watch(countdown, (newCountdown, oldCountdown) => {
    try {
      // 倒计时开始
      if (newCountdown > 0 && oldCountdown === 0) {
        console.log('🎮 倒计时开始，启动模拟投注')
        startSimulation(simulatedData, {
          intervalMs: 1500,
          playerCountRange: [1, 3],
          baseAmountRange: [10, 500]
        })
      }
      // 倒计时结束
      else if (newCountdown === 0 && oldCountdown > 0) {
        console.log('⏰ 倒计时结束，停止模拟投注')
        stopSimulation()
      }
    } catch (error) {
      console.error('❌ 处理倒计时变化失败:', error)
    }
  }, { immediate: false })

  // ========================= 监听器 - 开牌结果 =========================

  /**
   * 监听开牌结果，处理闪烁效果
   * @watch gameResult
   */
  watch(gameResult, (newResult) => {
    try {
      if (!newResult) {
        return
      }

      console.log('🎰 收到开牌结果，处理闪烁效果:', newResult)

      // 解析需要闪烁的区域
      const flashRateIds = parseFlashAreas(newResult as GameResultData)

      if (flashRateIds.length > 0) {
        console.log('✨ 开始闪烁效果，赔率ID:', flashRateIds)
        const flashZones = mapRateIdsToBetTypes(flashRateIds)
        handleFlashEffect(flashZones)
      } else {
        console.log('⚠️ 没有需要闪烁的区域')
      }

    } catch (error) {
      console.error('❌ 处理开牌结果闪烁失败:', error)
    }
  })

  // ========================= 清场相关方法 =========================

  /**
   * 处理清场操作
   * @description 清空当前投注，保存到上局数据
   */
  const handleClearBetting = (): void => {
    try {
      console.log('🧹 执行投注数据清场')

      // 保存当前投注到上局数据
      Object.assign(lastBets, copyBetsData(currentBets))

      // 清空当前数据
      betHistory.value = []
      Object.assign(currentBets, clearBetsData())
      Object.assign(confirmedBets, clearBetsData())
      hasSubmittedBets.value = false

      // 重置模拟数据
      resetSimulatedData()

      // 停止所有效果
      stopAllBlinking()

      console.log('✅ 投注数据清场完成')
    } catch (error) {
      console.error('❌ 清场失败:', error)
    }
  }

  /**
   * 设置清场事件监听
   * @description 监听来自 GameStore 的清场事件
   */
  const setupClearEventListener = (): void => {
    try {
      clearEventCleanup = addClearBettingListener((event) => {
        console.log('🎮 收到清场事件:', event.detail)
        handleClearBetting()
      })
      console.log('✅ 清场事件监听器已设置')
    } catch (error) {
      console.error('❌ 设置清场事件监听失败:', error)
    }
  }

  /**
   * 移除清场事件监听
   */
  const removeClearEventListener = (): void => {
    try {
      if (clearEventCleanup) {
        clearEventCleanup()
        clearEventCleanup = null
        console.log('✅ 清场事件监听器已移除')
      }
    } catch (error) {
      console.error('❌ 移除清场事件监听失败:', error)
    }
  }

  // ========================= 投注确认方法 =========================

  /**
   * 确认投注
   * @async
   * @returns {Promise<ConfirmBetResult>} 投注结果
   * @description 将投注提交到服务器
   */
  const confirmBets = async (): Promise<ConfirmBetResult> => {
    try {
      console.log('📤 开始确认投注')

      // 检查是否可以确认
      if (!canConfirm.value) {
        return { success: false, message: '没有待确认的投注' }
      }

      // 获取 GameStore
      const gameStore = getGameStore()
      if (!gameStore) {
        return { success: false, message: 'GameStore 未初始化' }
      }

      // 构建投注数据
      const betsToSubmit = buildBetApiData(currentBets, isCommissionFree.value)

      if (betsToSubmit.length === 0) {
        return { success: false, message: '没有有效的投注数据' }
      }

      console.log('📤 发送投注订单:', {
        bets: betsToSubmit,
        totalAmount: totalBetAmount.value,
        pendingAmount: totalPendingAmount.value,
        gameNumber: gameStore.gameNumber
      })

      // 调用 API 提交投注
      const { getGlobalApiService } = await import('@/services/gameApi')
      const apiService = getGlobalApiService()

      const is_exempt = isCommissionFree.value ? 1 : 0
      const result = await apiService.orderBets(betsToSubmit, is_exempt)

      console.log('✅ 投注订单发送成功:', result)

      // 更新确认状态
      Object.assign(confirmedBets, copyBetsData(currentBets))
      hasSubmittedBets.value = true

      // 更新余额
      if (result.money_balance !== undefined) {
        gameStore.updateBalance(result.money_balance)
        console.log('💰 余额已更新:', result.money_balance)
      }

      return {
        success: true,
        message: '投注成功',
        newBalance: result.money_balance
      }

    } catch (error) {
      console.error('❌ 确认投注失败:', error)
      return {
        success: false,
        message: `投注失败: ${error instanceof Error ? error.message : '网络错误'}`
      }
    }
  }

  /**
   * 取消投注
   * @description 根据状态执行清空或回退操作
   */
  const cancelBets = (): void => {
    try {
      console.log('🚫 执行取消投注')

      if (!hasSubmittedBets.value) {
        // 清空模式：没有已提交投注，清空所有
        console.log('🧹 清空模式：没有已提交投注，清空所有')
        Object.assign(currentBets, clearBetsData())
        Object.assign(confirmedBets, clearBetsData())
        betHistory.value = []
      } else {
        // 回退模式：回退到已确认投注状态
        console.log('↩️ 回退模式：回退到已确认投注状态')
        Object.assign(currentBets, copyBetsData(confirmedBets))
        betHistory.value = []
      }

      console.log('✅ 取消投注完成', {
        hasSubmittedBets: hasSubmittedBets.value,
        currentTotal: totalBetAmount.value,
        confirmedTotal: totalConfirmedAmount.value
      })

    } catch (error) {
      console.error('❌ 取消投注失败:', error)
    }
  }

  // ========================= 闪烁效果方法 =========================

  /**
   * 处理闪烁效果
   * @param {BaccaratBetType[]} flashZones - 需要闪烁的区域
   * @description 显示中奖区域的闪烁提示
   */
  const handleFlashEffect = (flashZones: BaccaratBetType[]): void => {
    try {
      // 先停止所有闪烁
      stopAllBlinking()

      if (flashZones.length === 0) {
        console.log('⚠️ 没有需要闪烁的区域')
        return
      }

      // 开始闪烁
      flashZones.forEach(betType => {
        startBlinking(betType)
        console.log(`✨ 开始闪烁: ${getBetZoneDisplayName(betType)}`)
      })

      // 3秒后停止闪烁
      setTimeout(() => {
        flashZones.forEach(betType => {
          stopBlinking(betType)
        })
        console.log('✨ 闪烁效果结束')
      }, 3000)

    } catch (error) {
      console.error('❌ 处理闪烁效果失败:', error)
    }
  }

  /**
   * 开始闪烁
   * @param {BaccaratBetType} zoneId - 投注区域ID
   */
  const startBlinking = (zoneId: BaccaratBetType): void => {
    try {
      blinkingZones.value.add(zoneId)
      console.log(`✨ 开始闪烁: ${getBetZoneDisplayName(zoneId)}`)
    } catch (error) {
      console.error('❌ 启动闪烁效果失败:', error)
    }
  }

  /**
   * 停止闪烁
   * @param {BaccaratBetType} zoneId - 投注区域ID
   */
  const stopBlinking = (zoneId: BaccaratBetType): void => {
    try {
      blinkingZones.value.delete(zoneId)
      console.log(`ℹ️ 停止闪烁: ${getBetZoneDisplayName(zoneId)}`)
    } catch (error) {
      console.error('❌ 停止闪烁效果失败:', error)
    }
  }

  /**
   * 停止所有闪烁
   */
  const stopAllBlinking = (): void => {
    try {
      blinkingZones.value.clear()
      console.log('ℹ️ 停止所有闪烁效果')
    } catch (error) {
      console.error('❌ 停止所有闪烁效果失败:', error)
    }
  }

  /**
   * 检查区域是否在闪烁
   * @param {BaccaratBetType} zoneId - 投注区域ID
   * @returns {boolean}
   */
  const isZoneBlinking = (zoneId: BaccaratBetType): boolean => {
    try {
      return blinkingZones.value.has(zoneId)
    } catch (error) {
      console.error('❌ 检查闪烁状态失败:', error)
      return false
    }
  }

  // ========================= 投注操作方法 =========================

  /**
   * 计算投注金额（安全版本）
   * @param {BaccaratBetType} betType - 投注类型
   * @param {number} selectedAmount - 选择的金额
   * @returns {BetResult} 计算结果
   */
  const calculateBetAmountSafe = (betType: BaccaratBetType, selectedAmount: number): BetResult => {
    try {
      const currentBetAmount = ensureNumber(currentBets[betType], 0)
      const currentBalance = balance.value

      return calculateBetAmount(
        betType,
        selectedAmount,
        currentBetAmount,
        betLimits.value,
        currentBalance
      )
    } catch (error) {
      console.error('❌ 计算投注金额失败:', error)
      return { success: false, message: '投注计算错误' }
    }
  }

  /**
   * 执行投注
   * @param {BaccaratBetType} betType - 投注类型
   * @param {number} [amount] - 投注金额（可选，默认使用选中筹码）
   * @returns {BetResult} 投注结果
   */
  const placeBet = (betType: BaccaratBetType, amount?: number): BetResult => {
    try {
      // 检查游戏状态
      const currentPhase = gamePhase.value as GameStatus
      if (!canPlaceBet(currentPhase)) {
        return { success: false, message: '当前不在投注阶段' }
      }

      // 确定投注金额
      const actualAmount = amount || selectedChipRef.value

      // 计算最终金额
      const result = calculateBetAmountSafe(betType, actualAmount)

      if (!result.success) {
        return result
      }

      const finalAmount = result.amount!

      // 更新投注数据
      currentBets[betType] += finalAmount

      // 记录历史
      betHistory.value.push({
        betType,
        amount: finalAmount,
        action: 'add',
        timestamp: Date.now()
      })

      console.log(`💰 投注成功: ${betType} +${finalAmount} (总计: ${currentBets[betType]})`)

      return result
    } catch (error) {
      console.error('❌ 投注失败:', error)
      return { success: false, message: '投注系统错误' }
    }
  }

  /**
   * 撤销最后一步投注
   * @returns {boolean} 是否成功撤销
   */
  const undoLastBet = (): boolean => {
    try {
      if (betHistory.value.length === 0) {
        return false
      }

      // 获取最后一步操作
      const lastStep = betHistory.value.pop()!
      const { betType, amount, action } = lastStep

      // 执行反向操作
      if (action === 'add') {
        currentBets[betType] = Math.max(0, currentBets[betType] - amount)
      } else {
        currentBets[betType] += amount
      }

      console.log(`↩️ 撤销操作: ${betType} ${action} ${amount}`)
      return true
    } catch (error) {
      console.error('❌ 撤销投注失败:', error)
      return false
    }
  }

  /**
   * 重复上局投注
   * @returns {boolean} 是否成功重复
   */
  const repeatLastBets = (): boolean => {
    try {
      // 检查是否有上局数据
      if (!hasLastRoundData.value) {
        return false
      }

      // 清空当前投注
      clearAllBets()

      // 重复上局投注
      let hasSuccess = false
      Object.entries(lastBets).forEach(([betType, amount]) => {
        if (amount > 0) {
          const result = placeBet(betType as BaccaratBetType, amount)
          if (result.success) {
            hasSuccess = true
          }
        }
      })

      return hasSuccess
    } catch (error) {
      console.error('❌ 重复投注失败:', error)
      return false
    }
  }

  /**
   * 清空所有投注
   */
  const clearAllBets = (): void => {
    try {
      Object.assign(currentBets, clearBetsData())
      Object.assign(confirmedBets, clearBetsData())
      hasSubmittedBets.value = false
      betHistory.value = []
    } catch (error) {
      console.error('❌ 清空投注失败:', error)
    }
  }

  /**
   * 保存当前投注为上局数据
   */
  const saveCurrentAsLastBets = (): void => {
    try {
      Object.assign(lastBets, copyBetsData(currentBets))
    } catch (error) {
      console.error('❌ 保存投注数据失败:', error)
    }
  }

  // ========================= 筹码管理方法 =========================

  /**
   * 更新显示筹码
   * @param {ChipData[]} chips - 新的筹码列表
   * @description 使用 nextTick 确保 DOM 更新
   */
  const updateDisplayChips = (chips: ChipData[]): void => {
    try {
      const updatedChips = updateDisplayChipsUtil(chips)

      // 使用 nextTick 确保 DOM 更新
      displayChips.value = []
      nextTick(() => {
        displayChips.value = updatedChips
        selectedChipRef.value = updatedChips[0].value

        nextTick(() => {
          console.log(`✅ 筹码更新完成: 选中=${selectedChipRef.value}, 显示=[${updatedChips.map(c => c.value).join(',')}]`)
        })
      })
    } catch (error) {
      console.error('❌ 更新显示筹码失败:', error)
    }
  }

  /**
   * 根据余额智能推荐筹码
   * @param {number} [currentBalance] - 当前余额
   * @description 根据余额自动推荐合适的筹码组合
   */
  const updateDisplayChipsByBalance = (currentBalance?: number): void => {
    try {
      const targetBalance = currentBalance ?? balance.value
      const recommendedChips = getRecommendedChips(targetBalance)

      if (recommendedChips.length >= 3) {
        updateDisplayChips(recommendedChips.slice(0, 3))
      } else {
        updateDisplayChips([...DEFAULT_DISPLAY_CHIPS])
      }
    } catch (error) {
      console.error('❌ 智能推荐筹码失败:', error)
      updateDisplayChips([...DEFAULT_DISPLAY_CHIPS])
    }
  }

  /**
   * 选择筹码
   * @param {number} amount - 筹码面值
   */
  const selectChip = (amount: number): void => {
    try {
      const chipData = getChipDataByValue(amount)
      const isValidChip = chipData && displayChips.value.some(chip => chip.value === amount)

      if (isValidChip) {
        selectedChipRef.value = amount
        console.log(`✅ 选择筹码: ${amount}`)
      } else {
        // 使用默认筹码
        if (displayChips.value.length > 0) {
          selectedChipRef.value = displayChips.value[0].value
        } else {
          selectedChipRef.value = 100
        }
        console.log(`⚠️ 无效筹码值，使用默认值: ${selectedChipRef.value}`)
      }
    } catch (error) {
      console.error('❌ 选择筹码失败:', error)
    }
  }

  /**
   * 切换免佣状态
   */
  const toggleCommissionFree = (): void => {
    try {
      isCommissionFree.value = !isCommissionFree.value
    } catch (error) {
      console.error('❌ 切换免佣状态失败:', error)
    }
  }

  // ========================= 工具方法 =========================

  /**
   * 更新限红配置
   * @param {any} tableInfo - 台桌信息
   */
  const updateBetLimits = (tableInfo: any): void => {
    try {
      betLimits.value = updateBetLimitsFromTableInfo(tableInfo)
    } catch (error) {
      console.error('❌ 更新限红配置失败:', error)
    }
  }

  /**
   * 获取投注区域显示数据
   * @param {BaccaratBetType} betType - 投注类型
   * @returns {Object} 显示数据
   */
  const getBetZoneDisplayData = (betType: BaccaratBetType) => {
    try {
      const userAmount = ensureNumber(currentBets[betType], 0)
      const simulated = simulatedData[betType]

      return {
        userAmount,
        otherPlayerCount: simulated.playerCount,
        otherTotalAmount: simulated.totalAmount,
        chipImages: getChipImages(userAmount)
      }
    } catch (error) {
      console.error('❌ 获取投注区域显示数据失败:', error)
      return {
        otherPlayerCount: 0,
        otherTotalAmount: 0,
        userAmount: 0,
        chipImages: []
      }
    }
  }

  /**
   * 格式化金额
   * @param {number | undefined | null} amount - 金额
   * @returns {string} 格式化后的金额字符串
   */
  const formatAmount = (amount: number | undefined | null): string => {
    try {
      const validAmount = ensureNumber(amount, 0)
      return validAmount.toString()
    } catch (error) {
      console.error('❌ 格式化金额失败:', error)
      return '0'
    }
  }

  // ========================= 模拟投注控制方法 =========================

  /**
   * 手动启动模拟投注
   * @param {any} [config] - 配置参数
   */
  const startBettingSimulation = (config?: any): void => {
    try {
      console.log('🎮 手动启动模拟投注')
      startSimulation(simulatedData, config)
    } catch (error) {
      console.error('❌ 启动模拟投注失败:', error)
    }
  }

  /**
   * 手动停止模拟投注
   */
  const stopBettingSimulation = (): void => {
    try {
      console.log('ℹ️ 手动停止模拟投注')
      stopSimulation()
    } catch (error) {
      console.error('❌ 停止模拟投注失败:', error)
    }
  }

  /**
   * 重置模拟投注数据
   */
  const resetBettingSimulation = (): void => {
    try {
      console.log('🔄 重置模拟投注数据')
      resetSimulatedData()
    } catch (error) {
      console.error('❌ 重置模拟投注失败:', error)
    }
  }

  /**
   * 获取模拟状态信息
   * @returns {Object} 模拟状态
   */
  const getSimulationStatusInfo = () => {
    try {
      return getSimulationStatus()
    } catch (error) {
      console.error('❌ 获取模拟状态失败:', error)
      return { isRunning: false, config: null, timer: null }
    }
  }

  /**
   * 更新模拟配置
   * @param {any} config - 新配置
   */
  const updateSimulationConfiguration = (config: any): void => {
    try {
      console.log('⚙️ 更新模拟配置:', config)
      updateSimulationConfig(config)
    } catch (error) {
      console.error('❌ 更新模拟配置失败:', error)
    }
  }

  // ========================= 生命周期方法 =========================

  /**
   * 初始化 Store
   * @description 重置所有状态并设置监听器
   */
  const init = (): void => {
    try {
      console.log('🎰 投注 Store 初始化')

      // 重置筹码状态
      selectedChipRef.value = 100
      isCommissionFree.value = false
      displayChips.value = [...DEFAULT_DISPLAY_CHIPS]

      // 清空投注数据
      clearAllBets()
      Object.assign(lastBets, clearBetsData())
      Object.assign(simulatedData, createEmptySimulatedData())

      // 停止效果
      stopAllBlinking()

      // 设置监听器
      setupClearEventListener()

      console.log('✅ 投注 Store 初始化完成')
    } catch (error) {
      console.error('❌ 投注 Store 初始化失败:', error)
    }
  }

  /**
   * 清理 Store
   * @description 移除监听器并清理资源
   */
  const cleanup = (): void => {
    try {
      console.log('🧹 投注 Store 清理')

      // 移除监听器
      removeClearEventListener()

      // 清理模拟
      cleanupSimulation()

      // 停止效果
      stopAllBlinking()

      console.log('✅ 投注 Store 清理完成')
    } catch (error) {
      console.error('❌ 投注 Store 清理失败:', error)
    }
  }

  /**
   * 清场（简化方法）
   * @description 执行清场操作的快捷方法
   */
  const clearRound = (): void => {
    handleClearBetting()
  }

  // ========================= 导出 =========================

  return {
    // --------------- 状态 ---------------
    /** 选中的筹码值 */
    selectedChip,

    /** 选中筹码的颜色 */
    selectedChipColor,

    /** 选中筹码的完整信息 */
    selectedChipInfo,

    /** 是否免佣模式 */
    isCommissionFree,

    /** 当前投注数据 */
    currentBets,

    /** 投注历史记录 */
    betHistory,

    /** 上一局投注数据 */
    lastBets,

    /** 投注限额配置 */
    betLimits,

    /** 显示的筹码列表 */
    displayChips,

    /** 可用筹码列表 */
    availableChips,

    /** 闪烁区域集合 */
    blinkingZones,

    /** 筹码颜色映射 */
    chipColorMap,

    // --------------- 确认投注相关状态 ---------------
    /** 已确认投注数据 */
    confirmedBets,

    /** 是否已提交投注 */
    hasSubmittedBets,

    // --------------- 模拟投注相关状态 ---------------
    /** 模拟玩家数据 */
    simulatedData,

    // --------------- 从 GameStore 读取的计算属性 ---------------
    /** 游戏阶段 */
    gamePhase,

    /** 用户余额 */
    balance,

    /** 倒计时 */
    countdown,

    /** 游戏结果 */
    gameResult,

    // --------------- 计算属性 ---------------
    /** 总投注金额 */
    totalBetAmount,

    /** 是否有活跃投注 */
    hasActiveBets,

    /** 是否有上局数据 */
    hasLastRoundData,

    /** 显示筹码数据 */
    getDisplayChipsData,

    // --------------- 确认投注相关计算属性 ---------------
    /** 已确认总额 */
    totalConfirmedAmount,

    /** 待确认金额 */
    totalPendingAmount,

    /** 是否可确认 */
    canConfirm,

    /** 是否可取消 */
    canCancel,

    // --------------- 方法 ---------------
    /** 执行投注 */
    placeBet,

    /** 撤销投注 */
    undoLastBet,

    /** 重复上局 */
    repeatLastBets,

    /** 清空投注 */
    clearAllBets,

    /** 保存当前为上局 */
    saveCurrentAsLastBets,

    /** 更新限红 */
    updateBetLimits,

    /** 获取区域显示数据 */
    getBetZoneDisplayData,

    /** 选择筹码 */
    selectChip,

    /** 切换免佣 */
    toggleCommissionFree,

    /** 格式化金额 */
    formatAmount,

    /** 初始化 */
    init,

    /** 清理 */
    cleanup,

    /** 清场 */
    clearRound,

    // --------------- 确认投注相关方法 ---------------
    /** 确认投注 */
    confirmBets,

    /** 取消投注 */
    cancelBets,

    // --------------- 筹码管理方法 ---------------
    /** 更新显示筹码 */
    updateDisplayChips,

    /** 智能推荐筹码 */
    updateDisplayChipsByBalance,

    // --------------- 闪烁效果方法 ---------------
    /** 开始闪烁 */
    startBlinking,

    /** 停止闪烁 */
    stopBlinking,

    /** 停止所有闪烁 */
    stopAllBlinking,

    /** 检查闪烁状态 */
    isZoneBlinking,

    // --------------- 保留的方法 ---------------
    /** 处理闪烁效果 */
    handleFlashEffect,

    /** 处理清场 */
    handleClearBetting,

    // --------------- 模拟投注控制方法 ---------------
    /** 启动模拟 */
    startBettingSimulation,

    /** 停止模拟 */
    stopBettingSimulation,

    /** 重置模拟 */
    resetBettingSimulation,

    /** 获取模拟状态 */
    getSimulationStatusInfo,

    /** 更新模拟配置 */
    updateSimulationConfiguration,

    // --------------- 工具函数 ---------------
    /** 获取筹码图片 */
    getChipImages: (amount: number) => getChipImages(amount),

    // --------------- 配置常量 ---------------
    /** 投注区域配置 */
    BET_ZONE_CONFIGS,

    /** 筹码图片映射 */
    CHIP_IMAGE_MAP,

    /** 默认显示筹码 */
    DEFAULT_DISPLAY_CHIPS
  }
})
