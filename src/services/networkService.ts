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
  lastPaiInfo: '', // 上次处理的牌型信息，用于防重
  lastPaiInfoTemp: '', // 上次处理的临时牌信息，用于防重
})

/**
 * 重置铺处理状态
 * @description 在新一铺开始时重置所有处理标记
 */
function resetDealProcessingState() {
  gameProcessingState.countdownStarted = false
  gameProcessingState.cardResultProcessed = false
  gameProcessingState.betResultProcessed = false
  gameProcessingState.lastPaiInfo = ''
  gameProcessingState.lastPaiInfoTemp = ''
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
 * @param {string} paiInfo - 牌型信息字符串
 * @returns {Object} 解析后的牌型信息
 */
function parseCardResultData(paiInfo: string) {
  const result = {
    cardType: '未知牌型',
    points: 0,
    blinkAreas: [] as number[],
    audioFiles: [] as string[]
  }

  try {
    // 根据实际 pai_info 的格式解析牌型
    // TODO: 这里需要根据实际返回的 pai_info 格式进行解析
    result.cardType = paiInfo
    result.audioFiles = ['open/kai.mp3']

    // 如果 pai_info 包含具体的赢家信息，解析对应的闪烁区域
    // 这里需要根据实际格式调整
    if (paiInfo.includes('庄')) {
      result.blinkAreas.push(1)
      result.audioFiles.push('open/1.mp3')
    } else if (paiInfo.includes('闲')) {
      result.blinkAreas.push(2)
      result.audioFiles.push('open/2.mp3')
    } else if (paiInfo.includes('和')) {
      result.blinkAreas.push(3)
      result.audioFiles.push('open/3.mp3')
    }

  } catch (error) {
    console.error('❌ 解析开牌数据失败:', error)
    result.audioFiles = ['open/kai.mp3']
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
 * @param data - WebSocket 消息数据
 * @description 每秒接收WS数据，判定游戏状态，调用相应阶段函数
 */
async function handleWebSocketMessage(data: any) {
  try {
    if (!data || typeof data !== 'object') return

    // 只处理成功的消息
    if (data.code !== 200) {
      console.warn('⚠️ 收到非成功状态的消息:', data)
      return
    }

    const countdown = data.table_opening_count_down
    if (countdown === undefined || countdown === null) {
      console.warn('⚠️ 收到的消息缺少倒计时数据')
      return
    }

    console.log('📨 收到 WS 消息:', {
      countdown: countdown,
      pai_info: data.pai_info ? '有数据' : '无',
      pai_info_temp: data.pai_info_temp ? '有数据' : '无',
      win_or_loss_info: data.win_or_loss_info
    })

    const gameStore = useGameStore()
    const oldGameStatus = gameStore.gameStatus

    // 1️⃣ 判定并设置游戏状态（每秒都执行）
    const newGameStatus = countdown > 0 ? 'betting' : 'dealing'
    gameStore.updateGameStatus(newGameStatus)
    console.log(`🎮 游戏状态: ${newGameStatus} (countdown: ${countdown})`)

    // 2️⃣ 判定是否需要执行阶段初始化（只在状态变化时）
    if (newGameStatus !== oldGameStatus) {
      console.log(`🔄 状态切换: ${oldGameStatus} → ${newGameStatus}`)

      if (newGameStatus === 'betting') {
        await enterBettingPhase()
      } else if (newGameStatus === 'dealing') {
        await enterDealingPhase()

        // 如果进入 dealing 阶段时就有临时牌数据，立即处理
        if (data.pai_info_temp && data.pai_info_temp !== '') {
          await handleCardDisplay('', data.pai_info_temp)
        }
      }
    }

    // 3️⃣ 更新倒计时显示（所有阶段都更新）
    gameStore.updateCountdown(countdown)

    // 4️⃣ 各函数内部自己判断阶段
    // 只在 DEALING 阶段持续监控牌数据和中奖信息
    if (gameStore.gameStatus === 'dealing') {
      // 持续监控牌数据（每秒检查）
      await handleCardDisplay(data.pai_info || '', data.pai_info_temp || '')

      // 持续监控中奖信息（每秒检查）
      if (data.win_or_loss_info > 0) {
        await handleWinning(data.win_or_loss_info)
      }
    }

  } catch (error) {
    console.error('❌ 处理 WebSocket 消息失败:', error)
  }
}

/**
 * 进入投注阶段
 * @description 新一铺开始，倒计时从 0 → >0
 */
async function enterBettingPhase(): Promise<void> {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🎮 [BETTING] 进入投注阶段')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const gameStore = useGameStore()

  try {
    // 1. 播放投注音效
    await audioService.playAudioFile('bet.wav')
    console.log('🔊 播放投注开始音效')
  } catch (error) {
    console.error('❌ 播放音效失败:', error)
  }

  // 2. 刷新游戏数据（余额、台桌、统计、路珠）
  await updateAllGameData('投注阶段开始')

  // 3. 更新游戏状态
  gameStore.updateGameStatus('betting')

  // 4. 重置处理标记
  gameProcessingState.cardResultProcessed = false
  gameProcessingState.betResultProcessed = false
  gameProcessingState.lastPaiInfo = ''
  gameProcessingState.lastPaiInfoTemp = ''

  console.log('✅ [BETTING] 投注阶段初始化完成')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

/**
 * 进入开牌/结算阶段
 * @description 倒计时结束，从 >0 → 0
 */
async function enterDealingPhase(): Promise<void> {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🎰 [DEALING] 进入开牌阶段')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const gameStore = useGameStore()

  try {
    // 1. 播放停止音效
    await audioService.playAudioFile('stop.wav')
    console.log('🔊 播放投注停止音效')
  } catch (error) {
    console.error('❌ 播放音效失败:', error)
  }

  // 2. 更新游戏状态
  gameStore.updateGameStatus('dealing')

  // 3. 清空临时牌数据（准备接收新数据）
  gameStore.clearTempCardInfo()

  console.log('✅ [DEALING] 开牌阶段初始化完成，开始监控 WS 数据...')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

/**
 * 处理牌数据展示（整合临时牌和最终牌）
 * @param paiInfo - 最终牌数据
 * @param paiInfoTemp - 临时牌数据
 * @description 在 DEALING 阶段持续监控并处理牌数据
 */
async function handleCardDisplay(paiInfo: string, paiInfoTemp: string): Promise<void> {
  const gameStore = useGameStore()
  const overLayerStore = useoverLayerStore()

  // 优先级1: 如果有最终牌数据 pai_info（优先处理）
  if (paiInfo && paiInfo !== '' && paiInfo !== gameProcessingState.lastPaiInfo) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🎴 [牌数据] 收到最终牌数据')

    // 防止重复处理
    if (gameProcessingState.cardResultProcessed) {
      console.log('⚠️  已处理过开牌结果，跳过')
      return
    }

    // 解析开牌数据
    const cardResult = parseCardResultData(paiInfo)

    console.log(`🎯 开牌结果 - 牌型: ${cardResult.cardType}`)
    console.log(`🎯 闪烁区域: [${cardResult.blinkAreas.join(', ')}]`)
    console.log(`🎯 音频序列: [${cardResult.audioFiles.join(', ')}]`)

    // 1. 保存开牌结果
    gameStore.updateGameResult({
      pai_info: paiInfo,
      result: cardResult
    })

    // 2. 刷新游戏数据
    await updateAllGameData('开牌')

    // 3. 显示开牌效果弹窗
    overLayerStore.open('resultFly')

    // 4. 播放开牌音效序列
    if (cardResult.audioFiles.length > 0) {
      try {
        await audioService.playAudioSequence(cardResult.audioFiles, { interval: 500 })
        console.log('🔊 开牌音效序列播放完成')
      } catch (error) {
        console.error('❌ 播放开牌音效失败:', error)
      }
    }

    // 5. 5秒后自动关闭开牌效果
    setTimeout(() => {
      overLayerStore.close()
    }, 5000)

    // 6. 标记已处理
    gameProcessingState.cardResultProcessed = true
    gameProcessingState.lastPaiInfo = paiInfo

    console.log('✅ [牌数据] 最终牌数据处理完成')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  }

  // 优先级2: 如果没有最终牌，但有临时牌 pai_info_temp
  else if (paiInfoTemp && paiInfoTemp !== '' && paiInfoTemp !== gameProcessingState.lastPaiInfoTemp) {
    console.log('🃏 [牌数据] 收到临时牌数据:', paiInfoTemp)

    // 解析并更新临时牌数据
    let parsedData: any = null
    try {
      parsedData = JSON.parse(paiInfoTemp)
    } catch (parseError) {
      console.error('❌ 解析临时牌信息失败:', parseError)
      return
    }

    // 更新 store 中的临时牌状态
    gameStore.updateTempCardInfo({
      pai_info_temp: paiInfoTemp,
      parsed: parsedData
    })

    // 统计有效牌的数量
    let validCardCount = 0
    if (parsedData && typeof parsedData === 'object') {
      Object.values(parsedData).forEach((card: any) => {
        if (card && card !== '0|0' && card !== '0') {
          validCardCount++
        }
      })
    }

    console.log(`✅ [牌数据] 临时牌数据处理完成 - 有效牌数: ${validCardCount}`)

    // 防重
    gameProcessingState.lastPaiInfoTemp = paiInfoTemp
  }
}

/**
 * 处理中奖信息
 * @param winAmount - 中奖金额
 * @description 在 DEALING 阶段持续监控中奖信息
 */
async function handleWinning(winAmount: number): Promise<void> {
  // 只处理大于 0 的中奖金额
  if (winAmount <= 0) return

  // 防重复处理
  if (gameProcessingState.betResultProcessed) {
    console.log('⚠️  中奖信息已处理，跳过')
    return
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🏆 [中奖] 检测到中奖金额:', winAmount)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const gameStore = useGameStore()
  const overLayerStore = useoverLayerStore()

  // 1. 保存中奖信息
  gameStore.updateBetResult({
    win_or_loss_info: winAmount,
    winAmount: winAmount,
    totalWin: winAmount
  })

  // 2. 刷新游戏数据（更新余额）
  await updateAllGameData('中奖信息')

  // 3. 显示中奖效果
  overLayerStore.open('winningEffect')

  // 4. 5秒后自动关闭
  setTimeout(() => {
    overLayerStore.close()
  }, 5000)

  // 5. 标记已处理
  gameProcessingState.betResultProcessed = true

  console.log('💰 中奖金额:', winAmount)
  console.log('✅ [中奖] 中奖信息处理完成')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
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
