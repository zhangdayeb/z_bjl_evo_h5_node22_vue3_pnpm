<!-- src/components/Layout/Middle.vue -->
<template>
  <div class="middle-section" :style="middleSectionStyles">
    <!-- 投注区域布局 -->
    <div class="betting-area-wrapper">
      <BettingAreaLayout />
    </div>

    <!-- 筹码显示区域 -->
    <ChipDisplay />
  </div>
</template>

<script setup lang="ts">
import { computed, type CSSProperties } from 'vue'

// 组件导入
import BettingAreaLayout from '@/components/BetArea/BettingAreaLayout.vue'
import ChipDisplay from '@/components/BetArea/ChipDisplay.vue'

// Props
interface Props {
  height?: number
  bottom?: number  // 距离底部的距离
  zIndex?: number  // 层级控制
}

const props = withDefaults(defineProps<Props>(), {
  height: 200,    // 默认高度
  bottom: 0,      // 默认贴底
  zIndex: 10      // 默认层级
})

// 计算样式
const middleSectionStyles = computed((): CSSProperties => ({
  height: `${props.height}px`,
  bottom: `${props.bottom}px`,
  zIndex: props.zIndex
}))
</script>

<style scoped>
/* 固定在底部的投注区域 */
.middle-section {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.85) 50%,
    rgba(0, 0, 0, 0.75) 100%
  );
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
}

/* 投注区域容器 */
.betting-area-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  overflow: hidden;
}

/* 悬停效果 */
.middle-section:hover {
  background: linear-gradient(to top,
    rgba(0, 0, 0, 0.98) 0%,
    rgba(0, 0, 0, 0.9) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
}

/* ==================== 响应式设计 ==================== */

/* 平板端 */
@media (max-width: 1024px) {
  .middle-section {
    height: 280px !important; /* 平板上稍微减小高度 */
  }

  .betting-area-wrapper {
    padding: 8px;
  }
}

/* 移动端 */
@media (max-width: 768px) {
  .middle-section {
    height: 240px !important; /* 移动端进一步减小高度 */
    box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.5);
  }

  .betting-area-wrapper {
    padding: 6px;
  }
}

/* 小屏幕手机 */
@media (max-width: 480px) {
  .middle-section {
    height: 200px !important; /* 小屏幕最小高度 */
    border-top-width: 0.5px;
  }

  .betting-area-wrapper {
    padding: 4px;
  }
}

/* ==================== 动画效果 ==================== */

/* 进入动画 */
.middle-section {
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 深色主题优化 */
@media (prefers-color-scheme: dark) {
  .middle-section {
    background: linear-gradient(to top,
      rgba(0, 0, 0, 0.98) 0%,
      rgba(0, 0, 0, 0.9) 50%,
      rgba(0, 0, 0, 0.8) 100%
    );
    border-top-color: rgba(255, 255, 255, 0.08);
  }
}

/* 安全区域适配（针对有刘海或底部横条的设备） */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .middle-section {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
