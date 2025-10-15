<!-- SettingsPanel.vue -->
<template>
  <div class="menu-drawer">
    <!-- Handle Bar -->
    <div class="handle-bar">
      <div class="bar"></div>
    </div>

    <!-- Header -->
    <div class="menu-header">
      <div class="menu-title">Menu</div>
      <button class="close-button"  @click="handleClose">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="m13.615 11.864 6.116 6.116-1.748 1.747-6.115-6.116-6.12 6.12L4 17.984l6.12-6.12-6.116-6.117L5.75 4l6.117 6.116 6.112-6.112 1.747 1.748-6.112 6.112Z"/>
        </svg>
      </button>
    </div>

    <!-- Menu Cards Grid -->
    <div class="menu-cards">
      <div class="menu-card active">
        <svg class="menu-card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M18.8 11.363c-9.4.48-10.58-2.34-12.8-7.28a8.62 8.62 0 0 1 12.8 7.28Zm-11.64 6c1.49-2.85 4-5.34 11.64-4.75A8.618 8.618 0 0 1 6 19.903c.38-.85.74-1.73 1.16-2.55v.01Z"/>
        </svg>
        <div class="menu-card-title">Lobby</div>
      </div>

      <div class="menu-card">
        <svg class="menu-card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm2.77 8.02-.36 1.51H9.16v.83h5.13l-.36 1.51H9.35c.25.88.72 1.51 1.43 1.94.56.31 1.18.47 1.86.47.93 0 1.65-.22 2.12-.66l.42-.39v2.25l-.15.06c-.73.31-1.5.47-2.27.47-2.51 0-4.16-.94-5.05-2.88a6.39 6.39 0 0 1-.39-1.19H5.99l.36-1.51h.79v-.83H6.05l.36-1.51h.9c.35-1.52 1.25-2.69 2.62-3.38.87-.46 1.86-.7 2.94-.7.98 0 1.88.22 2.6.65l.17.1-.52 1.76-.29-.22a3.26 3.26 0 0 0-2.02-.68c-.81 0-1.5.19-2.09.57-.31.19-.59.48-.89.94-.2.3-.35.61-.44.9h5.37l.01-.01Z"/>
        </svg>
        <div class="menu-card-title">Cashier</div>
      </div>

      <div class="menu-card">
        <svg class="menu-card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M5 4h10.5c.55 0 1 .45 1 1v7c0 .55-.45 1-1 1H10l-3.99 3v-3H5c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1Zm12.99 17v-3H19c.55 0 1-.45 1-1v-7c0-.55-.45-1-1-1h-1v3.5c0 1.1-.9 2-2 2h-5.5l-3 2.31V17c0 .55.45 1 1 1H14l3.99 3Z"/>
        </svg>
        <div class="menu-card-title">Chat</div>
      </div>

      <div class="menu-card">
        <svg class="menu-card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M16.74 8.208c-.005-1.46-.515-2.682-1.46-3.528-.86-.76-2.02-1.18-3.27-1.18-2.28 0-4.74 1.48-4.74 4.74v5.99c0 2.375 1.314 3.81 2.911 4.41a.105.105 0 0 1 .035-.045 2 2 0 1 1-.09 1.607C7.756 19.511 5.77 17.49 5.77 14.23H4c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1l1.77.005C5.772 4.148 8.911 2 12.01 2c3.09 0 6.22 2.126 6.24 6.2h1.74c.55 0 1 .45 1 1v4.03c0 .55-.45 1-1 1h-3.25V8.208Z"/>
        </svg>
        <div class="menu-card-title">Live Support</div>
      </div>

      <div class="menu-card">
        <svg class="menu-card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M10.77 3.6c2.16-.33 4.37.19 6.16 1.45l-.04-.02a8.5 8.5 0 1 1-11.66 12.1l1.59-1.21a6.5 6.5 0 1 0-.1-7.74l1.42 1.38-5.64 1.49L3.88 5.4l1.44 1.4a8.51 8.51 0 0 1 5.45-3.2Z"/>
          <path d="M11.33 12.32V7.49h1.5v4.2l3.05 3.05-1.06 1.06-3.5-3.48Z"/>
        </svg>
        <div class="menu-card-title">Game History</div>
      </div>

      <div class="menu-card">
        <svg class="menu-card-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M18.79 12a7.178 7.178 0 0 0-.19-1.62l2-1.15-2-3.47-2 1.16a6.86 6.86 0 0 0-2.8-1.63V3h-4v2.29A7 7 0 0 0 7 6.92L5 5.76 3 9.23l2 1.15a6.62 6.62 0 0 0 0 3.23l-2 1.15 2 3.47 2-1.15a7.09 7.09 0 0 0 2.8 1.62V21h4v-2.3a7 7 0 0 0 2.8-1.62l2 1.15 2-3.47-2-1.15a7.154 7.154 0 0 0 .19-1.61Zm-7 4a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z"/>
        </svg>
        <div class="menu-card-title">Settings</div>
      </div>
    </div>

    <!-- Menu List Items -->
    <div class="menu-list">
      <div class="menu-item">
        <svg class="menu-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2Zm1 16h-2v-1.59h2V18Zm1.92-6.03-.86.88c-.61.62-.93.97-1.01 2.15l-2.01-.03c0-1.05.43-1.9 1.12-2.6l1.18-1.2c.35-.34.56-.82.56-1.35 0-1.05-.86-1.91-1.91-1.91-.96 0-1.76.94-1.89 1.91H8.19c.14-2 1.78-3.82 3.8-3.82 2.02 0 3.82 1.71 3.82 3.82 0 .84-.34 1.6-.89 2.15Z"/>
        </svg>
        <div class="menu-item-title">How To Play</div>
      </div>

      <div class="menu-item">
        <svg class="menu-item-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path fill="#fff" d="M2.576 6.35c.327 0 .57-.24.57-.57v-.37l-.108-1.607 1.199 1.26L5.72 6.557a.538.538 0 0 0 .4.166c.352 0 .607-.239.607-.591a.589.589 0 0 0-.172-.415l-1.49-1.488L3.8 3.037l1.619.109h.405a.557.557 0 0 0 .576-.57A.559.559 0 0 0 5.825 2h-2.88C2.347 2 2 2.347 2 2.943V5.78c0 .327.244.57.576.57Zm5.6 5.65h2.88c.596 0 .944-.347.944-.944V8.221a.56.56 0 0 0-.576-.57.553.553 0 0 0-.57.57v.368l.108 1.607-1.199-1.26L8.28 7.443a.54.54 0 0 0-.405-.166c-.352 0-.607.239-.607.591 0 .161.063.306.177.415l1.49 1.488 1.265 1.192-1.619-.109h-.405a.555.555 0 0 0-.576.57.56.56 0 0 0 .576.576Z"/>
        </svg>
        <div class="menu-item-title">How to enter fullscreen</div>
      </div>

      <div class="menu-item">
        <svg class="menu-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="m8.94 6.97 2.18 2.18 1.06-1.06L8.09 4 4 8.09l1.06 1.06 2.18-2.18v8.04h1.7V6.97Zm8 10.07 2.18-2.18 1.06 1.06-4.09 4.09L12 15.92l1.06-1.06 2.18 2.18V9h1.7v8.04Z"/>
        </svg>
        <div class="menu-item-title">Payouts & Limits</div>
      </div>

      <div class="menu-item">
        <svg class="menu-item-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M11.995 3 3.31 11.3a.986.986 0 0 0-.29.513.956.956 0 0 0 .06.58c.08.183.215.34.389.45.173.11.377.167.585.166h1.655V21h4.19v-5.794h4.191V21h4.19v-7.991h1.666c.208.001.412-.057.585-.167a1.01 1.01 0 0 0 .389-.449c.08-.183.1-.385.06-.58a.985.985 0 0 0-.29-.512L11.995 3Z"/>
        </svg>
        <div class="menu-item-title">Home</div>
      </div>
    </div>

    <!-- Sound Control Button -->
    <div class="sound-control">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M2 9v6a1 1 0 0 0 1 1h5l5 5V3L8 8H3a1 1 0 0 0-1 1Z"/>
        <circle fill="transparent" cx="10" cy="50%" stroke="currentColor" stroke-width="1.5" r="7" opacity="0.8" stroke-dasharray="8.79 35.18" stroke-dashoffset="4.39"/>
        <circle fill="transparent" cx="10" cy="50%" stroke="currentColor" stroke-width="1.5" r="11" opacity="0.6" stroke-dasharray="15.20 53.90" stroke-dashoffset="7.60"/>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
