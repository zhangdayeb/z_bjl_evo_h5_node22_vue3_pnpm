<template>
  <div class="pc-user-bet-container">
    <!-- 投注区域 - 占据主要空间 -->
    <div class="pc-betting-area-section">
      <BettingAreaLayout />
    </div>

    <!-- 底部控制栏 - 固定高度 -->
    <div class="pc-bottom-controls">
      <!-- 筹码操作栏 -->
      <div class="pc-chip-action-section">
        <ChipAction />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// 组件导入
import BettingAreaLayout from '@/components/pc/BetArea/BettingAreaLayout.vue'
import ChipAction from '@/components/pc/Layout/ChipAction.vue'

// 生命周期
onMounted(() => {
  console.log('[PC-UserBet] PC版投注区域已加载')
})
</script>

<style scoped>
/* PC版投注容器 - 垂直flex布局 */
.pc-user-bet-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* 投注区域 - 占据剩余空间 */
.pc-betting-area-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* 底部控制栏 - 固定高度 */
.pc-bottom-controls {
  flex-shrink: 0;
  width: 100%;
}

/* 筹码操作栏 */
.pc-chip-action-section {
  height: 50px;
}
</style>
