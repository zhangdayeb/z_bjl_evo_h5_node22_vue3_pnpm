<!-- 露珠组件 - 完整重构版 -->
<template>
  <div class="luzhu-component">
    <!-- 主容器：包含路珠显示区和底部统计栏 -->
    <div class="luzhu-wrapper">

      <!-- 上部：路珠显示区域 -->
      <div class="luzhu-display-area">
        <div class="roads-container">
          <!-- SVG 路珠图表 -->
          <svg class="roads-svg" viewBox="0 0 44 10" xmlns="http://www.w3.org/2000/svg">
            <!-- 背景网格 -->
            <defs>
              <!-- 大路网格 -->
              <pattern id="grid-big" x="0" y="0" width="1" height="1" patternUnits="userSpaceOnUse">
                <circle cx="0.5" cy="0.5" r="0.08" fill="rgba(255,255,255,0.08)" />
              </pattern>
              <!-- 珠盘路网格 -->
              <pattern id="grid-bead" x="0" y="0" width="1" height="1" patternUnits="userSpaceOnUse">
                <circle cx="0.5" cy="0.5" r="0.08" fill="rgba(255,255,255,0.08)" />
              </pattern>
              <!-- 下三路网格 -->
              <pattern id="grid-small" x="0" y="0" width="1" height="1" patternUnits="userSpaceOnUse">
                <circle cx="0.5" cy="0.5" r="0.06" fill="rgba(255,255,255,0.06)" />
              </pattern>
            </defs>

            <!-- 大路 (左上) -->
            <g class="big-road" transform="translate(0, 0)">
              <rect x="0" y="0" width="21" height="6" fill="url(#grid-big)" opacity="0.3" />

              <!-- 大路数据示例 -->
              <g class="big-road-data">
                <!-- 第一列 -->
                <circle cx="0.5" cy="0.5" r="0.4" fill="#EC2024" />
                <text x="0.5" y="0.5" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.5">B</text>

                <circle cx="0.5" cy="1.5" r="0.4" fill="#EC2024" />
                <text x="0.5" y="1.5" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.5">B</text>

                <circle cx="0.5" cy="2.5" r="0.4" fill="#EC2024" />
                <text x="0.5" y="2.5" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.5">B</text>

                <!-- 第二列 -->
                <circle cx="1.5" cy="0.5" r="0.4" fill="#2E83FF" />
                <text x="1.5" y="0.5" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.5">P</text>

                <circle cx="1.5" cy="1.5" r="0.4" fill="#2E83FF" />
                <text x="1.5" y="1.5" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.5">P</text>

                <!-- 第三列 -->
                <circle cx="2.5" cy="0.5" r="0.4" fill="#EC2024" />
                <text x="2.5" y="0.5" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.5">B</text>

                <circle cx="2.5" cy="1.5" r="0.4" fill="#EC2024" />
                <text x="2.5" y="1.5" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.5">B</text>

                <!-- 带和的标记 -->
                <g transform="translate(2.5, 2.5)">
                  <circle cx="0" cy="0" r="0.4" fill="#EC2024" />
                  <text x="0" y="0" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.5">B</text>
                  <line x1="-0.3" y1="-0.3" x2="0.3" y2="0.3" stroke="#159252" stroke-width="0.08" />
                </g>

                <!-- 第四列 -->
                <circle cx="3.5" cy="0.5" r="0.4" fill="#2E83FF" />
                <text x="3.5" y="0.5" text-anchor="middle" dominant-baseline="middle" fill="white" font-size="0.5">P</text>
              </g>
            </g>

            <!-- 珠盘路 (右上) -->
            <g class="bead-road" transform="translate(22, 0)">
              <rect x="0" y="0" width="14" height="6" fill="url(#grid-bead)" opacity="0.3" />

              <!-- 珠盘路数据 - 垂直6个一列 -->
              <g class="bead-road-data">
                <!-- 第一列 -->
                <circle cx="0.5" cy="0.5" r="0.35" fill="#EC2024" />
                <circle cx="0.5" cy="1.5" r="0.35" fill="#EC2024" />
                <circle cx="0.5" cy="2.5" r="0.35" fill="#EC2024" />
                <circle cx="0.5" cy="3.5" r="0.35" fill="#2E83FF" />
                <circle cx="0.5" cy="4.5" r="0.35" fill="#2E83FF" />
                <circle cx="0.5" cy="5.5" r="0.35" fill="#EC2024" />

                <!-- 第二列 -->
                <circle cx="1.5" cy="0.5" r="0.35" fill="#EC2024" />
                <circle cx="1.5" cy="1.5" r="0.35" fill="#159252" />
                <circle cx="1.5" cy="2.5" r="0.35" fill="#EC2024" />
                <circle cx="1.5" cy="3.5" r="0.35" fill="#2E83FF" />
                <circle cx="1.5" cy="4.5" r="0.35" fill="#EC2024" />
                <circle cx="1.5" cy="5.5" r="0.35" fill="#EC2024" />
              </g>
            </g>

            <!-- 大眼路 (左下) -->
            <g class="big-eye-road" transform="translate(0, 6.5)">
              <rect x="0" y="0" width="14" height="3" fill="url(#grid-small)" opacity="0.2" />

              <!-- 大眼路数据 - 空心圆 -->
              <g class="eye-road-data">
                <circle cx="0.5" cy="0.5" r="0.3" fill="none" stroke="#EC2024" stroke-width="0.08" />
                <circle cx="1.5" cy="0.5" r="0.3" fill="none" stroke="#2E83FF" stroke-width="0.08" />
                <circle cx="1.5" cy="1.5" r="0.3" fill="none" stroke="#2E83FF" stroke-width="0.08" />
                <circle cx="2.5" cy="0.5" r="0.3" fill="none" stroke="#EC2024" stroke-width="0.08" />
              </g>
            </g>

            <!-- 小路 (中下) -->
            <g class="small-road" transform="translate(15, 6.5)">
              <rect x="0" y="0" width="14" height="3" fill="url(#grid-small)" opacity="0.2" />

              <!-- 小路数据 - 实心小圆 -->
              <g class="small-road-data">
                <circle cx="0.5" cy="0.5" r="0.25" fill="#EC2024" />
                <circle cx="1.5" cy="0.5" r="0.25" fill="#2E83FF" />
                <circle cx="1.5" cy="1.5" r="0.25" fill="#2E83FF" />
                <circle cx="2.5" cy="0.5" r="0.25" fill="#EC2024" />
              </g>
            </g>

            <!-- 蟑螂路 (右下) -->
            <g class="cockroach-road" transform="translate(30, 6.5)">
              <rect x="0" y="0" width="14" height="3" fill="url(#grid-small)" opacity="0.2" />

              <!-- 蟑螂路数据 - 斜线 -->
              <g class="roach-road-data">
                <line x1="0.3" y1="0.3" x2="0.7" y2="0.7" stroke="#EC2024" stroke-width="0.1" />
                <line x1="1.3" y1="0.3" x2="1.7" y2="0.7" stroke="#2E83FF" stroke-width="0.1" />
                <line x1="1.3" y1="1.3" x2="1.7" y2="1.7" stroke="#2E83FF" stroke-width="0.1" />
                <line x1="2.3" y1="0.3" x2="2.7" y2="0.7" stroke="#EC2024" stroke-width="0.1" />
              </g>
            </g>
          </svg>
        </div>
      </div>

      <!-- 底部：统计栏（独立的，不嵌套） -->
      <div class="statistics-bar">
        <!-- 左侧：局数 -->
        <div class="left-section">
          <span class="game-round">
            <span class="hash">#</span>
            <span class="round-number">36</span>
          </span>
        </div>

        <!-- 中间：统计数据 -->
        <div class="center-section">
          <!-- 闲家 -->
          <div class="stat-item">
            <div class="stat-circle player">
              <span>P</span>
            </div>
            <span class="stat-count">17</span>
          </div>

          <!-- 庄家 -->
          <div class="stat-item">
            <div class="stat-circle banker">
              <span>B</span>
            </div>
            <span class="stat-count">17</span>
          </div>

          <!-- 和局 -->
          <div class="stat-item">
            <div class="stat-circle tie">
              <span>T</span>
            </div>
            <span class="stat-count">2</span>
          </div>
        </div>

        <!-- 右侧：问路预测 -->
        <div class="right-section">
          <!-- 闲家预测 -->
          <div class="prediction-indicator player-predict">
            <span class="predict-label">P</span>
            <div class="predict-dots">
              <span class="dot filled-blue"></span>
              <span class="dot outline-blue"></span>
              <span class="dot filled-red"></span>
            </div>
          </div>

          <!-- 庄家预测 -->
          <div class="prediction-indicator banker-predict">
            <span class="predict-label">B</span>
            <div class="predict-dots">
              <span class="dot filled-red"></span>
              <span class="dot outline-red"></span>
              <span class="dot filled-blue"></span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 游戏数据
