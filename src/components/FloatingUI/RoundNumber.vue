<!-- src/components/FloatingUI/RoundNumber.vue - 完全数据驱动版 -->
<template>
  <div class="round-number">
    <div class="round-container">
      <div class="round-info">
        <div class="round-value">{{ gameStore.gameNumber }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'

// 直接使用 GameStore，无需任何 props 或本地状态
const gameStore = useGameStore()
</script>

<style scoped>
.round-number {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(6px);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  color: white;
  z-index: 15;
  animation: slideInRight 0.3s ease-out;
}

.round-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.round-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.round-value {
  font-size: 12px;
  font-weight: 600;
  color: white;
  line-height: 1.2;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
  min-width: max-content;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .round-number {
    top: 12px;
    right: 12px;
    padding: 6px 10px;
  }

  .round-value {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .round-number {
    top: 10px;
    right: 10px;
    padding: 5px 8px;
  }

  .round-container {
    gap: 6px;
  }

  .round-value {
    font-size: 10px;
    letter-spacing: 0.3px;
  }
}
</style>
