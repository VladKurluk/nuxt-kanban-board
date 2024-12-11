<script setup lang="ts">
import { NewTask } from "#components";
import { storeToRefs } from "pinia";
import { nanoid } from "nanoid";
import { useBoard } from "@/store/board";

import type { Column, Task } from "@/types";

const { columns } = storeToRefs(useBoard());
const { initialize } = useBoard();
const modal = useModal();

await initialize();

const handleTaskChange = (
  event: { added?: { element: Task }; removed?: { element: Task } },
  column: Column
): void => {
  if (event.added) {
    // If the task was added to a column, update its status
    event.added.element.status = column.title;
  }
};

function openModal(status: string, task?: Task) {
  const propsPayload = {
    status: status,
    taskData: task,
    isEdit: false,
  };

  if (task?.id) {
    propsPayload.isEdit = true;
  }

  modal.open(NewTask, propsPayload);
};

const createTaskHandler = (status: string) => {
  openModal(status);
};

const editTaskHandler = (status: string, task?: Task) => {
  openModal(status, task);
};

const createColumn = (): void => {
  const column: Column = {
    id: nanoid(),
    title: "",
    tasks: [],
  };
  columns.value.push(column);
  nextTick(() => {
    (
      document.querySelector(
        ".column:last-of-type .title-input"
      ) as HTMLInputElement
    ).focus();
  });
}
</script>

<template>
  <div class="flex items-start overflow-x-auto gap-4 p-2.5">
    <draggable
      v-model="columns"
      group="columns"
      :animation="100"
      handle=".drag-handle"
      item-key="id"
      class="flex gap-4 items-start"
    >
      <template #item="{ element: column }: { element: Column }">
        <UCard
          class="column min-w-[300px] max-w-[300px] bg-gray-200"
          :ui="{
            divide: 'divide-y divide-white',
            body: {
              padding: 'px-4 py-2 sm:p-2 sm:px-6',
            }
          }"
        >
          <template #header>
            <header class="font-bold flex items-center">
              <DragHandle />
              <input
                class="title-input bg-transparent focus:bg-white dark:focus:bg-gray-600 rounded px-1 w-full"
                @keyup.enter="($event.target as HTMLInputElement).blur()"
                @keydown.backspace="
                  column.title === ''
                    ? (columns = columns.filter((c) => c.id !== column.id))
                    : null
                "
                type="text"
                v-model="column.title"
              />
            </header>
          </template>

          <draggable
            v-model="column.tasks"
            :group="{ name: 'tasks' }"
            :animation="150"
            item-key="id"
            @change="handleTaskChange($event, column)"
          >
            <template #item="{ element: task }: { element: Task }">
              <div class="mb-2 last-of-type:mb-0">
                <Task
                  :task="task"
                  @click="editTaskHandler(column.title, task)"
                />
              </div>
            </template>
          </draggable>

          <template #footer>
            <footer>
              <UButton
                size="sm"
                icon="i-material-symbols:add"
                @click="createTaskHandler(column.title)"
              >
                Add a card
              </UButton>
            </footer>
          </template>
        </UCard>
      </template>
    </draggable>
    <UButton @click="createColumn">
      + Add Column
    </UButton>
    <UModals />
  </div>
</template>