<script setup lang="ts">
import { useAI } from "../composables/useAI";
const { messages, ask } = useAI();

const tiles = ref([
  { id: "", category: "清除", name: "清除" },
  // 地板类
  { id: "floor_000", category: "地板", name: "石砖" },
  { id: "floor_001", category: "地板", name: "四分石砖" },
  { id: "floor_002", category: "地板", name: "龙雕纹石砖" },
  { id: "floor_003", category: "地板", name: "二分石砖" },
  { id: "floor_004", category: "地板", name: "荷花雕纹石砖" },
  { id: "floor_005", category: "地板", name: "六边形石砖" },
  { id: "grass", category: "地板", name: "草丛" },
  // 墙壁类
  { id: "wall_000", category: "墙壁", name: "石墙左边沿" },
  { id: "wall_001", category: "墙壁", name: "石墙右边沿" },
  { id: "wall_002", category: "墙壁", name: "石墙" },
  { id: "wall_003", category: "墙壁", name: "带窗石墙" },
  { id: "door", category: "墙壁", name: "门" },
  // 装饰类
  { id: "deco_000", category: "装饰", name: "石狮子" },
  { id: "deco_001", category: "装饰", name: "石碑" },
  { id: "deco_002", category: "装饰", name: "花盆1" },
  { id: "deco_003", category: "装饰", name: "花盆2" },
  { id: "deco_004", category: "装饰", name: "花盆3" },
  { id: "deco_005", category: "装饰", name: "花盆4" },
  { id: "deco_006", category: "装饰", name: "花盆5" },
  { id: "rock", category: "装饰", name: "岩石" },
  // 建筑类
  { id: "house_000", category: "建筑", name: "房屋1" },
  { id: "house_001", category: "建筑", name: "房屋2" },
  // 植物类
  { id: "tree_000", category: "植物", name: "柳树" },
  { id: "tree_001", category: "植物", name: "樱花树" },
  { id: "tree_002", category: "植物", name: "竹林" },
  { id: "tree_003", category: "植物", name: "银杏树" },
  // 水体类
  { id: "pond_000", category: "水体", name: "池塘1" },
  { id: "pond_001", category: "水体", name: "池塘2" },
  // 光源类
  { id: "light_000", category: "光源", name: "灯笼1" },
  { id: "light_001", category: "光源", name: "灯笼2" },
  // 家具类
  { id: "stool_000", category: "家具", name: "凳子1" },
  { id: "stool_002", category: "家具", name: "凳子2" },
]);

const x = 32;
const y = 24;
const map = ref<string[][]>(
  Array.from({ length: y }, () => Array(x).fill(""))
);
const selectedTile = ref<string | null>(null);

function selectTile(tile: any) {
  selectedTile.value = tile.id;
}

function click({ row, col }: { row: number; col: number }) {
  if (map.value[row] && col >= 0 && col < map.value[row].length) {
    if (selectedTile.value) {
      map.value[row][col] = selectedTile.value;
    } else {
      map.value[row][col] = "";
    }
  }
}

async function onSend(msg: string) {
  const change = await ask(msg, map.value);
  if (change) {
    Object.entries(change).forEach(([key, id]) => {
      const [rowStr, colStr] = key.split(".");
      const row = Number(rowStr);
      const col = Number(colStr);
      if (
        Number.isInteger(row) &&
        Number.isInteger(col) &&
        row >= 0 &&
        row < y &&
        col >= 0 &&
        col < x &&
        map.value[row]
      ) {
        map.value[row][col] = id;
      }
    });
  }
}

onMounted(() => {
  messages.value.push({
    role: "user",
    content: "可用材料列表：" + JSON.stringify(tiles.value),
    hidden: true,
  });
});
</script>

<template>
  <div class="w-screen h-100dvh flex max-md:flex-col">
    <TilePalette class="md:flex-basis-30" :tiles="tiles" @select="selectTile" />
    <MapCanvas class="flex-1" :map="map" @click="click" />
    <ChatBox class="flex-basis-1/4" :messages="messages" @send="onSend" />
  </div>
</template>
