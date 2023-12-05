<script setup lang="ts">
import KeypointList from './components/KeypointList.vue'
import Player from 'xgplayer'
import { onMounted, ref, toRefs } from 'vue'
import 'xgplayer/dist/index.min.css'
import type { PointItem } from '@/types/home'
import { getPointList } from '@/api/home'
import { usePlayerStore } from '@/stores'
const pointList = ref<PointItem[]>([])
let player: any
const store = toRefs(usePlayerStore())
const initPlayer = (videoUrl: string) => {
  const playerDom = document.querySelector('.player')
  player = new Player({
    id: 'mse',
    url: videoUrl,
    videoInit: true,
    closeInactive: false,
    autoplay: true,
    loop: true,
    ignores: ['cssfullscreen'],
    fullscreenTarget: playerDom as HTMLElement,
    width: '100vw',
    height: '100vh',
    marginControls: true,
    fitVideoSize: 'fixed',
    videoFillMode: 'contain',
    playbackRate: []
  })

  player.currentTime = store.lastPlayedTime.value
  trackPlaybackProgress()
}
onMounted(async () => {
  const res = await getPointList()
  pointList.value = res.keypoints
  if (pointList.value.length > 0) {
    const firstPoint = pointList.value[0]
    const videoUrl =
      store.currentVideoUrl.value ||
      res.videoBaseUrl + '/' + firstPoint.videoId + '.mp4'
    initPlayer(videoUrl)
  }
})
// onMounted(async () => {
//   const res = await getPointList()
//   pointList.value = res.keypoints
//   const playerDom = document.querySelector('.player')
//   // 页面加载时设置播放器的播放进度

//   // let player = new Player({
//   player = new Player({
//     id: 'mse',
//     url: res.mediaUrl,
//     videoInit: true,
//     closeInactive: false,
//     autoplay: true,
//     videoFillMode: 'cover',
//     loop: true,
//     ignores: ['cssfullscreen'],
//     fullscreenTarget: playerDom as HTMLElement,
//     height: 800,
//     width: '100%',
//     progressDot: []
//   })
//   player.currentTime = store.lastPlayedTime.value

//   // 监听播放
//   trackPlaybackProgress()
// })
const trackPlaybackProgress = () => {
  player.on('timeupdate', () => {
    store.updateLastPlayedTime.value(player.currentTime) // 更新播放时间
    const currentVideoId = store.currentVideoId.value
    const index = pointList.value.findIndex(
      (item) =>
        item.timestamps &&
        item.videoId === currentVideoId &&
        player.currentTime >= item.timestamps.start &&
        player.currentTime <= item.timestamps.end
    )

    console.log('检测到播放', `index=${index}`)
    if (index !== -1) {
      store.updatePlayingIndex.value(index)
    }
  })
}
</script>

<template>
  <div class="page">
    <div class="player">
      <KeypointList v-if="pointList.length" :point-list="pointList" />

      <div id="mse"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  justify-content: center;
  .player {
    display: flex;
    align-items: center; /* 垂直居中 */
    justify-content: flex-end; /* 使子元素靠右排列，因为您想要的是靠右对齐 */
    width: 100%;
    #mse {
      position: relative; /* 设置相对定位以便于定位看点列表组件 */
      z-index: 1; /* 确保视频播放器在看点列表组件之下 */
    }
  }
}
</style>
