<script setup lang="ts">
import KeypointList from './components/KeypointList.vue'
import ImagePlayer from './components/ImagePlayer.vue'
import Player from 'xgplayer'
import { onMounted, ref } from 'vue'
import 'xgplayer/dist/index.min.css'
import type { PointItem } from '@/types/home'
import { getPointList } from '@/api/home'
const pointList = ref<PointItem[]>([])
onMounted(async () => {
  const res = await getPointList()
  pointList.value = res.keypoints
  const playerDom = document.querySelector('.player')
  // let player = new Player({
  new Player({
    id: 'mse',
    url: res.mediaUrl,
    videoInit: true,
    closeInactive: false,
    autoplay: true,
    loop: true,
    ignores: ['cssfullscreen'],
    fullscreenTarget: playerDom as HTMLElement,
    height: 800,
    width: '100%'
  })
})
// 当前资源类型
const currType = ref<string>('video')
// 自定义事件修改父组件中的currType值\
const handleUpdateCurrType = (type: string) => {
  console.log(type)
  currType.value = type
}
</script>

<template>
  <div class="page">
    <div class="player">
      <KeypointList
        @updateCurrType="handleUpdateCurrType"
        :point-list="pointList"
      />
      <!-- 视频播放组件 -->
      <div id="mse" v-show="currType === 'video'"></div>
      <!-- 图片播放组件 -->
      <ImagePlayer v-show="currType === 'image'"></ImagePlayer>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  justify-content: center;
  .player {
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
