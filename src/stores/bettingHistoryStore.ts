// src/stores/bettingHistoryStore.ts - 简化版
/**
 * @fileoverview 投注历史记录管理 Store
 * @description 使用 Pinia 组合式 API 管理用户的投注历史记录，支持分页加载和刷新
 * @version 1.0.0 - 简化版，使用标准API数据格式
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getGlobalApiService } from '@/services/gameApi'
import type { BettingHistoryParams } from '@/services/gameApi'

// ========================= 类型定义 =========================

/**
 * 投注记录接口
 * @interface BettingRecord
 * @description 定义单条投注记录的完整数据结构
 */
export interface BettingRecord {
  /** 记录唯一ID */
  id: string

  /** 游戏局号 */
  game_number: number

  /** 桌台ID */
  table_id: string

  /** 用户ID */
  user_id: string

  /** 投注时间 */
  bet_time: string

  /** 结算时间 */
  settle_time: string

  /**
   * 投注详情数组
   * @description 包含该局所有投注项的详细信息
   */
  bet_details: Array<{
    /** 投注类型代码 */
    bet_type: string

    /** 投注类型名称（中文） */
    bet_type_name: string

    /** 投注金额 */
    bet_amount: number

    /** 赔率 */
    odds: string

    /** 赢得金额 */
    win_amount: number

    /** 是否中奖 */
    is_win: boolean

    /** 赔率ID */
    rate_id: number
  }>

  /** 总投注金额 */
  total_bet_amount: number

  /** 总赢得金额 */
  total_win_amount: number

  /** 净输赢金额（赢为正，输为负） */
  net_amount: number

  /**
   * 投注状态
   * @enum {string}
   * - 'win': 已中奖
   * - 'lose': 未中奖
   * - 'pending': 进行中
   */
  status: 'win' | 'lose' | 'pending'

  /** 是否已结算 */
  is_settled: boolean

  /** 货币类型 */
  currency: string
}

// ========================= Store 定义 =========================

/**
 * 投注历史记录 Store
 * @description 使用组合式 API 管理投注历史，支持分页加载和无限滚动
 */
