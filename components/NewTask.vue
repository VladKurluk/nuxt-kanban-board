<template>
  <UModal>
    <UCard>
      <div class="flex justify-end">
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="modal.close()"
        />
      </div>
      <UForm
        :schema="schema"
        :state="task"
        class="space-y-4"
        :validateOn="['submit', 'blur']"
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

        <div class="flex justify-between gap-2.5">
          <div class="w-1/2">
            <UFormGroup label="Responsible Person" name="responsiblePerson">
              <USelectMenu
                v-model="task.responsiblePerson"
                :options="users"
                multiple
                placeholder="Select responsible person"
                color="primary"
                variant="outline"
                option-attribute="name"
                by="name"
              />
            </UFormGroup>
          </div>
          <div class="w-1/2">
            <UFormGroup label="Contractor" name="contractor">
              <USelectMenu
                v-model="task.contractor"
                :options="users"
                placeholder="Select contractor"
                color="primary"
                variant="outline"
                option-attribute="name"
                by="name"
              />
            </UFormGroup>
          </div>
        </div>

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
import { object, string, array, type InferType } from "yup";
import { nanoid } from "nanoid";
import { storeToRefs } from "pinia";
import { useBoard } from "@/store/board";
import { useUsers } from "@/store/users";

import type { Task, User } from "@/types";
import type { FormSubmitEvent } from "#ui/types";

const { createTask, updateTask, deleteTask } = useBoard();
const { users } = storeToRefs(useUsers());
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
      responsiblePerson: [],
      contractor: {},
      status: props.status,
      priority: ""
    }
);

const schema = object({
  title: string().min(5, 'Must be at least 5 characters').required('Required'),
  description: string().required('Required'),
  responsiblePerson: array()
    .min(1, 'The Responsible Person must not be empty')
    .required('Required'),
  contractor: object().test(
    'non-empty-object',
    'Contractor is required',
    (value) => Object.keys(value).length > 0
  ),
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