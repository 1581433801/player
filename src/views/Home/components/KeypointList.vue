<script setup lang="ts">
import { ref } from 'vue'
import type { PointItem } from '@/types/home'

defineProps<{
  pointList: PointItem[]
}>()
const emit = defineEmits<{
  (event: 'updateCurrType', payload: string): void
}>()
const isCollapsed = ref(true) // 控制折叠状态的变量

function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value // 切换折叠状态
}
const onClickPoint = (type: string) => {
  // 当用户点击看点时，触发自定义事件，并将需要的类型作为payload传递给父组件
  emit('updateCurrType', type)
}
</script>
<template>
  <div v-if="isCollapsed" class="keypoint-list">
    <i @click="toggleCollapse" class="toggleButton iconfont icon-zhedie2"></i>
    <!-- TODO: 未来需要封装一个列表项组件 -->
    <ul
      style="
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      "
    >
      <li
        class="pointItem"
        v-for="item in pointList"
        :key="item.timestamps?.start"
        @click="onClickPoint(item.type)"
      >
        {{ item.description }}
      </li>
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
  height: 66px;
  text-align: center;
  cursor: pointer;
  color: #d1d1d1;
  font-size: 20px;
  line-height: 66px;
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.4);
    font-size: 24px;
    color: #fff;
  }
}
</style>
