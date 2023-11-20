<script setup lang="ts">
import KeypointList from './components/KeypointList.vue'
// import ImagePlayer from './components/ImagePlayer.vue'
import Player from 'xgplayer'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { onMounted, ref, watch } from 'vue'
import 'xgplayer/dist/index.min.css'
import type { PointItem } from '@/types/home'
import { getPointList } from '@/api/home'
const pointList = ref<PointItem[]>([])
let player: any
onMounted(async () => {
  const res = await getPointList()
  pointList.value = res.keypoints
  const playerDom = document.querySelector('.player')
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
  // 监听播放
  trackPlaybackProgress()
})
// ...其他代码
const trackPlaybackProgress = () => {
  player.on('timeupdate', () => {
    console.log('监听到播放器timeupdate')
    const index = pointList.value.findIndex(
      (item) =>
        item.timestamps &&
        player.currentTime >= item.timestamps.start &&
        player.currentTime <= item.timestamps.end
    )
    console.log('计算得到的当前下标', index)
    // TODO 将计算得到的下标同步到Pinia仓库
  })
}
// // 当前资源类型
// const currType = ref<string>('video')
// watch(currType, (newType, oldType) => {
//   console.log('检测到变动')
//   if (newType === 'image' && player) {
//     player.pause()
//   } else if (newType === 'video' && player) {
//     player.play()
//   }
// })
// // 自定义事件修改父组件中的currType值\
// const handleUpdateCurrType = async (point: PointItem & { index: number }) => {
//   console.log(point)
//   highlightKeypoint.value = point.index
//   currType.value = point.type
//   if (point.type === 'video' && player) {
//     player.currentTime = point.timestamps?.start
//     // 其他逻辑...
//   }
// }
</script>

<template>
  <div class="page">
    <div class="player">
      <KeypointList v-if="pointList.length" :point-list="pointList" />
      <!-- 视频播放组件 -->
      <!-- <div id="mse" v-show="currType === 'video'"></div> -->
      <div id="mse"></div>
      <!-- 图片播放组件 -->
      <!-- <ImagePlayer v-show="currType === 'image'"></ImagePlayer> -->
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
