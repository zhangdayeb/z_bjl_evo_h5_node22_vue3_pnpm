import { ref, reactive, computed, readonly, watch } from 'vue'
import { getValidatedParams } from '@/utils/urlParams'
import { getGlobalApiService, setGlobalApiService, createGameApiService } from '@/services/gameApi'
import { getWebSocketService } from '@/services/websocket'
import { useGameStore } from '@/stores/gameStore'
import { useUIStore } from '@/stores/uiStore'
import { useAudio } from '@/services/Audio'
import { buildVideoUrl, formatGameNumberFromApi } from '@/utils/formatters'

/**
 * 🔥 新增：解析开牌数据获取牌型、点数、闪烁区域
 */
const gameProcessingState = reactive({
  lastProcessedGameNumber: '', // 最后处理的局号
  lastProcessedDealNumber: '', // 最后处理的铺号
  countdownStarted: false, // 当前铺是否已开始倒计时
  cardResultProcessed: false, // 当前铺是否已处理开牌
  betResultProcessed: false, // 当前铺是否已处理中奖
})

// 🔥 新增：重置铺处理状态
function resetDealProcessingState() {
  gameProcessingState.countdownStarted = false
  gameProcessingState.cardResultProcessed = false
  gameProcessingState.betResultProcessed = false
  console.log('🔄 铺处理状态已重置')
}

// 🔥 新增：更新所有数据的通用方法
async function updateAllGameData(triggerSource: string): Promise<void> {
  try {
    console.log(`📡 ${triggerSource} - 开始更新所有游戏数据...`)

    const apiService = getGlobalApiService()
    const gameStore = useGameStore()

    // 并发请求所有数据
    const [userInfo, tableInfo, statistics] = await Promise.all([
      apiService.getUserInfo().catch(err => {
        console.error('❌ 更新用户信息失败:', err)
        return null
      }),
      apiService.getTableInfo().catch(err => {
        console.error('❌ 更新台桌信息失败:', err)
        return null
      }),
      apiService.getCurrentShoeStatistics().catch(err => {
        console.error('❌ 更新统计数据失败:', err)
        return null
      })
    ])

    // 更新用户信息
    if (userInfo) {
      gameStore.updateUserInfo(userInfo)
      console.log(`✅ ${triggerSource} - 用户信息已更新, 余额: ${userInfo.money_balance}`)
    }

    // 更新台桌信息
    if (tableInfo) {
      gameStore.updateTableInfo(tableInfo)
      console.log(`✅ ${triggerSource} - 台桌信息已更新`)
    }

    // 更新统计数据
    if (statistics) {
      gameStore.updateStatistics(statistics)
      console.log(`✅ ${triggerSource} - 统计数据已更新`)
    }

    console.log(`✅ ${triggerSource} - 所有游戏数据更新完成`)

  } catch (error) {
    console.error(`❌ ${triggerSource} - 更新游戏数据失败:`, error)
  }
}

// 🔥 修复：解析开牌数据获取牌型、点数、闪烁区域
function parseCardResultData(data: any) {
  const result = {
    cardType: '未知牌型',
    points: 0,
    blinkAreas: [] as number[],
    audioFiles: [] as string[]
  }

  try {
    const gameResult = data?.data || data
    const resultInfo = gameResult?.result_info || gameResult

    // 解析牌型 - 从 result_info.result 中获取
    const resultData = resultInfo?.result
    if (resultData) {
      // 根据庄闲点数判断牌型
      const zhuangPoint = resultData.zhuang_point || 0
      const xianPoint = resultData.xian_point || 0

      if (zhuangPoint > xianPoint) {
        result.cardType = '庄胜'
        result.points = zhuangPoint
      } else if (xianPoint > zhuangPoint) {
        result.cardType = '闲胜'
        result.points = xianPoint
      } else {
        result.cardType = '和'
        result.points = zhuangPoint
      }
    }

    // 🔥 修复：解析闪烁区域 - 正确的层级 data.result_info.pai_flash
    if (resultInfo?.pai_flash && Array.isArray(resultInfo.pai_flash)) {
      result.blinkAreas = resultInfo.pai_flash
        .map((id: any) => {
          const num = typeof id === 'number' ? id : parseInt(String(id), 10)
          return isNaN(num) ? null : num
        })
        .filter((id: number | null) => id !== null && id > 0) as number[]
    } else if (resultData?.win_array && Array.isArray(resultData.win_array)) {
      // 备用：使用 win_array
      result.blinkAreas = resultData.win_array
        .map((id: any) => {
          const num = typeof id === 'number' ? id : parseInt(String(id), 10)
          return isNaN(num) ? null : num
        })
        .filter((id: number | null) => id !== null && id > 0) as number[]
    }

    // 🔥 修复：构建音频播放序列：kai.mp3 + 闪烁区域对应的数字.mp3
    result.audioFiles = ['open/kai.mp3']

    // 为每个闪烁区域添加对应的音频文件
    result.blinkAreas.forEach(area => {
      const audioFile = mapAreaToAudioFile(area)
      if (audioFile) {
        result.audioFiles.push(audioFile)
      }
    })

  } catch (error) {
    console.error('❌ 解析开牌数据失败:', error)
    result.audioFiles = ['open/kai.mp3']
  }

  return result
}

