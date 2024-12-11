import { defineStore } from "pinia";
import { nanoid } from "nanoid";
import type { User } from "@/types";

export const useUsers = defineStore("users", () => {
  const users = ref<User[]>([
    {
      id: nanoid(),
      name: 'Firsrt Person',
    },
    {
      id: nanoid(),
      name: 'Second Person',
    },
    {
      id: nanoid(),
      name: 'Jhon Doe',
    },
    {
      id: nanoid(),
      name: 'Jane Lawson',
    },
    {
      id: nanoid(),
      name: 'Thomas Anderson',
    },
  ]);

  return {
    users
  };
});