const gameRound = ref(36)
const statistics = ref({
  player: 17,
  banker: 17,
  tie: 2
})

// 预测数据
const predictions = ref({
  player: ['blue', 'blue-outline', 'red'],
  banker: ['red', 'red-outline', 'blue']
})
</script>

<style scoped>
/* ================== 根容器 ================== */
.luzhu-component {
  width: 100%;
  height: 100%;
  background: #1a1a1a;
  position: relative;
  overflow: hidden;
}

/* ================== 主包装器 ================== */
.luzhu-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ================== 路珠显示区域 ================== */
.luzhu-display-area {
  flex: 1;
  background: linear-gradient(rgba(37, 37, 37, 0.9) 0%, rgb(37, 37, 37) 100%);
  border: 1px solid rgb(85, 85, 85);
  border-bottom: none;
  padding: 8px;
  overflow: auto;
  position: relative;
}

/* 路珠容器 */
.roads-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* SVG 路珠图表 */
.roads-svg {
  width: 100%;
  height: auto;
  max-width: 800px;
  display: block;
}

/* ================== 统计栏（独立底栏） ================== */
.statistics-bar {
  height: 40px;
  min-height: 40px;
  background: #1a1a1a;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  flex-shrink: 0;
}

/* === 左侧：局数 === */
.left-section {
  display: flex;
  align-items: center;
}

