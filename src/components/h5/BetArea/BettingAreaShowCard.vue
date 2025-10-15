<!--
  开牌结果展示
-->
<template>
  <div class="show-card-layer" v-if="hasCards">
    <!-- Player 扑克牌显示 -->
    <div class="cards-container player-cards" v-if="displayCards.player.length > 0">
      <div v-for="(card, index) in displayCards.player" :key="`p-${index}`"
           class="card" :class="{ horizontal: index === 2 }">
        <div class="card-face">
          <div class="card-value">{{ card.value }}</div>
          <div class="card-suit" :class="card.color">{{ card.suit }}</div>
        </div>
      </div>
    </div>

    <!-- Banker 扑克牌显示 -->
    <div class="cards-container banker-cards" v-if="displayCards.banker.length > 0">
      <div v-for="(card, index) in displayCards.banker" :key="`b-${index}`"
           class="card" :class="{ horizontal: index === 2 }">
        <div class="card-face">
          <div class="card-value">{{ card.value }}</div>
          <div class="card-suit" :class="card.color">{{ card.suit }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @fileoverview 百家乐开牌显示层
 * @description 显示开牌阶段的扑克牌，从 gameStore 获取实时数据
 */

import { computed, onMounted, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'

// ========================= 类型定义 =========================

interface Card {
  value: string
  suit: string
  color: 'red' | 'black'
}

interface DisplayCards {
  player: Card[]
  banker: Card[]
}

// ========================= Store =========================
const gameStore = useGameStore()

// ========================= 常量定义 =========================

/**
 * 花色映射表
 * r: 红桃, f: 方块, m: 梅花, h: 黑桃
 */
const SUIT_MAP: Record<string, string> = {
  'r': '♥',  // 红桃 (red)
  'f': '♦',  // 方块 (fangkuai)
  'm': '♣',  // 梅花 (meihua)
  'h': '♠'   // 黑桃 (heitao)
}

/**
 * 数值映射表
 * 1 -> A, 11 -> J, 12 -> Q, 13 -> K
 */
const VALUE_MAP: Record<string, string> = {
  '1': 'A',
  '11': 'J',
  '12': 'Q',
  '13': 'K'
}

// ========================= 工具函数 =========================

/**
 * 判断花色颜色
 * @param suitCode - 花色代码
 * @returns 颜色 red 或 black
 */
function getCardColor(suitCode: string): 'red' | 'black' {
  return (suitCode === 'r' || suitCode === 'f') ? 'red' : 'black'
}

/**
 * 解析单张牌数据
 * @param cardStr - 牌字符串，格式如 "11|r"
 * @returns 解析后的牌对象
 */
function parseCard(cardStr: string): Card | null {
  try {
    // 检查是否为空牌
    if (!cardStr || cardStr === '0|0' || cardStr === '0') {
      return null
    }

    const [valueStr, suitCode] = cardStr.split('|')

    // 验证数据完整性
    if (!valueStr || !suitCode) {
      console.warn('无效的牌数据格式:', cardStr)
      return null
    }

    // 获取花色
    const suit = SUIT_MAP[suitCode]
    if (!suit) {
      console.warn('未知的花色代码:', suitCode)
      return null
    }

    // 获取数值（2-10保持原样，其他使用映射）
    const value = VALUE_MAP[valueStr] || valueStr

    return {
      value,
      suit,
      color: getCardColor(suitCode)
    }
  } catch (error) {
    console.error('解析牌数据失败:', cardStr, error)
    return null
  }
}

/**
 * 解析 pai_info 数据
 * @param paiInfo - 原始 pai_info JSON 字符串
 * @returns 解析后的牌对象字典
 */
function parsePaiInfo(paiInfo: string): Record<string, string> | null {
  try {
    if (!paiInfo || paiInfo === '') {
      return null
    }

    const parsed = JSON.parse(paiInfo)

    // 验证数据格式
    if (typeof parsed !== 'object' || parsed === null) {
      console.warn('pai_info 格式错误:', paiInfo)
      return null
    }

    return parsed
  } catch (error) {
    console.error('JSON 解析失败:', error)
    return null
  }
}

// ========================= 计算属性 =========================

/**
 * 显示的牌数据
 * 从 gameStore 获取并解析 pai_info（优先）或 pai_info_temp
 */
const displayCards = computed<DisplayCards>(() => {
  // 默认返回值
  const defaultResult: DisplayCards = {
    player: [],
    banker: []
  }

  try {
    // 1. 获取原始数据 - 优先使用最终结果 pai_info，否则使用临时数据 pai_info_temp
    let paiInfo: string | null = null
    let dataSource = ''

    // 优先级1: 最终结果数据
    if (gameStore.gameResult?.pai_info) {
      paiInfo = gameStore.gameResult.pai_info
      dataSource = '最终结果'
    }
    // 优先级2: 临时过程数据
    else if (gameStore.tempCardInfo?.pai_info_temp) {
      paiInfo = gameStore.tempCardInfo.pai_info_temp
      dataSource = '过程数据'
    }

    if (!paiInfo) {
      console.log('无可显示的牌数据')
      return defaultResult
    }

    console.log(`获取牌数据 [${dataSource}]:`, paiInfo)

    // 2. 解析 JSON
    const cards = parsePaiInfo(paiInfo)
    if (!cards) {
      return defaultResult
    }

    // 3. 分配牌到 Player 和 Banker
    const player: Card[] = []
    const banker: Card[] = []

    // Player 牌：显示顺序 [6, 4, 5]，位置6横向
    // 视觉效果：左侧 [6-横向] [4] [5]
    const playerPositions = ['6', '4', '5']
    for (const pos of playerPositions) {
      if (cards[pos] && cards[pos] !== '0|0') {
        const card = parseCard(cards[pos])
        if (card) {
          player.push(card)
        }
      }
    }

    // Banker 牌：显示顺序 [1, 2, 3]，位置3横向
    // 视觉效果：右侧 [1] [2] [3-横向]
    const bankerPositions = ['1', '2', '3']
    for (const pos of bankerPositions) {
      if (cards[pos] && cards[pos] !== '0|0') {
        const card = parseCard(cards[pos])
        if (card) {
          banker.push(card)
        }
      }
    }

    return { player, banker }

  } catch (error) {
    console.error('处理牌数据时出错:', error)
    return defaultResult
  }
})

/**
 * 是否有牌需要显示
 */
const hasCards = computed<boolean>(() => {
  return displayCards.value.player.length > 0 ||
         displayCards.value.banker.length > 0
})

// ========================= 调试和监听 =========================

// 监听最终结果数据变化（用于调试）
watch(
  () => gameStore.gameResult?.pai_info,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      console.log('[ShowCard] pai_info 更新 [最终结果]:', {
        old: oldVal,
        new: newVal,
        parsed: displayCards.value
      })
    }
  }
)

