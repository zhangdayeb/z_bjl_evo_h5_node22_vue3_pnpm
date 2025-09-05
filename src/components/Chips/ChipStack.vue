<!-- components/Chips/ChipStack.vue -->
<template>
  <div class="chip-stack" :class="`chip-stack--${size}`">
    <div 
      v-for="(chip, index) in chips"
      :key="index"
      class="chip"
      :class="`chip--${chip.value}`"
      :style="{
        transform: `translateY(${-index * 3}px)`,
        zIndex: index
      }"
    >
      <div class="chip__inner">
        <span class="chip__value">{{ chip.label }}</span>
      </div>
    </div>
    
    <!-- 总额显示 -->
    <div class="chip-stack__total">
      {{ formatAmount(amount) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  amount: number
  size?: 'small' | 'medium' | 'large'
}>()

const chipValues = [
  { value: 1000, label: '1K', color: '#FFD700' },
  { value: 500, label: '500', color: '#800080' },
  { value: 100, label: '100', color: '#000000' },
  { value: 50, label: '50', color: '#FFA500' },
  { value: 25, label: '25', color: '#00FF00' },
  { value: 10, label: '10', color: '#0000FF' },
  { value: 5, label: '5', color: '#FF0000' },
  { value: 1, label: '1', color: '#FFFFFF' }
]

const chips = computed(() => {
  const result = []
  let remaining = props.amount
  
  for (const chipType of chipValues) {
    while (remaining >= chipType.value && result.length < 10) {
      result.push(chipType)
      remaining -= chipType.value
    }
  }
  
  return result
})

function formatAmount(amount: number): string {
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`
  }
  return amount.toString()
}
</script>

<style scoped lang="scss">
@import '@/assets/styles/variables.scss';

.chip-stack {
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  
  &--small .chip {
    width: 30px;
    height: 30px;
  }
  
  &--medium .chip {
    width: 40px;
    height: 40px;
  }
  
  &--large .chip {
    width: 50px;
    height: 50px;
  }
  
  .chip {
    position: absolute;
    border-radius: 50%;
    border: 2px dashed rgba(255, 255, 255, 0.5);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    
    &__inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }
    
    // 筹码颜色
    &--1000 .chip__inner {
      background: radial-gradient(circle, #FFD700, #B8860B);
    }
    
    &--500 .chip__inner {
      background: radial-gradient(circle, #800080, #4B0082);
    }
    
    &--100 .chip__inner {
      background: radial-gradient(circle, #2C2C2C, #000000);
    }
    
    &--50 .chip__inner {
      background: radial-gradient(circle, #FFA500, #FF8C00);
    }
    
    &--25 .chip__inner {
      background: radial-gradient(circle, #00FF00, #008000);
    }
    
    &--10 .chip__inner {
      background: radial-gradient(circle, #4169E1, #0000FF);
    }
    
    &--5 .chip__inner {
      background: radial-gradient(circle, #FF6B6B, #FF0000);
    }
    
    &--1 .chip__inner {
      background: radial-gradient(circle, #FFFFFF, #C0C0C0);
      color: #333;
    }
  }
  
  &__total {
    position: absolute;
    bottom: -25px;
    background: rgba(0, 0, 0, 0.8);
    color: #FFD700;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    white-space: nowrap;
  }
}
</style>