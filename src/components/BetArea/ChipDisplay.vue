<!-- src/components/BetArea/ChipDisplay.vue - 完整修复版：铺满+音效+无滚动条+确认投注 -->
<template>
  <div class="chip-display">
    <!-- 🔥 修复后的布局结构：铺满整个宽度 -->
    <div class="chip-control-layout">
      <!-- 左侧控制按钮组 -->
      <div class="left-controls">
        <!-- 🔥 修改：取消按钮（原撤销按钮） -->
        <button
          class="control-btn cancel-btn"
          :class="{ 'disabled': !canCancel, 'has-bets': betHistoryCount > 0 }"
          :disabled="!canCancel"
          @click="handleCancel"
          title="取消投注"
        >
          <div class="btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </div>
          <span class="btn-text">取消</span>
          <!-- 投注计数指示器 -->
          <div class="bet-count-indicator" v-if="betHistoryCount > 0">{{ betHistoryCount }}</div>
        </button>

        <!-- 重复按钮 -->
        <button
          class="control-btn repeat-btn"
          :class="{ 'disabled': !canRepeat, 'available': canRepeat }"
          :disabled="!canRepeat"
          @click="handleRepeat"
          title="重复上一局投注"
        >
          <div class="btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/>
            </svg>
          </div>
          <span class="btn-text">重复</span>
          <!-- 上次投注金额提示 -->
          <div class="last-bet-amount" v-if="lastBetAmount > 0">{{ formatAmount(lastBetAmount) }}</div>
        </button>
      </div>

      <!-- 🔥 中间筹码选择区域 - 占据剩余空间并居中 -->
      <div class="chip-selection-area">
        <div
          v-for="chip in displayChips"
          :key="chip.id"
          class="chip-item"
          :class="{
            'active': chip.value === currentChip
          }"
          @click="handleChipSelect(chip)"
        >
          <div class="chip-image-container">
            <img
              :src="chip.image"
              :alt="chip.name"
              class="chip-image"
              @error="handleImageError"
            />
          </div>
        </div>
      </div>

      <!-- 右侧控制按钮组 -->
      <div class="right-controls">
        <!-- 🔥 新增：确认投注按钮 -->
        <button
          class="control-btn confirm-btn"
          :class="{
            'disabled': !canConfirm,
            'active': canConfirm,
            'submitting': isSubmitting
          }"
          :disabled="!canConfirm || isSubmitting"
          @click="handleConfirm"
          :title="getConfirmButtonTitle()"
        >
          <div class="btn-icon">
            <svg v-if="!isSubmitting" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <!-- 提交中的加载动画 -->
            <div v-else class="loading-spinner">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
              </svg>
            </div>
          </div>
          <span class="btn-text">{{ getConfirmButtonText() }}</span>
          <!-- 待确认金额提示 -->
          <div class="pending-amount" v-if="totalPendingAmount > 0 && !isSubmitting">
            {{ formatAmount(totalPendingAmount) }}
          </div>
        </button>

        <!-- 免佣按钮 -->
        <button
          class="control-btn control-btn-commission"
          :class="{ 'active': isCommissionFree }"
          @click="handleCommissionToggle"
          :title="isCommissionFree ? '关闭免佣' : '开启免佣'"
        >
          <div class="btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 12 5.5 15.5 8zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
            </svg>
          </div>
          <span class="btn-text">{{ isCommissionFree ? '免佣中' : '免佣' }}</span>
          <!-- 免佣状态指示灯 -->
          <div class="commission-status-dot" v-if="isCommissionFree"></div>
        </button>

        <!-- 更多按钮 -->
        <button
          class="control-btn control-btn-more"
          @click="handleMore"
          title="选择更多筹码"
        >
          <div class="btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
          </div>
          <span class="btn-text">更多</span>
        </button>
      </div>
    </div>

    <!-- 🔥 新增：简单Toast提示 -->
    <div
      v-if="toastMessage"
      class="simple-toast"
      :class="toastType"
      @click="hideToast"
    >
      <div class="toast-content">
        <div class="toast-icon">
          <svg v-if="toastType === 'success'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          <svg v-else-if="toastType === 'error'" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </div>
        <span class="toast-text">{{ toastMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'
import { useUIStore } from '@/stores/uiStore'
// 🔥 修复导入路径，直接从 services/Audio.ts 导入
import { useAudio } from '@/services/Audio'

// 🔥 ChipData 类型定义
interface ChipData {
  id: string | number
  value: number
  name: string
  image: string
  displayValue: string
}

// Props
interface Props {
  chipCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  chipCount: 3
})

// 🔥 新增：Toast相关状态
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')
const isSubmitting = ref(false)

// 🔥 引入 Stores 和 Audio
let bettingStore: any = null
let uiStore: any = null
let audioSystem: any = null

try {
  bettingStore = useBettingStore()
  uiStore = useUIStore()
  audioSystem = useAudio() // 🔥 获取音频系统
} catch (error) {
  console.error('❌ Store 初始化失败:', error)
  // 创建默认对象避免错误
  bettingStore = {
    selectedChip: 10,
    balance: 10000,
    currentBets: {},
    confirmedBets: {},
    lastBets: {},
    totalBetAmount: 0,
    totalPendingAmount: 0,
    availableBalance: 10000,
    bettingPhase: 'betting',
    isCommissionFree: false,
    canConfirm: false,
    canCancel: false,
    getDisplayChipsData: [],
    selectChip: () => {},
    confirmBets: () => Promise.resolve({ success: false, message: 'Store未初始化' }),
    cancelBets: () => {},
    repeatLastBets: () => {},
    toggleCommissionFree: () => {}
  }
  uiStore = {
    openChipSelector: () => {},
    closeChipSelector: () => {}
  }
  audioSystem = {
    playAudioFile: () => Promise.resolve(false)
  }
}

// 🔥 Toast相关方法
const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  toastType.value = type

  // 3秒后自动隐藏
  setTimeout(() => {
    hideToast()
  }, 3000)
}

