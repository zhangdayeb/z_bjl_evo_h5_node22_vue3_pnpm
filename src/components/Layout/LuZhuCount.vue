<!-- LuZhuCount.vue - 统计栏组件 -->
<template>
  <div class="statistics-bar">
    <!-- 左侧：统计数据组 -->
    <div class="statistics-group">
      <!-- 局数 -->
      <div class="stat-item-wrapper">
        <div class="stat-item">
          <div>#</div>
        </div>
        <div class="stat-count">
          <div class="value">{{ statistics.total }}</div>
        </div>
      </div>

      <!-- 闲家统计 -->
      <div class="stat-item-wrapper">
        <div class="stat-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="stat-svg" viewBox="0 0 80 80">
            <g>
              <svg width="68px" height="68px" x="6" y="6" viewBox="0 0 80 80">
                <g transform="translate(0,78) scale(0.1,-0.1)" fill="#2E83FF" stroke="none">
                  <path d="
                    M265 759 c-201 -65 -310 -283 -245 -490 64 -205 283 -315 491 -249
                    205 64 315 283 249 491 -65 205 -286 316 -495 248z" />
                </g>
                <text x="50%" y="75%" text-anchor="middle" font-size="55" fill="white">P</text>
              </svg>
            </g>
          </svg>
        </div>
        <div class="stat-count">
          <div class="value">{{ statistics.player }}</div>
        </div>
      </div>

      <!-- 庄家统计 -->
      <div class="stat-item-wrapper">
        <div class="stat-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="stat-svg" viewBox="0 0 80 80">
            <g>
              <svg width="68px" height="68px" x="6" y="6" viewBox="0 0 80 80">
                <g transform="translate(0,78) scale(0.1,-0.1)" fill="#EC2024" stroke="none">
                  <path d="
                    M265 759 c-201 -65 -310 -283 -245 -490 64 -205 283 -315 491 -249
                    205 64 315 283 249 491 -65 205 -286 316 -495 248z" />
                </g>
                <text x="50%" y="75%" text-anchor="middle" font-size="55" fill="white">B</text>
              </svg>
            </g>
          </svg>
        </div>
        <div class="stat-count">
          <div class="value">{{ statistics.banker }}</div>
        </div>
      </div>

      <!-- 和局统计 -->
      <div class="stat-item-wrapper">
        <div class="stat-item">
          <svg xmlns="http://www.w3.org/2000/svg" class="stat-svg" viewBox="0 0 80 80">
            <g>
              <svg width="68px" height="68px" x="6" y="6" viewBox="0 0 80 80">
                <g transform="translate(0,78) scale(0.1,-0.1)" fill="#159252" stroke="none">
                  <path d="
                    M265 759 c-201 -65 -310 -283 -245 -490 64 -205 283 -315 491 -249
                    205 64 315 283 249 491 -65 205 -286 316 -495 248z" />
                </g>
                <text x="50%" y="75%" text-anchor="middle" font-size="55" fill="white">T</text>
              </svg>
            </g>
          </svg>
        </div>
        <div class="stat-count">
          <div class="value">{{ statistics.tie }}</div>
        </div>
      </div>
    </div>

    <!-- 右侧：问路预测 -->
    <div class="predictions-group">
      <!-- 闲家预测 -->
      <div class="prediction">
        <div class="prediction-inner player-prediction">
          <div class="background-border border-before"></div>
          <div class="background-border border-after"></div>
          <div class="simple-svg-symbol">
            <svg width="100%" height="75%" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="5" fill="#fff" dominant-baseline="central">P</text>
            </svg>
          </div>
          <div class="icons">
            <!-- 大眼路 -->
            <div class="icon-item">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon-svg" viewBox="0 0 80 80">
                <g>
                  <svg width="68px" height="68px" x="6" y="6" viewBox="0 0 80 80">
                    <g transform="translate(0,78) scale(0.1,-0.1)" :fill="predictions.player.bigEye" stroke="none">
                      <path d="
                        M275 764 c-103 -37 -194 -110 -228 -184 -81 -174 -56 -342 67 -466
                        154 -153 398 -153 552 0 123 124 148 292 67 466 -21 44 -109 132 -153 153
                        -105 48 -221 60 -305 31z m179 -123 c3 -4 19 -11 36 -15 40 -8 128 -96 136
                        -136 4 -17 11 -33 15 -36 5 -3 9 -32 9 -64 0 -32 -4 -61 -9 -64 -4 -3 -11 -19
                        -15 -36 -8 -40 -96 -128 -136 -136 -17 -4 -33 -11 -36 -15 -3 -5 -32 -9 -64
                        -9 -32 0 -61 4 -64 9 -3 4 -19 11 -36 15 -40 8 -128 96 -136 136 -4 17 -11 33
                        -15 36 -12 7 -12 121 0 128 4 3 11 19 15 36 8 40 96 128 136 136 17 4 33 11
                        36 15 3 5 32 9 64 9 32 0 61 -4 64 -9z" />
                    </g>
                  </svg>
                </g>
              </svg>
            </div>
            <!-- 小路 -->
            <div class="icon-item">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon-svg" viewBox="0 0 80 80">
                <g>
                  <svg width="68px" height="68px" x="6" y="6" viewBox="0 0 80 80">
                    <g transform="translate(0,78) scale(0.1,-0.1)" :fill="predictions.player.small" stroke="none">
                      <path d="
                        M265 759 c-201 -65 -310 -283 -245 -490 64 -205 283 -315 491 -249
                        205 64 315 283 249 491 -65 205 -286 316 -495 248z" />
                    </g>
                  </svg>
                </g>
              </svg>
            </div>
            <!-- 蟑螂路 -->
            <div class="icon-item last-item">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon-svg" viewBox="0 0 80 80">
                <g>
                  <svg width="68px" height="68px" x="6" y="6" viewBox="0 0 80 80">
                    <g transform="translate(0,78) scale(0.1,-0.1)" :fill="predictions.player.cockroach" stroke="none">
                      <path d="
                        M260 360 l-255 -255 60 -60 60 -60 410 410 255 255 -60 60 -60 60" />
                    </g>
                  </svg>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- 庄家预测 -->
      <div class="prediction">
        <div class="prediction-inner banker-prediction">
          <div class="background-border border-before"></div>
          <div class="background-border border-after"></div>
          <div class="simple-svg-symbol">
            <svg width="100%" height="75%" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
              <text x="0" y="5" fill="#fff" dominant-baseline="central">B</text>
            </svg>
          </div>
          <div class="icons">
            <!-- 大眼路 -->
            <div class="icon-item">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon-svg" viewBox="0 0 80 80">
                <g>
                  <svg width="68px" height="68px" x="6" y="6" viewBox="0 0 80 80">
                    <g transform="translate(0,78) scale(0.1,-0.1)" :fill="predictions.banker.bigEye" stroke="none">
                      <path d="
                        M275 764 c-103 -37 -194 -110 -228 -184 -81 -174 -56 -342 67 -466
                        154 -153 398 -153 552 0 123 124 148 292 67 466 -21 44 -109 132 -153 153
                        -105 48 -221 60 -305 31z m179 -123 c3 -4 19 -11 36 -15 40 -8 128 -96 136
                        -136 4 -17 11 -33 15 -36 5 -3 9 -32 9 -64 0 -32 -4 -61 -9 -64 -4 -3 -11 -19
                        -15 -36 -8 -40 -96 -128 -136 -136 -17 -4 -33 -11 -36 -15 -3 -5 -32 -9 -64
                        -9 -32 0 -61 4 -64 9 -3 4 -19 11 -36 15 -40 8 -128 96 -136 136 -4 17 -11 33
                        -15 36 -12 7 -12 121 0 128 4 3 11 19 15 36 8 40 96 128 136 136 17 4 33 11
                        36 15 3 5 32 9 64 9 32 0 61 -4 64 -9z" />
                    </g>
                  </svg>
                </g>
              </svg>
            </div>
            <!-- 小路 -->
            <div class="icon-item">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon-svg" viewBox="0 0 80 80">
                <g>
                  <svg width="68px" height="68px" x="6" y="6" viewBox="0 0 80 80">
                    <g transform="translate(0,78) scale(0.1,-0.1)" :fill="predictions.banker.small" stroke="none">
                      <path d="
                        M265 759 c-201 -65 -310 -283 -245 -490 64 -205 283 -315 491 -249
                        205 64 315 283 249 491 -65 205 -286 316 -495 248z" />
                    </g>
                  </svg>
                </g>
              </svg>
            </div>
            <!-- 蟑螂路 -->
            <div class="icon-item last-item">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon-svg" viewBox="0 0 80 80">
                <g>
                  <svg width="68px" height="68px" x="6" y="6" viewBox="0 0 80 80">
                    <g transform="translate(0,78) scale(0.1,-0.1)" :fill="predictions.banker.cockroach" stroke="none">
                      <path d="
                        M260 360 l-255 -255 60 -60 60 -60 410 410 255 255 -60 60 -60 60" />
                    </g>
                  </svg>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import roadmapCalculator, { type GameResult } from '@/utils/roadmapCalculator'

