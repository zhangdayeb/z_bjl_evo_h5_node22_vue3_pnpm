<template>
  <div class="button-set-container">
    <button
      class="button-set"
      @click="handleClick"
    >
      <span class="button-content">
        <div class="button-base"></div>
        <div class="icon-wrapper">
          <svg viewBox="0 0 24 24" class="icon">
            <path d="M20 6H4v2h16V6Zm0 5H4v2h16v-2ZM4 16h16v2H4v-2Z"/>
          </svg>
        </div>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
// 需要添加的导入
import { useoverLayerStore } from '@/stores/overLayerStore'

// 获取 store 实例
const overLayerStore = useoverLayerStore()

// 关闭方法
const handleClick = () => {
  overLayerStore.open('settingsPanel')
}

</script>

<style scoped>
.button-set-container {
  position: relative;
  display: inline-block;
}

.button-set {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 46px;
  padding: 0;
  background: rgba(26, 26, 26, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 44px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.button-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-base {
  position: absolute;
  inset: 1px;
  border-radius: 44px;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: rgba(255, 255, 255, 1);
}

.icon {
  width: 100%;
  height: 100%;
  fill: currentColor;
}
</style>
