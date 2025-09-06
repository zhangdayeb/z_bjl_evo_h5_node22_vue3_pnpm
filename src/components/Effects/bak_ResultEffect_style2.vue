<!-- src/components/Effects/ResultEffect.vue -->
<template>
  <div class="result-effect-overlay">
    <div class="result-effect-container">
      <!-- 主要内容 -->
      <div class="result-content">
        <!-- 第一排：闲 分数 VS 分数 庄 -->
        <div class="first-row" style="gap: 10px;">
          <div class="player-info" style="text-align: right; justify-content: right;">
            <div class="player-label">闲</div>
            <div class="player-score">{{ playerScore }}</div>
          </div>

          <div class="player-info" style="text-align: left;">
            <div class="player-score">{{ bankerScore }}</div>
            <div class="player-label">庄</div>
          </div>
        </div>

        <!-- 第二排：扑克牌 -->
        <div class="second-row">
          <div class="cards-container">
            <!-- 闲家牌 -->
            <div class="cards-side left-cards">
              <div class="cards-row">
                <div
                  v-for="(card, index) in playerCards.slice(0, 2)"
                  :key="`player-${index}`"
                  class="card"
                >
                  <div class="card-front">
                    <img :src="getCardImage(card.image)" :alt="card.image" />
                  </div>
                </div>
              </div>
              <!-- 第3张牌 -->
              <div v-if="playerCards.length > 2" class="third-card">
                <div class="card">
                  <div class="card-front">
                    <img :src="getCardImage(playerCards[2].image)" :alt="playerCards[2].image" />
                  </div>
                </div>
              </div>
            </div>

            <!-- 庄家牌 -->
            <div class="cards-side right-cards">
              <div class="cards-row">
                <div
                  v-for="(card, index) in bankerCards.slice(0, 2)"
                  :key="`banker-${index}`"
                  class="card"
                >
                  <div class="card-front">
                    <img :src="getCardImage(card.image)" :alt="card.image" />
                  </div>
                </div>
              </div>
              <!-- 第3张牌 -->
              <div v-if="bankerCards.length > 2" class="third-card">
                <div class="card">
                  <div class="card-front">
                    <img :src="getCardImage(bankerCards[2].image)" :alt="bankerCards[2].image" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第三排：结果显示 -->
        <div v-if="false" class="third-row">
          <div class="result-text" :class="winnerClass">
            {{ winnerText }}
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// 类型定义
interface CardData {
  image: string
}

// Props
interface Props {
  autoClose?: boolean
  closeDuration?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoClose: true,
  closeDuration: 50000
})

// 事件定义
const emit = defineEmits<{
  close: []
  complete: []
}>()

// 从 gameStore 读取数据
const gameStore = useGameStore()
const gameResult = computed(() => gameStore.gameResult)

// 响应式数据
const bankerCards = ref<CardData[]>([])
const playerCards = ref<CardData[]>([])

// 计算属性 - 基于真实数据结构解析
const bankerScore = computed(() => {
  return gameResult.value?.data?.result_info?.result?.zhuang_point || 0
})

const playerScore = computed(() => {
  return gameResult.value?.data?.result_info?.result?.xian_point || 0
})

const winnerText = computed(() => {
  const bankerPoint = bankerScore.value
  const playerPoint = playerScore.value

  if (bankerPoint > playerPoint) {
    return '庄赢'
  } else if (playerPoint > bankerPoint) {
    return '闲赢'
  } else {
    return '和局'
  }
})

const winnerClass = computed(() => {
  const bankerPoint = bankerScore.value
  const playerPoint = playerScore.value

  if (bankerPoint > playerPoint) {
    return 'winner-banker'
  } else if (playerPoint > bankerPoint) {
    return 'winner-player'
  } else {
    return 'winner-tie'
  }
})

// 方法 - 修复图片路径
const getCardImage = (cardName: string) => {
  const fileName = cardName.includes('.png') ? cardName : `${cardName}.png`
  return `/src/assets/images/poker/${fileName}`
}

