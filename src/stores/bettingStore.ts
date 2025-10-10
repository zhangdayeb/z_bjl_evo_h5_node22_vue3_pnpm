// src/stores/bettingStore.ts
/**
 * @fileoverview 百家乐投注管理 Store
 * @description 使用 Pinia 组合式 API 管理投注状态
 * @version 3.0.0 - 简化版，只保留核心筹码选择功能
 */

import { defineStore } from 'pinia'
import { ref, computed, reactive, watch } from 'vue'
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

export type BaccaratBetType =
  | 'banker'
  | 'player'
  | 'tie'
  | 'banker-pair'
  | 'player-pair'
  | 'lucky-6'
  | 'dragon-7'
  | 'panda-8'

export interface ConfirmBetResult {
  success: boolean
  message: string
  newBalance?: number
}

// ========================= Store 定义 =========================

export const useBettingStore = defineStore('betting', () => {

  // ========================= 基础状态 =========================

  /**
   * 选中的筹码值 - 这是唯一的筹码相关状态
   */
  const selectedChip = ref(100)  // 默认100

  /**
   * 是否免佣模式
   */
  const isCommissionFree = ref(false)

  // ========================= 投注数据状态 =========================

  const currentBets = reactive<Record<BaccaratBetType, number>>(clearBetsData())
  const confirmedBets = reactive<Record<BaccaratBetType, number>>(clearBetsData())
  const hasSubmittedBets = ref(false)
  const betHistory = ref<BetHistoryStep[]>([])
  const lastBets = reactive<Record<BaccaratBetType, number>>(clearBetsData())
  const simulatedData = reactive<Record<BaccaratBetType, SimulatedPlayerData>>(
    createEmptySimulatedData()
  )

  // ========================= 限红配置 =========================

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

  // ========================= 效果管理 =========================

  const blinkingZones = ref<Set<BaccaratBetType>>(new Set())
  let clearEventCleanup: (() => void) | null = null

  // ========================= GameStore 访问 =========================

  const getGameStore = () => {
    try {
      return useGameStore()
    } catch (error) {
      console.error('❌ 获取 GameStore 失败:', error)
      return null
    }
  }

  // ========================= 计算属性 - GameStore 数据 =========================

  const gamePhase = computed(() => {
    try {
      const gameStore = getGameStore()
      return gameStore?.gameStatus ?? 'betting'
    } catch (error) {
      console.error('❌ 获取游戏状态失败:', error)
      return 'betting'
    }
  })

  const balance = computed(() => {
    try {
      const gameStore = getGameStore()
      return ensureNumber(gameStore?.balance, 0)
    } catch (error) {
      console.error('❌ 获取余额失败:', error)
      return 0
    }
  })

  const countdown = computed(() => {
    try {
      const gameStore = getGameStore()
      return ensureNumber(gameStore?.countdown, 0)
    } catch (error) {
      console.error('❌ 获取倒计时失败:', error)
      return 0
    }
  })

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

  const totalBetAmount = computed(() => {
    try {
      return calculateTotalBetAmount(currentBets)
    } catch (error) {
      console.error('❌ 计算总投注金额失败:', error)
      return 0
    }
  })

  const totalConfirmedAmount = computed(() => {
    try {
      return calculateTotalBetAmount(confirmedBets)
    } catch (error) {
      console.error('❌ 计算已确认投注金额失败:', error)
      return 0
    }
  })

  const totalPendingAmount = computed(() => {
    try {
      return totalBetAmount.value - totalConfirmedAmount.value
    } catch (error) {
      console.error('❌ 计算待确认投注金额失败:', error)
      return 0
    }
  })

  // ========================= 计算属性 - 状态判断 =========================

  const canConfirm = computed(() => {
    return totalPendingAmount.value > 0 && canPlaceBet(gamePhase.value as GameStatus)
  })

  const canCancel = computed(() => {
    return totalBetAmount.value > 0
  })

  const hasActiveBets = computed(() => {
    return hasValidBets(currentBets)
  })

  const hasLastRoundData = computed(() => {
    try {
      return hasValidBets(lastBets)
    } catch (error) {
      console.error('❌ 检查上局数据失败:', error)
      return false
    }
  })

  // ========================= 监听器 - 倒计时 =========================

  watch(countdown, async (newCountdown, oldCountdown) => {
    try {
      console.log(`⏰ [倒计时监听] 倒计时变化: ${oldCountdown} -> ${newCountdown}`)

      if (newCountdown > 0 && oldCountdown === 0) {
        console.log('🎮 倒计时开始，启动模拟投注')
        startSimulation(simulatedData, {
          intervalMs: 1500,
          playerCountRange: [1, 3],
          baseAmountRange: [10, 500]
        })
      }
      else if (oldCountdown === 1 && newCountdown === 0) {
        // ⚠️ 重要：在倒计时从1变为0时（在清场之前）立即提交
        console.log('⏰ 倒计时即将结束 (1->0)，立即检查并提交投注')
        stopSimulation()

        // 打印当前投注状态用于调试
        console.log('📊 [投注状态检查 - 清场前]')
        console.log('  - totalBetAmount:', totalBetAmount.value)
        console.log('  - totalConfirmedAmount:', totalConfirmedAmount.value)
        console.log('  - totalPendingAmount:', totalPendingAmount.value)
        console.log('  - currentBets:', JSON.stringify(currentBets))
        console.log('  - confirmedBets:', JSON.stringify(confirmedBets))

        // 自动提交投注：检查是否有待确认的投注金额
        if (totalPendingAmount.value > 0) {
          console.log('💰 检测到待提交投注金额:', totalPendingAmount.value)
          console.log('📤 倒计时结束前，立即自动提交投注到后端')

          const result = await confirmBets()

          if (result.success) {
            console.log('✅ 投注自动提交成功:', result.message)
            console.log('💵 新余额:', result.newBalance)
          } else {
            console.error('❌ 投注自动提交失败:', result.message)
          }
        } else {
          console.log('ℹ️ 没有待提交的投注，跳过自动提交')
        }
      }
    } catch (error) {
      console.error('❌ 处理倒计时变化失败:', error)
    }
  }, { immediate: false })

  // ========================= 监听器 - 开牌结果 =========================

  watch(gameResult, (newResult) => {
    try {
      if (!newResult) {
        return
      }

      console.log('🎰 收到开牌结果，处理闪烁效果:', newResult)
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

  const handleClearBetting = (): void => {
    try {
      console.log('🧹 执行投注数据清场')
      Object.assign(lastBets, copyBetsData(currentBets))
      betHistory.value = []
      Object.assign(currentBets, clearBetsData())
      Object.assign(confirmedBets, clearBetsData())
      hasSubmittedBets.value = false
      resetSimulatedData()
      stopAllBlinking()
      console.log('✅ 投注数据清场完成')
    } catch (error) {
      console.error('❌ 清场失败:', error)
    }
  }

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

  const confirmBets = async (): Promise<ConfirmBetResult> => {
    try {
      console.log('📤 开始确认投注')

      if (!canConfirm.value) {
        return { success: false, message: '没有待确认的投注' }
      }

      const gameStore = getGameStore()
      if (!gameStore) {
        return { success: false, message: 'GameStore 未初始化' }
      }

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

      const { getGlobalApiService } = await import('@/services/gameApi')
      const apiService = getGlobalApiService()

      const is_exempt = isCommissionFree.value ? 1 : 0
      const result = await apiService.orderBets(betsToSubmit, is_exempt)

      console.log('✅ 投注订单发送成功:', result)

      Object.assign(confirmedBets, copyBetsData(currentBets))
      hasSubmittedBets.value = true

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

  const cancelBets = (): void => {
    try {
      console.log('🚫 执行取消投注')

      if (!hasSubmittedBets.value) {
        console.log('🧹 清空模式：没有已提交投注，清空所有')
        Object.assign(currentBets, clearBetsData())
        Object.assign(confirmedBets, clearBetsData())
        betHistory.value = []
      } else {
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

  const handleFlashEffect = (flashZones: BaccaratBetType[]): void => {
    try {
      stopAllBlinking()

      if (flashZones.length === 0) {
        console.log('⚠️ 没有需要闪烁的区域')
        return
      }

      flashZones.forEach(betType => {
        startBlinking(betType)
        console.log(`✨ 开始闪烁: ${getBetZoneDisplayName(betType)}`)
      })

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

  const startBlinking = (zoneId: BaccaratBetType): void => {
    try {
      blinkingZones.value.add(zoneId)
      console.log(`✨ 开始闪烁: ${getBetZoneDisplayName(zoneId)}`)
    } catch (error) {
      console.error('❌ 启动闪烁效果失败:', error)
    }
  }

  const stopBlinking = (zoneId: BaccaratBetType): void => {
    try {
      blinkingZones.value.delete(zoneId)
      console.log(`ℹ️ 停止闪烁: ${getBetZoneDisplayName(zoneId)}`)
    } catch (error) {
      console.error('❌ 停止闪烁效果失败:', error)
    }
  }

  const stopAllBlinking = (): void => {
    try {
      blinkingZones.value.clear()
      console.log('ℹ️ 停止所有闪烁效果')
    } catch (error) {
      console.error('❌ 停止所有闪烁效果失败:', error)
    }
  }

  const isZoneBlinking = (zoneId: BaccaratBetType): boolean => {
    try {
      return blinkingZones.value.has(zoneId)
    } catch (error) {
      console.error('❌ 检查闪烁状态失败:', error)
      return false
    }
  }

  // ========================= 投注操作方法 =========================

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

  const placeBet = (betType: BaccaratBetType, amount?: number): BetResult => {
    try {
      const currentPhase = gamePhase.value as GameStatus
      if (!canPlaceBet(currentPhase)) {
        return { success: false, message: '当前不在投注阶段' }
      }

      const actualAmount = amount || selectedChip.value

      const result = calculateBetAmountSafe(betType, actualAmount)

      if (!result.success) {
        return result
      }

      const finalAmount = result.amount!

      currentBets[betType] += finalAmount

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

  const undoLastBet = (): boolean => {
    try {
      if (betHistory.value.length === 0) {
        return false
      }

      const lastStep = betHistory.value.pop()!
      const { betType, amount, action } = lastStep

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

  const repeatLastBets = (): boolean => {
    try {
      if (!hasLastRoundData.value) {
        return false
      }

      clearAllBets()

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

  const saveCurrentAsLastBets = (): void => {
    try {
      Object.assign(lastBets, copyBetsData(currentBets))
    } catch (error) {
      console.error('❌ 保存投注数据失败:', error)
    }
  }

  // ========================= 筹码管理方法（简化版）=========================

  /**
   * 选择筹码 - 简化版，直接设置值
   */
  const selectChip = (amount: number): void => {
    selectedChip.value = amount
    console.log(`✅ 选择筹码: ${amount}`)
  }

  const toggleCommissionFree = (): void => {
    try {
      isCommissionFree.value = !isCommissionFree.value
    } catch (error) {
      console.error('❌ 切换免佣状态失败:', error)
    }
  }

  // ========================= 工具方法 =========================

  const updateBetLimits = (tableInfo: any): void => {
    try {
      betLimits.value = updateBetLimitsFromTableInfo(tableInfo)
    } catch (error) {
      console.error('❌ 更新限红配置失败:', error)
    }
  }

  const getBetZoneDisplayData = (betType: BaccaratBetType) => {
    try {
      const userAmount = ensureNumber(currentBets[betType], 0)
      const simulated = simulatedData[betType]

      return {
        userAmount,
        otherPlayerCount: simulated.playerCount,
        otherTotalAmount: simulated.totalAmount
      }
    } catch (error) {
      console.error('❌ 获取投注区域显示数据失败:', error)
      return {
        otherPlayerCount: 0,
        otherTotalAmount: 0,
        userAmount: 0
      }
    }
  }

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

  const startBettingSimulation = (config?: any): void => {
    try {
      console.log('🎮 手动启动模拟投注')
      startSimulation(simulatedData, config)
    } catch (error) {
      console.error('❌ 启动模拟投注失败:', error)
    }
  }

  const stopBettingSimulation = (): void => {
    try {
      console.log('ℹ️ 手动停止模拟投注')
      stopSimulation()
    } catch (error) {
      console.error('❌ 停止模拟投注失败:', error)
    }
  }

  const resetBettingSimulation = (): void => {
    try {
      console.log('🔄 重置模拟投注数据')
      resetSimulatedData()
    } catch (error) {
      console.error('❌ 重置模拟投注失败:', error)
    }
  }

  const getSimulationStatusInfo = () => {
    try {
      return getSimulationStatus()
    } catch (error) {
      console.error('❌ 获取模拟状态失败:', error)
      return { isRunning: false, config: null, timer: null }
    }
  }

  const updateSimulationConfiguration = (config: any): void => {
    try {
      console.log('⚙️ 更新模拟配置:', config)
      updateSimulationConfig(config)
    } catch (error) {
      console.error('❌ 更新模拟配置失败:', error)
    }
  }

  // ========================= 生命周期方法 =========================

  const init = (): void => {
    try {
      console.log('🎰 投注 Store 初始化')
      selectedChip.value = 100
      isCommissionFree.value = false
      clearAllBets()
      Object.assign(lastBets, clearBetsData())
      Object.assign(simulatedData, createEmptySimulatedData())
      stopAllBlinking()
      setupClearEventListener()
      console.log('✅ 投注 Store 初始化完成')
    } catch (error) {
      console.error('❌ 投注 Store 初始化失败:', error)
    }
  }

  const cleanup = (): void => {
    try {
      console.log('🧹 投注 Store 清理')
      removeClearEventListener()
      cleanupSimulation()
      stopAllBlinking()
      console.log('✅ 投注 Store 清理完成')
    } catch (error) {
      console.error('❌ 投注 Store 清理失败:', error)
    }
  }

  const clearRound = (): void => {
    handleClearBetting()
  }

  // ========================= 导出 =========================

  return {
    // 状态 - 只保留必要的
    selectedChip,
    isCommissionFree,
    currentBets,
    betHistory,
    lastBets,
    betLimits,
    blinkingZones,
    confirmedBets,
    hasSubmittedBets,
    simulatedData,

    // 计算属性
    gamePhase,
    balance,
    countdown,
    gameResult,
    totalBetAmount,
    hasActiveBets,
    hasLastRoundData,
    totalConfirmedAmount,
    totalPendingAmount,
    canConfirm,
    canCancel,

    // 方法
    placeBet,
    undoLastBet,
    repeatLastBets,
    clearAllBets,
    saveCurrentAsLastBets,
    updateBetLimits,
    getBetZoneDisplayData,
    selectChip,
    toggleCommissionFree,
    formatAmount,
    init,
    cleanup,
    clearRound,
    confirmBets,
    cancelBets,
    startBlinking,
    stopBlinking,
    stopAllBlinking,
    isZoneBlinking,
    handleFlashEffect,
    handleClearBetting,
    startBettingSimulation,
    stopBettingSimulation,
    resetBettingSimulation,
    getSimulationStatusInfo,
    updateSimulationConfiguration,

    // 配置常量
    BET_ZONE_CONFIGS
  }
})