const hideToast = () => {
  toastMessage.value = ''
}

// 🔥 点击音效播放函数
const playClickSound = async () => {
  try {
    if (audioSystem?.playAudioFile) {
      await audioSystem.playAudioFile('click.mp3')
    }
  } catch (error) {
    console.warn('⚠️ 播放点击音效失败:', error)
  }
}

// 🔥 计算属性 - 完全依赖 bettingStore，增加响应式监听
const displayChips = computed(() => {
  // 🔥 直接使用 bettingStore.getDisplayChipsData，它现在返回完整的 ChipData 对象
  const storeChips = bettingStore?.getDisplayChipsData || []

  // 确保返回的数据格式正确
  if (Array.isArray(storeChips) && storeChips.length > 0) {
    // 检查第一个元素是否包含必要的属性
    const firstChip = storeChips[0]
    if (firstChip && typeof firstChip === 'object' && 'value' in firstChip && 'image' in firstChip) {
      return storeChips.slice(0, props.chipCount)
    }
  }

  // 🔥 如果 store 数据无效，使用 DEFAULT_DISPLAY_CHIPS
  const defaultChips = bettingStore?.DEFAULT_DISPLAY_CHIPS || []
  return defaultChips.slice(0, props.chipCount)
})

const currentChip = computed(() => {
  return bettingStore?.selectedChip || 10
})

const availableBalance = computed(() => {
  return bettingStore?.balance || 0
})

const totalBetAmount = computed(() => {
  return bettingStore?.totalBetAmount || 0
})

// 🔥 新增：确认投注相关计算属性
const totalPendingAmount = computed(() => {
  return bettingStore?.totalPendingAmount || 0
})

const canConfirm = computed(() => {
  return bettingStore?.canConfirm || false
})

const canCancel = computed(() => {
  return bettingStore?.canCancel || false
})

