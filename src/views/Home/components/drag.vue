<script setup lang="ts">
import { ref } from 'vue'

const list = ref([
  { name: 'one', id: 0 },
  { name: 'two', id: 1 },
  { name: 'three', id: 2 }
])

const draggingIndex = ref(-1)
const overIndex = ref(-1)

const checkMove = (evt: { relatedContext: { index: number } }) => {
  overIndex.value = evt.relatedContext.index
  return false
}

const dragStart = (evt: { oldIndex: number }) => {
  draggingIndex.value = evt.oldIndex
}

const dragEnd = () => {
  draggingIndex.value = -1
  overIndex.value = -1
}

const isHighlighted = (index: number) => {
  return draggingIndex.value !== -1 && index === overIndex.value
}
</script>

<template>
  <draggable
    :list="list"
    :move="checkMove"
    item-key="id"
    class="list-group"
    ghost-class="ghost"
    @start="dragStart"
    @end="dragEnd"
  >
    <template #item="{ element, index }">
      <div :class="{ highlighted: isHighlighted(index) }">
        {{ element.name }}
      </div>
    </template>
  </draggable>
</template>

<style lang="scss" scoped>
.list-group div {
  padding: 10px;
  margin: 5px;
  border: 1px solid #ddd;
}

.highlighted {
  background-color: blue;
  color: white;
}
</style>
