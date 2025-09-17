<!-- src/components/Layout/Overlay.vue -->
<template>
  <div class="overlay-system">
    <!-- 筹码选择器 -->
    <transition name="panel-fade">
      <ChipSelector
        v-if="uiStore.chipSelector"
        @close="uiStore.close"
      />
    </transition>

    <!-- 中奖效果 -->
    <transition name="effect-fade">
      <WinningEffect
        v-if="uiStore.winningEffect"
        @close="uiStore.close"
      />
    </transition>

    <!-- 露珠列表 -->
    <transition name="panel-fade">
      <LuZhuList
        v-if="uiStore.luZhuList"
        @close="uiStore.close"
      />
    </transition>

    <!-- 设置面板 -->
    <transition name="panel-fade">
      <SettingsPanel
        v-if="uiStore.settingsPanel"
        @close="uiStore.close"
      />
    </transition>

    <!-- 收银台 -->
    <transition name="panel-fade">
      <Cashier
        v-if="uiStore.cashier"
        @close="uiStore.close"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/uiStore'

// 组件导入
import ChipSelector from '@/components/Panels/ChipSelector.vue'
import WinningEffect from '@/components/Panels/WinningEffect.vue'
import LuZhuList from '@/components/Panels/LuZhuList.vue'
import SettingsPanel from '@/components/Panels/SettingsPanel.vue'
import Cashier from '@/components/Panels/Cashier.vue'

const uiStore = useUIStore()

// ESC 关闭当前面板
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    uiStore.close()
  }
}

onMounted(() => {
  uiStore.open('winningEffect') // 测试用，初始打开筹码选择器
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.overlay-system {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 9999;
}

.overlay-system > * {
  pointer-events: auto;
}

/* 面板过渡动画 */
.panel-fade-enter-active,
.panel-fade-leave-active {
  transition: all 0.3s ease;
}

.panel-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.panel-fade-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

/* 特效过渡动画 */
.effect-fade-enter-active,
.effect-fade-leave-active {
  transition: all 0.3s ease;
}

.effect-fade-enter-from,
.effect-fade-leave-to {
  opacity: 0;
}
</style>
