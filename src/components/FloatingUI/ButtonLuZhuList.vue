<template>
  <div class="button-luzhu-container">
    <button
      class="button-luzhu"
      @click="handleClick"
    >
      <span class="button-content">
        <div class="button-base"></div>
        <div class="icon-wrapper">
          <svg class="icon" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              fill="currentColor"
              d="M12.0042 6.35163C10.8048 6.35163 9.63338 5.98849 8.64424 5.31C7.25248 5.35955 5.93717 5.95901 4.98674 6.97692C4.03631 7.99483 3.52835 9.34811 3.57424 10.74C3.56892 12.128 4.11453 13.4614 5.09131 14.4476C6.06809 15.4337 7.39624 15.9921 8.78424 16H15.2242C16.6114 15.9894 17.938 15.4303 18.9142 14.4447C19.8905 13.4591 20.4369 12.1272 20.4342 10.74C20.4801 9.34811 19.9722 7.99483 19.0217 6.97692C18.0713 5.95901 16.756 5.35955 15.3642 5.31C14.3751 5.98849 13.2037 6.35163 12.0042 6.35163ZM15.5742 17.31H8.43424V17.33C7.57978 17.3209 6.73551 17.1433 5.94973 16.8076C5.16395 16.4718 4.45209 15.9844 3.85487 15.3733C3.25765 14.7621 2.78679 14.0392 2.46924 13.2459C2.15169 12.4526 1.99368 11.6044 2.00424 10.75C1.94204 9.02551 2.56601 7.34668 3.73942 6.08143C4.91282 4.81618 6.53995 4.06769 8.26424 4H8.44424V4.48C9.49614 5.18892 10.7358 5.56764 12.0042 5.56764C13.2727 5.56764 14.5123 5.18892 15.5642 4.48V4H15.7442C17.4685 4.07286 19.0941 4.8243 20.2667 6.09056C21.4393 7.35681 22.0638 9.03523 22.0042 10.76C22.0176 12.4805 21.3482 14.1361 20.1429 15.3639C18.9376 16.5917 17.2947 17.2915 15.5742 17.31ZM19.944 16.9077C18.7586 18.019 17.199 18.6444 15.5742 18.66H8.43424C6.80292 18.6566 5.2333 18.0361 4.04059 16.9231C2.84788 15.8102 2.1204 14.2872 2.00424 12.66V13.42C1.98556 15.1449 2.65223 16.8067 3.85783 18.0404C5.06343 19.2741 6.70939 19.9789 8.43424 20H15.5742C17.2956 19.971 18.9354 19.2614 20.1348 18.0264C21.3343 16.7913 21.9956 15.1315 21.9742 13.41V12.66C21.854 14.2804 21.1293 15.7964 19.944 16.9077Z"
            />
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
  overLayerStore.open('luZhuList')
}
</script>

<style scoped>
.button-luzhu-container {
  position: relative;
  display: inline-block;
}

.button-luzhu {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  background: rgba(26, 26, 26, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
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
  width: 22px;
  height: 22px;
  color: rgba(255, 255, 255, 0.8);
}

.icon {
  width: 100%;
  height: 100%;
  fill: currentColor;
}
</style>
