<template>
  <div class="p-2 bg-white flex flex-col">
    <div class="flex-1 overflow-auto mb-2">
      <div v-for="(m, i) in messages" :key="i" class="mb-2">
        <div :class="m.role === 'user' ? 'text-right' : 'text-left'">
          <div class="inline-block p-2 rounded-lg bg-gray-100">
            {{ m.content }}
          </div>
        </div>
      </div>
    </div>
    <div class="flex gap-2">
      <input
        v-model="local"
        @keyup.enter="onSend"
        placeholder="输入设计需求(按回车发送)"
        class="flex-1 p-2 border rounded"
      />
      <button @click="onSend" class="px-3 py-2 bg-blue-600 text-white rounded">
        发送
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{
  messages: Array<{ role: string; content: string }>;
}>();
const emit = defineEmits(["send"]);
const local = ref("");

function onSend() {
  if (!local.value.trim()) return;
  emit("send", local.value.trim());
  local.value = "";
}
</script>

<style scoped></style>