const isCommissionFree = computed(() => {
  return bettingStore?.isCommissionFree || false
})

const canRepeat = computed(() => {
  try {
    const lastBets = bettingStore?.lastBets || {}
    return Object.keys(lastBets).some(key => {
      const amount = lastBets[key]
      return typeof amount === 'number' && amount > 0
    })
  } catch (error) {
    return false
  }
})

const betHistoryCount = computed(() => {
  try {
    const currentBets = bettingStore?.currentBets || {}
    return Object.keys(currentBets).filter(key => {
      const amount = currentBets[key]
      return typeof amount === 'number' && amount > 0
    }).length
  } catch (error) {
    return 0
  }
})

const lastBetAmount = computed(() => {
  try {
    const lastBets = bettingStore?.lastBets || {}
    return Object.values(lastBets).reduce((sum: number, amount: unknown) => {
      const numAmount = typeof amount === 'number' ? amount : 0
      return sum + numAmount
    }, 0)
  } catch (error) {
    return 0
  }
})

// 方法 - 改为纯数字显示
const formatAmount = (amount: number): string => {
  return amount.toString()  // 直接返回数字
}

// 🔥 新增：获取确认按钮标题
const getConfirmButtonTitle = (): string => {
  if (!canConfirm.value) {
    return '没有待确认的投注'
  }
  if (isSubmitting.value) {
    return '投注提交中...'
  }
  return `确认投注 ¥${formatAmount(totalPendingAmount.value)}`
}

// 🔥 新增：获取确认按钮文本
const getConfirmButtonText = (): string => {
  if (isSubmitting.value) {
    return '提交中'
  }
  return '确认'
}

// 🔥 关键修复：筹码选择事件处理 + 音效
const handleChipSelect = async (chip: ChipData) => {
  try {
    // 🔥 播放点击音效
    await playClickSound()

    // 🔥 直接调用 selectChip，确保状态同步
    bettingStore?.selectChip?.(chip.value)

    // 🔥 添加触觉反馈
    if (navigator.vibrate) {
      navigator.vibrate(30)
    }
  } catch (error) {
    console.error('❌ 选择筹码失败:', error)
  }
}

