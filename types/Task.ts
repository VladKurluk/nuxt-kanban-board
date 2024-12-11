import type { User } from "./Users";
export interface Task {
  id: string;
  title: string;
  description: string;
  responsiblePerson: User[];
  contractor: User | {};
  status: string;
  priority: string;
};