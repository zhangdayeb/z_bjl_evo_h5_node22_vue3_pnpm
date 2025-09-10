<!-- src/components/Panels/Cashier.vue 收银台 -->
<template>
  <div class="cashier-overlay" @click.self="handleClose">
    <div class="cashier-container">
      <!-- 头部 -->
      <div class="cashier-header">
        <h2 class="cashier-title">收银台</h2>
        <button class="close-button" @click="handleClose">
          <svg viewBox="0 0 24 24" class="close-icon">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>

      <!-- 主体内容 -->
      <div class="cashier-body">
        <!-- 余额显示 -->
        <div class="balance-section">
          <div class="balance-label">当前余额</div>
          <div class="balance-amount">€{{ balance.toLocaleString() }}</div>
        </div>

        <!-- 操作按钮组 -->
        <div class="action-buttons">
          <button class="action-button deposit">
            <svg viewBox="0 0 24 24" class="button-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
            </svg>
            <span>充值</span>
          </button>

          <button class="action-button withdraw">
            <svg viewBox="0 0 24 24" class="button-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2z"/>
            </svg>
            <span>提现</span>
          </button>
        </div>

        <!-- 占位内容 -->
        <div class="placeholder-content">
          <div class="placeholder-icon">💰</div>
          <p class="placeholder-text">收银台功能开发中...</p>
        </div>
      </div>

      <!-- 底部 -->
      <div class="cashier-footer">
        <button class="footer-button" @click="handleClose">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Props
interface Props {
  balance?: number
}

const props = withDefaults(defineProps<Props>(), {
  balance: 0
})

// Emits
const emit = defineEmits<{
  close: []
}>()

// 数据
const balance = ref(props.balance || 931889.82)

// 方法
const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.cashier-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.3s ease;
}

.cashier-container {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease;
}

/* 头部 */
.cashier-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
}

.cashier-title {
  color: white;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.close-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.close-icon {
  width: 20px;
  height: 20px;
  fill: white;
}

/* 主体 */
.cashier-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

/* 余额显示 */
.balance-section {
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-bottom: 24px;
}

.balance-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin-bottom: 8px;
}

.balance-amount {
  color: #ffd700;
  font-size: 32px;
  font-weight: bold;
}

/* 操作按钮 */
.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-button.deposit {
  border-color: rgba(82, 196, 26, 0.3);
  background: rgba(82, 196, 26, 0.1);
}

.action-button.withdraw {
  border-color: rgba(250, 173, 20, 0.3);
  background: rgba(250, 173, 20, 0.1);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.button-icon {
  width: 32px;
  height: 32px;
  fill: currentColor;
}

.action-button span {
  font-size: 14px;
  font-weight: 500;
}

/* 占位内容 */
.placeholder-content {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
}

.placeholder-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.placeholder-text {
  font-size: 16px;
  margin: 0;
}

/* 底部 */
.cashier-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
}

.footer-button {
  padding: 10px 32px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.footer-button:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-1px);
}

/* 滚动条 */
.cashier-body::-webkit-scrollbar {
  width: 6px;
}

.cashier-body::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.cashier-body::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* 动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* 响应式 */
@media (max-width: 480px) {
  .cashier-container {
    width: 95%;
    max-height: 90vh;
  }

  .cashier-body {
    padding: 16px;
  }

  .balance-amount {
    font-size: 24px;
  }

  .action-buttons {
    grid-template-columns: 1fr;
  }
}
</style>
