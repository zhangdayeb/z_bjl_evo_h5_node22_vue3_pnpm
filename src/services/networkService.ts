import { reactive, computed} from 'vue'
import { getValidatedParams } from '@/utils/urlParams'
import { getGlobalApiService, setGlobalApiService, createGameApiService } from '@/services/gameApi'
import { getWebSocketService } from '@/services/websocket'
import { useGameStore } from '@/stores/gameStore'
import { useoverLayerStore } from '@/stores/overLayerStore'
import { useAudio } from '@/services/Audio'
import { buildVideoUrl, formatGameNumberFromApi } from '@/utils/formatters'

/**
 * 游戏处理状态
 * @description 跟踪游戏各阶段的处理状态，防止重复处理
 */
const gameProcessingState = reactive({
  lastProcessedGameNumber: '', // 最后处理的局号
  lastProcessedDealNumber: '', // 最后处理的铺号
  countdownStarted: false, // 当前铺是否已开始倒计时
  cardResultProcessed: false, // 当前铺是否已处理开牌
  betResultProcessed: false, // 当前铺是否已处理中奖
})

/**
 * 重置铺处理状态
 * @description 在新一铺开始时重置所有处理标记
 */
function resetDealProcessingState() {
  gameProcessingState.countdownStarted = false
  gameProcessingState.cardResultProcessed = false
  gameProcessingState.betResultProcessed = false
  console.log('🔄 铺处理状态已重置')
}

/**
 * 更新所有游戏数据
 * @param {string} triggerSource - 触发源描述
 * @description 统一更新用户信息、台桌信息、统计数据和露珠数据
 */
