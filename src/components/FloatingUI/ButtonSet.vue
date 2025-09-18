<template>
  <div class="button-set-container">
    <button
      class="button-set"
      @click="handleClick"
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
// Emits
const emit = defineEmits<{
  click: []
}>()

// Methods
const handleClick = () => {
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
  width: 44px;
  height: 44px;
  padding: 0;
  background: rgba(26, 26, 26, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 44px;
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
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
  border-radius: 44px;
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
  width: 22px;
  height: 22px;
  color: rgba(255, 255, 255, 0.8);
}

.icon {
  width: 100%;
  height: 100%;
  fill: currentColor;
}
</style>
