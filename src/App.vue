<template>
  <div id="app">
    <!-- 全局配置提供者 -->
    <n-config-provider
      :theme="gameTheme"
      :theme-overrides="themeOverrides"
    >
      <!-- 全局消息提供者 -->
      <n-message-provider>
        <n-notification-provider>
          <!-- 主应用内容 -->
          <div class="app-container">
            <!-- 路由视图 - 根据路由加载 H5 或 PC 版本 -->
            <router-view />
          </div>
        </n-notification-provider>
      </n-message-provider>
    </n-config-provider>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  NConfigProvider,
  NMessageProvider,
  NNotificationProvider,
  darkTheme
} from 'naive-ui'

// 主题配置
const gameTheme = computed(() => darkTheme)

// 主题覆盖配置
const themeOverrides = {
  common: {
    primaryColor: '#27ae60',
    primaryColorHover: '#2ecc71',
    primaryColorPressed: '#229954',

    errorColor: '#e74c3c',
    warningColor: '#f39c12',
    successColor: '#27ae60',

    textColorBase: '#ffffff',
    textColor1: 'rgba(255, 255, 255, 0.95)',
    textColor2: 'rgba(255, 255, 255, 0.82)',

    baseColor: 'rgba(13, 40, 24, 0.95)',
    modalColor: 'rgba(0, 0, 0, 0.9)',
  }
}
</script>

<style scoped>
#app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.app-container {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
