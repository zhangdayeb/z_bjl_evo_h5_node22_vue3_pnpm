<!-- src/components/Effects/ResultEffect.vue -->
<template>
  <div class="result-effect-overlay">
    <div class="result-effect-container">
      <!-- 主要内容 -->
      <div class="result-content" :class="{ 'revealed': allCardsRevealed }">
        <!-- 第一排：闲 分数 VS 分数 庄 -->
        <div class="first-row">
          <div class="player-info">
            <div class="player-label">闲</div>
            <div class="player-score" :class="{ 'revealed': scoreRevealed }">{{ playerScore }}</div>
          </div>

          <div class="vs-indicator">VS</div>

          <div class="player-info">
            <div class="player-score" :class="{ 'revealed': scoreRevealed }">{{ bankerScore }}</div>
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
                  :class="{ 'revealed': card.revealed }"
                >
                  <!-- 直接显示正面牌，不要翻牌效果 -->
                  <div class="card-front">
                    <img :src="getCardImage(card.image)" :alt="card.image" />
                  </div>
                </div>
              </div>
              <!-- 第3张牌 -->
              <div v-if="playerCards.length > 2" class="third-card">
                <div
                  class="card"
                  :class="{ 'revealed': playerCards[2].revealed }"
                >
                  <!-- 直接显示正面牌，不要翻牌效果 -->
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
                  :class="{ 'revealed': card.revealed }"
                >
                  <!-- 直接显示正面牌，不要翻牌效果 -->
                  <div class="card-front">
                    <img :src="getCardImage(card.image)" :alt="card.image" />
                  </div>
                </div>
              </div>
              <!-- 第3张牌 -->
              <div v-if="bankerCards.length > 2" class="third-card">
                <div
                  class="card"
                  :class="{ 'revealed': bankerCards[2].revealed }"
                >
                  <!-- 直接显示正面牌，不要翻牌效果 -->
                  <div class="card-front">
                    <img :src="getCardImage(bankerCards[2].image)" :alt="bankerCards[2].image" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第三排：结果显示 -->
        <div class="third-row">
          <div class="result-text" :class="[winnerClass, { 'revealed': resultRevealed }]">
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
  revealed: boolean
}

// Props
interface Props {
  autoClose?: boolean
  closeDuration?: number
  cardRevealDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  autoClose: true,
  closeDuration: 5000,  // 🔥 总时间3秒
  cardRevealDelay: 300  // 🔥 快速显示 0.3秒间隔
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
const scoreRevealed = ref(false)
const resultRevealed = ref(false)
const allCardsRevealed = ref(false)

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
  // 🔥 修复：使用正确的图片路径格式
  // 如果 cardName 已经包含 .png，直接使用；否则添加 .png
  const fileName = cardName.includes('.png') ? cardName : `${cardName}.png`
  return `/src/assets/images/poker/${fileName}`
}