// 初始化卡牌 - 去除 revealed 属性
const initializeCards = () => {
  console.log('🎴 开牌特效组件挂载，gameResult:', gameResult.value)

  const resultInfo = gameResult.value?.data?.result_info

  if (!resultInfo?.info) {
    bankerCards.value = [
      {image:'f1.png'},
      {image:'f1.png'},
      {image:'f1.png'}
    ]
    playerCards.value = [
      {image:'f1.png'},
      {image:'f1.png'},
      {image:'f1.png'}
    ]
    return
  }

  const { zhuang, xian } = resultInfo.info

  // 解析庄家牌 - 按索引排序
  if (zhuang && typeof zhuang === 'object') {
    const bankerCardData: CardData[] = Object.entries(zhuang)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([index, cardImage]) => {
        console.log(`🎴 庄家牌 索引${index}:`, cardImage)
        return {
          image: cardImage as string
        }
      })
    bankerCards.value = bankerCardData
    console.log('🎴 庄家牌解析完成:', bankerCardData)
  } else {
    bankerCards.value = []
    console.log('🎴 没有庄家牌数据')
  }

  // 解析闲家牌 - 按索引排序
  if (xian && typeof xian === 'object') {
    const playerCardData: CardData[] = Object.entries(xian)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([index, cardImage]) => {
        console.log(`🎴 闲家牌 索引${index}:`, cardImage)
        return {
          image: cardImage as string
        }
      })
    playerCards.value = playerCardData
    console.log('🎴 闲家牌解析完成:', playerCardData)
  } else {
    playerCards.value = []
    console.log('🎴 没有闲家牌数据')
  }

  console.log('🎴 最终解析的牌面数据:', {
    bankerCards: bankerCards.value,
    playerCards: playerCards.value,
    bankerScore: bankerScore.value,
    playerScore: playerScore.value,
    winner: winnerText.value,
    rawData: { zhuang, xian }
  })
}

const handleComplete = () => {
  emit('complete')
}

// 生命周期
onMounted(() => {
  console.log('🎴 开牌特效组件挂载')

  // 初始化卡牌数据
  initializeCards()

  // 自动关闭
  if (props.autoClose) {
    setTimeout(() => {
      handleComplete()
    }, props.closeDuration)
  }
})

onUnmounted(() => {
  console.log('🎴 开牌特效组件卸载')
})
</script>

<style scoped>
.result-effect-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: overlayFadeIn 0.5s ease-out;
}

.result-effect-container {
  position: relative;
  width: 100%;
}

.result-content {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 15px;
  animation: contentSlideIn 0.8s ease-out;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
}

/* 第一排样式 */
.first-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 10px;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 50%;
}

.player-label {
  font-size: 40px;
  font-weight: bold;
  color: white;
}

.player-score {
  color: #ccc;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 60px;
  min-width: 50px;
  text-align: center;
  /* 直接显示，无动画 */
  opacity: 1;
  transform: scale(1);
}

.vs-indicator {
  background: linear-gradient(45deg, #9b59b6, #8e44ad);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 16px;
}

/* 第二排样式 */
.second-row {
  margin-bottom: 15px;
}

.cards-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.cards-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-height: 250px;
}

.cards-row {
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: center;
  height: 120px;
  align-items: flex-start;
}

.third-card {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  height: 95px;
}

.third-card .card {
  transform: rotate(90deg);
  width: 95px;
  height: 120px;
}

/* 卡牌样式 - 去除所有动画效果、背景色和边框 */
.card {
  width: 95px;
  height: 120px;
  position: relative;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  /* 移除边框和背景 */
  border: none;
  background: transparent;

  /* 直接显示，无动画 */
  opacity: 1;
  transform: translateY(0) scale(1);
}

.card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 6px;
  overflow: hidden;
}

.card-front img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

/* 移除所有卡牌背景渐变效果 */

.card:hover {
  transform: scale(1.05);
}

/* 第三排样式 */
.third-row {
  text-align: center;
  margin-top: 15px;
}

.result-text {
  background: linear-gradient(45deg, #feca57, #ff9ff3);
  color: white;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: bold;
  font-size: 18px;
  display: inline-block;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  /* 直接显示，无动画 */
  opacity: 1;
  transform: translateY(0);
}

.result-text.winner-banker {
  background: linear-gradient(45deg, #e74c3c, #c0392b);
  color: white;
}

.result-text.winner-player {
  background: linear-gradient(45deg, #3498db, #2980b9);
  color: white;
}

.result-text.winner-tie {
  background: linear-gradient(45deg, #27ae60, #2ecc71);
  color: white;
}

/* 基础动画保留 */
@keyframes overlayFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes contentSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 响应式设计 */
@media (max-width: 350px) {
  .result-content {
    padding: 12px;
  }

  .cards-container {
    gap: 8px;
  }

  .card {
    width: 80px;
    height: 100px;
  }

  .player-score {
    font-size: 60px;
    padding: 6px 12px;
  }

  .vs-indicator {
    font-size: 14px;
    padding: 6px 12px;
  }

  .result-text {
    font-size: 16px;
    padding: 10px 20px;
  }
}
</style>
