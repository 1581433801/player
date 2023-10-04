<script setup lang="ts">
import { ref } from 'vue'
import type { PointItem } from '@/types/home'

defineProps<{
  pointList: PointItem[]
}>()
const isCollapsed = ref(false) // 控制折叠状态的变量

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value // 切换折叠状态
}
</script>
<template>
  <div v-if="isCollapsed" class="keypoint-list">
    <i @click="toggleCollapse" class="toggleButton iconfont icon-zhedie2"></i>
    <!-- TODO: 封装一个列表项组件 -->
    <ul>
      <li v-for="item in pointList" :key="item.startTime">{{ item.name }}</li>
    </ul>
  </div>
  <i v-else @click="toggleCollapse" class="showList iconfont icon-zhedie1"></i>
</template>

<style scoped>
.keypoint-list {
  position: absolute;
  width: 280px;
  height: 100%;
  top: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.7); /* 半透明背景 */
  .toggleButton {
    cursor: pointer;
    margin-left: 10px;
    padding: 10px;
    border-radius: 20px;
    background-color: rgba(225, 211, 211, 0.1);
    font-size: 25px;
    color: #ffffff;
    position: absolute;
    top: 50%;
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
