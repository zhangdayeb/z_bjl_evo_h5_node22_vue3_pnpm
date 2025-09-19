<template>
  <div class="luzhu-container">
    <!-- Evolution Logo and Text -->
    <div class="evolution-content">
      <div class="powered-text">Powered by</div>
      <div class="evolution-logo">
        <svg class="logo-icon" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Evolution style arrow/chevron icon -->
          <path d="M8 20C8 20 15 12 20 12C25 12 32 20 32 20C32 20 25 28 20 28C15 28 8 20 8 20Z"
                fill="white"
                opacity="0.9"/>
          <path d="M12 20L20 12L28 20L20 28L12 20Z"
                stroke="white"
                stroke-width="2"
                fill="none"/>
        </svg>
        <span class="evolution-text">Evolution</span>
      </div>

      <!-- Static Loading Bar -->
      <div class="loading-bar-container">
        <div class="loading-bar-track">
          <div class="loading-bar-fill"></div>
          <div class="loading-star">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0L9.79 5.48L15.6 6.32L11.8 10.01L12.76 15.8L8 13L3.24 15.8L4.2 10.01L0.4 6.32L6.21 5.48L8 0Z"
                    fill="white"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LuzhuLoading'
}
</script>

<style scoped>
.luzhu-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a1a1f 0%, #2d2d35 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.evolution-content {
  text-align: center;
  position: relative;
}

.powered-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

.evolution-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
}

.logo-icon {
  animation: rotate 3s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.evolution-text {
  color: white;
  font-size: 36px;
  font-weight: 600;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #ffffff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.loading-bar-container {
  width: 240px;
  margin: 0 auto;
}

.loading-bar-track {
  position: relative;
  height: 2px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: visible;
}

.loading-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 40%,
    rgba(255, 255, 255, 0.8) 100%);
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  animation: loading 3s ease-in-out infinite;
}

@keyframes loading {
  0% {
    width: 0%;
  }
  50% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
}

.loading-star {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(-50%, -50%);
  animation: starMove 3s ease-in-out infinite;
}

@keyframes starMove {
  0% {
    left: 0%;
    opacity: 0.6;
  }
  50% {
    left: 100%;
    opacity: 1;
  }
  100% {
    left: 0%;
    opacity: 0.6;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
}

.loading-star {
  animation: starMove 3s ease-in-out infinite, pulse 1s ease-in-out infinite;
}

.loading-star svg {
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.6));
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .evolution-text {
    font-size: 28px;
  }

  .loading-bar-container {
    width: 200px;
  }

  .powered-text {
    font-size: 12px;
  }
}
</style>
