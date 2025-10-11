<script setup lang="ts">
defineProps<{
  map: string[][];
}>();
const emit = defineEmits(["click"]);
</script>

<template>
  <div class="overflow-auto select-none w-screen h-screen">
    <div class="inline-block bg-[url('/assets/floor_000.png')]">
      <div v-for="(row, rowIdx) in map" :key="rowIdx" class="flex">
        <div
          v-for="(cell, colIdx) in row"
          :key="colIdx"
          class="relative flex-shrink-0 cursor-pointer w-100px h-100px flex items-end justify-center"
          @click="emit('click', { row: rowIdx, col: colIdx })"
        >
          <img v-if="cell" :src="`/assets/${cell}.png`" />
        </div>
      </div>
    </div>
  </div>
</template>