// 🔥 修复：映射闪烁区域到音频文件 - 只支持数字映射
function mapAreaToAudioFile(area: string | number): string | null {
  if (typeof area === 'number') {
    return `open/${area}.mp3`
  }

  if (typeof area === 'string') {
    const num = parseInt(area.trim(), 10)
    if (!isNaN(num)) {
      return `open/${num}.mp3`
    }
  }

  return null
}

// 🔥 新增：解析中奖数据获取金额
function parseWinResultData(data: any) {
  const result = {
    winAmount: 0,
    totalWin: 0
  }

  try {
    const winResult = data?.data || data

    if (winResult?.win_amount !== undefined) {
      result.winAmount = winResult.win_amount
    } else if (winResult?.amount !== undefined) {
      result.winAmount = winResult.amount
    }

    if (winResult?.total_win !== undefined) {
      result.totalWin = winResult.total_win
    }

  } catch (error) {
    console.error('❌ 解析中奖数据失败:', error)
  }

  return result
}

// 🔥 新增：音频服务实例
const audioService = useAudio()

// 服务实例
let wsService: any = null

// 🔥 主要的网络服务初始化函数
export async function initializeNetworkService(): Promise<void> {
  try {
    console.log('🚀 开始初始化网络服务...')

    const gameStore = useGameStore()

    // 1. 解析并验证 URL 参数
    const { params, isValid, missing } = getValidatedParams()
    if (!isValid) {
      throw new Error(`缺少必需的URL参数: ${missing.join(', ')}`)
    }

    gameStore.initializeGameParams(params)
    console.log('📋 URL 参数验证通过:', params)

    // 2. 初始化 API 服务
    const apiService = createGameApiService(params)
    setGlobalApiService(apiService)
    console.log('🔧 API 服务初始化完成')

    // 3. 初始化 WebSocket 服务
    wsService = getWebSocketService()
    await wsService.connect(params)
    console.log('🔧 WebSocket 服务初始化完成')

    // 4. 设置 WebSocket 事件处理
    setupWebSocketHandlers()

    // 5. 🔥 加载一次初始数据
    await loadInitialData()

    console.log('✅ 网络服务初始化完成 (已取消定时更新)')

  } catch (error) {
    console.error('❌ 网络服务初始化失败:', error)
    const gameStore = useGameStore()
    gameStore.setError(`初始化失败: ${error}`)
    throw error
  }
}

// 设置 WebSocket 事件处理
function setupWebSocketHandlers() {
  if (!wsService) return

  const gameStore = useGameStore()

  // 连接成功
  wsService.on('connected', () => {
    console.log('✅ WebSocket 连接成功')
    gameStore.clearError()
  })

  // 连接断开
  wsService.on('disconnected', (data: any) => {
    console.log('❌ WebSocket 连接断开:', data)
  })

  // 接收消息
  wsService.on('message', (data: any) => {
    console.log('📨 收到 WebSocket 消息:', data)
    handleWebSocketMessage(data)
  })

  // 连接错误
  wsService.on('error', (error: any) => {
    console.error('❌ WebSocket 错误:', error)
    gameStore.setError('WebSocket 连接错误')
  })

  // 重连中
  wsService.on('reconnecting', (data: any) => {
    console.log('🔄 WebSocket 重连中:', data)
  })
}

// 🔥 处理 WebSocket 消息 - 直接更新 GameStore
function handleWebSocketMessage(data: any) {
  try {
    if (!data || typeof data !== 'object') return

    switch (data.msg) {
      case '倒计时信息':
        handleCountdownMessage(data)
        break

      case '开牌信息':
        handleGameResult(data)
        break

      case '中奖信息':
        handleBetResult(data)
        break
    }
  } catch (error) {
    console.error('❌ 处理 WebSocket 消息失败:', error)
  }
}

