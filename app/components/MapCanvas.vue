<script setup lang="ts">
defineProps<{
  map: string[][];
}>();
const emit = defineEmits(["click"]);
</script>

<template>
  <div class="bg-gray-1 overflow-auto select-none w-screen h-screen">
    <div>
      <div v-for="(row, rowIdx) in map" :key="rowIdx" class="flex">
        <div
          v-for="(cell, colIdx) in row"
          :key="colIdx"
          class="relative flex-shrink-0 cursor-pointer w-100px h-100px flex items-end justify-center border border-gray-300 border-dashed box-border"
          @click="emit('click', { row: rowIdx, col: colIdx })"
        >
          <img v-if="cell" :src="`/assets/${cell}.png`" />
        </div>
      </div>
    </div>
  </div>
</template>
