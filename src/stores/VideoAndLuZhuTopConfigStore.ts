// src/stores/VideoAndLuZhuTopConfigStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useVideoAndLuZhuTopConfigStore = defineStore('config', () => {
  // ==================== 核心配置 ====================

  // 视频和露珠谁在上面：'LuZhu' | 'Video'
  const videoAndLuZhuWhoIsTop = ref<'LuZhu' | 'Video'>('Video')

  // UserBet展开状态：false = 40%高度，true = 50%高度
  const userBetExpanded = ref(false)

  // VideoAndLuZhu组件高度（根据UserBet状态动态计算）
  const videoAndLuZhuHeight = computed(() => {
    const percentage = userBetExpanded.value ? 50 : 60
    return `${window.innerHeight * percentage / 100}px`
  })

  // UserBet（投注区域）高度（根据展开状态动态计算）
  const userBetHeight = computed(() => {
    const percentage = userBetExpanded.value ? 50 : 40
    return `${window.innerHeight * percentage / 100}px`
  })

  // UserBet的顶部位置
  const userBetTopPosition = computed(() => {
    return userBetExpanded.value ? '50%' : '60%'
  })

  // UserBet的高度百分比
  const userBetHeightPercentage = computed(() => {
    return userBetExpanded.value ? '50%' : '40%'
  })

  // ==================== 计算属性 ====================

  // 判断视频是否在上
  const isVideoOnTop = computed(() => videoAndLuZhuWhoIsTop.value === 'Video')

  // ==================== 方法 ====================

  // 切换位置
  const togglePosition = () => {
    videoAndLuZhuWhoIsTop.value = videoAndLuZhuWhoIsTop.value === 'Video' ? 'LuZhu' : 'Video'
  }

  // 展开/收缩UserBet
  const toggleUserBetExpand = () => {
    userBetExpanded.value = !userBetExpanded.value
  }

  // 设置UserBet展开状态
  const setUserBetExpanded = (expanded: boolean) => {
    userBetExpanded.value = expanded
  }

  // 更新高度（传入百分比，例如 60）- 保留兼容性
  const updateHeights = (percentage: number) => {
    // 如果percentage <= 50，设置为展开状态
    // 如果percentage > 50，设置为默认状态
    userBetExpanded.value = percentage <= 50
  }

  // 监听窗口大小变化，重新计算高度
  const handleResize = () => {
    // 触发计算属性重新计算
    // computed会自动处理
  }

  // 初始化
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize)
  }

  return {
    // 状态
    videoAndLuZhuWhoIsTop,
    userBetExpanded,
    videoAndLuZhuHeight,
    userBetHeight,
    userBetTopPosition,
    userBetHeightPercentage,

    // 计算属性
    isVideoOnTop,

    // 方法
    togglePosition,
    toggleUserBetExpand,
    setUserBetExpanded,
    updateHeights,
  }
})
