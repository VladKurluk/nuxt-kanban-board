<template>
  <UModal>
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800' 
      }"
    >
      <template #header>
        <UInput
          color="primary"
          variant="outline"
          placeholder="Title"
          v-model="task.title"
        />
      </template>

      <div>
        <UTextarea
          color="primary"
          variant="outline"
          placeholder="Description"
          v-model="task.description"
        />
        <div class="flex justify-between py-2.5 gap-2.5">
          <div class="w-1/2">
            <p class="mb-2">Status:</p>
            <USelect
              color="primary"
              variant="outline"
              :options="['TODO', 'In progress', 'Done']"
              v-model="task.status" 
            />
          </div>
          <div class="w-1/2">
            <p class="mb-2">Priority:</p>
            <USelect
              color="primary"
              variant="outline"
              :options="['Low', 'Medium', 'High']"
              v-model="task.priority"
            />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <UButton
            v-if="isEdit"
            size="sm"
            class="mr-2.5"
            color="red"
            icon="i-material-symbols:delete-forever"
            @click="() => (deleteTask(task.id), modal.close())"
          >
            Delete task
          </UButton>
          <UButton
            size="sm"
            :icon="isEdit ? 'i-material-symbols:save' : 'i-material-symbols:add'"
            @click="handleClick"
          >
            {{isEdit ? 'Update': 'Create'}} card
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { nanoid } from "nanoid";
import { useBoard } from "@/store/board";

import type { Task } from "@/types";

const { createTask, updateTask, deleteTask } = useBoard();
const modal = useModal();

const props = defineProps<{
  status: string,
  taskData?: Task,
  isEdit: boolean
}>();

const task = ref<Task>(
  props.taskData 
    ? { ...props.taskData } 
    : {
      id: nanoid(),
      title: "",
      description: "",
      status: props.status,
      priority: ""
    } as Task
);

const handleClick = () => {
  if (props.isEdit) {
    updateTask(task.value);
  } else {
    createTask(task.value);
  }

  modal.close();
}
</script>

<style scoped>

</style>