// src/stores/gameStore.ts - 删除格式化功能版 + 增加清场功能 + 露珠数据集成
/**
 * @fileoverview 游戏状态管理 Store
 * @description 使用 Pinia 管理百家乐游戏的全局状态，包括用户信息、游戏状态、投注结果、露珠数据等
 * @version 3.0.0 - 新增露珠数据管理功能
 */

import { defineStore } from 'pinia'
import type { TableInfo, UserInfo } from '@/services/gameApi'
import { getGlobalApiService } from '@/services/gameApi'
import roadmapCalculator, {
  type GameResult,
  type RoadmapData
} from '@/utils/roadmapCalculator'

// ========================= 类型定义 =========================

/**
 * 游戏状态枚举
 * @enum {string}
 * @property {string} betting - 投注中状态，玩家可以下注
 * @property {string} dealing - 开牌中状态，停止投注，等待结果
 */
export type GameStatus = 'betting' | 'dealing'

/**
 * 游戏参数接口
 * @interface GameParams
 * @property {string} table_id - 桌台ID
 * @property {string} game_type - 游戏类型
 * @property {string} user_id - 用户ID
 * @property {string} token - 认证令牌
 */
export interface GameParams {
  table_id: string
  game_type: string
  user_id: string
  token: string
}

// ========================= Store 定义 =========================

/**
 * 游戏状态管理 Store
 * @description 管理游戏的核心状态和业务逻辑
 */
