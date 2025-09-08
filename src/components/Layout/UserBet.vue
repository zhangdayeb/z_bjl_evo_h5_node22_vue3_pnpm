<!-- src/components/Layout/UserBet.vue - 第二层：用户投注区域 -->
<template>
  <div class="user-bet-layer">
    <div class="content-wrapper" :style="contentStyles">
      <!-- 投注区域布局 -->
      <div class="betting-area-wrapper">
        <BettingAreaLayout />
      </div>

      <!-- 筹码显示区域 -->
      <ChipDisplay />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useConfigStore } from '@/stores/configStore'

// 组件导入
import BettingAreaLayout from '@/components/BetArea/BettingAreaLayout.vue'
import ChipDisplay from '@/components/BetArea/ChipDisplay.vue'

// 使用 configStore
const configStore = useConfigStore()

// 动画状态（后续可以控制覆盖比例）
const isExpanded = ref(false)

// 计算内容样式
const contentStyles = computed(() => {
  // 默认状态：向下移动60%，只显示下部40%
  // 展开状态：移动到0，覆盖整个屏幕
  const topPosition = isExpanded.value ? 0 : 60

  return {
    transform: `translateY(${topPosition}%)`,
    transition: 'transform 0.3s ease-in-out'
  }
})

// 暴露方法供外部调用
defineExpose({
  // 展开到全屏
  expand: () => {
    isExpanded.value = true
  },
  // 收缩到默认位置
  collapse: () => {
    isExpanded.value = false
  },
  // 切换展开/收缩状态
  toggle: () => {
    isExpanded.value = !isExpanded.value
  }
})
</script>

<style scoped>
/* 第二层容器 - 占满100%高度 */
.user-bet-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100; /* 第二层起始z-index */
  overflow: hidden;
}

/* 内容包装器 */
.content-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top,
    rgba(0, 0, 0, 0.95) 0%,
    rgba(0, 0, 0, 0.85) 50%,
    rgba(0, 0, 0, 0.75) 100%
  );
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
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
.content-wrapper:hover {
  background: linear-gradient(to top,
    rgba(0, 0, 0, 0.98) 0%,
    rgba(0, 0, 0, 0.9) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
}

/* ==================== 响应式设计 ==================== */

/* 平板端 */
@media (max-width: 1024px) {
  .betting-area-wrapper {
    padding: 8px;
  }
}

/* 移动端 */
@media (max-width: 768px) {
  .content-wrapper {
    box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.5);
  }

  .betting-area-wrapper {
    padding: 6px;
  }
}

/* 小屏幕手机 */
@media (max-width: 480px) {
  .content-wrapper {
    border-top-width: 0.5px;
  }

  .betting-area-wrapper {
    padding: 4px;
  }
}

/* ==================== 动画效果 ==================== */

/* 进入动画 */
.content-wrapper {
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(60%);
    opacity: 1;
  }
}

/* 深色主题优化 */
@media (prefers-color-scheme: dark) {
  .content-wrapper {
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
  .content-wrapper {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