export const useBettingHistoryStore = defineStore('bettingHistory', () => {

  // ========================= 核心状态 =========================

  /**
   * 投注记录数组
   * @type {Ref<BettingRecord[]>}
   */
  const records = ref<BettingRecord[]>([])

  /**
   * 当前页码
   * @type {Ref<number>}
   * @default 1
   */
  const currentPage = ref(1)

  /**
   * 是否还有更多数据
   * @type {Ref<boolean>}
   * @default true
   */
  const hasMore = ref(true)

  /**
   * 加载状态
   * @type {Ref<boolean>}
   * @default false
   */
  const loading = ref(false)

  /**
   * 错误信息
   * @type {Ref<string | null>}
   * @default null
   */
  const error = ref<string | null>(null)

  /**
   * 每页记录数
   * @const
   * @type {number}
   * @description 固定每页加载20条记录
   */
  const pageSize = 20

  // ========================= 计算属性 =========================

  /**
   * 是否为空
   * @computed
   * @returns {boolean} 记录列表是否为空
   */
  const isEmpty = computed(() => records.value.length === 0)

  /**
   * 是否正在加载
   * @computed
   * @returns {boolean} 当前是否正在加载数据
   */
  const isLoading = computed(() => loading.value)

  /**
   * 是否可以加载更多
   * @computed
   * @returns {boolean} 根据状态判断是否允许加载更多数据
   * @description 需要满足：有更多数据、未在加载中、无错误
   */
  const canLoadMore = computed(() => hasMore.value && !loading.value && !error.value)

  /**
   * 总记录数
   * @computed
   * @returns {number} 当前已加载的记录总数
   */
  const totalRecords = computed(() => records.value.length)

  // ========================= 核心方法 =========================

  /**
   * 加载投注记录
   * @async
   * @param {number} page - 页码，默认为1
   * @param {boolean} append - 是否追加模式（用于加载更多）
   * @returns {Promise<void>}
   * @description 从API加载投注记录，支持分页和追加模式
   */
  const loadRecords = async (page: number = 1, append: boolean = false): Promise<void> => {
    try {
      // 设置加载状态
      loading.value = true
      error.value = null

      // 获取API服务和游戏参数
      const apiService = getGlobalApiService()
      const gameParams = apiService.getGameParams()

      // 构造请求参数
      const params: BettingHistoryParams = {
        user_id: parseInt(gameParams.user_id),
        table_id: gameParams.table_id,
        game_type: parseInt(gameParams.game_type),
        page,
        page_size: pageSize
      }

      // 调用API获取数据
      const response = await apiService.getBettingHistory(params)
      const newRecords = response.records || []

      // 更新记录列表
      if (append && page > 1) {
        // 追加模式：添加到现有记录末尾
        records.value = [...records.value, ...newRecords]
      } else {
        // 刷新模式：替换所有记录
        records.value = newRecords
      }

      // 更新分页信息
      currentPage.value = page

      // 更新是否有更多数据的标记
      if (response.pagination) {
        hasMore.value = response.pagination.has_more || false
      } else {
        hasMore.value = false
      }

    } catch (err: any) {
      // 错误处理
      console.error('加载投注记录失败:', err)

      // 设置错误信息
      error.value = err?.message || err?.data?.message || '加载失败'

      // 如果是首页加载失败，清空记录
      if (page === 1) {
        records.value = []
      }
    } finally {
      // 重置加载状态
      loading.value = false
    }
  }

  /**
   * 加载更多记录
   * @async
   * @returns {Promise<void>}
   * @description 加载下一页的记录并追加到列表末尾
   */
  const loadMore = async (): Promise<void> => {
    // 检查是否允许加载更多
    if (!canLoadMore.value) return

    // 加载下一页
    await loadRecords(currentPage.value + 1, true)
  }

  /**
   * 刷新记录
   * @async
   * @returns {Promise<void>}
   * @description 重新从第一页加载记录，替换现有数据
   */
  const refresh = async (): Promise<void> => {
    // 重置到第一页
    currentPage.value = 1
    hasMore.value = true

    // 重新加载第一页
    await loadRecords(1, false)
  }

  /**
   * 重置状态
   * @description 清空所有数据并重置到初始状态
   */
  const reset = (): void => {
    records.value = []
    currentPage.value = 1
    hasMore.value = true
    loading.value = false
    error.value = null
  }

  /**
   * 清除错误
   * @description 清除错误信息
   */
  const clearError = (): void => {
    error.value = null
  }

  // ========================= 工具方法 =========================

  /**
   * 获取状态文本
   * @param {BettingRecord} record - 投注记录
   * @returns {string} 中文状态描述
   * @description 将英文状态转换为中文显示
   */
  const getStatusText = (record: BettingRecord): string => {
    const statusMap = {
      'win': '已中奖',
      'lose': '未中奖',
      'pending': '进行中'
    }
    return statusMap[record.status] || '未知'
  }

  /**
   * 获取开奖结果
   * @param {BettingRecord} record - 投注记录
   * @returns {string} 开奖结果文本
   * @description 从 bet_type_name 中提取 "||" 符号前的内容作为结果显示
   * @example
   * // bet_type_name: "庄||庄对" => 返回 "庄"
   * // bet_type_name: "闲" => 返回 "闲"
   */
  const getBetResult = (record: BettingRecord): string => {
    // 检查数据完整性
    if (record.bet_details && record.bet_details[0] && record.bet_details[0].bet_type_name) {
      const betTypeName = record.bet_details[0].bet_type_name

      // 提取 "||" 前的内容
      const beforePipe = betTypeName.split('||')[0]

      // 如果没有 "||"，返回原始内容
      return beforePipe || betTypeName
    }
    return ''
  }

  // ========================= 初始化方法 =========================

  /**
   * 初始化 Store
   * @async
   * @returns {Promise<void>}
   * @description 重置状态并加载第一页数据
   */
  const init = async (): Promise<void> => {
    // 先重置所有状态
    reset()

    // 加载第一页数据
    await loadRecords(1, false)
  }

  // ========================= 导出 =========================

  return {
    // --------------- 状态 ---------------
    /** 投注记录列表 */
    records,

    /** 当前页码 */
    currentPage,

    /** 是否有更多数据 */
    hasMore,

    /** 加载状态 */
    loading,

    /** 错误信息 */
    error,

    // --------------- 计算属性 ---------------
    /** 列表是否为空 */
    isEmpty,

    /** 是否正在加载 */
    isLoading,

    /** 是否可以加载更多 */
    canLoadMore,

    /** 记录总数 */
    totalRecords,

    // --------------- 核心方法 ---------------
    /** 加载记录 */
    loadRecords,

    /** 加载更多 */
    loadMore,

    /** 刷新数据 */
    refresh,

    /** 重置状态 */
    reset,

    /** 清除错误 */
    clearError,

    /** 初始化 */
    init,

    // --------------- 工具方法 ---------------
    /** 获取状态文本 */
    getStatusText,

    /** 获取开奖结果 */
    getBetResult
  }
})
