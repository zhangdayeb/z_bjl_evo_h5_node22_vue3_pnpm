<!-- src/components/Effects/ResultEffect.vue -->
<template>
  <div class="result-effect-overlay">
    <div class="result-effect-container">
      <!-- 一体化彩色背景布局 -->
      <div class="result-content">

        <!-- 扑克牌行 - 6个位置 -->
        <div class="cards-row">

          <!-- 位置1：闲第1张(竖) -->
          <div class="card-slot left-zone">
            <div v-if="playerCards.length > 0" class="card-container vertical-container">
              <img
                :src="getCardImagePath(playerCards[0].image, false, true)"
                class="poker-image vertical-image"
                alt="闲家第1张牌"
              >
            </div>
          </div>

          <!-- 位置2：闲第2张(竖) -->
          <div class="card-slot left-zone">
            <div v-if="playerCards.length > 1" class="card-container vertical-container">
              <img
                :src="getCardImagePath(playerCards[1].image, false, true)"
                class="poker-image vertical-image"
                alt="闲家第2张牌"
              >
            </div>
          </div>

          <!-- 位置3：闲第3张(横) + 文字 -->
          <div class="card-slot left-zone">
            <div v-if="playerCards.length > 2" class="card-container horizontal-container">
              <!-- 上方文字区域 -->
              <div class="card-text-area">
                <span class="area-name">闲</span>
                <span class="area-points">{{ playerScore }}</span>
              </div>
              <!-- 下方横向扑克牌 -->
              <img
                :src="getCardImagePath(playerCards[2].image, true, true)"
                class="poker-image horizontal-image"
                alt="闲家第3张牌"
              >
            </div>
          </div>

          <!-- 位置4：庄第3张(横) + 文字 -->
          <div class="card-slot right-zone">
            <div v-if="bankerCards.length > 2" class="card-container horizontal-container">
              <!-- 上方文字区域 -->
              <div class="card-text-area">
                <span class="area-points">{{ bankerScore }}</span>
                <span class="area-name">庄</span>
              </div>
              <!-- 下方横向扑克牌 -->
              <img
                :src="getCardImagePath(bankerCards[2].image, true, false)"
                class="poker-image horizontal-image"
                alt="庄家第3张牌"
              >
            </div>
          </div>

          <!-- 位置5：庄第1张(竖) -->
          <div class="card-slot right-zone">
            <div v-if="bankerCards.length > 0" class="card-container vertical-container">
              <img
                :src="getCardImagePath(bankerCards[0].image, false, false)"
                class="poker-image vertical-image"
                alt="庄家第1张牌"
              >
            </div>
          </div>

          <!-- 位置6：庄第2张(竖) -->
          <div class="card-slot right-zone">
            <div v-if="bankerCards.length > 1" class="card-container vertical-container">
              <img
                :src="getCardImagePath(bankerCards[1].image, false, false)"
                class="poker-image vertical-image"
                alt="庄家第2张牌"
              >
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
  closeDuration: 5000
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

// 🔥 核心函数：生成扑克牌图片路径
const getCardImagePath = (cardName: string, isHorizontal: boolean, isPlayer: boolean): string => {
  if (!cardName) return ''

  let directory = ''

  if (isHorizontal) {
    // 横向牌：闲家用 hengright，庄家用 hengleft
    directory = isPlayer ? 'hengright' : 'hengleft'
  } else {
    // 竖直牌：都用 shu 目录
    directory = 'shu'
  }

  return `/src/assets/images/poker/${directory}/${cardName}`
}

