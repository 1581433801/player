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
onMounted(async () => {
  const res = await getPointList()
  pointList.value = res.keypoints
  const playerDom = document.querySelector('.player')
  // 页面加载时设置播放器的播放进度

  // let player = new Player({
  player = new Player({
    id: 'mse',
    url: res.mediaUrl,
    videoInit: true,
    closeInactive: false,
    autoplay: true,
    videoFillMode: 'cover',
    loop: true,
    ignores: ['cssfullscreen'],
    fullscreenTarget: playerDom as HTMLElement,
    height: 800,
    width: '100%',
    progressDot: []
  })
  player.currentTime = store.lastPlayedTime.value

  // 监听播放
  trackPlaybackProgress()
})
const store = toRefs(usePlayerStore())
const trackPlaybackProgress = () => {
  player.on('timeupdate', () => {
    console.log('监听到播放器timeupdate')
    store.updateLastPlayedTime.value(player.currentTime) // 更新播放时间
    const index = pointList.value.findIndex(
      (item) =>
        item.timestamps &&
        player.currentTime >= item.timestamps.start &&
        player.currentTime <= item.timestamps.end
    )
    console.log('计算得到的当前对应播放项的下标', index)
    // TODO 将计算得到的下标同步到Pinia仓库
    if (index !== -1) store.updatePlayingIndex.value(index)
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
    margin-top: 50px;
    width: 74%;
    height: 800px;
    position: relative;
    #mse {
      position: relative; /* 设置相对定位以便于定位看点列表组件 */
      z-index: 1; /* 确保视频播放器在看点列表组件之下 */
    }
  }
}
</style>
