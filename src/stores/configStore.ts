// src/stores/configStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useConfigStore = defineStore('config', () => {
  // ==================== 核心配置 ====================

  // 视频和露珠谁在上面：'LuZhu' | 'Video'
  const videoAndLuZhuWhoIsTop = ref<'LuZhu' | 'Video'>('LuZhu')

  // VideoAndLuZhu组件高度（默认60%视口高度）
  const videoAndLuZhuHeight = ref(`${window.innerHeight * 0.6}px`)

  // UserBet（投注区域）高度（默认40%视口高度）
  const userBetHeight = ref(`${window.innerHeight * 0.4}px`)

  // ==================== 计算属性 ====================

  // 判断视频是否在上
  const isVideoOnTop = computed(() => videoAndLuZhuWhoIsTop.value === 'Video')

  // ==================== 方法 ====================

  // 切换位置
  const togglePosition = () => {
    videoAndLuZhuWhoIsTop.value = videoAndLuZhuWhoIsTop.value === 'Video' ? 'LuZhu' : 'Video'
  }

  // 更新高度（传入百分比，例如 60）
  const updateHeights = (percentage: number) => {
    const vh = window.innerHeight
    const topHeight = (vh * percentage) / 100
    const bottomHeight = vh - topHeight

    videoAndLuZhuHeight.value = `${topHeight}px`
    userBetHeight.value = `${bottomHeight}px`
  }

  // 监听窗口大小变化，重新计算高度
  const handleResize = () => {
    // 获取当前百分比
    const currentHeight = parseInt(videoAndLuZhuHeight.value)
    const percentage = (currentHeight / window.innerHeight) * 100
    updateHeights(percentage)
  }

  // 初始化
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize)
  }

  return {
    // 状态
    videoAndLuZhuWhoIsTop,
    videoAndLuZhuHeight,
    userBetHeight,

    // 计算属性
    isVideoOnTop,

    // 方法
    togglePosition,
    updateHeights,
  }
})