// 监听临时数据变化（用于调试）
watch(
  () => gameStore.tempCardInfo?.pai_info_temp,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      console.log('[ShowCard] pai_info_temp 更新 [过程数据]:', {
        old: oldVal,
        new: newVal,
        parsed: displayCards.value
      })
    }
  }
)

// ========================= 生命周期 =========================

onMounted(() => {
  console.log('[ShowCard] 开牌层已加载')

  // 输出当前状态（用于调试）
  if (gameStore.gameResult?.pai_info) {
    console.log('[ShowCard] 初始数据 [最终结果]:', {
      pai_info: gameStore.gameResult.pai_info,
      displayCards: displayCards.value
    })
  } else if (gameStore.tempCardInfo?.pai_info_temp) {
    console.log('[ShowCard] 初始数据 [过程数据]:', {
      pai_info_temp: gameStore.tempCardInfo.pai_info_temp,
      displayCards: displayCards.value
    })
  }
})
</script>

<style scoped>
/* ========================= 层容器 ========================= */
.show-card-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 4;
}

/* ========================= 扑克牌容器 ========================= */
.cards-container {
  position: absolute;
  top: 30%;
  display: flex;
  gap: 2px;
  align-items: center;
}

/* Player 牌位置 */
.player-cards {
  left: calc(25% - 60px);
}

/* Banker 牌位置 */
.banker-cards {
  right: calc(25% - 60px);
}

/* ========================= 扑克牌样式 ========================= */
.card {
  width: 36px;
  height: 54px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%);
  border-radius: 4px;
  border: 1px solid #d0d0d0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* 横向牌（第三张） */
.card.horizontal {
  transform: rotate(90deg);
  margin: 0 8px;
}

.banker-cards .card.horizontal {
  transform: rotate(-90deg);
}

/* ========================= 牌面样式 ========================= */
.card-face {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.card-value {
  font-size: 20px;
  font-weight: bold;
  font-family: Arial, sans-serif;
}

.card-suit {
  font-size: 16px;
}

.card-suit.red {
  color: #E74C3C;
}

.card-suit.black {
  color: #000000;
}
</style>