// 🔥 修改：处理倒计时消息 - 增加数据更新和音效
async function handleCountdownMessage(data: any) {
  const gameStore = useGameStore()

  gameProcessingState.cardResultProcessed = false
  gameProcessingState.betResultProcessed = false

  let countdown = 0

  // 🔥 修复：根据实际API数据结构解析倒计时
  if (data?.data?.table_run_info?.end_time !== undefined) {
    countdown = data.data.table_run_info.end_time
  } else if (data?.table_run_info?.end_time !== undefined) {
    countdown = data.table_run_info.end_time
  } else if (data?.end_time !== undefined) {
    countdown = data.end_time
  }

  // 🔥 更新倒计时到store
  gameStore.updateCountdown(countdown)

  // 🔥 根据倒计时自动设置游戏状态
  if (countdown > 0) {
    gameStore.updateGameStatus('betting')

    // 🔥 检查是否是新一铺的开始（倒计时开始）
    if (!gameProcessingState.countdownStarted) {
      gameProcessingState.countdownStarted = true

      // 🔥 倒计时开始时：更新所有数据
      await updateAllGameData('倒计时开始')

      // 🔥 播放投注开始音效
      try {
        await audioService.playAudioFile('bet.wav')
        console.log('🔊 倒计时开始音效播放完成')
      } catch (error) {
        console.error('❌ 播放倒计时开始音效失败:', error)
      }
    }

  } else {
    gameStore.updateGameStatus('dealing')

    // 🔥 倒计时结束时播放停止音效
    if (gameProcessingState.countdownStarted) {
      try {
        await audioService.playAudioFile('stop.wav')
        console.log('🔊 倒计时结束音效播放完成')
      } catch (error) {
        console.error('❌ 播放倒计时结束音效失败:', error)
      }
    }
  }

  console.log(`⏰ 倒计时 ${countdown} 秒`)
}

// 🔥 修改：处理开牌结果 - 增加防重复、数据更新、增强日志和音效
async function handleGameResult(data: any) {
  const gameStore = useGameStore()
  const uiStore = useUIStore()

  // 🔥 防重复处理：检查当前铺是否已处理过开牌
  if (gameProcessingState.cardResultProcessed) {
    console.log('⚠️ 当前铺已处理过开牌结果，跳过重复处理')
    return
  }

  console.log('🎰 收到开牌结果:', data)

  // 🔥 只在dealing状态下才处理
  if (gameStore.gameStatus === 'dealing') {

    // 🔥 标记当前铺已处理开牌
    gameProcessingState.cardResultProcessed = true

    // 🔥 解析开牌数据
    const cardResult = parseCardResultData(data)

    console.log(`🎯 开牌结果 - 牌型: ${cardResult.cardType}, 点数: ${cardResult.points}`)
    console.log(`🎯 闪烁区域: [${cardResult.blinkAreas.join(', ')}]`)
    console.log(`🎯 音频序列: [${cardResult.audioFiles.join(', ')}]`)

    // 1. 🔥 保存开牌结果数据 + 自动执行清场
    gameStore.updateGameResult(data)

    // 2. 🔥 开牌时：更新所有数据
    await updateAllGameData('开牌')

    // 3. 🔥 显示开牌效果弹窗
    uiStore.showCardResult()

    // 4. 🔥 播放开牌音效序列：kai.mp3 + 闪烁区域音效
    if (cardResult.audioFiles.length > 0) {
      try {
        await audioService.playAudioSequence(cardResult.audioFiles, { interval: 500 })
        console.log('🔊 开牌音效序列播放完成:', cardResult.audioFiles)
      } catch (error) {
        console.error('❌ 播放开牌音效序列失败:', error)
      }
    }

    // 5. 🔥 投注区域闪烁会通过 bettingStore 的 watch(gameResult) 自动触发
    console.log('✨ 投注区域闪烁将由 bettingStore 自动处理')

    // 6. 🔥 5秒后自动关闭开牌效果
    setTimeout(() => {
      uiStore.hideCardResult()
    }, 5000)

    console.log('🎯 开牌结果处理完成')
  } else {
    console.warn('⚠️ 游戏状态不是dealing，跳过开牌结果处理')
  }
}

