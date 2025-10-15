<template>
  <div class="loading-page">
    <!-- 背景 -->
    <div class="background"></div>

    <!-- 中心内容容器 -->
    <div class="content-wrapper">
      <!-- Baccarat Logo (在加载条上方) -->
      <div class="baccarat-logo"></div>

      <!-- 加载效果 (宽度180px) -->
      <div class="loading-container">
        <div class="glow"></div>
        <div class="track"></div>
        <div class="star">
          <div class="ray r1"></div>
          <div class="ray r2"></div>
          <div class="ray r3"></div>
          <div class="ray r4"></div>
          <div class="ray r5"></div>
          <div class="ray r6"></div>
          <div class="ray r7"></div>
          <div class="ray r8"></div>
          <div class="center"></div>
        </div>
      </div>

      <!-- 底部内容 (紧贴加载条下方) -->
      <div class="footer-content">
        <div class="powered">Powered by</div>
        <div class="evo-logo"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoadingPage',
  data() {
    return {
      // 可以在这里添加加载相关的数据
      loadingProgress: 0,
      isLoading: true
    }
  },
  mounted() {
    // 例如：模拟加载过程
    this.startLoading()
  },
  methods: {
    startLoading() {
      // 这里可以添加加载逻辑
    }
  }
}
</script>

<style scoped>
.loading-page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  font-family: Arial, sans-serif;
}

/* 渐变背景 */
.background {
  position: absolute;
  width: 100%;
  height: 100%;
  background:
    radial-gradient(
      ellipse at 50% 50%,
      rgba(181, 168, 145, 0.6) 0%,
      rgba(176, 163, 137, 0.3) 30%,
      transparent 70%
    ),
    linear-gradient(
      to bottom left,
      #bbae94 0%,
      #b9ac91 10%,
      #b7aa8f 20%,
      #b5a88d 30%,
      #b3a68b 40%,
      #b0a389 45%,
      #aea187 50%,
      #b0a389 55%,
      #b3a68b 60%,
      #b5a88d 70%,
      #b7aa8f 80%,
      #b9ac91 90%,
      #bbae94 100%
    );
}

/* 内容容器 - 所有元素居中 */
.content-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Baccarat Logo - 放大 */
.baccarat-logo {
  width: 320px;
  height: 110px;
  background: url('@/assets/images/common/logo.svg') center no-repeat;
  background-size: contain;
}

/* 加载条容器 - 宽度与Logo对齐 */
.loading-container {
  position: relative;
  width: 180px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 光线轨道 */
.track {
  position: absolute;
  width: 100%;
  height: 2px;
  top: 50%;
  transform: translateY(-50%);
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 2%,
    rgba(255, 255, 255, 0.3) 10%,
    rgba(255, 255, 255, 0.6) 25%,
    rgba(255, 255, 255, 0.9) 45%,
    #ffffff 50%,
    rgba(255, 255, 255, 0.9) 55%,
    rgba(255, 255, 255, 0.6) 75%,
    rgba(255, 255, 255, 0.3) 90%,
    rgba(255, 255, 255, 0.1) 98%,
    transparent 100%
  );
}

/* 轨道光晕 */
.glow {
  position: absolute;
  width: 100%;
  height: 20px;
  background: radial-gradient(
    ellipse at 50% 50%,
    rgba(255, 255, 255, 0.2) 0%,
    transparent 70%
  );
  filter: blur(8px);
}

/* 移动的星星 - 缩小尺寸 */
.star {
  position: absolute;
  width: 30px;
  height: 30px;
  left: -1px;
  animation: slide 2s linear infinite;
}

/* 8条光芒 - 缩小尺寸 */
.ray {
  position: absolute;
  width: 25px;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,0.4),
    rgba(255,255,255,0.9),
    rgba(255,255,255,0.4),
    transparent
  );
  top: 50%;
  left: 50%;
  transform-origin: center;
}

