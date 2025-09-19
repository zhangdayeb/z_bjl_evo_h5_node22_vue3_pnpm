<!-- LuZhuListItemCount.vue - 统计栏组件 -->
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
                    <g transform="translate(0,78) scale(0.1,-0.1)"
                       :fill="predictions.player.bigEye === 'red' ? '#EC2024' : '#2E83FF'"
                       stroke="none">
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
                    <g transform="translate(0,78) scale(0.1,-0.1)"
                       :fill="predictions.player.small === 'red' ? '#EC2024' : '#2E83FF'"
                       stroke="none">
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
                    <g transform="translate(0,78) scale(0.1,-0.1)"
                       :fill="predictions.player.cockroach === 'red' ? '#EC2024' : '#2E83FF'"
                       stroke="none">
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
                    <g transform="translate(0,78) scale(0.1,-0.1)"
                       :fill="predictions.banker.bigEye === 'red' ? '#EC2024' : '#2E83FF'"
                       stroke="none">
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
                    <g transform="translate(0,78) scale(0.1,-0.1)"
                       :fill="predictions.banker.small === 'red' ? '#EC2024' : '#2E83FF'"
                       stroke="none">
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
                    <g transform="translate(0,78) scale(0.1,-0.1)"
                       :fill="predictions.banker.cockroach === 'red' ? '#EC2024' : '#2E83FF'"
                       stroke="none">
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
import roadmapCalculator, {
  type GameResult,
  type Statistics,
  type Prediction
} from '@/utils/roadmapCalculator'

// Props
interface Props {
  gameData: Record<string, GameResult>
}

const props = defineProps<Props>()

// 计算属性
const statistics = computed<Statistics>(() =>
  roadmapCalculator.calculateStatistics(props.gameData)
)

const predictions = computed<Prediction>(() =>
  roadmapCalculator.calculatePredictions(props.gameData)
)
</script>

<style scoped>
/* 样式保持不变 */
.statistics-bar {
  background: rgb(37, 37, 37);
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 6px 2px 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}

.statistics-group {
  display: flex;
  align-items: center;
  height: 33px;
  font-size: 14px;
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
}

.stat-svg {
  width: 28px;
  height: 28px;
}

.stat-count {
  display: flex;
  align-items: center;
}

.value {
  color: rgba(255, 255, 255, 0.95);
  font-weight: 600;
}

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
  gap: 3px;
  padding: 0px 8px;
  border-radius: 20px;
  box-sizing: border-box;
}

.player-prediction {
  background: linear-gradient(177.86deg, #084094 39.22%, #1d1c2f 124.77%);
  box-shadow: 3px 3px 4px 0 #0006,inset 2px 2px 2px 0 #2663d0,inset -2px -2px 2px 0 #091e42;
}

.banker-prediction {
  background: linear-gradient(177.86deg,#af2929 39.22%,#430606 124.77%);
  box-shadow: 3px 3px 4px 0 #0006,inset 2px 2px 2px 0 #de3333,inset -2px -2px 2px 0 #651717;
}

.simple-svg-symbol {
  width: 15px;
  height: 28px;
  display: flex;
  align-items: center;
  font-family: "Inter, Arial, sans-serif";
}

.icons {
  display: flex;
  align-items: center;
  gap: 0;
}

.icon-item {
  width: 17px;
  height: 23px;
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
