<!-- src/components/Effects/ResultEffect.vue -->
<template>
  <div class="result-effect-overlay">
    <div class="result-effect-container">
      <!-- 一体化彩色背景布局 -->
      <div class="result-content">

        <!-- 区域标题行 -->
        <div class="titles-row">
          <!-- 闲区域标题 -->
          <div class="area-title left-title">
            <span class="area-label">闲</span>
            <span class="area-score">{{ playerScore }}</span>
          </div>

          <!-- 庄区域标题 -->
          <div class="area-title right-title">
            <span class="area-score">{{ bankerScore }}</span>
            <span class="area-label">庄</span>
          </div>
        </div>

        <!-- 扑克牌行 - 底部对齐 -->
        <div class="cards-row">
          <!-- 位置2：闲第1张(竖) -->
          <div class="card-slot left-zone">
            <div
              v-if="playerCards.length > 0"
              class="poker-card vertical-card"
              :style="verticalCardStyle"
            >
              <span class="card-number" :class="getCardColorClass(playerCards[0].image)" :style="verticalTextStyle">
                {{ getCardNumber(playerCards[0].image) }}
              </span>
              <span class="card-suit" :class="getCardColorClass(playerCards[0].image)" :style="verticalTextStyle">
                {{ getCardSuit(playerCards[0].image) }}
              </span>
            </div>
          </div>

          <!-- 位置3：闲第2张(竖) -->
          <div class="card-slot left-zone">
            <div
              v-if="playerCards.length > 1"
              class="poker-card vertical-card"
              :style="verticalCardStyle"
            >
              <span class="card-number" :class="getCardColorClass(playerCards[1].image)" :style="verticalTextStyle">
                {{ getCardNumber(playerCards[1].image) }}
              </span>
              <span class="card-suit" :class="getCardColorClass(playerCards[1].image)" :style="verticalTextStyle">
                {{ getCardSuit(playerCards[1].image) }}
              </span>
            </div>
          </div>

          <!-- 位置1：闲第3张(横) -->
          <div class="card-slot left-zone">
            <div
              v-if="playerCards.length > 2"
              class="poker-card horizontal-card"
              :style="horizontalCardStyle"
            >
              <span class="card-number" :class="getCardColorClass(playerCards[2].image)" :style="horizontalTextStyle">
                {{ getCardNumber(playerCards[2].image) }}
              </span>
              <span class="card-suit" :class="getCardColorClass(playerCards[2].image)" :style="horizontalTextStyle">
                {{ getCardSuit(playerCards[2].image) }}
              </span>
            </div>
          </div>

          <!-- 位置6：庄第3张(横) -->
          <div class="card-slot right-zone">
            <div
              v-if="bankerCards.length > 2"
              class="poker-card horizontal-card"
              :style="horizontalCardStyle"
            >
              <span class="card-number" :class="getCardColorClass(bankerCards[2].image)" :style="horizontalTextStyle">
                {{ getCardNumber(bankerCards[2].image) }}
              </span>
              <span class="card-suit" :class="getCardColorClass(bankerCards[2].image)" :style="horizontalTextStyle">
                {{ getCardSuit(bankerCards[2].image) }}
              </span>
            </div>
          </div>

          <!-- 位置4：庄第1张(竖) -->
          <div class="card-slot right-zone">
            <div
              v-if="bankerCards.length > 0"
              class="poker-card vertical-card"
              :style="verticalCardStyle"
            >
              <span class="card-number" :class="getCardColorClass(bankerCards[0].image)" :style="verticalTextStyle">
                {{ getCardNumber(bankerCards[0].image) }}
              </span>
              <span class="card-suit" :class="getCardColorClass(bankerCards[0].image)" :style="verticalTextStyle">
                {{ getCardSuit(bankerCards[0].image) }}
              </span>
            </div>
          </div>

          <!-- 位置5：庄第2张(竖) -->
          <div class="card-slot right-zone">
            <div
              v-if="bankerCards.length > 1"
              class="poker-card vertical-card"
              :style="verticalCardStyle"
            >
              <span class="card-number" :class="getCardColorClass(bankerCards[1].image)" :style="verticalTextStyle">
                {{ getCardNumber(bankerCards[1].image) }}
              </span>
              <span class="card-suit" :class="getCardColorClass(bankerCards[1].image)" :style="verticalTextStyle">
                {{ getCardSuit(bankerCards[1].image) }}
              </span>
            </div>
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
  closeDuration: 500000
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

