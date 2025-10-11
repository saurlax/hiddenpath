<script setup lang="ts">
defineProps<{
  imgs: (string | null)[][];
}>();
const emit = defineEmits(["click"]);
</script>

<template>
  <div class="bg-gray-100 overflow-auto select-none w-screen h-screen">
    <div>
      <div v-for="(row, rowIdx) in imgs" :key="rowIdx" class="flex">
        <div
          v-for="(cell, colIdx) in row"
          :key="colIdx"
          class="flex-shrink-0 cursor-pointer w-10 h-10"
          @click="emit('click', { row: rowIdx, col: colIdx })"
        >
          <img
            v-if="cell"
            :src="cell"
            class="block w-full h-full object-cover pointer-events-none"
          />
        </div>
      </div>
    </div>
  </div>
</template>
