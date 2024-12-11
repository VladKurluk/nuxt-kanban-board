<template>
  <UModal>
    <UCard>
      <UForm
        :schema="schema"
        :state="task"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="Title" name="title">
          <UInput
            color="primary"
            variant="outline"
            placeholder="Title"
            v-model="task.title"
          />
        </UFormGroup>

        <UFormGroup label="Description" name="description">
          <UTextarea
            color="primary"
            variant="outline"
            placeholder="Description"
            v-model="task.description"
          />
        </UFormGroup>

        <div class="flex justify-between py-2.5 gap-2.5">
          <div class="w-1/2">
            <UFormGroup label="Status:" name="status">
              <USelect
                color="primary"
                variant="outline"
                :options="['TODO', 'In progress', 'Done']"
                v-model="task.status" 
              />
            </UFormGroup>   
          </div>
          <div class="w-1/2">
            <UFormGroup label="Priority:" name="priority">
              <USelect
                color="primary"
                variant="outline"
                :options="['Low', 'Medium', 'High']"
                v-model="task.priority"
              />
            </UFormGroup>            
          </div>
        </div>

        <div class="flex justify-end">
          <UButton
            v-if="isEdit"
            type="button"
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
            type="submit"
            :icon="isEdit ? 'i-material-symbols:save' : 'i-material-symbols:add'"
          >
            {{isEdit ? 'Update': 'Create'}} card
          </UButton>
        </div>
      </UForm>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { object, string, type InferType } from "yup";
import { nanoid } from "nanoid";
import { useBoard } from "@/store/board";

import type { Task } from "@/types";
import type { FormSubmitEvent } from "#ui/types";

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

const schema = object({
  title: string().min(5, 'Must be at least 5 characters').required('Required'),
  description: string().required('Required'),
  status: string().required('Required'),
  priority: string().required('Required'),
});

type Schema = InferType<typeof schema>

function onSubmit(event: FormSubmitEvent<Schema>) {
  if (props.isEdit) {
    updateTask(event.data as Task);
  } else {
    createTask(event.data as Task);
  }

  modal.close();
}
</script>

<style scoped>

</style>