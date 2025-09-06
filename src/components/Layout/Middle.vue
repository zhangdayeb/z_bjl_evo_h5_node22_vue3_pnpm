<!-- src/components/Layout/Middle.vue -->
<template>
  <div class="middle-section" :style="middleSectionStyles">
    <!-- 投注区域布局 -->
    <div class="betting-area-wrapper">
      <BettingAreaLayout />
    </div>

    <!-- 筹码显示区域 -->
    <ChipDisplay />

    <!-- 🔥 游戏统计组件 -->
    <GameCount />

  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

// 组件导入
import BettingAreaLayout from '@/components/BetArea/BettingAreaLayout.vue'
import ChipDisplay from '@/components/BetArea/ChipDisplay.vue'
import GameCount from '@/components/BetArea/GameCount.vue'

// Props
interface Props {
  height: number
}

const props = withDefaults(defineProps<Props>(), {
  height: 400
})

// 计算样式
const middleSectionStyles = computed((): CSSProperties => ({
  height: `${props.height}px`,
  // width: '100%',
  display: 'flex',
  flexDirection: 'column',
  // padding: '10px',
  background: 'rgba(255, 255, 255, 0.05)',
  flex: 1,
  overflow: 'hidden'
}))
</script>

<style scoped>
.middle-section {
  display: flex;
  flex-direction: column;
  /* padding: 10px; */
  background: rgba(255, 255, 255, 0.05);
  flex: 1;
  overflow: hidden;
}

.betting-area-wrapper {
  flex: 1;
  overflow: hidden;
  /* margin-right: 10px; */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .middle-section {
    /* padding: 8px; */
  }

  .betting-area-wrapper {
    /* margin-right: 8px; */
  }
}
</style>
