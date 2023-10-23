<script setup lang="ts">
import KeypointList from './components/KeypointList.vue'
import ImagePlayer from './components/ImagePlayer.vue'
import Player from 'xgplayer'
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
    progressDot: [
      {
        id: 0, // 唯一标识，用于删除的时候索引
        time: 30, // 展示的时间点，例子为在播放到10s钟的时候展示
        text: '连续射门机会', // hover的时候展示文案，可以为空
        duration: 10, // 展示时间跨度，单位为s
        style: {
          // 指定样式
          fontSize: '30px',
          backgroundColor: 'orange'
        }
      },
      {
        id: 0, // 唯一标识，用于删除的时候索引
        time: 60, // 展示的时间点，例子为在播放到10s钟的时候展示
        text: '比赛时刻绝杀', // hover的时候展示文案，可以为空
        duration: 10, // 展示时间跨度，单位为s
        style: {
          // 指定样式
          backgroundColor: 'orange'
        }
      },
      {
        id: 0, // 唯一标识，用于删除的时候索引
        time: 90, // 展示的时间点，例子为在播放到10s钟的时候展示
        text: '观众欢呼', // hover的时候展示文案，可以为空
        duration: 5, // 展示时间跨度，单位为s
        style: {
          // 指定样式
          backgroundColor: 'orange'
        }
      }
    ]
  })
  // 监听播放
  trackPlaybackProgress()
})
// ...其他代码
const highlightKeypoint = ref<number | null>(null) // 高亮看点索引
const trackPlaybackProgress = () => {
  player.on('timeupdate', () => {
    console.log(111333)
    const index = pointList.value.findIndex(
      (item) =>
        item.timestamps &&
        player.currentTime >= item.timestamps.start &&
        player.currentTime <= item.timestamps.end
    )
    if (currType.value !== 'image') highlightKeypoint.value = index
    console.log(highlightKeypoint.value)
  })
}
// 当前资源类型
const currType = ref<string>('video')
watch(currType, (newType, oldType) => {
  console.log('检测到变动')
  if (newType === 'image' && player) {
    player.pause()
  } else if (newType === 'video' && player) {
    player.play()
  }
})
// 自定义事件修改父组件中的currType值\
const handleUpdateCurrType = async (point: PointItem & { index: number }) => {
  console.log('666')
  highlightKeypoint.value = point.index
  currType.value = point.type
  if (point.type === 'video' && player) {
    player.currentTime = point.timestamps?.start
    // 其他逻辑...
  }
}
</script>

<template>
  <div class="page">
    <div class="player">
      <KeypointList
        :highlight-keypoint="highlightKeypoint"
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
