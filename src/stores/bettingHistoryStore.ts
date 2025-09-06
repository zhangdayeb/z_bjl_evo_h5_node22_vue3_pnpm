// src/stores/bettingHistoryStore.ts - 简化版
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getGlobalApiService } from '@/services/gameApi'
import type { BettingHistoryParams } from '@/services/gameApi'

// 使用标准的API数据格式
export interface BettingRecord {
  id: string
  game_number: number
  table_id: string
  user_id: string
  bet_time: string
  settle_time: string
  bet_details: Array<{
    bet_type: string
    bet_type_name: string
    bet_amount: number
    odds: string
    win_amount: number
    is_win: boolean
    rate_id: number
  }>
  total_bet_amount: number
  total_win_amount: number
  net_amount: number
  status: 'win' | 'lose' | 'pending'
  is_settled: boolean
  currency: string
}

export const useBettingHistoryStore = defineStore('bettingHistory', () => {
  // 核心状态
  const records = ref<BettingRecord[]>([])
  const currentPage = ref(1)
  const hasMore = ref(true)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 固定每页大小
  const pageSize = 20

  // 计算属性
  const isEmpty = computed(() => records.value.length === 0)
  const isLoading = computed(() => loading.value)
  const canLoadMore = computed(() => hasMore.value && !loading.value && !error.value)
  const totalRecords = computed(() => records.value.length)

  // 加载记录
  const loadRecords = async (page: number = 1, append: boolean = false): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const apiService = getGlobalApiService()
      const gameParams = apiService.getGameParams()

      const params: BettingHistoryParams = {
        user_id: parseInt(gameParams.user_id),
        table_id: gameParams.table_id,
        game_type: parseInt(gameParams.game_type),
        page,
        page_size: pageSize
      }

      const response = await apiService.getBettingHistory(params)
      const newRecords = response.records || []

      // 更新记录
      if (append && page > 1) {
        records.value = [...records.value, ...newRecords]
      } else {
        records.value = newRecords
      }

      // 更新分页信息
      currentPage.value = page
      if (response.pagination) {
        hasMore.value = response.pagination.has_more || false
      } else {
        hasMore.value = false
      }

    } catch (err: any) {
      console.error('加载投注记录失败:', err)
      error.value = err?.message || err?.data?.message || '加载失败'

      if (page === 1) {
        records.value = []
      }
    } finally {
      loading.value = false
    }
  }

  // 加载更多
  const loadMore = async (): Promise<void> => {
    if (!canLoadMore.value) return
    await loadRecords(currentPage.value + 1, true)
  }

  // 刷新
  const refresh = async (): Promise<void> => {
    currentPage.value = 1
    hasMore.value = true
    await loadRecords(1, false)
  }

  // 重置状态
  const reset = (): void => {
    records.value = []
    currentPage.value = 1
    hasMore.value = true
    loading.value = false
    error.value = null
  }

  // 清除错误
  const clearError = (): void => {
    error.value = null
  }

  // 获取状态文本
  const getStatusText = (record: BettingRecord): string => {
    const statusMap = {
      'win': '已中奖',
      'lose': '未中奖',
      'pending': '进行中'
    }
    return statusMap[record.status] || '未知'
  }

  // 获取开奖结果 - 从 bet_type_name 中提取到 || 前的内容
  const getBetResult = (record: BettingRecord): string => {
    if (record.bet_details && record.bet_details[0] && record.bet_details[0].bet_type_name) {
      const betTypeName = record.bet_details[0].bet_type_name
      const beforePipe = betTypeName.split('||')[0]
      return beforePipe || betTypeName
    }
    return ''
  }

  // 初始化
  const init = async (): Promise<void> => {
    reset()
    await loadRecords(1, false)
  }

  return {
    // 状态
    records,
    currentPage,
    hasMore,
    loading,
    error,

    // 计算属性
    isEmpty,
    isLoading,
    canLoadMore,
    totalRecords,

    // 方法
    loadRecords,
    loadMore,
    refresh,
    reset,
    clearError,
    init,

    // 工具方法
    getStatusText,
    getBetResult
  }
})
