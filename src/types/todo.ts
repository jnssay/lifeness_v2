export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  dueDate: Date | null;
  notes?: string | null;
}
