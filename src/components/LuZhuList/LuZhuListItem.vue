<!-- LuZhuListItem.vue - 路珠列表项容器组件 -->
<template>
  <div class="luzhu-list-item">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner">加载中...</div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-overlay">
      <div class="error-message">{{ error }}</div>
      <button @click="fetchGameData" class="retry-button">重试</button>
    </div>

    <!-- 正常内容 -->
    <template v-else>
      <!-- 投注区组件 - 传递 tableId -->
      <LuZhuListItemBet
        :table-id="tableId"
        class="bet-section"
      />

      <!-- 路单显示组件 - 传递 gameData -->
      <LuZhuListItemRoadMap
        :game-data="gameData"
        class="roadmap-section"
      />

      <!-- 统计栏组件 - 传递 gameData -->
      <LuZhuListItemCount
        :game-data="gameData"
        class="count-section"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getGlobalApiService } from '@/services/gameApi'
import LuZhuListItemBet from './LuZhuListItemBet.vue'
import LuZhuListItemRoadMap from './LuZhuListItemRoadMap.vue'
import LuZhuListItemCount from './LuZhuListItemCount.vue'
import type { GameResult } from '@/utils/roadmapCalculator'

// ==================== Props 定义 ====================
interface Props {
  tableId: string | number
}

const props = defineProps<Props>()

// ==================== 状态管理 ====================
const gameData = ref<Record<string, GameResult>>({})
const loading = ref(true)
const error = ref<string>('')

// ==================== API 调用 ====================
/**
 * 获取游戏数据
 */
const fetchGameData = async () => {
  try {
    // 重置错误状态
    error.value = ''

    // 首次加载显示loading
    if (Object.keys(gameData.value).length === 0) {
      loading.value = true
    }

    // 获取 API 服务实例
    const apiService = getGlobalApiService()
    if (!apiService) {
      throw new Error('API服务未初始化，请先初始化网络服务')
    }

    // 调用获取路单数据的API
    console.log(`📊 获取桌台 ${props.tableId} 的路单数据...`)
    const response = await apiService.getLuZhuData(String(props.tableId))

    // 验证返回数据
    if (!response || typeof response !== 'object') {
      throw new Error('返回数据格式错误')
    }

    // 处理返回的数据
    const luZhuData = response.data || response
    const formattedData = formatGameData(luZhuData)

    // 更新游戏数据
    gameData.value = formattedData
    console.log(`✅ 成功获取桌台 ${props.tableId} 的路单数据，共 ${Object.keys(formattedData).length} 条记录`)

  } catch (err) {
    console.error(`❌ 获取桌台 ${props.tableId} 数据失败:`, err)

    // 设置错误信息
    if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = '获取数据失败，请稍后重试'
    }

    // 如果没有数据，使用空对象
    if (Object.keys(gameData.value).length === 0) {
      gameData.value = {}
    }

  } finally {
    loading.value = false
  }
}

/**
 * 格式化游戏数据
 */
const formatGameData = (rawData: any): Record<string, GameResult> => {
  // 如果数据已经是正确格式，直接返回
  if (isValidGameData(rawData)) {
    return rawData
  }

  // 如果是数组格式，转换为对象格式
  if (Array.isArray(rawData)) {
    const formatted: Record<string, GameResult> = {}
    rawData.forEach((item, index) => {
      if (isValidGameResult(item)) {
        formatted[`k${index}`] = {
          result: item.result,
          ext: item.ext || 0
        }
      }
    })
    return formatted
  }

  // 处理对象格式
  const formatted: Record<string, GameResult> = {}
  if (rawData && typeof rawData === 'object') {
    Object.keys(rawData).forEach((key, index) => {
      const item = rawData[key]
      if (isValidGameResult(item)) {
        const formattedKey = key.startsWith('k') ? key : `k${index}`
        formatted[formattedKey] = {
          result: item.result,
          ext: item.ext || 0
        }
      }
    })
  }

  return formatted
}

/**
 * 验证游戏数据格式
 */
const isValidGameData = (data: any): boolean => {
  if (!data || typeof data !== 'object') return false
  return Object.values(data).every(item => isValidGameResult(item))
}

/**
 * 验证单个游戏结果
 */
const isValidGameResult = (item: any): boolean => {
  if (!item || typeof item !== 'object') return false

  // 验证result字段
  const validResults = [1, 2, 3, 4, 6, 7, 8, 9]
  if (!validResults.includes(item.result)) return false

  // 验证ext字段（可选）
  if (item.ext !== undefined) {
    const validExt = [0, 1, 2, 3]
    if (!validExt.includes(item.ext)) return false
  }

  return true
}

// ==================== 生命周期 ====================
onMounted(() => {
  fetchGameData()
})

// ==================== 监听器 ====================
// 监听 tableId 变化，重新获取数据
watch(() => props.tableId, (newTableId, oldTableId) => {
  if (newTableId !== oldTableId) {
    console.log(`🔄 桌台ID变更: ${oldTableId} -> ${newTableId}`)
    fetchGameData()
  }
})

// ==================== 暴露方法 ====================
defineExpose({
  refresh: fetchGameData
})
</script>

<style scoped>
/* 容器样式 */
.luzhu-list-item {
  width: 100%;
  height: 191px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  position: relative;
}

/* 各区域样式 */
.bet-section {
  height: 50px;
  flex-shrink: 0;
  border-bottom: 1px solid #e8e8e8;
}

.roadmap-section {
  height: 108px;
  flex-shrink: 0;
  border-bottom: 1px solid #e8e8e8;
}

.count-section {
  height: 33px;
  flex-shrink: 0;
}

/* 加载状态 */
.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  z-index: 10;
}

.loading-spinner {
  color: #666;
  font-size: 14px;
}

.loading-spinner::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #666;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  vertical-align: middle;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 错误状态 */
.error-message {
  color: #ff4444;
  font-size: 14px;
  margin-bottom: 12px;
  text-align: center;
  padding: 0 20px;
}

.retry-button {
  padding: 6px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background: #40a9ff;
}

.retry-button:active {
  background: #096dd9;
}
</style>