async function updateAllGameData(triggerSource: string): Promise<void> {
  try {
    console.log(`📡 ${triggerSource} - 开始更新所有游戏数据...`)

    const apiService = getGlobalApiService()
    const gameStore = useGameStore()

    // 并发请求所有数据（包括露珠数据）
    const [userInfo, tableInfo, statistics, luZhuData] = await Promise.all([
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
      }),
      // 获取露珠数据 - 返回类型已经是正确的格式
      apiService.getLuZhuData(gameStore.gameParams.table_id).catch(err => {
        console.error('❌ 更新露珠数据失败:', err)
        return {}  // 返回空对象而不是 null
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

    // 更新露珠数据 - 类型已经匹配
    if (luZhuData && Object.keys(luZhuData).length > 0) {
      // 直接传递数据，因为类型已经匹配
      await gameStore.updateLuZhuData(luZhuData as Record<string, any>)
      console.log(`✅ ${triggerSource} - 露珠数据已更新`)
    }

    console.log(`✅ ${triggerSource} - 所有游戏数据更新完成`)

  } catch (error) {
    console.error(`❌ ${triggerSource} - 更新游戏数据失败:`, error)
  }
}

/**
 * 解析开牌数据
 * @param {any} data - WebSocket 推送的开牌数据
 * @returns {Object} 解析后的牌型信息
 */
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

    // 解析牌型
    const resultData = resultInfo?.result
    if (resultData) {
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

    // 解析闪烁区域
    if (resultInfo?.pai_flash && Array.isArray(resultInfo.pai_flash)) {
      result.blinkAreas = resultInfo.pai_flash
        .map((id: any) => {
          const num = typeof id === 'number' ? id : parseInt(String(id), 10)
          return isNaN(num) ? null : num
        })
        .filter((id: number | null) => id !== null && id > 0) as number[]
    } else if (resultData?.win_array && Array.isArray(resultData.win_array)) {
      result.blinkAreas = resultData.win_array
        .map((id: any) => {
          const num = typeof id === 'number' ? id : parseInt(String(id), 10)
          return isNaN(num) ? null : num
        })
        .filter((id: number | null) => id !== null && id > 0) as number[]
    }

    // 构建音频播放序列
    result.audioFiles = ['open/kai.mp3']
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

/**
 * 映射闪烁区域到音频文件
 * @param {string | number} area - 闪烁区域ID
 * @returns {string | null} 音频文件路径
 */
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

/**
 * 解析中奖数据
 * @param {any} data - WebSocket 推送的中奖数据
 * @returns {Object} 解析后的中奖信息
 */
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

// 音频服务实例
const audioService = useAudio()

// WebSocket 服务实例
let wsService: any = null

/**
 * 初始化网络服务
 * @description 初始化 API 和 WebSocket 服务，建立连接
 */
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

    // 5. 加载初始数据
    await loadInitialData()

    console.log('✅ 网络服务初始化完成')

  } catch (error) {
    console.error('❌ 网络服务初始化失败:', error)
    const gameStore = useGameStore()
    gameStore.setError(`初始化失败: ${error}`)
    throw error
  }
}

/**
 * 设置 WebSocket 事件处理器
 * @description 注册 WebSocket 连接、消息、错误等事件处理器
 */
function setupWebSocketHandlers() {
  if (!wsService) return

  const gameStore = useGameStore()

  // 连接成功
  wsService.on('connected', () => {
    console.log('✅ WebSocket 连接成功')
    gameStore.updateWebSocketStatus(true)
    gameStore.clearError()
  })

  // 连接断开
  wsService.on('disconnected', (data: any) => {
    console.log('❌ WebSocket 连接断开:', data)
    gameStore.updateWebSocketStatus(false)
  })

  // 接收消息
  wsService.on('message', (data: any) => {

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

/**
 * 处理 WebSocket 消息
 * @param {any} data - WebSocket 消息数据
 * @description 根据消息类型分发到对应的处理函数
 */
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

/**
 * 处理倒计时消息
 * @param {any} data - 倒计时消息数据
 * @description 更新倒计时，触发游戏状态变化和数据更新
 */
async function handleCountdownMessage(data: any) {
  const gameStore = useGameStore()

  // 重置处理状态
  gameProcessingState.cardResultProcessed = false
  gameProcessingState.betResultProcessed = false

  let countdown = 0

  // 解析倒计时
  if (data?.data?.table_run_info?.end_time !== undefined) {
    countdown = data.data.table_run_info.end_time
  } else if (data?.table_run_info?.end_time !== undefined) {
    countdown = data.table_run_info.end_time
  } else if (data?.end_time !== undefined) {
    countdown = data.end_time
  }

  // 更新倒计时
  gameStore.updateCountdown(countdown)

  // 根据倒计时设置游戏状态
  if (countdown > 0) {
    gameStore.updateGameStatus('betting')

    // 检查是否是新一铺的开始
    if (!gameProcessingState.countdownStarted) {
      gameProcessingState.countdownStarted = true

      // 倒计时开始时更新所有数据（包括露珠）
      await updateAllGameData('倒计时开始')

      // 播放投注开始音效
      try {
        await audioService.playAudioFile('bet.wav')
        console.log('🔊 倒计时开始音效播放完成')
      } catch (error) {
        console.error('❌ 播放倒计时开始音效失败:', error)
      }
    }

  } else {
    gameStore.updateGameStatus('dealing')

    // 倒计时结束时播放停止音效
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

/**
 * 处理开牌结果
 * @param {any} data - 开牌结果数据
 * @description 处理开牌，更新数据，播放音效，显示开牌效果
 */
async function handleGameResult(data: any) {
  const gameStore = useGameStore()
  const overLayerStore = useoverLayerStore()

  // 防重复处理
  if (gameProcessingState.cardResultProcessed) {
    console.log('⚠️ 当前铺已处理过开牌结果，跳过重复处理')
    return
  }

  console.log('🎰 收到开牌结果:', data)

  // 只在dealing状态下处理
  if (gameStore.gameStatus === 'dealing') {

    // 标记已处理
    gameProcessingState.cardResultProcessed = true

    // 解析开牌数据
    const cardResult = parseCardResultData(data)

    console.log(`🎯 开牌结果 - 牌型: ${cardResult.cardType}, 点数: ${cardResult.points}`)
    console.log(`🎯 闪烁区域: [${cardResult.blinkAreas.join(', ')}]`)
    console.log(`🎯 音频序列: [${cardResult.audioFiles.join(', ')}]`)

    // 1. 保存开牌结果并触发清场
    gameStore.updateGameResult(data)

    // 2. 开牌时更新所有数据（包括露珠）
    await updateAllGameData('开牌')

    // 3. 显示开牌效果弹窗 - 使用正确的方法
    overLayerStore.open('resultFly')

    // 4. 播放开牌音效序列
    if (cardResult.audioFiles.length > 0) {
      try {
        await audioService.playAudioSequence(cardResult.audioFiles, { interval: 500 })
        console.log('🔊 开牌音效序列播放完成:', cardResult.audioFiles)
      } catch (error) {
        console.error('❌ 播放开牌音效序列失败:', error)
      }
    }

    // 5. 投注区域闪烁通过 bettingStore 自动处理
    console.log('✨ 投注区域闪烁将由 bettingStore 自动处理')

    // 6. 5秒后自动关闭开牌效果
    setTimeout(() => {
      overLayerStore.close()
    }, 5000)

    console.log('🎯 开牌结果处理完成')
  } else {
    console.warn('⚠️ 游戏状态不是dealing，跳过开牌结果处理')
  }
}

/**
 * 处理中奖信息
 * @param {any} data - 中奖信息数据
 * @description 处理中奖结果，更新数据，显示中奖效果
 */
async function handleBetResult(data: any) {
  const gameStore = useGameStore()
  const overLayerStore = useoverLayerStore()

  // 防重复处理
  if (gameProcessingState.betResultProcessed) {
    console.log('⚠️ 当前铺已处理过中奖信息，跳过重复处理')
    return
  }

  // 标记已处理
  gameProcessingState.betResultProcessed = true

  // 解析中奖数据
  const winResult = parseWinResultData(data)

  console.log('🏆 收到中奖信息:', data)
  console.log(`💰 中奖金额: ${winResult.winAmount}`)

  // 1. 保存中奖信息
  gameStore.updateBetResult(data)

  // 2. 中奖时更新所有数据（包括露珠）
  await updateAllGameData('中奖信息')

  // 3. 显示中奖效果
  overLayerStore.open('winningEffect')

  // 4. 5秒后自动关闭
  setTimeout(() => {
    overLayerStore.close()
  }, 5000)

  console.log('🏆 中奖信息处理完成')
}

/**
 * 加载初始数据
 * @description 应用启动时加载所有必要的初始数据
 */
async function loadInitialData(): Promise<void> {
  console.log('📡 开始加载初始数据...')

  try {
    const apiService = getGlobalApiService()
    const gameStore = useGameStore()

    // 加载所有初始数据
    const [userInfo, tableInfo, statistics, luZhuData] = await Promise.all([
      apiService.getUserInfo(),
      apiService.getTableInfo(),
      apiService.getCurrentShoeStatistics().catch(() => null),
      // 获取露珠数据
      apiService.getLuZhuData(gameStore.gameParams.table_id).catch(() => ({}))
    ])

    // 更新用户信息
    if (userInfo) {
      gameStore.updateUserInfo(userInfo)
    }

    // 更新台桌信息并格式化局号
    if (tableInfo) {
      // 格式化局号
      const formattedGameNumber = formatGameNumberFromApi(tableInfo)
      gameStore.updateGameNumber(formattedGameNumber)

      // 设置当前局号为处理基准
      gameProcessingState.lastProcessedGameNumber = formattedGameNumber
      resetDealProcessingState()

      // 更新台桌信息
      gameStore.updateTableInfo(tableInfo)

      // 设置视频地址
      const tableId = tableInfo.id || gameStore.gameParams.table_id
      gameStore.updateVideoUrl(buildVideoUrl(tableInfo.video_far, tableId))
    }

    // 更新统计数据
    if (statistics) {
      gameStore.updateStatistics(statistics)
    }

    // 更新露珠数据
    if (luZhuData && Object.keys(luZhuData).length > 0) {
      await gameStore.updateLuZhuData(luZhuData as Record<string, any>)
    }

    // 设置 API 就绪状态
    gameStore.updateApiStatus(true)

    console.log('📊 初始数据加载完成:', {
      balance: gameStore.balance,
      tableName: gameStore.tableName,
      videoUrl: gameStore.videoUrl,
      gameNumber: gameStore.gameNumber,
      statistics: gameStore.statistics,
      luZhuCount: gameStore.luZhuCount
    })

  } catch (error) {
    console.error('❌ 初始数据加载失败:', error)
    throw error
  }
}

/**
 * 清理网络服务
 * @description 断开连接，清理资源
 */
export function cleanupNetworkService(): void {
  console.log('🧹 清理网络服务...')

  if (wsService) {
    wsService.disconnect()
    wsService.removeAllListeners()
  }

  // 重置处理状态
  resetDealProcessingState()
  gameProcessingState.lastProcessedGameNumber = ''
  gameProcessingState.lastProcessedDealNumber = ''

  console.log('✅ 网络服务已清理')
}

/**
 * 导出响应式数据和方法供组件使用
 * @returns {Object} 包含状态、数据和方法的对象
 */
export function useNetworkService() {
  const gameStore = useGameStore()

  return {
    // 状态
    isReady: computed(() => gameStore.isReady),
    isConnected: computed(() => gameStore.isConnected),
    hasError: computed(() => gameStore.hasError),

    // 游戏数据
    countdown: computed(() => gameStore.countdown),
    gameStatus: computed(() => gameStore.gameStatus),
    gameNumber: computed(() => gameStore.gameNumber),
    balance: computed(() => gameStore.balance),
    videoUrl: computed(() => gameStore.videoUrl),
    statistics: computed(() => gameStore.statistics),

    // 露珠数据
    luZhuData: computed(() => gameStore.luZhuData),
    roadmapData: computed(() => gameStore.roadmapData),
    luZhuCount: computed(() => gameStore.luZhuCount),

    // 方法
    initializeNetworkService,
    cleanupNetworkService,

    // WebSocket 方法
    sendWebSocketMessage: (data: any) => {
      if (wsService) {
        wsService.send(data)
      }
    },

    // 手动更新方法
    refreshBalance: () => gameStore.refreshBalance(),
    refreshStatistics: () => gameStore.refreshStatistics(),
    refreshLuZhuData: () => gameStore.updateLuZhuData(null),

    // 手动触发数据更新
    updateAllData: (source: string) => updateAllGameData(source),

    // 重置处理状态（用于调试）
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
