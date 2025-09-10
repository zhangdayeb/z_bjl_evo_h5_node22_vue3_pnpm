// src/stores/bettingStore.ts
import { defineStore } from 'pinia'
import { ref, computed, reactive, nextTick, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// 导入工具函数
import {
  BET_ZONE_CONFIGS,
  type BetZoneConfig,
  type BetLimits,
  type BetResult,
  type BetHistoryStep,
  getBetZoneConfig,
  findBetTypeByRateId,
  updateBetLimitsFromTableInfo,
  calculateBetAmount,
  buildBetApiData,
  validateBetData,
  getBetZoneDisplayName,
  getBetZoneOdds,
  hasValidBets,
  calculateTotalBetAmount,
  clearBetsData,
  copyBetsData
} from '@/utils/bettingUtils'

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

import {
  type GameStatus,
  type GameResultData,
  type WinResultData,
  parseFlashAreas,
  parseWinAmount,
  mapRateIdsToBetTypes,
  canPlaceBet,
  createClearBettingEvent,
  addClearBettingListener
} from '@/utils/gameUtils'

import {
  isValidAmount,
  ensureNumber,
  ensureString,
  ensureBoolean
} from '@/utils/validationUtils'

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

// 百家乐投注类型
export type BaccaratBetType =
  | 'banker'
  | 'player'
  | 'tie'
  | 'banker-pair'
  | 'player-pair'
  | 'lucky-6'
  | 'dragon-7'
  | 'panda-8'

// 筹码数据接口
export interface ChipInfo {
  value: number
  color: string
  name: string
}

// 确认投注结果接口
export interface ConfirmBetResult {
  success: boolean
  message: string
  newBalance?: number
}

export const useBettingStore = defineStore('betting', () => {
  // 基础状态 - 默认选中100筹码
  const selectedChipRef = ref(100)
  const isCommissionFree = ref(false)

  // 筹码颜色映射
  const chipColorMap: Record<number, string> = {
    1: '#595959',
    2: '#ff82d6',
    5: '#ce1d00',
    25: '#05ae29',
    100: '#1a1a1a',
    500: '#8548b0',
    1000: '#de9807',
    5000: '#de7571'
  }

  // 确认投注相关状态
  const confirmedBets = reactive<Record<BaccaratBetType, number>>(clearBetsData())
  const hasSubmittedBets = ref(false)

  // 投注数据
  const currentBets = reactive<Record<BaccaratBetType, number>>(clearBetsData())

  // 投注历史
  const betHistory = ref<BetHistoryStep[]>([])

  // 上一局投注数据
  const lastBets = reactive<Record<BaccaratBetType, number>>(clearBetsData())

  // 模拟其他玩家投注数据
  const simulatedData = reactive<Record<BaccaratBetType, SimulatedPlayerData>>(createEmptySimulatedData())

  // 限红配置
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

  // 筹码相关状态
  const displayChips = ref<ChipData[]>([...DEFAULT_DISPLAY_CHIPS])
  const availableChips = ref<ChipData[]>(AVAILABLE_CHIPS)

  // 闪烁效果管理
  const blinkingZones = ref<Set<BaccaratBetType>>(new Set())

  // 清场事件监听器
  let clearEventCleanup: (() => void) | null = null

  // 安全的 GameStore 访问
  const getGameStore = () => {
    try {
      return useGameStore()
    } catch (error) {
      console.error('❌ 获取 GameStore 失败:', error)
      return null
    }
  }

  // 计算属性
  const selectedChip = computed({
    get: () => selectedChipRef.value,
    set: (value: number) => {
      selectedChipRef.value = isValidChipValue(value) ? value : getClosestChipValue(value)
    }
  })

  // 获取选中筹码的颜色
  const selectedChipColor = computed(() => {
    return chipColorMap[selectedChipRef.value] || '#1a1a1a'
  })

  // 获取选中筹码的完整信息
  const selectedChipInfo = computed((): ChipInfo => {
    return {
      value: selectedChipRef.value,
      color: selectedChipColor.value,
      name: `€${selectedChipRef.value}`
    }
  })

  // 安全的从 GameStore 读取游戏状态
  const gamePhase = computed(() => {
    try {
      const gameStore = getGameStore()
      return gameStore?.gameStatus ?? 'betting'
    } catch (error) {
      console.error('❌ 获取游戏状态失败:', error)
      return 'betting'
    }
  })

  // 安全的从 GameStore 读取余额
  const balance = computed(() => {
    try {
      const gameStore = getGameStore()
      return ensureNumber(gameStore?.balance, 0)
    } catch (error) {
      console.error('❌ 获取余额失败:', error)
      return 0
    }
  })

  // 安全的从 GameStore 读取倒计时
  const countdown = computed(() => {
    try {
      const gameStore = getGameStore()
      return ensureNumber(gameStore?.countdown, 0)
    } catch (error) {
      console.error('❌ 获取倒计时失败:', error)
      return 0
    }
  })

  // 安全的从 GameStore 读取开牌结果
  const gameResult = computed(() => {
    try {
      const gameStore = getGameStore()
      return gameStore?.gameResult ?? null
    } catch (error) {
      console.error('❌ 获取开牌结果失败:', error)
      return null
    }
  })

  // 使用工具函数计算总投注金额
  const totalBetAmount = computed(() => {
    try {
      return calculateTotalBetAmount(currentBets)
    } catch (error) {
      console.error('❌ 计算总投注金额失败:', error)
      return 0
    }
  })

  // 计算已确认投注金额
  const totalConfirmedAmount = computed(() => {
    try {
      return calculateTotalBetAmount(confirmedBets)
    } catch (error) {
      console.error('❌ 计算已确认投注金额失败:', error)
      return 0
    }
  })

  // 计算待确认投注金额
  const totalPendingAmount = computed(() => {
    try {
      return totalBetAmount.value - totalConfirmedAmount.value
    } catch (error) {
      console.error('❌ 计算待确认投注金额失败:', error)
      return 0
    }
  })

  // 是否可以确认投注
  const canConfirm = computed(() => {
    return totalPendingAmount.value > 0 && canPlaceBet(gamePhase.value as GameStatus)
  })

  // 是否可以取消投注
  const canCancel = computed(() => {
    return totalBetAmount.value > 0
  })

  // 使用工具函数检查是否有投注
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

  const getDisplayChipsData = computed(() => {
    return displayChips.value
  })

  // 监听倒计时变化，控制模拟投注
  watch(countdown, (newCountdown, oldCountdown) => {
    try {
      if (newCountdown > 0 && oldCountdown === 0) {
        console.log('🎮 倒计时开始，启动模拟投注')
        startSimulation(simulatedData, {
          intervalMs: 1500,
          playerCountRange: [1, 3],
          baseAmountRange: [10, 500]
        })
      } else if (newCountdown === 0 && oldCountdown > 0) {
        console.log('⏰ 倒计时结束，停止模拟投注')
        stopSimulation()
      }
    } catch (error) {
      console.error('❌ 处理倒计时变化失败:', error)
    }
  }, { immediate: false })

  // 监听开牌结果，处理闪烁效果
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

  // 清场方法
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

  // 设置清场事件监听
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

  // 移除清场事件监听
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

  // 确认投注方法
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

  // 取消投注方法
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

  // 处理闪烁效果
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

  // 计算投注金额
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

  // 执行投注
  const placeBet = (betType: BaccaratBetType, amount?: number): BetResult => {
    try {
      const currentPhase = gamePhase.value as GameStatus
      if (!canPlaceBet(currentPhase)) {
        return { success: false, message: '当前不在投注阶段' }
      }

      const actualAmount = amount || selectedChipRef.value
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

  // 撤销投注
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

  // 重复上局投注
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

  // 清空所有投注
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

  // 保存当前投注为上局数据
  const saveCurrentAsLastBets = (): void => {
    try {
      Object.assign(lastBets, copyBetsData(currentBets))
    } catch (error) {
      console.error('❌ 保存投注数据失败:', error)
    }
  }

  // 更新显示筹码
  const updateDisplayChips = (chips: ChipData[]): void => {
    try {
      const updatedChips = updateDisplayChipsUtil(chips)

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

  // 智能推荐筹码
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

  // 闪烁效果管理
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

  // 更新限红配置
  const updateBetLimits = (tableInfo: any): void => {
    try {
      betLimits.value = updateBetLimitsFromTableInfo(tableInfo)
    } catch (error) {
      console.error('❌ 更新限红配置失败:', error)
    }
  }

  // 获取投注区域显示数据
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

  // 选择筹码
  const selectChip = (amount: number): void => {
    try {
      const chipData = getChipDataByValue(amount)
      const isValidChip = chipData && displayChips.value.some(chip => chip.value === amount)

      if (isValidChip) {
        selectedChipRef.value = amount
        console.log(`✅ 选择筹码: ${amount}`)
      } else {
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

  // 切换免佣状态
  const toggleCommissionFree = (): void => {
    try {
      isCommissionFree.value = !isCommissionFree.value
    } catch (error) {
      console.error('❌ 切换免佣状态失败:', error)
    }
  }

  // 格式化金额
  const formatAmount = (amount: number | undefined | null): string => {
    try {
      const validAmount = ensureNumber(amount, 0)
      return validAmount.toString()
    } catch (error) {
      console.error('❌ 格式化金额失败:', error)
      return '0'
    }
  }

  // 模拟投注控制方法
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

  // 初始化
  const init = (): void => {
    try {
      console.log('🎰 投注 Store 初始化')

      selectedChipRef.value = 100
      isCommissionFree.value = false
      displayChips.value = [...DEFAULT_DISPLAY_CHIPS]
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

  // 清理
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

  // 清场
  const clearRound = (): void => {
    handleClearBetting()
  }

  return {
    // 状态
    selectedChip,
    selectedChipColor,
    selectedChipInfo,
    isCommissionFree,
    currentBets,
    betHistory,
    lastBets,
    betLimits,
    displayChips,
    availableChips,
    blinkingZones,
    chipColorMap,

    // 确认投注相关状态
    confirmedBets,
    hasSubmittedBets,

    // 模拟投注相关状态
    simulatedData,

    // 从 GameStore 读取的安全计算属性
    gamePhase,
    balance,
    countdown,
    gameResult,

    // 计算属性
    totalBetAmount,
    hasActiveBets,
    hasLastRoundData,
    getDisplayChipsData,

    // 确认投注相关计算属性
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

    // 确认投注相关方法
    confirmBets,
    cancelBets,

    // 筹码管理方法
    updateDisplayChips,
    updateDisplayChipsByBalance,

    // 闪烁效果方法
    startBlinking,
    stopBlinking,
    stopAllBlinking,
    isZoneBlinking,

    // 保留的方法
    handleFlashEffect,
    handleClearBetting,

    // 模拟投注控制方法
    startBettingSimulation,
    stopBettingSimulation,
    resetBettingSimulation,
    getSimulationStatusInfo,
    updateSimulationConfiguration,

    // 工具函数
    getChipImages: (amount: number) => getChipImages(amount),

    // 配置常量
    BET_ZONE_CONFIGS,
    CHIP_IMAGE_MAP,
    DEFAULT_DISPLAY_CHIPS
  }
})
