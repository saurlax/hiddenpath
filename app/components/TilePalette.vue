<template>
  <div class="p-2 bg-white overflow-auto flex md:flex-col gap-2">
    <div v-for="(items, category) in tilesByCategory" :key="category">
      <div>{{ category }}</div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tile in items"
          :key="tile.id"
          @click="$emit('select', tile)"
          class="w-12 h-12 p-0 border-none"
        >
          <img
            :src="tile.img"
            :alt="tile.name"
            class="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{ tiles: Array<any> }>();

const tilesByCategory = computed(() => {
  const map: Record<string, Array<any>> = {};
  for (const t of props.tiles) {
    (map[t.category] ||= []).push(t);
  }
  return map;
});
</script>
