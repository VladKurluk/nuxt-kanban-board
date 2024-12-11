export interface Task {
  id: number | string;
  title: string;
  description: string;
  responsiblePerson: string;
  contractor: string;
  createdAt: Date;
  status: string;
  priority: string;
};