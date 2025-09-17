<!-- src/components/Panels/Deposit.vue 充值页面 -->
<template>
  <div class="overlay">
    <div class="modal">
      <!-- 关闭按钮 -->
      <button class="close-btn"></button>

      <!-- 顶部装饰图片区 -->
      <div class="header-image"></div>

      <!-- 标题栏 -->
      <div class="header">MAKE DEPOSIT</div>

      <!-- 内容区 -->
      <div class="content">
        <!-- 支付方式选择 -->
        <div class="form-section">
          <label class="form-label">Choose payment method</label>
          <div class="select-box">Click to select</div>
        </div>

        <!-- 支付金额 -->
        <div class="form-section">
          <label class="form-label">Payment amount</label>
          <div class="amount-section">
            <span class="currency-symbol">€</span>
            <input
              type="number"
              class="amount-input"
              placeholder="0"
              inputmode="numeric"
            >
          </div>
          <div class="quick-amounts">
            <button class="quick-amount-btn">€5</button>
            <button class="quick-amount-btn">€10</button>
            <button class="quick-amount-btn">€20</button>
          </div>
        </div>

        <!-- 持卡人姓名和卡号 -->
        <div class="card-row">
          <div class="input-group">
            <label class="input-label">Name on card</label>
            <input
              type="text"
              class="text-input"
              placeholder="NAME SURNAME"
              autocapitalize="words"
            >
          </div>
          <div class="input-group">
            <label class="input-label">Card number</label>
            <div class="card-number-input">
              <input
                type="text"
                class="text-input"
                placeholder="0000 0000 0000 0000"
                inputmode="numeric"
                maxlength="19"
              >
              <div class="card-icon"></div>
            </div>
          </div>
        </div>

        <!-- 有效期和安全码 -->
        <div class="card-row">
          <div class="input-group">
            <label class="input-label">Expiry date</label>
            <input
              type="text"
              class="text-input"
              placeholder="mm/yyyy"
              inputmode="numeric"
            >
          </div>
          <div class="input-group">
            <label class="input-label">Security code</label>
            <div class="security-input">
              <input
                type="text"
                class="text-input"
                placeholder="xxx"
                inputmode="numeric"
                maxlength="4"
              >
              <div class="help-icon">?</div>
            </div>
          </div>
        </div>

        <!-- 提交按钮 -->
        <button class="submit-btn">PROCEED WITH PAYMENT</button>
      </div>

      <!-- 底部余额显示 -->
      <div class="footer">
        Balance: <span class="balance-text">€881,217.16</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 纯静态展示，暂无逻辑
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 背景遮罩 */
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000;
}

/* 模态框主体 - 移动端全宽 */
.modal {
  position: fixed;
  top: 5vh;
  left: 0;
  right: 0;
  width: 100%;
  height: 90vh;
  background: #f5f5f5;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

/* 关闭按钮 */
.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.3s;
}

.close-btn:hover,
.close-btn:active {
  background: rgba(0, 0, 0, 0.8);
}

.close-btn::before,
.close-btn::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 2px;
  background: white;
}

.close-btn::before {
  transform: rotate(45deg);
}

.close-btn::after {
  transform: rotate(-45deg);
}

/* 顶部图片区域 */
.header-image {
  height: 70px;
  background: linear-gradient(135deg, #8B9DC3 0%, #5B7FA6 100%);
  position: relative;
}

/* 标题栏 */
.header {
  background: #5B7FA6;
  color: white;
  padding: 18px 20px;
  font-size: 17px;
  font-weight: 500;
  letter-spacing: 0.8px;
}

/* 内容区域 */
.content {
  flex: 1;
  padding: 25px 20px;
  background: white;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

/* 表单部分 */
.form-section {
  margin-bottom: 28px;
}

.form-label {
  color: #333;
  font-size: 16px;
  margin-bottom: 12px;
  display: block;
}

.select-box {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  color: #999;
  font-size: 15px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

/* 金额输入区 */
.amount-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}

.currency-symbol {
  font-size: 20px;
  color: #333;
  padding: 0 12px;
  font-weight: 500;
}

.amount-input {
  flex: 1;
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 17px;
  -webkit-appearance: none;
}

/* 快捷金额按钮 */
.quick-amounts {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}

.quick-amount-btn {
  flex: 1;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 25px;
  background: white;
  color: #666;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
  -webkit-tap-highlight-color: transparent;
}

.quick-amount-btn:active {
  background: #f0f0f0;
  border-color: #5B7FA6;
  transform: scale(0.98);
}

/* 卡片信息输入 */
.card-row {
  display: flex;
  gap: 15px;
  margin-bottom: 22px;
}

.input-group {
  flex: 1;
}

.input-label {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  display: block;
}

.text-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  -webkit-appearance: none;
}

.text-input::placeholder {
  color: #bbb;
}

.text-input:focus {
  outline: none;
  border-color: #5B7FA6;
}

/* 卡号输入特殊样式 */
.card-number-input {
  position: relative;
}

.card-number-input input {
  padding-right: 55px;
}

.card-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 25px;
  background: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCA0MCAyNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTQiIGN5PSIxMi41IiByPSIxMSIgZmlsbD0iI0VCMDAxQiIvPgo8Y2lyY2xlIGN4PSIyNiIgY3k9IjEyLjUiIHI9IjExIiBmaWxsPSIjRkZBNTAwIiBvcGFjaXR5PSIwLjkiLz4KPC9zdmc+') no-repeat center;
  background-size: contain;
}

/* 安全码输入 */
.security-input {
  position: relative;
}

.help-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  background: #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: help;
  font-size: 13px;
  color: #666;
  font-weight: 600;
}

/* 提交按钮 */
.submit-btn {
  width: 100%;
  padding: 18px;
  background: #5B7FA6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0.8px;
  cursor: pointer;
  transition: all 0.3s;
  -webkit-tap-highlight-color: transparent;
  margin-top: 10px;
}

.submit-btn:active {
  background: #4a6b8a;
  transform: scale(0.98);
}

/* 底部余额栏 */
.footer {
  background: #1a1a1a;
  color: #888;
  padding: 15px 20px;
  font-size: 15px;
  display: flex;
  align-items: center;
}

.balance-text {
  color: #f39c12;
  font-weight: 600;
  margin-left: 5px;
}

/* 滚动条 */
.content::-webkit-scrollbar {
  width: 6px;
}

.content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 3px;
}

.content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

/* 动画 */
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

/* 移动端适配 */
@media screen and (max-width: 380px) {
  .content {
    padding: 20px 15px;
  }

  .card-row {
    flex-direction: column;
    gap: 20px;
  }

  .quick-amounts {
    gap: 8px;
  }

  .quick-amount-btn {
    font-size: 14px;
    padding: 10px 8px;
  }
}
</style>
