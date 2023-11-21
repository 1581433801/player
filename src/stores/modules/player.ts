// import { defineStore } from 'pinia'
import { ref } from 'vue'

// export const usePlayerStore = defineStore(
//   'player-store',
//   () => {
//     const playingIndex = ref(0)
//     const updatePlayingIndex = (index: number) => {
//       playingIndex.value = index
//     }
//     return { playingIndex, updatePlayingIndex }
//   },
//   {
//     persist: true
//   }
// )
import { defineStore } from 'pinia'

export const usePlayerStore = defineStore(
  'player-store',
  () => {
    // 使用 ref 和 reactive 定义状态
    const playingIndex = ref(0)
    const customLayerIndex = ref(3)
    const lastPlayedTime = ref(0) // 新增状态
    const playlistData = ref([]) // 假设这是播放列表数据

    // 定义操作方法
    const updatePlayingIndex = (index: number) => {
      playingIndex.value = index
    }

    const updateCustomLayerIndex = (index: number) => {
      customLayerIndex.value = index
    }
    const updateLastPlayedTime = (time: number) => {
      lastPlayedTime.value = time // 更新最后播放的时间
    }
    // 返回状态和方法
    return {
      playingIndex,
      customLayerIndex,
      playlistData,
      lastPlayedTime,
      updatePlayingIndex,
      updateCustomLayerIndex,
      updateLastPlayedTime
    }
  },
  {
    persist: true
  }
)