// 🔥 竖直扑克尺寸和文字 - 适当缩小
const verticalCardStyle = computed(() => {
  const containerWidth = `calc(100vw - 20px)`
  const cardWidth = `calc((${containerWidth}) / 6 * 0.9)` // 缩小到90%
  const cardHeight = `calc(${cardWidth} / 0.714)`

  return {
    width: cardWidth,
    height: cardHeight
  }
})

const verticalTextStyle = computed(() => {
  const fontSize = `calc((100vw - 20px) / 6 * 0.7)` // 增大文字大小

  return {
    fontSize: fontSize
  }
})

// 🔥 横向扑克尺寸和文字 - 增大尺寸
const horizontalCardStyle = computed(() => {
  const containerWidth = `calc(100vw - 20px)`
  const cardWidth = `calc((${containerWidth}) / 6 * 0.95)` // 增大到95%
  const cardHeight = `calc(${cardWidth} * 0.714)` // 保持比例

  return {
    width: cardHeight, // 横向时宽高互换
    height: cardWidth,
    transform: 'rotate(90deg)'
  }
})

const horizontalTextStyle = computed(() => {
  const fontSize = `calc((100vw - 20px) / 6 * 0.5)` // 横牌文字增大

  return {
    fontSize: fontSize
  }
})

// 🔥 获取卡牌数字
const getCardNumber = (cardImage: string): string => {
  const match = cardImage.match(/([fhmr])(\d+)\.png/);
  if (!match) return '';

  const number = match[2];
  const numberMap: Record<string, string> = {
    '1': 'A',
    '11': 'J',
    '12': 'Q',
    '13': 'K'
  };

  return numberMap[number] || number;
}

// 🔥 获取卡牌花色
const getCardSuit = (cardImage: string): string => {
  const match = cardImage.match(/([fhmr])\d+\.png/);
  if (!match) return '';

  const suit = match[1];
  const suitMap: Record<string, string> = {
    'f': '♦',  // 方块
    'h': '♠',  // 黑桃
    'm': '♣',  // 梅花
    'r': '♥'   // 红桃
  };

  return suitMap[suit] || suit;
}

// 🔥 获取卡牌花色颜色类
const getCardColorClass = (cardImage: string): string => {
  const match = cardImage.match(/([fhmr])\d+\.png/);
  if (!match) return 'card-black';

  const suit = match[1];

  // 红桃♥和方块♦用红色，黑桃♠和梅花♣用黑色
  if (suit === 'r' || suit === 'f') {
    return 'card-red';
  } else {
    return 'card-black';
  }
}

