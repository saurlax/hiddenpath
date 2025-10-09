<style scoped>
.tile-cell {
  box-sizing: border-box;
  border: 1px solid rgba(0, 0, 0, 0.04);
  width: 100%;
  height: 100%;
}
.tile-cell img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div
    ref="viewport"
    class="bg-gray-100 relative overflow-hidden cursor-grab"
    @pointerdown="startDrag"
    @wheel.prevent="onWheel"
  >
    <div
      ref="mapEl"
      class="absolute *:block *:w-full *:h-full *:object-cover *:b *:bg-gray-200"
      :style="mapStyle"
    >
      <img
        v-for="(cell, idx) in grid"
        :key="idx"
        @click.stop="cellClick(idx)"
        :src="cell?.img"
        @dragstart.prevent
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
const props = defineProps<{
  cols: number;
  rows: number;
  grid: Array<any>;
  cellSize?: number;
}>();
const emit = defineEmits(["cell-click"]);
const viewport = ref<HTMLElement | null>(null);
const mapEl = ref<HTMLElement | null>(null);

const offset = ref({ x: 0, y: 0 });
const dragging = ref(false);
const last = ref({ x: 0, y: 0 });
const cellSize = computed(() => props.cellSize ?? 48);
const scale = ref(1);
const minScale = 0.5;
const maxScale = 2;

// track active pointers for pinch zoom
const activePointers = new Map<number, PointerEvent>();

const mapStyle = computed(() => ({
  transform: `translate(${offset.value.x}px, ${offset.value.y}px) scale(${scale.value})`,
  transformOrigin: "0 0",
  display: "grid",
  gridTemplateColumns: `repeat(${props.cols}, ${cellSize.value}px)`,
  gridTemplateRows: `repeat(${props.rows}, ${cellSize.value}px)`,
  width: `${props.cols * cellSize.value}px`,
  height: `${props.rows * cellSize.value}px`,
}));

function clampOffset() {
  // viewport size
  const vp = viewport.value?.getBoundingClientRect();
  if (!vp) return;
  const mapW = props.cols * cellSize.value * scale.value;
  const mapH = props.rows * cellSize.value * scale.value;

  // calculate min/max offsets so map covers viewport
  const minX = Math.min(0, vp.width - mapW);
  const maxX = 0;
  const minY = Math.min(0, vp.height - mapH);
  const maxY = 0;

  if (mapW <= vp.width) {
    // center horizontally
    offset.value.x = (vp.width - mapW) / 2;
  } else {
    offset.value.x = Math.min(Math.max(offset.value.x, minX), maxX);
  }

  if (mapH <= vp.height) {
    offset.value.y = (vp.height - mapH) / 2;
  } else {
    offset.value.y = Math.min(Math.max(offset.value.y, minY), maxY);
  }
}

function startDrag(e: PointerEvent) {
  e.preventDefault();
  const el = viewport.value;
  if (el) {
    el.setPointerCapture(e.pointerId);
    el.classList && el.classList.replace("cursor-grab", "cursor-grabbing");
  }

  activePointers.set(e.pointerId, e);

  if (activePointers.size === 1) {
    // single pointer drag
    dragging.value = true;
    last.value = { x: e.clientX, y: e.clientY };
    window.addEventListener("pointermove", onDrag);
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
  } else if (activePointers.size === 2) {
    // two pointers - prepare for pinch
    dragging.value = false;
  }
}

function onDrag(e: PointerEvent) {
  activePointers.set(e.pointerId, e);

  if (activePointers.size === 2) {
    // pinch zoom
    const pointers = Array.from(activePointers.values());
    const a = pointers[0]!;
    const b = pointers[1]!;
    const dx = a.clientX - b.clientX;
    const dy = a.clientY - b.clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (last.value.x > 0) {
      const prevDist = last.value.x;
      const delta = dist - prevDist;
      const factor = 1 + delta / 200;
      const newScale = Math.min(
        maxScale,
        Math.max(minScale, scale.value * factor)
      );
      const mx = (a.clientX + b.clientX) / 2;
      const my = (a.clientY + b.clientY) / 2;
      zoomAt(newScale, mx, my);
    }
    last.value = { x: dist, y: 0 };
    return;
  }

  if (!dragging.value) return;
  const dx = e.clientX - last.value.x;
  const dy = e.clientY - last.value.y;
  offset.value.x += dx;
  offset.value.y += dy;
  last.value = { x: e.clientX, y: e.clientY };
  clampOffset();
}

function endDrag(e: PointerEvent) {
  activePointers.delete(e.pointerId);

  if (activePointers.size === 0) {
    dragging.value = false;
    window.removeEventListener("pointermove", onDrag);
    window.removeEventListener("pointerup", endDrag);
    window.removeEventListener("pointercancel", endDrag);
    const el = viewport.value;
    if (el) {
      el.releasePointerCapture(e.pointerId);
      el.classList && el.classList.replace("cursor-grabbing", "cursor-grab");
    }
    clampOffset();
    last.value = { x: 0, y: 0 };
  } else if (activePointers.size === 1) {
    // back to single pointer drag
    const remaining = Array.from(activePointers.values())[0]!;
    dragging.value = true;
    last.value = { x: remaining.clientX, y: remaining.clientY };
  }
}

function onWheel(e: WheelEvent) {
  const delta = -e.deltaY;
  const factor = 1 + delta / 1000;
  const newScale = Math.min(maxScale, Math.max(minScale, scale.value * factor));
  zoomAt(newScale, e.clientX, e.clientY);
}

function zoomAt(newScale: number, clientX: number, clientY: number) {
  // compute map point under pointer
  const vp = viewport.value?.getBoundingClientRect();
  if (!vp) return;
  const px = (clientX - vp.left - offset.value.x) / scale.value;
  const py = (clientY - vp.top - offset.value.y) / scale.value;
  // update scale
  scale.value = newScale;
  // update offset so that px,py stays under pointer
  offset.value.x = clientX - vp.left - px * scale.value;
  offset.value.y = clientY - vp.top - py * scale.value;
  clampOffset();
}

function cellClick(idx: number) {
  emit("cell-click", idx);
}

onMounted(() => {
  // initial clamp and ensure viewport is available
  clampOffset();
  window.addEventListener("resize", clampOffset);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", clampOffset);
  // ensure any global listeners are removed
  window.removeEventListener("pointermove", onDrag);
  window.removeEventListener("pointerup", endDrag);
  window.removeEventListener("pointercancel", endDrag);
});
</script>