// 需要添加的导入
import { useoverLayerStore } from '@/stores/overLayerStore'

// 获取 store 实例
const overLayerStore = useoverLayerStore()

// 关闭方法
const handleClose = () => {
  overLayerStore.close()
}
</script>

<style scoped>
.menu-drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #2a2a2a;
  border-radius: 24px 24px 0 0;
  padding: 20px;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
  max-height: 85vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease-out;
}

/* Handle Bar */
.handle-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  padding-top: 8px;
}

.bar {
  width: 40px;
  height: 4px;
  background: #555;
  border-radius: 2px;
}

/* Header */
.menu-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 8px;
  position: relative;
}

.menu-title {
  font-size: 22px;
  font-weight: 500;
  color: #fff;
  text-align: center;
}

.close-button {
  position: absolute;
  right: 8px;
  top: 0;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button svg {
  width: 24px;
  height: 24px;
}

/* Menu Cards Grid */
.menu-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.menu-card {
  background: #3a3a3a;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 90px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.menu-card:hover {
  background: #4a4a4a;
  transform: scale(1.02);
}

.menu-card.active {
  background: #3a3a3a;
}

.menu-card.active .menu-card-icon {
  fill: #00d4ff;
}

.menu-card.active .menu-card-title {
  color: #00d4ff;
}

.menu-card-icon {
  width: 32px;
  height: 32px;
  margin-bottom: 8px;
  fill: #fff;
}

.menu-card-title {
  font-size: 14px;
  color: #fff;
  text-align: center;
}

/* Menu List Items */
.menu-list {
  border-top: 1px solid #3a3a3a;
  padding-top: 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 14px 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  border-radius: 8px;
}

.menu-item:hover {
  background: #3a3a3a;
}

.menu-item-icon {
  width: 28px;
  height: 28px;
  margin-right: 16px;
  fill: #fff;
  opacity: 0.8;
}

.menu-item-title {
  font-size: 16px;
  color: #fff;
  opacity: 0.9;
}

/* Sound Control */
.sound-control {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: #3a3a3a;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s ease;
}

.sound-control:hover {
  background: #4a4a4a;
}

.sound-control svg {
  width: 24px;
  height: 24px;
  fill: #fff;
}

/* Scrollbar styling */
.menu-drawer::-webkit-scrollbar {
  width: 4px;
}

.menu-drawer::-webkit-scrollbar-track {
  background: transparent;
}

.menu-drawer::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 2px;
}

/* Animation */
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

/* Responsive design */
@media (max-width: 768px) {
  .menu-drawer {
    max-height: 85vh;
    padding: 16px;
  }

  .menu-cards {
    gap: 10px;
  }

  .menu-card {
    padding: 12px;
    min-height: 80px;
  }

  .menu-card-icon {
    width: 28px;
    height: 28px;
  }

  .menu-card-title {
    font-size: 13px;
  }

  .menu-item {
    padding: 12px 6px;
  }

  .menu-item-icon {
    width: 24px;
    height: 24px;
    margin-right: 12px;
  }

  .menu-item-title {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .menu-drawer {
    border-radius: 20px 20px 0 0;
  }

  .handle-bar {
    margin-bottom: 16px;
  }

  .menu-header {
    margin-bottom: 20px;
  }

  .sound-control {
    width: 40px;
    height: 40px;
  }

  .sound-control svg {
    width: 20px;
    height: 20px;
  }
}
</style>