// 🔥 新增：确认投注处理
const handleConfirm = async () => {
  if (!canConfirm.value || isSubmitting.value) return

  try {
    isSubmitting.value = true

    // 🔥 播放点击音效
    await playClickSound()

    console.log('🎯 开始确认投注')

    // 🔥 调用Store的确认投注方法
    const result = await bettingStore?.confirmBets?.()

    if (result?.success) {
      showToast(`投注成功`, 'success')
      console.log('✅ 投注确认成功')
    } else {
      showToast(result?.message || '投注失败', 'error')
      console.error('❌ 投注确认失败:', result?.message)
    }

    // 添加触觉反馈
    if (navigator.vibrate) {
      navigator.vibrate(result?.success ? 100 : 200)
    }

  } catch (error) {
    console.error('❌ 确认投注异常:', error)
    showToast('投注异常，请重试', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// 🔥 修改：取消投注处理（原撤销按钮）
const handleCancel = async () => {
  if (!canCancel.value) return

  try {
    // 🔥 播放点击音效
    await playClickSound()

    // 🔥 调用Store的取消投注方法
    bettingStore?.cancelBets?.()

    showToast('投注已取消', 'success')
    console.log('🚫 投注取消成功')

    // 添加触觉反馈
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  } catch (error) {
    console.error('❌ 取消投注失败:', error)
    showToast('取消失败', 'error')
  }
}

const handleRepeat = async () => {
  if (!canRepeat.value) return

  try {
    // 🔥 播放点击音效
    await playClickSound()

    // 🔥 调用Store的重复投注方法
    const success = bettingStore?.repeatLastBets?.()

    if (success) {
      showToast('重复投注成功', 'success')
      console.log('🔄 重复投注成功')
    } else {
      showToast('重复投注失败', 'error')
      console.log('❌ 重复投注失败')
    }
  } catch (error) {
    console.error('❌ 重复投注失败:', error)
    showToast('重复投注失败', 'error')
  }
}

const handleCommissionToggle = async () => {
  try {
    // 🔥 播放点击音效
    await playClickSound()

    bettingStore?.toggleCommissionFree?.()

    const newStatus = isCommissionFree.value
    showToast(`免佣${newStatus ? '已开启' : '已关闭'}`, 'success')
    console.log(`🎯 免佣状态切换: ${newStatus ? '开启' : '关闭'}`)
  } catch (error) {
    console.error('❌ 免佣状态切换失败:', error)
  }
}

// 🔥 修复：使用 uiStore 打开筹码选择器 + 音效
const handleMore = async () => {
  try {
    // 🔥 播放点击音效
    await playClickSound()

    uiStore?.openChipSelector?.()
    console.log('📱 打开筹码选择器 [通过 uiStore]')

    // 添加触觉反馈
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  } catch (error) {
    console.error('❌ 打开筹码选择器失败:', error)
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/src/assets/images/chips/default.png'
  console.warn('⚠️ 筹码图片加载失败')
}

// 🔥 新增：监听 displayChips 变化，确保当前选中筹码在列表中
watch(displayChips, (newChips) => {
  if (newChips && newChips.length > 0) {
    const currentSelectedChip = currentChip.value
    const isCurrentChipInList = newChips.some(chip => chip.value === currentSelectedChip)

    if (!isCurrentChipInList) {
      console.log(`⚠️ 当前选中筹码 ${currentSelectedChip} 不在新的显示列表中`)
      console.log('🔄 可选筹码:', newChips.map(c => c.value))
    }
  }
}, { immediate: true, deep: true })

// 🔥 新增：监听当前选中筹码变化
watch(currentChip, (newChip, oldChip) => {
  if (newChip !== oldChip) {
    console.log(`🎯 当前选中筹码变化: ${oldChip} → ${newChip}`)
  }
}, { immediate: true })

// 生命周期
onMounted(() => {
  console.log('🎰 筹码显示组件挂载 [确认投注版]', {
    selectedChip: currentChip.value,
    balance: availableBalance.value,
    displayChipsCount: displayChips.value.length,
    displayChipsData: displayChips.value.map(c => ({ value: c.value, id: c.id })),
    canConfirm: canConfirm.value,
    canCancel: canCancel.value,
    totalPendingAmount: totalPendingAmount.value,
    hasUIStore: !!uiStore,
    hasBettingStore: !!bettingStore
  })
})
</script>

<style scoped>
.chip-display {
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(6px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px;
  color: white;
  margin-top: auto;
  flex-shrink: 0;
  height: 64px; /* 固定高度 */
  overflow: hidden; /* 隐藏溢出内容 */
  position: relative; /* 为Toast定位 */
}

/* 🔥 修复后的主布局 - 铺满整个宽度 */
.chip-control-layout {
  display: flex;
  align-items: center;
  gap: 6px; /* 减小间距 */
  justify-content: space-between; /* 🔥 改回 space-between 实现铺满 */
  width: 100%;
  flex-wrap: nowrap; /* 🔥 强制不换行 */
  overflow-x: auto; /* 如果太宽则允许横向滚动 */
}

/* 🔥 左侧按钮组 - 紧凑布局 */
.left-controls {
  display: flex;
  gap: 4px;
  flex-shrink: 0; /* 不允许收缩 */
}

/* 🔥 右侧按钮组 - 紧凑布局，为确认按钮留更多空间 */
.right-controls {
  display: flex;
  gap: 4px;
  flex-shrink: 0; /* 不允许收缩 */
}

/* 🔥 筹码选择区域 - 铺满中间空间 */
.chip-selection-area {
  display: flex;
  align-items: center;
  gap: 6px; /* 减小筹码间距 */
  flex: 1; /* 占据剩余空间 */
  justify-content: center;
  /* 🔥 移除宽度限制，让它铺满中间空间 */
  margin: 0 4px; /* 减小左右留白 */
  flex-shrink: 1; /* 允许适度收缩 */
}

.chip-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px; /* 稍微减小圆角 */
  padding: 6px 4px; /* 减小内边距 */
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  min-width: 50px; /* 减小最小宽度 */
  flex-shrink: 0; /* 防止收缩 */
  position: relative;
}

.chip-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

/* 🔥 选中状态增强 */
.chip-item.active {
  background: rgba(24, 144, 255, 0.2);
  border-color: rgba(24, 144, 255, 0.5);
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.3), 0 6px 20px rgba(24, 144, 255, 0.2);
  transform: scale(1.15);
}

.chip-image-container {
  position: relative;
  width: 52px;
  height: 52px;
  margin-bottom: 6px;
}

.chip-item.active .chip-image-container {
  width: 58px;
  height: 58px;
}

.chip-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 50%;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
}

.chip-item.active .chip-image {
  filter: drop-shadow(0 4px 12px rgba(24, 144, 255, 0.4));
}

.chip-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chip-value {
  font-size: 14px;
  font-weight: 700;
  color: white;
  line-height: 1;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.chip-item.active .chip-value {
  font-size: 16px;
  color: #69c0ff;
}

/* 🔥 控制按钮优化 - 更紧凑 */
.control-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px; /* 减小内部间距 */
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px; /* 减小圆角 */
  padding: 6px 8px; /* 减小内边距 */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  min-width: 48px; /* 减小最小宽度 */
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

/* 🔥 悬停光扫效果 */
.control-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.6s ease;
}

.control-btn:hover:not(.disabled)::before {
  left: 100%;
}

.control-btn:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.control-btn:active:not(.disabled) {
  transform: translateY(0);
}

.control-btn.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.control-btn.disabled:hover {
  transform: none;
  box-shadow: none;
}

/* 🔥 新增：确认按钮特殊样式 */
.confirm-btn {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  min-width: 56px; /* 稍宽一些 */
}

.confirm-btn.active {
  background: rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.4);
  color: #22c55e;
  animation: confirmPulse 2s ease-in-out infinite;
}

.confirm-btn.submitting {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
  color: #60a5fa;
  pointer-events: none;
}

.confirm-btn:hover:not(.disabled):not(.submitting) {
  background: rgba(34, 197, 94, 0.25);
  color: #16a34a;
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.3);
}

