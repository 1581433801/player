<script setup lang="ts">
import KeypointList from './components/KeypointList.vue'
import Player from 'xgplayer'
import { onMounted } from 'vue'
import 'xgplayer/dist/index.min.css'
onMounted(() => {
  const playerDom = document.querySelector('.player')
  let player = new Player({
    id: 'mse',
    url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    videoInit: true,
    closeInactive: false,
    autoplay: true,
    loop: true,
    ignores: ['cssfullscreen'],
    fluid: true,
    fullscreenTarget: playerDom as HTMLElement
  })
})
</script>

<template>
  <div class="page">
    <div class="player">
      <KeypointList />
      <div id="mse"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  justify-content: center;
  .player {
    width: 85%;
    position: relative;
    #mse {
      position: relative; /* 设置相对定位以便于定位看点列表组件 */
      z-index: 1; /* 确保视频播放器在看点列表组件之下 */
    }
  }
}
</style>
