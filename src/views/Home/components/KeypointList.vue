<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import type { PointItem } from '@/types/home'

const props = defineProps<{
  highlightKeypoint: number | null // 当前需要高亮的看点下标
  pointList: PointItem[] // 传入需要渲染的列表
}>()
// 更新当前看点类型(视频 or 图片)的事件
const emit = defineEmits<{
  (event: 'updateCurrType', payload: PointItem & { index: number }): void
}>()
// 点击响应看点时触发上述事件
const onClickPoint = (point: PointItem & { index: number }) => {
  // 当用户点击看点时，触发自定义事件，并将需要的类型作为payload传递给父组件
  emit('updateCurrType', point)
}
const container = ref<HTMLDivElement>()
const ul = ref<HTMLUListElement>()
// 容器高度
let containerHeight: any
// 每个 li 的高度
let liHeight: any
// 最大偏移量
let maxOffset: any

onMounted(() => {
  containerHeight = container.value!.clientHeight
  liHeight = ul.value!.children[0].clientHeight
  maxOffset = ul.value!.clientHeight - containerHeight
})
// 判断是否是首次
const isInit = ref(true)
watch(
  computed(() => props.highlightKeypoint),
  () => {
    console.log('检测到当前看点变化')
    if (props.highlightKeypoint === -1 && isInit.value) {
      let offsetValue =
        props.highlightKeypoint * liHeight + liHeight / 2 - containerHeight / 2
      ul.value.style.transform = `translateY(${-offsetValue}px)`

      isInit.value = false
    } else {
      if (props.highlightKeypoint === -1) return
      let offsetValue =
        props.highlightKeypoint * liHeight + liHeight / 2 - containerHeight / 2
      ul.value.style.transform = `translateY(${-offsetValue}px)`
    }
  }
)
</script>
<template>
  <div ref="container" class="keypoint-list">
    <!-- <i @click="toggleCollapse" class="toggleButton iconfont icon-zhedie2"></i> -->
    <!-- TODO: 未来需要封装一个列表项组件 -->
    <ul
      ref="ul"
      style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      "
    >
      <li
        class="pointItem"
        v-for="(item, index) in pointList"
        :key="item.timestamps?.start"
        @click="onClickPoint({ ...item, index: index })"
        :class="{ 'pointItem-highlight': index === props.highlightKeypoint }"
      >
        {{ item.description }}
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.keypoint-list {
  position: absolute;
  width: 280px;
  height: 80%;
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
