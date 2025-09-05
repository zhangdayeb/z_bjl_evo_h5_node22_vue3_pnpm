// composables/useResponsive.ts
import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useResponsive() {
  const windowWidth = ref(window.innerWidth)
  const windowHeight = ref(window.innerHeight)
  
  const isDesktop = computed(() => windowWidth.value >= 1024)
  const isTablet = computed(() => 
    windowWidth.value >= 768 && windowWidth.value < 1024
  )
  const isMobile = computed(() => windowWidth.value < 768)
  const isPortrait = computed(() => 
    windowHeight.value > windowWidth.value
  )
  
  function updateDimensions() {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
  }
  
  onMounted(() => {
    window.addEventListener('resize', updateDimensions)
    window.addEventListener('orientationchange', updateDimensions)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions)
    window.removeEventListener('orientationchange', updateDimensions)
  })
  
  return {
    windowWidth,
    windowHeight,
    isDesktop,
    isTablet,
    isMobile,
    isPortrait,
    updateDimensions
  }
}