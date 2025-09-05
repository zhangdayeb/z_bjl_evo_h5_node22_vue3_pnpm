<!-- components/Roads/BigRoad.vue -->
<template>
  <div class="big-road">
    <div class="road-grid">
      <div
        v-for="(cell, index) in cells"
        :key="index"
        class="road-cell"
        :style="{
          gridColumn: cell.x + 1,
          gridRow: cell.y + 1
        }"
      >
        <div 
          class="road-marker"
          :class="`road-marker--${cell.type}`"
        >
          <span v-if="cell.tie">{{ cell.tie }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoadStore } from '@/stores/roads'

const roadStore = useRoadStore()

const cells = computed(() => roadStore.bigRoadCells)
</script>

<style scoped lang="scss">
.big-road {
  background: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 10px;
  
  .road-grid {
    display: grid;
    grid-template-columns: repeat(30, 20px);
    grid-template-rows: repeat(6, 20px);
    gap: 1px;
    background: rgba(255, 255, 255, 0.1);
    
    .road-cell {
      position: relative;
      
      .road-marker {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        color: white;
        font-weight: bold;
        
        &--player {
          background: $color-player;
          border: 1px solid darken($color-player, 10%);
        }
        
        &--banker {
          background: $color-banker;
          border: 1px solid darken($color-banker, 10%);
        }
        
        &--tie {
          background: transparent;
          border: 2px solid $color-tie;
          color: $color-tie;
        }
      }
    }
  }
}
</style>