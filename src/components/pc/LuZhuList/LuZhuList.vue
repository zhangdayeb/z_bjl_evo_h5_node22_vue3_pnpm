<template>
  <div class="lu-zhu-list-container">
    <!-- 加载组件 - 显示1秒 -->
    <LuZhuListLoad v-if="showLoading" />

    <!-- 主内容组件 - 1秒后显示 -->
    <LuZhuListLoadMain v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import LuZhuListLoad from './LuZhuListLoad.vue'
import LuZhuListLoadMain from './LuZhuListLoadMain.vue'

// 控制显示状态
const showLoading = ref<boolean>(true)

// 定时器引用
let timer: number | null = null

// 组件挂载时启动定时器
onMounted(() => {
  timer = window.setTimeout(() => {
    showLoading.value = false
  }, 1000) // 1秒后切换
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
})
</script>

<style scoped>
.lu-zhu-list-container {
  width: 100%;
  height: 100%;
}
</style>