.r1 { transform: translate(-50%, -50%) rotate(0deg); }
.r2 { transform: translate(-50%, -50%) rotate(22.5deg); }
.r3 { transform: translate(-50%, -50%) rotate(45deg); }
.r4 { transform: translate(-50%, -50%) rotate(67.5deg); }
.r5 { transform: translate(-50%, -50%) rotate(90deg); }
.r6 { transform: translate(-50%, -50%) rotate(112.5deg); }
.r7 { transform: translate(-50%, -50%) rotate(135deg); }
.r8 { transform: translate(-50%, -50%) rotate(157.5deg); }

/* 星星中心点 - 缩小尺寸 */
.center {
  position: absolute;
  width: 5px;
  height: 5px;
  background: white;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px white;
}

@keyframes slide {
  from {
    left: -1px;
  }
  to {
    left: calc(100% + 1px);
  }
}

/* 底部文字和logo容器 */
.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

/* Powered by 文字 */
.powered {
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  font-weight: 300;
}

/* Evolution Logo - 放大 */
.evo-logo {
  width: 220px;
  height: 28px;
  background: url("data:image/svg+xml;charset=utf-8,%3Csvg width='330' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFF'%3E%3Cpath d='M103.534 5.493h20.347v4.61h-15.06v6.727h10.026v4.61H108.82v7.53h15.525v4.611h-20.812z'/%3E%3Cpath d='M122.88 13.615h5.415l4.738 13.917 4.4-13.917h5.245l-7.276 19.966h-4.865zm18.967 10.025c0-6.09 4.23-10.406 10.28-10.406 6.006 0 10.236 4.315 10.236 10.406 0 6.007-4.314 10.322-10.364 10.322-6.006 0-10.152-4.23-10.152-10.322zm15.186.127v-.17c0-3.806-1.861-6.09-4.907-6.09-3.088 0-4.949 2.284-4.949 6.09v.17c0 3.723 1.82 5.922 4.865 5.922 3.088 0 4.991-2.2 4.991-5.922zm7.714-18.655h5.287v28.469h-5.287zm8.306 20.474V13.615h5.245V25.29c0 2.665 1.27 4.23 3.638 4.23 2.75 0 3.892-2.326 3.892-5.753V13.615h5.245V33.58h-5.245v-2.834c-1.058 2.073-2.877 3.215-5.457 3.215-4.526 0-7.318-3.215-7.318-8.376zm22.815 2.707V17.845h-2.834v-4.23h2.834V9.85l5.119-2.876v6.64h3.934v4.231h-3.976v9.94c0 .974.465 1.397 1.438 1.44h2.326v4.356h-4.06c-3.85-.211-4.696-1.988-4.78-5.288zm11.436-22.715h5.457v5.118h-5.457V5.578zm.085 8.037h5.288V33.58h-5.288V13.615zm7.671 10.025c0-6.09 4.23-10.406 10.28-10.406 6.007 0 10.237 4.315 10.237 10.406 0 6.007-4.315 10.322-10.364 10.322-6.007 0-10.152-4.23-10.152-10.322zm15.187.127v-.17c0-3.806-1.861-6.09-4.907-6.09-3.088 0-4.95 2.284-4.95 6.09v.17c0 3.723 1.82 5.922 4.865 5.922 3.088 0 4.992-2.2 4.992-5.922zm7.671-10.152h5.246v3.257c1.057-2.327 3.003-3.68 5.837-3.68 4.357 0 6.938 2.919 6.938 8.418v11.97h-5.246V21.906c0-2.792-1.057-4.23-3.51-4.23-2.497 0-4.02 2.03-4.02 5.753V33.58h-5.245V13.615zM94.61 8.579C89.833 2.276 81.135.499 73.929 4.347c2.816 6.339 4.926 13.779 18.806 14.214 1.629.051 3.418.007 5.391-.148-.284-3.975-1.578-7.276-3.516-9.834zm-2.56 11.108c-8.35.413-12.272 3.458-14.721 7.213-1.441 2.21-2.374 4.665-3.4 6.974 10.131 5.41 23.214-.295 24.198-14.067-2.253-.177-4.267-.21-6.075-.12z'/%3E%3C/g%3E%3C/svg%3E") center no-repeat;
  background-size: contain;
  opacity: 0.9;
}
</style>