// Props
interface Props {
  gameData: Record<string, GameResult>
}

const props = defineProps<Props>()

// 计算属性
const statistics = computed(() =>
  roadmapCalculator.calculateStatistics(props.gameData)
)

const predictions = computed(() =>
  roadmapCalculator.calculatePredictions(props.gameData)
)
</script>

<style scoped>
/* 主容器 */
.statistics-bar {
  background: rgb(37, 37, 37);
  height: 28.7152px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

/* 左侧统计组 */
.statistics-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-item-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-item {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

.stat-svg {
  width: 20px;
  height: 20px;
}

.stat-count {
  display: flex;
  align-items: center;
}

.value {
  color: rgba(255, 255, 255, 0.95);
  font-size: 12px;
  font-weight: 600;
}

/* 右侧预测组 */
.predictions-group {
  display: flex;
  gap: 6px;
}

.prediction {
  display: flex;
}

.prediction-inner {
  position: relative;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 3px 5px;
  border-radius: 10px;
  background-color: transparent;
  border: 1px solid transparent;
}

/* 背景边框装饰 */
.background-border {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
}

.border-before {
  z-index: 0;
}

.border-after {
  z-index: 1;
}

/* 闲家预测样式 */
.player-prediction {
  background: linear-gradient(135deg,
    rgba(46, 131, 255, 0.15) 0%,
    rgba(46, 131, 255, 0.05) 100%);
  border-color: rgba(46, 131, 255, 0.3);
}

.player-prediction .border-before {
  background: rgba(46, 131, 255, 0.1);
}

/* 庄家预测样式 */
.banker-prediction {
  background: linear-gradient(135deg,
    rgba(236, 32, 36, 0.2) 0%,
    rgba(236, 32, 36, 0.08) 100%);
  border: 1px solid rgba(236, 32, 36, 0.35);
}

.banker-prediction .border-before {
  background: linear-gradient(135deg,
    rgba(236, 32, 36, 0.1) 0%,
    rgba(236, 32, 36, 0.05) 100%);
}

/* P/B 标签 */
.simple-svg-symbol {
  position: relative;
  z-index: 2;
  width: 12px;
  height: 16px;
  display: flex;
  align-items: center;
}

/* 预测图标 */
.icons {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0;
  background-color: transparent;
  border-color: transparent;
}

.icon-item {
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-svg {
  width: 100%;
  height: 100%;
}

.last-item {
  margin-right: 0;
}
</style>
