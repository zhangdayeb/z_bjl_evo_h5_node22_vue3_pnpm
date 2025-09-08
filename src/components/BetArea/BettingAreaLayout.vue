<!-- src/components/BetArea/BettingAreaLayout.vue -->
<template>
  <div class="betting-area-layout">
    <!-- 主要投注区域 -->
    <div class="main-betting-zones">
      <!-- 第一排：边注区域 -->
      <div class="betting-row first-row">
        <BaseBetZone
          v-for="config in firstRowZones"
          :key="config.id"
          :config="config"
          :ref="(el) => setZoneRef(config.id, el)"
          class="zone-item side-bet"
        />
      </div>

      <!-- 第二排：主要投注区域 -->
      <div class="betting-row second-row">
        <BaseBetZone
          v-for="config in secondRowZones"
          :key="config.id"
          :config="config"
          :ref="(el) => setZoneRef(config.id, el)"
          class="zone-item main-bet"
        />
      </div>
    </div>

    <!-- 状态提示框 -->
    <div class="status-toast" v-if="statusMessage" :class="statusType">
      {{ statusMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useBettingStore } from '@/stores/bettingStore'
import { useGameStore } from '@/stores/gameStore'
import BaseBetZone from './BaseBetZone.vue'
import { getZonesByCategory, type BetZoneConfig } from '@/configs/betZoneConfigs'

const bettingStore = useBettingStore()
const gameStore = useGameStore()

// 状态提示
const statusMessage = ref('')
const statusType = ref<'success' | 'error' | 'info'>('info')

// 组件引用管理
const zoneRefs = ref<Record<string, any>>({})

// 🎯 配置驱动的区域列表 - 添加防护检查
const firstRowZones = computed((): BetZoneConfig[] => {
  try {
    return getZonesByCategory('first-row') || []
  } catch (error) {
    console.warn('❌ 获取第一排投注区域配置失败:', error)
    return []
  }
})

const secondRowZones = computed((): BetZoneConfig[] => {
  try {
    return getZonesByCategory('second-row') || []
  } catch (error) {
    console.warn('❌ 获取第二排投注区域配置失败:', error)
    return []
  }
})

// 🔧 工具方法
const setZoneRef = (zoneId: string, el: any) => {
  if (el && zoneId) {
    zoneRefs.value[zoneId] = el
  }
}

const showGlobalMessage = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  if (!message) return

  statusMessage.value = message
  statusType.value = type

  setTimeout(() => {
    statusMessage.value = ''
  }, 3000)
}


// 🎮 游戏状态监听 - 添加安全的可选链操作
watch(() => gameStore.gameStatus, (newStatus, oldStatus) => {
  try {
    console.log('🎮 游戏状态变化:', oldStatus, '→', newStatus)
  } catch (error) {
    console.error('❌ 监听游戏状态变化时发生错误:', error)
  }
}, {
  // 添加 flush: 'sync' 确保同步执行
  flush: 'sync'
})

// 🎮 额外的安全检查：监听 Store 初始化状态
watch(() => gameStore.isReady, (isReady) => {
  if (isReady) {
    console.log('✅ GameStore 已就绪，BettingAreaLayout 可以正常工作')
  } else {
    console.log('⏳ 等待 GameStore 初始化...')
  }
})

// 🎯 初始化
onMounted(() => {
  try {
    // 初始化投注store - 添加防护检查
    if (bettingStore && typeof bettingStore.init === 'function') {
      bettingStore.init()
    } else {
      console.warn('❌ BettingStore 初始化方法不可用')
    }

    // 检查 GameStore 状态
    console.log('🔍 组件挂载时 GameStore 状态:', {
      isReady: gameStore.isReady,
      gameStatus: gameStore.gameStatus,
      isConnected: gameStore.isConnected
    })

    showGlobalMessage('音频暂时没有开启', 'info')
  } catch (error) {
    console.error('❌ BettingAreaLayout 初始化失败:', error)
    showGlobalMessage('投注区域初始化失败', 'error')
  }
})
</script>

<style scoped>
/* 🎯 布局容器 */
.betting-area-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  container-type: inline-size; /* 🔥 启用容器查询 */
}

.main-betting-zones {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  overflow: hidden;
}

/* 🎯 行布局 */
.betting-row {
  display: flex;
  gap: 4px;
  overflow: hidden;
}

.first-row {
  flex: 1; /* 🔥 第一排占较少空间 */
  min-height: 50px;
}

.second-row {
  flex: 1; /* 🔥 第二排占主要空间 */
  min-height: 80px;
}

/* 🎯 区域项目 */
.zone-item {
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
  max-width: calc(100% - 4px);
  flex-shrink: 1;
}

.side-bet {
  /* 边注区域特殊样式 */
}

.main-bet {
  /* 主要投注区域特殊样式 */
}

/* 🎯 状态提示 */
.status-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  z-index: 1000;
  animation: slideDown 0.3s ease-out;
  border: 1px solid;
}

.status-toast.success {
  border-color: #2ecc71;
  background: rgba(46, 204, 113, 0.1);
  backdrop-filter: blur(4px);
}

.status-toast.error {
  border-color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  backdrop-filter: blur(4px);
}

.status-toast.info {
  border-color: #3498db;
  background: rgba(52, 152, 219, 0.1);
  backdrop-filter: blur(4px);
}

/* 🎬 动画 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 📱 响应式适配 */
@media (max-width: 768px) {
  .betting-area-layout {
    padding: 0px;
  }

  .main-betting-zones {
    gap: 3px;
  }

  .betting-row {
    gap: 3px;
  }

  .first-row {
    flex: 1;
    min-height: 45px;
  }

  .second-row {
    flex: 1.1;
    min-height: 70px;
  }
}

@media (max-width: 480px) {
  .betting-area-layout {
    padding: 0px;
  }

  .main-betting-zones {
    gap: 2px;
  }

  .betting-row {
    gap: 2px;
  }

  .first-row {
    flex: 1;
    min-height: 40px;
  }

  .second-row {
    flex: 1.2;
    min-height: 65px;
  }
}

/* 🔧 容器查询 (现代浏览器支持) */
@container (max-width: 400px) {
  .betting-row {
    gap: 2px;
  }

  .zone-item {
    font-size: 10px;
  }
}

@container (max-width: 300px) {
  .betting-row {
    gap: 1px;
  }
}
</style>
