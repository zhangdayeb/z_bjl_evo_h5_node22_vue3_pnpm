<!-- LuZhuListItem.vue - 路珠列表项容器组件 -->
<template>
  <div class="luzhu-list-item">
    <!-- 投注区组件 - 传递 tableId -->
    <LuZhuListItemBet
      :table-id="tableId"
      class="bet-section"
    />

    <!-- 路单显示组件 - 传递 gameData -->
    <LuZhuListItemRoadMap
      :game-data="gameData"
      class="roadmap-section"
    />

    <!-- 统计栏组件 - 传递 gameData -->
    <LuZhuListItemCount
      :game-data="gameData"
      class="count-section"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LuZhuListItemBet from './LuZhuListItemBet.vue'
import LuZhuListItemRoadMap from './LuZhuListItemRoadMap.vue'
import LuZhuListItemCount from './LuZhuListItemCount.vue'
// 从 roadmapCalculator 导入统一的类型定义
import type { GameResult } from '@/utils/roadmapCalculator'

// Props 定义
interface Props {
  tableId: string | number
}

const props = defineProps<Props>()

// 游戏数据 - 使用导入的 GameResult 类型
const gameData = ref<Record<string, GameResult>>({})

// 获取数据（模拟）
const fetchGameData = () => {

  // 实际应该根据 tableId 从接口获取数据
  // const response = await api.getGameData(props.tableId)

  // 这里使用模拟数据
  gameData.value = {
    "k0":{"result":1,"ext":0},
    "k1":{"result":1,"ext":1},
    "k2":{"result":1,"ext":2},
    "k3":{"result":1,"ext":3},
    "k4":{"result":2,"ext":0},
    "k5":{"result":1,"ext":0},
    "k6":{"result":1,"ext":0},
    "k7":{"result":1,"ext":0},
    "k8":{"result":1,"ext":0},
    "k9":{"result":2,"ext":0},
    "k10":{"result":2,"ext":0},
    "k11":{"result":2,"ext":1},
    "k12":{"result":1,"ext":1},
    "k13":{"result":2,"ext":0},
    "k14":{"result":2,"ext":0},
    "k15":{"result":2,"ext":0},
    "k16":{"result":1,"ext":0},
    "k17":{"result":2,"ext":0},
    "k18":{"result":2,"ext":0},
    "k19":{"result":2,"ext":0},
    "k20":{"result":1,"ext":2},
    "k21":{"result":3,"ext":0},
    "k22":{"result":3,"ext":1},
    "k23":{"result":3,"ext":0},
    "k24":{"result":2,"ext":0},
    "k25":{"result":1,"ext":1},
    "k26":{"result":1,"ext":0},
    "k27":{"result":1,"ext":0},
    "k28":{"result":1,"ext":0},
    "k29":{"result":1,"ext":0},
    "k30":{"result":1,"ext":3},
    "k31":{"result":2,"ext":0},
    "k32":{"result":1,"ext":2},
    "k33":{"result":1,"ext":0},
    "k34":{"result":3,"ext":0},
    "k35":{"result":2,"ext":2},
    "k36":{"result":2,"ext":0},
    "k37":{"result":1,"ext":0},
    "k38":{"result":1,"ext":0},
    "k39":{"result":1,"ext":0},
    "k40":{"result":1,"ext":0},
    "k41":{"result":1,"ext":0},
    "k42":{"result":3,"ext":0},
    "k43":{"result":1,"ext":0},
    "k44":{"result":2,"ext":0},
    "k45":{"result":2,"ext":3},
    "k46":{"result":2,"ext":0},
    "k47":{"result":1,"ext":0},
    "k48":{"result":1,"ext":0},
    "k49":{"result":1,"ext":0}
  }
}

// 组件挂载时获取数据
onMounted(() => {
  fetchGameData()
})
</script>

<style scoped>
/* 容器样式 */
.luzhu-list-item {
  width: 100%;
  height: 191px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

/* 各区域样式 */
.bet-section {
  height: 50px;
  flex-shrink: 0;
  border-bottom: 1px solid #e8e8e8;
}

.roadmap-section {
  height: 108px;
  flex-shrink: 0;
  border-bottom: 1px solid #e8e8e8;
}

.count-section {
  height: 33px;
  flex-shrink: 0;
}
</style>