.game-round {
  display: flex;
  align-items: center;
  gap: 4px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 500;
}

.game-round .hash {
  opacity: 0.7;
}

.game-round .round-number {
  color: white;
  font-weight: 600;
}

/* === 中间：统计 === */
.center-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-circle {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 13px;
}

.stat-circle.player {
  background: #2E83FF;
}

.stat-circle.banker {
  background: #EC2024;
}

.stat-circle.tie {
  background: #159252;
}

.stat-count {
  color: white;
  font-size: 16px;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

/* === 右侧：问路预测 === */
.right-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.prediction-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 14px;
  height: 28px;
}

.player-predict {
  background: rgba(46, 131, 255, 0.15);
  border: 1px solid rgba(46, 131, 255, 0.3);
}

.banker-predict {
  background: rgba(236, 32, 36, 0.15);
  border: 1px solid rgba(236, 32, 36, 0.3);
}

.predict-label {
  color: white;
  font-weight: 700;
  font-size: 12px;
}

.predict-dots {
  display: flex;
  gap: 3px;
  align-items: center;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 1px solid transparent;
}

.dot.filled-blue {
  background: #2E83FF;
  border-color: #2E83FF;
}

.dot.filled-red {
  background: #EC2024;
  border-color: #EC2024;
}

.dot.outline-blue {
  background: transparent;
  border-color: #2E83FF;
}

.dot.outline-red {
  background: transparent;
  border-color: #EC2024;
}

/* ================== 响应式设计 ================== */
@media (max-width: 768px) {
  .luzhu-display-area {
    padding: 4px;
  }

  .statistics-bar {
    height: 36px;
    min-height: 36px;
    padding: 0 12px;
  }

  .stat-circle {
    width: 22px;
    height: 22px;
    font-size: 12px;
  }

  .stat-count {
    font-size: 15px;
  }

  .center-section {
    gap: 16px;
  }

  .prediction-indicator {
    height: 26px;
    padding: 3px 8px;
  }

  .dot {
    width: 8px;
    height: 8px;
  }
}

@media (max-width: 480px) {
  .statistics-bar {
    height: 34px;
    min-height: 34px;
    padding: 0 8px;
  }

  .game-round {
    font-size: 13px;
  }

  .stat-circle {
    width: 20px;
    height: 20px;
    font-size: 11px;
  }

  .stat-count {
    font-size: 14px;
    min-width: 20px;
  }

  .center-section {
    gap: 12px;
  }

  .stat-item {
    gap: 6px;
  }

  .right-section {
    gap: 6px;
  }

  .prediction-indicator {
    height: 24px;
    padding: 2px 6px;
    gap: 4px;
  }

  .predict-label {
    font-size: 11px;
  }

  .dot {
    width: 7px;
    height: 7px;
  }

  .predict-dots {
    gap: 2px;
  }
}

/* ================== 暗色主题优化 ================== */
@media (prefers-color-scheme: dark) {
  .luzhu-display-area {
    background: linear-gradient(rgba(28, 28, 28, 0.95) 0%, rgb(20, 20, 20) 100%);
  }

  .statistics-bar {
    background: #0f0f0f;
  }
}
</style>
