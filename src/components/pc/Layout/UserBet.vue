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

    <!-- 悬浮按钮 - 始终显示 -->
    <ButtonLuZhuList class="pc-floating-button-left" />
    <ButtonSet class="pc-floating-button-right" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

// 组件导入
import BettingAreaLayout from '@/components/pc/BetArea/BettingAreaLayout.vue'
import ChipAction from '@/components/pc/Layout/ChipAction.vue'
import ButtonSet from '@/components/pc/FloatingUI/ButtonSet.vue'
import ButtonLuZhuList from '@/components/pc/FloatingUI/ButtonLuZhuList.vue'

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
  padding: 10px;
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
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* 悬浮按钮位置 */
.pc-floating-button-left {
  position: absolute;
  bottom: 100px;
  left: 10px;
  z-index: 500;
}

.pc-floating-button-right {
  position: absolute;
  bottom: 100px;
  right: 10px;
  z-index: 500;
}
</style>
