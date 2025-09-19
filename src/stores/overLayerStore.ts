// src/stores/overLayerStore.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

type PanelType = 'chipSelector' | 'winningEffect' | 'luZhuList' | 'settingsPanel' | 'cashier' | 'chipFly' | 'resultFly'

export const useoverLayerStore = defineStore('ui', () => {
  // 当前打开的面板
  const activePanel = ref<PanelType | null>(null)

  // 打开面板
  const open = (panel: PanelType) => {
    activePanel.value = panel
  }

  // 关闭面板
  const close = () => {
    activePanel.value = null
  }

  // 使用 computed 创建响应式属性
  const chipSelector = computed(() => activePanel.value === 'chipSelector')
  const winningEffect = computed(() => activePanel.value === 'winningEffect')
  const luZhuList = computed(() => activePanel.value === 'luZhuList')
  const settingsPanel = computed(() => activePanel.value === 'settingsPanel')
  const cashier = computed(() => activePanel.value === 'cashier')
  const chipFly = computed(() => activePanel.value === 'chipFly')
  const resultFly = computed(() => activePanel.value === 'resultFly')

  return {
    activePanel,
    open,
    close,

    // 导出计算属性
    chipSelector,
    winningEffect,
    luZhuList,
    settingsPanel,
    cashier,
    chipFly,
    resultFly
  }
})
