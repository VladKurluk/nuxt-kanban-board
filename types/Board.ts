import type { Task } from "./Task";

export type Status = "TODO" | "In progress" | "Done";

export interface Column {
  id: string;
  title: Status;
  tasks: Task[];
};

