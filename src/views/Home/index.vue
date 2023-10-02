<script setup lang="ts">
import Player from 'xgplayer'
import { onMounted } from 'vue'
import 'xgplayer/dist/index.min.css'
onMounted(() => {
  let player = new Player({
    id: 'mse',
    url: 'https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4',
    videoInit: true,
    closeInactive: false,
    autoplay: true,
    loop: true,
    fitVideoSize: 'fixWidth'
  })
})
</script>

<template>
  <div id="mse"></div>
</template>

<style lang="scss" scoped></style>
