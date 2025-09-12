<template>
  <div class="game-section">
    <!-- 加载页面 -->
    <LoadingPage v-if="showLoading" />

    <!-- 维护模式 - 只显示图标 -->
    <div v-if="isMaintenanceMode" class="maintenance-overlay">
      <div class="maintenance-icon-container">
        <div class="maintenance-icon">⚙️</div>
      </div>
    </div>

    <!-- 游戏主界面 - 改为加载 GameRun -->
    <GameRun v-if="!showLoading && !isMaintenanceMode" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 服务和Store
import { initializeNetworkService, cleanupNetworkService } from '@/services/networkService'
import { useGameStore } from '@/stores/gameStore'

// 组件
import LoadingPage from './Load.vue'
import GameRun from './GameRun.vue'

// 获取gameStore
const gameStore = useGameStore()

// 状态
const showLoading = ref(true)  // 显示加载页面

// 计算属性判断是否维护模式
const isMaintenanceMode = computed(() => {
  if(gameStore.tableInfo?.status === 2){
    showLoading.value = false  // 确保加载页面隐藏
    return true
  }else{
    return false
  }
})

// 组件生命周期
onMounted(async () => {
  console.log('🎮 BaseLayout 组件已挂载')

  // 初始化网络服务
  try {
    await initializeNetworkService()
    console.log('✅ 网络服务初始化完成')

    // 检查维护状态
    if (isMaintenanceMode.value) {
      console.warn('⚠️ 台桌维护中，status:', gameStore.tableInfo?.status)
    }
  } catch (error) {
    console.error('❌ 网络服务初始化失败:', error)
  }

  // 3秒后自动隐藏加载页面
  setTimeout(() => {
    showLoading.value = false
    console.log('✅ 加载页面已隐藏，游戏界面激活')
  }, 3000)
})

onUnmounted(() => {
  console.log('🎮 BaseLayout 组件已卸载')

  // 清理网络服务
  cleanupNetworkService()
})
</script>

<style scoped>
/* 容器样式 */
.game-section {
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 维护模式 - 只有图标 */
.maintenance-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.maintenance-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.maintenance-icon {
  font-size: 72px;
  animation: rotate 3s linear infinite;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .maintenance-icon {
    font-size: 60px;
  }
}

@media (max-width: 480px) {
  .maintenance-icon {
    font-size: 52px;
  }
}
</style>
