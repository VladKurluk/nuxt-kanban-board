<template>
  <div
    class="task bg-white dark:bg-gray-600 p-2 rounded shadow-sm max-w-full flex cursor-pointer"
  >
    <DragHandle class="pr-2" />
    <div class="w-full">
      <div class="w-full text-md">
        {{ task.title }}
      </div>
      <div class="text-xs text-gray-500 dark:text-gray-200 py-2">
        Priority: {{ task.priority }}
      </div>
      <div class="flex justify-between items-center">
        <UAvatarGroup size="sm" :max="2">
          <div
            v-for="user in task.responsiblePerson"
            :key="user.id"
          >
            <UTooltip :text="user.name">
              <UAvatar :alt="user.name" />
            </UTooltip>
          </div>
        </UAvatarGroup>
        <UButton
          class="shrink-0"
          icon="i-material-symbols:delete-forever"
          size="2xs"
          color="red"
          square
          variant="solid"
          @click.stop="deleteTask(task.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBoard } from "@/store/board";

import type { Task } from "@/types";

const { deleteTask } = useBoard();

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