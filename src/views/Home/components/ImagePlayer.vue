<script setup lang="ts">
import { ref } from 'vue'

const carouselRef = ref()
const onPrevious = () => {
  carouselRef.value.prev()
}
const onNext = () => {
  carouselRef.value.next()
}
</script>

<template>
  <div class="image-player">
    <el-carousel
      ref="carouselRef"
      :autoplay="false"
      height="800px"
      arrow="never"
      style="margin-bottom: 10px"
    >
      <el-carousel-item v-for="item in 4" :key="item">
        <img
          style="width: 100%; height: 100%"
          src="https://img0.baidu.com/it/u=1583337455,199945245&fm=253&fmt=auto&app=138&f=JPEG?w=891&h=500"
        />
      </el-carousel-item>
    </el-carousel>
    <el-button type="info" @click="onPrevious">Prev</el-button>
    <el-button type="info" @click="onNext">Next</el-button>
  </div>
</template>

<style lang="scss" scoped>
.el-carousel__item h3 {
  display: flex;
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
