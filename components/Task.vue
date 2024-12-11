<template>
  <div
    class="task bg-white dark:bg-gray-600 p-2 rounded shadow-sm max-w-full flex cursor-pointer"
  >
    <DragHandle class="pr-2" />
    <div>
      <div class="w-full text-md">
        {{ task.title }}
      </div>
      <div class="text-xs text-gray-500">
        Priority: {{ task.priority }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Task } from "@/types";

defineProps<{
  task: Task
}>();
</script>

<style scoped>
.sortable-drag .task {
  transform: rotate(5deg);
}
.sortable-ghost .task {
  position: relative;
}
.sortable-ghost .task::after {
  content: "";
  @apply absolute top-0 bottom-0 left-0 right-0 bg-slate-300 rounded;
}

.task:focus,
.task:focus-visible {
  @apply outline-gray-400 !important;
  outline: gray auto 1px !important;
}
</style>