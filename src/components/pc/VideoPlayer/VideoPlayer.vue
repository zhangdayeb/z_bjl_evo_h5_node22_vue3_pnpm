<template>
  <div class="video-player">
    <iframe
      :src="videoUrl"
      frameborder="0"
      allowfullscreen
      scrolling="no"
      class="video-iframe"
    />
    <div class="gradient-mask"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  videoUrl: string
}

defineProps<Props>()
</script>

<style scoped>
.video-player {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000;
  overflow: hidden;
}

.video-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.gradient-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30px;
  background: linear-gradient(to bottom, transparent, #c8102e);
  pointer-events: none;
}
</style>
