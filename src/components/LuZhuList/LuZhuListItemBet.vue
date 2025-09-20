<!-- LuZhuListItemBet.vue - 快捷投注静态展示组件 -->
<template>
  <div class="bet-container">
    <!-- 闲家对子 -->
    <div class="bet-spot player-pair">
      <div class="bet-background"></div>
      <span class="bet-label">闲对</span>
    </div>

    <!-- 闲家 -->
    <div class="bet-spot player">
      <div class="bet-background"></div>
      <span class="bet-label">闲家</span>
      <span class="bet-label-en">PLAYER</span>
    </div>

    <!-- 和局 -->
    <div class="bet-spot tie">
      <div class="bet-background"></div>
      <span class="bet-label">和局</span>
      <span class="bet-label-en">TIE</span>
    </div>

    <!-- 庄家 -->
    <div class="bet-spot banker">
      <div class="bet-background"></div>
      <span class="bet-label">庄家</span>
      <span class="bet-label-en">BANKER</span>
    </div>

    <!-- 庄家对子 -->
    <div class="bet-spot banker-pair">
      <div class="bet-background"></div>
      <span class="bet-label">庄对</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// 静态展示组件，无需逻辑
</script>

<style scoped>
/* 主容器 */
.bet-container {
  width: 100%;
  height: 50px;
  display: flex;
  background: linear-gradient(to bottom, #2a2a2a, #1a1a1a);
  padding: 4px;
  box-sizing: border-box;
  gap: 2px;
}

/* 投注区域基础样式 */
.bet-spot {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: default;
  overflow: hidden;
  transition: transform 0.2s ease;
}

/* 背景层 */
.bet-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.95;
  z-index: 0;
}

/* 文字标签 */
.bet-label {
  position: relative;
  color: white;
  font-size: 14px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  z-index: 1;
  user-select: none;
}

.bet-label-en {
  position: relative;
  color: rgba(255, 255, 255, 0.8);
  font-size: 9px;
  font-weight: 400;
  letter-spacing: 0.5px;
  margin-top: -2px;
  z-index: 1;
  user-select: none;
}

/* 闲家对子 */
.player-pair {
  flex: 0 0 15%;
  border-radius: 8px 0 0 8px;
}

.player-pair .bet-background {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.2),
              inset 0 -2px 4px rgba(0, 0, 0, 0.3);
}

/* 闲家 */
.player {
  flex: 0 0 28%;
  border-radius: 0;
}

.player .bet-background {
  background: linear-gradient(135deg, #2E83FF 0%, #1e5fcc 50%, #0d47a1 100%);
  box-shadow: inset 0 2px 6px rgba(255, 255, 255, 0.3),
              inset 0 -2px 6px rgba(0, 0, 0, 0.4);
}

/* 和局 */
.tie {
  flex: 0 0 14%;
  border-radius: 4px;
}

.tie .bet-background {
  background: linear-gradient(135deg, #27ae60 0%, #159252 50%, #0e5e33 100%);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.25),
              inset 0 -2px 4px rgba(0, 0, 0, 0.35);
}

.tie .bet-label {
  font-size: 13px;
}

/* 庄家 */
.banker {
  flex: 0 0 28%;
  border-radius: 0;
}

.banker .bet-background {
  background: linear-gradient(135deg, #EC2024 0%, #cc1a1d 50%, #8b0000 100%);
  box-shadow: inset 0 2px 6px rgba(255, 255, 255, 0.3),
              inset 0 -2px 6px rgba(0, 0, 0, 0.4);
}

/* 庄家对子 */
.banker-pair {
  flex: 0 0 15%;
  border-radius: 0 8px 8px 0;
}

.banker-pair .bet-background {
  background: linear-gradient(135deg, #af2929 0%, #8b1a1a 50%, #5f1111 100%);
  box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.2),
              inset 0 -2px 4px rgba(0, 0, 0, 0.3);
}

/* 悬停效果（可选） */
.bet-spot:hover {
  transform: translateY(-1px);
}

.bet-spot:hover .bet-background {
  opacity: 1;
  filter: brightness(1.1);
}

/* 响应式调整 */
@media (max-width: 480px) {
  .bet-label {
    font-size: 12px;
  }

  .bet-label-en {
    font-size: 8px;
  }

  .tie .bet-label {
    font-size: 11px;
  }
}
</style>
