// src/stores/uiStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

type PanelType = 'chipSelector' | 'winningEffect' | 'luZhuList' | 'settingsPanel' | 'cashier'

export const useUIStore = defineStore('ui', () => {
  // 当前打开的面板（只能有一个）
  const activePanel = ref<PanelType | null>(null)

  // 打开面板（自动关闭其他）
  const open = (panel: PanelType) => {
    activePanel.value = panel
  }

  // 关闭面板
  const close = () => {
    activePanel.value = null
  }

  // 检查面板是否打开
  const isOpen = (panel: PanelType) => {
    return activePanel.value === panel
  }

  return {
    activePanel,
    open,
    close,
    isOpen,

    // 为了兼容性，提供计算属性
    get chipSelector() { return isOpen('chipSelector') },
    get winningEffect() { return isOpen('winningEffect') },
    get luZhuList() { return isOpen('luZhuList') },
    get settingsPanel() { return isOpen('settingsPanel') },
    get cashier() { return isOpen('cashier') }
  }
})
