<template>
  <div class="button-set-container">
    <button
      class="button-set"
      :class="{ 'active': isActive }"
      @click="handleClick"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <span class="button-content">
        <div class="button-base"></div>
        <div class="icon-wrapper">
          <svg viewBox="0 0 24 24" class="icon">
            <path d="M20 6H4v2h16V6Zm0 5H4v2h16v-2ZM4 16h16v2H4v-2Z"/>
          </svg>
        </div>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Props
interface Props {
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  active: false
})

// Emits
const emit = defineEmits<{
  click: []
}>()

// State
const isHovered = ref(false)
const isActive = ref(props.active)

// Methods
const handleClick = () => {
  isActive.value = !isActive.value
  emit('click')
}
</script>

<style scoped>
.button-set-container {
  position: relative;
  display: inline-block;
}

.button-set {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: rgba(26, 26, 26, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.button-set:hover {
  background: rgba(40, 40, 40, 0.95);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(255, 255, 255, 0.05);
}

.button-set.active {
  background: rgba(24, 144, 255, 0.15);
  border-color: rgba(24, 144, 255, 0.3);
}

.button-set.active:hover {
  background: rgba(24, 144, 255, 0.2);
  border-color: rgba(24, 144, 255, 0.4);
  box-shadow:
    0 4px 12px rgba(24, 144, 255, 0.2),
    0 0 20px rgba(24, 144, 255, 0.1);
}

.button-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.button-base {
  position: absolute;
  inset: 1px;
  border-radius: 6px;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s ease;
}

.button-set:hover .icon-wrapper {
  color: rgba(255, 255, 255, 0.95);
}

.button-set.active .icon-wrapper {
  color: #40a9ff;
}

.icon {
  width: 100%;
  height: 100%;
  fill: currentColor;
}

/* 动画效果 */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(24, 144, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0);
  }
}

.button-set.active {
  animation: pulse 2s infinite;
}

/* 响应式 */
@media (max-width: 768px) {
  .button-set {
    width: 36px;
    height: 36px;
  }

  .icon-wrapper {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 480px) {
  .button-set {
    width: 32px;
    height: 32px;
  }

  .icon-wrapper {
    width: 16px;
    height: 16px;
  }
}
</style>