// 🔥 修改：处理中奖信息 - 增加防重复、数据更新、增强日志
async function handleBetResult(data: any) {
  const gameStore = useGameStore()
  const uiStore = useUIStore()

  // 🔥 防重复处理：检查当前铺是否已处理过中奖
  if (gameProcessingState.betResultProcessed) {
    console.log('⚠️ 当前铺已处理过中奖信息，跳过重复处理')
    return
  }

  // 🔥 标记当前铺已处理中奖
  gameProcessingState.betResultProcessed = true

  // 🔥 解析中奖数据
  const winResult = parseWinResultData(data)

  console.log('🏆 收到中奖信息:', data)
  console.log(`💰 中奖金额: ${winResult.winAmount}`)

  // 1. 🔥 保存中奖信息数据
  gameStore.updateBetResult(data)

  // 2. 🔥 中奖时：更新所有数据
  await updateAllGameData('中奖信息')

  // 3. 🔥 显示中奖效果
  uiStore.showWinEffect()

  // 4. 🔥 5秒后自动关闭
  setTimeout(() => {
    uiStore.hideWinEffect()
  }, 5000)

  console.log('🏆 中奖信息处理完成')
}

// 🔥 修改：初始化时加载数据 - 增加局号格式化逻辑
async function loadInitialData(): Promise<void> {
  console.log('📡 开始加载初始数据...')

  try {
    const apiService = getGlobalApiService()
    const gameStore = useGameStore()

    // 🔥 加载用户信息、台桌信息、统计数据
    const [userInfo, tableInfo, statistics] = await Promise.all([
      apiService.getUserInfo(),
      apiService.getTableInfo(),
      apiService.getCurrentShoeStatistics().catch(() => null) // 统计数据失败不影响初始化
    ])

    // 更新用户信息
    if (userInfo) {
      gameStore.updateUserInfo(userInfo)
    }

    // 🔥 修改：更新台桌信息并格式化局号
    if (tableInfo) {
      // 1. 先格式化局号
      const formattedGameNumber = formatGameNumberFromApi(tableInfo)
      gameStore.updateGameNumber(formattedGameNumber)

      // 🔥 初始化时设置当前局号为处理基准
      gameProcessingState.lastProcessedGameNumber = formattedGameNumber
      resetDealProcessingState()

      // 2. 然后更新其他台桌信息
      gameStore.updateTableInfo(tableInfo)

      // 3. 🔥 初始化时设置视频地址
      const tableId = tableInfo.id || gameStore.gameParams.table_id
      gameStore.updateVideoUrl(buildVideoUrl(tableInfo.video_far, tableId))
    }

    // 🔥 更新统计数据
    if (statistics) {
      gameStore.updateStatistics(statistics)
    }

    console.log('📊 初始数据加载完成:', {
      balance: gameStore.balance,
      tableName: gameStore.tableName,
      videoUrl: gameStore.videoUrl,
      gameNumber: gameStore.gameNumber,
      statistics: gameStore.statistics
    })

  } catch (error) {
    console.error('❌ 初始数据加载失败:', error)
    throw error
  }
}

// 🔥 修改：清理网络服务 - 移除定时器清理
export function cleanupNetworkService(): void {
  console.log('🧹 清理网络服务...')

  if (wsService) {
    wsService.disconnect()
    wsService.removeAllListeners()
  }

  // 🔥 重置防重复状态
  resetDealProcessingState()
  gameProcessingState.lastProcessedGameNumber = ''
  gameProcessingState.lastProcessedDealNumber = ''

  console.log('✅ 网络服务已清理')
}

// 🔥 导出响应式数据供组件使用
export function useNetworkService() {
  const gameStore = useGameStore()

  return {
    // 状态（从 GameStore 读取）
    isReady: computed(() => gameStore.isReady),
    isConnected: computed(() => gameStore.isConnected),
    hasError: computed(() => gameStore.hasError),

    // 游戏数据（从 GameStore 读取）
    countdown: computed(() => gameStore.countdown),
    gameStatus: computed(() => gameStore.gameStatus),
    gameNumber: computed(() => gameStore.gameNumber), // 🔥 现在返回格式化后的局号
    balance: computed(() => gameStore.balance),
    videoUrl: computed(() => gameStore.videoUrl),
    statistics: computed(() => gameStore.statistics),

    // 方法
    initializeNetworkService,
    cleanupNetworkService,

    // WebSocket 方法
    sendWebSocketMessage: (data: any) => {
      if (wsService) {
        wsService.send(data)
      }
    },

    // 🔥 新增：手动更新方法
    refreshBalance: () => gameStore.refreshBalance(),
    refreshStatistics: () => gameStore.refreshStatistics(),

    // 🔥 新增：手动触发数据更新
    updateAllData: (source: string) => updateAllGameData(source),

    // 🔥 新增：重置处理状态（用于调试）
    resetProcessingState: () => {
      resetDealProcessingState()
      gameProcessingState.lastProcessedGameNumber = ''
      gameProcessingState.lastProcessedDealNumber = ''
    }
  }
}

// 默认导出
export default {
  initializeNetworkService,
  cleanupNetworkService,
  useNetworkService
}
