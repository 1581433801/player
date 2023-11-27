<script setup lang="ts">
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import type { PointItem } from '@/types/home'
import PlaylistItem from '@/views/Home/components/PlaylistItem.vue'
import { usePlayerStore } from '@/stores' // 导入 Pinia store

const {
  playingIndex,
  customLayerIndex,
  updatePlayingIndex,
  updateCustomLayerIndex,
  updateCurrentVideoId,
  updateCurrentVideoUrl
} = toRefs(usePlayerStore())
const props = defineProps<{
  pointList: PointItem[]
}>()
const playlistData = props.pointList
// const playingIndex = ref(0) // 初始设置为第一个播放项, TODO 后续需要持久化
// const customLayerIndex = ref(3) // 当前播放项所在层级
// 定义计算属性
const displayedPlaylist = computed(() => {
  // 确保播放索引在有效范围内
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  updatePlayingIndex.value(
    Math.min(playingIndex.value, playlistData.length - 1)
  )
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  updatePlayingIndex.value(Math.max(0, playingIndex.value))

  const totalItems = playlistData.length
  const listSize = 7 // 列表固定大小
  let startIndex = playingIndex.value - customLayerIndex.value

  // 调整 startIndex 保证它在合理范围内
  startIndex = Math.max(-customLayerIndex.value, startIndex)

  let displayedItems = playlistData.slice(
    Math.max(0, startIndex),
    Math.min(startIndex + listSize, totalItems)
  )

  // 如果 startIndex 为负，说明需要在列表上方添加空位
  if (startIndex < 0) {
    const emptyItemsAtStart = Array(-startIndex).fill({})
    displayedItems = [...emptyItemsAtStart, ...displayedItems]
  }

  // 检查是否需要在列表末尾添加空位
  if (displayedItems.length < listSize) {
    const emptyItemsAtEnd = Array(listSize - displayedItems.length).fill({})
    displayedItems = [...displayedItems, ...emptyItemsAtEnd]
  }

  return displayedItems
})
const currentPlayingItem = computed(() => {
  //返回当前正在播放的项目
  return playlistData[playingIndex.value]
})
const handleDragStart = (e: DragEvent) => {
  e.dataTransfer?.setData('text/plain', customLayerIndex.value.toString())
}

const handleDrop = (e: DragEvent, newIndex: number) => {
  e.preventDefault()
  const oldIndex = parseInt(e.dataTransfer!.getData('text/plain'))
  if (oldIndex === customLayerIndex.value) {
    customLayerIndex.value = newIndex
  }
  // 拖拽完成，重置 draggingOverIndex
  draggingOverIndex.value = -1
}
const draggingOverIndex = ref(-1) // 新增状态，-1表示没有拖拽
const handleDragOver = (e: DragEvent, index: number) => {
  e.preventDefault()
  draggingOverIndex.value = index // 设置当前拖拽经过的索引
}

const handleDragLeave = () => {
  draggingOverIndex.value = -1 // 重置拖拽索引
}
const longPressTimer = ref()
const isLongPress = ref(false) // 追踪是否长按

const handleMouseDown = (index: number, e: any) => {
  if (index < customLayerIndex.value) {
    // 如果长按已播放项
    longPressTimer.value = setTimeout(() => {
      listToShow.value = playlistData.slice(0, playingIndex.value) // 设置为已播放项列表
      showItemsList.value = true // 显示列表
      listTypeToShow.value = 'played'
    }, 200)
  } else if (index > customLayerIndex.value) {
    // 如果长按未播放项
    longPressTimer.value = setTimeout(() => {
      listToShow.value = playlistData.slice(playingIndex.value + 1) // 设置为未播放项列表
      showItemsList.value = true // 显示列表
      listTypeToShow.value = 'upcoming'
    }, 200)
  } else if (index === customLayerIndex.value) {
    // 如果长按当前播放项
    longPressTimer.value = setTimeout(() => {
      isLongPress.value = true
      e.target.classList.add('draggable')
      e.target.setAttribute('draggable', true)
    }, 200)
  }
  window.addEventListener('mouseup', handleMouseUp)
  e.target.addEventListener('dragend', handleMouseUp)
}

