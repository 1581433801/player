<script setup lang="ts">
import { computed, ref } from 'vue'
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
const playingIndex = ref(9) // 初始设置为第一个播放项
const customLayerIndex = ref(3) // 默认为居中位置，即第四层
// 定义计算属性
const displayedPlaylist = computed(() => {
  const totalItems = playlistData.keypoints.length
  const listSize = 7 // 列表固定大小
  let startIndex = playingIndex.value - customLayerIndex.value

  // 允许列表的上方出现空位
  startIndex = Math.max(-customLayerIndex.value, startIndex)
  startIndex = Math.min(startIndex, totalItems - listSize)

  // 如果startIndex为负，说明需要在列表上方留空
  if (startIndex < 0) {
    // 使用空对象来填充空位
    const emptyItems = Array(-startIndex).fill({})
    // 从playlistData中获取实际项并与空项合并
    return [
      ...emptyItems,
      ...playlistData.keypoints.slice(0, listSize + startIndex)
    ]
  }

  return playlistData.keypoints.slice(startIndex, startIndex + listSize)
})
const currentPlayingItem = computed(() => {
  return playlistData.keypoints[playingIndex.value]
})
const handleDragStart = (e) => {
  e.dataTransfer.setData('text/plain', customLayerIndex.value.toString())
}

const handleDrop = (e, newIndex) => {
  e.preventDefault()
  const oldIndex = parseInt(e.dataTransfer.getData('text/plain'))
  if (oldIndex === customLayerIndex.value) {
    customLayerIndex.value = newIndex
  }
}
const draggingOverIndex = ref(-1) // 新增状态，-1表示没有拖拽
const handleDragOver = (e, index) => {
  e.preventDefault()
  draggingOverIndex.value = index // 设置当前拖拽经过的索引
}

const handleDragLeave = () => {
  draggingOverIndex.value = -1 // 重置拖拽索引
}
</script>
<template>
  <div ref="container" class="keypoint-list">
    <ul>
      <li
        v-for="(item, index) in displayedPlaylist"
        :key="index"
        class="pointItem"
        :class="{ 'drag-over': draggingOverIndex === index }"
        @dragover="handleDragOver($event, index)"
        @dragleave="handleDragLeave"
        @drop="handleDrop($event, index)"
      >
        <div
          :draggable="item === currentPlayingItem"
          @dragstart="handleDragStart($event, index)"
          :class="{
            playing: item === currentPlayingItem,
            draggable: item === currentPlayingItem
          }"
        >
          {{ item.description }}
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.drag-over {
  background-color: #e0f7fa; /* 您可以选择任意颜色 */
}
.draggable {
  cursor: move; /* 改变光标样式为移动的图标 */
  border: 1px dashed #aaa; /* 虚线边框 */
  background-color: #f9f9f9; /* 轻微的背景色 */
}
.playing {
  background-color: #e0f7fa; /* 浅蓝色背景 */
  font-weight: bold; /* 字体加粗 */
  color: #0d47a1; /* 深蓝色字体 */
  margin: 2px 0; /* 添加一些外边距 */
}
.keypoint-list {
  position: absolute;
  width: 280px;
  top: 80px;
  right: 0;
  z-index: 100;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.3); /* 半透明背景 */
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
.pointItem {
  width: 100%;
  height: 58.18px;
  text-align: center;
  cursor: pointer;
  color: #d1d1d1;
  font-size: 20px;
  line-height: 66px;
  transition: all 0.3s ease;
  &-highlight {
    background-color: rgba(0, 0, 0, 0.4);
    font-size: 24px;
    color: orange;
  }
}
</style>