// 初始化卡牌
const initializeCards = () => {
  console.log('🎴 开牌特效组件挂载，gameResult:', gameResult.value)

  const resultInfo = gameResult.value?.data?.result_info

  if (!resultInfo?.info) {
    // 测试数据
    bankerCards.value = [
      { image: 'f7.png' },  // 庄1: 7♦
      { image: 'h6.png' },  // 庄2: 6♠
      { image: 'm11.png' }  // 庄3: J♣
    ]
    playerCards.value = [
      { image: 'h2.png' },  // 闲1: 2♠
      { image: 'r13.png' }, // 闲2: K♥
      { image: 'm1.png' }   // 闲3: A♣
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

/* 🔥 扑克牌行 - 6个位置平均分布 */
.cards-row {
  display: flex;
  align-items: flex-end;
  padding: 0 10px 20px 10px;
  gap: 2px;
  min-height: 200px;
}

.card-slot {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: relative;
  min-height: 180px;
}

/* 🔥 区域背景色 */
.left-zone {
  background: transparent; /* 继承父级的蓝色背景 */
}

.right-zone {
  background: transparent; /* 继承父级的红色背景 */
}

/* 🔥 卡牌容器 */
.card-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
}

/* 🔥 竖直卡牌容器 */
.vertical-container {
  justify-content: flex-end;
}

/* 🔥 横向卡牌容器 */
.horizontal-container {
  justify-content: space-between;
  gap: 8px;
}

/* 🔥 扑克牌图片基础样式 */
.poker-image {
  border-radius: 8px;
  border: 2px solid #ddd;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease;
  background: white;
}

.poker-image:hover {
  transform: scale(1.05);
}

/* 🔥 统一扑克牌尺寸 - 横向牌宽高互换 */
.vertical-image {
  width: 80px;
  height: 112px; /* 按扑克牌标准比例：80 * 1.4 = 112 */
  object-fit: cover;
}

.horizontal-image {
  width: 112px; /* 横向牌：宽高互换 */
  height: 80px; /* 横向牌：宽高互换 */
  object-fit: cover;
  margin: 6px;
}

/* 🔥 横牌上方的文字区域 */
.card-text-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 5px 10px;
  border-radius: 15px;
  margin-bottom: 5px;
}

.area-name {
  font-size: 18px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.area-points {
  font-size: 44px;
  font-weight: bold;
  color: #ffd700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

/* 基础动画 */
@keyframes overlayFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 🔥 响应式设计 - 保持扑克牌尺寸一致性 */
@media (max-width: 768px) {
  .result-effect-container {
    padding: 0px;
  }

  .cards-row {
    min-height: 160px;
    padding-bottom: 15px;
    gap: 1px;
  }

  .card-slot {
    min-height: 140px;
  }

  .vertical-image {
    width: 60px;
    height: 84px; /* 60 * 1.4 = 84 */
  }

  .horizontal-image {
    width: 84px; /* 横向牌：宽高互换 */
    height: 60px; /* 横向牌：宽高互换 */
  }

  .area-name {
    font-size: 16px;
  }

  .area-points {
    font-size: 36px;
  }
}

@media (max-width: 480px) {
  .cards-row {
    min-height: 140px;
    padding-bottom: 12px;
    gap: 1px;
  }

  .card-slot {
    min-height: 120px;
  }

  .vertical-image {
    width: 50px;
    height: 70px; /* 50 * 1.4 = 70 */
  }

  .horizontal-image {
    width: 70px; /* 横向牌：宽高互换 */
    height: 50px; /* 横向牌：宽高互换 */
  }

  .area-name {
    font-size: 14px;
  }

  .area-points {
    font-size: 32px;
  }
}

@media (max-width: 350px) {
  .result-effect-container {
    padding: 0px;
  }

  .cards-row {
    min-height: 120px;
    padding: 0 5px 10px 5px;
    gap: 1px;
  }

  .card-slot {
    min-height: 100px;
  }

  .vertical-image {
    width: 42px;
    height: 59px; /* 42 * 1.4 ≈ 59 */
  }

  .horizontal-image {
    width: 59px; /* 横向牌：宽高互换 */
    height: 42px; /* 横向牌：宽高互换 */
  }

  .area-name {
    font-size: 12px;
  }

  .area-points {
    font-size: 16px;
  }

  .card-text-area {
    gap: 5px;
    padding: 3px 8px;
  }
}
</style>
