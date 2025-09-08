<!-- src/components/Layout/UserBet.vue - 第二层：用户投注区域 -->
<template>
  <div class="user-bet-layer" :style="layerStyles">
    <div class="content-wrapper">
      <!-- 投注区域布局 -->
      <div class="betting-area-wrapper">
        <BettingAreaLayout />
      </div>

      <!-- 筹码显示区域 -->
      <div class="chip-display-wrapper">
        <ChipDisplay />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'

// 组件导入
import BettingAreaLayout from '@/components/BetArea/BettingAreaLayout.vue'
import ChipDisplay from '@/components/BetArea/ChipDisplay.vue'

// 使用 configStore
const configStore = useConfigStore()

// 层级容器样式 - 从store读取
const layerStyles = computed(() => {
  return {
    top: configStore.userBetTopPosition,
    height: configStore.userBetHeightPercentage
  }
})

// 暴露方法 - 通过store控制
defineExpose({
  expand: () => {
    configStore.setUserBetExpanded(true)
  },
  collapse: () => {
    configStore.setUserBetExpanded(false)
  },
  toggle: () => {
    configStore.toggleUserBetExpand()
  }
})
</script>

<style scoped>
/* 第二层容器 */
.user-bet-layer {
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 100;
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
  overflow: hidden;
}

/* 投注区域容器 */
.betting-area-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

/* 筹码显示区域容器 */
.chip-display-wrapper {
  flex-shrink: 0;
  padding: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
}

/* 滚动条样式 */
.betting-area-wrapper::-webkit-scrollbar {
  width: 6px;
}

.betting-area-wrapper::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.betting-area-wrapper::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.betting-area-wrapper::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .betting-area-wrapper {
    padding: 8px;
  }

  .chip-display-wrapper {
    padding: 8px;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    box-shadow: 0 -2px 15px rgba(0, 0, 0, 0.5);
  }

  .betting-area-wrapper {
    padding: 6px;
  }

  .chip-display-wrapper {
    padding: 6px;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    border-top-width: 0.5px;
  }

  .betting-area-wrapper {
    padding: 4px;
  }

  .chip-display-wrapper {
    padding: 4px;
  }

  .betting-area-wrapper::-webkit-scrollbar {
    width: 4px;
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

/* 安全区域适配 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .content-wrapper {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .chip-display-wrapper {
    padding-bottom: calc(10px + env(safe-area-inset-bottom));
  }
}

/* 横屏模式优化 */
@media (orientation: landscape) and (max-height: 500px) {
  .betting-area-wrapper {
    padding: 5px;
  }

  .chip-display-wrapper {
    padding: 5px;
  }
}
</style>
