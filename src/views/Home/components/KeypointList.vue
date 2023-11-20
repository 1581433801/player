<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PointItem } from '@/types/home'
import PlaylistItem from '@/views/Home/components/PlaylistItem.vue'
const playlistData = {
  status: 'success',
  title: '混合媒体展示',
  mediaUrl:
    'https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_20mb.mp4',
  keypoints: [
    {
      type: 'video',
      description: '1 连续射门机会',
      timestamps: {
        start: 2,
        end: 5
      }
    },
    {
      type: 'video',
      description: '2 比赛时刻绝杀',
      timestamps: {
        start: 6,
        end: 8
      }
    },
    {
      type: 'video',
      description: '3 观众欢呼',
      timestamps: {
        start: 9,
        end: 11
      }
    },
    {
      type: 'video',
      description: '4 连续射门机会',
      timestamps: {
        start: 12,
        end: 14
      }
    },
    {
      type: 'video',
      description: '5 比赛时刻绝杀',
      timestamps: {
        start: 26,
        end: 29
      }
    },
    {
      type: 'video',
      description: '6 观众欢呼',
      timestamps: {
        start: 32,
        end: 35
      }
    },
    {
      type: 'video',
      description: '7 连续射门机会',
      timestamps: {
        start: 38,
        end: 41
      }
    },
    {
      type: 'video',
      description: '8 比赛时刻绝杀',
      timestamps: {
        start: 44,
        end: 47
      }
    },
    {
      type: 'video',
      description: '9 观众欢呼',
      timestamps: {
        start: 50,
        end: 53
      }
    },
    {
      type: 'video',
      description: '10 连续射门机会',
      timestamps: {
        start: 56,
        end: 59
      }
    },
    {
      type: 'video',
      description: '11 比赛时刻绝杀',
      timestamps: {
        start: 62,
        end: 65
      }
    },
    {
      type: 'video',
      description: '12 观众欢呼',
      timestamps: {
        start: 68,
        end: 71
      }
    },
    {
      type: 'video',
      description: '13 观众欢呼',
      timestamps: {
        start: 74,
        end: 77
      }
    },
    {
      type: 'video',
      description: '14 观众欢呼',
      timestamps: {
        start: 80,
        end: 83
      }
    },
    {
      type: 'video',
      description: '15 观众欢呼',
      timestamps: {
        start: 86,
        end: 89
      }
    },
    {
      type: 'video',
      description: '16 观众欢呼',
      timestamps: {
        start: 92,
        end: 95
      }
    }
  ]
}
const playingIndex = ref(0) // 初始设置为第一个播放项, TODO 后续需要持久化
const customLayerIndex = ref(3) // 当前播放项所在层级
// 定义计算属性
const displayedPlaylist = computed(() => {
  // 确保播放索引在有效范围内
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  playingIndex.value = Math.min(
    playingIndex.value,
    playlistData.keypoints.length - 1
  )
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  playingIndex.value = Math.max(0, playingIndex.value)

  const totalItems = playlistData.keypoints.length
  const listSize = 7 // 列表固定大小
  let startIndex = playingIndex.value - customLayerIndex.value

  // 调整 startIndex 保证它在合理范围内
  startIndex = Math.max(-customLayerIndex.value, startIndex)

  let displayedItems = playlistData.keypoints.slice(
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
  return playlistData.keypoints[playingIndex.value]
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
    // 长按已经播放过的任意一个列表项, 弹出一个包含所有已播放项的列表
    longPressTimer.value = setTimeout(() => {
      // 弹出一个包含所有已播放项的列表 // TODO
      showPlayedItemsList.value = true // 显示已播放项列表
    }, 500)
  } else if (index === customLayerIndex.value) {
    longPressTimer.value = setTimeout(() => {
      isLongPress.value = true
      e.target.classList.add('draggable')
      // 启用拖拽
      e.target.setAttribute('draggable', true)
      // 注册全局mouseup事件监听器
    }, 100) // 0.x秒后触发
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
const handleClick = (item: PointItem) => {
  playingIndex.value = playlistData.keypoints.findIndex(
    (i) => i.timestamps.start === item.timestamps?.start
  )
}

const showPlayedItemsList = ref(false) // 控制已播放项列表的显示

// 已播放项的计算属性
const playedItems = computed(() =>
  playlistData.keypoints.slice(0, playingIndex.value)
)
const handleClosePlayedItemsList = () => {
  showPlayedItemsList.value = false // 关闭已播放项列表
}
const handleSelectPlayedItem = (selectedItem: PointItem) => {
  // 处理已播放项的选择逻辑，例如更新 playingIndex
  const newIndex = playlistData.keypoints.findIndex(
    (item) => item.timestamps.start === selectedItem.timestamps?.start
  )
  playingIndex.value = newIndex
  showPlayedItemsList.value = false // 选择后关闭弹出窗口
}
</script>
<template>
  <div ref="container" class="keypoint-list">
    <div v-if="showPlayedItemsList" class="temporary-popup">
      <!-- 已播放项列表 -->
      <div class="playedOrfuture-list">
        <PlaylistItem
          v-for="item in playedItems"
          :key="item.timestamps.start"
          :item="item"
          :isPlaying="item === currentPlayingItem"
          @click="handleSelectPlayedItem(item)"
        />
      </div>
      <!-- 当前播放项 -->
      <div class="current-playing-item">
        <PlaylistItem
          :item="currentPlayingItem"
          :isPlaying="true"
          @click="handleClosePlayedItemsList"
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
    rgba(0, 0, 0, 0.7),
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
    overflow: scroll;
    overflow-x: hidden;
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
