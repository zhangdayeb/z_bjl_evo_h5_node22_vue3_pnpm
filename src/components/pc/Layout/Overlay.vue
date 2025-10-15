<!-- src/components/Layout/Overlay.vue -->
<template>
  <div class="overlay-system">
    <!-- 筹码选择器 -->
    <transition name="panel-fade">
      <ChipSelector v-if="overLayerStore.chipSelector" />
    </transition>

    <!-- 中奖效果 -->
    <transition name="effect-fade">
      <WinningEffect v-if="overLayerStore.winningEffect" />
    </transition>

    <!-- 露珠列表 -->
    <transition name="panel-fade">
      <LuZhuList v-if="overLayerStore.luZhuList" />
    </transition>

    <!-- 设置面板 -->
    <transition name="panel-fade">
      <SettingsPanel v-if="overLayerStore.settingsPanel" />
    </transition>

    <!-- 收银台 -->
    <transition name="panel-fade">
      <Cashier v-if="overLayerStore.cashier" />
    </transition>

    <!-- 筹码飞行动画 -->
    <transition name="effect-fade">
      <ChipFly v-if="overLayerStore.chipFly" />
    </transition>

    <!-- 结果飞行动画 - 始终挂载以监听游戏结果 -->
    <ResultFly />
  </div>
</template>

<script setup lang="ts">
import { useoverLayerStore } from '@/stores/overLayerStore'

// 组件导入
import ChipSelector from '@/components/pc/Panels/ChipSelector.vue'
import WinningEffect from '@/components/pc/Panels/WinningEffect.vue'
import LuZhuList from '@/components/pc/LuZhuList/LuZhuList.vue'
import SettingsPanel from '@/components/pc/Panels/SettingsPanel.vue'
import Cashier from '@/components/pc/Panels/Cashier.vue'
import ChipFly from '@/components/pc/Panels/ChipFly.vue'
import ResultFly from '@/components/pc/Panels/ResultFly.vue'

const overLayerStore = useoverLayerStore()
// overLayerStore.open('chipFly')
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
