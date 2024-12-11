import { defineStore } from "pinia";
import type { Column, Task } from "@/types";

export const useBoard = defineStore("board", () => {
  const columns = ref<Column[]>([]);
  const initialized = ref(false);

  async function initialize() {
    if (initialized.value) return;
    initialized.value = true;

    const { data: boardData } = await useFetch<Column[]>(
      "/data/trello-boards.json",
    );

    if (boardData.value) {
      columns.value = boardData.value;
    }
  }

  const statusesByColumn = computed(() => columns.value.map((column) => column.title));

  function createTask (payload: Task) {
    const columnIdx = columns.value.findIndex(
      (column) => column.title === payload.status
    );

    columns.value[columnIdx].tasks.push(payload);
  }

  function updateTask(payload: Task) {
    // Find the current column containing the task
    let currentColumn: Column | undefined;
    let taskIdx: number | undefined;
  
    for (const column of columns.value) {
      taskIdx = column.tasks.findIndex((task) => task.id === payload.id);
      if (taskIdx !== -1) {
        currentColumn = column;
        break;
      }
    }
  
    if (!currentColumn || taskIdx === undefined || taskIdx === -1) {
      console.warn(`Task with ID ${payload.id} not found.`);
      return;
    }
  
    // If the status has not changed, simply update the task
    if (currentColumn.title === payload.status) {
      currentColumn.tasks[taskIdx] = { ...currentColumn.tasks[taskIdx], ...payload };
      return;
    }
  
    // Delete a task from the current column
    const [task] = currentColumn.tasks.splice(taskIdx, 1);
  
    // Find a new column to move
    const newColumn = columns.value.find((column) => column.title === payload.status);
    if (!newColumn) {
      console.warn(`Column with status ${payload.status} not found.`);
      // Restore the task in the original column if a new one is not found
      currentColumn.tasks.splice(taskIdx, 0, task);
      return;
    }
  
    // Add task to a new column with updated data
    newColumn.tasks.push({ ...task, ...payload });
  }

  function deleteTask(taskId: string) {
    // Find the column containing the task
    const column = columns.value.find((column) =>
      column.tasks.some((task) => task.id === taskId)
    );
  
    if (!column) {
      console.warn(`Task with ID ${taskId} not found.`);
      return;
    }
  
    // Delete a task from the task array
    column.tasks = column.tasks.filter((task) => task.id !== taskId);
  }

  return {
    initialize,
    createTask,
    updateTask,
    deleteTask,
    columns,
    statusesByColumn
  };
});