const handleMouseUp = () => {
  console.log('全局释放')
  clearTimeout(longPressTimer.value)
  isLongPress.value = false

  const draggableItems = document.querySelectorAll('[draggable="true"]')
  draggableItems.forEach((elem) => {
    elem.classList.remove('draggable')
    elem.removeAttribute('draggable')
  })

  // 移除全局mouseup事件监听器
  window.removeEventListener('mouseup', handleMouseUp)
}
onMounted(() => {
  handleClick(playlistData[playingIndex.value])
})
let edVideoId = ref<null | string>(null)
const handleClick = (item: PointItem) => {
  // 获取视频元素（根据实际情况调整选择器）
  const videoPlayer = document.querySelector('video')
  // 如果点击的看点属于不同的视频
  if (item.videoId !== edVideoId.value && videoPlayer) {
    // 更改videoPlayer的视频源
    // 构建新的视频 URL
    const newVideoUrl = `https://qi-1310338158.cos.ap-beijing.myqcloud.com/${item.videoId}.mp4` // 请根据实际情况调整 URL 格式
    updateCurrentVideoId.value(item.videoId)
    updateCurrentVideoUrl.value(newVideoUrl)
    // 如果点击的看点属于不同的视频
    // 更改 videoPlayer 的视频源
    videoPlayer.src = newVideoUrl
  }
  console.log(playlistData.findIndex((i) => i.pointId === item.pointId))
  updatePlayingIndex.value(
    playlistData.findIndex((i) => i.pointId === item.pointId)
  )

  // 如果视频元素存在且 item 有有效的时间戳
  if (videoPlayer && item.timestamps) {
    // 设置视频播放器的当前时间
    videoPlayer.currentTime = item.timestamps.start
  }
  edVideoId.value = item.videoId
}

const showItemsList = ref(false) // 控制弹出层的显示
const listToShow = ref<PointItem[]>([]) // 要展示的列表

const handleCloseTemporaryList = () => {
  showItemsList.value = false // 关闭已播放项列表
}
const handleSelectItem = (selectedItem: PointItem) => {
  handleClick(selectedItem)
  // 处理已播放项的选择逻辑，例如更新 playingIndex
  const newIndex = playlistData.findIndex(
    (item) => item.pointId === selectedItem.pointId
  )
  updatePlayingIndex.value(newIndex)
  showItemsList.value = false // 选择后关闭弹出窗口
}

// 用户长按的列表类型（'played' 或 'upcoming'）
const listTypeToShow = ref<string>('')
// 更新 listToShow 的函数
const updateListToShow = () => {
  if (showItemsList.value) {
    if (listTypeToShow.value === 'played') {
      listToShow.value = playlistData.slice(0, playingIndex.value)
    } else if (listTypeToShow.value === 'upcoming') {
      listToShow.value = playlistData.slice(playingIndex.value + 1)
    }
  }
}

// 使用 watch 监听 playingIndex 的变化
watch(playingIndex, () => {
  updateListToShow()
})
</script>
<template>
  <div ref="container" class="keypoint-list">
    <div v-if="showItemsList" class="temporary-popup">
      <!-- 已播放项列表 -->
      <!-- 背景色为红色 -->
      <el-scrollbar>
        <div class="playedOrfuture-list">
          <PlaylistItem
            v-for="item in listToShow"
            :key="item.timestamps?.start"
            :item="item"
            :isPlaying="item === currentPlayingItem"
            @click="handleSelectItem(item)"
          />
        </div>
      </el-scrollbar>
      <!-- 当前播放项 -->
      <div class="current-playing-item">
        <PlaylistItem
          :item="currentPlayingItem"
          :isPlaying="true"
          @click="handleCloseTemporaryList"
        />
      </div>
    </div>
    <ul v-else>
      <PlaylistItem
        v-for="(item, index) in displayedPlaylist"
        :key="index"
        :item="item"
        :isPlaying="item === currentPlayingItem"
        :isDragOver="draggingOverIndex === index"
        @drop="handleDrop($event, index)"
        @dragover="handleDragOver($event, index)"
        @dragleave="handleDragLeave"
        @click="handleClick(item)"
        @mousedown="handleMouseDown(index, $event)"
        @dragstart="handleDragStart"
      />
    </ul>
  </div>
</template>

<style scoped lang="scss">
.el-scrollbar__thumb {
  background-color: #0042c5 !important;
}
.keypoint-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  width: 280px;
  height: 450px;
  top: 180px;
  right: 0;
  z-index: 100;
  overflow: hidden;
  // background-color: rgba(0, 0, 0, 0.4); /* 半透明背景 */
  background: linear-gradient(
    to top,
    transparent,
    rgba(0, 0, 0, 0.8),
    transparent
  );
  .temporary-popup {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 450px;
  }
  .playedOrfuture-list {
    flex: 1;
  }
  .toggleButton {
    cursor: pointer;
    margin-left: 10px;
    padding: 10px;
    border-radius: 20px;
    background-color: rgba(225, 211, 211, 0.3);
    font-size: 25px;
    color: #ffffff;
    position: absolute;
    top: 48%;
    &:hover {
      background-color: rgba(225, 211, 211, 0.3);
    }
  }
}
.showList {
  cursor: pointer;
  margin-left: 10px;
  padding: 10px;
  border-radius: 20px;
  background-color: rgba(0, 0, 0, 0.1);
  font-size: 25px;
  margin-right: 10px;
  color: #ffffff;
  position: absolute;
  top: 50%;
  right: 0;
  z-index: 10;
  &:hover {
    background-color: rgba(225, 211, 211, 0.3);
  }
}
</style>