/* 🔥 修改：取消按钮样式（原撤销按钮） */
.cancel-btn {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.cancel-btn.has-bets {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  animation: cancelGlow 3s ease-in-out infinite;
}

.cancel-btn:hover:not(.disabled) {
  background: rgba(239, 68, 68, 0.25);
  color: #dc2626;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
}

/* 🔥 特定按钮状态增强 */
.repeat-btn.available {
  background: rgba(82, 196, 26, 0.1);
  border-color: rgba(82, 196, 26, 0.2);
  color: #95de64;
}

.control-btn-commission.active {
  background: rgba(255, 193, 7, 0.2);
  border-color: rgba(255, 193, 7, 0.4);
  color: #ffc107;
  box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.15);
  animation: commissionActive 3s ease-in-out infinite;
}

/* 🔥 更多按钮特殊样式 */
.control-btn-more {
  background: rgba(24, 144, 255, 0.12);
  border-color: rgba(24, 144, 255, 0.25);
  color: #40a9ff;
}

.control-btn-more:hover:not(.disabled) {
  background: rgba(24, 144, 255, 0.25);
  color: #69c0ff;
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.3);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.control-btn:hover:not(.disabled) .btn-icon {
  transform: scale(1.1);
}

/* 🔥 新增：加载动画 */
.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.btn-text {
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  line-height: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* 🔥 指示器和徽章 */
.bet-count-indicator {
  position: absolute;
  top: 0px;
  right: 0px;
  background: #ff4d4f;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  border: 2px solid rgba(0, 0, 0, 0.8);
}

.last-bet-amount {
  position: absolute;
  top: 0px;
  right: 0px;
  /* transform: translateX(-50%); */
  background: rgba(82, 196, 26, 0.9);
  color: white;
  border-radius: 8px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

/* 🔥 新增：待确认金额提示 */
.pending-amount {
  position: absolute;
  top: 0px;
  right: 0px;
  /* transform: translateX(-50%); */
  background: rgba(34, 197, 94, 0.9);
  color: white;
  border-radius: 8px;
  padding: 2px 6px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
  border: 1px solid rgba(0, 0, 0, 0.2);
  /* animation: pendingBlink 2s ease-in-out infinite; */
}

.commission-status-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #52c41a;
  border-radius: 50%;
  animation: statusDotBlink 2s ease-in-out infinite;
}

/* 🔥 新增：简单Toast样式 */
.simple-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  border-radius: 8px;
  z-index: 9999;
  padding: 16px 20px;
  min-width: 200px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  cursor: pointer;
  animation: toastSlideIn 0.3s ease-out;
}

