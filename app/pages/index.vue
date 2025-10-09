<template>
  <div class="w-screen h-screen flex max-md:flex-col">
    <TilePalette class="md:flex-basis-26" :tiles="tiles" @select="selectTile" />
    <MapCanvas
      class="flex-1"
      :cols="x"
      :rows="y"
      :grid="gridCells"
      :cellSize="40"
      @cell-click="onCellClick"
    />
    <ChatBox class="flex-basis-1/4" :messages="messages" @send="ask" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TilePalette from "../../components/TilePalette.vue";
import ChatBox from "../../components/ChatBox.vue";
import MapCanvas from "../../components/MapCanvas.vue";
import { useAI } from "../../composables/useAI";

const { messages, ask } = useAI();

const tiles = ref([
  {
    id: "floor-1",
    category: "地板",
    name: "青砖地",
    img: "https://placehold.co/256x256/8B7355/FFF",
  },
  {
    id: "floor-2",
    category: "地板",
    name: "石板路",
    img: "https://placehold.co/256x256/A9A9A9/FFF",
  },
  {
    id: "decor-1",
    category: "装饰",
    name: "石灯",
    img: "https://placehold.co/256x256/FFD700/000",
  },
  {
    id: "decor-2",
    category: "装饰",
    name: "假山",
    img: "https://placehold.co/256x256/696969/FFF",
  },
  {
    id: "wall-1",
    category: "墙壁",
    name: "白墙",
    img: "https://placehold.co/256x256/F5F5DC/000",
  },
  {
    id: "water-1",
    category: "水体",
    name: "荷花池",
    img: "https://placehold.co/256x256/4682B4/FFF",
  },
]);

const x = 32;
const y = 24;
const gridCells = ref(Array(x * y).fill(null));
const selectedTile = ref(null as any);

function selectTile(tile: any) {
  selectedTile.value = tile;
}

function onCellClick(idx: number) {
  if (selectedTile.value) gridCells.value[idx] = selectedTile.value;
  else gridCells.value[idx] = null;
}
</script>