export const useGameStore = defineStore('game', {

  // ========================= State 状态定义 =========================
  /**
   * Store 状态
   * @returns {Object} 初始状态对象
   */
  state: () => ({
    // --------------- 用户和桌台信息 ---------------
    /**
     * 用户信息对象
     * @type {UserInfo | null}
     */
    userInfo: null as UserInfo | null,

    /**
     * 桌台信息对象
     * @type {TableInfo | null}
     */
    tableInfo: null as TableInfo | null,

    // --------------- WebSocket 实时数据 ---------------
    /**
     * 游戏倒计时（秒）
     * @type {number}
     * @description WebSocket 推送的实时倒计时
     */
    countdown: 0,

    /**
     * 当前游戏状态
     * @type {GameStatus}
     * @default 'betting'
     */
    gameStatus: 'betting' as GameStatus,

    // --------------- API 数据 ---------------
    /**
     * 游戏局号
     * @type {string}
     * @description 现在直接存储格式化后的局号，不再进行格式化处理
     */
    gameNumber: '',

    /**
     * 用户余额
     * @type {number}
     * @default 0
     */
    balance: 0,

    /**
     * 视频流地址
     * @type {string}
     */
    videoUrl: '',

    /**
     * 台桌名称
     * @type {string}
     * @default '百家乐001'
     */
    tableName: '百家乐001',

    // --------------- 游戏结果数据 ---------------
    /**
     * 开牌结果数据
     * @type {any}
     * @description 包含庄闲牌面、点数等信息
     */
    gameResult: null as any,

    /**
     * 临时牌数据（过程数据）
     * @type {any}
     * @description 倒计时结束后的发牌过程数据，逐步显示牌面
     */
    tempCardInfo: null as any,

    /**
     * 中奖信息
     * @type {any}
     * @description 包含中奖类型、金额等信息
     */
    betResult: null as any,

    // --------------- 统计数据 ---------------
    /**
     * 游戏统计数据
     * @description 记录各种结果出现的次数
     */
    statistics: {
      /** 庄赢次数 */
      zhuang: 0,
      /** 闲赢次数 */
      xian: 0,
      /** 和局次数 */
      he: 0,
      /** 庄对次数 */
      zhuangDui: 0,
      /** 闲对次数 */
      xianDui: 0,
      /** 庄闲对次数 */
      zhuangXianDui: 0
    },

    // --------------- 露珠数据（新增） ---------------
    /**
     * 露珠原始数据
     * @type {Record<string, GameResult>}
     * @description 从API获取的原始游戏历史记录
     */
    luZhuData: {} as Record<string, GameResult>,

    /**
     * 计算后的路单数据
     * @type {RoadmapData | null}
     * @description 经过 roadmapCalculator 计算后的显示数据
     */
    roadmapData: null as RoadmapData | null,

    // --------------- 加载状态标记 ---------------
    /**
     * 余额刷新状态
     * @type {boolean}
     * @description 防止重复请求
     */
    isRefreshingBalance: false,

    /**
     * 统计数据加载状态
     * @type {boolean}
     * @description 防止重复请求
     */
    isLoadingStatistics: false,

    // --------------- 连接状态 ---------------
    /**
     * WebSocket 连接状态
     * @type {boolean}
     */
    isWebSocketConnected: false,

    /**
     * API 服务就绪状态
     * @type {boolean}
     */
    isApiReady: false,

    /**
     * 最后的错误信息
     * @type {string | null}
     */
    lastError: null as string | null,

    // --------------- 游戏参数 ---------------
    /**
     * 游戏初始化参数
     * @type {GameParams}
     */
    gameParams: {
      table_id: '',
      game_type: '',
      user_id: '',
      token: ''
    } as GameParams
  }),

  // ========================= Getters 计算属性 =========================
  getters: {
    /**
     * 统计总数
     * @param {Object} state - Store 状态
     * @returns {number} 庄、闲、和的总次数
     */
    totalStatistics: (state): number => {
      return state.statistics.zhuang + state.statistics.xian + state.statistics.he
    },

    /**
     * 游戏状态文本
     * @param {Object} state - Store 状态
     * @returns {string} 中文状态描述
     */
    gameStatusText: (state): string => {
      switch (state.gameStatus) {
        case 'betting':
          return '投注中'
        case 'dealing':
          return '开牌中'
        default:
          return '开牌中'
      }
    },

    /**
     * WebSocket 连接状态检查
     * @param {Object} state - Store 状态
     * @returns {boolean} 是否已连接
     */
    isConnected: (state): boolean => {
      return state.isWebSocketConnected
    },

    /**
     * 系统就绪状态检查
     * @param {Object} state - Store 状态
     * @returns {boolean} API 和 WebSocket 是否都已就绪
     */
    isReady: (state): boolean => {
      return state.isApiReady && state.isWebSocketConnected
    },

    /**
     * 错误状态检查
     * @param {Object} state - Store 状态
     * @returns {boolean} 是否存在错误
     */
    hasError: (state): boolean => {
      return state.lastError !== null
    },

    /**
     * 露珠数据条数（新增）
     * @param {Object} state - Store 状态
     * @returns {number} 露珠数据总条数
     */
    luZhuCount: (state): number => {
      return Object.keys(state.luZhuData).length
    }
  },

  // ========================= Actions 方法 =========================
  actions: {
    // =================== WebSocket 实时数据更新 ===================

    /**
     * 更新倒计时
     * @param {number} seconds - 倒计时秒数
     * @description 验证并更新游戏倒计时，确保值为有效的非负整数
     */
    updateCountdown(seconds: number) {
      // 验证输入：必须是有效的非负数字
      if (typeof seconds === 'number' && !isNaN(seconds) && seconds >= 0) {
        // 向下取整并确保不小于0
        this.countdown = Math.max(0, Math.floor(seconds))
        console.log(`⏰ WebSocket更新倒计时: ${seconds}秒`)
      }
    },

    /**
     * 更新游戏状态
     * @param {GameStatus} status - 新的游戏状态
     * @description 验证并更新游戏状态，只接受预定义的状态值
     */
    updateGameStatus(status: GameStatus) {
      // 定义有效状态列表
      const validStatuses: GameStatus[] = ['betting', 'dealing']

      // 验证状态是否有效
      if (validStatuses.includes(status)) {
        this.gameStatus = status
        console.log(`🎮 WebSocket更新游戏状态: ${status}`)
      }
    },

    // =================== API 数据更新 ===================

    /**
     * 更新游戏局号
     * @param {string} formattedGameNumber - 格式化后的局号
     * @description 接收并存储已经格式化好的局号
     */
    updateGameNumber(formattedGameNumber: string) {
      // 验证输入：必须是非空字符串
      if (typeof formattedGameNumber === 'string' && formattedGameNumber.trim()) {
        this.gameNumber = formattedGameNumber.trim()
        console.log(`🎯 API更新格式化局号: ${formattedGameNumber}`)
      }
    },

    /**
     * 更新用户余额
     * @param {number} amount - 新的余额金额
     * @description 验证并更新用户余额，确保为非负数
     */
    updateBalance(amount: number) {
      // 验证输入：必须是非负数字
      if (!isNaN(amount) && amount >= 0) {
        this.balance = amount
        console.log(`💰 API更新余额: ${amount}`)
      }
    },

    /**
     * 更新视频地址
     * @param {string} url - 视频流URL
     */
    updateVideoUrl(url: string) {
      if (typeof url === 'string') {
        this.videoUrl = url
        console.log(`📹 API更新视频地址`)
      }
    },

    /**
     * 更新台桌名称
     * @param {string} name - 台桌名称
     */
    updateTableName(name: string) {
      // 验证输入：必须是非空字符串
      if (typeof name === 'string' && name.trim()) {
        this.tableName = name.trim()
        console.log(`🏠 API更新台桌名称: ${name}`)
      }
    },

    /**
     * 更新用户信息
     * @param {UserInfo} userInfo - 用户信息对象
     * @description 更新用户信息并同步更新余额
     */
    updateUserInfo(userInfo: UserInfo) {
      if (userInfo) {
        this.userInfo = userInfo
        // 同时更新余额
        this.balance = userInfo['money_balance']
        console.log(`👤 API更新用户信息`, this.balance)
      }
    },

    /**
     * 更新台桌信息
     * @param {TableInfo} tableInfo - 台桌信息对象
     * @description 更新台桌信息并同步更新台桌名称
     */
    updateTableInfo(tableInfo: TableInfo) {
      if (tableInfo && typeof tableInfo === 'object') {
        this.tableInfo = tableInfo
        // 同时更新台桌名称
        this.tableName = tableInfo.table_title
        console.log(`🏠 API更新台桌信息`)
      }
    },

    // =================== 露珠数据处理（新增） ===================

/**
 * 更新露珠数据
 * @async
 * @param {Record<string, any> | null} data - 露珠原始数据
 * @description 更新露珠数据并自动计算路单
 */
async updateLuZhuData(data: Record<string, any> | null) {
  try {
    // 如果传入数据，直接使用；否则从API获取
    if (data !== null) {
      this.luZhuData = data
    } else {
      // 从API获取数据
      const apiService = getGlobalApiService()
      if (!apiService) {
        console.error('❌ API服务未初始化')
        return
      }

      const apiData = await apiService.getLuZhuData(this.gameParams.table_id)
      this.luZhuData = apiData
    }

    // 数据格式化处理 - 确保 result 和 ext 是数字类型
    const formattedData: Record<string, any> = {}
    Object.keys(this.luZhuData).forEach(key => {
      const item = this.luZhuData[key]
      if (item && typeof item === 'object') {
        // 转换为数字类型，兼容字符串格式
        formattedData[key] = {
          result: parseInt(String(item.result), 10) || 1,
          ext: parseInt(String(item.ext || 0), 10) || 0
        }
      }
    })

    // 使用格式化后的数据计算路单
    if (Object.keys(formattedData).length > 0) {
      try {
        // 尝试计算路单
        this.roadmapData = roadmapCalculator.calculateAll(formattedData)

        console.log(`📊 露珠数据已更新，共 ${Object.keys(formattedData).length} 条记录`)
        console.log(`📈 路单计算完成:`, {
          beadPlate: this.roadmapData?.beadPlate?.length || 0,
          bigRoad: this.roadmapData?.bigRoad?.length || 0,
          bigEyeRoad: this.roadmapData?.bigEyeRoad?.length || 0,
          smallRoad: this.roadmapData?.smallRoad?.length || 0,
          cockroachRoad: this.roadmapData?.cockroachRoad?.length || 0
        })
      } catch (calcError) {
        console.error('⚠️ 路单计算失败，使用空数据:', calcError)

        // 如果计算失败，设置空路单
        this.roadmapData = {
          beadPlate: [],
          bigRoad: [],
          bigEyeRoad: [],
          smallRoad: [],
          cockroachRoad: [],
          sanxing: []
        }
      }
    } else {
      // 无数据时设置为空
      this.roadmapData = {
        beadPlate: [],
        bigRoad: [],
        bigEyeRoad: [],
        smallRoad: [],
        cockroachRoad: [],
        sanxing: []
      }
      console.log('📊 露珠数据为空')
    }

    // 保存原始数据（保持兼容性）
    this.luZhuData = formattedData

  } catch (error) {
    console.error('❌ 露珠数据更新失败:', error)

    // 错误时设置空路单，避免显示异常
    this.roadmapData = {
      beadPlate: [],
      bigRoad: [],
      bigEyeRoad: [],
      smallRoad: [],
      cockroachRoad: [],
      sanxing: []
    }
  }
},

    // =================== 游戏结果处理 ===================

    /**
     * 更新临时牌数据（过程数据）
     * @param {any} data - 临时牌数据
     * @description 更新发牌过程中的临时牌信息，用于逐步显示牌面
     */
    updateTempCardInfo(data: any) {
      if (data && typeof data === 'object') {
        // 深拷贝数据，避免外部修改
        this.tempCardInfo = { ...data }
        console.log(`🃏 更新临时牌数据:`, data)
      }
    },

    /**
     * 清除临时牌数据
     * @description 当最终结果到来时，清空临时数据
     */
    clearTempCardInfo() {
      this.tempCardInfo = null
      console.log(`🧹 清除临时牌数据`)
    },

    /**
     * 更新开牌结果
     * @param {any} data - 开牌结果数据
     * @description 更新开牌结果并自动触发清场操作
     */
    updateGameResult(data: any) {
      if (data && typeof data === 'object') {
        // 深拷贝数据，避免外部修改
        this.gameResult = { ...data }
        console.log(`🎰 更新开牌结果:`, data)

        // 清除临时牌数据（最终结果到来）
        this.clearTempCardInfo()

        // 注意：投注数据清场已移至 bettingStore，在倒计时 0 → >0 时自动清空
      }
    },

    /**
     * 更新中奖信息
     * @param {any} data - 中奖结果数据
     */
    updateBetResult(data: any) {
      if (data && typeof data === 'object') {
        // 深拷贝数据
        this.betResult = { ...data }
        console.log(`🏆 更新中奖信息:`, data)
      }
    },

    /**
     * 清场操作
     * @description 清除投注数据，通过事件机制通知 bettingStore
     * @fires game:clearBetting - 触发清场事件
     */
    clearBettingData() {
      try {
        console.log('🧹 GameStore 触发投注数据清场')

        // 通过自定义事件通知其他 Store
        // 避免直接引用造成循环依赖
        if (typeof window !== 'undefined') {
          const clearEvent = new CustomEvent('game:clearBetting', {
            detail: {
              timestamp: Date.now()
            }
          })
          window.dispatchEvent(clearEvent)
        }

      } catch (error) {
        console.error('❌ 清场操作失败:', error)
      }
    },

    // =================== 统计数据处理 ===================

    /**
     * 更新统计数据
     * @param {any} data - 统计数据对象
     * @description 更新各种游戏结果的统计次数
     */
    updateStatistics(data: any) {
      if (data && typeof data === 'object') {
        this.statistics = {
          zhuang: data.zhuang || 0,
          xian: data.xian || 0,
          he: data.he || 0,
          zhuangDui: data.zhuangDui || 0,
          xianDui: data.xianDui || 0,
          zhuangXianDui: data.zhuangXianDui || 0
        }
        console.log(`📊 更新统计数据:`, this.statistics)
      }
    },

    // =================== 手动刷新功能 ===================

    /**
     * 手动刷新余额
     * @async
     * @description 从API获取最新余额，包含防重复请求和错误处理
     */
    async refreshBalance() {
      // 防止重复请求
      if (this.isRefreshingBalance) {
        console.log('⚠️ 余额正在刷新中，跳过重复请求')
        return
      }

      console.log('🔄 开始手动刷新余额...')
      this.isRefreshingBalance = true

      try {
        // 获取API服务实例
        const apiService = getGlobalApiService()
        if (!apiService) {
          throw new Error('API服务未初始化')
        }

        // 调用用户信息API
        const userInfo = await apiService.getUserInfo()

        if (userInfo) {
          this.updateBalance(userInfo.money_balance)
          console.log('✅ 余额刷新成功:', userInfo.money_balance)
        } else {
          throw new Error('获取的用户信息格式错误')
        }

      } catch (error) {
        console.error('❌ 余额刷新失败:', error)
        this.setError(`余额刷新失败: ${error instanceof Error ? error.message : '未知错误'}`)

        // 3秒后自动清除错误提示
        setTimeout(() => {
          this.clearError()
        }, 3000)
      } finally {
        // 模拟刷新动画，至少显示1秒
        setTimeout(() => {
          this.isRefreshingBalance = false
        }, 1000)
      }
    },

    /**
     * 手动刷新统计数据
     * @async
     * @description 从API获取最新统计数据，包含防重复请求和错误处理
     */
    async refreshStatistics() {
      // 防止重复请求
      if (this.isLoadingStatistics) {
        console.log('⚠️ 统计数据正在刷新中，跳过重复请求')
        return
      }

      console.log('🔄 开始手动刷新统计数据...')
      this.isLoadingStatistics = true

      try {
        // 获取API服务实例
        const apiService = getGlobalApiService()
        if (!apiService) {
          throw new Error('API服务未初始化')
        }

        // 调用统计数据API
        const statistics = await apiService.getCurrentShoeStatistics()

        if (statistics) {
          this.updateStatistics(statistics)
          console.log('✅ 统计数据刷新成功:', statistics)
        } else {
          throw new Error('获取的统计数据为空')
        }

      } catch (error) {
        console.error('❌ 统计数据刷新失败:', error)
        this.setError(`统计数据刷新失败: ${error instanceof Error ? error.message : '未知错误'}`)

        // 3秒后自动清除错误提示
        setTimeout(() => {
          this.clearError()
        }, 3000)
      } finally {
        // 模拟刷新动画，至少显示1秒
        setTimeout(() => {
          this.isLoadingStatistics = false
        }, 1000)
      }
    },

    // =================== 连接状态管理 ===================

    /**
     * 更新WebSocket连接状态
     * @param {boolean} connected - 是否已连接
     */
    updateWebSocketStatus(connected: boolean) {
      this.isWebSocketConnected = connected
      console.log(`🔌 WebSocket连接状态: ${connected}`)
    },

    /**
     * 更新API就绪状态
     * @param {boolean} ready - 是否就绪
     */
    updateApiStatus(ready: boolean) {
      this.isApiReady = ready
      console.log(`🔌 API就绪状态: ${ready}`)
    },

    /**
     * 设置错误信息
     * @param {string | null} error - 错误信息
     */
    setError(error: string | null) {
      this.lastError = error
      if (error) {
        console.error(`❌ 设置错误: ${error}`)
      }
    },

    /**
     * 清除错误信息
     */
    clearError() {
      this.lastError = null
    },

    // =================== 游戏参数管理 ===================

    /**
     * 初始化游戏参数
     * @param {GameParams} params - 游戏初始化参数
     * @description 设置游戏必需的基础参数
     */
    initializeGameParams(params: GameParams) {
      if (params && typeof params === 'object') {
        // 深拷贝参数对象
        this.gameParams = { ...params }
        console.log(`🎮 初始化游戏参数:`, params)
      }
    },

    // =================== 初始化 ===================

    /**
     * 初始化 Store
     * @description 重置所有状态到默认值
     */
    init() {
      console.log('🎮 GameStore 初始化')

      // --------------- 重置用户和桌台信息 ---------------
      this.userInfo = null
      this.tableInfo = null

      // --------------- 重置实时数据 ---------------
      this.countdown = 0
      this.gameStatus = 'betting'

      // --------------- 重置API数据 ---------------
      this.gameNumber = ''
      this.balance = 0
      this.videoUrl = ''
      this.tableName = '百家乐001'

      // --------------- 重置游戏结果 ---------------
      this.gameResult = null
      this.tempCardInfo = null
      this.betResult = null

      // --------------- 重置统计数据 ---------------
      this.statistics = {
        zhuang: 0,
        xian: 0,
        he: 0,
        zhuangDui: 0,
        xianDui: 0,
        zhuangXianDui: 0
      }

      // --------------- 重置露珠数据（新增） ---------------
      this.luZhuData = {}
      this.roadmapData = null

      // --------------- 重置加载状态 ---------------
      this.isRefreshingBalance = false
      this.isLoadingStatistics = false

      // --------------- 重置连接状态 ---------------
      this.isWebSocketConnected = false
      this.isApiReady = false
      this.lastError = null

      // --------------- 重置游戏参数 ---------------
      this.gameParams = {
        table_id: '',
        game_type: '',
        user_id: '',
        token: ''
      }

      console.log('✅ GameStore 初始化完成')
    }
  }
})