.simple-toast.success {
  border-left: 4px solid #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.simple-toast.error {
  border-left: 4px solid #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

/* 🔥 动画定义 */
@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@keyframes confirmPulse {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(34, 197, 94, 0.4);
  }
}

@keyframes cancelGlow {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
  50% {
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
  }
}

@keyframes commissionActive {
  0%, 100% {
    box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.15);
  }
  50% {
    box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.3);
  }
}

@keyframes statusDotBlink {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes pendingBlink {
  0%, 100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translateX(-50%) scale(1.05);
  }
}

/* 🔥 响应式优化 - 平板端，保持一行 */
@media (max-width: 768px) {
  .chip-display {
    padding: 4px;
    height: 64px;
  }

  .chip-control-layout {
    gap: 4px; /* 进一步减小间距 */
  }

  .chip-selection-area {
    gap: 4px; /* 减小筹码间距 */
    margin: 0 2px;
  }

  .chip-item {
    min-width: 42px;
    padding: 4px 2px;
  }

  .chip-image-container {
    width: 38px;
    height: 38px;
  }

  .chip-item.active .chip-image-container {
    width: 42px;
    height: 42px;
  }

  .chip-value {
    font-size: 11px;
  }

  .chip-item.active .chip-value {
    font-size: 12px;
  }

  .control-btn {
    min-width: 40px;
    padding: 4px 6px;
  }

  .confirm-btn {
    min-width: 46px;
  }

  .btn-icon svg {
    width: 16px;
    height: 16px;
  }

  .btn-text {
    font-size: 9px;
  }

  .simple-toast {
    min-width: 180px;
    padding: 12px 16px;
  }

  .toast-text {
    font-size: 13px;
  }
}

/* 🔥 小屏幕也保持一行 - 极度紧凑 */
@media (max-width: 420px) {
  .chip-display {
    padding: 4px;
    height: 56px;
  }

  .chip-control-layout {
    gap: 2px; /* 最小间距 */
  }

  .chip-selection-area {
    gap: 2px;
    margin: 0 1px;
  }

  .chip-item {
    min-width: 36px;
    padding: 3px 1px;
  }

  .chip-image-container {
    width: 32px;
    height: 32px;
  }

  .chip-item.active .chip-image-container {
    width: 36px;
    height: 36px;
  }

  .chip-value {
    font-size: 10px;
  }

  .control-btn {
    min-width: 36px;
    padding: 3px 4px;
  }

  .confirm-btn {
    min-width: 40px;
  }

  .btn-icon svg {
    width: 14px;
    height: 14px;
  }

  .btn-text {
    font-size: 8px;
  }

  .simple-toast {
    min-width: 160px;
    padding: 10px 14px;
  }

  .toast-text {
    font-size: 12px;
  }
}
</style>
