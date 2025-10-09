<template>
  <div class="video-player">
    <iframe
      :src="videoUrl"
      frameborder="0"
      allowfullscreen
      scrolling="no"
      class="video-iframe"
    />
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
  border-radius: 8px;
}

.video-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>
