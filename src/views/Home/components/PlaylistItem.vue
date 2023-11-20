<template>
  <li
    class="pointItem"
    :class="{ 'drag-over': isDragOver }"
    @drop="handleDrop($event)"
    @dragover="handleDragOver($event)"
    @dragleave="handleDragLeave"
  >
    <div
      :class="{ playing: isPlaying }"
      @click="onClick"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @dragstart="onDragStart"
      @dragend="onDragEnd"
    >
      {{ item?.description }}
    </div>
  </li>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { PointItem } from '@/types/home'

const props = defineProps({
  item: Object as () => PointItem,
  isPlaying: Boolean,
  isDragOver: Boolean
})
const emit = defineEmits([
  'click',
  'mousedown',
  'mouseup',
  'dragstart',
  'dragend',
  'drop',
  'dragover',
  'dragleave'
])

const onClick = () => emit('click')
const onMouseDown = (event: MouseEvent) => emit('mousedown', event)
const onMouseUp = (event: MouseEvent) => emit('mouseup', event)
const onDragStart = (event: DragEvent) => emit('dragstart', event)
const onDragEnd = (event: DragEvent) => emit('dragend', event)
const handleDrop = (event: DragEvent) => emit('drop', event)
const handleDragOver = (event: DragEvent) => emit('dragover', event)
const handleDragLeave = (event: DragEvent) => emit('dragleave', event)
</script>

<style scoped>
.drag-over {
  background-color: rgba(224, 247, 250, 0.5); /* 您可以选择任意颜色 */
}
.draggable {
  cursor: move; /* 改变光标样式为移动的图标 */
  background-color: rgba(224, 247, 250, 1) !important; /* 轻微的背景色 */
  transition: all 0.4s ease-in-out;
}
.playing {
  transition: all 0.4s ease-in-out;
  background-color: rgba(224, 247, 250, 0.5); /* 浅蓝色背景 */
  font-weight: bold; /* 字体加粗 */
  color: #0d47a1; /* 深蓝色字体 */
  height: 100%;
  font-size: 24px;

  line-height: 58px;
}
.pointItem {
  user-select: none;
  width: 100%;
  height: 58.18px;
  text-indent: 40px;
  cursor: pointer;
  color: #eeeded;
  font-size: 20px;
  line-height: 66px;
  transition: all 0.3s ease;
}
</style>
