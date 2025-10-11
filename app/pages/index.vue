<script setup lang="ts">
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
const imgs = ref<string[][]>(
  Array.from({ length: y }, () => Array(x).fill(""))
);
const selectedTile = ref<string | null>(null);

function selectTile(tile: any) {
  selectedTile.value = tile.img;
}

function click({ row, col }: { row: number; col: number }) {
  if (selectedTile.value) {
    imgs.value[row][col] = selectedTile.value;
  } else {
    imgs.value[row][col] = "";
  }
}
</script>

<template>
  <div class="w-screen h-screen flex max-md:flex-col">
    <TilePalette class="md:flex-basis-26" :tiles="tiles" @select="selectTile" />
    <MapCanvas class="flex-1" :imgs="imgs" @click="click" />
    <ChatBox class="flex-basis-1/4" :messages="messages" @send="ask" />
  </div>
</template>
