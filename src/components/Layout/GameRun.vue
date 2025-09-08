<!-- src/components/Layout/GameRun.vue -->
<template>
  <div class="game-run-container">
    <!-- 第一层：底层 - 视频和路珠背景层 -->
    <div class="layer-bottom">
      <VideoAndLuZhu />
    </div>

    <!-- 第二层：中间层 - 用户投注操作层 -->
    <div class="layer-middle">
      <UserBet />
    </div>

    <!-- 第三层：顶层 - 弹窗和特效层 -->
    <div class="layer-top">
      <Overlay />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import { useConfigStore } from '@/stores/configStore'

// 导入三层组件
import VideoAndLuZhu from './VideoAndLuZhu.vue'
import UserBet from './UserBet.vue'
import Overlay from './Overlay.vue'

// Stores
const gameStore = useGameStore()
const configStore = useConfigStore()

onMounted(() => {
  console.log('🎮 GameRun 三层布局已加载')

  // ========== 手动配置区域 ==========

  // 配置1：设置视频/露珠位置 ('Video' 或 'LuZhu')
  configStore.videoAndLuZhuWhoIsTop = 'LuZhu'  // 修改这里测试

  // 配置2：设置显示比例 (false: 60%/40%, true: 50%/50%)
  configStore.userBetExpanded = false  // 修改这里测试

  // ========== 配置结束 ==========

  console.log('📐 当前配置:')
  console.log('├─ 顶部显示:', configStore.videoAndLuZhuWhoIsTop)
  console.log('├─ 展开状态:', configStore.userBetExpanded)
  console.log('└─ 显示比例:', configStore.userBetExpanded ? '50%/50%' : '60%/40%')
})
</script>

<style scoped>
/* 游戏运行容器 */
.game-run-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: transparent;
}

/* 三层布局 */
.layer-bottom {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.layer-middle {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}

.layer-top {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 500;
  pointer-events: none;
}

.layer-top :deep(.overlay-system > *) {
  pointer-events: auto;
}

/* 确保内容不会溢出 */
.layer-bottom > *,
.layer-middle > *,
.layer-top > * {
  width: 100%;
  height: 100%;
}
</style>