// 初始化卡牌
const initializeCards = () => {
  console.log('🎴 开牌特效组件挂载，gameResult:', gameResult.value)

  const resultInfo = gameResult.value?.data?.result_info

  if (!resultInfo?.info) {
    // 测试数据
    bankerCards.value = [
      {image:'f7.png'},  // 7♦
      {image:'h6.png'},  // 6♠
      {image:'m11.png'}  // J♣
    ]
    playerCards.value = [
      {image:'h2.png'},  // 2♠
      {image:'r13.png'}, // K♥
      {image:'m1.png'}   // A♣ (第三张)
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
    playerScore: playerScore.value
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
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: overlayFadeIn 0.5s ease-out;
}

.result-effect-container {
  position: relative;
  width: 100%;
  padding: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 🔥 一体化彩色背景布局 */
.result-content {
  margin-top: 50vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
  overflow: hidden;
  /* 左蓝右红背景 */
  background: linear-gradient(
    to right,
    #3498db 0%,
    #3498db 50%,
    #e74c3c 50%,
    #e74c3c 100%
  );
}

/* 🔥 标题行 */
.titles-row {
  display: flex;
  padding: 20px;
  z-index: 1;
}

.area-title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.left-title {
  justify-content: center;
}

.right-title {
  justify-content: center;
}

/* 🔥 去掉黑色半透明背景 */
.area-label {
  font-size: 42px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.area-score {
  font-size: 46px;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

/* 🔥 扑克牌行 - 强制底部对齐 */
.cards-row {
  display: flex;
  align-items: flex-end;
  padding: 0 10px 20px 10px;
  gap: 0;
  /* 🔥 确保足够高度容纳最高的竖牌 */
  min-height: calc((100vw - 20px) / 6 / 0.714 * 0.9 + 40px);
}

.card-slot {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  /* 🔥 重新计算统一容器高度 - 基于竖牌高度 */
  min-height: calc((100vw - 20px) / 6 / 0.714 * 0.9);
}

/* 🔥 区域背景色延伸 */
.left-zone {
  background: transparent; /* 继承父级的蓝色背景 */
}

.right-zone {
  background: transparent; /* 继承父级的红色背景 */
}

/* 🔥 扑克牌基础样式 */
.poker-card {
  position: relative;
  background: white;
  border-radius: 8px;
  border: 2px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.2s ease;
}

.vertical-card {
  /* 竖直牌无需额外样式 */
}

.horizontal-card {
  /* 横向牌不再旋转整张牌，设计成真正的横向矩形 */
  transform-origin: center center;
}

.poker-card:hover {
  transform: scale(1.05);
}

.horizontal-card:hover {
  transform: scale(1.05); /* 横牌hover时不再需要旋转 */
}

/* 🔥 卡牌数字 - 竖牌正常位置 */
.card-number {
  position: absolute;
  top: 8%;
  left: 12%;
  width: 35%;
  height: 35%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  line-height: 1;
}

/* 🔥 卡牌花色 - 竖牌正常位置 */
.card-suit {
  position: absolute;
  bottom: 8%;
  right: 12%;
  width: 35%;
  height: 35%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  transform: rotate(180deg);
}

/* 🔥 横牌特殊定位：数字右上角，花色左下角，都旋转90度实现横向显示 */
.horizontal-card .card-number {
  top: 15%;
  right: 15%;
  left: auto;
  bottom: auto;
  transform-origin: center center;
}

.horizontal-card .card-suit {
  bottom: 15%;
  left: 15%;
  right: auto;
  top: auto;
  transform-origin: center center;
}

/* 🔥 卡牌花色颜色 */
.card-red {
  color: #e74c3c;
}

.card-black {
  color: #2c3e50;
}

/* 基础动画 */
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

/* 🔥 响应式设计 */
@media (max-width: 768px) {
  .result-effect-container {
    padding: 0px;
  }

  .titles-row {
    padding: 15px;
  }

  .area-label {
    font-size: 36px;
  }

  .area-score {
    font-size: 40px;
  }

  .cards-row {
    min-height: 150px;
    padding-bottom: 15px;
  }
}

@media (max-width: 480px) {
  .titles-row {
    padding: 12px;
  }

  .area-label {
    font-size: 32px;
  }

  .area-score {
    font-size: 36px;
  }

  .cards-row {
    min-height: 120px;
    padding-bottom: 12px;
  }
}

@media (max-width: 350px) {
  .result-effect-container {
    padding: 0px;
  }

  .titles-row {
    padding: 10px;
    gap: 10px;
  }

  .area-label {
    font-size: 28px;
  }

  .area-score {
    font-size: 32px;
  }

  .cards-row {
    min-height: 100px;
    padding: 0 5px 10px 5px;
  }
}
</style>
