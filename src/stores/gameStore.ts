// src/stores/gameStore.ts - 删除格式化功能版 + 增加清场功能
import { defineStore } from 'pinia'
import type { TableInfo, UserInfo } from '@/services/gameApi'
import { getGlobalApiService } from '@/services/gameApi'

// 游戏状态类型 - 只保留两个状态
export type GameStatus = 'betting' | 'dealing'

// 游戏参数类型
export interface GameParams {
 table_id: string
 game_type: string
 user_id: string
 token: string
}

export const useGameStore = defineStore('game', {
 state: () => ({
    // 用户信息 - 类型为 UserInfo 或 null
    userInfo: null as UserInfo | null,

    // 桌子信息
    tableInfo: null as TableInfo | null,

   // WebSocket 实时数据
   countdown: 0,
   gameStatus: 'betting' as GameStatus,

   // API 数据
   gameNumber: '', // 🔥 现在直接存储格式化后的局号
   balance: 0,
   videoUrl: '',
   tableName: '百家乐001',

   // 🔥 新增：游戏结果数据
   gameResult: null as any,
   betResult: null as any,

   // 🔥 新增：统计数据
   statistics: {
     zhuang: 0,          // 庄的次数
     xian: 0,            // 闲的次数
     he: 0,              // 和的次数
     zhuangDui: 0,       // 庄对的次数
     xianDui: 0,         // 闲对的次数
     zhuangXianDui: 0    // 庄闲对的次数
   },

   // 🔥 新增：加载状态
   isRefreshingBalance: false,  // 余额刷新状态
   isLoadingStatistics: false, // 统计数据加载状态

   // 连接状态
   isWebSocketConnected: false,
   isApiReady: false,
   lastError: null as string | null,

   // 游戏参数
   gameParams: {
     table_id: '',
     game_type: '',
     user_id: '',
     token: ''
   } as GameParams
 }),

 getters: {
   // 🔥 新增：统计总数
   totalStatistics: (state): number => {
     return state.statistics.zhuang + state.statistics.xian + state.statistics.he
   },

   // 游戏状态文本
   gameStatusText: (state): string => {
     switch (state.gameStatus) {
       case 'betting': return '投注中'
       case 'dealing': return '开牌中'
       default: return '开牌中'
     }
   },

   // 连接状态检查
   isConnected: (state): boolean => {
     return state.isWebSocketConnected
   },

   isReady: (state): boolean => {
     return state.isApiReady && state.isWebSocketConnected
   },

   hasError: (state): boolean => {
     return state.lastError !== null
   }
 },

 actions: {
   // =================== WebSocket 实时数据更新 ===================

   // 更新倒计时
   updateCountdown(seconds: number) {
     if (typeof seconds === 'number' && !isNaN(seconds) && seconds >= 0) {
       this.countdown = Math.max(0, Math.floor(seconds))
       console.log(`⏰ WebSocket更新倒计时: ${seconds}秒`)
     }
   },

   // 更新游戏状态
   updateGameStatus(status: GameStatus) {
     const validStatuses: GameStatus[] = ['betting', 'dealing']
     if (validStatuses.includes(status)) {
       this.gameStatus = status
       console.log(`🎮 WebSocket更新游戏状态: ${status}`)
     }
   },

   // =================== API 数据更新 ===================

   // 🔥 修改：更新游戏局号（现在接收格式化后的局号）
   updateGameNumber(formattedGameNumber: string) {
     if (typeof formattedGameNumber === 'string' && formattedGameNumber.trim()) {
       this.gameNumber = formattedGameNumber.trim()
       console.log(`🎯 API更新格式化局号: ${formattedGameNumber}`)
     }
   },

   // 更新用户余额
   updateBalance(amount: number) {
     if (!isNaN(amount) && amount >= 0) {
       this.balance = amount
       console.log(`💰 API更新余额: ${amount}`)
     }
   },

   // 更新视频地址
   updateVideoUrl(url: string) {
     if (typeof url === 'string') {
       this.videoUrl = url
       console.log(`📹 API更新视频地址`)
     }
   },

   // 更新台桌名称
   updateTableName(name: string) {
     if (typeof name === 'string' && name.trim()) {
       this.tableName = name.trim()
       console.log(`🏠 API更新台桌名称: ${name}`)
     }
   },

   // 更新用户信息
   updateUserInfo(userInfo: UserInfo) {
     if (userInfo) {
       this.userInfo = userInfo
       this.balance = userInfo['money_balance']
       console.log(`👤 API更新用户信息`,this.balance)
     }
   },

   // 更新台桌信息
   updateTableInfo(tableInfo: TableInfo) {
     if (tableInfo && typeof tableInfo === 'object') {
       this.tableInfo = tableInfo  // ✅ 添加这一行
       this.tableName = tableInfo.table_title
       console.log(`🏠 API更新台桌信息`)
     }
   },

   // =================== 🔥 新增：游戏结果处理 ===================

   // 🔥 修改：更新开牌结果 + 同时执行清场
   updateGameResult(data: any) {
     if (data && typeof data === 'object') {
       this.gameResult = { ...data }
       console.log(`🎰 更新开牌结果:`, data)

       // 🔥 同时执行清场操作
       this.clearBettingData()
     }
   },

   // 更新中奖信息
   updateBetResult(data: any) {
     if (data && typeof data === 'object') {
       this.betResult = { ...data }
       console.log(`🏆 更新中奖信息:`, data)
     }
   },

   // 🔥 新增：清场方法
   clearBettingData() {
     try {
       // 通过事件或者直接访问 bettingStore 来执行清场
       // 这里先通过事件方式，避免循环依赖
       console.log('🧹 GameStore 触发投注数据清场')

       // 发送自定义事件，让 bettingStore 监听并执行清场
       if (typeof window !== 'undefined') {
         const clearEvent = new CustomEvent('game:clearBetting', {
           detail: { timestamp: Date.now() }
         })
         window.dispatchEvent(clearEvent)
       }

     } catch (error) {
       console.error('❌ 清场操作失败:', error)
     }
   },

   // =================== 🔥 新增：统计数据处理 ===================

   // 更新统计数据
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

   // =================== 🔥 新增：手动刷新功能 ===================

   // 🔥 手动刷新余额
   async refreshBalance() {
     if (this.isRefreshingBalance) {
       console.log('⚠️ 余额正在刷新中，跳过重复请求')
       return
     }

     console.log('🔄 开始手动刷新余额...')
     this.isRefreshingBalance = true

     try {
       const apiService = getGlobalApiService()
       if (!apiService) {
         throw new Error('API服务未初始化')
       }

       // 调用用户信息API获取最新余额
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

       // 3秒后清除错误
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

   // 🔥 手动刷新统计数据
   async refreshStatistics() {
     if (this.isLoadingStatistics) {
       console.log('⚠️ 统计数据正在刷新中，跳过重复请求')
       return
     }

     console.log('🔄 开始手动刷新统计数据...')
     this.isLoadingStatistics = true

     try {
       const apiService = getGlobalApiService()
       if (!apiService) {
         throw new Error('API服务未初始化')
       }

       // 调用统计数据API获取最新数据
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

       // 3秒后清除错误
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

   // 更新WebSocket连接状态
   updateWebSocketStatus(connected: boolean) {
     this.isWebSocketConnected = connected
     console.log(`🔌 WebSocket连接状态: ${connected}`)
   },

   // 更新API就绪状态
   updateApiStatus(ready: boolean) {
     this.isApiReady = ready
     console.log(`🔌 API就绪状态: ${ready}`)
   },

   // 设置错误信息
   setError(error: string | null) {
     this.lastError = error
     if (error) {
       console.error(`❌ 设置错误: ${error}`)
     }
   },

   // 清除错误
   clearError() {
     this.lastError = null
   },

   // =================== 游戏参数管理 ===================

   // 初始化游戏参数
   initializeGameParams(params: GameParams) {
     if (params && typeof params === 'object') {
       this.gameParams = { ...params }
       console.log(`🎮 初始化游戏参数:`, params)
     }
   },

   // =================== 初始化 ===================

   // 初始化Store
   init() {
     console.log('🎮 GameStore 初始化')

     // 重置为默认状态
     this.countdown = 0
     this.gameStatus = 'betting'
     this.gameNumber = ''
     this.balance = 0
     this.videoUrl = ''
     this.tableName = '百家乐001'
     this.gameResult = null
     this.betResult = null
     this.statistics = {
       zhuang: 0,
       xian: 0,
       he: 0,
       zhuangDui: 0,
       xianDui: 0,
       zhuangXianDui: 0
     }
     this.isRefreshingBalance = false
     this.isLoadingStatistics = false
     this.isWebSocketConnected = false
     this.isApiReady = false
     this.lastError = null
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