// 初始化卡牌 - 只处理真实数据
const initializeCards = () => {
  console.log('🎴 开牌特效组件挂载，gameResult:', gameResult.value)

  const resultInfo = gameResult.value?.data?.result_info

  if (!resultInfo?.info) {
    bankerCards.value = []
    playerCards.value = []
    return
  }

  const { zhuang, xian } = resultInfo.info

  // 🔥 解析庄家牌 - 按索引排序
  if (zhuang && typeof zhuang === 'object') {
    const bankerCardData: CardData[] = Object.entries(zhuang)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([index, cardImage]) => {
        console.log(`🎴 庄家牌 索引${index}:`, cardImage)
        return {
          image: cardImage as string,
          revealed: false // 🔥 先设为false，通过动画逐步显示
        }
      })
    bankerCards.value = bankerCardData
    console.log('🎴 庄家牌解析完成:', bankerCardData)
  } else {
    bankerCards.value = []
    console.log('🎴 没有庄家牌数据')
  }

  // 🔥 解析闲家牌 - 按索引排序
  if (xian && typeof xian === 'object') {
    const playerCardData: CardData[] = Object.entries(xian)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([index, cardImage]) => {
        console.log(`🎴 闲家牌 索引${index}:`, cardImage)
        return {
          image: cardImage as string,
          revealed: false // 🔥 先设为false，通过动画逐步显示
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

// 🔥 修改：简化显示动画，取消翻牌效果
const startRevealAnimation = () => {
  const totalCards = bankerCards.value.length + playerCards.value.length

  if (totalCards === 0) {
    console.warn('⚠️ 没有卡牌数据，跳过显示动画')
    // 直接显示结果
    setTimeout(() => {
      scoreRevealed.value = true
      resultRevealed.value = true
      allCardsRevealed.value = true
    }, 1000)
    return
  }

  // 🔥 依次显示闲家牌
  playerCards.value.forEach((card, index) => {
    setTimeout(() => {
      card.revealed = true
    }, index * props.cardRevealDelay)
  })

  // 🔥 依次显示庄家牌
  bankerCards.value.forEach((card, index) => {
    setTimeout(() => {
      card.revealed = true
    }, (playerCards.value.length + index) * props.cardRevealDelay)
  })

  // 显示分数
  setTimeout(() => {
    scoreRevealed.value = true
  }, totalCards * props.cardRevealDelay + 500)

  // 显示结果
  setTimeout(() => {
    resultRevealed.value = true
    allCardsRevealed.value = true
  }, totalCards * props.cardRevealDelay + 1000)

  // 自动关闭
  if (props.autoClose) {
    setTimeout(() => {
      handleComplete()
    }, props.closeDuration)
  }
}

const handleComplete = () => {
  emit('complete')
}

// 生命周期
onMounted(() => {
  console.log('🎴 开牌特效组件挂载')

  // 初始化卡牌数据
  initializeCards()

  // 立即开始动画，不延迟
  startRevealAnimation()
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
  padding: 15px;
  animation: contentSlideIn 0.8s ease-out;
}

.result-content.revealed {
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
}

.player-label {
  font-size: 16px;
  font-weight: bold;
  color: white;
}

/* 闲家标签 - 蓝色 */
.left-cards .player-label,
.player-info:first-child .player-label {
  color: #3498db;
}

/* 庄家标签 - 红色 */
.right-cards .player-label,
.player-info:last-child .player-label {
  color: #e74c3c;
}

.player-score {
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 20px;
  min-width: 50px;
  text-align: center;
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.5s ease-out;
}

/* 闲家点数 - 蓝色背景 */
.player-info:first-child .player-score {
  background: rgba(52, 152, 219, 0.9);
}

/* 庄家点数 - 红色背景 */
.player-info:last-child .player-score {
  background: rgba(231, 76, 60, 0.9);
}

.player-score.revealed {
  opacity: 1;
  transform: scale(1);
  animation: scoreReveal 0.5s ease-out;
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

/* 🔥 修改：简化卡牌样式，取消翻转效果 */
.card {
  width: 95px;
  height: 120px;
  position: relative;
  cursor: pointer;
  border-radius: 6px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);

  /* 🔥 初始状态：隐藏 */
  opacity: 0;
  transform: translateY(-30px) scale(0.8);
  transition: all 0.6s ease-out;
}

/* 🔥 显示状态：渐显并移动到位 */
.card.revealed {
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
  object-fit: contain; /* 🔥 改为 contain 保持图片比例，不裁剪 */
  object-position: center; /* 🔥 居中显示 */
}

/* 🔥 卡牌背景渐变效果 */
.left-cards .card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.right-cards .card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.card:hover {
  transform: scale(1.05);
  border-color: rgba(255, 255, 255, 0.6);
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
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease-out;
}

.result-text.revealed {
  opacity: 1;
  transform: translateY(0);
  animation: winnerGlow 2s ease-in-out infinite alternate;
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

/* 动画 */
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

@keyframes scoreReveal {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes winnerGlow {
  from {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
  to {
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.5), 0 0 20px currentColor;
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
    font-size: 16px;
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
